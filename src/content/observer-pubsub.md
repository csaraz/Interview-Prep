---
title: Observer & Pub/Sub (+ Message Brokers, Kafka)
level: Senior
category: Patterns & Architecture
tags: observer, pub-sub, kafka, message-broker, events
order: 60
---

## Observer pattern

One-to-many dependency: when the **subject** changes state, all registered **observers** are notified automatically.

```csharp
public interface IObserver { void Update(decimal price); }

public class Stock
{
    private readonly List<IObserver> _observers = new();
    private decimal _price;

    public void Subscribe(IObserver o) => _observers.Add(o);
    public void Unsubscribe(IObserver o) => _observers.Remove(o);

    public decimal Price
    {
        get => _price;
        set { _price = value; Notify(); }
    }

    private void Notify()
    {
        foreach (var o in _observers) o.Update(_price);
    }
}
```

**In C#, `event` is the built-in Observer implementation** — subscribers `+=`, the subject raises. (See the Events article.)

## Pub/Sub — Observer at architecture scale

Same idea, but **publisher and subscribers don't know each other** — a **broker** sits between them:

| | Observer | Pub/Sub |
|---|---|---|
| Coupling | Subject holds references to observers | Publisher and subscriber know only the **topic/channel** |
| Scope | In-process | Cross-process / cross-service |
| Delivery | Synchronous method calls | Async via broker (queue/log) |

## Message brokers

Middleware that receives messages from publishers and routes them to subscribers: **RabbitMQ**, **Kafka**, **Azure Service Bus**.

Benefits: decoupling, buffering under load, retries, fan-out to many consumers, async processing.

### Kafka in two minutes

- A **distributed log**: messages are appended to **topics**, split into **partitions**
- Messages are **persisted** (retention period) — consumers can re-read/replay
- **Consumer groups**: each partition is consumed by one member of the group → horizontal scaling
- Ordering is guaranteed **within a partition** (key-based routing)
- Great for event streaming, high throughput; heavier than RabbitMQ for simple queueing

### RabbitMQ vs Kafka (short)

- RabbitMQ: traditional message queue, routing (exchanges), message removed after ack — good for task/work queues
- Kafka: append-only log, replayable, massive throughput — good for event streams and integration backbones

## Interview one-liners

- "Observer = in-process events; Pub/Sub = same idea decoupled through a broker."
- "Kafka is a replayable distributed log; ordering per partition, scaling per consumer group."
