using CasaDiFratelli.Api.Data;
using CasaDiFratelli.Api.Dtos;
using CasaDiFratelli.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CasaDiFratelli.Api.Services;

namespace CasaDiFratelli.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservationsController : ControllerBase
{
private readonly AppDbContext _db;
private readonly EmailService _emailService;
private readonly IConfiguration _configuration;

public ReservationsController(
    AppDbContext db,
    EmailService emailService,
    IConfiguration configuration)
{
    _db = db;
    _emailService = emailService;
    _configuration = configuration;
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
                x.BirthDate,
                x.MarketingConsent,
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
            .Distinct(StringComparer.OrdinalIgnoreCase)
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
            GuestCount = request.GuestCount,
            Area = request.Area,
            ReservedDate = request.ReservedDate,
            ReservedTime = request.ReservedTime,
            BirthDate = request.BirthDate,
            MarketingConsent = request.MarketingConsent,
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

        var customer = await _db.CustomerProfiles.FirstOrDefaultAsync(x =>
    (!string.IsNullOrWhiteSpace(request.Email) && x.Email == request.Email)
    ||
    (!string.IsNullOrWhiteSpace(request.Phone) && x.Phone == request.Phone)
);

if (customer == null)
{
    customer = new CustomerProfile
    {
        GuestName = request.GuestName,
        Email = request.Email,
        Phone = request.Phone,
        BirthDate = request.BirthDate,
        MarketingConsent = request.MarketingConsent,
        ReservationCount = 1,
        FirstReservationAtUtc = DateTime.UtcNow,
        LastReservationAtUtc = DateTime.UtcNow
    };

    _db.CustomerProfiles.Add(customer);
}
else
{
    customer.ReservationCount += 1;
    customer.LastReservationAtUtc = DateTime.UtcNow;

    if (customer.ReservationCount >= 5)
    {
        customer.IsRegularCustomer = true;
        reservation.IsRegularCustomer = true;
    }
}

var isBlacklisted = await _db.BlacklistEntries.AnyAsync(x =>
    (!string.IsNullOrWhiteSpace(x.Email) && x.Email == request.Email)
    ||
    (!string.IsNullOrWhiteSpace(x.Phone) && x.Phone == request.Phone)
);

reservation.IsBlacklisted = isBlacklisted;

await _db.SaveChangesAsync();

        var adminEmail = _configuration["ADMIN_EMAIL"];
var adminUrl = _configuration["ADMIN_URL"] ?? "https://casa-di-fratelli.vercel.app/admin";

if (!string.IsNullOrWhiteSpace(adminEmail))
{
    await _emailService.SendAsync(
        adminEmail,
        $"Нова резервация: {reservation.GuestName} · {reservation.ReservedDate} {reservation.ReservedTime}",
        $"""
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937">
          <h2>Нова резервация в Casa di Fratelli</h2>
          <p><strong>Гост:</strong> {reservation.GuestName}</p>
          <p><strong>Телефон:</strong> {reservation.Phone}</p>
          <p><strong>Email:</strong> {reservation.Email}</p>
          <p><strong>Дата:</strong> {reservation.ReservedDate}</p>
          <p><strong>Час:</strong> {reservation.ReservedTime}</p>
          <p><strong>Маси:</strong> {string.Join(", ", reservation.Tables.Select(t => t.TableCode))}</p>
          <p><strong>Гости:</strong> {reservation.GuestCount}</p>
          <p><strong>Специални изисквания:</strong> {reservation.Notes}</p>
          <p>
            <a href="{adminUrl}" style="display:inline-block;background:#c9a56a;color:#111827;padding:12px 18px;border-radius:12px;text-decoration:none;font-weight:700">
              Отвори админ панела
            </a>
          </p>
        </div>
        """
    );
}

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
            reservation.BirthDate,
            reservation.MarketingConsent,
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

        if (!string.IsNullOrWhiteSpace(reservation.Email))
{
    await _emailService.SendAsync(
        reservation.Email,
        "Вашата резервация е потвърдена · Casa di Fratelli",
        $"""
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937">
          <h2>Вашата резервация е потвърдена</h2>
          <p>Здравейте, {reservation.GuestName},</p>
          <p>С радост потвърждаваме Вашата резервация в <strong>Casa di Fratelli</strong>.</p>
          <p><strong>Дата:</strong> {reservation.ReservedDate}</p>
          <p><strong>Час:</strong> {reservation.ReservedTime}</p>
          <p><strong>Маси:</strong> {string.Join(", ", reservation.Tables.Select(t => t.TableCode))}</p>
          <p>Очакваме Ви!</p>
          <p style="color:#6b7280">Ако закъснеете с повече от 15 минути, резервацията може да бъде освободена.</p>
        </div>
        """
    );
}

        return Ok(new
        {
            reservation.Id,
            reservation.Status
        });
    }

    [HttpPatch("{id}/cancel")]
    public async Task<IActionResult> Cancel(int id)
    {
        var reservation = await _db.Reservations
        .Include(x => x.Tables)
        .FirstOrDefaultAsync(x => x.Id == id);

        if (reservation == null)
            return NotFound();

        reservation.Status = "Cancelled";
        await _db.SaveChangesAsync();

        if (!string.IsNullOrWhiteSpace(reservation.Email))
{
    await _emailService.SendAsync(
        reservation.Email,
        "Вашата резервация е отменена · Casa di Fratelli",
        $"""
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937">
          <h2>Вашата резервация е отменена</h2>
          <p>Здравейте, {reservation.GuestName},</p>
          <p>Информираме Ви, че резервацията Ви в <strong>Casa di Fratelli</strong> беше отменена.</p>
          <p><strong>Дата:</strong> {reservation.ReservedDate}</p>
          <p><strong>Час:</strong> {reservation.ReservedTime}</p>
          <p>Ако желаете, можете да направите нова резервация през сайта.</p>
        </div>
        """
    );
}

        return Ok(new
        {
            reservation.Id,
            reservation.Status
        });
    }
}