---
title: Monolith vs SOA vs Microservices
level: Senior
category: Patterns & Architecture
tags: microservices, monolith, soa, distributed-systems, scaling
order: 120
---

## Monolith

The whole application is **one deployable unit** with **one database**. Modules exist in code, but everything deploys together (e.g. e-commerce: Users, Orders, Payments, Products in one app).

✅ Simple development, deployment, debugging; great for small teams
❌ Grows messy; small change → full redeploy; scaling only as a whole

## SOA (Service-Oriented Architecture)

The system is split into **larger services** communicating through an **ESB (Enterprise Service Bus)** — e.g. bank: UserService, PaymentService, LoanService. Each service can still be big ("mini-monoliths").

✅ Better code separation; services partially reusable; message-based communication
❌ Services still large, not fully independent; the **ESB can become a bottleneck** (centralized); integration complexity

## Microservices

SOA taken granular: each **business capability** is a small, independent service **with its own database** (data isolation), talking via lightweight protocols (REST, gRPC, messaging).

```
UserService (own DB) · OrderService (own DB) · PaymentService (own DB) · InventoryService (own DB)
```

✅ Independent deploys (CI/CD-friendly) · scale only what needs scaling (just PaymentService) · technology freedom per service (.NET here, Node there) · fault isolation — one service down, others keep working
❌ Complex deployment (Docker, Kubernetes) · monitoring/logging/tracing get hard · **data consistency** across DBs (distributed transactions → eventual consistency, sagas, outbox) · requires DevOps maturity

## Communication & infrastructure topics that follow

- REST vs **gRPC** vs message queues (RabbitMQ, Kafka, Azure Service Bus)
- **API Gateway** — single entry point; **service discovery**
- Distributed transactions → Saga / **Outbox pattern** (see its article)
- Scaling & distribution: replication, partitioning, event sourcing, stream processing

## The trade-off answer (senior tone)

> "Microservices bring independent scaling and deployment, but add complexity in monitoring, data consistency, and operations. I'd start with a well-modularized monolith and split along proven boundaries when team size and load justify it."
