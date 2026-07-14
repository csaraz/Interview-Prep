---
title: Command Pattern, Mediator (MediatR), CQRS
level: Senior
category: Patterns & Architecture
tags: command, mediator, mediatr, cqrs, design-patterns
order: 70
---

## Command pattern

Encapsulate a **request as an object** — decoupling *who invokes* an operation from *who performs* it.

```csharp
public interface ICommand { void Execute(); }

public class AddItemCommand : ICommand
{
    private readonly Cart _cart;
    private readonly string _item;
    public AddItemCommand(Cart cart, string item) { _cart = cart; _item = item; }
    public void Execute() => _cart.Add(_item);
}

// invoker doesn't know what the command does
public class Button
{
    private readonly ICommand _command;
    public Button(ICommand command) => _command = command;
    public void Click() => _command.Execute();
}
```

Enables: queuing commands, logging/audit, **undo/redo** (store inverse commands), retries.

## Mediator pattern

Objects communicate through a **central hub** instead of referencing each other directly — reducing many-to-many coupling to many-to-one.

### MediatR (the .NET implementation you'll be asked about)

```csharp
// request
public record CreateOrderCommand(int ProductId, int Qty) : IRequest<int>;

// handler
public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, int>
{
    public Task<int> Handle(CreateOrderCommand cmd, CancellationToken ct)
    {
        // business logic
        return Task.FromResult(42); // new order id
    }
}

// controller stays thin
[HttpPost]
public async Task<ActionResult<int>> Create(CreateOrderCommand cmd)
    => Ok(await _mediator.Send(cmd));
```

- Controllers don't know handlers; handlers don't know each other
- Pipeline behaviors = cross-cutting concerns (validation, logging, transactions) around every request
- Registered via DI (works with the built-in container or Autofac)

## CQRS — Command Query Responsibility Segregation

Split the model into two paths:

- **Commands** — change state, return nothing/ID (writes)
- **Queries** — return data, never change state (reads)

Why:

- Read and write models can be **shaped differently** (normalized writes, denormalized fast reads)
- **Scale independently** — reads usually dominate
- Pairs naturally with MediatR (`IRequest` commands/queries), and at the heavy end with **Event Sourcing**

Cost: more moving parts; eventual consistency if read/write stores are separated. Don't CQRS a CRUD app.

## How they fit together

> Controller → MediatR `Send(command)` → command handler (write path) or query handler (read path). The Command pattern shapes the messages; Mediator routes them; CQRS separates the read/write pipelines.

## Interview one-liners

- "Command = request as an object (queue it, log it, undo it)."
- "MediatR turns controllers into thin routers and centralizes cross-cutting via pipeline behaviors."
- "CQRS: writes and reads have different needs — model them separately, scale them separately."
