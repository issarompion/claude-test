# Implementation Plan: UserCard Integration on the Home Page

**Branch**: `feature/auto-20260629-104552`
**Date**: 2026-06-29
**Spec**: [specs/user-card-integration/spec.md](./spec.md)
**Status**: Draft

---

## Summary

Add the existing `UserCard` component to `App.tsx`, below the `HelloMessage` hero section,
displaying a fixed demo user (Jane Doe, online). A new `App.module.css` provides the
centering and spacing for the card section without touching `HelloMessage` at all.

---

## Technical Context

| Aspect | Choice | Notes |
|--------|--------|-------|
| **Language** | TypeScript 5.5 strict | `no any`, `noUnusedLocals` |
| **Framework** | React 18 + Vite | CSS Modules for styles |
| **Tests** | Vitest + @testing-library/react | jsdom environment |
| **Target** | Web — 320 px and up | No SSR |

### Constraints

- `HelloMessage` and its CSS MUST NOT be modified (out of scope per spec)
- Demo user data MUST be a static constant — no fetching, no state
- Existing App tests (3 tests) MUST continue to pass unchanged
- Coverage on `App` MUST reach ≥ 80 %

---

## Constitution/Conventions Check

- [x] Follows project conventions (CSS Modules, PascalCase components, TDD)
- [x] Consistent with existing architecture (same pattern as HelloMessage)
- [x] No over-engineering (3 files, no new hooks or contexts)
- [x] Tests planned (TDD — tests written before implementation)

---

## Project Structure

```
specs/user-card-integration/
├── spec.md       ← functional specification
├── plan.md       ← this file
└── tasks.md      ← task breakdown

src/
├── App.tsx              ← MODIFY: add UserCard + demo user constant
├── App.module.css       ← CREATE: cardSection layout
└── App.test.tsx         ← MODIFY: add 5 integration tests
```

---

## Impacted Files

### To create

| File | Responsibility |
|------|----------------|
| `src/App.module.css` | Styles for the card section (centering, padding, background) |

### To modify

| File | Modification |
|------|--------------|
| `src/App.tsx` | Import `UserCard` + `styles`, define `DEMO_USER`, render `<section>` + `<UserCard>` |
| `src/App.test.tsx` | Add 5 tests covering US-01, US-02, EF-01/EF-02 document order |

### Unchanged (zero-touch)

| File | Why untouched |
|------|---------------|
| `src/components/HelloMessage.tsx` | Visual style change is out of scope |
| `src/components/HelloMessage.module.css` | Visual style change is out of scope |
| `src/components/UserCard/*` | Component is already complete |

---

## Chosen Approach

### Architecture

```
<main>                          App.tsx
 ├── <HelloMessage />           ← full-screen dark hero (100dvh, unchanged)
 └── <section .cardSection>     ← NEW: light paper section, flex-centered
       └── <UserCard           ← existing component, no props change
             user={DEMO_USER}
           />
```

`DEMO_USER` is a module-level `const` in `App.tsx` — no state, no context,
no prop drilling. The card section sits below the fold after the hero;
the visitor scrolls past the hero to reach it.

### Rationale

**Why a separate `<section>` instead of putting the card inside `HelloMessage`?**
`HelloMessage` is a single-responsibility heading component. Embedding a user card
inside it would violate that responsibility and contradict "out of scope".

**Why module-level `const` for `DEMO_USER`?**
Static data that never changes does not belong in component state. A `const` is
the minimal, correct solution (YAGNI — no fetching hook until a real API exists).

**Why a light background for the card section?**
The `UserCard` is white (`#fff`). Placing it on the same dark (`#0f172a`)
background would require dark-mode CSS overrides. A light section (`#f8fafc`)
is the editorial zero-effort solution and creates natural visual separation.

### Alternatives considered

| Alternative | Why rejected |
|-------------|--------------|
| Modify HelloMessage to shrink its height | Changes visual style — explicitly out of scope |
| Use a theme context to pass background color | Over-engineering: static `const` suffices |
| Render UserCard inside HelloMessage | Breaks HelloMessage's single responsibility |
| Use `useState` for the demo user | No mutation needed; `const` is correct |

---

## Implementation Phases

### Phase 1: Tests first (TDD — RED) [blocking]

Write the failing tests before touching `App.tsx`.

- [ ] T001 — Add 5 integration tests to `src/App.test.tsx` (must FAIL at this point)

**Checkpoint**: `npm test` shows 5 new failing tests.

---

### Phase 2: Implementation (GREEN) [US-01, US-02, US-03, US-04]

- [ ] T002 — Create `src/App.module.css` with `.cardSection`
- [ ] T003 — Update `src/App.tsx`: import UserCard + styles, add `DEMO_USER`, render section

**Checkpoint**: `npm test` passes all tests (3 existing + 5 new).

---

### Phase 3: Verify (REFACTOR + evidence)

- [ ] T004 — Run `npm run typecheck` — 0 errors
- [ ] T005 — Run `npm run test:coverage` — App coverage ≥ 80 %
- [ ] T006 — [P] Visual check: open the app in browser, confirm heading + card layout

**Checkpoint**: All quality gates pass.

---

## Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| New `role="article"` from UserCard breaks an existing App test query | Low | Low | App tests only use `getByRole('main')` and `getByRole('heading')` — no article query exists |
| `HelloMessage` 100dvh pushes card below the fold | UX / demo only | Certain | Accepted — spec does not require above-fold placement; scroll is expected |
| TypeScript strict mode rejects `DEMO_USER` without explicit type | Low | Low | Annotate as `const DEMO_USER: User = { … }` |
| Coverage drops below 80 % | Medium | Low | 5 new tests target every branch of the App render path |

---

## Dependencies and Execution Order

```
T001 (tests RED)
     │
     ▼
T002 (App.module.css) ──┐
                         ├──▶ T003 (App.tsx) ──▶ T004 (typecheck)
                         │                         ──▶ T005 (coverage)
                         │                         ──▶ T006 (visual)
                         └── [parallel with T003 if needed]
```

T001 must come first (TDD). T002 and T003 are sequential within GREEN phase
(App.tsx imports the CSS module). T004–T006 are independent and can run in
parallel once T003 is done.

---

## Validation Criteria

### Before starting (Gate 1)
- [x] Spec exists at `specs/user-card-integration/spec.md`
- [x] `UserCard` component is complete and all 27 tests pass
- [x] `npm test` currently passes (34 tests, 0 failures)

### Before merge (Gate 2)
- [ ] `npm test` — 39 tests pass (34 existing + 5 new), 0 failures
- [ ] `npm run typecheck` — 0 errors
- [ ] `npm run test:coverage` — App ≥ 80 % coverage

### Visual acceptance (Gate 3)
- [ ] `npm run dev` — heading visible in dark hero
- [ ] Scroll down — UserCard visible in light section, centered
- [ ] Resize to 320 px — no horizontal overflow

---

**Version**: 1.0 | **Created**: 2026-06-29
