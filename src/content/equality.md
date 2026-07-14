---
title: "== vs Equals(), and Equality Under the Hood"
level: Junior
category: C# Fundamentals
tags: equality, equals, gethashcode, operators
order: 60
---

## The short answer

- `==` on reference types (by default) checks whether two variables **refer to the same object** (reference/identity equality)
- `.Equals()` checks whether two objects have the **same value** — *if* the type overrides it (like `string` does)

```csharp
string a = "hello";
string b = new string("hello".ToCharArray());

Console.WriteLine(ReferenceEquals(a, b)); // false — different objects
Console.WriteLine(a == b);                // true — string overloads ==
Console.WriteLine(a.Equals(b));           // true — value comparison
```

## Under the hood

- **Reference types:** default `Equals` checks identity (pointer equality). Override it (and `==` if needed) for value semantics.
- **Value types:** default `Equals` compares **all fields via reflection** — correct but slow. Override `Equals` and `GetHashCode` for performance-sensitive structs.

## Rules to remember

- If you override `Equals`, always override `GetHashCode` — objects that are equal must have equal hash codes, or `Dictionary`/`HashSet` break.
- Prefer implementing `IEquatable<T>` on structs to avoid boxing.
- `string` is the classic special case: `==` is overloaded to compare values.

## System.Object's methods (every type has these)

Public: `Equals`, `GetHashCode`, `ToString`, `GetType`
Protected: `MemberwiseClone`, `Finalize`

## Interview one-liner

- "`==` compares references by default; `Equals` is meant for value equality — and `string` overloads both, which is why it's the favorite trick question."
