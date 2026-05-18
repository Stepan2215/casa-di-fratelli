namespace CasaDiFratelli.Api.Models;

public class DiningOrder
{
    public int Id { get; set; }

    public int ReservationId { get; set; }

    public Reservation? Reservation { get; set; }

    public string GuestName { get; set; } = string.Empty;

    public string TableLabel { get; set; } = string.Empty;

    public string Status { get; set; } = "New";

    public decimal TotalPrice { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public List<DiningOrderItem> Items { get; set; } = new();
}
