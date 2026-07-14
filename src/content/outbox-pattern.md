---
title: Outbox & Transactional Outbox Pattern
level: Lead
category: Patterns & Architecture
tags: outbox, messaging, distributed-systems, consistency, microservices
order: 140
---

## The problem: dual write

A service must (1) save to its database **and** (2) publish an event to a message broker. Two systems, no shared transaction:

- Save succeeds, publish fails → other services never learn about the order
- Publish succeeds, save fails → other services react to an order that doesn't exist

You can't wrap a DB and Kafka/RabbitMQ in one atomic transaction.

## The solution: Transactional Outbox

Write the outgoing message **into the same database, in the same transaction** as the business data:

```
BEGIN TRANSACTION
  INSERT INTO Orders (...)
  INSERT INTO OutboxMessages (Id, Type, Payload, CreatedAt, ProcessedAt = NULL)
COMMIT
```

Because both inserts share one local transaction, they're **atomic** — either both exist or neither.

Then a separate **relay/publisher process** (background service or CDC tool like Debezium):

1. Polls `OutboxMessages` for unprocessed rows
2. Publishes each to the broker
3. Marks the row processed (or deletes it)

## Delivery semantics

- Result: **at-least-once** delivery (the relay may crash after publishing but before marking) → consumers must be **idempotent** (dedupe by message Id)
- Ordering: process outbox rows in creation order per aggregate

## Sketch in .NET

```csharp
// same DbContext transaction
_db.Orders.Add(order);
_db.OutboxMessages.Add(new OutboxMessage
{
    Id = Guid.NewGuid(),
    Type = "OrderPlaced",
    Payload = JsonSerializer.Serialize(new { order.Id, order.Total })
});
await _db.SaveChangesAsync(); // atomic

// BackgroundService relay
var pending = await _db.OutboxMessages
    .Where(m => m.ProcessedAt == null)
    .OrderBy(m => m.CreatedAt)
    .Take(20)
    .ToListAsync(ct);

foreach (var msg in pending)
{
    await _bus.PublishAsync(msg.Type, msg.Payload, ct);
    msg.ProcessedAt = DateTime.UtcNow;
}
await _db.SaveChangesAsync(ct);
```

Libraries that implement this: **CAP**, MassTransit (outbox feature), NServiceBus.

## Related: Saga

For multi-service workflows (order → payment → shipping), sagas chain local transactions with **compensating actions** on failure; the outbox is the reliable messaging foundation underneath.

## Interview one-liners

- "Outbox solves the dual-write problem: message and data commit in one local transaction; a relay publishes afterwards."
- "It gives at-least-once delivery — so consumers must be idempotent."
