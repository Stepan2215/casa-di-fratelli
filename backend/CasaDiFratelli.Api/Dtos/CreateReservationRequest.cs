namespace CasaDiFratelli.Api.Dtos;

public class CreateReservationRequest
{
    public string GuestName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    public int GuestCount { get; set; }

    public string Area { get; set; } = string.Empty;
    public string ReservedTime { get; set; } = string.Empty;
    public DateOnly ReservedDate { get; set; }

    public string? Notes { get; set; }

    public List<string> TableIds { get; set; } = new List<string>();

    public DateOnly? BirthDate { get; set; }
    public bool MarketingConsent { get; set; }

    public bool CreatedByAdmin { get; set; } = false;
    public string? InternalNote { get; set; }
}