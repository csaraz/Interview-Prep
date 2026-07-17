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

Both are in-memory data grids/caches. Redis wins on: operational simplicity, ecosystem/client maturity, managed offerings, and single-threaded predictable performance. Hazelcast embeds into the JVM app process; in .NET shops it's an odd fit — which is exactly why migrations to Redis happen.

## Interview one-liners

- "Cache-aside + TTL is the default; the interview question is always invalidation and stampedes."
- "Redis is single-threaded per shard — that's why commands are atomic and Lua scripts run without races."
- "`SET NX EX` is a distributed lock in one command — release must check ownership."
