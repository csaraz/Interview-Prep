---
title: Design Patterns — Categories & Why
level: Junior
category: Patterns & Architecture
tags: design-patterns, gof, creational, structural, behavioral
order: 20
---

## Why design patterns?

- **Reuse proven solutions** instead of reinventing the wheel
- Improve **readability and structure**
- Shared vocabulary — teamwork gets easier ("just use a Strategy here")
- Systems become easier to **maintain and extend**

## The three categories (GoF)

### Creational — object creation

| Pattern | One-liner |
|---|---|
| **Singleton** | Exactly one instance, global access |
| **Factory Method** | Subclasses decide which class to instantiate |
| Abstract Factory | Families of related objects |
| Builder | Step-by-step construction of complex objects |
| Prototype | Clone existing objects |

### Structural — object composition

| Pattern | One-liner |
|---|---|
| Adapter | Convert one interface to another |
| **Decorator** | Add behavior by wrapping (ASP.NET filters use this) |
| Facade | Simple interface over a complex subsystem |
| Composite | Tree structures treated uniformly |
| Proxy | Placeholder controlling access |
| Bridge, Flyweight | Decouple abstraction/implementation; share fine-grained state |

### Behavioral — communication between objects

| Pattern | One-liner |
|---|---|
| **Observer** | Publish/subscribe notifications (C# events) |
| **Strategy** | Interchangeable algorithms chosen at runtime |
| **Command** | Encapsulate a request as an object |
| **Mediator** | Central hub for object communication (MediatR) |
| State, Chain of Responsibility, Iterator, Memento, Template Method, Visitor | … |

Bold = the ones most asked in .NET interviews; each has its own article here.

## Patterns you already use in .NET without noticing

- DI container → Factory + Singleton lifetimes
- `IEnumerable`/`foreach` → Iterator
- C# `event` → Observer
- Middleware pipeline → Chain of Responsibility
- ASP.NET Filters → Decorator
- EF Core `DbContext` → Unit of Work; `DbSet` → Repository
