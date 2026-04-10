namespace CasaDiFratelli.Api.Models;

public class Reservation
{
    public int Id { get; set; }

    public string GuestName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }

    public int GuestCount { get; set; }

    public string Area { get; set; } = string.Empty;
    public string ReservedTime { get; set; } = string.Empty;
    public DateOnly ReservedDate { get; set; }

    public string? Notes { get; set; }

    public string Status { get; set; } = "Pending";
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public List<ReservationTable> Tables { get; set; } = new List<ReservationTable>();
}