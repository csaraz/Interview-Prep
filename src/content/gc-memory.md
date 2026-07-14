---
title: Garbage Collection — Generations, LOH, Roots
level: Senior
category: .NET Internals
tags: gc, memory, generations, loh, heap
order: 40
---

## Allocating memory

When a process initializes, the runtime reserves a **contiguous address space** — the **managed heap** — without allocating storage yet. The heap keeps a pointer to where the **next object** will go. Allocation with `new` is therefore extremely fast: bump the pointer (vs unmanaged allocation, which walks linked lists of free blocks). Objects are created **contiguously**, which also makes access faster (locality).

## Releasing memory — how collection works

Every application has a set of **roots**: global and static object pointers, local variables, reference parameters on thread stacks, CPU registers. The JIT and runtime maintain this root list.

1. GC starts by considering **every object garbage**
2. It walks the roots and builds a **graph of reachable objects**
3. Unreachable objects = garbage → their memory is reclaimed
4. GC **compacts** the survivors (copies them together) and updates all root pointers

## Generations

The GC is **generational** — based on the observation that in a well-tuned app, most objects die young:

| Generation | Contains | Collected |
|---|---|---|
| **Gen 0** | Recently created objects | Most often |
| **Gen 1** | Survivors of Gen 0 — buffer between young and long-lived | Less often |
| **Gen 2** | Long-lived objects (+ all large objects) | Rarely — a Gen 2 collection = **full GC** |

- New small objects are always allocated in **Gen 0**
- Survivors get **promoted** to the next generation
- Collecting generation N also collects all younger generations
- Gen 1/2 are searched only when a Gen 0 collection doesn't free enough memory

## Large Object Heap (LOH)

- Objects **≥ 85,000 bytes** are "large" (number chosen by performance tuning)
- Physically, the GC reserves **heap segments** via `VirtualAlloc`: one for small objects (**SOH**) and one for large objects (**LOH**)
- Large objects are allocated **directly in Gen 2** and collected only in full GCs
- The LOH is **swept, not compacted** (compaction is too expensive for big objects) — dead objects become a free list; adjacent dead objects merge
- Consequence: the LOH **fragments over time**

User code can only allocate into Gen 0 (small) or the LOH (large); Gen 1/2 are filled only by promotion.

## Practical takeaways

- Avoid frequent large allocations (arrays ≥ 85KB) — LOH fragmentation
- Statics live until AppDomain shutdown — bounded caches only
- `Dispose` deterministic cleanup > relying on finalizers (see Dispose vs Finalize)

## Interview one-liners

- "GC = mark reachable from roots, sweep the rest, compact survivors, promote by generation."
- "Gen 2 collection is a full GC; large objects (≥85KB) live on the LOH which is swept but not compacted."
