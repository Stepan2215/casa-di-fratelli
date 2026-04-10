using System.Text.Json.Serialization;

namespace CasaDiFratelli.Api.Models;

public class ReservationTable
{
    public int Id { get; set; }

    public int ReservationId { get; set; }

    [JsonIgnore]
    public Reservation Reservation { get; set; } = null!;

    public string TableCode { get; set; } = string.Empty;
}