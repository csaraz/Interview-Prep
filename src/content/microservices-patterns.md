---
title: Microservices Patterns — The Map
level: Senior
category: Patterns & Architecture
tags: microservices, resilience, circuit-breaker, patterns, distributed-systems
order: 125
---

The umbrella article: what each pattern solves, one paragraph each. Deep dives live in their own articles (Saga, Outbox, CQRS, Gateway, Kafka/RabbitMQ).

## Data & consistency

- **Database per service** — each service owns its data; no shared tables. Creates the consistency problem the next patterns solve.
- **Saga** — distributed transactions as a chain of local transactions with compensating actions (own article).
- **Transactional Outbox** — atomic "save + publish" via one local transaction + relay (own article).
- **CQRS** — separate write and read models; reads become denormalized projections (own article).
- **Event Sourcing** — store the events, not the state; current state = replay of events. Pairs with CQRS; powerful but operationally heavy — don't lead with it unless asked.

## Resilience (the "what happens when it breaks" block)

- **Retry with backoff** — transient failures are normal; retry with exponential backoff **+ jitter**. Never retry non-idempotent calls blindly.
- **Timeout** — every remote call needs one; without it, one slow dependency consumes all your threads.
- **Circuit Breaker** — after N failures, stop calling the sick service ("open" state), fail fast, probe later ("half-open"). Prevents cascade failures and gives the dependency room to recover. (.NET: Polly.)
- **Bulkhead** — isolate resource pools per dependency so one saturated dependency can't sink the whole ship (named after ship compartments).
- **Fallback** — degraded response (cached data, default) instead of an error.

Interview phrasing: "Timeout + retry with backoff + circuit breaker + bulkhead is the standard Polly stack — each answers a different failure mode."

## Traffic & topology

- **API Gateway** — single entry point: routing, auth, rate limiting (own article).
- **BFF (Backend for Frontend)** — one gateway per client type (mobile/web) with tailored aggregation.
- **Service Discovery** — how services find each other's addresses (own article, with Gateway).
- **Service Mesh** (Istio/Linkerd) — sidecar proxies handle retries, mTLS, tracing at the infrastructure level; know the concept, admit if you haven't run one.

## Migration & deployment

- **Strangler Fig** — modernize a monolith by routing features one by one to new services until the old system withers. The honest answer to "how would you split a monolith?"
- **Sidecar** — deploy a helper container next to the service container (logging agent, proxy).
- **Blue-green / canary deployments** — release with instant rollback / gradual traffic shift.

## Observability (non-negotiable in distributed systems)

- **Correlation IDs** — one ID follows the request across services (Serilog enrichment).
- **Distributed tracing** — spans across services (OpenTelemetry, Grafana Tempo/Jaeger).
- **Centralized structured logging + metrics + health checks** — `/health` endpoints feeding orchestrator probes.

## The senior answer template

> "Which patterns you need depends on which problem the split created: data consistency → Outbox/Saga, failure isolation → circuit breaker/bulkhead, entry complexity → Gateway/BFF, migration risk → Strangler Fig, debugging → correlation IDs and tracing. I'd introduce each when its problem appears, not upfront."
