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
            .ToListAsync();

        return Ok(reservations);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReservationRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.GuestName))
            return BadRequest("Guest name is required.");

        if (string.IsNullOrWhiteSpace(request.Phone))
            return BadRequest("Phone is required.");

        if (request.GuestCount <= 0)
            return BadRequest("Guest count must be greater than zero.");

        if (request.TableIds is null || request.TableIds.Count == 0)
            return BadRequest("At least one table must be selected.");

        var normalizedTableIds = request.TableIds
    .Where(id => !string.IsNullOrWhiteSpace(id))
    .Select(id => id.Trim())
    .Distinct()
    .ToList();

if (normalizedTableIds.Count == 0)
    return BadRequest("At least one valid table must be selected.");

var conflictingReservationExists = await _db.Reservations
    .Include(x => x.Tables)
    .AnyAsync(x =>
        x.ReservedDate == request.ReservedDate &&
        x.ReservedTime == request.ReservedTime &&
        x.Status != "Cancelled" &&
        x.Tables.Any(t => normalizedTableIds.Contains(t.TableCode)));

if (conflictingReservationExists)
{
    return Conflict(new
    {
        message = "One or more selected tables are already reserved for this date and time."
    });
}    

        var reservation = new Reservation
        {
            GuestName = request.GuestName,
            Phone = request.Phone,
            Email = request.Email,
            GuestCount = request.GuestCount,
            Area = request.Area,
            ReservedTime = request.ReservedTime,
            ReservedDate = request.ReservedDate,
            Notes = request.Notes,
            Tables = normalizedTableIds
                .Select(id => new ReservationTable { TableCode = id })
                .ToList()
        };

        _db.Reservations.Add(reservation);
        await _db.SaveChangesAsync();

        return Ok(new { reservation.Id });
    }
}