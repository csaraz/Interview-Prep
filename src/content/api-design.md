---
title: "API Design: Idempotency, Pagination, Rate Limiting, Versioning"
level: Senior
category: ASP.NET Core
tags: rest, api-design, idempotency, versioning, pagination, rate-limiting
order: 80
---

## Idempotency

An idempotent operation gives the **same result no matter how many times it's called**.

| Method | Idempotent? |
|---|---|
| GET | ✅ read-only |
| PUT | ✅ repeating the same update = same state |
| DELETE | ✅ deleting twice doesn't change the outcome (may return 404) |
| POST | ❌ each call creates a new resource |

**Idempotency keys** for POST (payments, orders — must-have):

```
POST /api/orders
Idempotency-Key: 123e4567-e89b-12d3-a456-426614174000
```

The client sends a unique key per logical request; if the server sees the same key again, it returns the **previous result** — no duplicate order.

## Pagination

- **Offset**: `?page=2&size=20` → SQL `OFFSET/FETCH`. Simple, but deep pages get slow.
- **Keyset/seek**: `WHERE Id > @lastSeenId ORDER BY Id` — fast for large datasets, stable under inserts.

## Rate limiting

Unlimited requests = DDoS risk and server overload. Limit per client/token/IP. .NET 7+ has built-in `AddRateLimiter` (fixed window, sliding window, token bucket, concurrency limiter).

## API versioning

Old clients must not break when the API evolves.

```csharp
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
[ApiVersion("2.0")]
public class BooksController : ControllerBase
{
    [HttpGet]
    public IActionResult GetV1() => Ok(new { Version = "v1" });

    [HttpGet, MapToApiVersion("2.0")]
    public IActionResult GetV2() => Ok(new { Version = "v2" });
}
```

- `UrlSegmentApiVersionReader` → `/api/v1/books`, `/api/v2/books`
- Alternatives: query string, header, media type versioning
- v1 users are untouched; v2 introduces new fields/behavior

## General best practices

- **Resource-based URLs**: `/api/books/{id}`, nouns not verbs
- **Consistent status codes**: 200, 201, 204, 400, 401, 403, 404
- **Filtering & sorting** via query: `/api/books?author=John&sort=publishedDate`
- **Standardized errors**: consistent body (`ProblemDetails`), centralized, informative **without leaking internals**

## Interview one-liners

- "POST + Idempotency-Key is how payment APIs prevent double charges."
- "Offset pagination is simple; keyset pagination scales."
- "Versioning contract: never break v1 — add v2."
