---
title: The static Keyword — Memory, Lifetime, and Pitfalls
level: Junior
category: C# Fundamentals
tags: static, clr, memory, method-table
order: 30
---

## Definition

`static` means: **belongs to the type itself, not to a specific instance**. The CLR ensures a static member exists in a single shared memory location for the entire lifetime of the application.

## Memory model

- Normal objects live on the **managed heap**
- Static fields and type metadata live in special memory areas called **Loader Heaps** (including the High-Frequency Heap) — objects there **never move**

## Initialization and lifetime

- Static members are initialized when the class is **first loaded**: when the first instance is created, or when a static member is accessed for the first time
- Static variables live for the entire lifetime of the **AppDomain** — they are not collected by the GC until it shuts down

## Method Table

Every class has a **Method Table** in memory.

- Static methods reside in the Method Table and are resolved directly through it
- Instance methods also live there but require a `this` pointer, passed implicitly on each call
- Static methods receive **no** `this` reference

## Kinds of static members

- **Static class** — cannot be instantiated (`new` not allowed); must contain only static members
- **Static variable** — shared across all instances; if one instance modifies it, all see the change (counters, global config, singleton-like behavior)
- **Static method** — can access only static members; typically pure functions (e.g. `Math.Abs()`)
- **Static constructor** — initializes static data; called automatically by the CLR, exactly **once per type**; cannot be called manually; no access modifiers, no parameters

## FAQ (real interview questions)

**Q: Can a static method access non-static variables?**
No. Instance variables belong to a specific object; a static method has no `this`, so it doesn't know *which* instance to use.

**Q: Is a static constructor thread-safe?**
Yes. The CLR guarantees it runs only once. If two threads hit the class simultaneously for the first time, one blocks until the static constructor finishes.

**Q: What is the risk of too many static variables?**
- **Memory** — never garbage collected until app close; large static collections cause memory leaks
- **Testing** — they keep state between unit tests
- **Concurrency** — shared state across threads → race conditions unless locked

**Q: Can you override a static method?**
No. Overriding relies on polymorphism and the virtual method table of an *instance*. Static calls are bound at **compile time** (static binding).

**Q: When should you use a static class?**
When the class is a container for utility methods (like `Math` or `File`) that don't maintain per-object state.

> See also: *Singleton vs Static Class* in the Singleton pattern article.
