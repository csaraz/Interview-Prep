---
title: Authentication, JWT, and Token Storage
level: Senior
category: ASP.NET Core
tags: jwt, authentication, authorization, security, oauth
order: 70
---

## Authentication vs Authorization

- **Authentication** = *who you are* (identity)
- **Authorization** = *what you may do* (roles, policies, claims)

## JWT — how it works

A **stateless** token: `Header.Payload.Signature` (base64url-encoded parts).

1. User logs in → server validates credentials → issues a JWT **signed** with a secret key (HMAC-SHA256) or private key (RSA)
2. Client sends it on every request: `Authorization: Bearer <token>`
3. Server validates the **signature** plus claims like `exp` (expiry), `iss` (issuer), `aud` (audience)
4. No DB lookup needed → stateless, horizontally scalable

`[Authorize]` protects endpoints; role/policy variants: `[Authorize(Roles = "Admin")]`.

## Login flow (text diagram)

```
User          Client            Backend              Google
 |--Click Login-->|                 |                    |
 |                |---Redirect------------------------->|
 |                |                 |<--Auth Request---->|
 |                |                 |<--Google Token-----|
 |                |<--JWT Token-----|                    |
 |---Use App----->|---API Request-->|                    |
 |                | Authorization: Bearer JWT            |
 |                |                 |--Validate JWT      |
 |                |<--Data Response-|                    |
```

## Where to store the secret key

Never hardcode. Options:

- **Environment variables**: `Environment.GetEnvironmentVariable("JWT_SECRET")`
- **Secret Manager** (local development)
- **Azure Key Vault / AWS Secrets Manager** (production)

## Where to store the token (client)

| Storage | Pros | Cons |
|---|---|---|
| `localStorage` | Simple, JS access, easy for SPA | **XSS-risky** — readable by injected JS |
| **HttpOnly cookie** | Not readable by JS → XSS-safe; browser sends automatically | Needs **CSRF** protection; no manual JS access |

**Production recommendation: HttpOnly cookie** (+ CSRF token / SameSite).

## OAuth2 vs OpenID Connect

- **OAuth2** = delegated **authorization** — letting an app access a resource on your behalf
- **OIDC** = **authentication** layer on top of OAuth2 (`id_token`) — "Sign in with Google/Microsoft"

## Interview one-liners

- "JWT is stateless: the signature *is* the trust — server checks signature + exp, no session store."
- "Store tokens in HttpOnly cookies in production; localStorage is XSS bait."
- "OAuth2 authorizes, OIDC authenticates."
