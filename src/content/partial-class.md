---
title: partial class — Why and Where
level: Junior
category: C# Fundamentals
tags: partial, code-organization
order: 150
---

## What it is

`partial` lets you split a class, struct, interface, or method across **multiple files**. The compiler merges all parts into one type at compile time.

```csharp
// Person.Part1.cs
public partial class Person
{
    public string Name { get; set; }
}

// Person.Part2.cs
public partial class Person
{
    public void Print() => Console.WriteLine(Name);
}
```

## Why it exists / where it's used

1. **Generated code + your code** — the classic reason. Designers and code generators (WinForms designer files, EF scaffolded models, gRPC/protobuf, source generators) write one file; you extend the type in another file without your edits being overwritten on regeneration.
2. **Organizing very large classes** — splitting a big class by concern (not a great sign architecturally, but practical).
3. **Partial methods** — a declaration in one part, optional implementation in another; if not implemented, the compiler removes the call entirely (used heavily by source generators).

## Rules

- All parts must use the `partial` keyword and the same accessibility
- All parts must be in the same assembly and namespace
- Attributes, interfaces, and members from all parts are merged

## Interview one-liner

- "`partial` exists mainly so generated code and hand-written code can live in separate files for the same type."
