# Milestone 5 — FastAPI Backend

Guidance level: **Independent** (problem + acceptance criteria only).

## Objective

Reimplement Milestone 4's hand-rolled HTTP server as a real FastAPI app —
same REST contract, now with a framework: typed routes, Pydantic
validation, dependency injection for auth, real middleware, async
endpoints, and auto-generated docs.

## Concepts Practiced

All from `curriculum/module-05-fastapi.md`:

- `fastapi.project-structure` (Understand)
- `fastapi.routes-endpoints` (Use)
- `fastapi.request-response-models` (Use)
- `fastapi.pydantic-validation` (Use)
- `fastapi.dependency-injection` (Reason)
- `fastapi.middleware` (Use)
- `fastapi.async-endpoints` (Reason)
- `fastapi.api-docs` (Understand)

## Previously Learned

`backend.rest-apis`, `backend.middleware`, `backend.json`,
`backend.sync-vs-async`, `js.event-loop` — Milestone 4's raw-HTTP version
of every one of these concepts. You're about to see a framework do the
same jobs; you should be able to name what's the same and what's different
at each point.

## New Concepts

None new — Module 5 applied.

## Requirements

- Same endpoints as Milestone 4: list/create/update/delete expenses.
- `ExpenseIn` / `ExpenseOut` Pydantic models define the request/response
  shape — `fastapi.request-response-models`, `fastapi.pydantic-validation`.
- The auth check from Milestone 4 becomes a `Depends()` dependency, not a
  function called manually inside every handler — `fastapi.dependency-injection`.
- A logging middleware, this time via FastAPI's own middleware system —
  `fastapi.middleware`.
- At least the list/create endpoints are `async def` —
  `fastapi.async-endpoints`.
- Visit `/docs` and confirm Swagger UI is generated correctly from your
  Pydantic models — `fastapi.api-docs`.

## Constraints

- Acceptance criteria only: your endpoints must accept/return the same
  shapes Milestone 4 did, and `/docs` must render correctly with accurate
  request/response schemas. How you organize routers/files is your call.

## Architecture

No prescribed file layout this time — `fastapi.project-structure` is one
of the concepts you're practicing, so structuring the project *is* part of
the task. A single `main.py` and a multi-router package are both valid;
be able to justify whichever you pick.

`project/app/milestone-05-fastapi/` is where this lives. One file ships
pre-written with a bug: whichever file defines your auth dependency — see
Debugging Challenge.

## Implementation Task

Build the whole thing. No stub files provided beyond the seeded bug
described below (you'll need to create that file yourself first, then
notice the bug once you try to use an unauthenticated request and it
succeeds anyway).

## Reasoning Questions

1. What does Pydantic validation give you for free here that Milestone
   4's manual JSON-shape checking did by hand? What happens, concretely,
   to a malformed request now versus then?
2. Why does `Depends()` replace calling a check function manually inside
   every handler? What would go wrong if you just imported and called
   your auth function at the top of each route instead?
3. Trace one `async def` endpoint's execution. What does `async` actually
   buy you here, and would this endpoint behave any differently if you
   made it a plain synchronous `def` instead?
4. What does `/docs` generate itself from? What would happen to the
   generated schema if you removed a field-level constraint from a
   Pydantic model?

## Debugging Challenge

Somewhere in your dependency-injection setup, it's easy to make this exact
mistake — write it deliberately once you have auth working, then "find"
it: define your `get_current_user` (or equivalent) dependency function
correctly, but forget to actually add `Depends(get_current_user)` to one
of the route function's parameters. FastAPI won't error — the route will
just work, unauthenticated, silently.

Write both versions: one route wired correctly, one "forgotten." Confirm
by curling both with no `Authorization` header — one correctly 401s, the
other doesn't. Then explain: why does FastAPI not warn you when a
dependency exists but isn't attached to a route? What does that tell you
about how DI actually works here — is it structural (the framework
scanning for a `Depends`-decorated function somewhere) or purely
per-parameter (only where you explicitly declare it)?

## Verification

- **Implementation:** all endpoints work; `/docs` renders correct
  schemas; unauthenticated requests are correctly rejected on every route
  that should reject them.
- **Reasoning:** answer all four questions above.
- **Debugging:** reproduced and fixed the "forgotten Depends" bug, and can
  state precisely how FastAPI's DI is scoped.
- **Transfer:** given a new endpoint requirement (e.g. "only admins can
  delete"), design the dependency for it without looking anything up.
