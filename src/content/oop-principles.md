---
title: OOP Principles
level: Junior
category: C# Fundamentals
tags: oop, encapsulation, inheritance, polymorphism, abstraction
order: 90
---

OOP is a programming paradigm based on **objects** — they combine data (fields/properties) and behavior (methods).

## The four principles

1. **Encapsulation** — keep data private and expose only what is necessary
2. **Inheritance** — reuse code by creating subclasses
3. **Polymorphism** — use a single interface for different data types
4. **Abstraction** — hide implementation details

## Under the hood notes

- The CLR creates a **method table (vtable)** in memory for each type
- **Heap vs stack:** class instances live on the heap, struct values on the stack (usually)
- **Boxing/unboxing:** converting a value type to `object` allocates on the heap — a performance cost

## Related distinctions worth having ready

- **Overriding** — runtime polymorphism via `virtual`/`override`; resolved through the vtable
- **Overloading** — same method name, different signatures; resolved at compile time
- **Interface vs abstract class** — interface = contract only (multiple allowed); abstract class = shared implementation + state (single inheritance)

## Interview one-liners

- "Encapsulation protects invariants; abstraction hides complexity; inheritance shares code; polymorphism shares *interface*."
- "Static methods can't be overridden because overriding needs an instance's virtual method table."
