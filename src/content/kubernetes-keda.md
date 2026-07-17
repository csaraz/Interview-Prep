---
title: Kubernetes for Backend Engineers (+ KEDA)
level: Senior
category: DevOps & Cloud
tags: kubernetes, keda, docker, argocd, autoscaling, devops
order: 10
---

What a senior .NET backend engineer must know — not cluster administration, but the consumer's view.

## The core objects

| Object | What it is |
|---|---|
| **Pod** | Smallest unit — one or more containers sharing network/storage. Ephemeral: dies and is replaced, never repaired |
| **Deployment** | Desired state for pods: "run 3 replicas of image X"; handles rolling updates and rollbacks |
| **Service** | Stable DNS name + load balancing over healthy pods (`http://order-service`) — this is service discovery |
| **Ingress** | HTTP entry into the cluster: host/path routing, TLS — the basic gateway |
| **ConfigMap / Secret** | Configuration and secrets injected as env vars or files — config lives outside the image |
| **Namespace** | Logical isolation (dev/staging/prod, per-team) |

## What your app must provide (the dev's contract)

- **Health probes** — `/health/live` (liveness: restart me if dead) and `/health/ready` (readiness: don't send traffic yet). ASP.NET Core: `AddHealthChecks()`
- **Graceful shutdown** — handle SIGTERM: stop taking requests, finish in-flight work, exit (host's `IHostApplicationLifetime`; consumers must respect CancellationToken)
- **Statelessness** — any pod can die anytime; state goes to Redis/DB, never in-memory
- **Resource requests/limits** — CPU/memory declared so the scheduler can place and protect pods
- **Structured logs to stdout** — the platform collects them; no file logging

## Scaling

- **HPA (Horizontal Pod Autoscaler)** — scale pod count on CPU/memory metrics. Fine for HTTP traffic
- **KEDA (Kubernetes Event-Driven Autoscaling)** — scale on **event-source metrics**: RabbitMQ queue depth, Kafka consumer lag, Redis list length, Azure Service Bus, cron…

### Why KEDA matters (and pairs with messaging work)

CPU is the wrong signal for queue consumers — a consumer at 5% CPU with 100,000 messages backed up needs more replicas, not fewer. KEDA watches the queue itself:

```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: notification-consumer
spec:
  scaleTargetRef:
    name: notification-consumer      # the Deployment
  minReplicaCount: 0                 # scale to ZERO when queue is empty
  maxReplicaCount: 20
  triggers:
    - type: rabbitmq
      metadata:
        queueName: notifications.high
        mode: QueueLength
        value: "50"                  # ~1 replica per 50 msgs
```

- **Scale to zero** — no messages, no pods, no cost (HPA can't do this)
- Per-queue scaling = **per-priority-tier scaling** — exactly the architecture priority-based queue tiers enable
- Kafka trigger scales on **consumer lag** — the true backpressure signal

## GitOps: ArgoCD

Deployment model where **git is the source of truth**: desired manifests live in a repo; **ArgoCD** continuously compares cluster state vs repo and syncs the difference. Rollback = `git revert`. CI builds/pushes the image; CD = a commit changing the image tag; ArgoCD applies it. (If ArgoCD is on the CV — this paragraph is the expected explanation.)

## Honest-scope answer for interviews

> "As a backend engineer I own the app side of Kubernetes: health probes, graceful shutdown, statelessness, resource limits, ConfigMaps/Secrets, and scaling behavior — including KEDA for queue-driven consumers. Cluster administration (networking, etcd, node ops) I'd defer to platform engineers."

## Interview one-liners

- "Pods are cattle, not pets — my job is making the app die and restart gracefully."
- "HPA scales on CPU; KEDA scales on queue depth and consumer lag — and can scale to zero."
- "ArgoCD = git is the source of truth; deploy is a commit, rollback is a revert."
