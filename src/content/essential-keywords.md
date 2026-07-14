---
title: "Small but Important: checked, ??, ??=, break, continue"
level: Junior
category: C# Fundamentals
tags: checked, null-coalescing, operators, keywords
order: 50
---

## checked — overflow checking

By default, integer overflow does **not** throw — it wraps around (`int.MaxValue + 1` becomes `int.MinValue`). Overflow checking is disabled by default for performance. `checked` forces the CLR to throw:

```csharp
int max = int.MaxValue;
int error = checked(max + 1); // throws System.OverflowException
```

## ?? — null-coalescing operator

Returns the left-hand side if it is not null, otherwise the right-hand side:

```csharp
string? input = null;
string result = input ?? "Default";   // "Default"

int? a = null, b = -1;
Console.WriteLine(a ?? b); // -1
a = 1;
Console.WriteLine(a ?? b); // 1
```

## ??= — null-coalescing assignment

Replaces this pattern:

```csharp
if (variable is null)
    variable = expression;
```

with:

```csharp
variable ??= expression;
```

## break vs continue

**break** — immediately exits the loop; no further iterations run:

```csharp
for (int i = 0; i < 9; i++)
{
    if (i == 5) break;
    Console.WriteLine(i);
}
// Output: 0 1 2 3 4
```

**continue** — skips the current iteration and moves to the next:

```csharp
for (int i = 0; i < 9; i++)
{
    if (i == 5) continue;
    Console.WriteLine(i);
}
// Output: 0 1 2 3 4 6 7 8
```
