# Module 7 — Revision, Phase A (`revA.*`)

Full concept content for all 3 concepts in `02-curriculum-model.md`'s
Phase A revision module. These are **review/synthesis concepts, not new
material** — `SKILL.md` §7 explicitly warns not to mechanically force the
full concept-structure onto every concept, and a revision unit is exactly
the case where several sections (What Is It?, Why Does It Exist?) don't
apply the normal way, since nothing here introduces a mechanism not
already taught in Modules 1–6.

**A note on honesty (`SKILL.md` §16, §11):** the methodology's intended
review mechanism (§7, §12) is evidence-driven — it revisits *this
specific learner's* weak spots, using their own answer history, not a
uniform re-test of everything. This static content file has no learner
state to draw on (this app is a content viewer, not a stateful teaching
session), so `revA.js-react-next-fastapi-review` is honestly built as a
representative, structured self-check instead — a real interactive
deployment would replace its practice set with one generated from actual
evaluation history.

---

## revA.js-react-next-fastapi-review — Cross-module review

**Target depth:** Reason

### What Is It?

A structured cross-module revisit of JavaScript, ReactJS, NextJS, and
FastAPI (Modules 1, 2, 3, and 5, with Backend Fundamentals from Module 4
as the connective tissue) — checking that the individual concepts
already taught actually cohere into one connected mental model, not just
four separate piles of facts.

### Mental Model

Think of the first six modules as four separate rooms you've walked
through one at a time; this review is walking back through the whole
floor with the lights on, checking that the doors between rooms (the
cross-module connections already called out in each concept's own
Connections section) actually make sense as one building, not four
disconnected spaces.

### How It Works

Rather than introducing new mechanism, this review works through the
load-bearing connections already established across the four modules,
revisiting them as single chains instead of separate topics:

- `js.scope-and-closures` → `react.use-callback`/`react.use-effect` (the
  stale-closure chain, Module 1→2).
- `react.fundamentals` → `next.fundamentals` →
  `next.server-client-components` (Module 2→3).
- `backend.sync-vs-async`/`js.event-loop` → `fastapi.async-endpoints`
  (Module 4→1/5).
- `react.api-calls` (client-side fetch) vs. `next.data-fetching`
  (server-side fetch) — the same underlying need solved two different
  ways depending on where the component runs.

### Important Distinctions

A *review* concept ≠ a *new* concept — nothing here introduces a
mechanism not already taught in Modules 1–6; its entire job is checking
connectedness, not adding material.

### Why Does It Exist?

`SKILL.md`'s own methodology (§7) calls for a review/assessment unit that
revisits weak spots using the learner's own evaluation history rather
than a uniform re-test of everything. In a live, stateful deployment of
this notebook, this section would be driven by that history; this static
version instead offers a representative, structured self-check across
all four modules — treat the questions below as a diagnostic, not a
checklist to simply complete.

### Connections

- **Prerequisite:** every concept in Modules 1, 2, 3, 4 (partially), 5.
- **Enables:** `revA.frontend-api-backend-connection`,
  `revA.basic-project-structure-walkthrough` — this module's other two
  concepts build directly on this one's synthesis.

### Practice (cross-module, self-diagnostic)

1. **(JS → React)** Why does an empty dependency array on `useEffect`
   combined with `setCount(count + 1)` produce a bug, and what are the
   two fixes? *(Tests: `js.scope-and-closures`, `react.use-effect`,
   `react.use-state`.)*
2. **(React → Next)** A component needs `useState` for a filter dropdown
   but also needs to query a database directly — why does this typically
   get split into two components? *(Tests: `react.use-state`,
   `next.server-client-components`.)*
3. **(Backend → FastAPI)** Why can an `async def` FastAPI route calling a
   blocking, synchronous database call be *worse* for throughput than a
   plain `def` route doing the same thing? *(Tests: `js.event-loop`,
   `backend.sync-vs-async`, `fastapi.async-endpoints`.)*
4. **(Cross-cutting)** Name the four HTTP status code ranges and what
   each broadly signals, then explain why 401 and 403 are commonly
   confused. *(Tests: `backend.http-methods-status-codes`,
   `backend.authn-vs-authz`.)*

### Mastery Check (Reason)

Pick any one of the four cross-module connections listed in "How It
Works" above and explain it in your own words, from the first module
involved through to the last, without looking back at either concept's
own page. If you can't complete the chain, that's the specific gap to
revisit — not a sign to re-read everything.

### Deeper / Deferred

None — this concept intentionally introduces nothing new.

---

## revA.basic-project-structure-walkthrough — Basic project structure walkthrough

**Target depth:** Use

### What Is It?

A guided walkthrough of a small, representative project layout spanning
the technologies taught so far — how a JavaScript/React/Next.js frontend
and a FastAPI backend are typically organized side by side in one
repository (or two related repositories), tying together each module's
own "project structure" concept (`js.modules`, `fastapi.project-structure`,
`next.fundamentals`) into one concrete picture.

### Mental Model

Think of this as finally seeing the floor plan of the whole building,
after walking through each room individually in Modules 1–6 — where does
the frontend live relative to the backend, and how would you find your
way from "I want to change how orders are displayed" to the actual files
involved, spanning both sides.

### How It Works

A representative layout:

```
project/
  frontend/                  # Next.js app
    app/
      orders/
        page.tsx              # next.app-router
    components/
      OrderList.tsx           # "use client" — next.server-client-components
  backend/                    # FastAPI app
    app/
      main.py                 # fastapi.project-structure
      routers/
        orders.py             # fastapi.routes-endpoints
      models.py                # fastapi.request-response-models
      database.py
```

A single feature — "orders" — has a natural home on both sides: a route
folder in the frontend, a router file in the backend, connected by an
HTTP call (`next.data-fetching` or `react.api-calls`) between them.

### Important Distinctions

This specific layout ≠ the only correct one — real codebases vary (a
single monorepo vs. two separate repos, different folder names), but the
*underlying correspondence* — one feature has both a frontend location
and a backend location, connected by an API call — holds across almost
any real full-stack codebase.

### Why Does It Exist?

Reading an unfamiliar full-stack codebase for the first time is
disorienting without a mental map of "where things generally live";
walking through one concrete, representative layout gives that map
before encountering a real, messier one.

### Connections

- **Prerequisite:** `js.modules`, `next.fundamentals`,
  `fastapi.project-structure`.
- **Enables:** `revA.frontend-api-backend-connection`,
  `integration.representative-project-structure` — Module 13 does this
  again at full-stack scale, including the database and cloud layers.

### Code Reading

Given the layout above, if a bug report says "the orders page shows
stale data after cancelling an order," which two files would you open
first, and in what order? *(`frontend/components/OrderList.tsx` first —
to check whether the client-side state/refetch logic after cancellation
is correct — then `backend/app/routers/orders.py`, to confirm the cancel
endpoint actually persists the change; the order matters because
confirming what the frontend does with the response narrows whether the
bug is even on the backend at all.)*

### Practice

In the layout above, where would you add a new "reviews" feature's
backend endpoint, and what would you name the new file, following the
existing pattern? *(`backend/app/routers/reviews.py`, following the same
one-router-file-per-resource pattern as `orders.py`.)*

---

## revA.frontend-api-backend-connection — How frontend, API, backend connect

**Target depth:** Reason

### What Is It?

A synthesis of how the frontend, the API layer, and the backend's
business logic actually connect into one working feature — tracing a
single user action from a click in the browser through to a response the
user sees, using only what's been taught in Modules 1–6 (no database
yet — that's Module 13's fuller version of this same trace, once
PostgreSQL is covered).

### Mental Model

Think of this as finally connecting the dots between "how React works,"
"how Next.js renders," and "how FastAPI handles a request" — three
things taught as separate modules — into one continuous wire, by walking
one concrete action all the way across it.

### How It Works

Tracing "cancel order" using only Modules 1–6:

1. A user clicks "Cancel" in a Client Component (`react.event-handling`,
   `next.server-client-components`).
2. The handler calls the backend, either via a client-side fetch
   (`react.api-calls`) or triggered from a Server Component on next load
   (`next.data-fetching`).
3. The request is a REST-shaped HTTP call (`backend.rest-apis`) —
   `PATCH /orders/103`.
4. FastAPI routes it to a handler (`fastapi.routes-endpoints`), resolves
   dependencies like the authenticated user
   (`fastapi.dependency-injection`, `backend.authn-vs-authz`).
5. The request body is validated against a Pydantic model
   (`fastapi.pydantic-validation`) before the handler's own logic runs.
6. The handler returns a result; FastAPI serializes it with a status
   code (`backend.http-methods-status-codes`).
7. The frontend receives the response and updates what the user sees
   (`react.use-state`, or a fresh Server Component render).

### Important Distinctions

- This trace ≠ `integration.trace-request-frontend-to-db` (Module 13) —
  this one stops at "the backend does something and responds," without a
  real database in the loop yet; Module 13 extends this exact same skill
  once PostgreSQL is available.
- The trace ≠ always this literal sequence — a Server-Component-driven
  page load (step 2's Next.js branch) skips several steps a client-side
  `useEffect`-triggered fetch would need, which is exactly why
  `next.server-client-components` matters for reading which path a given
  feature actually takes.

### Why Does It Exist?

Modules 1–6 each taught one layer in isolation; a codebase-ready
engineer needs to trace a single feature *across* all of them at once —
this is the connected-understanding check the curriculum's own stated
goal ("how the complete stack fits together") depends on.

### Connections

- **Prerequisite (BLOCKING):** everything in Modules 1–6.
- **Enables:** `revA.basic-project-structure-walkthrough` (this trace
  lives inside that project layout), `integration.trace-request-frontend-to-db` —
  Module 13's fuller version once the database is included.

### Trace

Restating the "cancel order" sequence as a table:

| Step | Layer | Concept(s) |
|---|---|---|
| 1 | Frontend UI | `react.event-handling`, `next.server-client-components` |
| 2 | Frontend → network | `react.api-calls` or `next.data-fetching` |
| 3 | HTTP request | `backend.rest-apis` |
| 4 | FastAPI routing + DI | `fastapi.routes-endpoints`, `fastapi.dependency-injection` |
| 5 | Validation | `fastapi.pydantic-validation` |
| 6 | Response | `backend.http-methods-status-codes` |
| 7 | Frontend update | `react.use-state` / re-render |

### Common Misconceptions

**"The frontend and backend are basically two separate projects that
happen to talk sometimes."** Treating them as fully separate makes
cross-stack bugs (a change on one side silently breaking the other's
assumption) much harder to catch — the trace above is the antidote: one
continuous flow, not two isolated systems.

### Mastery Check (Reason)

A "cancel order" button appears to do nothing when clicked — no visible
error, no change. Using the 7-step trace above, list the first three
things you'd check, in the order that would narrow down the problem
fastest, and explain why that order is efficient.
