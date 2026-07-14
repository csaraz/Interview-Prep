---
title: Web API — 20 Interview Q&A
level: Mid
category: ASP.NET Core
tags: webapi, interview-qa, model-binding, cors, json
order: 60
---

Rapid-fire Q&A. Deeper coverage for controllers/routing/middleware/filters/DI is in their dedicated articles.

## 1. Controller vs ControllerBase?
`ControllerBase` = API controller, no views. `Controller` adds MVC View support (`ViewResult`). APIs use `ControllerBase`.

## 2. IActionResult vs ActionResult&lt;T&gt;?
`IActionResult` = any HTTP result, no type info. `ActionResult<T>` = typed data **or** HTTP result; Swagger sees the schema. Prefer `ActionResult<T>` in APIs.

## 3. What does [ApiController] give you?
Automatic model validation (400 via `ModelStateInvalidFilter` before the action), binding source inference (`[FromBody]` for complex types), attribute routing requirement, `ProblemDetails` errors.

## 4. Attribute vs conventional routing?
Attribute: `[HttpGet("products/{id}")]` per action (APIs). Conventional: `MapControllerRoute("default", "{controller}/{action}/{id?}")` (MVC). Both feed the Endpoint Routing middleware; the table is built at startup.

## 5. Ambiguous route matches?
Equal-priority duplicate routes throw. Constraints (`{id:int}` vs `{name:alpha}`) resolve ambiguity; matching is by priority + specificity.

## 6. Middleware that doesn't call _next()?
The pipeline **short-circuits** — nothing after it runs. Intentional in auth, rate limiting, caching.

## 7. Middleware vs Filters?
Middleware = global, before endpoint selection, raw HttpContext. Filters = around controller actions, know the action and ModelState. (See Filters article.)

## 8. What is Model Binding?
Maps request data (query string, route, headers, body) to action parameters using **Value Providers** (`QueryStringValueProvider`, `FormValueProvider`…). `[FromQuery]`, `[FromRoute]`, `[FromBody]` force a specific source.

## 9. Sync vs async controllers?
Sync blocks the thread while waiting; async frees it back to the pool → better scalability. Async uses I/O completion ports + task continuations.

## 10. UseRouting() vs UseEndpoints()?
Two phases: `UseRouting` **matches** the endpoint; `UseEndpoints` **executes** it. Middleware in between can inspect the matched endpoint.

## 11. Exception handling options?
try/catch (local) → Exception Filters (MVC-level, run after MVC executes) → **Exception middleware** (`UseExceptionHandler`) — earliest and recommended for global handling.

## 12. How does DI work in controllers?
Built-in IoC container; constructor injection; the container resolves the whole object graph when activating the controller.

## 13. FromQuery vs FromBody vs FromRoute?
`[FromQuery]` → `/api?name=John`; `[FromRoute]` → `/api/users/1`; `[FromBody]` → JSON body. Resolved by `BindingSource` providers.

## 14. Scoped vs Transient vs Singleton?
Per request / new every time / one per app. Implemented in `Microsoft.Extensions.DependencyInjection`. (See DI article for captive dependency trap.)

## 15. JSON serialization?
Default `System.Text.Json`; supports custom converters. Uses reflection + IL emit for fast property accessors. Newtonsoft.Json available via `AddNewtonsoftJson()`.

## 16. Result filters — what for?
Run before/after the response is written — response wrapping/modification (e.g. `{ data: ... }` envelope). Hooks: `OnResultExecuting` / `OnResultExecuted`.

## 17. Global request/response logging?
Option 1: **custom middleware** (preferred — sees all requests, not just controllers). Option 2: global action filter.

## 18. CORS?
Browser policy for cross-origin requests. `AddCors()` + `UseCors()` middleware (after Routing, before Auth); `[EnableCors]` per controller. Adds `Access-Control-Allow-Origin` headers.

## 19. Use vs Run vs Map?
`Use` chains (calls next), `Run` is terminal, `Map` branches by path. All are extensions over `IApplicationBuilder`.

## 20. Thread safety per request?
Each request gets its own `HttpContext`; scoped services are unique per request. `HttpContext` flows across async calls via `AsyncLocal<T>`. Never store request state in singletons/statics.

## Bonus: "Walk me through a request"

> Kestrel → middleware pipeline (exception → auth) → routing matches the action → `[ApiController]` model binding + validation → filters (authorization → action) → controller action (services via DI) → application/domain logic → EF/infrastructure → `ActionResult<T>` → result filters → JSON serialization → response travels back through middleware in reverse.
