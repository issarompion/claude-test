# Plan — Express REST API + Full-Stack Project Structure

**Feature:** `express-api`
**Spec:** `specs/express-api/spec.md`
**Date:** 2026-06-29
**Complexity:** Medium

---

## Summary

Add an `api/` folder containing an Express REST API (Users CRUD) alongside the existing React frontend, then wire the project root so both parts can be started and tested with a single command. The frontend code is **not moved** — only the root `package.json` gains new orchestration scripts. All 39 existing frontend tests must continue to pass unchanged.

---

## Technical Context

| Item | Current state | After |
|------|--------------|-------|
| Frontend | React 18 + Vite 5 + Vitest at root | Unchanged |
| Backend | None | `api/` — Express 4 + TypeScript + Vitest + Supertest |
| Root scripts | `dev`, `build`, `test`, `typecheck` | + `api:dev`, `api:test`, `dev:all`, `test:all` |
| Port frontend | 5173 (Vite default) | Unchanged |
| Port backend | — | 3001 |
| Module system | `"type":"module"` at root | `api/` has its own `package.json` with `"type":"module"` |
| Test runner | Vitest (frontend) | Vitest (both) — same toolchain, isolated configs |

### Why `app.ts` + `index.ts` split

`app.ts` exports the configured Express app without starting it.  
`index.ts` imports `app.ts` and calls `app.listen()`.  
This lets Supertest import the app in tests without binding a real port.

---

## Architecture

```
/                               ← project root (frontend, unchanged)
├── api/                        ← NEW — Express REST API
│   ├── src/
│   │   ├── types/
│   │   │   └── user.ts         ← User interface (mirrors frontend UserCard type)
│   │   ├── store/
│   │   │   └── users.ts        ← In-memory store + seed data (2 demo users)
│   │   ├── routes/
│   │   │   └── users.ts        ← CRUD routes: GET/POST /users, GET/PUT/DELETE /users/:id
│   │   ├── app.ts              ← Express setup, middleware, route mount (exported)
│   │   └── index.ts            ← Server entry point (calls app.listen on port 3001)
│   ├── tests/
│   │   └── users.test.ts       ← Supertest integration tests (written FIRST — TDD)
│   ├── package.json            ← Express, tsx, TypeScript, Vitest, Supertest
│   ├── tsconfig.json           ← TypeScript strict, ESNext, NodeNext resolution
│   └── vitest.config.ts        ← Vitest config (node environment)
├── src/                        ← Existing React frontend (untouched)
├── package.json                ← Root: add concurrently + orchestration scripts
└── ...                         ← All other files unchanged
```

---

## User type (shared contract)

Defined in `api/src/types/user.ts`, mirrors the frontend type exactly:

```ts
export type UserStatus = 'online' | 'offline';

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
}
```

---

## Endpoints

| Method | Path | Success | Error |
|--------|------|---------|-------|
| GET | `/users` | 200 + array | — |
| GET | `/users/:id` | 200 + user | 404 |
| POST | `/users` | 201 + created user | 400 (validation) |
| PUT | `/users/:id` | 200 + updated user | 400, 404 |
| DELETE | `/users/:id` | 204 | 404 |
| GET | `/health` | 200 `{status:"ok"}` | — |

Validation rules (POST + PUT):
- `name`: required, non-empty string
- `email`: required, matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- `status`: required, must be `"online"` or `"offline"`

---

## Root orchestration scripts

Added to root `package.json` (requires `concurrently` as devDependency):

| Script | Command |
|--------|---------|
| `api:dev` | `cd api && npm run dev` |
| `api:test` | `cd api && npm test` |
| `dev:all` | `concurrently "npm run dev" "npm run api:dev"` |
| `test:all` | `npm test && npm run api:test` |

---

## Phases

### Phase 1 — API project setup
Create the `api/` folder scaffold: `package.json`, `tsconfig.json`, `vitest.config.ts`, `src/types/user.ts`.  
→ Enables `npm install` and TypeScript resolution before writing any logic.

### Phase 2 — RED (TDD): write failing tests
Write `api/tests/users.test.ts` with Supertest covering all endpoints and edge cases.  
Run `npm test` in `api/` → all tests must FAIL (no implementation yet).

### Phase 3 — GREEN: implement to pass tests
Implement in order: `store/users.ts` → `routes/users.ts` → `app.ts` → `index.ts`.  
Run tests after each file until all pass.

### Phase 4 — Root wiring
Install `concurrently` at root, add orchestration scripts to root `package.json`.  
Run `npm run test:all` to verify frontend + backend tests pass together.

---

## Risks & Mitigations

| Risk | Probability | Mitigation |
|------|-------------|------------|
| `"type":"module"` conflicts between root and `api/` | Medium | `api/` has its own `package.json`; `tsx` handles ESM transparently |
| Supertest version incompatible with ESM | Low | Use `supertest` ≥ 7.x which ships ESM-compatible types |
| Frontend tests broken by root `package.json` change | Low | Only adding new scripts + one devDependency; existing scripts unchanged |
| Port 3001 already in use locally | Low | Document in README; configurable via `PORT` env var |
| In-memory store resets on restart | Expected | Explicitly out of scope (by design) |

---

## Verification

```bash
# 1. API standalone
cd api && npm install && npm test
# → All endpoint tests pass

# 2. Frontend unchanged
cd .. && npm test
# → All 39 existing tests pass

# 3. Full stack start (manual)
npm run dev:all
# → http://localhost:5173 (React) + http://localhost:3001/health (Express)

# 4. Full test suite
npm run test:all
# → Frontend (39) + API tests all green
```
