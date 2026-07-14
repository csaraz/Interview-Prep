---
title: Task vs Thread, async void, CancellationToken
level: Mid
category: Async & Threading
tags: task, thread, async-void, cancellation-token, threadpool
order: 20
---

## Thread

- The **basic unit of execution** in .NET (managed by the CLR, scheduled by the OS)
- Each thread has its **own stack** and memory overhead; creation and context switching are **expensive**
- Use when you need low-level control (priority, affinity)

```csharp
var thread = new Thread(() => Console.WriteLine("Running on separate thread"));
thread.Start();
thread.Join(); // wait for it to finish
```

## Task

- A **higher-level abstraction** built on top of the **ThreadPool**
- Represents *a unit of work*, not a worker — the scheduler decides which pooled thread runs it
- Integrates with `async/await`, can **return a result**, supports **cancellation** and continuations

```csharp
var task = Task.Run(() => Console.WriteLine("Running in task using thread pool"));
await task;
```

## Differences (interview table)

| | Thread | Task |
|---|---|---|
| Level | OS-level worker | Unit of work on ThreadPool |
| Result | No direct mechanism | `Task<T>` returns a value |
| Cancellation | No built-in | `CancellationToken` |
| async/await | No | Yes |
| Cost | Expensive (stack, context switching) | Cheap (pooled) |

**Interview phrasing:** "A Thread is a worker itself; a Task is a unit of work that gets scheduled onto threads (usually from the ThreadPool). Tasks mean less boilerplate, better scaling, and async/await integration."

## async void — why to avoid

`async void` should be avoided **except for event handlers**, because:

- **Exceptions can't be caught by the caller** — they escape to the synchronization context and can crash the process
- The caller **cannot await completion**
- No composition, no cancellation

Always prefer `async Task` / `async Task<T>`.

## CancellationToken

Cancellation in .NET is **cooperative** — the running code must *check* the token or pass it to APIs that do:

```csharp
public async Task DoWorkAsync(CancellationToken ct)
{
    for (int i = 0; i < 100; i++)
    {
        ct.ThrowIfCancellationRequested();      // cooperative check
        await Task.Delay(100, ct);              // pass token to APIs
    }
}

var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
try
{
    await DoWorkAsync(cts.Token);
}
catch (OperationCanceledException)
{
    Console.WriteLine("Cancelled gracefully");
}
```

This allows **graceful shutdown** instead of killing threads.

## Blocking calls — Wait() / Result

`Task.Wait()` and `Task.Result` **block the calling thread** until completion. In async code they can cause **deadlocks** (UI / classic ASP.NET contexts) and thread starvation. Prefer `await`.

## Interview one-liners

- "Threads are OS-level workers; Tasks are managed units of work with async/await support."
- "`async void`: fire-and-forget with invisible exceptions — event handlers only."
- "Cancellation is cooperative: the task must observe the token."
