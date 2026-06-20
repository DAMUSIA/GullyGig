# Security — Kaamao

## Overview

This document describes the security controls in place for Kaamao's production deployment.

---

## Rate Limiting

Implemented in [`lib/rate-limit.ts`](../lib/rate-limit.ts) using an in-memory sliding-window limiter.

| Endpoint                | Limit       | Window     | Strategy                   |
| ----------------------- | ----------- | ---------- | -------------------------- |
| `POST /api/auth/signup` | 5 requests  | 15 minutes | IP-based (strict)          |
| `POST /api/likes`       | 30 requests | 1 minute   | IP-based                   |
| `POST /api/reviews`     | 10 requests | 1 minute   | IP-based                   |
| All other `/api/*`      | 60 requests | 1 minute   | IP-based (global fallback) |

Rate limit responses return **HTTP 429** with `Retry-After` and `X-RateLimit-*` headers.

### Current Store

In-memory (resets on server restart). Suitable for single-instance deployments (Vercel Serverless has per-instance isolation).

### Upgrading to Redis (recommended for scale)

To enable persistent multi-instance rate limiting:

1. Create an [Upstash Redis](https://upstash.com) database (free tier available)
2. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in Vercel env vars
3. Replace the `rateLimit` function in `lib/rate-limit.ts` with `@upstash/ratelimit`

---

## Authentication Flow

```
1. User registers → /api/auth/signup (Supabase Admin)
2. User logs in → Supabase client signIn → JWT issued
3. JWT stored in httpOnly cookie by @supabase/ssr
4. middleware.ts reads cookie, verifies session → guards /dashboard/*
5. API routes verify JWT via supabaseAdmin.auth.getUser(token)
```

### Key Points

- **Dashboard routes** are protected server-side by Next.js middleware — not just client-side redirects
- **API routes** verify the JWT on every mutation (POST/DELETE) — unauthenticated requests return `401`
- **Service role key** is used only in server-side API routes, never exposed to the browser
- **Supabase RLS** (Row Level Security) provides a second layer of protection at the database level

---

## Security Headers

Applied globally via `next.config.ts`:

| Header                      | Value                                          | Purpose                        |
| --------------------------- | ---------------------------------------------- | ------------------------------ |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Enforces HTTPS                 |
| `X-Frame-Options`           | `DENY`                                         | Prevents clickjacking          |
| `X-Content-Type-Options`    | `nosniff`                                      | Prevents MIME sniffing         |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`              | Limits referrer leakage        |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=()`     | Restricts browser APIs         |
| `Content-Security-Policy`   | See `next.config.ts`                           | Restricts script/style sources |

> **Note:** CSP is currently in **report-only mode** (`Content-Security-Policy-Report-Only`). Switch to `Content-Security-Policy` once you've confirmed no violations in the browser console.

---

## Input Validation

All API route request bodies are validated with **Zod** (see [`lib/validation.ts`](../lib/validation.ts)):

- `SignupSchema` — validates name, phone, password, optional email/dob/location
- `LikeSchema` — validates UUID serviceId and `like | unlike` action enum
- `ReviewSchema` — validates UUID serviceId, integer rating 1–5, optional comment ≤2000 chars

Invalid inputs return **HTTP 400** with a descriptive error message.

---

## Business Logic Protections

- **Self-like prevention**: Users cannot like their own service listings
- **Self-review prevention**: Users cannot review their own service listings
- **Duplicate review prevention**: One review per user per service (enforced at DB level with unique constraint + API layer check)
- **Duplicate like idempotency**: Repeated like requests return success without creating duplicate rows

---

## Secrets Management

- `.env.local` is git-ignored — never committed
- `.env.example` contains only placeholder values (no real keys)
- Production secrets stored in **Vercel Environment Variables** (encrypted at rest)
- `SUPABASE_SERVICE_ROLE_KEY` is scoped to **Production only** in Vercel

---

## Security Scanning

- **CodeQL** (`.github/workflows/codeql.yml`) — free GitHub security scanning on every PR and weekly
- **Dependabot** (`.github/dependabot.yml`) — automated weekly dependency updates for npm and GitHub Actions
- **npm audit** — runs in CI on every push (`npm audit --audit-level=high`)

---

## Reporting Vulnerabilities

If you discover a security vulnerability, please email the maintainer directly rather than opening a public issue.
