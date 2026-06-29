# Spec — Express REST API + Full-Stack Project Structure

**Feature:** `express-api`
**Date:** 2026-06-29
**Status:** Draft

---

## Summary

Add a Node.js REST server alongside the existing React frontend so developers can work on and test both the interface and the data layer in a unified project. The project root is reorganized to expose clear commands for starting, testing, and verifying the front end and the back end independently or together.

---

## User Stories

### P1 — MVP

#### US-01 — List users
> As a developer, I want to retrieve the full list of users from the server  
> So that I can display or verify available data.

**Acceptance criteria:**
- Given the server is running, when I request the users list, then I receive an array (empty if no users exist)
- Given 3 users have been added, when I request the list, then I receive exactly 3 user objects
- The response arrives in under 200 ms on a local machine

---

#### US-02 — Get a single user
> As a developer, I want to retrieve one user by their identifier  
> So that I can display their details or use them in a specific context.

**Acceptance criteria:**
- Given a user exists with id `abc`, when I request `/users/abc`, then I receive that user's data
- Given no user exists with id `xyz`, when I request `/users/xyz`, then I receive a clear "not found" error

---

#### US-03 — Create a user
> As a developer, I want to add a new user to the server  
> So that I can populate the data layer and see it reflected in subsequent list requests.

**Acceptance criteria:**
- Given valid data (name, email, status), when I submit a create request, then a new user is returned with a generated unique identifier and the status code "created"
- Given a missing required field, when I submit the request, then I receive a descriptive validation error and no user is created
- Given an invalid status value (not `online` or `offline`), then I receive a validation error

---

#### US-04 — Delete a user
> As a developer, I want to remove a user by their identifier  
> So that I can clean up test data or manage the list.

**Acceptance criteria:**
- Given a user exists with id `abc`, when I send a delete request for `abc`, then the user is removed and I receive a "no content" confirmation
- Given no user exists with id `xyz`, when I send a delete request for `xyz`, then I receive a "not found" error

---

#### US-05 — Run both front and back from the project root
> As a developer, I want a single root-level command to start the frontend and the backend simultaneously  
> So that I don't have to open multiple terminals and remember separate commands.

**Acceptance criteria:**
- Given I am at the project root, when I run the "start all" command, then both the React frontend and the Express server start and are accessible
- Each part also starts independently with its own dedicated command

---

#### US-06 — Test back end independently
> As a developer, I want to run the server test suite in isolation  
> So that I can verify the data endpoints without starting the UI.

**Acceptance criteria:**
- Given I am in the server folder, when I run the test command, then all endpoint tests execute and produce a pass/fail report
- Given I am at the project root, when I run the "test all" command, then both frontend and backend test suites run

---

### P2 — Important

#### US-07 — Update a user
> As a developer, I want to modify an existing user's data  
> So that I can correct or evolve data without deleting and recreating entries.

**Acceptance criteria:**
- Given a user exists with id `abc`, when I send an update with a new name, then the stored user reflects the new value
- Given an invalid field value in the update, then I receive a validation error and the user is unchanged
- Given a non-existent id, then I receive a "not found" error

---

#### US-08 — Health check endpoint
> As a developer, I want a status endpoint on the server  
> So that I can quickly verify the server is running without querying user data.

**Acceptance criteria:**
- Given the server is running, when I call the health endpoint, then I receive a success response indicating the server is operational

---

### P3 — Nice-to-have

#### US-09 — Pre-populated seed data
> As a developer, I want the server to start with a few demo users already loaded  
> So that I can immediately test the frontend with realistic data without manual setup.

**Acceptance criteria:**
- When the server starts, at least 2 demo users are present in the list
- The seed data includes a variety of status values (`online` and `offline`)

---

## Functional Requirements

| ID | Requirement |
|----|-------------|
| EF-01 | `GET /users` returns an array of all users (empty array if none) |
| EF-02 | `GET /users/:id` returns the matching user or a 404 error |
| EF-03 | `POST /users` validates required fields (name, email, status); returns 201 + created user on success, 400 + error message on failure |
| EF-04 | `DELETE /users/:id` removes the user and returns 204, or 404 if not found |
| EF-05 | `PUT /users/:id` updates fields and returns the updated user, or 400/404 on error [P2] |
| EF-06 | `GET /health` returns a 200 success response [P2] |
| EF-07 | Status field only accepts the values `online` or `offline` |
| EF-08 | User identifiers are unique and auto-generated on creation |
| EF-09 | The server runs on a port that does not conflict with the frontend |
| EF-10 | The project root exposes commands: start-all, test-all, start-front, start-back, test-front, test-back |

---

## Edge Cases

| Case | Expected behavior |
|------|-------------------|
| `GET /users/:id` with unknown id | 404 with message "User not found" |
| `POST /users` with missing `name` | 400 with message listing the missing field |
| `POST /users` with missing `email` | 400 with message listing the missing field |
| `POST /users` with status `"away"` (invalid) | 400 with message listing accepted values |
| `DELETE /users/:id` with unknown id | 404 with message "User not found" |
| `PUT /users/:id` with unknown id | 404 with message "User not found" |
| `PUT /users/:id` with invalid status | 400 with validation error |
| Empty user list on first start | `GET /users` returns `[]`, no error |
| Concurrent identical POST requests | Each creates a user with its own unique id |

---

## Entities

### User

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `id` | string | auto | Unique, generated on creation |
| `name` | string | yes | Non-empty |
| `email` | string | yes | Non-empty, valid email format |
| `status` | string | yes | `"online"` or `"offline"` only |

> The `User` shape matches the type already used by the `UserCard` component in the frontend.

---

## Success Criteria

| ID | Criterion | Measurement |
|----|-----------|-------------|
| CS-01 | All CRUD endpoints return correct HTTP status codes | Manual + automated tests: 200, 201, 204, 400, 404 |
| CS-02 | Backend test suite covers all endpoints and error cases | Coverage ≥ 80% (lines, branches, functions) |
| CS-03 | Server starts independently with one command | Verified by running the server start command alone |
| CS-04 | Root "start all" command launches both frontend and server | Both are accessible without a second terminal |
| CS-05 | Frontend tests continue to pass unchanged | `npm test` at root passes all 39 existing tests |
| CS-06 | No TypeScript errors in backend or frontend | Zero errors on typecheck |

---

## Out of Scope

- Persistent storage (SQL, NoSQL) — data is in-memory only, resets on restart
- Authentication and authorization
- Pagination, filtering, or sorting of the user list
- Frontend UI changes to call the new server (no wiring in React)
- Deployment configuration (Docker, cloud, reverse proxy)
- Rate limiting or security hardening

---

## Clarification Points

None — scope confirmed by developer answers:
- Endpoints: Users CRUD (matching the existing `User` type)
- Structure: frontend stays at root, server added in `api/` folder
- Root scripts orchestrate both parts
