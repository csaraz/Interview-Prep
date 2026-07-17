---
title: API Gateway, BFF, Service Discovery
level: Senior
category: Patterns & Architecture
tags: api-gateway, bff, service-discovery, yarp, ocelot, microservices
order: 126
---

## API Gateway — the single entry point

Clients don't call 15 microservices directly; they call **one gateway**, which routes inward. What the gateway centralizes:

- **Routing** — `/api/orders/*` → OrderService, `/api/users/*` → UserService
- **Authentication/authorization** — validate the JWT **once** at the edge; services trust the gateway (or receive a forwarded identity)
- **Rate limiting & throttling** — protect all services in one place
- **TLS termination, CORS, response caching, compression**
- **Aggregation** — one client call fans out to several services, gateway composes the response (fewer mobile roundtrips)

Without it: every client knows every service address, auth is duplicated N times, CORS/versioning chaos, and internal topology leaks to the outside world.

### .NET options

- **YARP** (Yet Another Reverse Proxy, Microsoft) — modern default; config-driven routes, middleware-extensible
- **Ocelot** — older .NET gateway library, common in existing codebases
- Cloud/platform: Azure API Management, Kong, NGINX, or a Kubernetes **Ingress** playing the basic role

### Risks (say these unprompted)

Single point of failure (→ run replicas), can become a "smart pipe" god-service (keep business logic OUT of it), extra hop latency.

## BFF — Backend for Frontend

One general gateway serving web + mobile + partners ends up bloated. **BFF** = a gateway *per client type*: mobile BFF returns lean payloads and aggregates aggressively; web BFF serves richer data. Each frontend team owns its BFF. Trade-off: more services to run.

## Service Discovery

Service instances come and go (scaling, redeploys) — addresses are dynamic. Who keeps track?

- **Client-side discovery** — client asks a registry (Consul, Eureka) and picks an instance (load-balancing logic in the client)
- **Server-side discovery** — client calls a stable name; a load balancer/platform resolves it

**The modern answer: Kubernetes does this for you.** Every k8s `Service` gets a stable DNS name (`http://order-service`) that load-balances across healthy pods — with health checks removing bad instances. Standalone registries matter mostly outside k8s.

## How a request flows (walkthrough answer)

> Client → Gateway (TLS, JWT validation, rate limit) → route matched → k8s Service DNS (`order-service`) → healthy pod → response back; correlation ID attached at the gateway follows the request through every hop for tracing.

## Interview one-liners

- "The gateway centralizes the cross-cutting edge concerns: routing, auth, rate limiting — but must stay dumb about business logic."
- "BFF = a gateway shaped by one client's needs, owned by that client's team."
- "In Kubernetes, service discovery is a solved problem: stable Service DNS + health-checked endpoints."
