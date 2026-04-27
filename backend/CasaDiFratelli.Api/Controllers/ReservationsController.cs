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
                TableIds = x.Tables.Select(t => t.TableCode)
            })
            .ToListAsync();

        return Ok(blocked);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReservationRequest request)
    {
        if (request.GuestCount <= 0)
            return BadRequest("Invalid guests");

        var reservation = new Reservation
        {
            GuestName = request.GuestName,
            Phone = request.Phone,
            Email = request.Email,
            GuestCount = request.GuestCount,
            Area = request.Area,
            ReservedDate = request.ReservedDate,
            ReservedTime = request.ReservedTime,
            Notes = request.Notes,
            Status = "Pending",
            CreatedAtUtc = DateTime.UtcNow,
            Tables = request.TableIds.Select(id => new ReservationTable
            {
                TableCode = id
            }).ToList()
        };

        _db.Reservations.Add(reservation);
        await _db.SaveChangesAsync();

        return Ok(reservation);
    }

    [HttpPatch("{id}/approve")]
    public async Task<IActionResult> Approve(int id)
    {
        var r = await _db.Reservations.FindAsync(id);
        if (r == null) return NotFound();

        r.Status = "Approved";
        await _db.SaveChangesAsync();

        return Ok(r);
    }

    [HttpPatch("{id}/cancel")]
    public async Task<IActionResult> Cancel(int id)
    {
        var r = await _db.Reservations.FindAsync(id);
        if (r == null) return NotFound();

        r.Status = "Cancelled";
        await _db.SaveChangesAsync();

        return Ok(r);
    }
}