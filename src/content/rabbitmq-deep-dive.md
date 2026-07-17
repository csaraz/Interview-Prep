---
title: RabbitMQ Deep Dive — Exchanges, Quorum Queues, MassTransit
level: Senior
category: Patterns & Architecture
tags: rabbitmq, messaging, masstransit, quorum-queues, dlq
order: 65
---

## Core model

Producers publish to an **exchange**; the exchange routes to **queues** by rules; **consumers** read from queues. Routing is the key concept:

| Exchange type | Routing behavior |
|---|---|
| **Direct** | Exact routing-key match |
| **Topic** | Pattern match (`order.*`, `#.critical`) |
| **Fanout** | Broadcast to all bound queues |
| **Headers** | Match on message headers |

## Delivery semantics

- **Ack/Nack** — consumer acknowledges after processing; unacked messages are redelivered (at-least-once → consumers must be **idempotent**)
- **Prefetch (QoS)** — how many unacked messages a consumer may hold; tune for throughput vs fairness
- **Publisher confirms** — broker acknowledges the publish; without them, a broker crash can silently drop messages
- **Dead-letter exchange (DLX)** — rejected/expired messages route to a dead-letter queue for inspection/retry — the standard poison-message strategy

## Classic vs Quorum queues (modern interview question)

| | Classic (mirrored) | **Quorum** |
|---|---|---|
| Replication | Legacy mirroring (deprecated) | **Raft consensus** |
| Data safety | Weaker failure modes | Strong — majority must persist |
| Use | Old setups | **Default for anything important** |

Quorum queues trade some raw throughput for **guaranteed durability and predictable failover** — the right choice for business-critical messages (notifications, payments).

## Priority handling — the right way

Per-message priority flags on one queue are weak (priorities only apply to messages *waiting* in memory). The robust pattern: **separate queues per priority tier** (e.g. 6 priority-based queues), each with its own consumers — an OTP never waits behind a marketing batch, and each tier **scales independently**.

## MassTransit (the .NET layer)

Abstraction over RabbitMQ (and Azure Service Bus): typed messages, consumers as classes, and built-in patterns:

```csharp
public class OrderPlacedConsumer : IConsumer<OrderPlaced>
{
    public async Task Consume(ConsumeContext<OrderPlaced> context)
    {
        // handle; throw → MassTransit retry policy → error queue
    }
}
```

Gives you: retry policies with backoff, error/skipped queues, sagas (state machines), **transactional outbox integration**, and testability. Interview line: "MassTransit turns raw AMQP into typed consumers with retries, DLQs, and outbox out of the box."

## Reliability recipe (end-to-end)

1. Publisher: **Outbox pattern** (same DB transaction as business data) → relay publishes
2. Broker: **quorum queues** + publisher confirms
3. Consumer: **idempotent** handling + ack after success + DLX for poison messages

That chain gives effectively-once processing on at-least-once infrastructure.

## Interview one-liners

- "Exchange routes, queue stores, consumer acks — and everything critical goes on quorum queues."
- "Priority = separate queues per tier, not priority flags — that's also how you scale tiers independently."
- "At-least-once + idempotent consumer + DLX = the reliability triad."
