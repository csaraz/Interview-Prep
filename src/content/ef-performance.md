---
title: EF Core Performance & Troubleshooting
level: Senior
category: EF Core
tags: ef-core, performance, asnotracking, compiled-queries, troubleshooting
order: 30
---

## Troubleshooting slow EF queries — the 3-step process

1. **Enable logging** to find problematic areas
2. **Capture the generated SQL** for those areas
3. **Analyze execution plans** to find the root cause

### Enabling logging

Simple Logging, or `Microsoft.Extensions.Logging`:

```csharp
private static ILoggerFactory ContextLoggerFactory
    => LoggerFactory.Create(b =>
        b.AddFilter("", LogLevel.Information).AddConsole());

protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    => optionsBuilder.UseLoggerFactory(ContextLoggerFactory);
```

Alternative: SQL Server Profiler / Extended Events to trace what actually hits the DB. Use **query tags** (`.TagWith("GetOrders")`) to correlate LINQ statements with SQL in the logs.

### Analyzing

Feed the slow SQL to the database's plan tools (SSMS execution plan, `EXPLAIN ANALYZE`). The plan depends on **indexes** and **data volume**. (See the Execution Plans article.)

## Best practices checklist

### AsNoTracking for reads

Tracking has CPU/RAM cost (snapshotting, identity map). Read-only queries should skip it:

```csharp
var orders = await _db.Orders.AsNoTracking().ToListAsync();
```

Note: no identity resolution — the same DB row can materialize as multiple objects.

### Projection over Include

Don't load whole navigation graphs if you need a few fields:

```csharp
// ❌ loads full Customer + all Items
var orders = await _db.Orders
    .Include(o => o.Customer)
    .Include(o => o.Items)
    .ToListAsync();

// ✅ fetch exactly what you need
var orders = await _db.Orders
    .Select(o => new OrderDto
    {
        Id = o.Id,
        CustomerName = o.Customer.Name,
        ItemCount = o.Items.Count
    })
    .ToListAsync();
```

### Limit the result set

Network latency scales with payload. Select only required columns; always constrain rows (`WHERE`, `Take`).

### Watch the N+1 problem

Lazy loading in loops = 1 + N queries. Use eager loading or projection. (Eager loading can *reduce* chattiness — lazy is not automatically "best practice".)

### Compiled queries — hot paths

Normally EF parses the LINQ expression → translates → compiles a plan on **every call**. `EF.CompileQuery` precompiles once:

```csharp
private static readonly Func<AppDbContext, int, Customer?> _getById =
    EF.CompileQuery((AppDbContext db, int id) =>
        db.Customers.FirstOrDefault(c => c.Id == id));

public Customer? GetById(int id) => _getById(_db, id); // no translation overhead
```

### Batching & bulk

`SaveChanges` batches commands (min/max batch size configurable). For mass updates a single raw SQL statement (e.g. salary +3% for all rows) beats per-entity updates. Bulk libraries: `EFCore.BulkExtensions`.

### Indexes via migrations

Define indexes in the model (Fluent API `HasIndex` / attributes); migrations create them. Measure — indexes speed reads but can slow writes.

### Raw SQL as last resort

Complex queries / stored procedures are sometimes clearer and faster — but they scatter logic across layers and add maintenance. Use sparingly.

## Interview summary

> "EF performance tuning starts with `AsNoTracking` for reads, projecting with `Select` to cut payload, and killing N+1 with eager loading or DTO projection. Hot queries get `EF.CompileQuery`. For diagnosis: enable logging, tag queries, capture the SQL, and read the execution plan."
