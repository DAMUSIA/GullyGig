# CI/CD Pipeline Commands Reference

This document details the essential commands used in our CI/CD pipeline. Run these locally to ensure your branch passes all validation checks.

---

## One-Line Verification Commands

Run all checks sequentially (stops if any step fails):

### Windows (Command Prompt / CMD) & Bash / macOS / Linux:

```cmd
npm run format:check && npm run lint && npm run typecheck && npm run test && npm run build
```

### Windows (PowerShell):

```powershell
npm run format:check && npm run lint && npm run typecheck && npm run test && npm run build
```

_(If using older PowerShell versions where `&&` is unsupported, use `;` instead: `npm run format:check; npm run lint; npm run typecheck; npm run test; npm run build`)_

---

## Command Reference

| Command                        | Action        | Description                                                              |
| :----------------------------- | :------------ | :----------------------------------------------------------------------- |
| `npm run format:check`         | Format Check  | Verifies if files adhere to Prettier code style guidelines.              |
| `npm run format:write`         | Format Fix    | Automatically fixes formatting issues across the codebase.               |
| `npm run lint`                 | Lint          | Checks for JavaScript/TypeScript, React, and Next.js rule violations.    |
| `npm run typecheck`            | Type Check    | Compiles TypeScript without outputting files to catch type errors.       |
| `npm run test`                 | Unit Test     | Runs all unit and integration tests using Vitest once.                   |
| `npm run test:watch`           | Test Watch    | Runs Vitest in interactive watch mode for active development.            |
| `npx vitest run --coverage`    | Test Coverage | Runs Vitest and asserts statement/branch coverage thresholds.            |
| `npm run test:e2e`             | E2E Test      | Runs Playwright end-to-end integration tests.                            |
| `npm run build`                | Build         | Compiles Next.js for production and verifies static generation.          |
| `npm audit --audit-level=high` | Audit         | Scans installed packages for high and critical security vulnerabilities. |
| `npm audit fix`                | Audit Fix     | Installs safe updates for vulnerable packages.                           |
