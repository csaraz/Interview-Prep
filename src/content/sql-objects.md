---
title: Views, Triggers, Stored Procedures, Functions, Cursors
level: Mid
category: SQL & Database
tags: sql, views, triggers, stored-procedures, functions, cursors
order: 70
---

## Views

A view is a **virtual table** based on the result of an SQL statement. Benefits:

1. **Security** — expose a subset of data; a user may query the view while being denied the base tables
2. **Simplification** — join multiple tables into one virtual table
3. **Aggregation** — present calculated results (SUM, AVG) as data
4. **Hide complexity / partitioning** — e.g. `Sales2000`, `Sales2001` views over one table
5. **Tiny storage** — only the definition is stored, not the data

## Triggers

A set of SQL statements that runs **automatically** when a database event occurs (a specialized stored procedure). Used for integrity/referential rules that plain constraints can't express.

- Cannot be invoked manually; no parameters; cannot commit/rollback inside
- Six types: AFTER/BEFORE × INSERT/UPDATE/DELETE

**Trigger vs Stored Procedure:** triggers fire automatically on data modification events; procedures must be invoked explicitly.

## Stored Procedures

A group of **pre-compiled** SQL statements stored as a named object in the server. SQL Server builds the execution plan on first call and **caches** it — subsequent calls are fast. Callable from apps, other procedures, triggers.

Pros: performance (cached plan), security (parameterized → less SQL injection), complex logic (loops, conditions, transactions).
Cons: version control is hard (logic lives in the DB), business logic spread across layers.

## Functions vs Stored Procedures

| | Function | Stored Procedure |
|---|---|---|
| Return value | **Must** return one | Optional (0..n outputs) |
| Parameters | Input only | Input and output |
| Calls | Callable from SELECT/WHERE/JOIN | Not usable inside queries |
| Statements | SELECT only | SELECT + INSERT/UPDATE/DELETE |
| Call each other | Function can't call SP | SP can call functions |
| try/catch | ❌ | ✅ |
| Transactions | ❌ | ✅ |

Table-valued functions can be used in JOINs like rowsets.

## Cursors

A cursor is temporary memory allocated for **row-by-row** processing of DML results — for updates/calculations impossible in set-based operations.

- **Implicit** — created by the server automatically during DML
- **Explicit** — user-defined for row-by-row fetching:

```sql
DECLARE s1 CURSOR FOR SELECT * FROM studDetails;
OPEN s1;
FETCH NEXT FROM s1;   -- also FIRST, LAST, PRIOR, ABSOLUTE n, RELATIVE n
CLOSE s1;
DEALLOCATE s1;
```

> In practice: avoid cursors when a set-based query can do the job — they're slow.

## Interview one-liners

- "A view stores a query, not data — security + simplification for free."
- "Functions compute and return; procedures *do things* (DML, transactions, error handling)."
