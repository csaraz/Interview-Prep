---
title: Exception Handling Best Practices (+ Polly)
level: Mid
category: C# Fundamentals
tags: exceptions, best-practices, polly, resilience, logging
order: 170
---

## The 10 rules

1. **Use try/catch selectively** — only catch what you can handle meaningfully (retry, log, translate to a user-friendly error); otherwise let it bubble to a central handler
2. **Never swallow exceptions** — empty catch blocks make debugging impossible; if you catch, log or handle
3. **Catch specific types, not `Exception`** — `SqlException`, `IOException`, `TaskCanceledException`, `HttpRequestException`; catching `Exception` masks logic bugs
4. **Async exceptions live in the Task** — they are wrapped into the returned `Task` and must be caught with try/catch **around `await`**

```csharp
try
{
    var result = await httpClient.GetStringAsync("https://api.com");
}
catch (HttpRequestException ex)
{
    _logger.LogError(ex, "API call failed");
}
```

5. **No `async void`** (except event handlers) — the caller can't await or catch its exceptions; use `async Task`
6. **Centralize handling** — ASP.NET Core: exception middleware (`UseExceptionHandler` or custom); background services: top-level try/catch in `ExecuteAsync`

```csharp
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;
        context.Response.StatusCode = 500;
        await context.Response.WriteAsJsonAsync(new { error = "Something went wrong" });
    });
});
```

7. **Preserve the stack trace** — `throw;`, never `throw ex;`
8. **Don't expose internals** — never return raw exception messages to users (security risk); translate to friendly messages, log full details internally
9. **Retry transient failures** — DB, API, message queue errors are often temporary → use **Polly**
10. **Log with context** — structured logging (Serilog/NLog), correlation IDs, user/request info; never log sensitive data (passwords, tokens)

## Polly — resilience library

Polly handles failures in external systems with declarative policies:

- **Retry** — try again on failure
- **Wait and Retry** — retry with delay/backoff
- **Circuit Breaker** — stop hammering a failing service
- **Timeout** — cancel slow operations
- **Fallback** — default value on failure
- **Bulkhead Isolation** — limit concurrent calls

Instead of hand-written retry loops with `try/catch` + `Thread.Sleep`, you define a policy and wrap the call.

## Interview-ready summary

> "Catch only where you can meaningfully handle, use specific exception types, avoid swallowing, and centralize error handling in middleware. In async methods exceptions propagate through the Task and are caught around `await`. Preserve stack traces with `throw;`, never expose raw details to users, use Polly for transient errors, and log with context but without sensitive data."
