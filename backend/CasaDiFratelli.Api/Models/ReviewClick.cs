namespace CasaDiFratelli.Api.Models;

public class ReviewClick
{
    public int Id { get; set; }
    public int? WaiterId { get; set; }
    public Waiter? Waiter { get; set; }
    public string IpHash { get; set; } = string.Empty;
    public string? UserAgent { get; set; }
    public string? Referrer { get; set; }
    public DateTime ClickedAtUtc { get; set; } = DateTime.UtcNow;
    public bool RedirectedToGoogle { get; set; } = false;
}
