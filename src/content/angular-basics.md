---
title: Angular Essentials for .NET Developers
level: Mid
category: Frontend
tags: angular, rxjs, components, guards, storage
order: 10
---

## Components

The **building blocks** of an Angular app — each owns the UI + logic for a part of the page: HTML template (view), CSS/SCSS (styling), TypeScript class (logic). Keep them small and focused.

### Initialization order

1. Angular creates the component instance — **constructor** runs (lightweight init: inject services, set defaults)
2. `@Input()` properties are set from the parent
3. **`ngOnInit()`** runs — inputs are available; do real initialization logic here

### Lifecycle hooks

- `ngOnInit()` — once after initialization
- `ngOnChanges()` — when an `@Input()` changes
- `ngOnDestroy()` — cleanup (unsubscribe!) before destruction

## Services & DI

Services hold **reusable business logic / data access** (API calls, auth, shared state). Angular injects them instead of you `new`-ing — loose coupling and testability, same idea as .NET DI. `providedIn: 'root'` → singleton service.

## Observables (RxJS)

**Streams of data over time** — can emit 0..n values asynchronously. Used for HTTP requests, WebSockets, user events, form `valueChanges`.

- Subscribe to consume; **unsubscribe** in `ngOnDestroy` (or use `async` pipe) to avoid leaks
- Operators (`map`, `filter`, `switchMap`, `debounceTime`) compose streams

## Route Guards

Prevent unauthorized navigation:

- `CanActivate` — block access to a route
- `CanDeactivate` — block leaving (unsaved changes)
- `CanLoad` — block lazy-loaded module loading

## Interceptors

HTTP middleware — attach JWT tokens, handle 401s globally, log requests (the Angular twin of ASP.NET middleware).

## Change detection

- Default: check the whole tree on events
- `OnPush`: check only when inputs change / observable emits → performance

## localStorage vs sessionStorage

| | localStorage | sessionStorage |
|---|---|---|
| Lifetime | Persists after browser close | Only while the tab is open |
| Scope | Browser-wide (all tabs) | Tab-specific |
| Capacity | ~5–10MB | ~5MB |
| Use | Preferences, (dev/test) tokens | Temporary tab state |

Both readable by JS → XSS-sensitive (see JWT article: HttpOnly cookies for production tokens).

## Interview one-liners

- "constructor = injection; ngOnInit = logic that needs inputs."
- "OnPush + async pipe is the standard performance answer."
