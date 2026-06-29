# Tasks: UserCard Integration on the Home Page

**Input**: `specs/user-card-integration/spec.md` + `plan.md`
**Complexity**: Simple (3 files, static data, no new hooks)

---

## Phase 1 — Tests (RED) · Must FAIL before Phase 2

> **TDD gate**: run `npm test` after T001 — the 5 new tests MUST be red.

- [ ] T001 — [US-01][US-02] Add 5 integration tests to `src/App.test.tsx`

  Tests to add inside the existing `describe('App', ...)` block or a new nested describe:

  | Test | Story | What it verifies |
  |------|-------|-----------------|
  | UserCard article is rendered | US-01 | `getByRole('article')` is in the document |
  | Demo name "Jane Doe" is visible | US-02 | `getByText('Jane Doe')` is in the document |
  | Demo email is visible | US-02 | `getByText('jane.doe@example.com')` is in the document |
  | Status label is visible | US-02 | `getByText('Online')` is in the document |
  | Heading precedes card in DOM | EF-01/EF-02 | `heading.compareDocumentPosition(card)` equals `DOCUMENT_POSITION_FOLLOWING` |

**Checkpoint** ✓: `npm test` — 5 failures, 34 passes.

---

## Phase 2 — Implementation (GREEN)

### T002 — Create `src/App.module.css`

Defines the card section layout. Contents:

```
.cardSection
  display: flex
  justify-content: center
  padding: 4rem 1rem          ← vertical breathing room (US-03)
  background-color: #f8fafc   ← light paper, contrasts with dark hero
  box-sizing: border-box
```

No other classes needed. The `UserCard` handles its own internal layout.

---

### T003 — [US-01][US-02][US-03][US-04] Update `src/App.tsx`

Three changes in this file:

1. **Add imports** at the top:
   ```
   import { UserCard } from './components/UserCard';
   import type { User } from './components/UserCard';
   import styles from './App.module.css';
   ```

2. **Add module-level constant** (above the `App` function):
   ```
   const DEMO_USER: User = {
     id: 'demo',
     name: 'Jane Doe',
     email: 'jane.doe@example.com',
     status: 'online',
     // no avatarUrl → initials fallback "JD"
   };
   ```

3. **Add section in JSX** (after `<HelloMessage />`):
   ```
   <section className={styles.cardSection}>
     <UserCard user={DEMO_USER} />
   </section>
   ```

**Checkpoint** ✓: `npm test` — all 39 tests pass (34 + 5).

---

## Phase 3 — Verify [P]

All three tasks can run in parallel once T003 is done.

- [ ] T004 — [P] Run `npm run typecheck` — expect 0 errors

- [ ] T005 — [P] Run `npm run test:coverage` — verify App coverage ≥ 80 %
  - If below threshold: add a test for the edge case that causes the gap

- [ ] T006 — [P] Visual acceptance in browser (`npm run dev`)
  - [ ] Dark hero with "Hello World" heading renders first
  - [ ] Scrolling reveals the light card section
  - [ ] `UserCard` is horizontally centered in the section
  - [ ] Card shows "Jane Doe", "jane.doe@example.com", "Online", initials "JD"
  - [ ] At 320 px viewport width: no horizontal scroll, all content visible
  - [ ] At 2560 px viewport width: card stays centered, not stretched

**Checkpoint** ✓: All gates pass — ready to commit.

---

## Dependencies and Execution Order

```
T001 (RED tests)
     │
     ▼
T002 (App.module.css)
     │
     ▼
T003 (App.tsx — imports T002)
     │
     ├──▶ T004 (typecheck) [P]
     ├──▶ T005 (coverage)  [P]
     └──▶ T006 (visual)    [P]
```

---

## Definition of Done

| Criterion | Command | Expected result |
|-----------|---------|-----------------|
| All tests pass | `npm test` | 39 passed, 0 failed |
| No type errors | `npm run typecheck` | Exit 0 |
| Coverage ≥ 80 % on App | `npm run test:coverage` | App rows ≥ 80 % |
| Heading above card in DOM | T001 test | Green |
| Demo data visible | T001 tests | Green |
| No visual regressions | `npm run dev` + manual check | No overflow, centered card |

---

**Version**: 1.0 | **Created**: 2026-06-29
