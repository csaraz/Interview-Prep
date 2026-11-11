---
title: "Lesson 1: What an ERP Is, and What an Integration Engineer Actually Does"
level: Mid
category: Patterns & Architecture
tags: erp, integration, netsuite, quickbooks, accounting, domain
order: 124
---

Written for an engineer who is strong technically but has never worked in the accounting/ERP domain. No prior knowledge assumed.

## 1. The mental model

A company's **ERP (Enterprise Resource Planning)** system is the one place where the business keeps its official records: who its customers and vendors are, what it owes, what it is owed, every payment, and the general ledger those all roll up into.

The crucial property is not technical, it's organisational: **the ERP is the system of record for money.** When the accountant closes the month, when the auditor shows up, when the tax filing is prepared — the ERP's numbers are the truth. Nothing else is.

That single fact explains everything about integration work:

- You are almost never allowed to make the ERP wrong. A duplicate invoice is not a bug report, it's a payment the company might actually make twice.
- You are rarely the source of truth. Your platform is a *better interface* to work the company does, but the result must land correctly in the ERP.
- "Eventual consistency" is acceptable for seconds or minutes, never for the month-end close.

**ERP vs "accounting system".** The words get used loosely. An accounting system (QuickBooks, Xero) does bookkeeping: ledger, bills, invoices, payments. A full ERP (NetSuite, SAP, Microsoft Dynamics, Sage Intacct) does that *plus* inventory, procurement, projects, payroll, CRM — many modules on one database. For integration purposes the distinction barely matters: both are systems of record with APIs, permissions, and strong opinions.

**The four names on this job description:**

| System | Who uses it | API reality |
|---|---|---|
| **NetSuite** (Oracle) | Mid-market and larger; very common with investment firms | SOAP (SuiteTalk) first, REST newer; token-based auth; heavy custom fields |
| **QuickBooks** (Intuit) | Small business; enormous install base | REST + OAuth 2.0; simpler model, stricter rate limits |
| **Sage** | A *family* of products, not one: Sage Intacct (cloud, finance-heavy), Sage 50/200 (older, desktop/on-prem) | Varies wildly by product — XML/REST/on-prem connectors |
| **Dynamics 365** (Microsoft) | Mid/large enterprise | REST/OData, Entra ID auth, very .NET-friendly |

Note what that table really says: **there is no "the ERP integration".** There are four or more different protocols, auth models and data models, and your job is to hide that difference behind one internal abstraction.

## 2. The mechanism, precisely

### What the product in this role actually does

The platform automates **accounts payable (AP)** — the process of a company paying its bills — for investment firms, family offices and fund administrators. The flow in the real world:

1. A **vendor** (supplier) sends an invoice. In accounting language the thing you owe is a **bill**.
2. Someone inside the company **approves** it, often through several levels.
3. It gets **coded**: which general ledger account, which department/fund/entity it belongs to.
4. It gets **paid**, in a payment run.
5. All of that must appear in the **ERP**, because that's where the books live.

The platform owns steps 1–4 as a nicer experience. Step 5 — and keeping the two systems agreeing forever afterwards — is the integration layer. That's the job.

### The vocabulary you must be able to use without hesitating

- **Vendor / supplier** — who you pay.
- **Bill / vendor invoice** — what you owe (an invoice *you receive*). An **invoice** in most ERPs means what you *send to a customer*. Using the words the wrong way round marks you as an outsider immediately.
- **AP (Accounts Payable)** — money owed out. **AR (Accounts Receivable)** — money owed in.
- **GL (General Ledger)** and **chart of accounts** — the list of accounts (e.g. "6400 Office Expense") every amount must be assigned to.
- **Journal entry** — a raw debit/credit record in the ledger.
- **Posting period** — the accounting month. Once it's **closed**, the ERP will *reject* new postings into it. This is a hard rule and a classic integration failure.
- **Subsidiary / entity** — a legal company within the group. Fund administrators have *many*.
- **Dimensions** (class, department, location, project) — extra tags on each transaction for reporting.
- **Reconciliation** — proving that two systems agree, record by record.

### Why the integration is hard (the real content of the role)

1. **Every customer's ERP is configured differently.** Different chart of accounts, custom fields, required dimensions, approval rules. Your code meets a new shape with every onboarding.
2. **Entity matching.** The job ad's joke — convincing an ERP that "Acme Corp." and "ACME Corporation" are the same vendor — is the daily reality. Fuzzy names, tax IDs, duplicates created by humans in both systems. You need deterministic matching keys (tax id, external id) and an escalation path for the ambiguous ones.
3. **Partial failure.** A payment batch of 300 bills where bill 187 fails validation. What happened to 1–186? Did the ERP commit them? Your design must answer this without a human reading logs.
4. **Rate limits and slow APIs.** ERPs are not built for chatty traffic. Batching, backoff and queueing aren't optimisations, they're requirements.
5. **Closed periods, locked records, approval states.** The ERP will refuse writes for business reasons that look like bugs to code.
6. **Two-way drift.** Someone edits the vendor in the ERP directly. Now the two systems disagree, and nobody told you.

### The shapes of sync

- **Push** (you write into the ERP) vs **pull** (you read from it). Most AP platforms do both: pull the chart of accounts and vendor list, push bills and payments.
- **Full sync** (re-read everything) vs **delta sync** (only what changed since a watermark). Deltas are what make it survivable at scale; watermarks are what make deltas go wrong — see the sync lesson.
- **Real-time** (webhook or on-save) vs **batch** (nightly). ERPs often lack reliable webhooks, so scheduled polling plus event-driven processing on your side is the common compromise.
- **Reconciliation pass** — an independent job that compares both sides and reports differences. If the only thing that detects a lost record is a customer email, the integration is not finished.

## 3. The trade-offs, named with their cost

- **ERP as source of truth** (safest for accounting; you're a client) costs you latency and flexibility — you must respect its rules and its uptime.
- **Platform as source of truth with the ERP as a mirror** gives a better product experience and costs you the risk of the books disagreeing with the ledger, which is the one thing finance will not tolerate.
- **Real-time sync** gives immediate feedback and costs rate-limit pressure and far more failure states to handle.
- **Nightly batch** is simple and cheap to operate, and costs a full day of wrongness when something fails.
- **Strict validation before sending** keeps the ERP clean and costs user friction (rejecting work the customer thinks is fine).
- **Lenient send + reconcile later** gets work flowing and costs you a backlog of mismatches someone must clear.
- **One generic connector abstraction** across all four ERPs keeps the codebase sane and costs you the ability to use each system's best features; **per-ERP bespoke connectors** are faster and more correct per system, and multiply maintenance by four.

## 4. The five questions an interviewer asks

**1. "Walk me through what happens when a user approves a bill in our platform."**
They want the full chain, not the happy path only: validate against ERP-sourced reference data (vendor exists, GL account valid, period open) → write locally and commit → enqueue an outbound sync event (outbox, so the commit and the intent to sync are atomic) → worker calls the ERP with an idempotency/external id → on success store the ERP's record id against your record → on failure classify: retryable transport, business rejection needing a human, or ambiguous timeout → surface state to the user, and let reconciliation catch anything that fell through.

**2. "A customer says their vendor list has duplicates. What happened and how do you fix it?"**
Name the cause honestly: matching on display name instead of a stable key, two-way creation without a shared identifier, or a retried create that wasn't idempotent. Fix: a deterministic match key (tax id, or the ERP's `externalId` you control), a merge/alias table on your side, a quarantine queue for ambiguous matches rather than silent auto-merge, and idempotent creates so retries can't produce a second record.

**3. "The ERP rejects a posting because the accounting period is closed. How should the system behave?"**
Prove you understand it's a business rule, not an error: detect the specific fault code, do **not** retry blindly into the same period, park the record in a clearly named state ("awaiting open period"), notify the right human, and offer the two legitimate resolutions — post to the next open period, or have the customer reopen the period. The lesson: map vendor fault codes into *your* taxonomy of retryable / human-actionable / fatal.

**4. "Which system is the source of truth, and why does it matter here?"**
Strong answer: the ERP is the source of truth for the ledger; the platform is the source of truth for workflow state (approvals, who did what). Draw the line explicitly per entity — vendors might be ERP-owned, approval history platform-owned — because an unstated ownership boundary is what produces silent two-way drift.

**5. "How would you onboard a new customer's ERP connection?"**
Credentials and least-privilege roles in a sandbox first; pull reference data (chart of accounts, vendors, dimensions) and show the customer a mapping screen rather than guessing; run a **dry-run/validation pass** over historical records to surface the mismatches before anything is written; then a controlled backfill with a bounded date range; then switch on incremental sync; then a reconciliation report both sides sign off. Mention working alongside the onboarding and support teams — the job ad asks for it explicitly.

## What to carry into the interview

You have not run NetSuite. You *have* run the patterns underneath it: contract-based external APIs with real auth, retries with idempotency, delta sync, reconciliation against an authoritative record, partial-failure handling with audit trails, and the message infrastructure that makes it reliable. Say the gap once, plainly, then speak in this vocabulary — because the vocabulary is what signals you'll be productive in week one.
