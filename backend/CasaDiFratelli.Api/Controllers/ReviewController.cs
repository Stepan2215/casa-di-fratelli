using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using CasaDiFratelli.Api.Data;
using CasaDiFratelli.Api.Filters;
using CasaDiFratelli.Api.Models;
using CasaDiFratelli.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CasaDiFratelli.Api.Controllers;

[ApiController]
[Route("api/review")]
public class ReviewController : ControllerBase
{
    private const string DefaultGoogleReviewUrl = "https://www.google.com/search?q=Casa+di+Fratelli+Plovdiv+reviews";
    private readonly AppDbContext _db;
    private readonly IConfiguration _configuration;
    private readonly AuditService _audit;
    private readonly ReviewAttributionService _attribution;

    public ReviewController(
        AppDbContext db,
        IConfiguration configuration,
        AuditService audit,
        ReviewAttributionService attribution)
    {
        _db = db;
        _configuration = configuration;
        _audit = audit;
        _attribution = attribution;
    }

    [HttpPost("{slug}/click")]
    public async Task<IActionResult> TrackClick(string slug)
    {
        var waiter = await _db.Waiters.FirstOrDefaultAsync(x => x.Slug == slug && x.IsActive);
        var configuredGoogleUrl = await GetSettingAsync("GoogleReviewUrl");
        var googleUrl = string.IsNullOrWhiteSpace(configuredGoogleUrl) ? DefaultGoogleReviewUrl : configuredGoogleUrl;

        if (waiter == null)
        {
            return Ok(new
            {
                googleReviewUrl = googleUrl,
                waiterName = "",
                tracked = false
            });
        }

        _db.ReviewClicks.Add(new ReviewClick
        {
            WaiterId = waiter.Id,
            IpHash = HashIp(GetClientIp()),
            UserAgent = Truncate(Request.Headers.UserAgent.ToString(), 600),
            Referrer = Truncate(Request.Headers.Referer.ToString(), 600),
            ClickedAtUtc = DateTime.UtcNow,
            RedirectedToGoogle = true
        });
        await _db.SaveChangesAsync();

        return Ok(new
        {
            googleReviewUrl = googleUrl,
            waiterName = waiter.Name,
            tracked = true
        });
    }

    [HttpGet("admin")]
    [AdminAuthorize]
    public async Task<IActionResult> AdminDashboard()
    {
        var now = DateTime.UtcNow;
        var today = now.Date;
        var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var dayAgo = now.AddHours(-24);
        var settings = await ReadSettingsAsync();
        var waiters = await _db.Waiters
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .ToListAsync();
        var clicks = await _db.ReviewClicks
            .AsNoTracking()
            .Where(x => x.WaiterId != null)
            .ToListAsync();
        var attributions = await _db.GoogleReviewSnapshots
            .AsNoTracking()
            .Include(x => x.AttributedWaiter)
            .OrderByDescending(x => x.ReviewTimeUtc)
            .Take(30)
            .Select(x => new
            {
                x.Id,
                x.GoogleReviewId,
                x.AuthorName,
                x.Rating,
                x.Text,
                x.ReviewTimeUtc,
                AttributedWaiterId = x.AttributedWaiterId,
                AttributedWaiterName = x.AttributedWaiter != null ? x.AttributedWaiter.Name : "",
                x.ConfidenceScore,
                x.AttributionNote
            })
            .ToListAsync();

        var rows = waiters.Select(waiter =>
        {
            var waiterClicks = clicks.Where(x => x.WaiterId == waiter.Id).ToList();
            var total = waiterClicks.Count;
            var todayCount = waiterClicks.Count(x => x.ClickedAtUtc >= today);
            var monthCount = waiterClicks.Count(x => x.ClickedAtUtc >= monthStart);
            var unique24 = waiterClicks
                .Where(x => x.ClickedAtUtc >= dayAgo)
                .GroupBy(x => x.IpHash)
                .Count();
            var attributed = attributions.Count(x => x.AttributedWaiterId == waiter.Id);
            var conversionRate = total == 0 ? 0 : Math.Round((decimal)attributed / total * 100m, 2);
            var efficiency = total == 0 ? 0 : Math.Round(((decimal)unique24 * 2 + attributed * 5 + monthCount * 0.25m), 2);

            return new
            {
                waiter.Id,
                waiter.Name,
                waiter.Slug,
                waiter.IsActive,
                waiter.CreatedAtUtc,
                ReviewLink = $"/review/{waiter.Slug}",
                TotalScans = total,
                TodayScans = todayCount,
                MonthScans = monthCount,
                UniqueScans24h = unique24,
                AttributedReviews = attributed,
                ConversionRate = conversionRate,
                EfficiencyScore = efficiency
            };
        });

        return Ok(new
        {
            Settings = new
            {
                GoogleReviewUrl = string.IsNullOrWhiteSpace(settings.GetValueOrDefault("GoogleReviewUrl"))
                    ? DefaultGoogleReviewUrl
                    : settings.GetValueOrDefault("GoogleReviewUrl"),
                GooglePlaceId = settings.GetValueOrDefault("GooglePlaceId") ?? "",
                HasGooglePlacesApiKey = !string.IsNullOrWhiteSpace(settings.GetValueOrDefault("GooglePlacesApiKey"))
            },
            Waiters = rows,
            Attributions = attributions,
            Disclaimer = "Attribution is probabilistic. QR scans prove a transition to Google, not a guaranteed published review."
        });
    }

    [HttpPost("admin/waiters")]
    [AdminAuthorize]
    public async Task<IActionResult> CreateWaiter([FromBody] WaiterRequest request)
    {
        var waiter = new Waiter
        {
            Name = request.Name.Trim(),
            Slug = await BuildUniqueSlugAsync(request.Slug, request.Name),
            IsActive = request.IsActive,
            CreatedAtUtc = DateTime.UtcNow
        };

        _db.Waiters.Add(waiter);
        await _db.SaveChangesAsync();
        await _audit.RecordAsync(HttpContext, "create", "Waiter", waiter.Id.ToString(), after: waiter);

        return Ok(waiter);
    }

    [HttpPut("admin/waiters/{id:int}")]
    [AdminAuthorize]
    public async Task<IActionResult> UpdateWaiter(int id, [FromBody] WaiterRequest request)
    {
        var waiter = await _db.Waiters.FirstOrDefaultAsync(x => x.Id == id);
        if (waiter == null) return NotFound();

        var before = new { waiter.Name, waiter.Slug, waiter.IsActive };
        waiter.Name = request.Name.Trim();
        waiter.Slug = await BuildUniqueSlugAsync(request.Slug, request.Name, id);
        waiter.IsActive = request.IsActive;
        await _db.SaveChangesAsync();
        await _audit.RecordAsync(HttpContext, "update", "Waiter", waiter.Id.ToString(), before, waiter);

        return Ok(waiter);
    }

    [HttpPut("admin/settings")]
    [AdminAuthorize]
    public async Task<IActionResult> SaveSettings([FromBody] ReviewSettingsRequest request)
    {
        await SetSettingAsync("GoogleReviewUrl", request.GoogleReviewUrl);
        await SetSettingAsync("GooglePlaceId", request.GooglePlaceId);
        if (!string.IsNullOrWhiteSpace(request.GooglePlacesApiKey))
            await SetSettingAsync("GooglePlacesApiKey", request.GooglePlacesApiKey);

        await _db.SaveChangesAsync();
        await _audit.RecordAsync(HttpContext, "update", "ReviewSettings", "restaurant", after: new
        {
            request.GoogleReviewUrl,
            request.GooglePlaceId,
            HasGooglePlacesApiKey = !string.IsNullOrWhiteSpace(request.GooglePlacesApiKey)
        });

        return Ok(new { saved = true });
    }

    [HttpPost("admin/sync-attribution")]
    [AdminAuthorize]
    public async Task<IActionResult> SyncAttribution()
    {
        var created = await _attribution.SyncAsync(HttpContext.RequestAborted);
        return Ok(new { created });
    }

    private async Task<Dictionary<string, string>> ReadSettingsAsync()
    {
        return await _db.RestaurantSettings
            .AsNoTracking()
            .ToDictionaryAsync(x => x.Key, x => x.Value);
    }

    private async Task<string?> GetSettingAsync(string key)
    {
        return await _db.RestaurantSettings
            .Where(x => x.Key == key)
            .Select(x => x.Value)
            .FirstOrDefaultAsync();
    }

    private async Task SetSettingAsync(string key, string? value)
    {
        var setting = await _db.RestaurantSettings.FirstOrDefaultAsync(x => x.Key == key);
        if (setting == null)
        {
            _db.RestaurantSettings.Add(new RestaurantSetting
            {
                Key = key,
                Value = value?.Trim() ?? "",
                UpdatedAtUtc = DateTime.UtcNow
            });
            return;
        }

        setting.Value = value?.Trim() ?? "";
        setting.UpdatedAtUtc = DateTime.UtcNow;
    }

    private async Task<string> BuildUniqueSlugAsync(string? requestedSlug, string name, int? currentId = null)
    {
        var baseSlug = Slugify(string.IsNullOrWhiteSpace(requestedSlug) ? name : requestedSlug);
        var slug = baseSlug;
        var index = 2;

        while (await _db.Waiters.AnyAsync(x => x.Slug == slug && (!currentId.HasValue || x.Id != currentId.Value)))
        {
            slug = $"{baseSlug}-{index}";
            index += 1;
        }

        return slug;
    }

    private string HashIp(string ip)
    {
        var salt = _configuration["ReviewTracking:IpHashSalt"] ?? _configuration["ADMIN_DEFAULT_PASSWORD"] ?? "casa-di-fratelli-review-salt";
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes($"{salt}:{ip}"));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }

    private string GetClientIp()
    {
        var forwarded = Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(forwarded))
            return forwarded.Split(',')[0].Trim();

        return HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }

    private static string Slugify(string value)
    {
        var normalized = Regex.Replace(value.Trim().ToLowerInvariant(), @"[^a-z0-9]+", "-").Trim('-');
        return string.IsNullOrWhiteSpace(normalized) ? $"waiter-{DateTime.UtcNow:yyyyMMddHHmmss}" : normalized;
    }

    private static string? Truncate(string? value, int maxLength)
    {
        if (string.IsNullOrWhiteSpace(value)) return null;
        return value.Length <= maxLength ? value : value[..maxLength];
    }
}

public class WaiterRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public bool IsActive { get; set; } = true;
}

public class ReviewSettingsRequest
{
    public string? GoogleReviewUrl { get; set; }
    public string? GooglePlaceId { get; set; }
    public string? GooglePlacesApiKey { get; set; }
}
