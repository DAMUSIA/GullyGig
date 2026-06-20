# Architecture — Kaamao

## Overview

Kaamao is a **Next.js 16 + Supabase** SaaS platform where service providers (tutors, freelancers, etc.) list their services, receive reviews, and accumulate likes. Built for deployment on Vercel.

---

## Technology Stack

| Layer              | Technology                      |
| ------------------ | ------------------------------- |
| Frontend framework | Next.js 16 (App Router)         |
| Database + Auth    | Supabase (Postgres + GoTrue)    |
| Styling            | Tailwind CSS v4                 |
| Charts             | Recharts, Chart.js              |
| PDF export         | jsPDF + html2canvas-pro         |
| Animations         | Framer Motion                   |
| Analytics          | Google Analytics (GA4)          |
| Testing            | Vitest (unit), Playwright (E2E) |
| Validation         | Zod                             |
| Deployment         | Vercel                          |

---

## System Flow

```
Browser (React)
    │
    ├── Static pages (/, /p/[slug]) — SSR via Next.js
    ├── Dashboard (/dashboard/*) — CSR, protected by middleware
    │
    ↓ API calls
Next.js API Routes (/app/api/*)
    │
    ├── Rate Limiter (lib/rate-limit.ts)
    ├── Zod Validation (lib/validation.ts)
    ├── Service Layer (lib/services/*.service.ts)
    │
    ↓ DB queries
Supabase (Postgres)
    ├── service_likes
    ├── service_ratings
    ├── service_analytics
    ├── services
    └── users
```

---

## Folder Structure

```
Kaamao/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts      # User registration
│   │   │   └── sync-profile/route.ts
│   │   ├── likes/route.ts           # Like / unlike a service
│   │   ├── reviews/route.ts         # Post / fetch reviews
│   │   └── portfolio-view/          # Portfolio view tracking
│   ├── dashboard/                   # Protected user dashboard pages
│   ├── login/                       # Auth pages
│   ├── register/
│   ├── p/                           # Public service profile pages
│   ├── middleware.ts                # Auth + route protection
│   └── layout.tsx                   # Root layout (GA, fonts)
│
├── components/
│   ├── AuthPage.tsx                 # Shared auth UI
│   ├── GoogleAnalytics.tsx          # GA4 integration
│   ├── dashboard/                   # Dashboard-specific components
│   ├── home/                        # Landing page components
│   ├── portfolio/                   # Portfolio display
│   └── profile/                     # Profile components
│
├── lib/
│   ├── supabase.ts                  # Browser-side Supabase client + auth helpers
│   ├── supabase-admin.ts            # Server-side admin client (singleton)
│   ├── rate-limit.ts                # IP/user-based rate limiting
│   ├── validation.ts                # Zod schemas for all API routes
│   ├── services/
│   │   ├── likes.service.ts         # Likes DB operations
│   │   ├── reviews.service.ts       # Reviews DB operations
│   │   └── analytics.service.ts    # service_analytics upsert
│   ├── profile.hooks.ts             # React hooks for profile data
│   ├── profile.types.ts             # TypeScript types for profiles
│   └── stats.ts                     # Stats calculation helpers
│
├── docs/                            # Project documentation
├── __tests__/                       # Vitest unit tests
├── e2e/                             # Playwright E2E tests
└── public/                          # Static assets
```

---

## Auth Flow

```
1. User submits registration → POST /api/auth/signup
   └── Rate limited (5 req/15 min)
   └── Zod validated
   └── Supabase Admin creates auth user (email_confirm: true, bypasses rate limit)
   └── Profile row inserted in `users` table

2. User logs in → lib/supabase.ts signIn()
   └── Supabase issues JWT session cookie

3. Next.js middleware intercepts /dashboard/*
   └── Reads session from cookie via @supabase/ssr
   └── Redirects to /login if session missing

4. API calls from dashboard include `Authorization: Bearer <jwt>`
   └── API routes verify token via supabaseAdmin.auth.getUser(token)
```

---

## Database Schema Summary

See `supabase_schema.sql` for the full migration SQL.

| Table               | Purpose                                      |
| ------------------- | -------------------------------------------- |
| `users`             | User profiles (name, phone, location, about) |
| `services`          | Service listings with denormalized counts    |
| `service_likes`     | One row per user-service like                |
| `service_ratings`   | Reviews with rating + comment                |
| `service_analytics` | Aggregated analytics per service             |
