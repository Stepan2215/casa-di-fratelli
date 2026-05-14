using CasaDiFratelli.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace CasaDiFratelli.Api.Services;

public sealed record TableConflict(int Id, string ReservedTime, List<string> TableIds);

public class ReservationConflictService
{
    private const int TableBufferMinutes = 60;
    private readonly AppDbContext _db;

    public ReservationConflictService(AppDbContext db)
    {
        _db = db;
    }

    public static List<string> NormalizeTableIds(IEnumerable<string>? tableIds)
    {
        return (tableIds ?? Enumerable.Empty<string>())
            .Where(id => !string.IsNullOrWhiteSpace(id))
            .Select(id => id.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    public static List<string> NormalizeTimes(IEnumerable<string>? times)
    {
        return (times ?? Enumerable.Empty<string>())
            .Where(time => !string.IsNullOrWhiteSpace(time))
            .Select(time => time.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    public static object ToConflictResponse(TableConflict conflict)
    {
        return new
        {
            message = "One or more selected tables are reserved less than one hour from this time.",
            conflict.ReservedTime,
            conflict.TableIds
        };
    }

    public async Task<TableConflict?> FindTableConflictAsync(
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
}
