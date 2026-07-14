---
title: Program vs Process vs Thread, and Context Switching
level: Junior
category: C# Fundamentals
tags: process, thread, os, context-switching
order: 10
---

## Program vs Process

**Program** — a *passive* entity: a set of instructions and data stored in a file (`.exe`, `.dll`).

- Lives on disk (HDD/SSD)
- Exists until the file is deleted
- Consumes no CPU or RAM while just stored

**Process** — an *active* entity: an instance of a program currently being executed by the OS.

- Lives in RAM
- Exists while the program is running
- Owns allocated memory (stack, heap), file handles, and threads

## Process vs Thread

- A **process** is a container for resources (its own memory, its own files). A **thread** is a unit of execution *inside* a process.
- All threads of one process **share the same process memory (heap)** but each has **its own stack**.
- A process is heavyweight; a thread is lightweight (a "lightweight subprocess").
- Creating a process allocates a separate memory area; threads share a common memory area.

**Can two processes read each other's memory directly?** No. The OS enforces isolation. To pass data between processes you need **IPC (Inter-Process Communication)**: named pipes, sockets, or shared memory via special APIs.

## Context Switching

Context switching is the process where the CPU:

1. Stops executing one task (process or thread)
2. Saves its current state (registers, instruction pointer)
3. Loads the state of another task

> ⚠️ **Terminology note:** "task" here is the general OS term for *a unit of execution* — meaning a process or a thread. It is **NOT** the C# `Task` class. C#'s `Task` is a .NET abstraction representing a unit of *work* scheduled onto ThreadPool threads (see *Task vs Thread* article). Same word, two different worlds.

This happens extremely fast, giving the illusion that programs run simultaneously.

### Performance impact

- Context switching is **expensive** — during the switch, the CPU does no productive work.
- Too many threads can cause **thrashing**: the system spends more time switching than executing.

## Interview one-liners

- "A program is instructions on disk; a process is that program running in memory with its own resources."
- "Threads share the heap of their process but have separate stacks."
- "Context switching is why 'more threads' is not automatically 'faster'."
