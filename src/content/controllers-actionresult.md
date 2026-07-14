---
title: Controllers & ActionResult
level: Junior
category: ASP.NET Core
tags: webapi, controller, actionresult, http
order: 10
---

## What is a Controller?

A class that **handles HTTP requests and returns responses**. It inherits from `ControllerBase` (or `Controller` when MVC Views are needed) and groups endpoints logically (`ProductsController` → `/api/products`).

```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    [HttpGet]
    public IEnumerable<string> Get() => new[] { "Book", "Laptop" };
}
```

**Under the hood:** ASP.NET Core creates controller instances through **dependency injection**; controllers are discovered via reflection at startup (`ApplicationParts`).

## Controller vs ControllerBase

- `ControllerBase` → minimal API controller, no view support; optimized for APIs (`Ok()`, `BadRequest()` helpers)
- `Controller` → inherits ControllerBase, adds MVC **View** support (`ViewResult`) — rarely needed in Web APIs

## What is ActionResult?

Represents the **result of a controller action** — data and/or HTTP status:

| Helper | Status |
|---|---|
| `Ok(object)` | 200 |
| `CreatedAtAction()` | 201 |
| `NoContent()` | 204 |
| `BadRequest(object)` | 400 |
| `Unauthorized()` | 401 |
| `NotFound()` | 404 |

```csharp
[HttpGet("{id}")]
public ActionResult<string> GetById(int id)
{
    if (id <= 0) return BadRequest("Invalid Id");
    if (id == 99) return NotFound();
    return Ok("Product found");
}
```

## IActionResult vs ActionResult&lt;T&gt;

**IActionResult**
- An **interface**, non-generic
- Can return any result (`Ok()`, `NotFound()`, custom) — flexible
- But carries **no type information**: Swagger shows just "200 OK" without the response model
- Best when returning a mix of unrelated result types

**ActionResult&lt;T&gt;**
- A **generic class**; can return either a typed `T` **or** an HTTP result (`NotFound()`…)
- **Strong typing**: compiler and Swagger know the success response shape → better docs and client SDK generation
- Best default for Web APIs

**Under the hood:** the framework converts `ActionResult<T>` into either serialized `T` or the `IActionResult`; JSON serialization uses `System.Text.Json` by default.

## [ApiController] attribute

Enables:
- **Automatic model validation** → 400 with validation details before your code runs (`ModelStateInvalidFilter`)
- **Binding source inference** (complex types → `[FromBody]`)
- Attribute routing requirement
- Standard `ProblemDetails` error responses

## Interview one-liners

- "`ActionResult<T>` = data + status in one type; that's why Swagger loves it."
- "`[ApiController]` gives you automatic 400s and binding inference — validation runs before the action."
