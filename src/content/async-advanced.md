---
title: "Advanced Async: WhenAll, WhenAny, ConfigureAwait, ValueTask, Deadlocks"
level: Senior
category: Async & Threading
tags: async, whenall, configureawait, valuetask, deadlock, synchronization-context
order: 40
---

## Task.WhenAll — run in parallel, wait for all

Useful when tasks are **independent**:

```csharp
public async Task DownloadAllAsync()
{
    var task1 = GetFileAsync("File1");
    var task2 = GetFileAsync("File2");
    var task3 = GetFileAsync("File3");

    var results = await Task.WhenAll(task1, task2, task3);
    Console.WriteLine(string.Join(", ", results));
}
```

**Under the hood:** all tasks start immediately and run concurrently; the continuation resumes only after **all** finish. If several fail, `WhenAll` aggregates the exceptions.

## Task.WhenAny — first to finish

```csharp
var first = await Task.WhenAny(task1, task2);
Console.WriteLine(await first);
```

**Under the hood:** returns the first completed **Task object**, not its result — you await it again to get the value. Common uses: timeouts, racing redundant requests.

## SynchronizationContext & ConfigureAwait(false)

When you `await` a Task, the continuation by default **captures the current SynchronizationContext** and resumes there:

- UI apps (WPF/WinForms): resumes on the **UI thread**
- Classic ASP.NET: the request context
- .NET Core console / ASP.NET Core: **no context** → resumes on a ThreadPool thread

`ConfigureAwait(false)` says "don't capture the context":

```csharp
await Task.Delay(1000).ConfigureAwait(false);
// continuation may run on any ThreadPool thread
```

Benefits: avoids deadlocks when sync-blocking code exists, slight performance gain. **Recommended in libraries** that don't touch UI.

## The classic deadlock

```csharp
public string GetData()
{
    return FetchDataAsync().Result; // ❌ blocks the current thread
}

public async Task<string> FetchDataAsync()
{
    await Task.Delay(1000);
    return "Data";
}
```

Why it deadlocks (UI / classic ASP.NET):

1. `.Result` **synchronously blocks** the thread waiting for the task
2. `await`'s continuation tries to resume **on that same (captured) context/thread**
3. The thread is blocked → the continuation never runs → **deadlock**

**Fix:** async all the way — `return await FetchDataAsync();` (or `ConfigureAwait(false)` inside the library code).

## ValueTask

A **struct-based** alternative to `Task` that avoids heap allocation when the result is often **already available**:

```csharp
public ValueTask<int> GetNumberAsync(bool immediate)
{
    if (immediate)
        return new ValueTask<int>(42);          // no allocation, no state machine
    return new ValueTask<int>(SlowPathAsync()); // wraps a real Task
}
```

**Caution:** a `ValueTask` must be awaited **only once** — multiple awaits or `.Result`-style misuse leads to undefined behavior. Use for hot paths where results are usually synchronous (e.g. cached reads).

## Interview one-liners

- "`WhenAll` = parallel fan-out for independent async work; `WhenAny` = races and timeouts."
- "Deadlock recipe: block on `.Result` while the continuation needs the blocked context. Cure: async all the way."
- "`ValueTask` saves the allocation when the answer is usually already there — but await it exactly once."
