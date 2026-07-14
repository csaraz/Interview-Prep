---
title: Async vs Multithreading, Parallel.ForEach, PLINQ
level: Mid
category: Async & Threading
tags: async, multithreading, parallel, plinq, threadpool
order: 30
---

## Async/Await vs Multithreading

**Async/await is NOT about creating threads.** It's about non-blocking I/O: the thread isn't blocked while waiting, so the CPU can do other work.

**Multithreading** creates multiple threads for CPU-bound or concurrent work. Each thread is a real OS thread consuming stack and CPU resources.

### Async I/O — no new thread

```csharp
public async Task<string> FetchWebAsync()
{
    HttpClient client = new HttpClient();
    return await client.GetStringAsync("https://example.com"); // non-blocking
}
```

Uses **I/O completion ports**, not a thread that sits and waits.

### Multithreading — a real thread

```csharp
public void RunHeavyWork()
{
    Thread t = new Thread(() =>
    {
        // heavy computation
    });
    t.Start();
}
```

### Under the hood

- **Async/await** → compiler-generated state machine; continuations scheduled by the ThreadPool
- **Multithreading** → OS-managed threads; context switching; more overhead

### The interview answer

> "Async/await is for non-blocking I/O — it doesn't create threads, it uses task continuations. Multithreading is for CPU-bound concurrent work — it creates threads, consumes CPU and stack, and involves context switching."

## Parallel.ForEach — CPU-bound loops

Runs loop iterations concurrently on multiple ThreadPool threads:

```csharp
var numbers = Enumerable.Range(1, 10);

Parallel.ForEach(numbers, n =>
{
    Console.WriteLine($"{n} processed by thread {Thread.CurrentThread.ManagedThreadId}");
});
```

Faster than a normal `foreach` for CPU-heavy work (not for I/O — use `Task.WhenAll` there).

## PLINQ — parallel LINQ

```csharp
var squares = Enumerable.Range(1, 10)
    .AsParallel()
    .Select(n => n * n)
    .ToArray();
```

- Each element is processed in parallel on multiple threads
- Work is **automatically partitioned**
- Note: output order is not guaranteed unless you add `.AsOrdered()`

## Choosing the right tool

| Scenario | Tool |
|---|---|
| Many I/O calls (HTTP, DB) | `async/await` + `Task.WhenAll` |
| Heavy CPU loop over a collection | `Parallel.ForEach` / PLINQ |
| One CPU-heavy job off the UI thread | `Task.Run` |
| Low-level control (priority, affinity) | `Thread` |
