# Environment Variables — Kaamao

Copy `.env.example` to `.env.local` and fill in all values before running locally.

> **Never commit `.env.local` or any file containing real secrets.**

---

## Variables Reference

### Supabase

| Variable                               | Required     | Description                                                                                                                                                                                       |
| -------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | ✅           | Your Supabase project URL. Found in: **Supabase Dashboard → Project Settings → API → Project URL**                                                                                                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`        | ✅           | Public anon key — safe to expose to the browser. Found in: **Project Settings → API → Project API Keys → anon public**                                                                            |
| `SUPABASE_SERVICE_ROLE_KEY`            | ✅           | **Secret** service role key — bypasses Row Level Security. Used **server-side only** (API routes). Never expose to client. Found in: **Project Settings → API → Project API Keys → service_role** |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ❌           | Optional publishable key for newer Supabase SDK features                                                                                                                                          |
| `DATABASE_URL`                         | ❌ (runtime) | Direct Postgres connection string — only used for migrations via Supabase CLI or external tools. **Not used in the Next.js app at runtime.**                                                      |

### Analytics

| Variable            | Required | Description                                                                                                                      |
| ------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_GA_ID` | ❌       | Google Analytics 4 Measurement ID (e.g. `G-XXXXXXXXXX`). Found in: **GA4 → Admin → Data Streams → your stream → Measurement ID** |

### Rate Limiting (optional, for production)

| Variable                   | Required | Description                                                                                                   |
| -------------------------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `UPSTASH_REDIS_REST_URL`   | ❌       | Upstash Redis REST URL for multi-instance production rate limiting. Without this, in-memory limiting is used. |
| `UPSTASH_REDIS_REST_TOKEN` | ❌       | Upstash Redis REST token                                                                                      |

### Error Tracking (optional)

| Variable                 | Required | Description                    |
| ------------------------ | -------- | ------------------------------ |
| `NEXT_PUBLIC_SENTRY_DSN` | ❌       | Sentry DSN for error tracking. |

---

## Dev vs Prod

| Concern        | Development                                           | Production                   |
| -------------- | ----------------------------------------------------- | ---------------------------- |
| Supabase URL   | Same project or local Supabase CLI (`supabase start`) | Production Supabase project  |
| Rate limiting  | In-memory (resets on server restart)                  | Upstash Redis (persistent)   |
| Error tracking | Console output                                        | Sentry (recommended)         |
| Analytics      | Can use a test GA property                            | Production GA property       |
| Secrets        | `.env.local` (git-ignored)                            | Vercel Environment Variables |

---

## Setting Secrets in Vercel

1. Go to your Vercel project → **Settings → Environment Variables**
2. Add each variable from this list that applies to production
3. Set scope to **Production** for secret keys (`SUPABASE_SERVICE_ROLE_KEY`)
4. Set scope to **Preview** as well for `NEXT_PUBLIC_*` variables so PR previews work

> **Tip**: Never set `DATABASE_URL` as a runtime Vercel env var — it's for migrations only.
