---
title: Access Modifiers in C#
level: Junior
category: C# Fundamentals
tags: access-modifiers, encapsulation, oop
order: 80
---

| Modifier | Where accessible | Description |
|---|---|---|
| `public` | Anywhere | No restrictions |
| `private` | Containing class only | Default for class members |
| `protected` | Containing class + derived classes | Inheritance access |
| `internal` | Same assembly | Any code in the same project/assembly |
| `protected internal` | Derived classes **OR** same assembly | Union of protected and internal |
| `private protected` | Derived classes **in the same assembly** | Intersection of protected and internal |

## Quick memory aid

- `protected internal` = protected **or** internal (wider)
- `private protected` = protected **and** internal (narrower)

## Related: Inheritance vs Composition relationships

- **Inheritance = IS-A** relationship: *an eagle IS A bird*
- **Property/field = HAS-A** relationship: *an address HAS A city*

## Interview one-liner

- "The tricky pair is `protected internal` (either condition) vs `private protected` (both conditions must hold)."
