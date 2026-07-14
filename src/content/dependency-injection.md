---
title: Dependency Injection, DIP, and IoC — the Difference
level: Mid
category: Patterns & Architecture
tags: dependency-injection, dip, ioc, loose-coupling
order: 90
---

## The three terms (classic interview question)

- **IoC (Inversion of Control)** — the general principle: control over object creation/flow is inverted — a framework/container calls *your* code, not vice versa
- **DIP (Dependency Inversion Principle)** — the SOLID **design principle**: depend on abstractions, not concretions
- **DI (Dependency Injection)** — the concrete **technique**: dependencies are *given* to a class (constructor/property/method) instead of the class creating them

> "DIP is the principle, IoC is the broader idea, DI is the implementation technique. A DI container is the tool."

## What DI achieves

```csharp
// ❌ tight coupling — class creates its own dependency
public class OrderService
{
    private readonly SqlOrderRepository _repo = new SqlOrderRepository();
}

// ✅ loose coupling — dependency injected via abstraction
public class OrderService
{
    private readonly IOrderRepository _repo;
    public OrderService(IOrderRepository repo) => _repo = repo;
}
```

- Flexible: swap implementations without touching the class
- **Testable**: inject mocks
- Maintainable: composition configured in one place

## Inverting the dependency graph

Without DIP, compile-time dependencies follow runtime flow: `A → B → C`. Applying DIP, `A` calls an **abstraction that B implements** — at runtime A still calls B, but at compile time **B depends on an interface controlled by A's layer**. That inversion is what makes Clean/Onion architecture possible (interfaces in the core, implementations outside).

> Fun fact for interviews: the DI technique is an implementation of the **Strategy pattern** — you inject the "strategy" (implementation) the class will use.

## In .NET Core

Built-in container; register in `Program.cs`:

```csharp
services.AddScoped<IOrderRepository, SqlOrderRepository>();
services.AddSingleton<ICache, MemoryCache>();
services.AddTransient<IEmailSender, SmtpEmailSender>();
```

(Lifetimes explained in the DI Lifetimes article.)

## Interview one-liners

- "DI = giving a class its dependencies from outside, against an abstraction."
- "High-level modules define the interfaces; low-level modules implement them — that's the inversion."
