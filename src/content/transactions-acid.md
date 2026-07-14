---
title: Transactions & ACID
level: Mid
category: SQL & Database
tags: sql, transactions, acid, commit, rollback
order: 20
---

## What is a transaction?

A transaction groups a set of operations into a **single unit of work**. If it succeeds, all modifications are **committed** and become permanent; on error, everything is **rolled back**. A transaction reads values into a buffer and writes changes back — dirty reads originate from this buffering.

## ACID

| Property | Meaning |
|---|---|
| **Atomicity** | All or nothing — abort undoes everything, commit makes all visible |
| **Consistency** | Integrity constraints hold before and after the transaction |
| **Isolation** | Concurrent transactions don't interfere; changes invisible to others until committed |
| **Durability** | Once committed, changes survive system failures (written to non-volatile storage) |

## Transaction control in SQL

Used only with DML (INSERT/UPDATE/DELETE):

```sql
BEGIN TRANSACTION my_tx;

DELETE FROM Student WHERE AGE = 20;

SAVEPOINT SP1;                 -- checkpoint inside the transaction
DELETE FROM Student WHERE AGE = 21;

ROLLBACK TO SP1;               -- undo back to the savepoint only
COMMIT;                        -- make the rest permanent
```

- `BEGIN TRANSACTION` — start
- `COMMIT` — save all changes since last COMMIT/ROLLBACK
- `ROLLBACK` — undo since last COMMIT/ROLLBACK
- `SAVEPOINT name` / `ROLLBACK TO name` — partial rollback
- `RELEASE SAVEPOINT name` — discard a savepoint
- `SET TRANSACTION [READ WRITE | READ ONLY]` — characteristics

Setting isolation level:

```sql
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;
SELECT * FROM Categories;
COMMIT TRANSACTION;
```

## Integrity constraints (related)

- **Domain constraint** — column values must be from the valid set (no "A" in an int column)
- **Entity integrity** — primary key can't be NULL
- **Referential integrity** — FK value must exist in the parent table (or be NULL)
- **Key constraints** — uniqueness of identifying columns

## Interview one-liners

- "ACID: atomic all-or-nothing, consistent constraints, isolated concurrency, durable commits."
- "SAVEPOINT enables partial rollback inside one transaction."
