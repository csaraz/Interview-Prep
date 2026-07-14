---
title: Reflection
level: Mid
category: C# Fundamentals
tags: reflection, metadata, runtime
order: 190
---

## What is reflection?

Reflection lets you **inspect and interact with type metadata at runtime**: discover types, invoke methods dynamically, and read/write properties without knowing them at compile time.

```csharp
Type t = typeof(Person);                    // or obj.GetType()
var props = t.GetProperties();              // discover members
object instance = Activator.CreateInstance(t); // create dynamically
t.GetMethod("Print")?.Invoke(instance, null);  // invoke dynamically
```

## Where it's used in the real world

- **Serialization** (System.Text.Json uses reflection + IL emit for fast accessors)
- **DI containers** — building object graphs from registrations
- **ASP.NET Core** — controllers are discovered via reflection (`ApplicationParts`)
- **ORMs** (EF Core model building), test frameworks, mappers

## Costs and cautions

- Reflection is **slow** compared to direct calls — cache `MethodInfo`/`PropertyInfo`, or use compiled expressions/source generators in hot paths
- Bypasses compile-time safety — errors surface at runtime
- `MetadataLoadContext` (.NET Core) lets you load an assembly **only to inspect it**, without executing it

## Interview one-liner

- "Reflection reads type metadata at runtime — powerful for frameworks, expensive in hot paths."
