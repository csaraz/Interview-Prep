---
title: Events, and Delegate vs Event
level: Mid
category: C# Fundamentals
tags: events, delegates, observer, encapsulation
order: 120
---

## What is an event?

An **event** is a wrapper around a delegate. It lets subscribers (other classes) register handler methods that are called when the event is **raised**. Events provide notifications when something happens in the system.

## Full example (Button / Click)

```csharp
// 1. Delegate type describing the handler signature
public delegate void ClickHandler(string message);

public class Button
{
    // 2. Event of that delegate type
    public event ClickHandler Clicked;

    // 3. Raising the event
    public void Click()
    {
        Console.WriteLine("Button pressed.");
        Clicked?.Invoke("Button was clicked!");
    }
}

class Program
{
    static void Main()
    {
        var button = new Button();

        // 4. Subscribe a handler
        button.Clicked += OnButtonClicked;

        // 5. Trigger — the event fires and calls all subscribers
        button.Click();
    }

    static void OnButtonClicked(string message)
        => Console.WriteLine($"Handler received: {message}");
}
```

Flow: define delegate → declare event of that delegate type → subscribe with `+=` → raising the event invokes every subscriber.

> Modern code usually uses `EventHandler` / `EventHandler<TEventArgs>` instead of custom delegate types.

## Delegate vs Event (mid/senior comparison)

| Aspect | Delegate | Event |
|---|---|---|
| Type | Reference type | Wraps a delegate |
| Assignment | Can assign/**overwrite** (`=`) | Only subscribe/unsubscribe (`+=` / `-=`) from outside |
| Encapsulation | None — external code can overwrite or invoke | Encapsulated — only the owning class can raise it |
| Use case | Callbacks, passing methods | Observer pattern, notifications, decoupling |
| Multicast | Supported | Supported |
| Invocation | `delegateInstance()` | `eventInstance?.Invoke()` (inside owner only) |

**Senior insight:** use delegates for internal callbacks and passing methods as parameters; use events when external code should be able to subscribe safely but never overwrite or raise your delegate.

## Interview one-liners

- "An event is a delegate with access control: outsiders can only `+=`/`-=`, never `=` or invoke."
- "Events are the built-in implementation of the Observer pattern."
