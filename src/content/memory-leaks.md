---
title: Memory Leaks in C#
level: Mid
category: C# Fundamentals
tags: memory-leak, gc, idisposable, weak-reference
order: 200
---

## What is a memory leak?

A memory leak happens when a program **fails to release memory that is no longer needed**, causing memory usage to grow over time. In .NET specifically: objects are no longer *in use* but are still *referenced*, so the GC can't reclaim them.

## Common causes in C#

1. **Undisposed resources** — file handles, DB connections, sockets left open
2. **Static references** — a static collection that only grows (statics are never collected until app shutdown)
3. **Event handler subscriptions** — subscriber never unsubscribes (`-=`); the publisher keeps the subscriber alive
4. **Long-lived caches** without eviction
5. **Captured closures** holding large objects longer than expected

## How to avoid

- Implement/consume `IDisposable` correctly — `using` blocks for connections, streams, handles
- Avoid unnecessary static references; clear or bound static collections
- Unsubscribe from events, or use weak event patterns
- Use **weak references** (`WeakReference<T>`) for caches so the GC can collect entries under memory pressure

## How to diagnose

- Memory profilers (dotMemory, PerfView, Visual Studio Diagnostic Tools)
- Look for: steadily growing Gen 2 / LOH, large retained object graphs rooted in statics or event handlers

## Interview one-liners

- "In .NET a 'leak' means a *reachable but useless* object — the GC only collects what's unreachable."
- "The classic .NET leak is an event subscription that's never removed."
