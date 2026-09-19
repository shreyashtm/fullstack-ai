# Milestone 3 — Next.js App Structure

Guidance level: **Partially Guided** (requirements + constraints given, you decide file-level implementation).

## Objective

Move the React app into Next.js's App Router: real routes, a correct
Server/Client Component split, a Route Handler standing in as "the
backend" for now, loading/error UI per route, and one environment
variable read the right way for its context.

## Concepts Practiced

All from `curriculum/module-03-nextjs.md`:

- `next.fundamentals` (Understand)
- `next.app-router` (Use)
- `next.server-client-components` (Reason)
- `next.data-fetching` (Use)
- `next.loading-error-states` (Use)
- `next.env-vars` (Understand)

## Previously Learned

`react.fundamentals`, `react.api-calls` (both direct prerequisites per the
curriculum model), plus the rest of Module 2 from Milestone 2.

## New Concepts

None new to the curriculum — this milestone is Module 3 applied wholesale.

## Requirements

1. App Router structure with at least three routes: `/expenses` (list),
   `/expenses/[id]` (detail/edit), `/categories` (totals) — `next.app-router`.
2. Pages that only read/display data are Server Components by default.
   Only the interactive pieces (the add-expense form, delete buttons) are
   explicit `"use client"` components — `next.server-client-components`.
3. A Route Handler at `app/api/expenses/route.js` stands in as the backend
   for now (in-memory or a local JSON file — not a real DB yet, that's
   Milestones 5-6). Server Components fetch through it —
   `next.data-fetching`.
4. Each route segment that fetches data has its own `loading.js`, and at
   least one has an `error.js` — `next.loading-error-states`.
5. One config value (e.g. a feature flag or the sync endpoint) is read
   from an environment variable, correctly scoped: `NEXT_PUBLIC_*` if a
   Client Component needs it, unprefixed if only server code touches it —
   `next.env-vars`.

## Constraints

- App Router only, not the Pages Router.
- A Client Component must never directly import a non-`NEXT_PUBLIC_`
  environment variable — if client code needs a value, it must come from
  a prop passed down from a Server Component, not a direct env read.

## Architecture

You decide the exact component boundaries inside each route. The route
map itself is fixed:

```
project/app/milestone-03-nextjs/
  package.json, next.config.js
  app/
    layout.jsx
    page.jsx                 <- redirects or links into /expenses
    expenses/
      page.jsx                  <- Server Component, lists expenses
      loading.jsx
      error.jsx
      [id]/
        page.jsx                    <- Server Component, detail + edit form
    categories/
      page.jsx                        <- Server Component, totals
    api/
      expenses/
        route.js                        <- GET/POST/PATCH/DELETE, in-memory or file-backed
  components/
    ExpenseForm.jsx                       <- "use client"
  .env.local.example
```

`app/expenses/page.jsx` is provided with a seeded bug — see Debugging
Challenge — reason about it before fixing.

## Implementation Task

Scaffold the routes and Route Handler yourself following the map above.
Only `app/expenses/page.jsx` ships pre-written (with its bug). Everything
else is a blank slate within the given file layout.

## Reasoning Questions

1. Why can't a Client Component read a non-`NEXT_PUBLIC_` environment
   variable? What's actually different about *where* each component type
   executes?
2. Mechanically, what does `loading.js` wrap around your page (hint:
   Suspense)? When exactly does Next show it versus `error.js`?
3. Why does `app/api/expenses/route.js` exist instead of a Server
   Component fetching an external API directly? What would you lose
   without it — think ahead to Milestone 5's real FastAPI backend.
4. Trace one request: a user opens `/expenses/42`. Name, in order, which
   parts run on the server and which run in the browser.

## Debugging Challenge

`app/expenses/page.jsx` ships marked `"use client"` at the top, but it
also tries to read a private (non-`NEXT_PUBLIC_`) environment variable
directly and do an `async` server-side fetch inside the component body.
In the browser, the env var reads as `undefined` and the fetch either
fails or leaks logic that should never reach the client bundle.

Don't just delete the `"use client"` directive and move on. First explain:
why does that env var read as `undefined` specifically in the browser,
when it's clearly set in `.env.local`? Then fix it properly — split the
page into a Server Component (does the fetch, reads the private env var)
that renders a small Client Component as a child for whatever actually
needs interactivity. Verify by confirming the env var value only ever
appears in server-side logs, never in browser devtools.

## Verification

- **Implementation:** all three routes work; loading/error states appear
  correctly (test by throttling network / throwing an intentional error);
  the env var is read correctly for its scope.
- **Reasoning:** answer all four questions above.
- **Debugging:** fixed `expenses/page.jsx`, can explain the server/client
  execution boundary without re-reading Next.js docs.
- **Transfer:** given a different component, correctly predict whether it
  needs `"use client"` before checking.
