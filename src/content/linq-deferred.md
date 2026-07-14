---
title: LINQ Deferred Execution
level: Mid
category: C# Fundamentals
tags: linq, deferred-execution, iqueryable, ienumerable
order: 210
---

## What is deferred execution?

The evaluation of a LINQ expression is **delayed until its value is actually required** — typically when you iterate (`foreach`) or materialize (`ToList`, `ToArray`, `First`…).

```csharp
var query = students.Where(s => s.Age > 18); // NOTHING runs here

foreach (var s in query)   // executes HERE
    Console.WriteLine(s.Name);
```

Applies to in-memory collections **and** remote providers (LINQ-to-Entities/EF Core, LINQ-to-XML).

## Why it matters

- **Performance** — avoids unnecessary execution; you can compose queries (add filters conditionally) and only the final shape runs
- **Freshness** — the query re-executes on each iteration, seeing current data
- **The trap** — iterating a deferred query twice = executing it twice (two DB roundtrips in EF!); materialize with `ToList()` when reusing results

## Immediate execution

Operators that force execution now: `ToList()`, `ToArray()`, `Count()`, `First()`, `Sum()`…

## IEnumerable vs IQueryable (the follow-up question)

| | IEnumerable | IQueryable |
|---|---|---|
| Where filters run | **In memory** (client side) | Translated to **SQL** (server side) |
| Provider | LINQ to Objects | Expression trees → EF query provider |
| Danger | `context.Orders.AsEnumerable().Where(...)` loads the whole table first | — |

## Interview one-liners

- "A LINQ query is a *description*; it runs when enumerated — and re-runs on every enumeration."
- "IQueryable composes SQL; IEnumerable filters in memory — put filters before materialization."
