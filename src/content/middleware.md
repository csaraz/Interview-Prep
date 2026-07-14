---
title: Middleware — Pipeline, Use vs Run vs Map
level: Mid
category: ASP.NET Core
tags: middleware, pipeline, request, aspnetcore
order: 30
---

## What is middleware?

Software **injected into the application pipeline** to handle requests and responses. Middlewares are chained: each can act **before and/or after** passing control to the next one. Requests flow forward through the chain; responses flow **back in reverse order**.

Examples: authentication, logging, exception handling, CORS, static files.

## Custom middleware

```csharp
public class LoggingMiddleware
{
    private readonly RequestDelegate _next;
    public LoggingMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        Console.WriteLine($"Request: {context.Request.Path}");
        await _next(context);                       // pass to next middleware
        Console.WriteLine($"Response: {context.Response.StatusCode}");
    }
}

app.UseMiddleware<LoggingMiddleware>();
```

**Under the hood:** the pipeline is a **linked list of delegates** built in `Configure`/`Program.cs`. If a middleware doesn't call `_next()`, the pipeline **short-circuits** — no further middleware or controller runs (used intentionally by e.g. authentication).

## Use vs Run vs Map

| Method | Behavior |
|---|---|
| `Use` | Part of the chain — may call `_next()` |
| `Run` | **Terminal** — never calls next; pipeline ends here |
| `Map` | **Branches** the pipeline by request path |

```csharp
app.Map("/path1", branch => { /* middleware for /path1/... */ });
app.Map("/path2", branch => { /* middleware for /path2/... */ });
```

If the request path starts with the given path, the middleware on that branch executes.

## Recommended order (memorize the skeleton)

```
ExceptionHandler → HSTS → HttpsRedirection → StaticFiles →
Routing → CORS → Authentication → Authorization → Endpoints
```

## The Configure method (classic Startup)

Defines **how the app responds to each HTTP request** by composing the middleware pipeline. Takes `IApplicationBuilder` (+ optionally `IHostingEnvironment`, `ILoggerFactory`). In .NET 6+ this all lives in `Program.cs`.

## Interview one-liners

- "The pipeline is a linked list of delegates; skipping `_next()` short-circuits it."
- "`Use` chains, `Run` terminates, `Map` branches by path."
- "Middleware sees every request; filters see only MVC actions." (see Filters article)
