---
title: Kafka Deep Dive — Partitions, Consumer Groups, Semantics
level: Senior
category: Patterns & Architecture
tags: kafka, streaming, event-driven, partitions, consumer-groups
order: 66
---

## What Kafka actually is

A **distributed, append-only log**. Producers append records to **topics**; records are never modified; consumers read at their own pace by **offset**. Messages are **retained** (time/size based) regardless of consumption — consumers can rewind and **replay**. That's the fundamental difference from a queue: RabbitMQ deletes on ack, Kafka keeps the log.

## Partitions — the scaling unit

- A topic is split into **partitions**; each is an ordered log
- **Ordering is guaranteed only within a partition** — records with the same **key** (e.g. entity ID) always land in the same partition, so per-entity ordering holds
- More partitions = more parallelism (but also more overhead — don't over-partition)

## Consumer groups

- Consumers in one **group** split the partitions among themselves — each partition is read by exactly **one** consumer in the group → horizontal scaling
- Different groups each get the **full stream** independently (fan-out for free)
- **Rebalancing** happens when consumers join/leave — brief pause, know it exists
- **Offsets** are committed per group — "where am I in the log"; commit *after* processing for at-least-once

## Delivery semantics

| Semantics | How |
|---|---|
| At-most-once | Commit offset before processing (risk: loss) |
| **At-least-once** (default choice) | Process, then commit (risk: duplicates → idempotent consumers) |
| Effectively/exactly-once | Idempotent producer + transactions (Kafka-internal), or dedupe keys at the consumer |

Producer side: `acks=all` + idempotent producer for durability; retries are safe.

## Kafka vs RabbitMQ (asked constantly)

| | RabbitMQ | Kafka |
|---|---|---|
| Model | Smart broker, per-message routing | Dumb log, smart consumers |
| Message fate | Deleted after ack | **Retained, replayable** |
| Ordering | Per queue | Per partition (by key) |
| Strength | Command/task queues, priorities, per-message ack, complex routing | **Event streams**, huge throughput, replay, multiple independent readers |
| Typical .NET pairing | MassTransit | Confluent.Kafka client |

Real-world split (from practice): RabbitMQ for command-style notifications with priority tiers and per-message acks; Kafka for streaming/replayable ingestion pipelines (e.g. webhook event ingestion) where DB-backed queuing would create write contention.

## When Kafka is the answer

- High-throughput event ingestion (webhooks, telemetry, clickstreams)
- Multiple consumers needing the same events independently
- Replay requirements (rebuild a projection, backfill a new service)
- Event sourcing / stream processing backbones

When it isn't: simple work queues, per-message priority, low-volume RPC-ish messaging — that's RabbitMQ territory.

## Interview one-liners

- "Kafka is a replayable log: ordering per partition via keys, scaling via consumer groups, one consumer per partition per group."
- "Default posture: at-least-once + idempotent consumers; exactly-once exists but is scoped to Kafka transactions."
- "Queue vs log: RabbitMQ deletes on ack, Kafka retains — that single difference explains almost every design choice between them."
