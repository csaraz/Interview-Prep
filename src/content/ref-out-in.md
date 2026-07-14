---
title: Passing by Reference — ref, out, in
level: Junior
category: C# Fundamentals
tags: ref, out, in, parameters, structs
order: 40
---

`ref` and `out` are parameter modifiers that let methods work with the **caller's variable** instead of a copy. `in` passes by reference too, but read-only.

## ref

Use when the method needs to **read and possibly modify** the caller's variable. The variable **must be initialized** before you pass it.

```csharp
void Double(ref int x) => x *= 2;

int n = 5;
Double(ref n);   // n == 10
```

## out

Use when the method only needs to **assign and return** a value through the parameter. The method **must assign** it before returning; the caller doesn't need to initialize it.

```csharp
bool TryParsePoint(string s, out int x, out int y) { ... }

if (int.TryParse(input, out int value)) { ... } // classic pattern
```

Rule of thumb: `ref` = in+out, `out` = output only (great for "return multiple values").

## in (C# 7.2+)

Passes by reference but **read-only** — the compiler forbids modification inside the method. It exists for **performance**: passing a large `struct` by reference avoids copying it.

```csharp
struct Point { public int X, Y; }

void PrintPoint(in Point p)
{
    // p.X = 10; // ❌ not allowed
    Console.WriteLine($"{p.X}, {p.Y}");
}

Point pt = new Point { X = 1, Y = 2 };
PrintPoint(in pt);
```

Use `in` when:
- You want performance benefits with large structs
- You need to guarantee immutability inside the method

## Reference types vs ref — common confusion

Reference type variables (class, string, arrays, delegates) are themselves references. Passing one **without** `ref` copies the reference *by value* — both copies point to the same object:

- You **can** mutate the object's contents inside the method
- You **cannot** reassign the caller's reference (make it point to a new object) — unless you use `ref`

```csharp
void Mutate(List<int> list) => list.Add(1);      // caller sees the change
void Reassign(List<int> list) => list = new();    // caller does NOT see this
void ReassignRef(ref List<int> list) => list = new(); // caller DOES see this
```

## Interview one-liners

- "`ref` requires initialization before the call; `out` requires assignment inside the method."
- "`in` avoids copying big structs while enforcing read-only access."
- "Without `ref`, a reference type parameter lets you mutate the object but not swap it."
