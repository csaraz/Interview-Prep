---
title: EF Core — 20 Interview Q&A
level: Mid
category: EF Core
tags: ef-core, interview-qa, change-tracking, migrations, linq
order: 20
---

## 1. What is EF Core vs EF6?
EF Core: lightweight, **cross-platform** ORM, built from scratch, faster, modern APIs. EF6: Windows-only, mature but heavier. EF Core translates LINQ → expression trees → SQL via `IQueryable`.

## 2. DbContext vs DbSet?
`DbContext` = **unit of work**: manages connection + change tracking (`ChangeTracker`). `DbSet<TEntity>` = a table; repository-like abstraction for building LINQ queries and CRUD.

## 3. What are Migrations?
Schema changes tracked in C# instead of manual SQL. `Add-Migration` / `Update-Database`. EF compares the current model to a **snapshot** file to generate migration SQL. Version-controlled DB evolution → fits CI/CD.

## 4. Add vs Attach vs Update?
`Add` → state `Added` → INSERT. `Attach` → `Unchanged` (entity already exists in DB). `Update` → `Modified` → UPDATE of all fields. All tracked in `ChangeTracker.Entries()` via `EntityState`.

## 5. Transactions?
Implicit transaction per `SaveChanges()`. Explicit: `Database.BeginTransaction()`. Under the hood: ADO.NET `DbTransaction`.

## 6. Eager vs Lazy vs Explicit loading?
See the dedicated loading article. Eager=`Include`(JOIN), Lazy=proxy-triggered separate queries, Explicit=`.Load()`.

## 7. What is Change Tracking?
EF tracks entity states (Added/Modified/Deleted/Unchanged) with an internal **snapshot** of property values; the **Identity Map** pattern guarantees one instance per row per context.

## 8. How does EF detect changes?
Default: snapshot comparison at `SaveChanges()` (original vs current values). Alternative: `INotifyPropertyChanged` notifications.

## 9. AsNoTracking?
Skips ChangeTracker registration — better performance for **read-only** queries; entities aren't cached, no identity resolution (same row can materialize as multiple objects). Results reflect DB state, ignoring local changes.

## 10. Concurrency?
**Optimistic concurrency**: `[ConcurrencyCheck]` or `RowVersion` column. EF adds `WHERE RowVersion = @original` to UPDATE; if no rows affected → `DbUpdateConcurrencyException`.

## 11. First vs FirstOrDefault vs Single vs SingleOrDefault?
`First` throws if empty; `FirstOrDefault` → null. `Single` throws if 0 **or** >1; `SingleOrDefault` → null if 0, throws if >1. SQL: `TOP(1)` (Single fetches `TOP(2)` to validate).

## 12. Batch operations?
`SaveChanges()` batches statements in one transaction (each entity → its own SQL command). True bulk ops need libraries like `EFCore.BulkExtensions`.

## 13. Find vs FirstOrDefault?
`Find(key)` checks the **ChangeTracker first** (primary key cache) — may avoid a query. `FirstOrDefault` always hits the DB.

## 14. Configuring relationships?
**Fluent API** (`modelBuilder.Entity<User>().HasMany(...)`) or **Data Annotations** (`[ForeignKey]`, `[InverseProperty]`). EF builds a metadata model (`IModel`) at startup.

## 15. SaveChanges vs SaveChangesAsync?
Sync blocks the thread; async uses ADO.NET async APIs — non-blocking SQL calls.

## 16. How is LINQ translated to SQL?
LINQ → **Expression Tree** → query provider parses it → relational SQL commands.

## 17. Global Query Filters?
`modelBuilder.Entity<User>().HasQueryFilter(u => !u.IsDeleted)` — injected into **every** query for that entity. Classic use: **soft delete**, multi-tenancy.

## 18. Shadow Properties?
Properties tracked by EF but **not defined on the CLR class**: `Property<DateTime>("CreatedAt")`. Stored in the ChangeTracker, not the object.

## 19. Raw SQL?
`FromSqlRaw` (query, still materializes entities) / `ExecuteSqlRaw` (commands). Passes SQL directly to the provider — last resort for complex queries.

## 20. How to improve EF Core performance?
`AsNoTracking` for reads · projections (`Select`) · avoid N+1 (`Include` or projection) · batch updates · compiled queries · cache. Main EF overhead = ChangeTracker + expression parsing. (Details in EF Performance article.)
