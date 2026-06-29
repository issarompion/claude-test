# Tasks — Express REST API

**Feature:** `express-api`
**Plan:** `specs/express-api/plan.md`
**Date:** 2026-06-29

Legend: `[P]` = parallelizable · `[US-XX]` = user story traceability · `[EF-XX]` = functional requirement

---

## Phase 1 — API project scaffold

| ID | Task | Path | Traces | Notes |
|----|------|------|--------|-------|
| T001 | Create `api/package.json` | `api/package.json` | [US-05][US-06] | deps: express, tsx; devDeps: typescript, vitest, supertest, @types/* |
| T002 | [P] Create `api/tsconfig.json` | `api/tsconfig.json` | [US-05][US-06] | strict, ESNext, NodeNext module resolution |
| T003 | [P] Create `api/vitest.config.ts` | `api/vitest.config.ts` | [US-06] | environment: node (not jsdom) |
| T004 | [P] Create `api/src/types/user.ts` | `api/src/types/user.ts` | [US-01..04][EF-07] | mirrors frontend User type exactly |
| T005 | Run `npm install` in `api/` | — | [US-05] | after T001 |

---

## Phase 2 — RED: failing tests (TDD)

> Write ALL tests before writing any implementation. Run `npm test` in `api/` → expect failures.

| ID | Task | Path | Traces | Notes |
|----|------|------|--------|-------|
| T006 | Write `users.test.ts` — GET /users | `api/tests/users.test.ts` | [US-01][EF-01] | empty array when no users; correct count after inserts |
| T007 | [P] Write `users.test.ts` — GET /users/:id | `api/tests/users.test.ts` | [US-02][EF-02] | 200 found; 404 unknown id |
| T008 | [P] Write `users.test.ts` — POST /users | `api/tests/users.test.ts` | [US-03][EF-03][EF-07][EF-08] | 201 + body; 400 missing name; 400 missing email; 400 invalid status |
| T009 | [P] Write `users.test.ts` — DELETE /users/:id | `api/tests/users.test.ts` | [US-04][EF-04] | 204 deleted; 404 unknown id |
| T010 | [P] Write `users.test.ts` — PUT /users/:id | `api/tests/users.test.ts` | [US-07][EF-05] | 200 updated; 400 invalid field; 404 unknown id |
| T011 | [P] Write `users.test.ts` — GET /health | `api/tests/users.test.ts` | [US-08][EF-06] | 200 `{status:"ok"}` |
| T012 | Confirm all tests FAIL | — | — | `cd api && npm test` → red ✗ |

---

## Phase 3 — GREEN: implement to pass tests

| ID | Task | Path | Traces | Notes |
|----|------|------|--------|-------|
| T013 | Create in-memory store | `api/src/store/users.ts` | [US-01..04][EF-08] | `Map<string, User>`; seed with 2 demo users; export CRUD helpers |
| T014 | Create user routes | `api/src/routes/users.ts` | [US-01..04][US-07][US-08][EF-01..06] | all 6 endpoints; input validation |
| T015 | Create Express app | `api/src/app.ts` | [US-05][EF-09] | `express()` + json middleware + mount `/users` + `/health`; **export** app (no listen) |
| T016 | Create server entry point | `api/src/index.ts` | [US-05][EF-09] | import app; `app.listen(PORT ?? 3001)` |
| T017 | Run tests — expect GREEN | — | — | `cd api && npm test` → all pass ✓ |

---

## Phase 4 — Root wiring

| ID | Task | Path | Traces | Notes |
|----|------|------|--------|-------|
| T018 | Install `concurrently` at root | `package.json` | [US-05][EF-10] | `npm install -D concurrently` |
| T019 | Add orchestration scripts to root `package.json` | `package.json` | [US-05][EF-10] | `api:dev`, `api:test`, `dev:all`, `test:all` |
| T020 | Run full test suite | — | [CS-05][CS-06] | `npm run test:all` → 39 frontend + all API tests pass |

---

## Acceptance checklist

- [ ] `cd api && npm test` → all API tests pass (≥ 80% coverage)
- [ ] `npm test` at root → all 39 frontend tests still pass
- [ ] `npm run test:all` → both suites run and pass together
- [ ] `npm run dev:all` → frontend on :5173 + API on :3001 both accessible
- [ ] `curl http://localhost:3001/health` → `{"status":"ok"}`
- [ ] `curl http://localhost:3001/users` → array with 2 seed users
- [ ] TypeScript strict mode: zero errors in `api/`
- [ ] No `any` types in `api/src/`
