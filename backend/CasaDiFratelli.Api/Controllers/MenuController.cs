using CasaDiFratelli.Api.Data;
using CasaDiFratelli.Api.Models;
using CasaDiFratelli.Api.Services;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CasaDiFratelli.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MenuController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly EmailService _emailService;
    private readonly ILogger<MenuController> _logger;

    public MenuController(
        AppDbContext db,
        EmailService emailService,
        ILogger<MenuController> logger)
    {
        _db = db;
        _emailService = emailService;
        _logger = logger;
    }

    private static void AddParameter(IDbCommand command, string name, object? value)
    {
        var parameter = command.CreateParameter();
        parameter.ParameterName = name;
        parameter.Value = value ?? DBNull.Value;
        command.Parameters.Add(parameter);
    }

    private async Task EnsureConnectionOpenAsync()
    {
        var connection = _db.Database.GetDbConnection();

        if (connection.State != ConnectionState.Open)
        {
            await connection.OpenAsync();
        }
    }

    private async Task<List<object>> ReadMenuItemsAsync()
    {
        await EnsureConnectionOpenAsync();

        await using var command = _db.Database.GetDbConnection().CreateCommand();
        command.CommandText = """
            SELECT
                "Id",
                "NameBg",
                "NameEn",
                "DescriptionBg",
                "DescriptionEn",
                "Weight",
                "Price",
                "Category",
                "IsActive",
                "NotifySubscribers"
            FROM "MenuItems"
            ORDER BY "Category", "NameBg";
            """;

        var items = new List<object>();
        await using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            items.Add(new
            {
                Id = reader.GetInt32(0),
                NameBg = reader.IsDBNull(1) ? string.Empty : reader.GetString(1),
                NameEn = reader.IsDBNull(2) ? string.Empty : reader.GetString(2),
                DescriptionBg = reader.IsDBNull(3) ? string.Empty : reader.GetString(3),
                DescriptionEn = reader.IsDBNull(4) ? string.Empty : reader.GetString(4),
                Weight = reader.IsDBNull(5) ? string.Empty : reader.GetString(5),
                Price = reader.IsDBNull(6) ? 0m : reader.GetDecimal(6),
                Category = reader.IsDBNull(7) ? "main" : reader.GetString(7),
                IsActive = !reader.IsDBNull(8) && reader.GetBoolean(8),
                NotifySubscribers = !reader.IsDBNull(9) && reader.GetBoolean(9)
            });
        }

        return items;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try
        {
            await AdminSchemaBootstrapper.EnsureAsync(_db);
            await MenuSeedData.SeedAsync(_db);

            var items = await ReadMenuItemsAsync();

            return Ok(items);
        }
        catch (Exception error)
        {
            _logger.LogError(error, "Failed to load menu items.");
            return StatusCode(500, new { message = "Failed to load menu items." });
        }
    }

    [HttpPost("seed")]
    public async Task<IActionResult> Seed()
    {
        try
        {
            await AdminSchemaBootstrapper.EnsureAsync(_db);
            var created = await MenuSeedData.SeedAsync(_db);
            var total = await _db.MenuItems.CountAsync();

            return Ok(new
            {
                Created = created,
                Total = total
            });
        }
        catch (Exception error)
        {
            _logger.LogError(error, "Failed to seed menu items.");
            return StatusCode(500, new { message = "Failed to seed menu items." });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] MenuItem item)
    {
        try
        {
            await AdminSchemaBootstrapper.EnsureAsync(_db);

            if (string.IsNullOrWhiteSpace(item.NameBg))
                return BadRequest(new { message = "Dish name is required." });

            if (item.Price <= 0)
                return BadRequest(new { message = "Dish price must be greater than zero." });

            item.NameBg = item.NameBg.Trim();
            item.NameEn = string.IsNullOrWhiteSpace(item.NameEn) ? item.NameBg : item.NameEn.Trim();
            item.DescriptionBg = item.DescriptionBg?.Trim() ?? string.Empty;
            item.DescriptionEn = item.DescriptionEn?.Trim() ?? string.Empty;
            item.Weight = item.Weight?.Trim() ?? string.Empty;
            item.Category = string.IsNullOrWhiteSpace(item.Category) ? "main" : item.Category.Trim();
            item.CreatedAtUtc = DateTime.UtcNow;

            await EnsureConnectionOpenAsync();

            await using var command = _db.Database.GetDbConnection().CreateCommand();
            command.CommandText = """
                INSERT INTO "MenuItems"
                ("NameBg", "NameEn", "DescriptionBg", "DescriptionEn", "Weight", "Price", "Category", "IsActive", "NotifySubscribers")
                VALUES
                (@nameBg, @nameEn, @descriptionBg, @descriptionEn, @weight, @price, @category, @isActive, @notifySubscribers)
                RETURNING "Id";
                """;
            AddParameter(command, "@nameBg", item.NameBg);
            AddParameter(command, "@nameEn", item.NameEn);
            AddParameter(command, "@descriptionBg", item.DescriptionBg);
            AddParameter(command, "@descriptionEn", item.DescriptionEn);
            AddParameter(command, "@weight", item.Weight);
            AddParameter(command, "@price", item.Price);
            AddParameter(command, "@category", item.Category);
            AddParameter(command, "@isActive", item.IsActive);
            AddParameter(command, "@notifySubscribers", item.NotifySubscribers);

            item.Id = Convert.ToInt32(await command.ExecuteScalarAsync());

            if (item.NotifySubscribers)
            {
                var subscribers = await _db.CustomerProfiles
                    .Where(x => x.MarketingConsent && !string.IsNullOrWhiteSpace(x.Email))
                    .ToListAsync();

                foreach (var customer in subscribers)
                {
                    try
                    {
                        await _emailService.SendAsync(
                            customer.Email!,
                            $"Ново предложение · Casa di Fratelli",
                            $"""
                            <div style="font-family:Arial,sans-serif">
                                <h2>{item.NameBg}</h2>
                                <p>{item.DescriptionBg}</p>

                                <p>
                                    <strong>{item.Weight}</strong>
                                    ·
                                    <strong>{item.Price:F2} лв</strong>
                                </p>

                                <p>
                                    Очакваме Ви в Casa di Fratelli.
                                </p>
                            </div>
                            """
                        );
                    }
                    catch
                    {
                    }
                }
            }

            return Ok(new
            {
                item.Id,
                item.NameBg,
                item.NameEn,
                item.DescriptionBg,
                item.DescriptionEn,
                item.Weight,
                item.Price,
                item.Category,
                item.IsActive,
                item.NotifySubscribers
            });
        }
        catch (Exception error)
        {
            _logger.LogError(error, "Failed to create menu item.");
            return StatusCode(500, new { message = "Failed to create menu item." });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] MenuItem updated)
    {
        await AdminSchemaBootstrapper.EnsureAsync(_db);
        await EnsureConnectionOpenAsync();

        await using var command = _db.Database.GetDbConnection().CreateCommand();
        command.CommandText = """
            UPDATE "MenuItems"
            SET
                "NameBg" = @nameBg,
                "NameEn" = @nameEn,
                "DescriptionBg" = @descriptionBg,
                "DescriptionEn" = @descriptionEn,
                "Weight" = @weight,
                "Price" = @price,
                "Category" = @category,
                "IsActive" = @isActive,
                "NotifySubscribers" = @notifySubscribers,
                "UpdatedAtUtc" = now()
            WHERE "Id" = @id;
            """;
        AddParameter(command, "@id", id);
        AddParameter(command, "@nameBg", updated.NameBg?.Trim() ?? string.Empty);
        AddParameter(command, "@nameEn", string.IsNullOrWhiteSpace(updated.NameEn) ? updated.NameBg?.Trim() : updated.NameEn.Trim());
        AddParameter(command, "@descriptionBg", updated.DescriptionBg?.Trim() ?? string.Empty);
        AddParameter(command, "@descriptionEn", updated.DescriptionEn?.Trim() ?? string.Empty);
        AddParameter(command, "@weight", updated.Weight?.Trim() ?? string.Empty);
        AddParameter(command, "@price", updated.Price);
        AddParameter(command, "@category", string.IsNullOrWhiteSpace(updated.Category) ? "main" : updated.Category.Trim());
        AddParameter(command, "@isActive", updated.IsActive);
        AddParameter(command, "@notifySubscribers", updated.NotifySubscribers);

        var affectedRows = await command.ExecuteNonQueryAsync();
        if (affectedRows == 0)
            return NotFound();

        return Ok(new
        {
            Id = id,
            NameBg = updated.NameBg,
            NameEn = updated.NameEn,
            DescriptionBg = updated.DescriptionBg,
            DescriptionEn = updated.DescriptionEn,
            Weight = updated.Weight,
            Price = updated.Price,
            Category = updated.Category,
            IsActive = updated.IsActive,
            NotifySubscribers = updated.NotifySubscribers
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await AdminSchemaBootstrapper.EnsureAsync(_db);
        await EnsureConnectionOpenAsync();

        await using var command = _db.Database.GetDbConnection().CreateCommand();
        command.CommandText = """
            DELETE FROM "MenuItems"
            WHERE "Id" = @id;
            """;
        AddParameter(command, "@id", id);

        var affectedRows = await command.ExecuteNonQueryAsync();
        if (affectedRows == 0)
            return NotFound();

        return Ok();
    }
}
