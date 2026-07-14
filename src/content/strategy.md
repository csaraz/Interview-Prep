---
title: Strategy Pattern
level: Mid
category: Patterns & Architecture
tags: strategy, design-patterns, behavioral, ocp
order: 50
---

## The problem it solves

A class with multiple algorithm variants often looks like this:

```csharp
public class PaymentService
{
    public void Pay(string method)
    {
        if (method == "creditcard") Console.WriteLine("Paid with Credit Card");
        else if (method == "paypal") Console.WriteLine("Paid with PayPal");
        else if (method == "crypto") Console.WriteLine("Paid with Cryptocurrency");
    }
}
```

❌ Problems: growing if/else chains; adding a method means **modifying this class** (violates OCP); hard to test and maintain.

## The solution

Encapsulate each algorithm in its **own class** and make them interchangeable behind an interface. Behavior is selected **at runtime**.

```csharp
public interface IPaymentStrategy { void Pay(decimal amount); }

public class CreditCardPayment : IPaymentStrategy
{
    public void Pay(decimal amount) => Console.WriteLine($"Paid {amount} using Credit Card.");
}

public class PayPalPayment : IPaymentStrategy
{
    public void Pay(decimal amount) => Console.WriteLine($"Paid {amount} using PayPal.");
}

public class CryptoPayment : IPaymentStrategy
{
    public void Pay(decimal amount) => Console.WriteLine($"Paid {amount} using Cryptocurrency.");
}

// Context
public class PaymentService
{
    private IPaymentStrategy _strategy;

    public void SetStrategy(IPaymentStrategy strategy) => _strategy = strategy;

    public void Checkout(decimal amount) => _strategy.Pay(amount);
}

// usage
var service = new PaymentService();
service.SetStrategy(new CreditCardPayment());
service.Checkout(100);
service.SetStrategy(new PayPalPayment());
service.Checkout(200);
```

## When to use / not use

✅ Multiple variations of an algorithm; algorithms will grow; you want OCP; you're drowning in if/else
❌ One fixed algorithm; strategies would never actually switch

## Real-life examples

- Payment methods: card, PayPal, crypto
- Sorting: quicksort vs mergesort by data size
- Navigation: fastest / cheapest / scenic route
- Compression: zip, rar, tar.gz

## Key interview points

- "Strategy = **choose behavior at runtime**"
- Promotes **composition over inheritance**
- Pairs naturally with **dependency injection** (inject the strategy)
- **Composition + Strategy** is a common combo question: the context *has a* strategy (composition) instead of *being* one (inheritance)
