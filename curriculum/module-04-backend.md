# Module 4 — Backend Fundamentals (`backend.*`)

Full concept content for all 10 concepts in `02-curriculum-model.md`'s
Backend Fundamentals module, in curriculum order. Two were already
authored in `chain-2-request-lifecycle.md` and are reproduced verbatim
here (if either is edited later, edit both copies together).

---

## backend.http-basics — HTTP basics

**Target depth:** Understand

*(Reproduced from `chain-2-request-lifecycle.md` — content unchanged.)*

### What Is It?

HTTP (HyperText Transfer Protocol) is the request/response protocol web
clients and servers use to communicate: a client sends a request (a
method, a URL, headers, optionally a body), and the server sends back a
response (a status code, headers, optionally a body).

### Mental Model

Think of HTTP as a structured letter exchange — every request is a letter
with a clearly labeled envelope (method + URL + headers) and optionally a
letter inside (the body); every response is a reply letter with its own
envelope (a status code) and optionally its own contents.

**HTTP is a one-request, one-response conversation, stateless by default —
the server doesn't remember your last letter unless something (a cookie,
a token) reminds it.**

### How It Works

A browser requesting a page sends e.g. `GET /users/42 HTTP/1.1` with
headers like `Host` and `Accept`; the server replies with a status line
like `200 OK`, headers like `Content-Type: application/json`, and a body.

### Important Distinctions

- HTTP is stateless — each request is independent unless something like a
  cookie or token carries state across requests.
- HTTP (the protocol) ≠ REST (a convention for designing APIs on top of
  it, covered next).

### Why Does It Exist?

Before a common protocol, every client and server pairing would need its
own bespoke communication format. HTTP standardizes the conversation so
any HTTP client can talk to any HTTP server.

### Connections

- **Enables:** `backend.rest-apis`, `backend.http-methods-status-codes`,
  `fastapi.routes-endpoints`.
- **Related:** `gcparch.service-to-service-communication`.

### Production Appearance

Every network request a browser or frontend app makes — `fetch()` calls,
API clients, even loading an image — is an HTTP request under the hood.

### Example

Opening a browser's Network tab while loading any web page shows dozens
of individual request/response pairs, one per resource (HTML, CSS, JS,
images, API calls).

### Practice

Without looking it up — what are the two things every HTTP request must
have, and the one thing every HTTP response must have? *(A method + a
URL; a status code.)*

---

## backend.rest-apis — REST APIs

**Target depth:** Use

*(Reproduced from `chain-2-request-lifecycle.md` — content unchanged.)*

### What Is It?

REST (Representational State Transfer) is a convention for designing HTTP
APIs around *resources* — nouns like `/users` or `/orders/42` —
manipulated with a small, standard set of HTTP methods rather than one
bespoke verb-shaped endpoint per action.

### Mental Model

Instead of an API built as a list of remote-control buttons
(`/createUser`, `/deleteUser`, `/getUserById`), REST treats the API like
a filing cabinet of resources — `/users/42` is a drawer, and what you do
to it (read, replace, delete) is expressed by the HTTP method, not the
URL.

**REST names things with URLs and describes actions with HTTP methods —
the URL is a noun, the method is the verb.**

### How It Works

`GET /users/42` reads a user; `POST /users` creates one; `PUT /users/42`
replaces one; `DELETE /users/42` removes one. The same resource path is
reused across methods rather than encoding the action into the path.

### Important Distinctions

- REST ≠ a strict protocol with a validator — it's a set of conventions,
  and real APIs follow it to varying degrees.
- A "RESTful" API ≠ "any API that uses HTTP and JSON" — that's necessary
  but not sufficient; the resource-oriented URL design is the actual
  defining trait.

### Why Does It Exist?

Bespoke, verb-per-endpoint APIs (`/createUser`, `/getUserById`,
`/updateUserEmail`...) grow unpredictably and inconsistently across a
team. REST's small, fixed method vocabulary applied uniformly to
resources makes an unfamiliar API guessable.

### Connections

- **Prerequisite:** `backend.http-basics`.
- **Enables:** `fastapi.routes-endpoints`.
- **Related:** `backend.http-methods-status-codes`.

### Production Appearance

Almost every backend API you'll read in a real codebase organizes its
routes this way — look for a router file grouping paths by resource
(`/api/users/*`, `/api/orders/*`) with methods distinguishing the
operation.

### Example

A blog API: `GET /posts` (list), `GET /posts/7` (one post), `POST /posts`
(create), `PATCH /posts/7` (partial update), `DELETE /posts/7` (remove).

### Practice

Design the REST-shaped URL + method for "cancel order #103" — is it a new
endpoint like `/cancelOrder`, or does it fit the existing resource
pattern? *(Fits: `PATCH /orders/103` with a body like `{"status":
"cancelled"}`, reusing the resource path rather than inventing a verb
endpoint.)*

---

## backend.request-response-lifecycle — Request/response lifecycle

**Target depth:** Reason

### What Is It?

The request/response lifecycle is the ordered sequence of stages a single
HTTP request passes through inside a backend application — from arrival
at the server to the response being sent back — routing, middleware,
parsing, validation, business logic, and serialization, in a fixed order.

### Mental Model

Think of it as a request moving down a single conveyor belt through a
series of stations, each one allowed to inspect, transform, reject, or
pass the request along — nothing later in the pipeline runs until
everything earlier has finished (or explicitly rejected the request).

**A request doesn't just "arrive and get handled" — it moves through a
fixed, ordered pipeline of stages, and a bug can live at any one of
them.**

### How It Works

A typical backend's stages, in order:

1. The server receives the raw HTTP request (`backend.http-basics`).
2. It's routed to the matching handler based on method + path
   (`fastapi.routes-endpoints` is the FastAPI-specific version of this
   stage).
3. Middleware runs (`backend.middleware`) — logging, auth checks, CORS.
4. The request body/params are parsed and validated (`backend.json`,
   `fastapi.pydantic-validation`).
5. The handler's business logic runs, often touching a database.
6. The result is serialized into a response body with a status code
   (`backend.http-methods-status-codes`).
7. The response is sent back over the same connection.

### Important Distinctions

- This lifecycle ≠ specific to any one framework — FastAPI, Express,
  Django all implement the same conceptual stages, just with different
  names/mechanisms (FastAPI's dependency injection is one framework's
  specific implementation of stages 3–4).
- A request failing at an early stage (routing, validation) ≠ the same as
  failing at the business-logic stage — the status code and where you'd
  look to debug differ completely (a 404 means routing failed to match
  anything; a 422 typically means validation failed; a 500 means
  something threw during business logic).

### Why Does It Exist (as a concept to hold onto)

Without thinking of a request as passing through ordered stages,
debugging "why didn't this work" becomes guesswork; knowing the fixed
order lets you localize a failure to a specific stage quickly, by
checking what each stage is responsible for.

### Connections

- **Prerequisite (BLOCKING):** `backend.http-basics`, `backend.rest-apis`.
- **Enables:** `fastapi.routes-endpoints`, `fastapi.dependency-injection`
  (the FastAPI-specific implementation of these stages),
  `integration.trace-request-frontend-to-db` (the fully worked, concrete
  instance of this lifecycle).

### Production Appearance

Debugging "why is this API call not doing what I expect" by walking this
lifecycle stage by stage — did it route correctly? did validation pass?
did the handler run? what did it return? — is the systematic way to find
where it actually broke.

### Trace

A malformed request to `POST /orders` with a missing required field:

| Stage | What happens |
|---|---|
| Received | server accepts the raw HTTP request |
| Routed | matches `POST /orders` to the order-creation handler |
| Middleware | passes (assuming no auth issue) |
| Validation | fails — the required field is missing |
| Business logic | never runs — validation rejected the request first |
| Response | a 422 status with details about the missing field |

### Common Misconceptions

**"If I get an error response, the bug must be in my business logic."**
Often the request never reached the business logic at all — a routing
mismatch or validation failure short-circuits the pipeline long before
the handler's own code runs, which is exactly why checking the status
code first (`backend.http-methods-status-codes`) tells you which stage to
actually investigate.

### Practice

A request returns a 404 instead of the expected data — using the
lifecycle stages, which stage failed, and what does that rule out?
*(Routing failed to match any handler for that method+path
combination — this rules out validation and business logic entirely;
they never ran.)*

### Mastery Check (Reason)

A teammate says "the API is broken" with no other detail. Using the
lifecycle stages, list the first three questions you'd ask (or checks
you'd make) to localize the failure, in the order that eliminates the
most possibilities fastest.

### Deeper / Deferred

The exact ASGI/WSGI-level mechanics of how a Python web server actually
receives and parses raw bytes off a socket connection — named, not
required at this depth.

---

## backend.http-methods-status-codes — HTTP methods & status codes

**Target depth:** Use

### What Is It?

HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, etc.) declare what
kind of operation a request is performing; HTTP status codes (200, 404,
500, etc.) declare the outcome of that request, grouped into ranges by
meaning (2xx success, 4xx client error, 5xx server error).

### Mental Model

Think of the method as the verb in the request's sentence ("get,"
"create," "replace," "remove") and the status code as the one-word
summary the response opens with ("done," "not found," "your fault," "my
fault") — both are compact, standardized vocabularies so any client and
server can agree on meaning without reading prose.

**The method says what you're trying to do; the status code says what
actually happened — 2xx means it worked, 4xx means the request itself was
wrong, 5xx means the server failed while trying.**

### How It Works

The common methods and code ranges:

- `GET` — read, no side effects. `POST` — create, or a non-idempotent
  action. `PUT` — replace a resource entirely. `PATCH` — partially
  update. `DELETE` — remove.
- `2xx` (200 OK, 201 Created, 204 No Content) — success. `4xx` (400 Bad
  Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 422
  Unprocessable Entity) — the client's request was the problem. `5xx`
  (500 Internal Server Error, 503 Service Unavailable) — the server
  failed while handling an otherwise-valid request.

### Important Distinctions

- `401 Unauthorized` ≠ `403 Forbidden` — 401 means "we don't know who you
  are" (missing/invalid credentials); 403 means "we know who you are, and
  you're not allowed to do this" (see `backend.authn-vs-authz`).
- A `4xx` ≠ a `5xx` in terms of where to look — a 4xx means the request
  itself needs fixing; a 5xx means the server threw an unexpected error
  while processing an otherwise-legitimate request.

### Why Does It Exist?

Without a shared, standardized vocabulary for "what kind of operation is
this" and "what happened," every client would need custom logic to
interpret every server's ad-hoc response format; the standard
method/status-code vocabulary lets generic tools understand outcomes
without knowing anything about the specific API.

### Connections

- **Prerequisite:** `backend.http-basics`, `backend.rest-apis`.
- **Related:** `backend.request-response-lifecycle` — status codes are
  how you tell, from the outside, which stage of the lifecycle a request
  failed at.

### Production Appearance

Every network request's status shown in a browser's dev tools Network
tab; reading logs/monitoring dashboards that group errors by status code
range.

### Example

A login attempt with a wrong password typically returns `401`; trying to
access another user's private data typically returns `403`; requesting a
resource that doesn't exist returns `404`.

### Practice

A client sends a well-formed request to update a resource they don't have
permission to modify — is that a 401 or a 403, and why? *(403 — the
server knows who they are (they authenticated successfully); they're just
not allowed to perform this specific action.)*

---

## backend.json — JSON

**Target depth:** Understand

### What Is It?

JSON (JavaScript Object Notation) is a lightweight, text-based data
format for structuring key-value data — the near-universal format for
request and response bodies in modern web APIs.

### Mental Model

Think of JSON as a plain-text way to write down the same shape of data a
JavaScript object or a Python dict already has — objects (`{}`), arrays
(`[]`), strings, numbers, booleans, and null, nested arbitrarily deep,
readable by both humans and any programming language's parser.

**JSON is the common written language APIs use to exchange structured
data — every mainstream language can parse it into its own native data
structures and serialize its own structures back into it.**

### How It Works

```json
{
  "id": 42,
  "name": "Ada",
  "isActive": true,
  "tags": ["admin", "verified"],
  "address": { "city": "London" }
}
```

A backend serializes its internal data (a Python dict, a database row)
into this text format to send as a response body; a client parses the
received JSON text back into its own native data structure
(`js.objects` on the JS side, a dict on the Python side).

### Important Distinctions

- JSON ≠ a programming language — it's a data format with no logic,
  functions, or comments allowed, intentionally minimal.
- JSON's data types ≠ identical to every language's — JSON has one
  numeric type (no separate int/float distinction), and a JSON object's
  keys must be strings (`{1: "x"}` is invalid JSON; `{"1": "x"}` is
  valid).

### Why Does It Exist?

APIs need some structured, cross-language format to exchange data — JSON
won out over more verbose alternatives (like XML) for its simplicity,
close match to how JavaScript and most languages' data structures already
look, and near-universal parser support.

### Connections

- **Prerequisite:** `js.objects`, `js.arrays` — JSON's shape is
  essentially those two ideas as a text format.
- **Enables:** `fastapi.request-response-models` — Pydantic models are,
  among other things, a typed description of expected JSON shape.

### Production Appearance

Nearly every API request/response body in a modern web stack; a
`Content-Type: application/json` header signals a request or response
body is JSON.

### Example

`fetch(url).then(res => res.json())` parses a JSON response body into a
native JavaScript object, ready to use directly.

### Practice

Is `{ name: "Ada", 'role': 'admin' }` valid JSON? *(No — JSON requires
double quotes around both keys and string values; `name` (no quotes) and
`'role'`/`'admin'` (single quotes) are both invalid JSON syntax, even
though they're valid-looking JavaScript object literal syntax.)*

---

## backend.authentication-basics — Authentication basics

**Target depth:** Understand

### What Is It?

Authentication is the process of verifying who is making a request —
confirming an identity, typically via credentials (a password, a token,
an API key) presented with the request.

### Mental Model

Think of authentication as checking ID at the door — the bouncer isn't
deciding what you're allowed to do once inside (that's authorization,
`backend.authn-vs-authz`); they're only confirming you are who your ID
claims you are.

**Authentication answers "who are you" — every request that needs to
know the caller's identity has to authenticate first, before anything
downstream can reason about permissions.**

### How It Works

A common pattern: a user logs in with a username/password once; the
server verifies the credentials and issues a token (e.g. a JWT);
subsequent requests include that token (commonly in an `Authorization`
header); the server verifies the token's validity on each request without
needing to re-check the original password.

### Important Distinctions

- Authentication ≠ authorization — authentication establishes identity;
  authorization (next concept) decides what that identity is allowed to
  do.
- A valid token ≠ a permanent pass — tokens typically expire and must be
  refreshed or re-issued, which is why "my session expired" is a real,
  expected authentication event, not a bug.

### Why Does It Exist?

Most applications need to know who's making a request — to personalize
behavior, restrict access to a user's own data, or simply track who did
what; authentication is the foundational mechanism that establishes that
identity for everything downstream to rely on.

### Connections

- **Prerequisite:** `backend.http-basics`.
- **Enables:** `backend.authn-vs-authz`, `fastapi.dependency-injection` —
  the `current_user` dependency pattern from Module 5 is authentication's
  concrete FastAPI implementation.

### Production Appearance

Any login flow, and any subsequent API request carrying an
`Authorization: Bearer <token>` header, is this mechanism in action.

### Example

After logging into an app, every subsequent API call the frontend makes
automatically attaches the stored token, so the backend can identify the
user without asking them to log in again on every request.

### Practice

After a token expires, a request carrying it is sent to the server — what
should the server do, and what should the client typically do in
response? *(The server should reject the request, usually with a 401;
the client should recognize that status and prompt the user to log in
again, or silently refresh the token if a refresh mechanism exists.)*

---

## backend.authn-vs-authz — Authentication vs Authorization

**Target depth:** Reason

### What Is It?

Authentication and authorization are two distinct, sequential concerns:
authentication verifies who a request's caller is; authorization then
decides what that specific, already-identified caller is allowed to do.

### Mental Model

Authentication is the ID check at the door; authorization is the separate
decision, once inside, about which rooms you're allowed into — you can be
fully authenticated (the bouncer knows exactly who you are) and still be
denied entry to a specific room (authorization says no).

**Authentication happens first and answers "who is this"; authorization
happens after and answers "is this specific person allowed to do this
specific thing" — conflating the two is a common, real security
mistake.**

### How It Works

A request first passes through authentication (`backend.authentication-basics`) —
if that fails, a 401 is returned before anything else is even considered.
Only once identity is established does authorization run — checking that
identity's permissions/role against the specific action being requested;
if that fails, a 403 is returned.

### Important Distinctions

- This is the source of the 401-vs-403 distinction from
  `backend.http-methods-status-codes` — 401 means authentication failed;
  403 means authentication succeeded but authorization failed.
- Authorization ≠ a single global yes/no — it's typically scoped
  per-action, per-resource (a user might be authorized to read their own
  orders but not another user's, and not authorized to delete any order
  at all).

### Why Does It Exist?

Knowing who someone is doesn't automatically imply what they should be
allowed to do — a logged-in regular user and a logged-in admin are both
fully authenticated, but need very different authorization rules; keeping
the two concerns separate lets each be reasoned about and tested
independently.

### Connections

- **Prerequisite (BLOCKING):** `backend.authentication-basics`,
  `backend.http-methods-status-codes`.
- **Enables:** `fastapi.dependency-injection`'s `require_admin`-style
  layered-dependency pattern (Module 5) is exactly authorization
  implemented as a dependency that runs after authentication.

### Production Appearance

Any codebase with distinct user roles (admin vs. regular user), or
per-resource ownership checks ("can this user edit this specific
order"), is implementing authorization on top of authentication.

### Common Misconceptions

**"If a user is logged in, they should be able to access anything the API
exposes."** Being authenticated only establishes identity — it says
nothing about what that identity is permitted to do; every sensitive
action still needs its own authorization check.

### Practice

A fully logged-in user tries to delete another user's account — assuming
the system correctly distinguishes the two concerns, which check fails,
and what status code results? *(Authorization fails — the request is
authenticated (the server knows exactly who's asking) but that identity
isn't permitted to delete someone else's account, resulting in a 403.)*

### Mastery Check (Reason)

Explain why a security bug where "any authenticated user can delete any
other user's data" is specifically an authorization failure, not an
authentication failure — and why fixing authentication (e.g. requiring
stronger passwords) wouldn't actually fix this bug at all.

---

## backend.middleware — Middleware (generic)

**Target depth:** Use

### What Is It?

Middleware is code that runs on every request (or every request matching
some criteria) before it reaches its specific route handler — commonly
used for cross-cutting concerns like logging, authentication checks, or
CORS headers that apply broadly rather than to one specific endpoint.

### Mental Model

Think of middleware as a series of checkpoints every request must pass
through before reaching its specific destination — each checkpoint can
inspect the request, modify it, log something about it, or stop it
entirely (returning a response early) without the route handler ever
running.

**Middleware runs before (and often after) every matching route's own
handler — it's how cross-cutting behavior gets applied once, instead of
being copy-pasted into every single route.**

### How It Works

Middleware is typically registered once, globally or for a group of
routes, and every matching request passes through it, in a defined
order, before the specific route handler ever runs — and often again on
the way back out, wrapping the response too.

### Important Distinctions

- Middleware (runs on every matching request, framework-level) ≠ a
  route-specific dependency like FastAPI's `Depends()`
  (`fastapi.dependency-injection`) — middleware applies broadly and
  uniformly by registration; a per-route dependency is opted into
  individually per route function.
- Middleware that runs before the handler ≠ the only kind — some
  middleware also wraps the *outgoing* response (e.g. adding a header to
  every response, timing how long the request took).

### Why Does It Exist?

Some behavior (logging every request, checking a CORS header, rejecting
requests over a rate limit) needs to apply uniformly across many or all
routes; without middleware, that logic would have to be manually
duplicated inside every single route handler.

### Connections

- **Prerequisite:** `backend.request-response-lifecycle` — middleware is
  a specific, named stage within that lifecycle.
- **Enables:** `fastapi.middleware` — the FastAPI-specific implementation
  of this same concept, Module 5.

### Production Appearance

A `middleware/` folder or a handful of `app.use(...)`/
`@app.middleware(...)`-style registrations near a backend app's entry
point, applying logging, CORS, or auth checks globally.

### Example

A logging middleware that records the method, path, and response time of
every single request, regardless of which specific route handled it.

### Practice

Would a check that only applies to one specific endpoint (e.g. "this one
export endpoint requires an extra confirmation header") typically be
implemented as global middleware, or as logic scoped to that one route?
*(Scoped to that one route — middleware is for behavior that should
apply broadly across many/all routes; a single-endpoint-specific check
belongs in or near that endpoint's own handler/dependencies instead.)*

---

## backend.sync-vs-async — Synchronous vs asynchronous programming

**Target depth:** Reason

### What Is It?

Synchronous programming executes one operation at a time, each one
blocking until it completes before the next starts; asynchronous
programming lets a program start a slow operation (like a network call)
and continue doing other work while waiting for it to finish, rather than
blocking.

### Mental Model

Think of a synchronous cook who won't start the next dish until the
current one is completely done, even during the parts where they're just
waiting for water to boil; an asynchronous cook starts the water boiling,
then immediately starts prepping the next dish while waiting, coming back
to the first dish once the water's ready.

**Synchronous code blocks the whole thread while waiting; asynchronous
code lets the thread do other work during the wait, and comes back once
the slow operation finishes.**

### How It Works

A synchronous request handler that queries a database blocks that entire
thread/worker until the database responds — no other request can be
handled by that worker in the meantime. An asynchronous handler (Python's
`async def`, using `await`) can pause at the database call and let the
server's event loop (`js.event-loop`'s same architectural idea, applied
server-side) handle other requests during that wait, resuming this one
once the database responds.

### Important Distinctions

- Async ≠ multithreading — a single-threaded async runtime (like
  Python's asyncio, or JavaScript's event loop) handles concurrency by
  *interleaving* waiting operations on one thread, not by literally
  running code in parallel on multiple CPU cores.
- Async ≠ automatically faster for CPU-bound work — async's benefit is
  specifically for I/O-bound waiting (network, disk, database); a
  genuinely CPU-heavy computation blocks an async event loop just as much
  as a synchronous one, since there's no actual parallelism happening.

### Why Does It Exist?

A backend server that blocks an entire worker/thread on every slow
database or network call can only handle as many concurrent requests as
it has workers — expensive to scale. Async lets one worker interleave
many requests that are mostly waiting (the common case for typical API
traffic), handling far more concurrent requests with the same resources.

### Connections

- **Prerequisite (BLOCKING):** `js.event-loop` — the exact same
  underlying architectural pattern, in a different language.
- **Enables:** `fastapi.async-endpoints` (the concrete FastAPI
  implementation of this idea),
  `backend.api-vs-webhook-vs-websocket-vs-polling` (understanding
  sync vs. async execution underlies why some of those communication
  patterns exist).

### Production Appearance

A FastAPI route defined with `async def` versus plain `def` signals
whether that specific handler runs on the async event loop or in a
separate thread pool — a real, consequential distinction when reading
FastAPI code.

### Example

An async endpoint awaiting a database query can, in principle, let the
server handle other incoming requests during that database round-trip; a
synchronous endpoint doing the same query blocks its worker for that
entire duration.

### Common Misconceptions

**"Using `async def` automatically makes an endpoint faster."** It
doesn't inherently speed up any single request — its benefit is
*throughput* under concurrent load (handling more simultaneous requests
with the same resources), not making one request's own latency lower.

### Practice

A route performs a CPU-heavy calculation (no network/database calls
involved) — does making it `async def` meaningfully help its performance
under concurrent load? *(Not much — async's benefit comes from
interleaving *waiting* time; a CPU-bound calculation still occupies the
event loop for its full duration regardless of `async`/`await`, so it
can still block other requests during that computation.)*

### Mastery Check (Reason)

Explain, using the event loop model from Module 1, why an `async def`
FastAPI route that accidentally calls a *synchronous*, blocking database
library function inside it can be worse for overall server throughput
than just writing the whole route as plain synchronous `def` in the
first place.

### Deeper / Deferred

Python's GIL (Global Interpreter Lock) and exactly how it interacts with
asyncio versus true multithreading/multiprocessing for CPU-bound work —
named, not required at this depth.

---

## backend.api-vs-webhook-vs-websocket-vs-polling — API vs Webhook vs WebSocket vs Polling

**Target depth:** Reason

### What Is It?

Four different patterns for how a client and server exchange information
over time, differing in who initiates communication and whether it's a
one-off exchange or an ongoing connection: a plain API call (client asks,
server answers, once), a webhook (server proactively calls the client
when something happens), a WebSocket (a persistent, two-way open
connection), and polling (the client repeatedly asks "anything new yet?"
on an interval — short polling repeats quickly and constantly, long
polling holds each request open until there's something to report or a
timeout).

### Mental Model

Think of a regular API call as sending a letter and waiting for one
reply; a webhook as giving someone your phone number and having them call
*you* when something happens; a WebSocket as an open phone line both
sides can talk on anytime; and polling as repeatedly calling someone and
asking "anything new?" — short polling hangs up and immediately redials,
long polling stays on hold until there's actually news to report.

**A regular API call is client-initiated and one-shot; a webhook is
server-initiated; a WebSocket is a persistent two-way connection; polling
is the client repeatedly checking — pick based on who needs to know what,
and how quickly.**

### How It Works

- **API call:** client sends a request, server responds, connection
  closes — the default pattern for most interactions.
- **Webhook:** the client registers a URL with the server ahead of time;
  when a relevant event happens (a payment completes, a file finishes
  processing), the server sends an HTTP request *to that URL* — the
  roles of "client" and "server" for that specific exchange effectively
  flip.
- **WebSocket:** client and server establish one long-lived connection
  over which either side can send messages at any time, without the
  overhead of a new HTTP request per message — used for real-time,
  frequent, bidirectional communication (chat, live updates).
- **Polling:** the client repeatedly sends requests asking for updates.
  *Short polling* does this on a fixed interval (e.g. every 5 seconds),
  getting an immediate response each time even if nothing changed. *Long
  polling* sends a request that the server deliberately holds open, not
  responding until there's actually new data (or a timeout is reached),
  then the client immediately re-requests — closer to real-time than
  short polling, without needing a persistent connection.

### Important Distinctions

- A webhook ≠ something the client can rely on being instant or
  guaranteed-once — webhook deliveries can be delayed, retried, or
  occasionally duplicated, so webhook handlers need to be built to
  tolerate that (idempotency).
- Polling ≠ inherently wrong just because it's "less elegant" than a
  WebSocket — for infrequent updates, or when infrastructure/simplicity
  constraints make a persistent connection impractical, polling is a
  perfectly reasonable, simpler choice.
- Short polling ≠ long polling in server cost — short polling generates
  many requests regardless of whether anything changed; long polling
  reduces wasted requests but ties up a server connection per waiting
  client for longer.

### Why Does It Exist?

Different situations genuinely need different communication shapes: a
one-off lookup doesn't need a persistent connection; something that needs
to notify many external systems about events can't practically keep an
open connection to every one of them, so it calls out via webhook
instead; something needing true real-time bidirectional interaction
benefits from a WebSocket's persistent connection; and simple periodic
freshness checks are often well served by ordinary polling.

### Connections

- **Prerequisite:** `backend.http-basics`, `backend.sync-vs-async` —
  understanding non-blocking execution helps explain why a server can
  hold many long-polling or WebSocket connections open concurrently.
- **Related:** `fastapi.async-endpoints` — an async server is much better
  suited to handling many concurrent long-polling or WebSocket
  connections than a purely synchronous one.

### Production Appearance

A payment provider's "payment succeeded" notification arriving at your
backend via a webhook; a live chat feature using a WebSocket; a dashboard
that refreshes its data every 30 seconds via short polling; a background
job's progress bar updated via long polling.

### Common Misconceptions

**"A webhook is just a fancy word for an API call."** The key difference
is who initiates it — with a webhook, the *other* system calls *your*
server, proactively, when something happens on their end; you can't
request a webhook the way you request an API response, you can only
register to receive one.

### Practice

A third-party payment provider needs to tell your application the
instant a payment finishes processing (which could take anywhere from
seconds to minutes) — of these four patterns, which fits best, and why
not the others? *(A webhook — you don't know in advance exactly when
it'll complete, so short polling wastes requests checking too often or
misses timely updates checking too rarely, and a WebSocket would require
the payment provider to keep a persistent connection open per pending
payment, which doesn't match how most payment providers are built; a
webhook lets them notify you exactly once, when it actually happens.)*

### Mastery Check (Reason)

A chat feature currently uses short polling every 2 seconds to check for
new messages. Users complain messages feel laggy, and the server is
under heavy load from the constant polling requests. Using what you know
about all four patterns, which would you migrate to, and what tradeoff
are you accepting by doing so?
