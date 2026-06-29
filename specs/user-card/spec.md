# Spec: User Card

## Summary

A visual card that displays a user's identity at a glance: their photo, their
name, and their current availability status. The card retrieves and displays
this information automatically, without any input from the viewer. It serves
as a reusable building block wherever a user's profile needs to be surfaced in
the interface.

---

## User Stories

### P1 — MVP

#### [US-01] See the user's photo
**As a** viewer,
**I want** to see the user's profile photo on the card,
**So that** I can identify who this person is at a glance.

**Acceptance criteria:**
- **Given** the card is displayed and the user has a profile photo
- **When** the card finishes loading
- **Then** the photo is visible inside the card
- **And** the photo is presented in a uniform, circular or rounded frame so all photos appear consistent

---

#### [US-02] See the user's name
**As a** viewer,
**I want** to read the user's full name on the card,
**So that** I know who I am looking at.

**Acceptance criteria:**
- **Given** the card is displayed
- **When** the card finishes loading
- **Then** the user's full name is visible and legible
- **And** the name is not truncated unless it exceeds a very long length (more than 40 characters)

---

#### [US-03] See the user's availability status
**As a** viewer,
**I want** to see whether the user is online, away, or offline,
**So that** I know if I can expect a prompt response from them.

**Acceptance criteria:**
- **Given** the card is displayed
- **When** the card finishes loading
- **Then** a status indicator is visible alongside the user's name or photo
- **And** the indicator clearly distinguishes between at least three states: **online**, **away**, and **offline**
- **And** each state uses a distinct visual cue (not color alone)

---

### P2 — Important

#### [US-04] Graceful display when no photo is available
**As a** viewer,
**I want** to still see a meaningful representation of the user when they have no photo,
**So that** the card does not appear broken or empty.

**Acceptance criteria:**
- **Given** the card is displayed and the user has no profile photo
- **When** the card finishes loading
- **Then** a placeholder is shown in place of the photo (e.g., the user's initials)
- **And** the placeholder occupies the same space and shape as a real photo would

---

#### [US-05] Feedback while information is loading
**As a** viewer,
**I want** to see a clear indication that the card is loading,
**So that** I know the information is on its way and the interface is not frozen.

**Acceptance criteria:**
- **Given** the card is displayed and user information has not yet arrived
- **When** the card is in the loading state
- **Then** a loading placeholder (skeleton or spinner) occupies the card area
- **And** no partial or broken data is shown during loading

---

#### [US-06] Informative display when information cannot be retrieved
**As a** viewer,
**I want** to see a clear message when the card cannot load the user's information,
**So that** I understand there is a problem rather than assuming the card is empty.

**Acceptance criteria:**
- **Given** the card is displayed and retrieving the user's information fails
- **When** the error condition occurs
- **Then** an error message is shown inside the card area
- **And** the message does not expose technical details to the viewer

---

### P3 — Nice-to-have

#### [US-07] Card is usable by screen reader users
**As a** viewer using a screen reader,
**I want** the card content to be announced correctly,
**So that** I receive the same information as a sighted user.

**Acceptance criteria:**
- **Given** the card is rendered
- **When** a screen reader navigates to the card
- **Then** the user's name is announced
- **And** the status is announced with a text label (not only a color dot)
- **And** the photo has a meaningful description or is treated as decorative

---

#### [US-08] Card adapts to narrow screens
**As a** viewer on a mobile device,
**I want** the card to display correctly at small screen widths,
**So that** I can read all the information without horizontal scrolling.

**Acceptance criteria:**
- **Given** the card is displayed on a screen 320px wide or wider
- **When** the card renders
- **Then** all content (photo, name, status) is visible and not cut off
- **And** no horizontal scrollbar appears

---

## Functional Requirements

| ID | Requirement |
|----|-------------|
| EF-01 | The card MUST display the user's photo when one is available |
| EF-02 | The card MUST display the user's full name |
| EF-03 | The card MUST display the user's availability status |
| EF-04 | The status MUST be one of three values: **online**, **away**, or **offline** |
| EF-05 | Each status value MUST have a distinct visual representation using more than color alone |
| EF-06 | When no photo is available, the card MUST show a fallback placeholder |
| EF-07 | The card MUST show a loading state while information is being retrieved |
| EF-08 | The card MUST show an error state if information cannot be retrieved |
| EF-09 | The card MUST be navigable and meaningful with a keyboard and screen reader |
| EF-10 | The card MUST render correctly at viewport widths from 320px upward |

---

## Edge Cases

| Case | Expected behavior |
|------|------------------|
| User has no profile photo | Fallback placeholder shown (e.g., initials); no broken image icon |
| Profile photo URL is broken / fails to load | Same fallback as "no photo" — placeholder replaces the broken image |
| User name is very long (> 40 characters) | Name is truncated with an ellipsis; full name accessible on hover or via screen reader |
| User name contains only spaces or is empty | Fallback label shown (e.g., "Unknown user") |
| Status value is not one of the three known values | Treated as "offline" or "unknown"; no crash |
| Information retrieval takes a long time (> 3 s) | Loading state remains visible; no timeout error is triggered by the card itself |
| Information retrieval fails | Error state shown; a retry mechanism is out of scope for MVP |
| Card rendered multiple times on the same page | Each card is independent; they do not interfere with one another |

---

## Entities

### User
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | identifier | yes | Unique identifier for the user |
| `name` | text | yes | Full display name |
| `avatarUrl` | URL | no | Link to the user's profile photo; absent when none is set |
| `status` | enum | yes | One of: `online`, `away`, `offline` |

---

## Success Criteria

| ID | Metric | Target |
|----|--------|--------|
| CS-01 | Name visible when data is available | 100% of renders |
| CS-02 | Status indicator visible and distinguishable for each of the 3 states | 100% |
| CS-03 | Fallback placeholder shown when no avatar URL is provided | 100% |
| CS-04 | Loading state shown before data arrives | 100% |
| CS-05 | Error state shown when retrieval fails | 100% |
| CS-06 | Test suite passes with ≥ 80% coverage on the card and its data hook | 100% |
| CS-07 | No horizontal overflow at 320px viewport width | Verified |
| CS-08 | Screen reader announces name and status correctly | Verified via accessibility audit |

---

## Out of Scope

- Editing or updating the user's name, photo, or status from the card
- Clicking the card to navigate to a full profile page
- Real-time status updates (polling or live push of status changes)
- Multiple users displayed simultaneously within a single card (list or grid is a separate feature)
- Authentication or access control (the card does not decide who is allowed to see it)
- Persistent storage of user data
- Any form of user search or filtering

---

## Clarification Points

1. **Status values**: The spec defines three states (`online`, `away`, `offline`). Should a fourth state — `busy` (do not disturb) — be included in MVP, or deferred to P2/P3?
2. **Fallback placeholder content**: When no photo is available, should the placeholder show the user's initials, a generic silhouette icon, or either (design's choice)?
3. **Card boundaries**: Is the card a standalone, self-contained block (fetches its own data given a user ID), or does a parent screen supply the user ID it should display?
