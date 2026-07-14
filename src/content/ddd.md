---
title: DDD — Domain-Driven Design Essentials
level: Lead
category: Patterns & Architecture
tags: ddd, domain, entity, value-object, aggregate, bounded-context
order: 130
---

## What is DDD?

An approach where the software model **mirrors the business domain**, built in close collaboration with domain experts. The code speaks the business language.

## Core building blocks

**Ubiquitous Language** — one shared vocabulary between developers and business, used *in the code* (class/method names match how the business talks).

**Bounded Context** — an explicit boundary within which a model is valid. "Customer" in Sales ≠ "Customer" in Support — each context has its own model. Bounded contexts are the natural seams for microservices.

**Entity vs Value Object** (classic interview question):

| | Entity | Value Object |
|---|---|---|
| Identity | Has an **ID**; identity persists over time | **No identity** — defined by its values |
| Equality | By ID | By value (all fields) |
| Mutability | Mutable | **Immutable** |
| Example | `Order`, `Customer` | `Money`, `Address`, `DateRange` |

```csharp
// Entity — identity matters
public class Order
{
    public Guid Id { get; }
    public Address ShippingAddress { get; private set; } // value object inside
}

// Value object — values matter (C# record fits perfectly)
public record Address(string Street, string City, string Zip);
```

**Aggregate & Aggregate Root** — a cluster of entities/value objects treated as one consistency unit. External code references only the **root** (e.g. `Order`, not its `OrderLine`s directly); the root enforces invariants. One transaction = one aggregate.

**Domain Events** — facts that happened in the domain (`OrderPlaced`) — other parts react without coupling.

**Repository** — persistence abstraction *per aggregate root* (see Repository article).

## Rich vs anemic domain model

- **Anemic**: entities are property bags; logic lives in services — DDD considers this an anti-pattern
- **Rich**: business rules live **inside** entities/value objects (`order.AddLine(...)` validates invariants itself) — this is what Clean Architecture's Domain layer wants

## When DDD pays off

Complex business domains with evolving rules and many invariants. For CRUD apps, full tactical DDD is overkill — but Ubiquitous Language and bounded contexts are almost always worth it.

## Interview one-liners

- "Entity = who it is (ID); Value Object = what it is (values, immutable)."
- "Aggregate root is the transaction and consistency boundary."
- "Bounded contexts give microservices their boundaries."
