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

private const int TableBufferMinutes = 60;

private sealed record TableConflict(int Id, string ReservedTime, List<string> TableIds);

private static List<string> NormalizeTableIds(IEnumerable<string>? tableIds)
{
    return (tableIds ?? Enumerable.Empty<string>())
        .Where(id => !string.IsNullOrWhiteSpace(id))
        .Select(id => id.Trim())
        .Distinct(StringComparer.OrdinalIgnoreCase)
        .ToList();
}

private static List<string> NormalizeTimes(IEnumerable<string>? times)
{
    return (times ?? Enumerable.Empty<string>())
        .Where(time => !string.IsNullOrWhiteSpace(time))
        .Select(time => time.Trim())
        .Distinct(StringComparer.OrdinalIgnoreCase)
        .ToList();
}

private async Task<TableConflict?> FindTableConflictAsync(
    DateOnly reservedDate,
    string reservedTime,
    List<string> tableIds,
    int? excludeReservationId = null)
{
    var candidates = await _db.Reservations
        .Include(x => x.Tables)
        .Where(x =>
            x.Status == "Approved" &&
            x.ReservedDate == reservedDate &&
            (!excludeReservationId.HasValue || x.Id != excludeReservationId.Value) &&
            x.Tables.Any(t => tableIds.Contains(t.TableCode)))
        .ToListAsync();

    if (!TimeOnly.TryParse(reservedTime, out var targetTime))
    {
        var sameTimeConflict = candidates.FirstOrDefault(x => x.ReservedTime == reservedTime);
        return sameTimeConflict == null
            ? null
            : new TableConflict(
                sameTimeConflict.Id,
                sameTimeConflict.ReservedTime,
                sameTimeConflict.Tables.Select(t => t.TableCode).ToList());
    }

    foreach (var candidate in candidates)
    {
        if (!TimeOnly.TryParse(candidate.ReservedTime, out var candidateTime))
            continue;

        var minutes = Math.Abs((candidateTime - targetTime).TotalMinutes);
        if (minutes < TableBufferMinutes)
        {
            return new TableConflict(
                candidate.Id,
                candidate.ReservedTime,
                candidate.Tables.Select(t => t.TableCode).ToList());
        }
    }

    return null;
}

private static object ConflictResponse(TableConflict conflict)
{
    return new
    {
        message = "One or more selected tables are reserved less than one hour from this time.",
        conflict.ReservedTime,
        conflict.TableIds
    };
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
                x.CreatedByAdmin,
                x.InternalNote,
                x.IsNoShow,
                x.IsBlacklisted,
                x.IsRegularCustomer,
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

        if (!request.CreatedByAdmin && string.IsNullOrWhiteSpace(request.Email))
            return BadRequest("Email is required.");

        if (request.GuestCount <= 0)
            return BadRequest("Invalid guests.");

        if (request.TableIds is null || request.TableIds.Count == 0)
            return BadRequest("At least one table must be selected.");

        var tableIds = NormalizeTableIds(request.TableIds);

        if (tableIds.Count == 0)
            return BadRequest("At least one valid table must be selected.");

        var conflict = await FindTableConflictAsync(request.ReservedDate, request.ReservedTime, tableIds);

        if (conflict != null)
        {
            return Conflict(ConflictResponse(conflict));
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
            CreatedByAdmin = request.CreatedByAdmin,
            InternalNote = request.InternalNote,
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

        var conflict = await FindTableConflictAsync(
            reservation.ReservedDate,
            reservation.ReservedTime,
            tableIds,
            id);

        if (conflict != null)
        {
            return Conflict(ConflictResponse(conflict));
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

    [HttpPatch("{id}/tables")]
    public async Task<IActionResult> UpdateTables(int id, [FromBody] UpdateReservationTablesRequest request)
    {
        var reservation = await _db.Reservations
            .Include(x => x.Tables)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (reservation == null)
            return NotFound();

        if (reservation.Status == "Cancelled")
            return BadRequest("Cancelled reservations cannot be moved.");

        var tableIds = NormalizeTableIds(request.TableIds);

        if (tableIds.Count == 0)
            return BadRequest("At least one valid table must be selected.");

        var conflict = await FindTableConflictAsync(
            reservation.ReservedDate,
            reservation.ReservedTime,
            tableIds,
            id);

        if (conflict != null)
            return Conflict(ConflictResponse(conflict));

        _db.ReservationTables.RemoveRange(reservation.Tables);
        reservation.Tables = tableIds.Select(tableId => new ReservationTable
        {
            TableCode = tableId,
            ReservationId = reservation.Id
        }).ToList();

        if (!string.IsNullOrWhiteSpace(request.Area))
            reservation.Area = request.Area.Trim();

        await _db.SaveChangesAsync();

        return Ok(new
        {
            reservation.Id,
            reservation.Area,
            TableIds = reservation.Tables.Select(t => t.TableCode).ToList()
        });
    }

    [HttpPost("block")]
    public async Task<IActionResult> BlockTables([FromBody] CreateHallBlockRequest request)
    {
        var tableIds = NormalizeTableIds(request.TableIds);
        var times = NormalizeTimes(request.Times);

        if (tableIds.Count == 0)
            return BadRequest("At least one table must be selected.");

        if (times.Count == 0)
            return BadRequest("At least one time must be selected.");

        foreach (var time in times)
        {
            var conflict = await FindTableConflictAsync(request.ReservedDate, time, tableIds);
            if (conflict != null)
                return Conflict(ConflictResponse(conflict));
        }

        var note = string.IsNullOrWhiteSpace(request.Note)
            ? "Admin block"
            : request.Note.Trim();

        var blocks = times.Select(time => new Reservation
        {
            GuestName = "Admin block",
            Phone = "admin",
            Email = string.Empty,
            GuestCount = 0,
            Area = string.IsNullOrWhiteSpace(request.Area) ? "all" : request.Area.Trim(),
            ReservedDate = request.ReservedDate,
            ReservedTime = time,
            Notes = note,
            InternalNote = "Hall/table block created from admin panel.",
            Status = "Approved",
            CreatedAtUtc = DateTime.UtcNow,
            CreatedByAdmin = true,
            Tables = tableIds.Select(tableId => new ReservationTable
            {
                TableCode = tableId
            }).ToList()
        }).ToList();

        _db.Reservations.AddRange(blocks);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            Created = blocks.Count,
            request.ReservedDate,
            Times = blocks.Select(x => x.ReservedTime).ToList(),
            TableIds = tableIds
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
