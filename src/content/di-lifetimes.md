---
title: DI in ASP.NET Core — Transient, Scoped, Singleton
level: Mid
category: ASP.NET Core
tags: dependency-injection, lifetimes, scoped, singleton, transient
order: 50
---

## DI in controllers

ASP.NET Core has a **built-in IoC container**. Constructor injection is the standard: the container builds the object graph when creating controllers. Registered services are disposed automatically according to their lifetime — the framework takes care of cleanup.

## The three lifetimes

| Lifetime | Instance created | Typical use |
|---|---|---|
| **Transient** | Every time it's requested | Lightweight, **stateless** services |
| **Scoped** | Once **per HTTP request** | Most common; EF Core `DbContext` lives here |
| **Singleton** | Once for the **application lifetime** | Config, caches, stateless shared services |

```csharp
services.AddTransient<IMyService, MyService>();
services.AddScoped<IMyService, MyService>();
services.AddSingleton<IMyService, MyService>();
```

## Scoped demonstration

```csharp
public class ScopedController : Controller
{
    private readonly MyService _service1;
    private readonly MyService _service2;

    public ScopedController(MyService service1, MyService service2)
    {
        _service1 = service1;
        _service2 = service2;
    }

    public IActionResult Index()
        => Content($"S1: {_service1.Id}\nS2: {_service2.Id}");
}
```

**Result:** within the same request the IDs are the **same** (one instance per request); across requests they differ.

## The captive dependency trap ⚠️

- **Never inject a Scoped service into a Singleton** — the scoped instance gets "captured" and behaves like a singleton (stale DbContext, cross-request data leaks).
- In **middleware** (which is constructed once, like a singleton): inject scoped services into `InvokeAsync` **parameters**, not the constructor.

## Singleton lifetime notes

- ASP.NET Core creates and shares a single instance through the app's life — you don't need to hand-implement the Singleton pattern for services.
- Singletons must be **thread-safe** — every request shares them.

## Interview one-liners

- "Transient = always new; Scoped = per request; Singleton = per app."
- "DbContext is Scoped — that's why injecting it into a Singleton breaks things (captive dependency)."
