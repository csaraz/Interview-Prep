---
title: Unit Testing (xUnit) & Test Doubles
level: Junior
category: Testing
tags: unit-testing, xunit, mock, stub, testing
order: 10
---

## What is unit testing?

Testing **small units of code** (typically methods) in isolation to verify they work correctly. In C#: xUnit or NUnit + a mocking library (Moq, NSubstitute).

## xUnit essentials

| Attribute | Purpose |
|---|---|
| `[Fact]` | A basic test with no parameters |
| `[Theory]` | A data-driven test |
| `[InlineData(...)]` | Supplies parameters to a Theory |

```csharp
public class CalculatorTests
{
    [Fact]
    public void Add_ReturnsSum()
    {
        var calc = new Calculator();
        Assert.Equal(5, calc.Add(2, 3));
    }

    [Theory]
    [InlineData(2, true)]
    [InlineData(3, false)]
    public void IsEven_Works(int n, bool expected)
        => Assert.Equal(expected, new Calculator().IsEven(n));
}
```

Pattern: **Arrange → Act → Assert**.

## Test doubles (the mock/stub/fake question)

| Double | What it does |
|---|---|
| **Dummy** | Passed but never used (fills a parameter) |
| **Stub** | Returns canned answers ("when GetUser called, return X") |
| **Fake** | Working lightweight implementation (in-memory repository) |
| **Mock** | Pre-programmed with **expectations**; verifies *interactions* ("was Send called once?") |
| **Spy** | Records calls for later inspection |

```csharp
var repo = new Mock<IOrderRepository>();
repo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(new Order { Id = 1 }); // stubbing
var service = new OrderService(repo.Object);

await service.CancelAsync(1);

repo.Verify(r => r.SaveAsync(It.IsAny<Order>()), Times.Once); // mocking (verification)
```

## Unit vs Integration tests

- **Unit** — one unit isolated, dependencies replaced with doubles; fast, thousands per suite
- **Integration** — real components together (real DB / API via `WebApplicationFactory`); slower, fewer, catch wiring problems

## Interview one-liners

- "Stub = state (canned data); Mock = behavior (verify interactions)."
- "DI is what makes unit testing possible — you can't mock what you `new` up inside the class."
