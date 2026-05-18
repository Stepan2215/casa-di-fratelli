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
