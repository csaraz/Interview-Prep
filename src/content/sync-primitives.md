---
title: "Synchronization: lock, Monitor, Interlocked, Mutex, Semaphore"
level: Senior
category: Async & Threading
tags: lock, monitor, mutex, semaphore, interlocked, concurrent-collections, thread-safety
order: 50
---

## 1. lock — simple mutual exclusion

Only one thread can enter the critical section at a time. Under the hood, `lock` uses `Monitor.Enter()`/`Monitor.Exit()` wrapped in try/finally: **lock = Monitor + try/finally**.

> Analogy: a bathroom with one key — one person at a time, others wait.

```csharp
object locker = new object();

void SafeIncrement()
{
    lock (locker)
    {
        counter++;
    }
}
```

Use when: shared mutable data, simple race-condition protection, no timeout needed.

## 2. Monitor — lock with more control

Same mechanism, plus **timeouts / try-lock** and **signaling**:

```csharp
if (Monitor.TryEnter(locker, TimeSpan.FromSeconds(2)))
{
    try { /* critical section */ }
    finally { Monitor.Exit(locker); }
}
else
{
    Console.WriteLine("Couldn't acquire lock in time.");
}
```

Signaling: `Monitor.Wait()` (wait for notification), `Monitor.Pulse()` (notify one), `Monitor.PulseAll()` (notify all).

**Why use Monitor instead of lock?** Only when you need timeouts or wait/pulse signaling — otherwise `lock` gives cleaner code.

## 3. Interlocked — atomic operations

Atomic read-modify-write on `int`/`long` etc. — faster and lighter than locks:

```csharp
Interlocked.Increment(ref counter);
```

Use for counters, flags, swaps in high-performance code.

## 4. Mutex — system-wide lock

Like a lock, but **works across processes** (OS-level).

```csharp
Mutex mutex = new Mutex();

mutex.WaitOne();          // blocks until acquired
try { /* work safely */ }
finally { mutex.ReleaseMutex(); }
```

Use for inter-process coordination (two apps sharing a file, single-instance apps).

**lock vs Mutex:** a lock is specific to the AppDomain; a Mutex belongs to the operating system, enabling inter-process locking (IPC).

## 5. Semaphore / SemaphoreSlim — limited concurrency

Allows **N threads** into the critical section at once.

> Analogy: a parking lot with 3 spots.

```csharp
SemaphoreSlim semaphore = new SemaphoreSlim(3);

async Task UseResource()
{
    await semaphore.WaitAsync();
    try { /* access shared resource */ }
    finally { semaphore.Release(); }
}
```

- `SemaphoreSlim` — lightweight, in-process, **async-friendly** (`WaitAsync`)
- `Semaphore` — heavier, cross-process

Use to throttle API calls, limit parallel work, pool resources.

## 6. Concurrent collections

Thread-safe containers — no manual locks:

```csharp
var dict = new ConcurrentDictionary<int, string>();
dict.TryAdd(1, "apple");
dict.TryUpdate(1, "orange", "apple");
```

`ConcurrentDictionary`, `ConcurrentQueue`, `ConcurrentBag` — for multi-threaded pipelines and caches.

## Summary table

| Tool | Purpose | Lightweight? | Cross-process? |
|---|---|---|---|
| `lock` | Basic mutual exclusion | ✅ | ❌ |
| `Monitor` | Lock + timeout/signaling | ✅ | ❌ |
| `Interlocked` | Atomic ops (counters, flags) | ✅✅ | ❌ |
| `Mutex` | OS-level lock | ❌ | ✅ |
| `SemaphoreSlim` | Limit N concurrent (in-process) | ✅✅ | ❌ |
| `Semaphore` | Limit N concurrent (OS-level) | ❌ | ✅ |
| Concurrent collections | Thread-safe containers | ✅ | ❌ |

**Pro tip:** lock as little as possible. Prefer `Interlocked` / concurrent collections; use `lock`/`Monitor` only when necessary; design for minimal contention.

## Bonus definitions (quick answers)

- "A **lock** allows one thread in, not shared across processes. A **mutex** is a lock that can be system-wide. A **semaphore** does the same but allows **x** threads — e.g. limiting concurrent CPU/IO-intensive jobs."
