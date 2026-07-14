---
title: String Immutability & Span&lt;T&gt;
level: Mid
category: C# Fundamentals
tags: string, immutability, span, memory, performance
order: 180
---

## String immutability

In C#, strings are **immutable** — once created, the value cannot be changed. Any "modification" creates a **new string object**.

```csharp
string s1 = "Hello";
string s2 = s1;
s2 = "World";

Console.WriteLine(s1); // "Hello"  — unaffected
Console.WriteLine(s2); // "World"  — new object
```

### Why immutability?

- **Thread safety** — strings can be shared across threads without synchronization
- **Security** — values can't change unexpectedly (think connection strings, paths)
- **Optimization** — the runtime can reuse string literals (**string interning**), which would be unsafe if strings were mutable

> Consequence: heavy string concatenation in loops allocates many objects — use `StringBuilder` or `Span<char>`.

## Span&lt;T&gt;

`Span<T>` represents a **contiguous region of arbitrary memory** — a slice of an array, a string, or unmanaged memory. It is a **stack-only type** (`ref struct`) giving high-performance access **without heap allocations or copying**.

### Key features

- **Memory-safe** — bounds-checked, unlike raw pointers
- **Zero-copy slicing** — work with parts of arrays/strings without creating new objects
- **No heap allocation** — lives on the stack

```csharp
string message = "Hello, World!";
ReadOnlySpan<char> span = message.AsSpan(); // view over the string, no copy

ReadOnlySpan<char> world = span.Slice(7, 5);
Console.WriteLine(world.ToString()); // "World"
```

- `AsSpan()` — view over the string's memory, no copy
- `Slice(7, 5)` — a sub-view starting at index 7, 5 chars long, still no copy

### Use cases

- Parsing / processing large data without allocations
- String manipulation without creating intermediate strings
- Interop with unmanaged memory in high-performance code

### Limitations to mention

- `ref struct` → cannot be stored in fields of classes, cannot cross `await` boundaries (use `Memory<T>` for that)

## Interview one-liners

- "Strings are immutable for thread safety, security, and interning; every 'change' is a new object."
- "`Span<T>` is a zero-allocation window into memory — slicing without copying."
