---
title: Indexes — Clustered vs Non-Clustered
level: Mid
category: SQL & Database
tags: sql, indexes, clustered, performance, b-tree
order: 50
---

## What is an index?

A data structure that **improves read speed** at the cost of **extra writes and storage**. Data can be physically stored in only one order on disk; indexes provide fast (binary-search-like) access by other values. Implemented as **B-Tree / B+ Tree** structures.

## Clustered vs Non-Clustered

| | Clustered | Non-clustered |
|---|---|---|
| Defines | **Physical order** of data on disk | **Logical order** — separate tree with pointers to rows |
| Per table | Only **one** (data can be sorted one way) | Many |
| Leaf nodes | The data rows themselves | Pointers (row locator / clustered key) |
| Default | Created with PRIMARY KEY (SQL Server) | Created explicitly |

## Cost of indexes

- Every INSERT/UPDATE/DELETE must also update indexes → **writes get slower**
- Extra disk/memory usage
- Measure! An index helps only if queries actually use it (see Execution Plans)

## In EF Core

Define indexes in the model; migrations create them:

```csharp
modelBuilder.Entity<User>()
    .HasIndex(u => u.Email)
    .IsUnique();
```

## Which columns can't be (usefully) indexed?

Columns with very low selectivity (e.g. a bit/flag with 50/50 distribution), huge text/blob columns (need full-text search instead), heavily updated columns (index maintenance cost), computed values not persisted.

## Interview one-liners

- "Clustered index *is* the table's physical order — that's why there's only one."
- "Indexes trade write speed and storage for read speed; a covering index can satisfy a query without touching the table."
