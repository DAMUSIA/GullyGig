# Pre-Push Checklist — Kaamao

Run every command in this checklist **before pushing to `main`** or opening a PR.
All checks must pass with zero errors. ✅

---

## Quick Run (copy-paste all at once)

```bash
npm run format:check && npm run lint && npm run typecheck && npm run test && npm run build
```

If that green-lines all the way through, you're good to push.

---

## Step-by-Step

### 1 · Format Check

```bash
npm run format:check
```

**Passes when:** No output (exit 0)  
**Fails when:** Lists files that need formatting  
**Fix:**

```bash
npm run format:write
```

---

### 2 · Lint

```bash
npm run lint
```

**Passes when:** No ESLint errors or warnings  
**Fails when:** Lists rule violations  
**Fix:** Address each violation, or suppress with `// eslint-disable-next-line <rule>` if intentional

---

### 3 · Type Check

```bash
npm run typecheck
```

**Passes when:** No output (exit 0)  
**Fails when:** Lists TypeScript errors  
**Fix:** Resolve all type errors before pushing — type errors in CI will block the build

---

### 4 · Unit Tests

```bash
npm run test
```

**Passes when:**

```
Test Files  X passed
     Tests  X passed
```

**Fails when:** Any test file shows `FAIL`  
**Fix:** Read the failing test output and fix the underlying code or test

#### Run a single test file

```bash
npx vitest run __tests__/api-likes.test.ts
```

#### Run in watch mode (during active development)

```bash
npm run test:watch
```

---

### 5 · Build

```bash
npm run build
```

**Passes when:** Ends with `✓ Compiled successfully`  
**Fails when:** Build errors (usually TypeScript or import issues not caught by `typecheck`)  
**Note:** The build uses mock Supabase env vars locally — set them if your `next.config.ts` requires real values:

```bash
$env:NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
npm run build
```

---

### 6 · Security Audit (recommended before major releases)

```bash
npm audit --audit-level=high
```

**Passes when:** No high or critical vulnerabilities  
**Fails when:** Lists high/critical CVEs  
**Fix:**

```bash
npm audit fix
```

> Use `npm audit fix --force` only if you understand the breaking changes

---

### 7 · E2E Tests (optional locally, required in CI)

Requires a running dev server in another terminal:

**Terminal 1:**

```bash
npm run dev
```

**Terminal 2:**

```bash
npm run test:e2e
```

**Passes when:** All Playwright tests pass  
**Skip locally** if you haven't changed routing, auth, or page-level behavior — CI will catch it on push

---

## Rate Limit Quick Test

After starting `npm run dev`, test that rate limiting works:

```bash
# Should return 200 on first calls, 429 after 5 within 15 minutes
for ($i=0; $i -lt 7; $i++) {
  Invoke-WebRequest -Uri "http://localhost:3000/api/auth/signup" `
    -Method POST `
    -ContentType "application/json" `
    -Body '{"fullName":"Test","phoneNo":"9999999999","password":"test1234"}' `
    -ErrorAction SilentlyContinue | Select-Object -ExpandProperty StatusCode
}
```

Expected: `200` (or `400`) for first 5 calls, `429` for calls 6+

---

## Security Headers Quick Test

After starting `npm run dev`, check that headers are present:

```bash
Invoke-WebRequest -Uri "http://localhost:3000" -Method HEAD | Select-Object -ExpandProperty Headers
```

You should see:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## Common Issues & Fixes

| Error                            | Cause                                  | Fix                                    |
| -------------------------------- | -------------------------------------- | -------------------------------------- |
| `Cannot find module 'zod'`       | Zod not installed                      | `npm install`                          |
| `tsc: error TS2307`              | Missing type                           | Add type or install `@types/...`       |
| `ESLint: Parsing error`          | Syntax issue                           | Fix the syntax                         |
| `Build: Module not found`        | Wrong import path                      | Check relative/absolute path           |
| `Vitest: vi.mock hoisting error` | Top-level `const` used in mock factory | Declare mocks inside `vi.hoisted()`    |
| `429 not working`                | Rate limiter resets on restart         | Expected in dev — uses in-memory store |

---

## Branch Strategy

| Branch            | CI Required   | Direct Push |
| ----------------- | ------------- | ----------- |
| `main` / `master` | ✅ All checks | ❌ PR only  |
| `dev`             | ✅ All checks | ✅ OK       |
| `feature/*`       | Runs on PR    | ✅ OK       |

---

> **Tip:** Add a git pre-push hook to automate this locally:
>
> ```bash
> # .git/hooks/pre-push (make executable with chmod +x)
> npm run lint && npm run typecheck && npm run test
> ```
