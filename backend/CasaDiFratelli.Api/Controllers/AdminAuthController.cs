using CasaDiFratelli.Api.Data;
using CasaDiFratelli.Api.Filters;
using CasaDiFratelli.Api.Models;
using CasaDiFratelli.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CasaDiFratelli.Api.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminAuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly AdminAuthService _auth;
    private readonly AuditService _audit;

    public AdminAuthController(AppDbContext db, AdminAuthService auth, AuditService audit)
    {
        _db = db;
        _auth = auth;
        _audit = audit;
    }

    public sealed record AdminLoginRequest(string Email, string Password);
    public sealed record CreateAdminRequest(string Name, string Email, string Password, string Role);
    public sealed record DeviceLoginRequest(string CredentialToken);
    public sealed record DeviceRegisterRequest(string Label, string CredentialToken);

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AdminLoginRequest request)
    {
        var login = await _auth.LoginAsync(request.Email, request.Password, Request);
        if (login == null)
        {
            return Unauthorized(new { message = "Invalid admin credentials." });
        }

        await _audit.RecordAsync(HttpContext, "login", "AdminUser", login.User.Id.ToString(), after: login.User);
        return Ok(login);
    }

    [HttpPost("device-login")]
    public async Task<IActionResult> DeviceLogin([FromBody] DeviceLoginRequest request)
    {
        var login = await _auth.LoginWithDeviceAsync(request.CredentialToken, Request);
        if (login == null)
        {
            return Unauthorized(new { message = "Device login is not enabled." });
        }

        await _audit.RecordAsync(HttpContext, "device-login", "AdminUser", login.User.Id.ToString(), after: login.User);
        return Ok(login);
    }

    [HttpGet("me")]
    [AdminAuthorize]
    public IActionResult Me()
    {
        return Ok(AdminAuthService.Current(HttpContext));
    }

    [HttpGet("users")]
    [AdminAuthorize]
    public async Task<IActionResult> Users()
    {
        var users = await _db.AdminUsers
            .OrderBy(x => x.Name)
            .Select(x => new
            {
                x.Id,
                x.Name,
                x.Email,
                x.Role,
                x.IsActive,
                x.CreatedAtUtc,
                x.LastLoginAtUtc
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpPost("users")]
    [AdminAuthorize]
    public async Task<IActionResult> CreateUser([FromBody] CreateAdminRequest request)
    {
        var current = AdminAuthService.Current(HttpContext);
        if (!string.Equals(current?.Role, "Owner", StringComparison.OrdinalIgnoreCase))
            return Forbid();

        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Email and password are required." });

        var normalizedEmail = AdminAuthService.NormalizeEmail(request.Email);
        if (await _db.AdminUsers.AnyAsync(x => x.Email == normalizedEmail))
            return Conflict(new { message = "Admin already exists." });

        var (hash, salt) = AdminAuthService.HashPassword(request.Password);
        var user = new AdminUser
        {
            Name = string.IsNullOrWhiteSpace(request.Name) ? normalizedEmail : request.Name.Trim(),
            Email = normalizedEmail,
            Role = string.IsNullOrWhiteSpace(request.Role) ? "Manager" : request.Role.Trim(),
            PasswordHash = hash,
            PasswordSalt = salt,
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        _db.AdminUsers.Add(user);
        await _db.SaveChangesAsync();
        await _audit.RecordAsync(HttpContext, "create", "AdminUser", user.Id.ToString(), after: new { user.Id, user.Name, user.Email, user.Role });

        return Ok(new { user.Id, user.Name, user.Email, user.Role, user.IsActive });
    }

    [HttpPost("devices")]
    [AdminAuthorize]
    public async Task<IActionResult> RegisterDevice([FromBody] DeviceRegisterRequest request)
    {
        var admin = AdminAuthService.Current(HttpContext);
        if (admin == null) return Unauthorized();

        var credential = await _auth.RegisterDeviceAsync(admin, request.Label, request.CredentialToken);
        await _audit.RecordAsync(HttpContext, "register-device", "AdminDeviceCredential", credential.Id.ToString(), after: new { credential.Id, credential.Label });

        return Ok(new { credential.Id, credential.Label });
    }

    [HttpGet("audit")]
    [AdminAuthorize]
    public async Task<IActionResult> Audit()
    {
        var logs = await _db.AuditLogs
            .OrderByDescending(x => x.CreatedAtUtc)
            .Take(200)
            .ToListAsync();

        return Ok(logs);
    }
}
