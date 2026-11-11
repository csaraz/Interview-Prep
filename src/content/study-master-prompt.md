---
title: "Master Prompt + Full Topic Checklist"
level: Senior
category: Interview Lists
tags: prompt, checklist, preparation, lesson, dotnet, distributed-systems
order: 1
---

The reusable prompt for studying any topic, and the complete list to work through from the top.

## The master prompt

Paste this, replace `{TOPIC}`:

```text
You are teaching a senior .NET engineer (9 years, production experience) who is
preparing for senior backend interviews.

TOPIC: {TOPIC}

Style rules:
- Keep explanations SHORT and plain. No long paragraphs, no academic tone.
- Every concept must come with a small C# code example.
- Prefer bad-code / good-code pairs over prose.
- Assume I have shipped production systems. Do not explain basics like "what is a queue".
- Do explain WHY the design is the way it is, and what breaks in production.

Structure your answer exactly like this:
1. One line: what this actually is
2. Why it matters (max 3 sentences)
3. Code: the wrong way, then the right way
4. Failure modes: what breaks in production and the symptom I would observe
5. Five interview questions on this topic, each with a short bullet list of what a
   strong answer contains
6. Checklist: what to grep for or check in my own codebase

Do not quiz me. Teach me.
```

Variants worth keeping:

- **Deeper dive:** add `Also show what the compiler/runtime does under the hood, and name the thing people most often state wrong about this topic.`
- **Comparison topics:** add `Give a comparison table with the cost of each option, not just the benefit.`
- **If it's a weak area:** add `Assume I have never used this in production. Start from the first principle.`

## Full topic checklist

### Block 1 — C# language and runtime
1. Value vs reference types, stack vs heap, boxing/unboxing
2. `ref`, `out`, `in`, `ref struct`, `Span<T>`, `Memory<T>`
3. Strings: immutability, interning, `StringBuilder`, allocation cost
4. Equality: `==` vs `Equals`, `GetHashCode`, `IEquatable`, records
5. Generics, constraints, covariance/contravariance
6. Delegates, events, lambdas, closures (and captured-variable traps)
7. LINQ: deferred execution, `IEnumerable` vs `IQueryable`
8. Exceptions: `throw` vs `throw ex`, filters, `finally`, custom exceptions, cost
9. `IDisposable`, `using`, finalizers, `IAsyncDisposable`
10. GC: generations, LOH, allocation pressure, Server vs Workstation GC
11. CLR and JIT: IL, tiered compilation, ReadyToRun/AOT, assemblies
12. Modern C#: nullable reference types, pattern matching, records, `init`
13. Reflection, attributes, source generators

### Block 2 — Concurrency and async
14. Threads vs thread pool vs `Task` ✅ *(Lesson 1 done)*
15. `async`/`await` mechanics: state machine, `SynchronizationContext`, `ConfigureAwait`
16. `ValueTask`, `IAsyncEnumerable`, async streams
17. `CancellationToken`, timeouts, linked tokens
18. `lock`/`Monitor`, `Interlocked`, `volatile`, memory barriers
19. `SemaphoreSlim`, `Mutex`, `ReaderWriterLockSlim`
20. Concurrent collections
21. `Parallel.For`/`ForEach`, PLINQ, partitioning
22. `Channel<T>`, producer/consumer, backpressure
23. Diagnosing deadlock, race condition, starvation
24. Thread-safety patterns: immutability, confinement, copy-on-write

### Block 3 — ASP.NET Core
25. Hosting model, Kestrel, generic host, `Program.cs`
26. Middleware pipeline: `Use` / `Run` / `Map`, and why order matters
27. Routing, model binding, validation
28. Filters vs middleware
29. DI container, lifetimes, captive dependency
30. Configuration, Options pattern, secrets
31. Logging with Serilog, structured logging, correlation IDs
32. Health checks and graceful shutdown
33. Authentication and authorization: JWT, OAuth2/OIDC, Keycloak
34. CORS: what it is, why it exists, how it breaks
35. API versioning, OpenAPI/Swagger
36. Rate limiting, idempotency keys, pagination
37. Error handling: `ProblemDetails`, global exception middleware
38. `BackgroundService` / `IHostedService`
39. Minimal APIs vs controllers
40. Output caching, response compression
41. SignalR / WebSockets basics
42. Testing: unit, integration (`WebApplicationFactory`), Testcontainers

### Block 4 — EF Core and SQL Server
43. `DbContext`, change tracking, `AsNoTracking`
44. Eager / lazy / explicit loading, the N+1 problem
45. Migrations and model configuration
46. Transactions, optimistic concurrency (`RowVersion`)
47. Compiled queries, projections, performance tuning
48. Dapper: when and why instead of EF
49. Indexes: clustered, non-clustered, covering, included columns
50. Execution plans: seek vs scan, key lookup, SARGability
51. Parameter sniffing, statistics, plan cache
52. Isolation levels, locking, blocking, deadlocks
53. Query design: joins, CTEs, window functions, set-based thinking
54. Data modeling: normalization, keys, upsert/`MERGE`, bulk operations
55. Stored procedures, views, functions, triggers
56. Large tables: partitioning, archiving

### Block 5 — Caching and Redis
57. Caching patterns: cache-aside, read-through, write-through, write-behind
58. Invalidation, TTL, cache stampede protection
59. Redis data structures and when each is correct
60. Distributed locks (`SET NX EX`, and the Redlock debate)
61. Rate limiting with Redis
62. Persistence (RDB/AOF), replication, cluster, eviction policies
63. In-memory cache vs distributed cache

### Block 6 — Messaging: RabbitMQ and Kafka
64. Fundamentals: queue vs log, point-to-point vs pub/sub
65. RabbitMQ: exchanges, bindings, acks, prefetch, DLX, quorum queues
66. Kafka: topics, partitions, offsets, consumer groups, rebalancing
67. Delivery semantics: at-most-once, at-least-once, "exactly-once"
68. Idempotent consumers and deduplication
69. Ordering guarantees and partition keys
70. Outbox and inbox patterns
71. Schema evolution: Avro/Protobuf/JSON, compatibility rules
72. MassTransit: consumers, retry policies, sagas
73. Choosing between Azure Service Bus, RabbitMQ and Kafka

### Block 7 — Microservices and distributed systems
74. Service boundaries, DDD bounded contexts
75. Database per service, data ownership
76. Sync vs async communication: REST, gRPC, messaging
77. Saga: orchestration vs choreography, compensation
78. CAP, consistency models, eventual consistency
79. Idempotency, retries, timeouts, backoff with jitter
80. Circuit breaker, bulkhead, fallback (Polly)
81. API gateway, BFF, service discovery
82. Distributed tracing, correlation, OpenTelemetry
83. Observability: logs, metrics, traces, SLO/SLI, alert design
84. Caching in distributed systems, coherence
85. Distributed transactions: 2PC vs saga
86. Event sourcing and CQRS
87. Clock skew, ordering, idempotency keys
88. Leader election and consensus (Raft) — awareness level
89. Load balancing, scaling, autoscaling (HPA, KEDA)
90. Deployment: blue-green, canary, feature flags
91. Chaos/resilience testing
92. Multi-tenancy patterns

### Block 8 — Architecture and engineering practice
93. Clean / Onion / Hexagonal architecture
94. SOLID and the GoF patterns that actually come up
95. Repository and Unit of Work — when they earn their keep
96. Testing strategy: pyramid, mock vs fake vs stub, TDD
97. CI/CD, Docker, Kubernetes basics
98. Security: OWASP top 10, secrets management, injection, XSS, CSRF
99. Performance: profiling, BenchmarkDotNet, measuring before optimising
100. AI-assisted development workflow (how you actually use it)
