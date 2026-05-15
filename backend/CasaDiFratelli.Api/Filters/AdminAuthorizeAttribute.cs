using CasaDiFratelli.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace CasaDiFratelli.Api.Filters;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AdminAuthorizeAttribute : Attribute, IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var auth = context.HttpContext.RequestServices.GetRequiredService<AdminAuthService>();

        if (!await auth.IsAuthorizedAsync(context.HttpContext.Request))
        {
            context.Result = new UnauthorizedObjectResult(new { message = "Admin password is required." });
            return;
        }

        await next();
    }
}
