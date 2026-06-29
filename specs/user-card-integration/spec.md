# Spec: UserCard Integration on the Home Page

## Summary

Show a demo user profile card directly below the "Hello World" heading on the home page,
so that visitors can see the UserCard component in context and verify it works correctly
in the application.

---

## User Stories

### P1 — MVP

#### [US-01] See the UserCard below the greeting

**As a** visitor,
**I want** to see a user profile card displayed beneath the "Hello World" heading,
**So that** the page demonstrates the UserCard component in a real page layout.

**Acceptance criteria:**
- **Given** the visitor opens the home page
- **When** the page finishes loading
- **Then** the "Hello World" heading is visible at the top of the page
- **And** a UserCard is visible below it
- **And** the card displays a name, an avatar (or initials fallback), and a status indicator
- **And** the card is never hidden or obscured

---

#### [US-02] See realistic demo data on the card

**As a** visitor,
**I want** the profile card to show a believable example user,
**So that** I can understand what the card looks like with real content.

**Acceptance criteria:**
- **Given** the home page is displayed
- **When** the UserCard appears
- **Then** it shows a full name (e.g., "Jane Doe")
- **And** it shows an email address (e.g., "jane.doe@example.com")
- **And** it shows one of the three availability statuses: online, away, or offline
- **And** the data is fixed (does not change between page loads)

---

### P2 — Important

#### [US-03] Comfortable spacing between heading and card

**As a** visitor,
**I want** visible breathing room between the "Hello World" heading and the profile card,
**So that** the two elements feel like distinct sections rather than a clump.

**Acceptance criteria:**
- **Given** the home page is displayed
- **When** the visitor looks at the page
- **Then** there is a visible gap separating the heading from the card
- **And** neither element overlaps or touches the other

---

#### [US-04] Card is centered on the page

**As a** visitor,
**I want** the card to be horizontally centered,
**So that** the layout feels balanced and deliberate rather than left-aligned by default.

**Acceptance criteria:**
- **Given** the home page is displayed at any viewport width of 320 px or wider
- **When** the page renders
- **Then** the card is visually centered horizontally within the page
- **And** no content is clipped or hidden off-screen

---

### P3 — Nice-to-have

#### [US-05] Page still passes basic accessibility checks

**As a** visitor using assistive technology,
**I want** both the heading and the profile card to be announced correctly,
**So that** I receive the same information as a sighted visitor.

**Acceptance criteria:**
- **Given** the home page is displayed
- **When** a screen reader navigates the page
- **Then** the "Hello World" heading is announced first
- **And** the user's name and status from the card are announced afterwards
- **And** no content is skipped or duplicated

---

## Functional Requirements

| ID    | Requirement |
|-------|-------------|
| EF-01 | The page MUST display the "Hello World" heading above the UserCard |
| EF-02 | The UserCard MUST appear below the heading, not beside or behind it |
| EF-03 | The UserCard MUST display at least a name, an email, and a status indicator |
| EF-04 | The demo user data MUST be fixed and consistent across page reloads |
| EF-05 | The layout MUST remain correct at viewport widths from 320 px upward |
| EF-06 | The heading and the card MUST NOT overlap |

---

## Edge Cases

| Case | Expected behaviour |
|------|--------------------|
| Very narrow screen (320 px wide) | Heading and card both remain fully visible; no horizontal scroll |
| Very wide screen (2560 px+) | Card stays centered; does not stretch to the full width of the viewport |
| Screen reader navigation | Heading is announced before card content |

---

## Entities

No new data entities are introduced.
The demo user displayed on the card is a fixed, pre-defined value (not fetched from any external source).

| Field | Example value |
|-------|--------------|
| Name | Jane Doe |
| Email | jane.doe@example.com |
| Status | online |
| Avatar | initials fallback ("JD") or a sample image URL |

---

## Success Criteria

| ID    | Metric | Target |
|-------|--------|--------|
| CS-01 | "Hello World" heading is visible when the page loads | 100 % of renders |
| CS-02 | UserCard is visible below the heading | 100 % of renders |
| CS-03 | Card shows a name, email, and status | 100 % of renders |
| CS-04 | No content overlap between heading and card | Verified visually at 320 px and 1280 px |
| CS-05 | Existing App tests continue to pass unchanged | 100 % pass rate |
| CS-06 | New integration tests pass with ≥ 80 % coverage on App | 100 % pass rate |

---

## Out of Scope

- Fetching or changing the displayed user via any external source or form
- Navigating to a profile page when the card is clicked
- Displaying more than one UserCard on the page
- Changing the "Hello World" heading or its visual style
- Dark-mode or theme switching
- Animations or transitions between page sections

---

## Clarification Points

1. **Avatar**: Should the demo user show a real image URL, or is the initials fallback ("JD") sufficient for the demo?
2. **Background**: The "Hello World" heading currently sits on a dark full-page background. Should the UserCard share that dark background, or appear on a contrasting light section?
3. **Status value**: Which of the three statuses (`online`, `away`, `offline`) should the demo card display by default?
