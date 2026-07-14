---
title: Execution Plans — Scans, Seeks, Lookups
level: Senior
category: SQL & Database
tags: sql, execution-plan, table-scan, index-seek, query-optimization
order: 60
---

## What is an execution plan?

A graphical representation of the steps the DB engine takes to fetch results. When a query runs, the engine generates candidate plans and picks the best-performing one. The plan depends on **available indexes** and **current data volume**.

- **Estimated plan** — the optimizer's guess *before* execution
- **Actual plan** — real operations *after* execution (may differ from estimate)

Tools: SSMS graphical plans, PostgreSQL `EXPLAIN ANALYZE`, MySQL `EXPLAIN`. SQL Profiler traces what queries actually hit the server.

## The operators to know

| Operator | What happens | Speed |
|---|---|---|
| **Table Scan** | No index → read the **entire table** | 🐌 worst |
| **Clustered Index Scan** | Read the whole table via the clustered index (unfiltered search, or filter on an unindexed column) | 🐌 slow |
| **Clustered Index Seek** | Filtered search **by the clustered index** — direct navigation | ⚡ fast |
| **Non-Clustered Index Scan** | Read all rows of a non-clustered index column (unfiltered) | 🚶 medium |
| **Non-Clustered Index Seek** | Filter on a non-clustered indexed column — direct lookup, no full read | ⚡ fast |
| **Key Lookup** | After a non-clustered seek, fetch **additional columns** from the clustered index per row | ⚠️ bad when >50% of plan cost |
| **RID Lookup** | Same as key lookup but on a heap (no clustered index) | ⚠️ |
| **Sort** | Explicit ordering when no index provides it | depends |

## Reading a plan in practice

```sql
SELECT * FROM Users WHERE Email = 'test@test.com';
```

The engine decides: full table scan? index seek? join order? Look for:

1. Scans on large tables → missing/unused index
2. Expensive **Key Lookups** → consider a covering index (INCLUDE columns)
3. Big discrepancies between estimated and actual row counts → stale statistics

## Practical optimization moves

- Select only needed columns (never `SELECT *`)
- Build the right indexes; check they're actually used
- Put filters early; write **sargable** predicates (no functions around indexed columns)
- Fix N+1 at the ORM level (`Include` / projection)
- Cached/compiled queries for hot paths

## Interview one-liners

- "Seek = targeted navigation, Scan = read everything. The goal of indexing is turning scans into seeks."
- "A Key Lookup per row means the index doesn't cover the query — add INCLUDE columns."
