---
title: "Lesson 1: Threads, the Thread Pool, and What async Actually Buys You"
level: Senior
category: Async & Threading
tags: threads, threadpool, async, starvation, iocp, concurrency, lesson
order: 5
---

The foundation lesson. Everything in the async/concurrency track rests on this, and most senior-level interview probes are really checking whether you understand *this* rather than the syntax.

## 1. The mental model

A thread is not a unit of work. **A thread is a worker with a stack.** The work is what you hand to it.

That distinction is the whole subject. When people say "make it async so it's faster", they're conflating two different resources:

- **Time** — how long one operation takes. Async does **not** improve this. An HTTP call that takes 200 ms takes 200 ms either way.
- **Threads** — how many workers you tie up while waiting. Async improves this enormously, and threads are the scarce resource in a server.

So the one-line model: **`await` does not make the operation faster; it gives the thread back while the operation is in flight.** Throughput goes up because the same small pool of workers serves far more concurrent requests. Latency of a single request stays the same (actually slightly worse — the state machine has overhead).

If you internalise only one sentence from this lesson: *async is a thread-efficiency technique, not a speed technique.*

## 2. The mechanism, precisely

### What a thread actually costs

- **Stack:** 1 MB of *reserved* virtual address space per thread by default on Windows (committed lazily, so the real memory cost is smaller — people overstate this, but the reservation is real and on 32-bit it mattered enormously).
- **Kernel object + scheduler entry:** the OS must track and schedule it.
- **Context switch:** on the order of microseconds, but the hidden cost is worse — the new thread's data isn't in the CPU cache, so you pay cache misses afterwards. This is why "more threads" past the core count stops helping and starts hurting.

Creating a thread per request is therefore a design error at any real scale. That is the problem the thread pool exists to solve.

### The thread pool, as it actually works

- There is **a global queue** plus **a local queue per worker thread**. Work queued from inside a pool thread goes to that thread's local queue (better cache locality); work queued from outside goes global.
- Idle workers **steal** from other threads' local queues when their own is empty. This is why the pool scales without a central bottleneck.
- Thread injection is governed by a **hill-climbing algorithm** that watches throughput, plus a starvation-avoidance path that adds threads slowly — historically around **one or two per second** — when the queue isn't draining. That injection rate is the single most important number in this lesson: **the pool cannot rescue you quickly.**

### I/O does not need a thread

This is the part that is most often stated wrong.

When you `await httpClient.GetAsync(...)`, **no thread is sitting there waiting.** The request is handed to the OS (I/O completion ports on Windows, epoll/kqueue on Linux). The OS signals completion later, and *then* a pool thread picks up the continuation. Between "sent" and "completed" the cost is a pending operation and some state — not a worker.

A blocking `client.GetStringAsync(url).Result` does the opposite: it parks a pool thread for the entire network round trip, doing nothing, while still holding its stack and scheduler slot.

### Thread pool starvation — the failure mode

The mechanism, step by step:

1. Requests arrive and each one blocks a pool thread (`.Result`, `.Wait()`, `lock` held across I/O, a synchronous DB driver).
2. Continuations for in-flight async work need a pool thread to resume on — but all threads are blocked.
3. The pool injects new threads at its slow rate; load arrives far faster than that.
4. Latency doesn't degrade gracefully — it falls off a **cliff**.

The diagnostic signature is distinctive and worth memorising: **high latency, growing queue, and *low* CPU.** The machine looks idle while the application is dying. That combination is the fingerprint of blocking, not of overload.

Measure it with `ThreadPool.ThreadCount`, `ThreadPool.PendingWorkItemCount`, and `dotnet-counters monitor System.Runtime` — threadpool queue length climbing while CPU sits low confirms it.

### Deadlock versus starvation — not the same bug

- **Deadlock** (classic ASP.NET, WPF, WinForms): a `SynchronizationContext` requires the continuation to resume on the *specific* captured thread. You block that thread with `.Result`. The continuation can never run. One request hangs forever.
- **Starvation** (ASP.NET Core): there is **no SynchronizationContext**, so a continuation can resume on any pool thread — no deadlock. But the blocking still burns a worker per in-flight call, and under load the pool is exhausted.

So the frequently repeated "`.Result` is fine in ASP.NET Core because there's no sync context" is half true and dangerously misleading: it stops deadlocking and starts starving. The correct answer names both and explains the difference.

### CPU-bound work is a different animal

`await` solves *waiting*. It does nothing for *computing*. CPU-bound work needs a thread to run on, full stop.

- In a desktop/mobile UI app, `Task.Run` is right: it moves the computation off the UI thread so the interface stays responsive.
- In **ASP.NET Core**, `Task.Run` for CPU work is usually **wrong**. The request is already on a pool thread; moving the work to another pool thread doesn't create capacity, it just adds a hop and makes cancellation and error handling worse. You've moved the problem, not solved it. (The honest exception: offloading so the request can return quickly and the work continues in the background — but then it belongs in a queue and a hosted service, not a fire-and-forget `Task.Run`.)
- For a genuinely long-running loop, don't take a pool thread at all: `TaskCreationOptions.LongRunning` gets you a dedicated thread, or better, use `BackgroundService`.

### What `await` does to your assumptions

The continuation may resume on a **different thread**. Therefore:

- `[ThreadStatic]` and `ThreadLocal<T>` state does not survive an await. Use `AsyncLocal<T>` (this is how `HttpContext` and correlation ids flow).
- `lock` must never be held across an `await` — the compiler forbids `await` inside `lock` precisely because `Monitor` is thread-affine and the release would come from the wrong thread. Use `SemaphoreSlim.WaitAsync()` when you need async mutual exclusion.
- Thread identity in logs is not a stable correlation key in async code. Use a correlation id.

## 3. The trade-offs, named with their cost

- **Async everywhere.** Buys throughput and resilience under load. Costs: state machine allocation per call (mitigated by `ValueTask` on hot paths), harder stack traces, "async all the way" contagion through the codebase, and a whole class of subtle bugs (unobserved exceptions, `async void`, missing cancellation).
- **Blocking code.** Buys simplicity and readable stack traces; costs one thread per concurrent operation. Entirely correct for a CLI tool or a batch job where concurrency is bounded and low — the sin is doing it in a server.
- **More pool threads** (`ThreadPool.SetMinThreads`). Buys you a bridge over a starvation cliff during a legacy migration. Costs memory and context switching, and it masks the real defect — treat it as a tourniquet, not a fix.
- **Dedicated threads for long work.** Buys isolation: your 10-minute loop doesn't eat a shared worker. Costs a thread that exists whether busy or not.
- **`ValueTask` on hot paths.** Buys avoided allocations when results are usually already available. Costs correctness risk: it must be awaited exactly once, and misuse is undefined behaviour.

## 4. The five questions an interviewer asks

**1. "What does `async/await` actually give you?"**
Weak answer: "it makes the app faster / non-blocking". Strong answer: it returns the thread to the pool while an I/O operation is in flight, so a fixed number of workers serves many more concurrent requests — **throughput, not latency**. Then the proof you understand it: *for CPU-bound work it gives you nothing, because that work still needs a thread.*

**2. "What is thread pool starvation, how do you recognise it, and how do you fix it?"**
Name the diagnostic signature — **high latency + growing thread pool queue + low CPU** — because that's what separates people who've read about it from people who've debugged it. Cause: blocking calls consuming workers while the pool injects replacements at only ~1–2 per second. Fix: remove the blocking (async all the way down, async DB/HTTP APIs), not `SetMinThreads`, which is a temporary bridge.

**3. "Is `.Result` safe in ASP.NET Core?"**
The full answer has two halves. No `SynchronizationContext` means **no classic deadlock** — so the usual scare story doesn't apply. But it still **burns a pool thread per call**, which is how you get starvation under load. Safe in a console app's `Main`, in a unit test, at true application startup; never on a request path.

**4. "You have a CPU-heavy operation in an API endpoint. `Task.Run`?"**
Expected: no, and why. The request thread is already a pool thread; moving work to a sibling pool thread adds overhead and loses cancellation/error fidelity without adding capacity. Real options: scale out, do the work in a background worker fed by a queue and return 202, or accept the cost and bound concurrency explicitly (e.g. `SemaphoreSlim`) so heavy requests can't swamp the pool.

**5. "How do you run a continuous background loop in a .NET service?"**
`BackgroundService` / `IHostedService` with `ExecuteAsync(CancellationToken)`; respect the token for graceful shutdown; wrap the loop body in try/catch because an unhandled exception silently kills the service; create a DI **scope** per iteration if you need scoped services like `DbContext` (the hosted service itself is a singleton). If the loop is CPU-bound and long, give it a dedicated thread rather than a pool worker.

## The sentence to leave in their head

> "`await` doesn't make the call faster — it gives the thread back. Blocking doesn't make it slower — it makes it cost a worker. Everything else in server concurrency is a consequence of those two facts."
