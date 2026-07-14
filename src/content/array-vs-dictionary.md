---
title: Array vs Dictionary (and Dictionary Internals)
level: Junior
category: C# Fundamentals
tags: collections, array, dictionary, hash-table, big-o
order: 140
---

## Basic idea

- **Array** — sequential collection accessed **by index** (0, 1, 2, …)
- **Dictionary** — key-value store accessed **by key**; keys must be unique

## Memory layout

- **Array** — one **contiguous block** of memory. Access is a direct calculation: `address = base + (i * elementSize)` → O(1)
- **Dictionary** — internally a **hash table**: the key is hashed → mapped to a bucket index; collisions are handled (chaining/open addressing); memory is spread across buckets, not contiguous

## Performance

| Operation | Array | Dictionary |
|---|---|---|
| Access by index/key | O(1) | O(1) average, O(n) worst (many collisions) |
| Insert/remove | O(n) — fixed size, shifting | O(1) average (occasional re-hash) |
| Order preserved | Yes (by index) | No guarantee |

## Use cases

- **Array** — order matters, positional access, sequential processing
- **Dictionary** — fast lookup by a meaningful key (Id, Name); caches; grouping

## Dictionary&lt;TKey, TValue&gt; details

- Retrieval by key is close to **O(1)** because it's a hash table
- Every key must be **unique** per the dictionary's equality comparer
- A **key cannot be null**; a value can be (if TValue is a reference type)
- The element type is `KeyValuePair<TKey, TValue>` — that's what you iterate over
- A bad `GetHashCode` implementation → many collisions → performance degrades toward O(n)

## Interview one-liners

- "Array = index into contiguous memory; Dictionary = hash the key into a bucket."
- "Dictionary is O(1) *average* — the worst case is O(n) when the hash function clusters keys."
