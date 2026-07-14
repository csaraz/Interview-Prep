---
title: SOLID Principles
level: Mid
category: Patterns & Architecture
tags: solid, design-principles, oop
order: 10
---

## S — Single Responsibility Principle (SRP)

*A class should have only one reason to change.*
Each class/module handles **one responsibility**.

## O — Open/Closed Principle (OCP)

*Open for extension, closed for modification.*
Add new features **without changing existing code** (interfaces, inheritance, composition — see Strategy/Factory patterns).

## L — Liskov Substitution Principle (LSP)

*Subclasses must be substitutable for their base class without breaking the program.*
Derived classes must honor the parent's contract (no surprise exceptions, no strengthened preconditions).

## I — Interface Segregation Principle (ISP)

*No client should depend on methods it doesn't use.*
Prefer several **small, specific interfaces** over one fat interface.

## D — Dependency Inversion Principle (DIP)

*Depend on abstractions, not concrete implementations.*
High-level modules shouldn't depend on low-level modules; **both depend on interfaces**. This is what makes DI containers useful (see the Dependency Injection article).

## How they connect in practice

- SRP keeps classes small → easier to test
- OCP + Strategy pattern kill `if/else` chains
- DIP + DI container = testable, swappable infrastructure
- LSP violations usually mean the inheritance hierarchy is wrong (prefer composition)

## Interview one-liners

- "SRP: one reason to change. OCP: extend, don't modify. LSP: subtypes behave. ISP: thin interfaces. DIP: depend on abstractions."
- "DIP is the principle; Dependency Injection is the technique that implements it."
