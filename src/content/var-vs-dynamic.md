---
title: var vs dynamic
level: Junior
category: C# Fundamentals
tags: var, dynamic, type-system
order: 70
---

## var — static typing

- The compiler infers the type at **compile time**; it cannot change afterwards
- Full IntelliSense and compile-time safety
- Purely syntactic convenience — the IL is identical to writing the explicit type

```csharp
var count = 5;        // int, decided at compile time
// count = "hello";   // ❌ compile error
```

## dynamic — runtime typing

- The type is resolved at **runtime**; it can change, and errors surface only during execution
- Useful for COM interop, reflection scenarios, or loosely-typed data (e.g. JSON with unknown shape)

```csharp
dynamic value = 5;
value = "hello";          // ✅ fine
value.NonExistentMethod(); // ✅ compiles… 💥 RuntimeBinderException at runtime
```

## Comparison

| | var | dynamic |
|---|---|---|
| Type resolved | Compile time | Runtime |
| Can change type | No | Yes |
| IntelliSense | Full | None |
| Errors caught | At compile time | At runtime |
| Typical use | Readability | COM interop, reflection, dynamic data |

## Interview one-liner

- "`var` is compile-time sugar — the type is fixed and checked. `dynamic` defers everything to runtime and trades safety for flexibility."
