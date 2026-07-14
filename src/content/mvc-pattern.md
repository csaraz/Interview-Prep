---
title: MVC Pattern
level: Junior
category: Patterns & Architecture
tags: mvc, architecture, separation-of-concerns
order: 100
---

## What is MVC?

A software design pattern separating an app into three parts:

- **Model** — data + business rules
- **View** — presentation/UI
- **Controller** — handles input, orchestrates Model and View

## Benefits

| Benefit | Explanation |
|---|---|
| Separation of concerns | Each part does its own job |
| Maintainability | Modular code, easier changes |
| Testability | Logic (Model & Controller) testable without UI |
| Reusability | Views/Models reusable in other scenarios |

## Disadvantages / limitations

| Limitation | Explanation |
|---|---|
| Complexity | Overkill for small apps |
| Learning curve | The separation confuses beginners |
| Coupling in practice | Devs accidentally mix concerns (logic in views) |
| File overhead | One feature = Model + View + Controller files |

## Q&A summary

- **What is MVC?** A pattern separating an app into Model, View, Controller
- **When?** Web/desktop apps needing organized, maintainable code
- **Main benefit?** Separation of concerns, testability
- **Main drawback?** Boilerplate/complexity for small apps
