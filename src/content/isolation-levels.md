---
title: Isolation Levels & Read Phenomena
level: Senior
category: SQL & Database
tags: sql, isolation-levels, dirty-read, phantom-read, concurrency
order: 30
---

Isolation levels define **how much a transaction is protected** from modifications made by other concurrent transactions.

## The three read phenomena

**Dirty Read** — reading data that is **not yet committed**. T1 updates a row without committing; T2 reads it; T1 rolls back → T2 read data that never existed.

**Non-Repeatable Read** — reading the **same row twice returns different values**. T1 reads; T2 updates + commits; T1 re-reads → different value.

**Phantom Read** — the **same query returns different row sets**. T1 selects rows matching a condition; T2 inserts new matching rows; T1 re-runs the query → new "phantom" rows appear.

## The four standard levels

| Level | Dirty read | Non-repeatable read | Phantom read |
|---|---|---|---|
| **Read Uncommitted** | ❌ possible | ❌ possible | ❌ possible |
| **Read Committed** | ✅ prevented | ❌ possible | ❌ possible |
| **Repeatable Read** | ✅ prevented | ✅ prevented | ❌ possible |
| **Serializable** | ✅ prevented | ✅ prevented | ✅ prevented |

- **Read Uncommitted** — lowest; transactions not isolated at all; allows dirty reads
- **Read Committed** — only committed data is read; read/write locks on the current row (default in SQL Server)
- **Repeatable Read** — read locks on all referenced rows, write locks on inserted/updated/deleted rows; rows you've read can't change under you
- **Serializable** — highest; concurrent transactions appear to execute **serially**; range locks prevent phantoms

> Snapshot isolation (row-versioning) achieves repeatable reads without blocking readers — the basis of **optimistic concurrency control** (compare versions at commit rather than locking upfront; EF Core's `RowVersion` works this way).

## Trade-off

Higher isolation = fewer anomalies but **more locking, less concurrency, more deadlock risk**. Choose per operation: reporting can tolerate lower levels; financial writes need higher.

## Interview one-liners

- "Dirty read: uncommitted. Non-repeatable: row changed between reads. Phantom: row *set* changed between reads."
- "Each level up eliminates one phenomenon; Serializable eliminates all at the price of concurrency."
