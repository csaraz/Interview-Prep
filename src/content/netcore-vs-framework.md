---
title: .NET Core vs .NET Framework
level: Junior
category: .NET Internals
tags: dotnet-core, dotnet-framework, cross-platform
order: 50
---

## Key differences

| | .NET Framework | .NET Core / modern .NET |
|---|---|---|
| Platform | Windows only | **Cross-platform** (Windows, Linux, macOS) |
| Performance | Good | **Significantly faster** (Kestrel, minimal overhead) |
| Deployment | Machine-wide, GAC | Self-contained or framework-dependent, side-by-side |
| Architecture | Monolithic | **Modular** (NuGet packages) |
| DI | External libraries | **Built-in** DI container |
| Open source | Partially | Fully |
| Future | Maintenance only (4.8 is last) | Active development (.NET 5/6/7/8…) |
| Containers | Awkward | **Designed for Docker/microservices** |

## When would you still meet .NET Framework?

Legacy systems: WebForms, WCF server-side, older enterprise apps. Migration to modern .NET is the common modernization task (and a common interview topic: "how would you migrate?").

## Interview answer sketch

> ".NET Core is cross-platform, faster, modular, with built-in DI and first-class container support. .NET Framework is Windows-only and legacy — chosen only when an existing system depends on it (WebForms, WCF). For anything new, modern .NET."
