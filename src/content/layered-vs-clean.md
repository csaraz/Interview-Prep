---
title: Layered vs Clean Architecture
level: Senior
category: Patterns & Architecture
tags: clean-architecture, layered-architecture, onion, dependencies
order: 110
---

## Layered (n-tier) architecture

Code organized into layers by **technical responsibility**:

```
UI Layer:        OrderController  → calls →
Business Layer:  OrderService     → calls →
Data Layer:      OrderRepository  → accesses → Database
```

- Presentation (UI) → Business Logic (BLL) → Data Access (DAL)
- Each layer talks only to the layer **below**; dependencies point **downward**
- Lower layers don't know who uses them

## Clean Architecture (Uncle Bob)

Separation by **dependency rules**, not just technical layers. The core rule: **dependencies point inwards** — business logic must not depend on frameworks, DB, or UI.

```
[ UI / Web (API, Angular) ]
        ↓ calls
[ Application Layer — use cases ]
        ↓ uses
[ Domain Layer — entities, business rules ]
```

### What each layer does

- **Domain** — entities (rich objects with business rules), value objects; **zero external dependencies** (no EF, no ASP.NET)
- **Application** — use cases (`CreateOrderService`); **defines interfaces** for repositories/external services; orchestrates domain logic
- **Infrastructure** — **implements** those interfaces (EF Core, SQL, Mongo, SMTP, Redis, message queues); maps persistence models ↔ domain entities; *no business logic*; the "gateway to the world"
- **UI/API** — talks to the outside (HTTP); maps DTOs ↔ domain entities; calls Application use cases

### The dependency trick

Application needs a repository, but its **interface lives in Application** while the **implementation lives in Infrastructure**:

```
[ Application ] ──uses──> IOrderRepository (defined here)
                              ↑ implements
[ Infrastructure ]  (EF, SQL, SMTP, Redis…)
```

That's the Dependency Inversion Principle at architecture scale (Onion architecture is essentially the same idea drawn as circles).

## Comparison table

| Feature | Layered | Clean |
|---|---|---|
| Separation based on | Technical concerns | Business logic + dependency direction |
| Dependency direction | Top → down (UI → BLL → DAL) | Out → in (UI → App → Domain) |
| Core focus | Layer responsibility | Business rules independence |
| Flexibility | Less | Highly decoupled |
| Testing | Often needs the full stack | Business logic testable in isolation |
| Framework dependence | High (BLL often knows EF) | Low (framework is an outer detail) |

## Interview one-liners

- "In layered, business logic depends on the data layer. In clean, the data layer depends on business abstractions — the arrow flips."
- "Domain has no NuGet references to EF or ASP.NET — that's the litmus test."
