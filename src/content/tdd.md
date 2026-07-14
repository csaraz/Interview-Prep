---
title: TDD — Test-Driven Development
level: Mid
category: Testing
tags: tdd, testing, red-green-refactor
order: 20
---

## What is TDD?

A development process where **requirements are converted to test cases before the code is written** — tests first, then code (the opposite of the usual practice).

## The cycle (Red → Green → Refactor)

1. **Add a test** — write a test that passes only when the feature's specification is met. This forces you to focus on requirements *before* writing code.
2. **Run all tests — the new one should fail** (for the expected reason). This proves new code is actually needed and the test isn't trivially green.
3. **Write the simplest code that passes** — inelegant is fine; no code beyond the tested functionality.
4. **All tests should now pass** — if any fail, revise until they do; existing features must not break.
5. **Refactor** — improve readability/maintainability (remove duplication, self-documenting names, smaller methods), re-running the tests after each change.

Repeat for each new piece of functionality. Keep tests **small and incremental**, commit often — if new code fails, you revert instead of debugging for hours.

> Don't write tests so small they merely test an external library — test *your* behavior.

## Benefits to state in interviews

- Requirements thinking up front; tests as living documentation
- High coverage by construction; regressions caught immediately
- Design pressure: hard-to-test code = badly coupled code — TDD forces DI-friendly design

## Honest trade-offs

Slower start; a learning curve; tests need maintenance too; not ideal for exploratory/UI-heavy prototyping.

## Interview one-liner

- "Red-green-refactor: failing test proves the need, simplest code makes it pass, refactoring keeps it clean — with the suite as a safety net."
