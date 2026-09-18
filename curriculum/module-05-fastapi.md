# Module 5 — FastAPI (`fastapi.*`)

Full concept content for all 8 concepts in `02-curriculum-model.md`'s
FastAPI module, in curriculum order. Two were already authored in
`chain-2-request-lifecycle.md` and are reproduced verbatim here (if
either is edited later, edit both copies together).

---

## fastapi.project-structure — FastAPI project structure

**Target depth:** Understand

### What Is It?

FastAPI project structure is the conventional way a FastAPI codebase
organizes its files — typically separating route definitions, data
models, business logic, and configuration into distinct modules rather
than one giant file.

### Mental Model

Think of a well-structured FastAPI project like a well-organized filing
cabinet — each drawer (folder) holds one kind of thing (routes, models,
database logic), so finding "where does X live" is predictable rather
than requiring a search through one massive file.

**FastAPI itself doesn't enforce a folder structure — the convention
exists so a codebase stays navigable as it grows past a handful of
endpoints.**

### How It Works

A common layout:

```
app/
  main.py           # creates the FastAPI() instance, includes routers
  routers/
    users.py         # user-related endpoints
    orders.py        # order-related endpoints
  models.py          # Pydantic request/response models
  database.py        # DB session setup (get_db, etc.)
  dependencies.py    # shared Depends() functions
```

`main.py` typically just wires everything together
(`app.include_router(users.router)`) rather than defining every endpoint
itself.

### Important Distinctions

- This structure ≠ enforced by FastAPI — it's convention, and small
  projects reasonably start with everything in one `main.py` before
  splitting out as it grows.
- A `routers/` file ≠ the same as an `app.py`/`main.py` entry point —
  routers define endpoints; the entry point assembles them into one
  running application.

### Why Does It Exist?

A single-file FastAPI app becomes unwieldy well before a real production
app is done growing; splitting concerns (routing vs. data shape vs.
business/DB logic) into separate files keeps each piece independently
readable and testable, and lets multiple people work on different areas
without constant merge conflicts.

### Connections

- **Prerequisite:** `js.modules`'s Python analogue — Python's own import
  system, same underlying idea.
- **Enables:** `fastapi.routes-endpoints` (routers live in this
  structure), `compare.fastapi-vs-flask-vs-django` (structural
  conventions are part of what differs between frameworks).

### Production Appearance

Opening an unfamiliar FastAPI repo and immediately looking for a
`routers/` (or `api/`) folder and a `models.py`/`schemas.py` is the
fastest way to orient yourself in it.

### Example

Adding a new "products" feature typically means adding
`routers/products.py`, referencing a `Product` model in `models.py`, and
one line in `main.py` including the new router.

### Practice

In the layout above, where would you look first to find every endpoint's
URL and HTTP method? *(`routers/` — each router file's
`@router.get`/`@router.post` decorators define exactly that, per
`fastapi.routes-endpoints`.)*

---

## fastapi.routes-endpoints — Routes & endpoints

**Target depth:** Use

*(Reproduced from `chain-2-request-lifecycle.md` — content unchanged.)*

### What Is It?

In FastAPI, a route is a Python function decorated to handle a specific
HTTP method and URL path — an *endpoint* is that method+path combination
in the running API.

### Mental Model

A route decorator is a label on a function saying "when a request
matching this method and path arrives, run me, and whatever I return
becomes the response."

**`@app.get("/users/{id}")` above a function is FastAPI's way of wiring a
REST-shaped URL directly to the Python function that handles it.**

### How It Works

```python
@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"id": user_id, "name": "Ada"}
```

FastAPI matches the incoming request's method and path against every
registered route; `{user_id}` is a path parameter, and FastAPI converts it
to the function's declared type (`int`) automatically, returning a 422
error if conversion fails.

### Important Distinctions

- A route's decorator (`@app.get`) ≠ the function's name — the URL and
  method come from the decorator, not from what the Python function is
  called.
- A path parameter (`{user_id}`, part of the URL) ≠ a query parameter
  (`?limit=10`, appended after `?`) ≠ a body field (sent in a POST/PUT's
  JSON payload) — FastAPI infers which kind a function argument is from
  where it's declared and its type.

### Why Does It Exist?

Manually parsing a raw HTTP request's method and path string in every
function would be repetitive and error-prone; the decorator pattern lets
the framework do the routing and the function focus purely on the
resource logic.

### Connections

- **Prerequisite:** `backend.rest-apis`.
- **Enables:** `fastapi.dependency-injection`, `fastapi.request-response-models`.
- **Cross-technology:** this is the FastAPI-specific instance of the
  request lifecycle traced fully in `integration.trace-request-frontend-to-db`.

### Production Appearance

Look for a `routers/` or `api/` folder full of files each defining an
`APIRouter()` and a handful of `@router.get`/`@router.post` functions —
that's where to find "what does this API actually do."

### Example

`@app.post("/orders")` paired with a function `create_order(order:
OrderIn)` — FastAPI parses the incoming JSON body into an `OrderIn`
object automatically (covered in `fastapi.request-response-models`).

### Practice

Given `@app.get("/orders/{order_id}/items/{item_id}")`, which two
function parameters does FastAPI need, and where do their values come
from? *(`order_id` and `item_id`, both parsed from the URL path itself.)*

---

## fastapi.request-response-models — Request/response models

**Target depth:** Use

### What Is It?

Request/response models in FastAPI are Pydantic classes that declare the
exact expected shape of a request's incoming JSON body and/or a
response's outgoing JSON body — field names, types, and which are
required.

### Mental Model

Think of a request/response model as a labeled template or form — it
specifies exactly which fields must be present, what type each one
should be, and FastAPI automatically checks incoming data against that
template and shapes outgoing data to match it.

**A request model tells FastAPI what incoming JSON must look like to be
accepted; a response model tells it what shape to send back out — both
declared once, as a class, not re-checked by hand in every route.**

### How It Works

```python
from pydantic import BaseModel

class OrderIn(BaseModel):
    product_id: int
    quantity: int

class OrderOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    status: str

@app.post("/orders", response_model=OrderOut)
def create_order(order: OrderIn):
    ...
```

FastAPI parses the incoming request body against `OrderIn`'s fields and
types (rejecting it with a 422 if it doesn't match —
`fastapi.pydantic-validation`), and shapes whatever the function returns
to match `OrderOut`'s declared fields before sending the response.

### Important Distinctions

- A request model (`OrderIn`) ≠ a response model (`OrderOut`) — they're
  often different shapes on purpose (a request might not include a
  server-generated `id` or `status`, which only exist in the response).
- Declaring `response_model` ≠ optional busywork — it also strips out any
  extra fields the handler's return value might accidentally include, so
  internal-only data never leaks into the API response by mistake.

### Why Does It Exist?

Without a declared shape, every route would need to manually check "does
this JSON have the fields I expect, with the right types" by hand —
repetitive and error-prone; declaring the shape once as a class lets the
framework enforce and document it automatically.

### Connections

- **Prerequisite (BLOCKING):** `backend.json`, `js.objects` (the
  conceptual shape these models describe), `fastapi.pydantic-validation`
  (the actual validation mechanism these models plug into).
- **Enables:** `fastapi.routes-endpoints`, `fastapi.api-docs` — these
  models are exactly what gets turned into the automatic API
  documentation.

### Production Appearance

A `models.py`/`schemas.py` file full of Pydantic classes, each
corresponding to one request or response shape, is a near-universal
FastAPI codebase pattern.

### Example

`UserCreate` (requires `email`, `password`) versus `UserOut` (has `id`,
`email`, but never `password` — deliberately excluded so a password hash
never appears in an API response).

### Practice

Why would a real codebase define `UserOut` without a `password` field,
even though the underlying database row has one? *(So the API response
never includes the password/hash at all — `response_model` only includes
the fields declared on it, which is a deliberate, structural way to
prevent sensitive data from ever leaking into a response, not something
that has to be remembered and hand-filtered in every route.)*

---

## fastapi.pydantic-validation — Pydantic & validation

**Target depth:** Use

### What Is It?

Pydantic is the data-validation library FastAPI uses under the hood — it
checks incoming data against a declared model's field types and
constraints, converting valid data into typed Python objects and raising
a structured validation error for anything that doesn't match.

### Mental Model

Think of Pydantic as a strict inspector at the door of every route — it
checks each piece of incoming data against the model's declared shape
before letting it through to the route's own logic; anything that fails
is turned away with a specific, itemized explanation of what was wrong.

**Pydantic validation happens automatically before your route's own code
ever runs — by the time your function body executes, the data is already
guaranteed to match the declared model, or the request never got that
far.**

### How It Works

```python
from pydantic import BaseModel, Field

class OrderIn(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)
```

A request body like `{"product_id": "abc", "quantity": -1}` fails
validation on two counts (`product_id` isn't a valid integer; `quantity`
isn't greater than 0) — FastAPI automatically returns a `422` with a
structured list of exactly which fields failed and why, without the
route function's own code ever running.

### Important Distinctions

- Pydantic validation ≠ the same as authorization or business-logic
  checks — it only verifies *shape and basic constraints*, not domain
  rules like "does this product actually exist" (those happen later, in
  the route's own logic).
- A field with a default value ≠ required — `quantity: int = 1` means the
  field is optional and defaults to 1 if omitted; a field with no default
  (like `product_id: int`) is required, and its absence is itself a
  validation failure.

### Why Does It Exist?

Manually writing "if not isinstance(data.get('quantity'), int): raise
error" for every field of every request would be enormous, repetitive
boilerplate; Pydantic generates that checking automatically from a
single, readable class definition, and produces a consistent,
well-structured error format across the entire API.

### Connections

- **Prerequisite (BLOCKING):** `fastapi.request-response-models` — the
  models Pydantic validates against.
- **Enables:** the validation stage of `backend.request-response-lifecycle`.
- **Related:** `js.error-handling`'s general "reject bad input
  explicitly" principle, applied server-side and automatically.

### Production Appearance

Any 422 response from a FastAPI backend, with a JSON body listing
specific field errors, is Pydantic validation rejecting a request before
the route's own code ran.

### Example

A request missing a required field entirely returns a 422 with a message
like `"field required"` pointing at exactly that field's location in the
request body.

### Practice

A request sends `{"product_id": 5}` to an endpoint expecting `OrderIn`
(which also requires `quantity`) — what happens, and does the route
function's own code ever run? *(FastAPI returns a 422 immediately,
listing `quantity` as a missing required field — the route function's
body never executes at all, since validation failed before the framework
calls it.)*

---

## fastapi.dependency-injection — Dependency injection

**Target depth:** Reason

*(Reproduced from `chain-2-request-lifecycle.md` — content unchanged.)*

### What Is It?

FastAPI's dependency injection is a mechanism where a route function
declares what it *needs* (a database session, the current authenticated
user, a set of validated query parameters) as a function parameter
wrapped in `Depends(...)`, and FastAPI calls the dependency function and
supplies the result automatically before running the route.

### Mental Model

Instead of each route function reaching out and constructing its own
database connection or checking auth itself, it just says "give me a `db`
session" as a parameter — like ordering from a menu instead of cooking
the ingredient yourself. FastAPI is the kitchen that prepares it and
hands it over.

**Dependency injection means a route *declares what it needs*, and the
framework supplies it — the route never constructs its own dependencies
by hand.**

### How It Works

```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(User).filter(User.id == user_id).first()
```

Before calling `get_user`, FastAPI calls `get_db()`, runs it up to its
`yield`, and passes the yielded value as `db`. After the route function
returns, FastAPI resumes `get_db()` past the `yield`, running its cleanup
(`db.close()`).

### Important Distinctions

- Dependency injection ≠ a direct import of a database module at the top
  of the file — direct import means the route is hard-wired to one
  specific implementation forever; DI means the *same route function* can
  be tested with a fake `get_db` substituted in, with zero changes to the
  route itself.
- A dependency that `yield`s (with setup/teardown) ≠ one that just
  `return`s (no cleanup needed, e.g. reading a header value).

### Why Does It Exist?

Route functions need shared resources (DB sessions, the authenticated
user, common validation) without each one reimplementing setup/teardown
and without becoming impossible to test in isolation. DI centralizes that
logic once and lets FastAPI wire it in wherever declared.

### Connections

- **Prerequisite (BLOCKING):** `fastapi.routes-endpoints`. Related to
  `backend.middleware` — both intercept a request before the route's own
  logic runs, though DI is per-route and middleware is global.
- **Enables:** the database-access step of
  `integration.trace-request-frontend-to-db`.
- **Related:** `backend.authn-vs-authz` — an "auth" dependency is the most
  common real-world use: `current_user: User = Depends(get_current_user)`.

### Production Appearance

Nearly every non-trivial route in a real FastAPI codebase has at least
one `Depends(...)` parameter — a DB session and/or the current user are
almost universal.

### Example

```python
def create_order(
    order: OrderIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    ...
```

The route body only has to worry about order logic; the session and the
authenticated user just arrive, already resolved.

### Trace

Request comes in for `GET /users/42`:

| Step | What happens |
|---|---|
| 1 | FastAPI matches the route, sees `db: Session = Depends(get_db)` |
| 2 | Calls `get_db()`, runs it to the `yield`, captures the session |
| 3 | Calls `get_user(user_id=42, db=<session>)` |
| 4 | Route body runs, queries the DB using that session |
| 5 | Route returns; FastAPI resumes `get_db()` past `yield`, closes the session |

### Common Misconceptions

- **"`Depends()` just means 'this parameter is optional'."** No relation
  to optionality — `Depends(...)` always marks "resolve this value by
  calling a dependency function," required or not.
- **"The dependency function runs once at startup and is reused for every
  request."** For most dependency scopes it runs fresh per request —
  that's exactly why a DB session is opened and closed each time, not
  held open forever.

### Practice

Two routes both need `db: Session = Depends(get_db)` — does FastAPI call
`get_db()` once and share the result across both, or once per route
call? *(Once per route call — each request gets its own session, which is
exactly why the session can't leak between unrelated requests.)*

### Code Reading

```python
def require_admin(user: User = Depends(get_current_user)):
    if not user.is_admin:
        raise HTTPException(403)
    return user

@app.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    ...
```

`require_admin` itself depends on `get_current_user` — what does that
tell you about whether dependencies can be layered on top of each other,
and why might a codebase prefer this over checking `user.is_admin` inline
inside every admin-only route?

### Mastery Check (Reason)

You're reading an unfamiliar FastAPI codebase and see a route with four
different `Depends(...)` parameters. Without reading their
implementations, what can you infer about what that route requires just
from their *names* (e.g. `db`, `current_user`, `rate_limiter`,
`feature_flag`) — and why is that discoverability itself a benefit of DI
over inline setup code scattered through the function body?

### Deeper / Deferred

FastAPI's dependency resolution/caching within a single request
(sub-dependencies shared across multiple `Depends()` calls in the same
request) — named, not required at this depth.

---

## fastapi.middleware — Middleware (FastAPI)

**Target depth:** Use

### What Is It?

Middleware in FastAPI is code registered to run on every request (or
every request matching certain criteria) before — and often after — the
specific route handler, implemented via `@app.middleware("http")` or by
adding a Starlette-compatible middleware class.

### Mental Model

This is the same generic concept as `backend.middleware`, wired into
FastAPI's specific mechanism — a function that wraps the entire
request-handling process, able to inspect/modify the request on the way
in and the response on the way out.

**FastAPI middleware is a function that sits around every route call — it
can act before the route runs, and again after, by choosing when to call
(or not call) the next step in the chain.**

### How It Works

```python
@app.middleware("http")
async def log_requests(request, call_next):
    start = time.time()
    response = await call_next(request)  # runs the rest of the pipeline, including the route
    duration = time.time() - start
    response.headers["X-Process-Time"] = str(duration)
    return response
```

`call_next(request)` is the pivot point — everything before it runs
before the route handler; everything after it runs after the route
handler has already produced a response, letting this middleware modify
that response (here, adding a timing header) before it's actually sent.

### Important Distinctions

- FastAPI middleware ≠ the same as a per-route `Depends()` — middleware
  applies to every request matching its registration, while a dependency
  is opted into per-route; middleware also wraps the *entire*
  request/response cycle (before and after), while a dependency only
  resolves before the route runs.
- Forgetting to call (or return the result of) `call_next` ≠ harmless —
  the route handler, and everything after it in the pipeline, simply
  never runs at all.

### Why Does It Exist?

Some behavior (request logging, adding CORS headers, timing every
request) needs to apply uniformly to the entire application without
being duplicated into every single route function — FastAPI's middleware
hook is where that global, wrap-the-whole-request behavior lives.

### Connections

- **Prerequisite (BLOCKING):** `backend.middleware` (the generic concept
  this implements), `fastapi.routes-endpoints`.
- **Related:** `fastapi.dependency-injection` — a narrower, per-route
  alternative for setup/teardown needs.

### Production Appearance

CORS configuration (`app.add_middleware(CORSMiddleware, ...)`) is the
single most common piece of middleware in a real FastAPI app, alongside
custom request-logging middleware.

### Example

FastAPI's built-in `CORSMiddleware` is added once at app startup and
then applies its cross-origin header logic to every single response,
without any individual route needing to know about it.

### Practice

A middleware function forgets to `return response` (or forgets to call
`call_next` at all) — what happens to every request that passes through
it? *(Every request effectively hangs or fails — without calling and
returning `call_next`'s result, the rest of the pipeline, including the
actual route handler, never runs and no proper response is ever
produced.)*

---

## fastapi.async-endpoints — Async endpoints

**Target depth:** Reason

### What Is It?

An async endpoint in FastAPI is a route handler defined with `async def`
instead of plain `def` — it runs on FastAPI's async event loop and can
`await` other async operations (database calls, HTTP requests to other
services) without blocking that worker from handling other requests in
the meantime.

### Mental Model

Think of `async def` route handlers as cooks who, when they hit a
waiting step, step aside and let the kitchen work on other orders,
coming back exactly when their own wait is over — versus a plain `def`
handler, which FastAPI runs in a separate thread pool specifically so it
*can* block without freezing the whole server.

**async def opts a route into the event loop directly — every await
inside it must actually be non-blocking, or you lose the entire benefit
and can make things worse.**

### How It Works

```python
@app.get("/users/{user_id}")
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one()
```

Because this handler is `async def` and uses an async-compatible
database driver, the `await db.execute(...)` line lets the event loop
(`js.event-loop`'s same architecture, `backend.sync-vs-async`) serve
other requests while this particular database query is in flight,
resuming this handler once it completes.

### Important Distinctions

- `async def` ≠ automatically non-blocking — if the code inside it calls
  a *synchronous*, blocking library without `await`, that call still
  blocks the entire event loop for its full duration, which is *worse*
  than a plain `def` route (FastAPI runs plain `def` routes in a separate
  thread pool specifically so a blocking call there doesn't freeze the
  main event loop).
- `async def` with nothing genuinely asynchronous inside it ≠
  meaningfully different in behavior from `def` — the benefit only
  exists when there's real I/O-bound waiting to interleave.

### Why Does It Exist?

FastAPI is built on Starlette/ASGI specifically to support this async
model, letting a single worker process handle many concurrent requests
that are mostly waiting on I/O far more efficiently than
one-thread-per-request would allow.

### Connections

- **Prerequisite (BLOCKING):** `backend.sync-vs-async`, `js.event-loop`,
  `js.async-await` — the same syntax and underlying model, different
  language.
- **Enables:** the async version of
  `integration.trace-request-frontend-to-db`'s database step.
- **Related:** `backend.api-vs-webhook-vs-websocket-vs-polling` — async's
  concurrency model is what makes handling many long-polling/WebSocket
  connections practical.

### Production Appearance

Seeing `async def` versus plain `def` on FastAPI route functions
throughout a real codebase, and checking whether the database/HTTP
libraries used inside them are actually async-compatible, is a genuine,
consequential thing to check when reading FastAPI code.

### Trace

Two concurrent requests hitting an `async def` route that awaits a 100ms
database query:

| Time | Event |
|---|---|
| 0ms | Request A arrives, starts `await db.execute(...)` |
| 0ms | Request A's await yields control back to the event loop |
| 1ms | Request B arrives, starts its own `await db.execute(...)` |
| 100ms | Request A's database query completes, A resumes and finishes |
| 101ms | Request B's database query completes, B resumes and finishes |

(Both were "in flight" concurrently on one worker — a plain synchronous
`def` handling A would have blocked B from even starting until A's query
finished.)

### Common Misconceptions

**"Marking every route `async def` is strictly better."** If the code
inside it isn't actually using async-compatible libraries with real
`await`s, `async def` provides no benefit and, worse, can turn one
accidentally-blocking call into something that stalls the entire event
loop rather than just one thread.

### Practice

A route is written as `async def` but internally calls a synchronous,
blocking `requests.get(url)` (no `await`, a blocking library) instead of
an async HTTP client — what's the practical consequence under concurrent
load? *(That blocking call freezes the entire event loop for its
duration, meaning *every* other concurrent request being handled by that
worker — not just this one — stalls too, which is worse than if this
route had been written as plain `def` and let FastAPI's thread pool
absorb the blocking call in isolation.)*

### Code Reading

```python
@app.get("/report")
def generate_report():  # plain def, not async
    data = fetch_from_slow_legacy_api()  # blocking, synchronous call
    return process(data)
```

Given that `fetch_from_slow_legacy_api` is blocking and synchronous, is
leaving this route as plain `def` (rather than `async def`) actually the
right call? *(Yes — FastAPI runs plain `def` routes in a separate thread
pool specifically so a blocking call like this one doesn't stall the main
async event loop; converting it to `async def` without also converting
the underlying call to something truly async would make things worse,
not better.)*

### Mastery Check (Reason)

Explain the general rule for choosing `async def` versus plain `def` for
a FastAPI route, in terms of whether every I/O operation inside it is
genuinely async-compatible — and why "when in doubt, make it async" is
actually bad advice given what you now know.

### Deeper / Deferred

FastAPI's exact thread-pool sizing and scheduling for synchronous `def`
routes, and ASGI server internals (Uvicorn/Hypercorn) — named, not
required at this depth.

---

## fastapi.api-docs — API documentation

**Target depth:** Understand

### What Is It?

FastAPI automatically generates interactive API documentation (an
OpenAPI/Swagger UI, typically at `/docs`, and a ReDoc-style view at
`/redoc`) directly from a project's route definitions and Pydantic
models — no separate documentation-writing step required.

### Mental Model

Think of it as FastAPI reading its own code (the routes, their
parameters, their request/response models) and continuously generating an
always-up-to-date, browsable reference and testing tool for the API —
rather than a hand-written document that can silently drift out of sync
with the actual code.

**FastAPI's docs aren't written separately and hoped to stay accurate —
they're generated directly from the same type annotations and Pydantic
models that actually validate requests, so they can't drift out of sync
with the real behavior.**

### How It Works

Visiting `/docs` on a running FastAPI app shows every registered route,
grouped and described, with its expected request body shape (from its
Pydantic model), possible responses, and a "Try it out" button that sends
a real request directly from the browser; this is built from the OpenAPI
schema FastAPI generates automatically from the route decorators, type
hints, and Pydantic models already in the code.

### Important Distinctions

- This generated documentation ≠ something a developer writes by hand in
  a separate file — it's derived directly from the same models and route
  definitions (`fastapi.request-response-models`) that actually run in
  production, which is precisely what keeps it accurate.
- Field descriptions/examples in the docs ≠ automatic beyond the
  basics — richer documentation (human-written descriptions of what a
  field means, example values) requires deliberately adding them via
  Pydantic's `Field(description=..., examples=...)` or docstrings;
  FastAPI doesn't invent meaningful prose on its own.

### Why Does It Exist?

Hand-maintained API documentation reliably drifts out of sync with the
actual code as an API evolves; generating docs directly from the same
source of truth the framework already uses for validation guarantees the
documentation can never describe a request shape the API doesn't
actually accept.

### Connections

- **Prerequisite:** `fastapi.routes-endpoints`, `fastapi.request-response-models`.
- **Related:** `compare.fastapi-vs-flask-vs-django` — automatic docs
  generation is frequently cited as one of FastAPI's practical advantages
  over frameworks without this built in.

### Production Appearance

Visiting `<api-base-url>/docs` on virtually any FastAPI-based backend is
often the fastest way to explore an unfamiliar API's actual available
endpoints and expected request shapes, without reading the route source
files directly.

### Example

Adding a new `POST /orders` route with an `OrderIn` Pydantic model
automatically makes that endpoint, its exact required fields, and their
types appear in `/docs` — with zero additional documentation work.

### Practice

If a Pydantic model's field is renamed in the code, does the `/docs` page
need a separate manual update to reflect that change? *(No — since the
documentation is generated directly from the model's current definition
every time the docs page is loaded, the rename is reflected
automatically.)*
