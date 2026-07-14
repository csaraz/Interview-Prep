---
title: Background Tasks — BackgroundService & IHostedService
level: Mid
category: ASP.NET Core
tags: background-service, hosted-service, cancellation-token
order: 90
---

## What they are

In ASP.NET Core, background tasks are implemented as **hosted services** — classes with background logic implementing `IHostedService`. `BackgroundService` is the convenient base class.

Typical patterns:

- Background task on a **timer** (CRON replacement: data sync, cleanup jobs, email sender)
- Hosted service that activates a **scoped service** via DI
- **Queued** background tasks running sequentially

## Skeleton

```csharp
public class CleanupService : BackgroundService
{
    private readonly IServiceProvider _services;

    public CleanupService(IServiceProvider services) => _services = services;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                // do work…
            }
            await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
        }
    }
}

builder.Services.AddHostedService<CleanupService>();
```

## Key interview points

- Extend `BackgroundService`, override `ExecuteAsync(CancellationToken)`
- **Handle the CancellationToken properly** — graceful shutdown when the host stops
- Hosted services are **singletons** → to use scoped services (like `DbContext`), **create a scope** (`CreateScope()`), don't constructor-inject them
- Wrap the loop body in try/catch — an unhandled exception kills the background service silently

## Interview one-liner

- "BackgroundService = long-running singleton; scoped dependencies come from a manually created scope, and the stopping token drives graceful shutdown."
