---
title: Saga Pattern — Distributed Transactions
level: Lead
category: Patterns & Architecture
tags: saga, distributed-transactions, compensation, microservices, masstransit
order: 141
---

## The problem

Order flow spans three services: Order → Payment → Inventory. Each has its **own database** — there is no shared transaction to wrap them. Two-phase commit (2PC) across services is impractical (blocking, coordinator SPOF, poor availability). So: how do you keep them consistent when step 3 fails after steps 1–2 succeeded?

## The idea

A saga is a **sequence of local transactions**. Each step commits in its own service; if a later step fails, previously completed steps are undone by **compensating transactions** — explicit "undo" business actions:

```
CreateOrder ✅ → ReservePayment ✅ → ReserveStock ❌
                     ↓ compensate
CancelPayment ← CancelOrder
```

Compensation is a *business* operation (refund, release reservation), not a DB rollback — and the system is **eventually consistent**: there are moments when the order exists but payment isn't final. That trade-off is the price of availability.

## Two coordination styles

**Choreography** — no central brain; services react to each other's events:
`OrderCreated → (Payment listens) PaymentReserved → (Inventory listens) StockReserved → ...`
✅ Simple to start, loose coupling ❌ the flow exists nowhere explicitly — "who reacts to what" becomes archaeology as steps grow; cyclic dependencies risk.

**Orchestration** — a central **saga orchestrator** (state machine) commands each step and tracks state:
`Orchestrator → ReservePayment → reply → ReserveStock → reply → Complete`
✅ Flow is explicit, testable, timeouts/retries in one place ❌ orchestrator to maintain; risk of putting too much logic in it.

Rule of thumb: 2–3 steps → choreography is fine; longer or business-critical flows → **orchestration**.

## In .NET: MassTransit State Machine

MassTransit sagas persist state (EF Core/Redis) and model the flow declaratively:

```csharp
public class OrderState : SagaStateMachineInstance
{
    public Guid CorrelationId { get; set; }
    public string CurrentState { get; set; }
    public decimal Amount { get; set; }
}

public class OrderSaga : MassTransitStateMachine<OrderState>
{
    public State AwaitingPayment { get; private set; }
    public State AwaitingStock { get; private set; }

    public OrderSaga()
    {
        InstanceState(x => x.CurrentState);

        Initially(
            When(OrderCreated)
                .Then(ctx => ctx.Saga.Amount = ctx.Message.Amount)
                .PublishAsync(ctx => ctx.Init<ReservePayment>(new { ctx.Saga.CorrelationId }))
                .TransitionTo(AwaitingPayment));

        During(AwaitingPayment,
            When(PaymentReserved)
                .PublishAsync(ctx => ctx.Init<ReserveStock>(new { ctx.Saga.CorrelationId }))
                .TransitionTo(AwaitingStock),
            When(PaymentFailed)
                .PublishAsync(ctx => ctx.Init<CancelOrder>(new { ctx.Saga.CorrelationId }))
                .Finalize());
    }
}
```

## Practical must-knows

- **Idempotency everywhere** — messages arrive at-least-once; every step and compensation must tolerate duplicates
- **Outbox underneath** — each step's "commit + publish next event" is itself a dual write → the [[Outbox pattern]] is the saga's reliable transport foundation
- **Timeouts** — a saga stuck waiting needs a deadline + timeout compensation path
- **Semantic locks** — mark records "pending" during the saga so other flows don't act on half-done state

## Interview one-liners

- "Saga = local transactions + compensating actions; consistency becomes eventual, availability stays high."
- "Choreography scales poorly in *understandability*; orchestration puts the flow in one testable state machine."
- "Compensation is business undo, not rollback — a refund, not a DELETE."
