using CasaDiFratelli.Api.Data;
using CasaDiFratelli.Api.Dtos;
using CasaDiFratelli.Api.Filters;
using CasaDiFratelli.Api.Models;
using CasaDiFratelli.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CasaDiFratelli.Api.Controllers;

[ApiController]
[Route("api/dining-orders")]
public class DiningOrdersController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly AuditService _audit;

    public DiningOrdersController(AppDbContext db, AuditService audit)
    {
        _db = db;
        _audit = audit;
    }

    private async Task RecalculateOrderTotalAsync(DiningOrder order)
    {
        if (order.Id == 0)
        {
            order.TotalPrice = order.Items.Sum(x => x.UnitPrice * x.Quantity);
            return;
        }

        order.TotalPrice = await _db.DiningOrderItems
            .Where(x => x.DiningOrderId == order.Id)
            .SumAsync(x => x.UnitPrice * x.Quantity);
    }

    private static void AddOrIncreaseItem(DiningOrder order, CreateDiningOrderItemRequest request)
    {
        var name = request.Name.Trim();
        var quantity = Math.Min(request.Quantity, 99);
        var notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim();
        var existingItem = order.Items.FirstOrDefault(x =>
            x.MenuItemId == request.MenuItemId &&
            x.Name.Equals(name, StringComparison.OrdinalIgnoreCase) &&
            x.UnitPrice == request.UnitPrice &&
            x.Notes == notes);

        if (existingItem == null)
        {
            order.Items.Add(new DiningOrderItem
            {
                MenuItemId = request.MenuItemId,
                Name = name,
                UnitPrice = request.UnitPrice,
                Quantity = quantity,
                Notes = notes
            });
        }
        else
        {
            existingItem.Quantity = Math.Min(existingItem.Quantity + quantity, 99);
        }

        order.TotalPrice = order.Items.Sum(x => x.UnitPrice * x.Quantity);
    }

    [HttpGet]
    [AdminAuthorize]
    public async Task<IActionResult> GetAll()
    {
        var orders = await _db.DiningOrders
            .Include(x => x.Items)
            .Include(x => x.Reservation)
                .ThenInclude(x => x!.Tables)
            .OrderByDescending(x => x.CreatedAtUtc)
            .Select(x => new
            {
                x.Id,
                x.ReservationId,
                x.GuestName,
                x.TableLabel,
                x.Status,
                x.TotalPrice,
                x.Notes,
                x.CreatedAtUtc,
                Reservation = x.Reservation == null ? null : new
                {
                    x.Reservation.Phone,
                    x.Reservation.Email,
                    x.Reservation.ReservedDate,
                    x.Reservation.ReservedTime,
                    TableIds = x.Reservation.Tables.Select(t => t.TableCode).ToList()
                },
                Items = x.Items.Select(item => new
                {
                    item.Id,
                    item.MenuItemId,
                    item.Name,
                    item.UnitPrice,
                    item.Quantity,
                    item.Notes
                }).ToList()
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpGet("reservation/{reservationId:int}")]
    [AdminAuthorize]
    public async Task<IActionResult> GetForReservation(int reservationId)
    {
        var orders = await _db.DiningOrders
            .Include(x => x.Items)
            .Include(x => x.Reservation)
                .ThenInclude(x => x!.Tables)
            .Where(x => x.ReservationId == reservationId && x.Status != "Cancelled")
            .OrderBy(x => x.CreatedAtUtc)
            .ToListAsync();

        return Ok(orders.Select(x => new
        {
            x.Id,
            x.ReservationId,
            x.GuestName,
            TableLabel = x.Reservation == null ? x.TableLabel : string.Join(", ", x.Reservation.Tables.Select(t => t.TableCode)),
            x.Status,
            x.TotalPrice,
            x.Notes,
            x.CreatedAtUtc,
            Items = x.Items.Select(item => new
            {
                item.Id,
                item.MenuItemId,
                item.Name,
                item.UnitPrice,
                item.Quantity,
                item.Notes
            }).ToList()
        }));
    }

    [HttpGet("session")]
    public async Task<IActionResult> GetSession([FromQuery] int reservationId, [FromQuery] string token)
    {
        var reservation = await _db.Reservations
            .Include(x => x.Tables)
            .FirstOrDefaultAsync(x => x.Id == reservationId && x.OrderAccessToken == token);

        if (reservation == null)
            return NotFound(new { message = "Order session was not found." });

        if (!reservation.IsArrived || reservation.Status == "Cancelled")
            return BadRequest(new { message = "This order link is not active." });

        return Ok(new
        {
            reservation.Id,
            reservation.GuestName,
            reservation.ReservedDate,
            reservation.ReservedTime,
            TableIds = reservation.Tables.Select(t => t.TableCode).ToList()
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDiningOrderRequest request)
    {
        if (request.Items.Count == 0)
            return BadRequest(new { message = "Order must contain at least one item." });

        var reservation = await _db.Reservations
            .Include(x => x.Tables)
            .FirstOrDefaultAsync(x => x.Id == request.ReservationId && x.OrderAccessToken == request.Token);

        if (reservation == null)
            return NotFound(new { message = "Order session was not found." });

        if (!reservation.IsArrived || reservation.Status == "Cancelled")
            return BadRequest(new { message = "This order link is not active." });

        var items = request.Items
            .Where(x => x.Quantity > 0 && !string.IsNullOrWhiteSpace(x.Name) && x.UnitPrice >= 0)
            .Select(x => new DiningOrderItem
            {
                MenuItemId = x.MenuItemId,
                Name = x.Name.Trim(),
                UnitPrice = x.UnitPrice,
                Quantity = Math.Min(x.Quantity, 99),
                Notes = string.IsNullOrWhiteSpace(x.Notes) ? null : x.Notes.Trim()
            })
            .ToList();

        if (items.Count == 0)
            return BadRequest(new { message = "Order must contain valid items." });

        var order = new DiningOrder
        {
            ReservationId = reservation.Id,
            GuestName = reservation.GuestName,
            TableLabel = string.Join(", ", reservation.Tables.Select(t => t.TableCode)),
            Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            TotalPrice = items.Sum(x => x.UnitPrice * x.Quantity),
            CreatedAtUtc = DateTime.UtcNow,
            Items = items
        };

        _db.DiningOrders.Add(order);
        await _db.SaveChangesAsync();
        await _audit.RecordAsync(HttpContext, "create", "DiningOrder", order.Id.ToString(), after: new { order.Id, order.ReservationId, order.TableLabel, order.TotalPrice });

        return Ok(new
        {
            order.Id,
            order.Status,
            order.TotalPrice
        });
    }

    [HttpPost("reservations/{reservationId:int}/items")]
    [AdminAuthorize]
    public async Task<IActionResult> AddReservationItem(int reservationId, [FromBody] CreateDiningOrderItemRequest request)
    {
        if (request.Quantity <= 0 || string.IsNullOrWhiteSpace(request.Name) || request.UnitPrice < 0)
            return BadRequest(new { message = "Order item is required." });

        var reservation = await _db.Reservations
            .Include(x => x.Tables)
            .FirstOrDefaultAsync(x => x.Id == reservationId);

        if (reservation == null)
            return NotFound();

        var order = await _db.DiningOrders
            .Include(x => x.Items)
            .Where(x => x.ReservationId == reservationId && x.Status != "Cancelled")
            .OrderBy(x => x.CreatedAtUtc)
            .FirstOrDefaultAsync();

        if (order == null)
        {
            order = new DiningOrder
            {
                ReservationId = reservation.Id,
                GuestName = reservation.GuestName,
                TableLabel = string.Join(", ", reservation.Tables.Select(t => t.TableCode)),
                Status = "New",
                CreatedAtUtc = DateTime.UtcNow
            };
            _db.DiningOrders.Add(order);
        }

        AddOrIncreaseItem(order, request);
        await _db.SaveChangesAsync();
        await _audit.RecordAsync(HttpContext, "add-item", "DiningOrder", order.Id.ToString(), after: new { order.Id, order.ReservationId, order.TotalPrice });

        return Ok(new { order.Id, order.TotalPrice });
    }

    [HttpPost("{orderId:int}/items")]
    [AdminAuthorize]
    public async Task<IActionResult> AddOrderItem(int orderId, [FromBody] CreateDiningOrderItemRequest request)
    {
        if (request.Quantity <= 0 || string.IsNullOrWhiteSpace(request.Name) || request.UnitPrice < 0)
            return BadRequest(new { message = "Order item is required." });

        var order = await _db.DiningOrders
            .Include(x => x.Items)
            .FirstOrDefaultAsync(x => x.Id == orderId && x.Status != "Cancelled");

        if (order == null)
            return NotFound();

        AddOrIncreaseItem(order, request);
        await _db.SaveChangesAsync();
        await _audit.RecordAsync(HttpContext, "add-item", "DiningOrder", order.Id.ToString(), after: new { order.Id, order.ReservationId, order.TotalPrice });

        return Ok(new { order.Id, order.TotalPrice });
    }

    [HttpPatch("items/{itemId:int}")]
    [HttpPatch("{orderId:int}/items/{itemId:int}")]
    [AdminAuthorize]
    public async Task<IActionResult> UpdateItemQuantity(int itemId, [FromBody] UpdateDiningOrderItemRequest request, int? orderId = null)
    {
        var item = await _db.DiningOrderItems.FirstOrDefaultAsync(x =>
            x.Id == itemId &&
            (!orderId.HasValue || x.DiningOrderId == orderId.Value));

        if (item == null)
            return NotFound();

        var parentOrderId = item.DiningOrderId;
        var order = await _db.DiningOrders.FirstOrDefaultAsync(x => x.Id == parentOrderId);

        if (order == null)
            return NotFound();

        if (request.Quantity <= 0)
        {
            _db.DiningOrderItems.Remove(item);
        }
        else
        {
            item.Quantity = Math.Min(request.Quantity, 99);
        }

        await _db.SaveChangesAsync();

        await RecalculateOrderTotalAsync(order);

        await _db.SaveChangesAsync();
        await _audit.RecordAsync(HttpContext, "update-item", "DiningOrder", order.Id.ToString(), after: new { order.Id, order.TotalPrice });

        return Ok(new { order.Id, order.TotalPrice });
    }

    [HttpPatch("{id}/status")]
    [AdminAuthorize]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateDiningOrderStatusRequest request)
    {
        var order = await _db.DiningOrders.FindAsync(id);

        if (order == null)
            return NotFound();

        var nextStatus = string.IsNullOrWhiteSpace(request.Status) ? "New" : request.Status.Trim();
        if (!new[] { "New", "Seen", "Preparing", "Done", "Cancelled" }.Contains(nextStatus))
            return BadRequest(new { message = "Invalid order status." });

        var previousStatus = order.Status;
        order.Status = nextStatus;
        await _db.SaveChangesAsync();
        await _audit.RecordAsync(HttpContext, "update-status", "DiningOrder", order.Id.ToString(), new { Status = previousStatus }, new { order.Status });

        return Ok(new { order.Id, order.Status });
    }
}

public class UpdateDiningOrderStatusRequest
{
    public string Status { get; set; } = "Seen";
}

public class UpdateDiningOrderItemRequest
{
    public int Quantity { get; set; }
}
