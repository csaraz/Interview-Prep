---
title: Routing in ASP.NET Core
level: Mid
category: ASP.NET Core
tags: routing, webapi, endpoints, middleware
order: 20
---

## What routing does

Maps incoming HTTP requests to controller actions.

## Two styles

**Attribute routing** (standard for APIs) — defined per action:

```csharp
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    [HttpGet("{id:int}")]
    public IActionResult GetOrder(int id) => Ok($"Order {id}");
}
```

**Convention-based routing** (mostly MVC with views):

```csharp
endpoints.MapControllerRoute("default", "{controller}/{action}/{id?}");
```

## Under the hood — Endpoint Routing

- ASP.NET Core uses the **Endpoint Routing Middleware**: `UseRouting()` (match phase) and `UseEndpoints()` (execute phase)
- The **routing table is built at startup** and matched against each incoming request
- Routing runs in two phases: **match** the endpoint, then **execute** it — middleware between the two (e.g. CORS, Auth) can use the matched endpoint info

## Route constraints

```
{id:int}   {slug:alpha}   {version:apiVersion}
```

Constraints both validate and **resolve ambiguity** — two routes with equal priority and no distinguishing constraint throw an "ambiguous match" exception at runtime. Routes are matched by **priority + specificity** in the endpoint table.

## Interview one-liners

- "Attribute routing for APIs; conventional routing for MVC views."
- "`UseRouting` matches, `UseEndpoints` executes — the table is built once at startup."
- "Ambiguous routes throw — constraints like `{id:int}` are how you disambiguate."
