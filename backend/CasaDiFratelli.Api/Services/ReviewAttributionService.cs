using System.Text.Json;
using CasaDiFratelli.Api.Data;
using CasaDiFratelli.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CasaDiFratelli.Api.Services;

public sealed record ExternalGoogleReview(
    string ReviewId,
    string? AuthorName,
    int? Rating,
    string? Text,
    DateTime ReviewTimeUtc);

public class ReviewAttributionService
{
    private readonly AppDbContext _db;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<ReviewAttributionService> _logger;

    public ReviewAttributionService(
        AppDbContext db,
        IHttpClientFactory httpClientFactory,
        ILogger<ReviewAttributionService> logger)
    {
        _db = db;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task<int> SyncAsync(CancellationToken cancellationToken = default)
    {
        var settings = await _db.RestaurantSettings
            .AsNoTracking()
            .ToDictionaryAsync(x => x.Key, x => x.Value, cancellationToken);

        var reviews = await FetchGoogleReviewsAsync(settings, cancellationToken);
        var created = 0;

        foreach (var review in reviews)
        {
            if (string.IsNullOrWhiteSpace(review.ReviewId)) continue;

            var exists = await _db.GoogleReviewSnapshots
                .AnyAsync(x => x.GoogleReviewId == review.ReviewId, cancellationToken);
            if (exists) continue;

            var attribution = await BuildAttributionAsync(review.ReviewTimeUtc, cancellationToken);

            _db.GoogleReviewSnapshots.Add(new GoogleReviewSnapshot
            {
                GoogleReviewId = review.ReviewId,
                AuthorName = review.AuthorName,
                Rating = review.Rating,
                Text = review.Text,
                ReviewTimeUtc = review.ReviewTimeUtc,
                AttributedWaiterId = attribution.WaiterId,
                ConfidenceScore = attribution.ConfidenceScore,
                AttributionNote = attribution.Note,
                CreatedAtUtc = DateTime.UtcNow
            });
            created += 1;
        }

        if (created > 0)
            await _db.SaveChangesAsync(cancellationToken);

        return created;
    }

    private async Task<List<ExternalGoogleReview>> FetchGoogleReviewsAsync(
        IReadOnlyDictionary<string, string> settings,
        CancellationToken cancellationToken)
    {
        settings.TryGetValue("GooglePlaceId", out var placeId);
        settings.TryGetValue("GooglePlacesApiKey", out var apiKey);

        if (string.IsNullOrWhiteSpace(placeId) || string.IsNullOrWhiteSpace(apiKey))
            return new List<ExternalGoogleReview>();

        try
        {
            var client = _httpClientFactory.CreateClient();
            using var request = new HttpRequestMessage(HttpMethod.Get, $"https://places.googleapis.com/v1/places/{Uri.EscapeDataString(placeId)}");
            request.Headers.Add("X-Goog-Api-Key", apiKey);
            request.Headers.Add("X-Goog-FieldMask", "reviews");

            using var response = await client.SendAsync(request, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Google reviews sync returned {StatusCode}", response.StatusCode);
                return new List<ExternalGoogleReview>();
            }

            await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
            using var document = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);
            if (!document.RootElement.TryGetProperty("reviews", out var reviews) || reviews.ValueKind != JsonValueKind.Array)
                return new List<ExternalGoogleReview>();

            var result = new List<ExternalGoogleReview>();
            foreach (var item in reviews.EnumerateArray())
            {
                var id = ReadString(item, "name") ?? ReadString(item, "relativePublishTimeDescription");
                var publishTime = ReadString(item, "publishTime");
                if (!DateTime.TryParse(publishTime, out var parsedTime))
                    continue;

                var authorName = item.TryGetProperty("authorAttribution", out var author)
                    ? ReadString(author, "displayName")
                    : null;
                var text = item.TryGetProperty("text", out var textElement)
                    ? ReadString(textElement, "text")
                    : null;
                var rating = item.TryGetProperty("rating", out var ratingElement) && ratingElement.TryGetInt32(out var ratingValue)
                    ? ratingValue
                    : null as int?;

                result.Add(new ExternalGoogleReview(
                    id ?? $"{authorName}-{parsedTime:O}",
                    authorName,
                    rating,
                    text,
                    parsedTime.ToUniversalTime()));
            }

            return result;
        }
        catch (Exception error)
        {
            _logger.LogWarning(error, "Google reviews sync failed.");
            return new List<ExternalGoogleReview>();
        }
    }

    private async Task<(int? WaiterId, decimal? ConfidenceScore, string? Note)> BuildAttributionAsync(
        DateTime reviewTimeUtc,
        CancellationToken cancellationToken)
    {
        var windowStart = reviewTimeUtc.AddHours(-48);
        var scans = await _db.ReviewClicks
            .Where(x => x.WaiterId != null && x.RedirectedToGoogle && x.ClickedAtUtc <= reviewTimeUtc && x.ClickedAtUtc >= windowStart)
            .OrderByDescending(x => x.ClickedAtUtc)
            .ToListAsync(cancellationToken);

        if (scans.Count == 0)
            return (null, null, "No recent QR scan found.");

        var uniqueSessions = scans
            .GroupBy(x => new { x.WaiterId, x.IpHash })
            .Select(group => group.OrderByDescending(x => x.ClickedAtUtc).First())
            .OrderBy(x => Math.Abs((reviewTimeUtc - x.ClickedAtUtc).TotalMinutes))
            .ToList();

        var winner = uniqueSessions.First();
        var minutesDistance = Math.Abs((reviewTimeUtc - winner.ClickedAtUtc).TotalMinutes);
        var waiterActivity = uniqueSessions.Count(x => x.WaiterId == winner.WaiterId);
        var confidence = Math.Clamp(95m - (decimal)(minutesDistance / 18.0) + Math.Min(waiterActivity, 5) * 2m, 35m, 95m);

        return (
            winner.WaiterId,
            Math.Round(confidence, 2),
            $"Likely attribution by closest QR scan. Distance: {Math.Round(minutesDistance)} minutes. Not 100% exact.");
    }

    private static string? ReadString(JsonElement element, string property)
    {
        return element.TryGetProperty(property, out var value) && value.ValueKind == JsonValueKind.String
            ? value.GetString()
            : null;
    }
}

public class ReviewAttributionHostedService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<ReviewAttributionHostedService> _logger;

    public ReviewAttributionHostedService(
        IServiceScopeFactory scopeFactory,
        ILogger<ReviewAttributionHostedService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await using var scope = _scopeFactory.CreateAsyncScope();
                await scope.ServiceProvider.GetRequiredService<ReviewAttributionService>().SyncAsync(stoppingToken);
            }
            catch (Exception error)
            {
                _logger.LogWarning(error, "Review attribution background sync failed.");
            }

            await Task.Delay(TimeSpan.FromMinutes(10), stoppingToken);
        }
    }
}
