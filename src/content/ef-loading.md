---
title: EF Core — Lazy, Eager, Explicit Loading
level: Mid
category: EF Core
tags: ef-core, lazy-loading, eager-loading, include, n+1
order: 10
---

## The three loading strategies

| Strategy | How | SQL shape |
|---|---|---|
| **Eager** (`Include`) | Load related data **with** the main query | JOIN |
| **Lazy** | Load when the navigation property is **accessed** (requires proxies) | Separate query per access |
| **Explicit** | Manual `.Load()` call | Separate SELECT on demand |

## Eager loading

```csharp
var student = context.Students
    .Include(s => s.Standard)
    .FirstOrDefault(s => s.StudentName == "Bill");
```

One roundtrip; related entities arrive as part of the query.

## Lazy loading

```csharp
var students = context.Students.ToList();  // loads students only
var address = students[0].StudentAddress;  // NOW a separate SQL query runs
```

The context loads `Student` first; `StudentAddress` is fetched **when accessed** — a runtime proxy generates the extra query.

## The N+1 problem ⚠️

Lazy loading inside a loop = 1 query for the list + N queries for each element's navigation → performance killer. This is the most common EF interview trap:

```csharp
foreach (var s in context.Students.ToList())   // 1 query
    Console.WriteLine(s.StudentAddress.City);  // N queries!
```

**Fix:** eager-load (`Include`) or project only needed fields (`Select`).

## Which to choose

- Related data always needed → **Eager**
- Rarely needed, single entities → Lazy/Explicit (carefully)
- Read-only lists → **projection** (`Select` to DTO) beats `Include` (see EF Performance article)

## Interview one-liners

- "Eager = JOIN upfront; Lazy = query-per-access via proxies; Explicit = you call Load()."
- "Lazy loading is 'assumed best practice' but often means chatty N+1 roundtrips — measure it."
