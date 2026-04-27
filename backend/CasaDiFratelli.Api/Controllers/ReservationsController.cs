using CasaDiFratelli.Api.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace CasaDiFratelli.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservationsController : ControllerBase
{
    private static readonly List<object> Reservations = new();
    private static int _nextId = 1;

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(Reservations);
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateReservationRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.GuestName))
            return BadRequest("Guest name is required.");

        if (string.IsNullOrWhiteSpace(request.Phone))
            return BadRequest("Phone is required.");

        if (request.GuestCount <= 0)
            return BadRequest("Guest count must be greater than zero.");

        if (request.TableIds is null || request.TableIds.Count == 0)
            return BadRequest("At least one table must be selected.");

        var reservation = new
        {
            Id = _nextId++,
            request.GuestName,
            request.Phone,
            request.Email,
            request.GuestCount,
            request.Area,
            request.ReservedDate,
            request.ReservedTime,
            request.Notes,
            TableIds = request.TableIds,
            Status = "Pending",
            CreatedAtUtc = DateTime.UtcNow
        };

        Reservations.Add(reservation);

        return Ok(reservation);
    }

    [HttpPatch("{id}/approve")]
    public IActionResult Approve(int id)
    {
        return UpdateStatus(id, "Approved");
    }

    [HttpPatch("{id}/cancel")]
    public IActionResult Cancel(int id)
    {
        return UpdateStatus(id, "Cancelled");
    }

    private IActionResult UpdateStatus(int id, string status)
    {
        var oldReservation = Reservations.FirstOrDefault(x =>
            (int)x.GetType().GetProperty("Id")!.GetValue(x)! == id
        );

        if (oldReservation is null)
            return NotFound();

        Reservations.Remove(oldReservation);

        dynamic r = oldReservation;

        var updatedReservation = new
        {
            Id = r.Id,
            GuestName = r.GuestName,
            Phone = r.Phone,
            Email = r.Email,
            GuestCount = r.GuestCount,
            Area = r.Area,
            ReservedDate = r.ReservedDate,
            ReservedTime = r.ReservedTime,
            Notes = r.Notes,
            TableIds = r.TableIds,
            Status = status,
            CreatedAtUtc = r.CreatedAtUtc
        };

        Reservations.Add(updatedReservation);

        return Ok(updatedReservation);
    }
}