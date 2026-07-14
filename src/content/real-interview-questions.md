---
title: Real Interview Question Lists (Asked in Practice)
level: Mid
category: Interview Lists
tags: interview-qa, checklist, preparation
order: 10
---

Questions and topics actually asked in interviews — use as a self-check list. Each topic links to an article in this app (search the topic name).

## Tateeda (asked)

- Last job and technologies
- Clustered vs non-clustered indexes — differences → *Indexes article*
- Database views: benefits, why we use them → *SQL Objects article*
- Familiar with SQL execution plans? How do you use them? → *Execution Plans article*
- How to find a performance issue in an SQL query → *Execution Plans article*
- Difference between .NET Core and old .NET → *.NET Core vs Framework article*
- What is dependency injection and why → *Dependency Injection article*
- `partial class` — why and where → *partial class article*
- EF queries are slow — how do you inspect the generated SQL / troubleshoot? → *EF Performance article*
- Repository design pattern — why → *Repository & UoW article*
- Singleton, Scoped and Transient → *DI Lifetimes article*
- Entity query and `AsNoTracking` → *EF Performance article*
- Overriding in C# → *OOP Principles article*
- Also mentioned: preprocessor, SQL Profiler, table scan, cross join, JS closure → *Execution Plans / SQL Basics / JS Closures articles*

## Senior colleague's list (Sinan)

- Strategy pattern → *Strategy article*
- Pub/Sub + a message broker (learn Kafka) → *Observer & Pub/Sub article*
- Outbox pattern / Transactional outbox → *Outbox article*
- DDD → *DDD article*
- CQRS → *Command, Mediator, CQRS article*
- Observer, Command pattern, Mediator (+ Autofac) → *respective articles*
- Composition + Strategy → *Strategy article*

## Async/threading block (asked)

- async — the approach: what is it, why was it invented, what's the profit → *Async/Await Fundamentals*
- async vs multithreading → *Async vs Multithreading*
- Why not make an async method `void` → *Task vs Thread*
- lock, synchronization primitives, semaphore, mutex + lightweight analogs (Interlocked) → *Synchronization*
- Action filter, middleware, pipeline → *Filters / Middleware*
- Collections, dictionary → *Array vs Dictionary*

## General full-stack checklist

**C#/.NET:** SDLC end-to-end story · async/await, Task vs Thread · DI, SOLID, Clean Architecture · EF Core (performance, migrations, LINQ) · exception handling best practices · Repository & UoW

**Web API:** versioning · auth (JWT, OAuth2) · idempotency, pagination, rate limiting · error handling & logging (Serilog)

**SQL:** joins, indexes, transactions · execution plans · stored procedures vs EF LINQ

**Microservices:** monolith vs SOA vs microservices · REST/gRPC/message queues · API gateway, service discovery · distributed transactions, eventual consistency

**DevOps:** Git branching (GitFlow, trunk-based) · CI/CD (Azure DevOps, GitHub Actions) · Docker basics · Kubernetes fundamentals (pods, deployments, services)

**Angular:** components, services, DI, observables/RxJS · change detection (OnPush) · lazy loading · guards, interceptors

## Practice questions to rehearse out loud

1. Walk me through the SDLC of your last project
2. Task.Run vs async/await — difference?
3. How do you optimize a slow SQL query?
4. Explain DI and why it matters
5. SOA vs Microservices?
6. How do you secure an API?
7. CI/CD pipeline for a .NET + Angular app?
8. The most complex bug you solved — story ready?
9. Git conflicts in a team — how do you handle them?

## Behavioral (have stories ready)

- A difficult situation in a past project and how you solved it
- Code review culture — receiving and giving feedback
- Multiple deadlines — how you prioritize
- How you learn new technologies
- Why this company? What can you improve there?
