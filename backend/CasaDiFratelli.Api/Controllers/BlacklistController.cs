using CasaDiFratelli.Api.Data;
using CasaDiFratelli.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CasaDiFratelli.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlacklistController : ControllerBase
{
    private readonly AppDbContext _db;

    public BlacklistController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var list = await _db.BlacklistEntries
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync();

        return Ok(list);
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] BlacklistEntry entry)
    {
        entry.CreatedAtUtc = DateTime.UtcNow;

        _db.BlacklistEntries.Add(entry);

        await _db.SaveChangesAsync();

        return Ok(entry);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entry = await _db.BlacklistEntries.FindAsync(id);

        if (entry == null)
            return NotFound();

        _db.BlacklistEntries.Remove(entry);

        await _db.SaveChangesAsync();

        return Ok();
    }
}