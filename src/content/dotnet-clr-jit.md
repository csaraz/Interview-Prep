---
title: .NET, CLR, JIT — Managed Execution
level: Mid
category: .NET Internals
tags: clr, jit, msil, managed-code, cts, cls
order: 10
---

## Managed vs unmanaged code

- **Managed code** — built on .NET, managed by the **CLR**: it loads the application, manages memory, enforces type safety. C#, VB.NET, F# compile to **CIL/MSIL** (intermediate language), not machine code.
- **Unmanaged code** — e.g. classic C++ compiled directly to machine code; the CLR does not manage it. .NET provides interop mechanisms to work with unmanaged code.

## Compilation pipeline

1. **Compile time:** C# → language compiler → **MSIL** + metadata, packed into an assembly (`.exe`/`.dll`)
2. **Runtime:** the **JIT (Just-In-Time)** compiler translates MSIL → native machine code

Key JIT detail: only the code that is **actually called** gets compiled, method by method. Compiled code is **cached** until the program exits — the second call to a method uses the already-compiled native code. This improves startup and overall performance.

## The two components of .NET Framework

1. **Class library (BCL)** — types common to all .NET languages
2. **CLR** — class loaders load IL into the runtime, compile IL to native code, execute and manage it

## CLR runtime services

- Memory management (allocation + garbage collection)
- Type safety enforcement
- Security enforcement
- Exception management
- Thread support
- Debugging support

## CLR components (architecture)

Class loader · IL→native (JIT) compiler · Code manager · GC · Security engine · Type checker · Thread support · Exception manager · Debug engine · COM marshaler · BCL support

## The standards alphabet (ECMA)

| Term | What it is |
|---|---|
| **CIL / MSIL** | The intermediate language all .NET languages compile to |
| **CTS** (Common Type System) | Shared type definitions across languages |
| **CLS** (Common Language Specification) | Rules a language follows so its code interoperates with other .NET languages |
| **CLI** (Common Language Infrastructure) | The ECMA spec for the whole infrastructure (CTS + execution + metadata) |

Because every CLS-compliant language compiles to the same IL, code written in one .NET language can be used from another — that's language interoperability.

## Side-by-side execution

Different versions of the same assembly can run on one machine because assemblies carry **version metadata** — this solved "**DLL Hell**".

## Interview one-liners

- "C# compiles to IL at build time; the JIT compiles IL to native code method-by-method at runtime and caches the result."
- "Managed means the CLR controls execution: memory, type safety, security, exceptions."
