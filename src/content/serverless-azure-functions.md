---
title: Serverless & Azure Functions
level: Mid
category: Patterns & Architecture
tags: azure, serverless, azure-functions, cloud
order: 150
---

## What is serverless?

Building and running applications **without managing servers** — the cloud provider (Azure, AWS, GCP) handles infrastructure, scaling, and maintenance.

### Key principles

- **Event-driven** — code runs only when triggered (HTTP request, queue message, file upload, timer)
- **Auto-scaling** — up under load, down to **zero** when idle
- **Pay-per-use** — no idle server costs; pay for execution time and resources
- **Stateless by default** — each execution independent; state goes to external storage (DB, cache, Durable Functions)
- **Managed infrastructure** — no patching, no VM setup

### Example that sells it

Image-resize app:
- Classic: a web server running 24/7, you handle scaling and monitoring
- Serverless: one function — "when an image lands in Blob Storage, resize it." Azure handles triggering, scaling, resources.

## Azure Functions

Microsoft's serverless compute service — write small functions, Azure runs them.

- **Triggers**: HTTP, queue messages, timers, blob changes, Service Bus, Event Grid…
- **Scalable** automatically by demand
- **Languages**: C#, JavaScript/TypeScript, Python, Java, PowerShell

### Use cases

- Processing uploaded files (Blob Storage trigger)
- Background jobs (emails, cleanup)
- Real-time data processing (IoT, queues)
- Lightweight APIs / glue between services

## Be ready to discuss trade-offs

✅ Scaling, cost, simplicity
❌ **Cold starts** (first request after idle is slow), **vendor lock-in**, stateless limitations, execution time limits, harder local debugging

## Interview one-liner

- "Serverless = event-driven, auto-scaled, pay-per-execution code. Perfect for spiky/background workloads; watch cold starts and lock-in for latency-critical paths."
