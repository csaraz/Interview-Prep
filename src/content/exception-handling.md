---
title: Exception Handling — Mechanics, throw vs throw ex
level: Mid
category: C# Fundamentals
tags: exceptions, stack-trace, clr, error-handling
order: 160
---

## How exception handling works

- When an exception is thrown, the CLR **unwinds the call stack** until it finds a matching `catch`
- If no handler is found → `UnhandledException` and the program terminates
- The `finally` block **always executes**

```csharp
try
{
    int x = 10, y = 0;
    var res = x / y;
}
catch (DivideByZeroException ex)
{
    Console.WriteLine($"Handled: {ex.Message}");
}
finally
{
    Console.WriteLine("Always executed");
}
```

## Under the hood

- Exception objects are allocated **on the heap**
- The CLR captures the **call stack** at throw time
- Throwing is **expensive** — use exceptions for exceptional cases, never for control flow

## throw vs throw ex — the classic question

```csharp
try
{
    Method2(); // exception originates here (e.g. int.Parse("abc"))
}
catch (Exception ex)
{
    throw;      // ✅ stack trace shows the ORIGINAL location (Method2)
    // throw ex; // ❌ stack trace RESETS — now says the error happened here
}
```

- `throw;` — rethrows preserving the original stack trace
- `throw ex;` — rethrows *as if it started here*; the original location is lost

## Rethrowing through multiple levels

```csharp
public void MethodA()
{
    try { MethodB(); }
    catch (Exception ex) { Console.WriteLine("Caught in A: " + ex.Message); throw; }
}

public void MethodB()
{
    try { MethodC(); }
    catch (Exception ex) { Console.WriteLine("Caught in B: " + ex.Message); throw; }
}

public void MethodC()
    => throw new InvalidOperationException("Something went wrong in MethodC");
```

The exception **bubbles up** the call stack — each level can log/handle and rethrow — until something handles it or a global handler catches it.

## Interview one-liners

- "`finally` always runs; the CLR unwinds the stack looking for a matching catch."
- "`throw;` keeps the stack trace; `throw ex;` destroys it — that's the whole difference."
