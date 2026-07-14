---
title: Dispose vs Finalize (and using)
level: Mid
category: .NET Internals
tags: idisposable, finalizer, gc, using, resources
order: 30
---

Both `Dispose()` and `Finalize()` release **unmanaged resources** (file handles, DB connections, sockets) that the GC doesn't handle automatically — but they work very differently.

## Why we use `using`

`using` is a statement that **ensures resources are cleaned up** when you're done with them — it calls `Dispose()` automatically, even if an exception occurs (it compiles to try/finally — a classic example of *syntactic sugar*).

## Dispose (IDisposable)

**Purpose:** explicitly release resources **deterministically** — at a specific, known time.

```csharp
public class MyResource : IDisposable
{
    private FileStream fileStream;

    public MyResource(string path)
        => fileStream = new FileStream(path, FileMode.Open);

    public void Dispose()
    {
        fileStream?.Dispose();
        GC.SuppressFinalize(this); // prevents the finalizer from also running
    }
}

using (var resource = new MyResource("file.txt"))
{
    // use resource
} // Dispose is called automatically here
```

Key points:

- Called manually or via `using`
- **Fast, deterministic** cleanup — you don't wait for the GC
- Can clean up both managed and unmanaged resources

## Finalize (destructor `~ClassName()`)

**Purpose:** backup cleanup invoked **by the GC** if `Dispose` was never called.

```csharp
public class MyResource
{
    private IntPtr unmanagedHandle;

    ~MyResource()
    {
        ReleaseHandle(unmanagedHandle);
    }
}
```

Key points:

- **Non-deterministic** — you don't know when the GC will run it
- **Adds GC overhead** — finalizable objects survive at least one extra GC cycle
- Can't reliably touch managed objects (they may already be finalized)
- Only needed when holding **raw unmanaged resources** directly

## Under the hood: how GC handles finalizers

1. An object with a finalizer is registered in the **finalization queue** at creation
2. When the GC finds it unreachable, it is moved to the **freachable queue** (finalizer-ready) instead of being freed
3. A **dedicated GC thread** runs the finalizer
4. Only in the **next** GC cycle is the memory actually reclaimed

This is why finalization is expensive and unpredictable — and why `Dispose` + `GC.SuppressFinalize` is the standard pattern.

## Interview one-liners

- "Dispose = deterministic, you call it; Finalize = GC's safety net, non-deterministic and costly."
- "`using` is compiler sugar for try/finally + Dispose."
- "A finalizable object survives at least one extra GC generation — that's the hidden cost."
