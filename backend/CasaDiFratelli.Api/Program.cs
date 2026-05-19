using CasaDiFratelli.Api.Data;
using Microsoft.EntityFrameworkCore;
using CasaDiFratelli.Api.Services;
using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddHttpClient<EmailService>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(5);
});
builder.Services.AddScoped<ReservationConflictService>();
builder.Services.AddScoped<AdminAuthService>();
builder.Services.AddScoped<AuditService>();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "https://casa-di-fratelli.vercel.app",
                "https://casadifratelli.bg",
                "https://www.casadifratelli.bg"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowFrontend");

app.Use(async (context, next) =>
{
    var stopwatch = Stopwatch.StartNew();
    try
    {
        await next();
    }
    catch (Exception error)
    {
        app.Logger.LogError(error, "Unhandled error {Method} {Path}", context.Request.Method, context.Request.Path);
        if (!context.Response.HasStarted)
        {
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { message = "Internal server error." });
        }
    }
    finally
    {
        stopwatch.Stop();
        if (context.Response.StatusCode >= 500 || stopwatch.ElapsedMilliseconds > 1500)
        {
            app.Logger.LogWarning(
                "Request {Method} {Path} finished {StatusCode} in {Elapsed}ms",
                context.Request.Method,
                context.Request.Path,
                context.Response.StatusCode,
                stopwatch.ElapsedMilliseconds);
        }
    }
});

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    await AdminSchemaBootstrapper.EnsureAsync(db);
    await scope.ServiceProvider.GetRequiredService<AdminAuthService>().EnsureDefaultAdminAsync();
    _ = await MenuSeedData.SeedAsync(db);
}

app.MapControllers();

app.Run();
