---
title: Factory Method Pattern
level: Mid
category: Patterns & Architecture
tags: factory, design-patterns, creational, ocp
order: 40
---

## Purpose

Provide an interface for creating objects, but let **subclasses decide which class to instantiate**. Avoids tight coupling between code that *uses* an object and the object's concrete implementation.

## Example

```csharp
// Product interface
public interface ITransport { void Deliver(); }

// Concrete products
public class Truck : ITransport
{
    public void Deliver() => Console.WriteLine("Deliver by land in a truck.");
}

public class Ship : ITransport
{
    public void Deliver() => Console.WriteLine("Deliver by sea in a ship.");
}

// Creator
public abstract class Logistics
{
    public abstract ITransport CreateTransport();   // the factory method

    public void PlanDelivery()
    {
        var transport = CreateTransport();
        transport.Deliver();
    }
}

// Concrete creators decide the type
public class RoadLogistics : Logistics
{
    public override ITransport CreateTransport() => new Truck();
}

public class SeaLogistics : Logistics
{
    public override ITransport CreateTransport() => new Ship();
}

// usage
Logistics road = new RoadLogistics();
road.PlanDelivery(); // Deliver by land in a truck.
```

## When to use

- The exact type isn't known until **runtime**
- Subclasses should decide what to create
- You want the **Open/Closed Principle**: new product types without touching existing logic

## When NOT to use

- Creation is simple and will never vary → just use `new`
- No expected variations → the abstraction only overcomplicates

## Real-life examples

- Document editors: `CreateDocument()` → WordDoc / PDFDoc / Spreadsheet
- UI frameworks: Windows factory → WinButton, Mac factory → MacButton
- Logistics: road → truck, sea → ship

## The interview answer

> "Factory Method solves tight coupling between object creation and usage. It delegates creation to subclasses, making the system extendable — new object types without modifying existing code, which is the Open/Closed Principle in action."
