---
title: Delegates, Action, Func, Predicate
level: Junior
category: C# Fundamentals
tags: delegates, action, func, predicate, callbacks
order: 110
---

## What is a delegate?

A delegate is a **type-safe function pointer**. It references methods with a specific signature and invokes them indirectly. Delegates are the foundation of callbacks and event handling.

```csharp
public delegate int MathOp(int a, int b);

int Add(int a, int b) => a + b;

MathOp op = Add;
int result = op(2, 3); // 5
```

## Built-in generic delegates

You rarely declare your own delegate types — use these:

| Delegate | Signature | Use |
|---|---|---|
| `Action<T>` | returns `void`, 0–16 params | "do something" |
| `Func<T, TResult>` | returns a value (last type param is the return type) | "compute something" |
| `Predicate<T>` | returns `bool` | tests/conditions |

```csharp
Action<string> log = msg => Console.WriteLine(msg);
Func<int, int, int> add = (a, b) => a + b;
Predicate<int> isEven = n => n % 2 == 0;
```

## Why do we use delegates?

- **Callbacks** — pass behavior into a method (e.g. `List.Sort(comparison)`)
- **Decoupling** — the caller doesn't need to know which concrete method runs
- **Events** — delegates are the underlying mechanism of events
- **LINQ** — every `Where`, `Select` takes a `Func`

## Multicast

A delegate can hold multiple methods (`+=`); invoking it calls all of them in order.

## Interview one-liners

- "A delegate is a type-safe function pointer; `Action`/`Func`/`Predicate` are its ready-made generic forms."
- "LINQ and events wouldn't exist without delegates."
