---
title: JavaScript Closures
level: Junior
category: Frontend
tags: javascript, closure, scope
order: 20
---

## What is a closure?

A closure is a function that **remembers the variables from the scope where it was created**, even after that scope has finished executing.

```javascript
function makeCounter() {
  let count = 0;              // lives in makeCounter's scope

  return function () {        // this inner function "closes over" count
    count++;
    return count;
  };
}

const counter = makeCounter(); // makeCounter has RETURNED…
counter(); // 1
counter(); // 2  …but count is still alive, captured by the closure
```

## Why it matters

- **Data privacy / encapsulation** — `count` can't be touched except through the returned function (pre-`class` JS modules were built on this)
- **Callbacks & event handlers** — they capture surrounding variables
- **Factories** — functions producing configured functions

## The classic trap (asked in interviews)

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i)); // 3, 3, 3  — var: ONE shared i
}

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i)); // 0, 1, 2  — let: new i per iteration
}
```

`var` is function-scoped — all callbacks close over the same variable; `let` is block-scoped — each iteration gets its own.

## Interview one-liner

- "A closure = a function plus its captured lexical environment; it's why the counter keeps counting after the factory returned."
