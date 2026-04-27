using CasaDiFratelli.Api.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace CasaDiFratelli.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservationsController : ControllerBase
{
    private static readonly List<ReservationItem> Reservations = new();
    private static int _nextId = 1;

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(Reservations.OrderByDescending(x => x.CreatedAtUtc));
    }

    [HttpGet("blocked-slots")]
    public IActionResult GetBlockedSlots()
    {
        var blocked = Reservations
            .Where(x => x.Status == "Approved")
            .Select(x => new
            {
                x.ReservedDate,
                x.ReservedTime,
                x.TableIds
            })
            .ToList();

        return Ok(blocked);
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateReservationRequest request)
    {
        var validationError = ValidateRequest(request);
        if (validationError is not null)
            return validationError;

        var normalizedTableIds = NormalizeTableIds(request.TableIds);

        if (HasApprovedConflict(request.ReservedDate, request.ReservedTime, normalizedTableIds))
        {
            return Conflict(new
            {
                message = "One or more selected tables are already approved for this date and time."
            });
        }

        var reservation = new ReservationItem
        {
            Id = _nextId++,
            GuestName = request.GuestName.Trim(),
            Phone = request.Phone.Trim(),
            Email = request.Email,
            GuestCount = request.GuestCount,
            Area = request.Area,
            ReservedDate = request.ReservedDate,
            ReservedTime = request.ReservedTime,
            Notes = request.Notes,
            TableIds = normalizedTableIds,
            Status = "Pending",
            CreatedAtUtc = DateTime.UtcNow
        };

        Reservations.Add(reservation);

        return Ok(reservation);
    }

    [HttpPatch("{id}/approve")]
    public IActionResult Approve(int id)
    {
        var reservation = Reservations.FirstOrDefault(x => x.Id == id);

        if (reservation is null)
            return NotFound();

        if (HasApprovedConflict(
                reservation.ReservedDate,
                reservation.ReservedTime,
                reservation.TableIds,
                reservation.Id))
        {
            return Conflict(new
            {
                message = "This table/time is already approved by another reservation."
            });
        }

        reservation.Status = "Approved";
        return Ok(reservation);
    }

    [HttpPatch("{id}/cancel")]
    public IActionResult Cancel(int id)
    {
        var reservation = Reservations.FirstOrDefault(x => x.Id == id);

        if (reservation is null)
            return NotFound();

        reservation.Status = "Cancelled";
        return Ok(reservation);
    }

    private static IActionResult? ValidateRequest(CreateReservationRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.GuestName))
            return new BadRequestObjectResult("Guest name is required.");

        if (string.IsNullOrWhiteSpace(request.Phone))
            return new BadRequestObjectResult("Phone is required.");

        if (request.GuestCount <= 0)
            return new BadRequestObjectResult("Guest count must be greater than zero.");

        if (request.ReservedDate == default)
            return new BadRequestObjectResult("Reservation date is required.");

        if (string.IsNullOrWhiteSpace(request.ReservedTime))
            return new BadRequestObjectResult("Reservation time is required.");

        if (request.TableIds is null || request.TableIds.Count == 0)
            return new BadRequestObjectResult("At least one table must be selected.");

        if (NormalizeTableIds(request.TableIds).Count == 0)
            return new BadRequestObjectResult("At least one valid table must be selected.");

        return null;
    }

    private static List<string> NormalizeTableIds(List<string> tableIds)
    {
        return tableIds
            .Where(id => !string.IsNullOrWhiteSpace(id))
            .Select(id => id.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

private static bool HasApprovedConflict(
    DateOnly reservedDate,
    string reservedTime,
    List<string> tableIds,
    int? excludeReservationId = null)
    {
        return Reservations.Any(x =>
            x.Status == "Approved" &&
            x.Id != excludeReservationId &&
            x.ReservedDate == reservedDate &&
            x.ReservedTime == reservedTime &&
            x.TableIds.Any(tableId =>
                tableIds.Contains(tableId, StringComparer.OrdinalIgnoreCase)));
    }

    private class ReservationItem
    {
        public int Id { get; set; }
        public string GuestName { get; set; } = "";
        public string Phone { get; set; } = "";
        public string? Email { get; set; }
        public int GuestCount { get; set; }
        public string? Area { get; set; }
        public DateOnly ReservedDate { get; set; }
        public string ReservedTime { get; set; } = "";
        public string? Notes { get; set; }
        public List<string> TableIds { get; set; } = new();
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAtUtc { get; set; }
    }
}