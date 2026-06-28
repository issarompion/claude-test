# Implementation Plan: Hello World Web App

**Branch**: `feature/hello-world`
**Date**: 2026-06-28
**Spec**: [spec.md](./spec.md)
**Status**: Draft

---

## Summary

Build a minimal React application that displays "Hello World" centered on screen,
with a matching browser tab title, responsive from 320px, and intentional visual styling.
Approach: Vite + React + TypeScript, single `HelloMessage` component, CSS Module for styling, Vitest for tests.

---

## Technical Context

| Aspect | Choice | Notes |
|--------|--------|-------|
| **Language** | TypeScript 5.x | Strict mode, no `any` |
| **Framework** | React 18 (Vite) | Lightweight, no SSR needed |
| **Bundler** | Vite 5 | Fast dev server, modern defaults |
| **Styling** | CSS Module | Scoped, no runtime dependency |
| **Tests** | Vitest + @testing-library/react | Co-located, fast |
| **Target platform** | Web (browser) | Static page, no backend |

### Constraints

- No backend, no routing, no state management — static page only
- Must work from 320px to 1920px viewport width (EF-04)
- Content must be visible on load without user interaction (EF-05)
- TypeScript strict mode — no `any`

### Expected performance

| Metric | Target |
|--------|--------|
| First paint | < 500ms on localhost |
| Bundle size | < 100 KB (trivial app) |
| Test run | < 5s |

---

## Constitution/Conventions Check

- [x] Follows project conventions (see CLAUDE.md) — TypeScript strict, camelCase/PascalCase
- [x] Consistent with existing architecture — no existing app code, fresh start
- [x] No over-engineering — single component, no abstraction layers
- [x] Tests planned — Vitest unit tests covering all 4 user stories

---

## Project Structure

### Documentation (this feature)

```
specs/hello-world/
├── spec.md           # Functional specification
├── plan.md           # This file
└── tasks.md          # Task breakdown
```

### Source Code

```
/  (project root)
├── index.html                          # Entry point — sets <title>Hello World</title>
├── package.json                        # Dependencies and scripts
├── tsconfig.json                       # TypeScript strict config
├── vite.config.ts                      # Vite + Vitest config
└── src/
    ├── main.tsx                        # React mount point
    ├── App.tsx                         # Root component — renders <HelloMessage>
    ├── App.test.tsx                    # App-level smoke test
    └── components/
        ├── HelloMessage.tsx            # Greeting component (text + layout)
        ├── HelloMessage.module.css     # Scoped styles (centering + responsive + visual)
        └── HelloMessage.test.tsx       # Unit tests — all US acceptance criteria
```

---

## Impacted Files

### To create

| File | Responsibility |
|------|----------------|
| `index.html` | HTML shell — sets `<title>Hello World</title>`, mounts `#root` |
| `package.json` | Dependencies: react, react-dom, vite, vitest, @testing-library/react |
| `tsconfig.json` | TypeScript strict config with DOM lib |
| `vite.config.ts` | Vite bundler + Vitest test environment (jsdom) |
| `src/main.tsx` | Mounts `<App>` into `#root` |
| `src/App.tsx` | Root — renders `<HelloMessage>` |
| `src/App.test.tsx` | Smoke test: App renders without crashing |
| `src/components/HelloMessage.tsx` | Renders the "Hello World" heading |
| `src/components/HelloMessage.module.css` | Viewport-centered layout + responsive + visual identity |
| `src/components/HelloMessage.test.tsx` | Unit tests for all US acceptance criteria |

### To modify

None — this is a fresh project with no existing source files.

---

## Chosen Approach

### Architecture

```
┌────────────────────────────────────────────┐
│  index.html  (<title>Hello World</title>)  │
│       │                                    │
│       ▼                                    │
│  src/main.tsx  (ReactDOM.createRoot)       │
│       │                                    │
│       ▼                                    │
│  src/App.tsx  (root component)             │
│       │                                    │
│       ▼                                    │
│  src/components/HelloMessage.tsx           │
│       │  renders: <h1>Hello World</h1>     │
│       │  styled by: HelloMessage.module.css│
└────────────────────────────────────────────┘
```

### Rationale

- **Single component** (`HelloMessage`) — the spec has one concern: display a greeting. A dedicated component makes it independently testable and satisfies TDD.
- **CSS Module over Tailwind/styled-components** — zero runtime overhead, scoped by default, no extra dependency for a one-file use case.
- **Vite over Create React App** — CRA is deprecated; Vite is the current standard and starts in < 1s.
- **`h1` tag for the greeting** — semantic HTML; the most important text on the page is a level-1 heading.
- **`min-height: 100dvh` + flexbox centering** — modern, robust centering that works across viewport sizes and at 200% zoom.

### Alternatives considered

| Alternative | Why rejected |
|-------------|--------------|
| Next.js | Overkill for a static single page — adds SSR/routing complexity |
| Tailwind CSS | Additional PostCSS pipeline for a trivial style; CSS Module is sufficient |
| inline styles | Not scoped, harder to maintain and test |
| `position: absolute; top: 50%; left: 50%` | Breaks at zoom/overflow; flexbox is cleaner |

---

## Implementation Phases

### Phase 1: Project Setup (blocking)

**Objective**: Initialize the Vite + React + TypeScript project with test infrastructure.
All subsequent phases depend on this being complete.

- [ ] T001 — Initialize project files (`package.json`, `vite.config.ts`, `tsconfig.json`)
- [ ] T002 — Create `index.html` with `<title>Hello World</title>` (covers EF-02)
- [ ] T003 — Create `src/main.tsx` entry point

**Checkpoint**: `npm install` succeeds; `npm run dev` serves a blank page; `npm test` runs (0 tests).

---

### Phase 2: US-01 — Display the welcome message (P1 - MVP) 🎯

**Objective**: "Hello World" visible on screen + tab title set.
Covers EF-01, EF-02, EF-05 and CS-01, CS-02.

#### Tests first (TDD — RED before GREEN)

- [ ] T004 — Write `HelloMessage.test.tsx`: test renders `<h1>Hello World</h1>` in the DOM
- [ ] T005 — Write `App.test.tsx`: smoke test — `<App>` renders without crashing

#### Implementation (GREEN)

- [ ] T006 — Create `src/components/HelloMessage.tsx` — renders `<h1>Hello World</h1>`
- [ ] T007 — Create `src/App.tsx` — renders `<HelloMessage />`

**Checkpoint**: `npm test` passes; `npm run dev` shows "Hello World" text; tab title reads "Hello World".

---

### Phase 3: US-02 — Centered and readable layout (P1 - MVP)

**Objective**: Greeting centered horizontally and vertically, text size adequate.
Covers EF-03 and CS-01.

#### Tests first (TDD — RED before GREEN)

- [ ] T008 — Extend `HelloMessage.test.tsx`: test component has centering class applied

#### Implementation (GREEN)

- [ ] T009 — Create `HelloMessage.module.css`: full-viewport flex centering, `font-size: clamp(2rem, 5vw, 4rem)`

**Checkpoint**: Visual check in browser — text is centered at full-screen and at 50% window size.

---

### Phase 4: US-03 — Responsive on mobile (P2)

**Objective**: Layout works from 320px width with no overflow.
Covers EF-04 and CS-03.

#### Tests first (TDD — RED before GREEN)

- [ ] T010 — Extend `HelloMessage.test.tsx`: test wrapper has `max-width: 100%` / no overflow style

#### Implementation (GREEN)

- [ ] T011 — Update `HelloMessage.module.css`: add `max-width: 100%; overflow-wrap: break-word; padding: 0 1rem`

**Checkpoint**: Browser DevTools responsive mode at 320px — no horizontal scrollbar, text fully visible.

---

### Phase 5: US-04 — Visual identity (P3)

**Objective**: Page has intentional styling beyond plain black-on-white.
Covers CS-01 (visual quality).

#### Tests first (TDD — RED before GREEN)

- [ ] T012 — Extend `HelloMessage.test.tsx`: test root element has expected background color class

#### Implementation (GREEN)

- [ ] T013 — Update `HelloMessage.module.css`: dark background (`#0f172a`), gradient text on heading, subtle typography polish
- [ ] T014 — Add global CSS reset in `src/index.css`, import from `main.tsx` (remove default browser margin)

**Checkpoint**: Visual check — page no longer looks like a blank default page.

---

### Phase 6: Polish & Quality

- [ ] T015 — Run `npm test -- --coverage` and verify ≥ 80% coverage
- [ ] T016 — Run `npm run build` and verify production bundle compiles clean
- [ ] T017 — Final visual QA: desktop (1280px), mobile (375px), zoom 200%

---

## Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| `jsdom` does not compute CSS layout (centering not testable via computed styles) | Low | High | Test class presence, not computed pixel values; visual QA in browser covers the gap |
| `dvh` unit not supported in very old browsers | Low | Low | Fallback to `100vh` in CSS; spec does not require old browser support |
| Vite peer dependency conflicts on Node version | Medium | Low | Pin to `node >= 18` in `package.json` engines |

---

## Dependencies and Execution Order

```
Phase 1 (Setup) ──▶ Phase 2 (US-01 MVP)
                         │
                         ▼
                    Phase 3 (US-02 Layout) ──▶ Phase 4 (US-03 Responsive)
                                                       │
                                                       ▼
                                               Phase 5 (US-04 Visual)
                                                       │
                                                       ▼
                                               Phase 6 (Polish)
```

Layout phases are sequential because each builds on the same CSS file.
Tests within each phase are parallelizable (`[P]`).

---

## Validation Criteria

### Before starting (Gate 1)
- [x] Spec approved
- [x] Plan reviewed
- [ ] Dev environment ready (`node -v` >= 18, `npm -v` >= 9)

### Before each merge (Gate 2)
- [ ] `npm test` passes (all green)
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors (`tsc --noEmit`)

### Before deployment (Gate 3)
- [ ] CS-01: "Hello World" visible on load ✓
- [ ] CS-02: Tab title "Hello World" ✓
- [ ] CS-03: No overflow at 320px ✓
- [ ] CS-04: Test suite 100% pass ✓

---

**Version**: 1.0 | **Created**: 2026-06-28
