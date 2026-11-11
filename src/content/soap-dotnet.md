---
title: SOAP in .NET for Integration Engineers
level: Senior
category: Patterns & Architecture
tags: soap, wcf, integration, rest, wsdl, versioning, retries
order: 127
---

Day 1 of the integration-role prep. SOAP is the one must-have on that job description that isn't already daily work — and it's the one an interviewer can catch you on fastest, because the failure modes are specific and memorable.

## 1. The mental model

REST is *resource-shaped and convention-driven*: you learn the URL scheme and the status codes. SOAP is **contract-first and operation-shaped**: a WSDL file declares the operations, their XSD-typed parameters, and the faults they can raise. A tool reads that contract and generates a client; you then call what looks like a local method.

The practical consequence: with REST you discover the API by reading docs and poking it. With SOAP you *compile against* it. That is the whole trade — rigidity in exchange for a machine-checkable contract. ERP vendors chose SOAP because their APIs are enormous, strongly typed, and change on a slow release train; NetSuite's SuiteTalk is still SOAP-first for exactly that reason.

Mentally: **SOAP is RPC over XML with a type system and an envelope** — not "an older REST".

## 2. The mechanism, precisely

**The envelope.** Every message is `Envelope > { Header, Body }`. The Body carries the operation call or its response. The **Header** is where cross-cutting concerns live: authentication tokens (WS-Security UsernameToken), routing, correlation ids, and vendor-specific blocks. Most integration-specific behaviour you add lives in the header, not the body.

**The contract.** WSDL describes bindings, ports and operations; XSD describes the types. `dotnet-svcutil` (or Visual Studio's *Connected Services*) turns that into C# proxy classes.

### What gets stated wrong, repeatedly

- **"SOAP doesn't work on .NET 8."** It does, **client-side**: add the `System.ServiceModel.*` NuGet packages (Http, Primitives, Duplex, NetTcp) and generate a proxy with `dotnet-svcutil`. What did *not* come across from .NET Framework is full **server-side** WCF hosting and most WS-* extensions — for a server you use **CoreWCF**. "WCF is dead so SOAP is impossible" is the wrong answer; "the client stack is supported, hosting means CoreWCF" is the right one.
- **"A SOAP fault is just an error response."** A **Fault is a structured error inside the Body**, typically returned with HTTP 500, and in .NET it surfaces as `FaultException` / `FaultException<TDetail>`. That is categorically different from a `CommunicationException` (transport died: DNS, TLS, socket) or a `TimeoutException`. They demand different handling: a fault is usually *deterministic* — retrying sends the same bad request again — while a transport error is often transient and genuinely worth retrying.
- **"Just `new` up the client per call."** The generated `ClientBase<T>` wraps a `ChannelFactory`, which is **expensive to construct** (it parses the contract and builds the runtime). Reuse the factory; create cheap channels from it. And know the sharp edge: once a channel **faults**, it is permanently unusable — `Close()` on a faulted channel throws, so you must `Abort()` and build a new one. That try/catch/Abort pattern is a classic interview tell.

### Authentication in the wild

Four shapes worth naming: HTTP Basic over TLS (`BasicHttpBinding` + transport security); **WS-Security UsernameToken** in the header (`TransportWithMessageCredential`); **mutual TLS** with a client certificate; and **custom header tokens** — which is effectively what NetSuite's token-based auth is: HMAC-signed values placed in a vendor header.

Note the direction of travel: QuickBooks Online moved to **OAuth 2.0 over REST**, Dynamics 365 is REST/OData with Entra ID. In practice this role is *SOAP for the legacy estate, REST for the modern one* — and you own both.

### The production gotchas that actually bite

- `MaxReceivedMessageSize` defaults to **65,536 bytes**. The integration works for months, then a customer syncs a large invoice batch and you get a useless "connection was forcibly closed" error. Same family: `MaxStringContentLength` and the other reader quotas.
- **Four timeouts**, not one: Open, Send, Receive, Close. People set one and are surprised by the others.
- **MTOM** for binary attachments — otherwise base64 inflates the payload by roughly a third.
- `DateTime` serialization and offsets: ERPs love ambiguous local times. Normalize to UTC at the boundary and keep the original string in the audit record.
- `xsi:nil="true"` versus **omitting** the element is a **semantic difference** in many ERP schemas: nil means "set this field to null", omitted means "leave it alone". Getting that backwards silently wipes customer data on update calls.

### Observability

Implement `IClientMessageInspector` to capture the raw request/response XML, inject your correlation id into the SOAP header, and store the pair with the audit record — secrets scrubbed. When a vendor says "we never received that", the raw envelope is the only thing that ends the argument.

## 3. The trade-offs, named with their cost

- **Contract-first rigidity.** You get compile-time safety and generated clients; you pay with redeploys when the vendor bumps the WSDL, and with brittle builds if proxies are regenerated in CI.
- **WS-\* capability.** Message-level security, signing, transactions exist; you pay in complexity and debugging opacity — a signed, encrypted envelope is not something you can eyeball in a log.
- **Verbosity.** XML plus envelope overhead costs bandwidth and parse time; it buys self-describing, schema-validatable payloads. At batch sizes this is a real performance line item, not a style complaint.
- **Operation-shaped API.** Maps cleanly onto ERP verbs (`upsert`, `search`, `getDeleted`); maps badly onto caching, CDNs and anything HTTP-native, because every call is a POST to one endpoint.
- **Generated code.** Fast to start; the cost is a large generated surface you don't own — so wrap it behind **your own interface** and keep vendor types out of the domain. That wrapper is also the natural home for retries, logging and mapping.

## 4. The five questions an interviewer asks

**1. "How do you consume a SOAP service from .NET 8 today?"**
Name: `dotnet-svcutil` against the WSDL, the `System.ServiceModel.*` client packages, a **reused** `ChannelFactory` rather than per-call construction, and the faulted-channel `Abort()` rule. Bonus: CoreWCF for hosting, and wrapping the generated proxy behind your own interface so vendor types never leak into the domain.

**2. "How do you tell a retryable failure from a non-retryable one?"**
`FaultException` = the server understood and refused → usually deterministic; inspect the fault code and map known vendor codes (rate limit, record lock, session expiry) onto a retry policy. `CommunicationException` / `TimeoutException` = transport → retry with exponential backoff **and jitter**. Then say the thing that shows seniority: **a timeout is ambiguous** — the call may actually have succeeded — which leads directly to the next question.

**3. "The operation isn't idempotent and you timed out. Now what?"**
This is what the role is really about. Strong answer: an **idempotency key** per logical operation carried in the header; an **attempt record written locally before the call** (outbox-style) so a crash can't erase the fact that you tried; on recovery, **query-before-retry** — `search` by your external key to discover whether the ERP already created the record; and an **audit trail** keyed by that external id. Then the vendor reality: ERPs expose an `externalId` field precisely so clients can make upserts idempotent. Using it is the correct answer; application-side guessing is not.

**4. "A customer says the sync is slow and sometimes drops records. How do you investigate?"**
Structure it: correlation id across your logs and the raw envelopes → is it ingress, transform, or egress? Check payload size against the quotas and the four timeouts. Check for N+1 calls where a batched `search` would do. Check vendor rate limits and whether your backoff actually honours them. Check the **watermark logic** in the delta sync — a clock skew or an inclusive/exclusive boundary bug drops records silently. Close with: "and the reconciliation job should have caught it — if it didn't, that's the real defect."

**5. "How do you version an integration when the vendor changes the contract?"**
Pin the endpoint/WSDL version explicitly instead of following "latest". Keep an **anti-corruption layer**: vendor types map into your canonical model, so a schema change touches mapping code, not the domain. **Contract-test** against recorded real envelopes in CI so a regenerated proxy fails loudly. Support N and N-1 during migration, because customers upgrade their ERP on their own schedule, not yours.

## 5. Quiz yourself

Cover the answers above and respond out loud:

1. Why is `Close()` on a faulted channel the wrong call, and what do you do instead?
2. What's the semantic difference between `xsi:nil="true"` and omitting the element in an ERP update call?
3. You get a `TimeoutException` on a `createInvoice` operation. Give the recovery algorithm in four steps.
4. Which single default value has silently broken more SOAP integrations than any other, and what's the symptom?
5. Where do authentication tokens live in a SOAP message, and why there rather than in the body?
