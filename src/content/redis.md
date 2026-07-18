---
title: Redis — Caching, Data Structures, Patterns
level: Mid
category: SQL & Database
tags: redis, caching, distributed-cache, rate-limiting, performance
order: 80
---

## What is Redis?

An in-memory key-value data store — used as a **distributed cache**, session store, rate limiter, message broker (pub/sub), and lightweight database. Sub-millisecond reads because everything lives in RAM.

## Core data structures (know these cold)

| Structure | Example use |
|---|---|
| **String** | Cache a serialized object, counters (`INCR`) |
| **Hash** | Object with fields (`user:1` → name, email) — partial updates |
| **List** | Queues, recent-items feeds (`LPUSH`/`RPOP`) |
| **Set** | Unique members, tags (`SADD`, `SISMEMBER`) |
| **Sorted Set (ZSet)** | Leaderboards, rate limiting by timestamp score |
| **Streams** | Append-only log with consumer groups (Kafka-lite) |

## Caching patterns

**Cache-aside (most common):**

```csharp
var cached = await cache.GetStringAsync(key);
if (cached is not null) return Deserialize(cached);

var data = await db.LoadAsync(id);                       // cache miss → DB
await cache.SetStringAsync(key, Serialize(data),
    new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10) });
return data;
```

**The hard part is invalidation** (classic interview follow-up):
- **TTL** — every entry expires; stale window is bounded
- **Explicit invalidation** — delete/update the key when the source changes
- **Cache stampede** protection — when a hot key expires, hundreds of requests hit the DB at once; mitigate with a lock (only one rebuilds) or staggered TTLs

## Distributed concerns

- **Rate limiting** — fixed/sliding window with `INCR` + `EXPIRE`, or sorted sets of timestamps; atomic via Lua scripts
- **Distributed lock** — `SET key value NX EX 30`; release only if the value matches yours (Lua). For stricter guarantees, know that Redlock exists and is debated
- **Sessions / shared state** — replaces sticky sessions when scaling stateless services horizontally (this is why Redis appears in every microservices migration)

## Persistence & availability (senior follow-ups)

- **RDB** — periodic snapshots (fast restart, may lose last minutes)
- **AOF** — append-only command log (more durable, bigger)
- **Replication + Sentinel** — HA with automatic failover; **Cluster** — sharding across nodes
- Eviction policies when memory is full: `allkeys-lru`, `volatile-lru`, `noeviction`…

## Redis vs Hazelcast (a real migration question)

**What they are:** Hazelcast is an **In-Memory Data Grid (IMDG)** from the Java world — its signature mode is *embedded*: the cache lives inside the application's own process, nodes cluster together, data is partitioned across them, and it can even run distributed computations on the node holding the data. Redis is a standalone **client-server** in-memory store: apps connect over the network to a separate process.

| | Hazelcast | Redis |
|---|---|---|
| Model | **Embedded** in app process (or client-server) | **Client-server** (separate process) |
| Ecosystem | JVM-native (first-class in Java) | Language-agnostic, first-class clients everywhere |
| Data | Objects (Java serialization) | Data structures (string, hash, zset, stream) |
| Distributed compute | Yes (entry processors, executors) | No (Lua scripting is a different thing) |
| Latency | Ultra-low in embedded mode (no network hop) | Sub-ms, but a network hop exists |
| Operations | Cluster lives with the app — deploy/memory coupled | Managed separately; mature hosted options (Azure Cache, ElastiCache) |

**When Hazelcast makes sense:** JVM monolith, ultra-low-latency where even a network hop is too much (trading), distributed computation over cached data.

**When Redis makes sense:** polyglot/microservices environment, **stateless services** (cache must live *outside* the process), shared state like rate limiting/sessions/locks, operational simplicity and managed hosting.

**The migration answer (interview-ready):**

> "Three reasons. First, ecosystem fit: we're a .NET shop — Hazelcast is JVM-native and its .NET client is a second-class citizen, while Redis has first-class clients everywhere. Second, statelessness: Hazelcast's embedded model couples cache state to application processes — exactly what we were eliminating; moving cache out of process into Redis is what made our consumers stateless and horizontally scalable. Third, operations: Redis is simpler to run with mature managed offerings, and one shared Redis serves caching, rate limiting, and distributed locks. We weren't using Hazelcast's real differentiator — distributed compute — so we were paying its complexity for nothing."

## Interview one-liners

- "Cache-aside + TTL is the default; the interview question is always invalidation and stampedes."
- "Redis is single-threaded per shard — that's why commands are atomic and Lua scripts run without races."
- "`SET NX EX` is a distributed lock in one command — release must check ownership."
