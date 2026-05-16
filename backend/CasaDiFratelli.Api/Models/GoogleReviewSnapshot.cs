namespace CasaDiFratelli.Api.Models;

public class GoogleReviewSnapshot
{
    public int Id { get; set; }
    public string GoogleReviewId { get; set; } = string.Empty;
    public string? AuthorName { get; set; }
    public int? Rating { get; set; }
    public string? Text { get; set; }
    public DateTime ReviewTimeUtc { get; set; }
    public int? AttributedWaiterId { get; set; }
    public Waiter? AttributedWaiter { get; set; }
    public decimal? ConfidenceScore { get; set; }
    public string? AttributionNote { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
