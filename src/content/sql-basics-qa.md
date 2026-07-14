---
title: SQL Essentials Q&A — Keys, Joins, Clauses, Commands
level: Junior
category: SQL & Database
tags: sql, keys, joins, ddl-dml, where-having
order: 10
---

## Advantages of a DBMS over file-based systems

Solves: data redundancy & inconsistency, difficult access, data isolation (multiple files/formats), integrity problems, atomicity of updates, concurrent multi-user access, security.

## Keys

- **Primary key** — uniquely identifies each record; **unique + NOT NULL**; one per table (can span multiple columns)
- **Unique constraint** — unique but **can contain NULL**; multiple allowed per table
- **Foreign key** — field(s) referencing another table's primary key; prevents inserting invalid references (child table → parent table)
- **Candidate keys** — all keys that could serve as PK; **super key** — any set of columns that uniquely identifies rows

## DDL vs DML vs DCL

| Language | Commands |
|---|---|
| **DDL** (Definition) | CREATE, ALTER, DROP, RENAME |
| **DML** (Manipulation) | SELECT, INSERT, UPDATE, DELETE |
| **DCL** (Control) | GRANT, REVOKE |

## WHERE vs HAVING

- `WHERE` filters **rows, before grouping**; cannot contain aggregate functions
- `HAVING` filters **groups, after grouping**; used with aggregates

```sql
-- find duplicate names
SELECT NAME FROM Person
GROUP BY NAME
HAVING COUNT(NAME) > 1;
```

## JOIN

Combines data from two or more tables based on a common field. Types: INNER, LEFT, RIGHT, FULL, **CROSS JOIN** (cartesian product — every row of A × every row of B; no join condition).

## DELETE vs TRUNCATE

| | DELETE | TRUNCATE |
|---|---|---|
| Language | DML | DDL |
| WHERE clause | Yes | No — removes all rows |
| Speed | Slower (row-by-row logging) | Fast |
| Rollback | Yes | Yes (within a transaction) |

## CHAR vs VARCHAR

- `CHAR(n)` — **fixed** length, static allocation, faster
- `VARCHAR(n)` — **variable** length, dynamic allocation, saves space

## Interview one-liners

- "PK = unique + not null, one per table; unique constraint allows NULL and many per table."
- "WHERE filters rows before GROUP BY; HAVING filters aggregated groups after."
