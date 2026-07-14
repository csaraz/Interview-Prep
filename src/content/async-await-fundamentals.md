---
title: Async/Await Fundamentals
level: Mid
category: Async & Threading
tags: async, await, task, state-machine, io-bound
order: 10
---

## What is asynchronous programming?

Asynchronous programming lets a program **do other work while waiting** for a long-running operation (DB query, API call, file I/O) to complete. It improves responsiveness and throughput, especially for **I/O-bound** work.

## Key concepts

**Task** — represents an operation that can run asynchronously:

```csharp
Task<int> GetNumberAsync()
{
    return Task.Run(() =>
    {
        Thread.Sleep(1000);
        return 42;
    });
}
```

**async / await** — keywords that make asynchronous code look sequential:

```csharp
public async Task<string> FetchDataAsync()
{
    HttpClient client = new HttpClient();
    string data = await client.GetStringAsync("https://example.com");
    return data;
}
```

- `async` marks a method as asynchronous
- `await` pauses the method until the awaited task completes — **without blocking the thread**

## I/O-bound vs CPU-bound

| | What it is | What to do |
|---|---|---|
| **I/O-bound** | Waiting on external resources (network, file, DB) | `await` the async API directly |
| **CPU-bound** | Heavy computation | `Task.Run(...)` to move it off the current thread |

## Under the hood — the state machine

When the compiler sees `await`, it splits the method into parts:

1. Execute until the first `await`
2. **Return control to the caller** (a compiler-generated **state machine** captures the position and locals)
3. **Resume** execution when the awaited task completes

The thread is **not blocked** — continuations are scheduled on the ThreadPool (or the captured context; see the advanced article).

## Example — the thread stays free

```csharp
public async Task LoadDataAsync()
{
    Console.WriteLine("Fetching data...");
    await Task.Delay(2000);
    Console.WriteLine("Data loaded");
}
```

During `await Task.Delay(2000)` the thread is free to do other work.

## Interview one-liners

- "`await` doesn't block the thread — the compiler builds a state machine and schedules a continuation."
- "I/O-bound → await the API; CPU-bound → Task.Run. Mixing these up is the classic mistake."
