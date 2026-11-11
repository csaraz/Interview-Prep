---
title: "Role Prep: Senior .NET Integration Engineer (lesson plan)"
level: Senior
category: Interview Lists
tags: interview-qa, checklist, preparation, lesson, dotnet
order: 5
---

Prep track for the DistantJob / fintech AP platform role. **Format: lessons, not quizzes.** Each lesson is: mental model → the mechanism precisely (including what gets stated wrong) → trade-offs with their costs → the five questions an interviewer asks.

## The order (as decided)

**Block A — .NET core and concurrency**
1. **Threads, the thread pool, and what async actually buys you** ✅ written
2. **async/await mechanics** — the state machine, SynchronizationContext, ConfigureAwait, ValueTask, async streams, cancellation
3. **Synchronization and the memory model** — lock/Monitor, Interlocked, volatile and barriers, SemaphoreSlim, concurrent collections: which is correct when
4. **Parallelism** — Parallel.For/ForEach, PLINQ, partitioning, Channels, backpressure
5. **Memory and GC under load** — generations, LOH, allocation pressure, pooling, Span

**Block B — ASP.NET Core**
6. Request pipeline and middleware, filters, model binding
7. DI lifetimes and the captive-dependency class of bugs
8. API design under failure: timeouts, retries, idempotency, rate limiting
9. EF Core and Dapper: tracking, N+1, projections, compiled queries

**Block C — Data and messaging**
10. SQL Server: query design and execution plans
11. SQL Server: modeling, upserts, bulk operations, concurrency and isolation
12. **Redis** — caching patterns, invalidation, distributed locks, rate limiting
13. **Kafka** — log semantics, partitions, consumer groups, delivery guarantees
14. RabbitMQ vs Kafka vs Service Bus: choosing, and the outbox underneath

**Block D — Distributed systems**
15. Microservices boundaries, data ownership, the distributed monolith trap
16. Consistency: sagas, outbox, idempotency, exactly-once as a myth
17. Resilience: circuit breakers, bulkheads, backoff with jitter, graceful degradation
18. Observability: correlation ids, tracing, SLOs, and how to run an RCA

**Block E — Interview delivery**
19. The three stories (performance win, reliability rebuild, ownership) with numbers
20. Mock: behavioural + a live design question

## The three stories to have polished

1. **Performance:** the SQL rework — covering indexes, tighter lock scope, removed per-request redundant queries; p50/p90/p99 down 7×–70×, tail improving most. Have the *measurement method* ready — that's what a Staff Engineer probes.
2. **Reliability:** notification pipeline — Outbox for atomic at-least-once publishing, six priority RabbitMQ quorum queues via MassTransit, Hazelcast→Redis so consumers went stateless.
3. **Ownership:** only senior engineer on the backend platform team, 3–4 parallel workstreams; the query-review practice and the chaos-environment failure-mode map became team standards.

## The honesty line, pre-scripted

> "I haven't worked with NetSuite, QuickBooks, Sage or Dynamics specifically. I have worked on financial systems — insurance policy issuance and payments — and the patterns underneath that work are my daily job: REST and SOAP with real authentication and versioning, retries and idempotency, delta sync, reconciliation against an authoritative record, and partial-failure handling with audit trails."

Said once, early, without apology — then redirect to pattern depth.
