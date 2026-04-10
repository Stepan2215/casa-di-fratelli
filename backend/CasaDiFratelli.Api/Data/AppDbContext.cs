using CasaDiFratelli.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CasaDiFratelli.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Reservation> Reservations => Set<Reservation>();
    public DbSet<ReservationTable> ReservationTables => Set<ReservationTable>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Reservation>(entity =>
        {
            entity.Property(x => x.GuestName).IsRequired().HasMaxLength(120);
            entity.Property(x => x.Phone).IsRequired().HasMaxLength(50);
            entity.Property(x => x.Email).HasMaxLength(120);
            entity.Property(x => x.Area).IsRequired().HasMaxLength(50);
            entity.Property(x => x.ReservedTime).IsRequired().HasMaxLength(20);
            entity.Property(x => x.Status).IsRequired().HasMaxLength(30);
        });

        modelBuilder.Entity<ReservationTable>(entity =>
        {
            entity.Property(x => x.TableCode).IsRequired().HasMaxLength(20);
        });
    }
}