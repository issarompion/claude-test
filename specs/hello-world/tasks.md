# Tasks: Hello World Web App

**Input**: `specs/hello-world/plan.md`, `specs/hello-world/spec.md`
**Branch**: `feature/hello-world`

---

## Phase 1: Setup — Project initialization (blocking)

**Goal**: Vite + React + TypeScript skeleton with Vitest ready to run.
**⚠️ CRITICAL**: No user story can start before this phase is finished.

- [ ] T001 — Create `package.json` with scripts (`dev`, `build`, `test`, `test:coverage`, `typecheck`) and dependencies (react, react-dom, vite, vitest, jsdom, @testing-library/react, @testing-library/jest-dom, @types/react, @types/react-dom, typescript)
- [ ] T002 — Create `vite.config.ts` — Vite bundler + Vitest jsdom test environment
- [ ] T003 — Create `tsconfig.json` — strict TypeScript, DOM lib, paths for `src/`
- [ ] T004 — Create `index.html` — sets `<title>Hello World</title>`, mounts `<div id="root">`
- [ ] T005 — Create `src/main.tsx` — `ReactDOM.createRoot(document.getElementById('root')).render(<App />)`

**Checkpoint**: `npm install` ✓ | `npm run dev` serves blank page ✓ | `npm test` runs with 0 tests ✓

---

## Phase 2: US-01 — Welcome message visible (P1 MVP) 🎯

**Goal**: "Hello World" text displayed on screen; tab title reads "Hello World".
**Covers**: EF-01, EF-02, EF-05 / CS-01, CS-02
**Independent test**: Open browser → text "Hello World" visible; check tab title.

### Tests for US-01 ⚠️ Write FIRST — verify they FAIL before implementing

- [ ] T006 — [P] [US-01] Create `src/components/HelloMessage.test.tsx` — test: renders `<h1>` with text "Hello World" in the DOM (using `screen.getByRole('heading', { name: /hello world/i })`)
- [ ] T007 — [P] [US-01] Create `src/App.test.tsx` — smoke test: `<App>` renders without crashing

### US-01 implementation (GREEN)

- [ ] T008 — [US-01] Create `src/components/HelloMessage.tsx` — functional component rendering `<h1>Hello World</h1>`
- [ ] T009 — [US-01] Create `src/App.tsx` — renders `<main><HelloMessage /></main>`

**Checkpoint**: `npm test` green ✓ | "Hello World" text visible in browser ✓ | tab title = "Hello World" ✓

---

## Phase 3: US-02 — Centered and readable layout (P1 MVP)

**Goal**: Greeting centered horizontally and vertically; font size legible without zoom.
**Covers**: EF-03 / CS-01
**Independent test**: Browser window at full size — text is centered in the viewport.

### Tests for US-02 ⚠️ Write FIRST — verify they FAIL before implementing

- [ ] T010 — [US-02] Extend `src/components/HelloMessage.test.tsx` — test: component root element has the CSS module centering class applied (`styles.container` or similar); test: heading has adequate font size class

### US-02 implementation (GREEN)

- [ ] T011 — [US-02] Create `src/components/HelloMessage.module.css`:
  ```css
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100dvh;
  }
  .heading {
    font-size: clamp(2rem, 5vw, 4rem);
    font-weight: 700;
    text-align: center;
  }
  ```
- [ ] T012 — [US-02] Update `src/components/HelloMessage.tsx` — apply `styles.container` and `styles.heading`

**Checkpoint**: `npm test` green ✓ | text visually centered at full screen ✓

---

## Phase 4: US-03 — Responsive on mobile (P2)

**Goal**: No horizontal overflow; text visible at 320px minimum viewport width.
**Covers**: EF-04 / CS-03
**Independent test**: Chrome DevTools → set viewport to 320px → no scrollbar, text intact.

### Tests for US-03 ⚠️ Write FIRST — verify they FAIL before implementing

- [ ] T013 — [US-03] Extend `src/components/HelloMessage.test.tsx` — test: heading has `overflow-wrap` or `word-break` class; test: container has horizontal padding

### US-03 implementation (GREEN)

- [ ] T014 — [US-03] Update `src/components/HelloMessage.module.css` — add to `.container`:
  ```css
  padding: 0 1rem;
  box-sizing: border-box;
  ```
  Add to `.heading`:
  ```css
  max-width: 100%;
  overflow-wrap: break-word;
  ```

**Checkpoint**: `npm test` green ✓ | 320px viewport: no horizontal scrollbar ✓

---

## Phase 5: US-04 — Visual identity (P3)

**Goal**: Page has intentional styling beyond plain black-on-white.
**Covers**: CS-01 (visual quality)
**Independent test**: Browser — page no longer looks like a default blank page.

### Tests for US-04 ⚠️ Write FIRST — verify they FAIL before implementing

- [ ] T015 — [US-04] Extend `src/components/HelloMessage.test.tsx` — test: container has a background color class (i.e., `styles.container` classname present on the wrapper rendered by the component)

### US-04 implementation (GREEN)

- [ ] T016 — [US-04] Create `src/index.css` — global reset:
  ```css
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, -apple-system, sans-serif; }
  ```
- [ ] T017 — [US-04] Update `src/main.tsx` — add `import './index.css'`
- [ ] T018 — [US-04] Update `src/components/HelloMessage.module.css` — add to `.container`:
  ```css
  background-color: #0f172a;
  ```
  Add to `.heading`:
  ```css
  color: #f8fafc;
  letter-spacing: -0.02em;
  ```

**Checkpoint**: `npm test` green ✓ | page has dark background with light text ✓

---

## Phase 6: Polish & Quality

**Goal**: Verify all success criteria are met; production build clean.

- [ ] T019 — [P] Run `npm test -- --coverage` → confirm ≥ 80% coverage on `HelloMessage.tsx` and `App.tsx`
- [ ] T020 — [P] Run `npm run build` → confirm zero errors, zero TypeScript errors
- [ ] T021 — Final visual QA matrix:
  - [ ] Desktop 1280px: text centered, visual identity ✓
  - [ ] Mobile 375px: no overflow ✓
  - [ ] Minimum 320px: no overflow ✓
  - [ ] Zoom 200%: text readable, no clipping ✓
  - [ ] Tab title: "Hello World" ✓

---

## Dependencies and Execution Order

```
Phase 1 (Setup)
     │
     ▼
Phase 2 (US-01 MVP) ──▶ Phase 3 (US-02 Layout) ──▶ Phase 4 (US-03 Responsive)
                                                              │
                                                              ▼
                                                      Phase 5 (US-04 Visual)
                                                              │
                                                              ▼
                                                      Phase 6 (Polish)
```

### Within-phase parallelism

| Tag | Tasks | Can run in parallel? |
|-----|-------|----------------------|
| [P] | T006, T007 (Phase 2 tests) | Yes — different files |
| [P] | T019, T020 (Phase 6 quality) | Yes — independent checks |

### Sequential constraints

- T008, T009 must come AFTER T006, T007 fail (TDD red before green)
- T010 must fail before T011, T012
- T013 must fail before T014
- T015 must fail before T016–T018

---

## Summary Table

| ID | Phase | US | Description | Path |
|----|-------|----|-------------|------|
| T001 | 1 | — | `package.json` | `/package.json` |
| T002 | 1 | — | `vite.config.ts` | `/vite.config.ts` |
| T003 | 1 | — | `tsconfig.json` | `/tsconfig.json` |
| T004 | 1 | — | `index.html` | `/index.html` |
| T005 | 1 | — | `src/main.tsx` | `src/main.tsx` |
| T006 | 2 | US-01 | Tests: HelloMessage renders heading | `src/components/HelloMessage.test.tsx` |
| T007 | 2 | US-01 | Tests: App smoke test | `src/App.test.tsx` |
| T008 | 2 | US-01 | Component: HelloMessage | `src/components/HelloMessage.tsx` |
| T009 | 2 | US-01 | Component: App | `src/App.tsx` |
| T010 | 3 | US-02 | Tests: centering class present | `src/components/HelloMessage.test.tsx` |
| T011 | 3 | US-02 | CSS: flex centering + clamp font | `src/components/HelloMessage.module.css` |
| T012 | 3 | US-02 | Update HelloMessage with styles | `src/components/HelloMessage.tsx` |
| T013 | 4 | US-03 | Tests: responsive CSS classes | `src/components/HelloMessage.test.tsx` |
| T014 | 4 | US-03 | CSS: padding + overflow-wrap | `src/components/HelloMessage.module.css` |
| T015 | 5 | US-04 | Tests: background class present | `src/components/HelloMessage.test.tsx` |
| T016 | 5 | US-04 | Global CSS reset | `src/index.css` |
| T017 | 5 | US-04 | Import index.css in main.tsx | `src/main.tsx` |
| T018 | 5 | US-04 | CSS: dark bg + light text | `src/components/HelloMessage.module.css` |
| T019 | 6 | — | Coverage check ≥ 80% | — |
| T020 | 6 | — | Production build clean | — |
| T021 | 6 | — | Visual QA matrix | — |

---

**Version**: 1.0 | **Created**: 2026-06-28
