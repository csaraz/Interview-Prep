---
title: Filters — Types, Pipeline, vs Middleware
level: Mid
category: ASP.NET Core
tags: filters, action-filter, aspnetcore, cross-cutting
order: 40
---

## What are filters?

Filters run code **before or after specific stages** of the MVC action invocation pipeline. They handle **cross-cutting concerns** — error handling, caching, authorization, logging — without duplicating code across actions.

The filter pipeline runs **after** ASP.NET Core selects the action to execute.

## Filter types (in execution order)

1. **Authorization filters** — authentication/roles checks (earliest)
2. **Resource filters** — before/after model binding (caching, short-circuiting)
3. **Action filters** — before/after action execution
4. **Exception filters** — handle unhandled exceptions from actions
5. **Result filters** — before/after the response is written (e.g. wrap all results in `{ data: ... }`)

## Action filter example

```csharp
public class LogActionFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
        => Console.WriteLine("Before action executes");

    public void OnActionExecuted(ActionExecutedContext context)
        => Console.WriteLine("After action executes");
}

// register globally
services.AddControllers(options => options.Filters.Add<LogActionFilter>());
```

Scopes: global, per-controller, per-action (attributes).

## Middleware vs Filters — the classic question

| | Middleware | Filters |
|---|---|---|
| Scope | **All requests**, globally | Only MVC/Web API pipeline |
| Runs | Before endpoint selection | Around controller actions (after routing) |
| Knows about | Raw HttpContext | Action context, `ModelState`, action arguments |
| Use for | Auth, logging, exception handling for everything | Action-specific concerns, validation, response shaping |

**Under the hood:** filters use the **Decorator pattern** — ASP.NET Core builds a filter pipeline around each controller action. Exception filters are the last line of defense before exceptions reach the middleware.

## Interview one-liners

- "Middleware wraps the whole pipeline; filters wrap the action — filters know *which* action and see model binding."
- "Five types, fixed order: Authorization → Resource → Action → Exception → Result."
