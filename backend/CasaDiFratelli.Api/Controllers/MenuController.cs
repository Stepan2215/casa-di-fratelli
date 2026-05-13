using CasaDiFratelli.Api.Data;
using CasaDiFratelli.Api.Models;
using CasaDiFratelli.Api.Services;
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

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try
        {
            await AdminSchemaBootstrapper.EnsureAsync(_db);
            await MenuSeedData.SeedAsync(_db);

            var items = await _db.MenuItems
                .OrderBy(x => x.Category)
                .ThenBy(x => x.NameBg)
                .ToListAsync();

            return Ok(items);
        }
        catch (Exception error)
        {
            _logger.LogError(error, "Failed to load menu items.");
            return Ok(Array.Empty<MenuItem>());
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

            _db.MenuItems.Add(item);
            await _db.SaveChangesAsync();

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

            return Ok(item);
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

        var item = await _db.MenuItems.FindAsync(id);

        if (item == null)
            return NotFound();

        item.NameBg = updated.NameBg;
        item.NameEn = updated.NameEn;
        item.DescriptionBg = updated.DescriptionBg;
        item.DescriptionEn = updated.DescriptionEn;
        item.Weight = updated.Weight;
        item.Price = updated.Price;
        item.Category = updated.Category;
        item.IsActive = updated.IsActive;
        item.NotifySubscribers = updated.NotifySubscribers;
        item.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(item);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await AdminSchemaBootstrapper.EnsureAsync(_db);

        var item = await _db.MenuItems.FindAsync(id);

        if (item == null)
            return NotFound();

        _db.MenuItems.Remove(item);

        await _db.SaveChangesAsync();

        return Ok();
    }
}
