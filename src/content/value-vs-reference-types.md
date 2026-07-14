---
title: Value Types vs Reference Types (Stack, Heap, Boxing)
level: Junior
category: C# Fundamentals
tags: value-types, reference-types, stack, heap, boxing, memory
order: 20
---

## Core difference

**Value types**

- Store the actual data directly in their own memory space
- Usually allocated on the **stack** (with exceptions — e.g. when they are fields of a reference type, they live on the heap inside that object)
- When passed to a method, the **entire value is copied** — changes inside the method do not affect the original
- Derive from `System.ValueType` (which itself derives from `Object`); `ValueType` is abstract
- Cannot be derived from — all value types are implicitly **sealed**
- Categories: `struct` and `enum`

**Reference types**

- Store a **reference (memory address)** to the actual data; the data lives on the **managed heap**
- When passed to a method, only the reference is copied — both copies point to the **same object**, so changes inside the method affect the original object
- A declared reference variable contains `null` until an object created with `new` is assigned
- When no longer referenced, the object becomes eligible for **garbage collection**

## Stack vs Heap

| | Stack | Heap |
|---|---|---|
| Allocation | Static, at compile-known sizes | Dynamic, at runtime |
| Managed by | CPU/compiler automatically | GC (in .NET) |
| Speed | Very fast | Slower (allocation search, GC) |
| Size | Small (~1MB per thread on Windows) | Limited only by virtual memory |
| Threading | **Each thread has its own stack** | **Shared** across threads |
| Structure | LIFO (last in, first out) | Random access |

When a function declares a variable, the compiler allocates a block on the stack; when the function returns, it is deallocated automatically. Heap allocation searches for a free block, marks it reserved, and returns a pointer — this mechanism causes **memory fragmentation** and is slower.

## What `new` does (under the hood)

1. Calculates the bytes needed by the object and its base object, **plus** two extra members every object has: the **type object pointer** and the **sync block index**
2. Allocates memory for the calculated size on the heap
3. Initializes the type object pointer and sync block index
4. Calls the type instance's constructor

## Boxing and Unboxing

**Boxing** converts a value type to an object (heap):

1. Memory is allocated on the heap (including type object pointer + sync block index)
2. The value type's fields are copied into that object
3. The address of the object is returned — you now have a boxed value

**Unboxing** copies the fields from the boxed object back into a value type.

You end up with (often accidental) boxing when:

- You call non-overridden `Object` methods like `ToString()`, `Equals()` on a value type
- You call non-virtual methods inherited from `Object`
- You **cast a value type to an interface**

Boxing hurts performance — one reason generics exist (see the Generics article).

## Equality note

- Reference type `Equals` by default checks **identity** (same pointer) — override it for value semantics.
- Value type `Equals` compares all fields **via reflection** — slow; override `Equals`/`GetHashCode` for hot paths.

## Interview one-liners

- "Value types hold the data; reference types hold an address to data on the heap."
- "Passing a reference type without `ref` copies the reference, not the object — you can mutate the object, but you can't reassign the caller's variable."
- "Casting a struct to an interface boxes it."
