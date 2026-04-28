using CasaDiFratelli.Api.Data;
using CasaDiFratelli.Api.Dtos;
using CasaDiFratelli.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CasaDiFratelli.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservationsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ReservationsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var reservations = await _db.Reservations
            .Include(x => x.Tables)
            .OrderByDescending(x => x.CreatedAtUtc)
            .Select(x => new
            {
                x.Id,
                x.GuestName,
                x.Phone,
                x.Email,
                x.GuestCount,
                x.Area,
                x.ReservedDate,
                x.ReservedTime,
                x.Notes,
                x.Status,
                x.CreatedAtUtc,
                TableIds = x.Tables.Select(t => t.TableCode).ToList()
            })
            .ToListAsync();

        return Ok(reservations);
    }

    [HttpGet("blocked-slots")]
    public async Task<IActionResult> GetBlockedSlots()
    {
        var blocked = await _db.Reservations
            .Include(x => x.Tables)
            .Where(x => x.Status == "Approved")
            .Select(x => new
            {
                x.ReservedDate,
                x.ReservedTime,
                x.BirthDate,
                x.MarketingConsent,
                TableIds = x.Tables.Select(t => t.TableCode).ToList()
            })
            .ToListAsync();

        return Ok(blocked);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReservationRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.GuestName))
            return BadRequest("Guest name is required.");

        if (string.IsNullOrWhiteSpace(request.Phone))
            return BadRequest("Phone is required.");

        if (string.IsNullOrWhiteSpace(request.Email))
            return BadRequest("Email is required.");    

        if (request.GuestCount <= 0)
            return BadRequest("Invalid guests.");

        if (request.TableIds is null || request.TableIds.Count == 0)
            return BadRequest("At least one table must be selected.");

        var tableIds = request.TableIds
            .Where(id => !string.IsNullOrWhiteSpace(id))
            .Select(id => id.Trim())
            .Distinct()
            .ToList();

        if (tableIds.Count == 0)
            return BadRequest("At least one valid table must be selected.");

        var hasConflict = await _db.Reservations
            .Include(x => x.Tables)
            .AnyAsync(x =>
                x.Status == "Approved" &&
                x.ReservedDate == request.ReservedDate &&
                x.ReservedTime == request.ReservedTime &&
                x.Tables.Any(t => tableIds.Contains(t.TableCode)));

        if (hasConflict)
        {
            return Conflict(new
            {
                message = "One or more selected tables are already approved for this date and time."
            });
        }

        var reservation = new Reservation
        {
            GuestName = request.GuestName.Trim(),
            Phone = request.Phone.Trim(),
            Email = request.Email.Trim(),
            BirthDate = request.BirthDate,
            MarketingConsent = request.MarketingConsent,
            GuestCount = request.GuestCount,
            Area = request.Area,
            ReservedDate = request.ReservedDate,
            ReservedTime = request.ReservedTime,
            Notes = request.Notes,
            Status = "Pending",
            CreatedAtUtc = DateTime.UtcNow,
            Tables = tableIds.Select(id => new ReservationTable
            {
                TableCode = id
            }).ToList()
        };

        _db.Reservations.Add(reservation);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            reservation.Id,
            reservation.GuestName,
            reservation.Phone,
            reservation.Email,
            reservation.GuestCount,
            reservation.Area,
            reservation.ReservedDate,
            reservation.ReservedTime,
            reservation.Notes,
            reservation.Status,
            reservation.CreatedAtUtc,
            TableIds = reservation.Tables.Select(t => t.TableCode).ToList()
        });
    }

    [HttpPatch("{id}/approve")]
    public async Task<IActionResult> Approve(int id)
    {
        var reservation = await _db.Reservations
            .Include(x => x.Tables)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (reservation == null)
            return NotFound();

        var tableIds = reservation.Tables.Select(t => t.TableCode).ToList();

        var hasConflict = await _db.Reservations
            .Include(x => x.Tables)
            .AnyAsync(x =>
                x.Id != id &&
                x.Status == "Approved" &&
                x.ReservedDate == reservation.ReservedDate &&
                x.ReservedTime == reservation.ReservedTime &&
                x.Tables.Any(t => tableIds.Contains(t.TableCode)));

        if (hasConflict)
        {
            return Conflict(new
            {
                message = "This table/time is already approved by another reservation."
            });
        }

        reservation.Status = "Approved";
        await _db.SaveChangesAsync();

        return Ok(new
        {
            reservation.Id,
            reservation.Status
        });
    }

    [HttpPatch("{id}/cancel")]
    public async Task<IActionResult> Cancel(int id)
    {
        var reservation = await _db.Reservations.FindAsync(id);

        if (reservation == null)
            return NotFound();

        reservation.Status = "Cancelled";
        await _db.SaveChangesAsync();

        return Ok(new
        {
            reservation.Id,
            reservation.Status
        });
    }
}