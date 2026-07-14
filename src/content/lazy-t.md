---
title: Lazy&lt;T&gt;
level: Junior
category: C# Fundamentals
tags: lazy, initialization, performance
order: 130
---

## What is Lazy&lt;T&gt;?

`Lazy<T>` (namespace `System`) implements **lazy initialization**: the object is not created until it is actually needed. This improves performance when creating the object is expensive and may not always be required.

## Syntax

```csharp
Lazy<MyClass> lazyObj = new Lazy<MyClass>(() => new MyClass());
```

- The lambda `() => new MyClass()` is the **factory** that creates the object on demand.

## Accessing the value

```csharp
MyClass obj = lazyObj.Value; // created HERE, on first access
```

- The first access to `.Value` creates the object
- Subsequent accesses return the **same instance**
- By default `Lazy<T>` is **thread-safe** — even if multiple threads race on first access, the factory runs once

## Where you meet it in real code

- Thread-safe **Singleton** implementation (see the Singleton article)
- Expensive services that might not be used in a given request
- Deferring heavy configuration/IO until needed

## Interview one-liner

- "`Lazy<T>` defers construction to first use, caches the instance, and handles thread safety for you."
