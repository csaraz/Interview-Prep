---
title: Database Normalization
level: Mid
category: SQL & Database
tags: sql, normalization, normal-forms, data-modeling
order: 40
---

## What is normalization?

Restructuring a relational database according to **normal forms** to **reduce data redundancy** and **improve data integrity**. Redundancy = multiple copies of the same information spread across the database — the enemy of consistency.

It's done by organizing columns and tables so dependencies are enforced by integrity constraints — via synthesis (new design) or decomposition (improving an existing design).

## The normal forms (practical definitions)

**1NF — First Normal Form**
No repeating groups; atomic values. If data repeats, extract it into a separate table with a **one-to-many** relationship.

**2NF — Second Normal Form**
Must be in 1NF, and **all non-key columns depend on the whole primary key**. If columns depend on only part of a **composite key** (partial dependency), move them to another table and re-establish the relationship.

**3NF — Third Normal Form**
Must be in 2NF, and no **transitive dependencies** — if a table holds data that doesn't belong to/depend on its key, extract it into its own table and link by ID.

**BCNF (3.5NF), 4NF, 5NF, 6NF** — stricter forms; know they exist, rarely probed deeply in interviews.

## Example progression

Employee table with department name+location repeated on every row:

1. **1NF**: atomic columns, no repeating groups
2. **2NF**: department data moved to `Dept` table (was partially dependent)
3. **3NF**: employee table keeps only `DeptId` FK; all non-key columns now fully depend on the employee PK

## When to denormalize

Reporting/read-heavy paths sometimes duplicate data deliberately for speed (fewer JOINs) — a conscious trade-off, often paired with caching or materialized views.

## Interview one-liners

- "1NF: atomic values. 2NF: no partial dependency on a composite key. 3NF: no transitive dependencies."
- "Normalize for integrity, denormalize (deliberately) for read performance."
