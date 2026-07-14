---
title: Generics
level: Junior
category: C# Fundamentals
tags: generics, type-safety, constraints
order: 100
---

Generics let you write **type-safe** code without committing to a specific data type.

```csharp
public class Repository<T>
{
    private List<T> items = new List<T>();

    public void Add(T item) => items.Add(item);
    public T Get(int index) => items[index];
}
```

## Why they matter

- Work with any type (`int`, `string`, custom classes)
- **Avoid boxing/unboxing** and type casting (the pre-generics `ArrayList` boxed every value type)
- **Compile-time type safety** — errors surface at compile time, not runtime

## Constraints

```csharp
public class Repository<T> where T : class, new()
{
    public T Create() => new T();
}
```

| Constraint | Meaning |
|---|---|
| `where T : class` | T must be a reference type |
| `where T : struct` | T must be a value type |
| `where T : new()` | T must have a parameterless constructor |
| `where T : SomeBase` | T must derive from SomeBase |
| `where T : ISomething` | T must implement the interface |

## Interview one-liners

- "Generics give you reuse *without* losing type safety and *without* boxing."
- "Constraints let generic code actually *do* something with T — call `new()`, use interface members, etc."
