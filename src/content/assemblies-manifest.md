---
title: Assemblies & Manifest
level: Mid
category: .NET Internals
tags: assembly, manifest, gac, metadata
order: 20
---

## What is an assembly?

An assembly is the **fundamental unit of deployment, version control, reuse, activation scoping, and security permissions** in .NET. It is a collection of types and resources built to work together — a logical unit of functionality, in the form of an `.exe` or `.dll`.

Assemblies give the CLR the information it needs to be aware of type implementations.

## Properties

- Implemented as `.exe` or `.dll` files
- (.NET Framework) shared assemblies can go into the **GAC** (Global Assembly Cache) — must be **strong-named** first
- Loaded into memory **only if required** — an efficient way to manage resources in larger projects
- Can be inspected programmatically with **reflection**; can be loaded *only for inspection* with `MetadataLoadContext` (.NET Core) or `Assembly.ReflectionOnlyLoad` (.NET Framework)

## What's inside

**IL code + metadata.** Metadata describes the types the code contains and the types it references — the CLR needs it to JIT-compile and enforce type safety. Metadata also records the application's dependencies, enabling side-by-side versioning.

## Manifest

The **manifest** is the part of the assembly containing metadata *about the assembly itself*: version information, scope, and everything related to the assembly's identity and dependencies. "Metadata means data about data."

## Interview one-liners

- "Assembly = IL + metadata + manifest; the deployment and versioning unit of .NET."
- "The manifest is the assembly's self-description: name, version, culture, referenced assemblies."
