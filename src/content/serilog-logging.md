---
title: Logging & Serilog
level: Mid
category: ASP.NET Core
tags: serilog, logging, structured-logging, observability
order: 100
---

## What is Serilog?

Serilog is a **structured logging** library for .NET. Unlike plain-text logging, Serilog stores logs as **data** — key-value pairs — which can be queried, filtered, and analyzed in stores like Elasticsearch, Seq, or Kibana.

> Core idea: logs are not just text, they are data objects.

## Features

- **Structured logging** — `Log.Information("Order {OrderId} placed by {UserId}", id, userId)` → searchable properties, not string soup
- **Sinks** — write to many destinations: console, files, Seq, Elasticsearch…
- **Enrichment** — automatically attach machine name, user ID, correlation ID
- **Filters** — control what gets logged where

It integrates with the built-in `ILogger<T>` abstraction, so application code stays framework-agnostic.

## Best practices

- Use **message templates**, not string interpolation (`{OrderId}`, not `$"{orderId}"`) — that's what makes it structured
- Add **correlation IDs** so one request can be traced across services
- Log enough context (user, request ID, parameters)
- **Never log sensitive data** — passwords, tokens, PII

## Interview one-liner

- "Serilog = structured logs with properties + pluggable sinks; message templates make logs queryable."
