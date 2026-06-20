# Deployment — Kaamao

## Production Deployment (Vercel)

Kaamao is designed to deploy on **Vercel** with zero configuration beyond environment variables.

---

## Prerequisites

- [ ] Supabase project created and schema applied (see `supabase_schema.sql`)
- [ ] GitHub repository connected to Vercel
- [ ] All required environment variables set in Vercel (see `docs/ENVIRONMENT.md`)

---

## Step-by-Step Vercel Deployment

### 1. Import Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework preset will auto-detect **Next.js**

### 2. Set Environment Variables

In **Vercel → Project → Settings → Environment Variables**, add:

| Key                             | Environment         |
| ------------------------------- | ------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview |
| `SUPABASE_SERVICE_ROLE_KEY`     | Production only     |
| `NEXT_PUBLIC_GA_ID`             | Production          |

### 3. Deploy

Click **Deploy**. Vercel will:

1. Run `npm run build`
2. Upload the output to the CDN
3. Assign a `.vercel.app` URL

### 4. Configure Custom Domain (optional)

1. **Vercel → Domains → Add**
2. Point your DNS records as instructed by Vercel

---

## Build Commands

| Command             | Purpose                              |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Local development server (port 3000) |
| `npm run build`     | Production build                     |
| `npm run start`     | Start production server locally      |
| `npm run lint`      | ESLint check                         |
| `npm run typecheck` | TypeScript type check                |
| `npm run test`      | Run Vitest unit tests                |
| `npm run test:e2e`  | Run Playwright E2E tests             |

---

## CI/CD Pipeline

Every push to `main`/`master` and every PR triggers the full CI pipeline (`.github/workflows/ci.yml`):

```
lint + format + typecheck (parallel)
         │
         ▼
    unit tests (Vitest + coverage ≥70%)
         │
         ▼
  production build (Next.js)
         │
         ▼
  e2e tests (Playwright) + Lighthouse audit (parallel)
```

PRs to `main` must pass all checks before merging.

---

## Database Migrations

Kaamao does not use an ORM. Schema changes are written as raw SQL in `supabase_schema.sql`.

To apply migrations:

1. Open Supabase Dashboard → **SQL Editor**
2. Paste and run the relevant SQL from `supabase_schema.sql`

---

## Rollback

Vercel keeps all deployments. To roll back:

1. Go to **Vercel → Deployments**
2. Find the last known-good deployment
3. Click **Promote to Production**
