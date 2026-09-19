# Milestone 4 — Real HTTP Client/Server Split

Guidance level: **Partially Guided** (requirements + constraints given, you decide implementation).

## Objective

Replace Milestone 3's fake in-memory Route Handler with a real, separate
backend process — built with **nothing but Node's built-in `http` module**,
no framework. FastAPI (Milestone 5) is next; this milestone exists so you
build REST, status codes, JSON parsing, auth basics, and middleware by
hand once, before a framework does it for you.

## Concepts Practiced

All from `curriculum/module-04-backend.md`:

- `backend.http-basics` (Understand)
- `backend.rest-apis` (Use)
- `backend.request-response-lifecycle` (Reason)
- `backend.http-methods-status-codes` (Use)
- `backend.json` (Understand)
- `backend.authentication-basics` (Understand)
- `backend.authn-vs-authz` (Reason)
- `backend.middleware` (Use)
- `backend.sync-vs-async` (Reason)
- `backend.api-vs-webhook-vs-websocket-vs-polling` (Reason)

## Previously Learned

`js.event-loop`, `js.promises`, `js.async-await` (Milestone 1);
`next.data-fetching` (Milestone 3) — the Next.js app now points at this
real server instead of its own Route Handler.

## New Concepts

None — Module 4 applied directly.

## Requirements

1. `GET /expenses`, `POST /expenses`, `PATCH /expenses/:id`,
   `DELETE /expenses/:id` over raw `http.createServer` — correct status
   codes (200/201/204/400/404) — `backend.rest-apis`, `backend.http-methods-status-codes`.
2. Manual JSON body parsing (collect the request stream yourself, no
   body-parser) and JSON responses with correct `Content-Type` —
   `backend.json`.
3. A required `Authorization: Bearer <token>` check against one hardcoded
   token. A missing header returns 401; a present-but-wrong-role header
   (make up a second toy rule, e.g. a `role` claim) returns 403 — two
   different codes for two different reasons, on purpose —
   `backend.authentication-basics`, `backend.authn-vs-authz`.
4. Middleware implemented by hand as composed functions (logging → auth →
   route dispatch) — nothing here is provided by a framework, so the
   order you register them in is the order they run in —
   `backend.middleware`.
5. Point the Milestone 3 Next.js app's data fetching at this real server
   instead of its own Route Handler — `backend.request-response-lifecycle`
   traced end to end, frontend to real backend.

## Constraints

- No Express, Fastify, Koa, or any other framework — raw `http` module
  only. The point is nothing about REST, JSON, or middleware is hidden
  from you here.
- Auth is intentionally a toy (one hardcoded token) — do not build real
  auth. That's out of scope for this milestone.

## Architecture

```
project/app/milestone-04-http-server/
  server.js              <- http.createServer entry point
  src/
    middleware.js           <- logging + auth, composed in sequence
    router.js                  <- method+path -> handler dispatch
    handlers/
      expenses.js                <- the four route handlers
```

`src/middleware.js` ships with its middleware chain pre-written — see
Debugging Challenge.

## Implementation Task

Build `router.js` and `handlers/expenses.js` yourself. `middleware.js` is
provided (with its bug) — reason about it before fixing.

## Reasoning Questions

1. Why does an out-of-order middleware chain fail *silently* instead of
   throwing an error? What would you have had to trace, with no hint, to
   notice this bug on your own?
2. What actually distinguishes your 401 from your 403 response here, and
   why would a client that treats them the same be wrong to do so?
3. You parse JSON bodies by manually collecting chunks off the request
   stream. Why can't you just read `req.body` directly the way you can in
   Express or FastAPI — what is Node actually handing you instead, and why?
4. Given `backend.api-vs-webhook-vs-websocket-vs-polling`'s four options,
   why is plain polling (what the cloud sync has used since Milestone 1)
   the wrong long-term choice for a multi-device expense tracker? Which of
   the other three would you pick, concretely, and why?

## Debugging Challenge

`src/middleware.js`'s chain is registered in this order: **logging →
route dispatch → auth check**. The auth middleware exists, is correctly
written, and does correctly return 401/403 — but because it runs *after*
the route has already been dispatched and handled, it never actually
blocks anything. Every request succeeds regardless of its
`Authorization` header.

Don't just move the auth line and call it fixed. First explain: why does
middleware order determine execution order here, when all three
middlewares are just plain functions sitting in the same file? What does
"before the route handler" actually mean in a hand-rolled chain like this
(no framework enforcing it for you)? Then reorder it correctly, and verify
by confirming a request with no `Authorization` header now gets a 401
before the handler ever runs (add a temporary log inside the handler to
prove it's not being reached).

## Verification

- **Implementation:** all four endpoints work with correct status codes;
  auth returns 401/403 correctly; the Milestone 3 Next.js app successfully
  fetches from this real server instead of its fake Route Handler.
- **Reasoning:** answer all four questions above.
- **Debugging:** fixed the middleware ordering bug, can explain why order
  matters without re-reading a middleware tutorial.
- **Transfer:** predict, for a *different* hand-rolled middleware chain,
  what would happen if two middlewares were swapped — before checking.
