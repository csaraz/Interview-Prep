---
title: "Role Prep: Senior .NET Integration Engineer (fintech/ERP)"
level: Senior
category: Interview Lists
tags: interview-qa, integration, checklist, preparation, soap, sql-server
order: 5
---

Targeted plan for the DistantJob / fintech AP platform role: integrations between the product and ERP/accounting systems (NetSuite, QuickBooks, Sage, Dynamics).

## What the job description actually demands

| Must-have | My current standing |
|---|---|
| Strong C# / .NET backend + APIs | ✅ core strength |
| REST **and SOAP**: auth, error handling, retries, versioning | ⚠️ SOAP is the real gap |
| Data sync, transformation, reconciliation | ⚠️ done in spirit, need the vocabulary |
| Partial failures, retries, eventual consistency, **idempotency**, audit trails | ✅ Outbox/quorum queues/chaos testing |
| **SQL Server**: query design, optimization, data modeling | ✅ strong — and there's a fresh production win to tell |
| Event-driven / message-based architecture | ✅ RabbitMQ, Kafka, MassTransit |
| ERP systems (NetSuite/QuickBooks/Sage/Dynamics) | ❌ never used — parked to the end on purpose |
| Azure (Service Bus, Functions, API Management) | ⚠️ partial (Functions yes) |
| SFTP / EDI / file-based patterns | ❌ gap |
| Observability: structured logging, tracing | ✅ Serilog, OTel, Grafana, Datadog |
| AI-assisted development (Cursor, Claude Code, Copilot) | ✅ daily |

## The daily plan

**Day 1 — SOAP for .NET integration engineers** (biggest must-have gap) → *SOAP in .NET* article
**Day 2 — Sync patterns:** full vs delta sync, watermarks/cursors, field mapping and transformation, dedup, backfills
**Day 3 — Partial failure:** idempotency keys, retry/backoff taxonomy, audit trails, compensation, eventual consistency the business can live with
**Day 4 — SQL Server I:** query design, execution plans, SARGability, parameter sniffing, covering indexes
**Day 5 — SQL Server II:** modeling for integrations — staging tables, natural vs surrogate keys, `MERGE`/upsert, bulk load, multi-tenant schemas
**Day 6 — SQL Server III:** concurrency — isolation levels, blocking vs deadlock, `rowversion` optimistic concurrency — plus rehearsing the 7×–70× performance story with real numbers
**Day 7 — Event-driven:** Azure Service Bus vs RabbitMQ/Kafka, outbox, DLQ and poison messages, ordering and sessions
**Day 8 — Azure for integrations:** Service Bus, Functions (timer/queue triggers), API Management, Key Vault
**Day 9 — Observability and RCA:** correlation IDs across systems, tracing an integration failure end to end, alerting that isn't noise
**Day 10 — ERP crash course:** what NetSuite/QuickBooks/Sage/Dynamics actually are, AP and fund-administration vocabulary, and how to answer "you haven't used X" without bluffing
**Day 11 — Mock:** behavioral + a live design question ("design the integration layer for a new ERP")

## The three stories to have polished

1. **Performance:** the SQL rework — covering indexes, tighter lock scope, removed per-request redundant queries; p50/p90/p99 down 7×–70×, tail improved most. Have the measurement method ready (that's what a Staff Engineer will probe).
2. **Reliability:** notification pipeline — Outbox for atomic at-least-once publishing, six priority RabbitMQ quorum queues via MassTransit, Hazelcast→Redis so consumers went stateless. This *is* the "partial failures, retries, idempotency, audit trails" bullet.
3. **Ownership:** only senior engineer on the backend platform team, 3–4 parallel workstreams; the query-review practice and the chaos-environment failure-mode map became team standards (runbook).

## The honesty line, pre-scripted

> "I haven't worked with NetSuite, QuickBooks, Sage or Dynamics specifically. I have worked on financial systems — insurance policy issuance and payments — and the patterns underneath your ERP work are my daily job: REST and SOAP with real authentication and versioning, retries and idempotency, delta sync, reconciliation against an authoritative record, and partial-failure handling with audit trails."

Said once, early, without apology. Then redirect to the pattern depth.
