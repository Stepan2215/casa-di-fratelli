namespace CasaDiFratelli.Api.Dtos;

public class UpdateReservationTablesRequest
{
    public string? Area { get; set; }
    public int? GuestCount { get; set; }
    public List<string> TableIds { get; set; } = new();
}
