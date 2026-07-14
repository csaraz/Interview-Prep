---
title: Singleton Pattern (+ Singleton vs Static Class)
level: Mid
category: Patterns & Architecture
tags: singleton, design-patterns, thread-safety, lazy
order: 30
---

## Purpose

Ensure a class has **only one instance** and provide a **global access point** to it. Used for shared resources: configuration manager, logging service, connection pool.

## How to build one

1. Make the class `sealed`
2. Make the constructor `private` (no external `new`)
3. Expose a static property that returns the single cached instance

```csharp
public sealed class Logger
{
    private static readonly Lazy<Logger> _instance =
        new Lazy<Logger>(() => new Logger());

    private Logger() { }

    public static Logger Instance => _instance.Value;

    public void Log(string message)
        => Console.WriteLine($"Log: {message}");
}

// usage
Logger.Instance.Log("Application started");
```

`Lazy<T>` gives **thread-safe, lazy** initialization for free (see the Lazy&lt;T&gt; article).

## When to use / when not

✅ Exactly one instance needed; single point of access to a resource
❌ Overuse → tight coupling; hard to unit test (hard to mock); hidden global state

> Real-life analogy: a country has one president at a time; a printer spooler manages jobs in one centralized queue.

## Singleton vs Static Class (classic interview comparison)

| | Singleton | Static class |
|---|---|---|
| Instance | One real object (on the **heap**) | No instance (type data, loader heap) |
| Pass as parameter | ✅ it's an object | ❌ |
| Implement interfaces / inherit | ✅ | ❌ |
| Polymorphism | ✅ users needn't know it's single | ❌ |
| Lazy/async initialization | ✅ | Initialized at first load |
| Dispose / clone | ✅ | ❌ |
| Constructor | ✅ (private) | ❌ (static ctor only) |
| State | Can maintain state OO-style | Static state, App-Domain scope |

Both must be implemented **thread-safe**.

## In ASP.NET Core

Don't hand-roll: `services.AddSingleton<IMyService, MyService>()` — the container maintains the single instance for the app lifetime.

## Interview one-liners

- "Sealed class + private constructor + `Lazy<T>` static instance = the modern thread-safe singleton."
- "Singleton beats static class when you need interfaces, DI, polymorphism, or disposal."
