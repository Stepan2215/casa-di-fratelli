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

    public MenuController(AppDbContext db, EmailService emailService)
    {
        _db = db;
        _emailService = emailService;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var items = await _db.MenuItems
            .OrderBy(x => x.Category)
            .ThenBy(x => x.NameBg)
            .ToListAsync();

        return Ok(items);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] MenuItem item)
    {
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

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] MenuItem updated)
    {
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
        item.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(item);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _db.MenuItems.FindAsync(id);

        if (item == null)
            return NotFound();

        _db.MenuItems.Remove(item);

        await _db.SaveChangesAsync();

        return Ok();
    }
}