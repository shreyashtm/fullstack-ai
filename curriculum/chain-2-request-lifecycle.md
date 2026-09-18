# Cross-technology chain 2 — HTTP → REST → FastAPI routing → dependency injection → PostgreSQL

Concepts, in dependency order: `backend.http-basics` (Understand) →
`backend.rest-apis` (Use) → `fastapi.routes-endpoints` (Use) →
`fastapi.dependency-injection` (Reason) → `pg.crud-statements` (Use) →
`integration.trace-request-frontend-to-db` (Reason, the capstone that
walks the whole chain as one trace). Depth is intentionally uneven —
`backend.http-basics` is genuinely simpler than `fastapi.dependency-injection`,
and forcing both to the same depth would either pad the simple one or
under-serve the hard one.

---

## backend.http-basics — HTTP basics

**Target depth:** Understand

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

## fastapi.routes-endpoints — Routes & endpoints

**Target depth:** Use

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

```py
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

## fastapi.dependency-injection — Dependency injection

**Target depth:** Reason

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

```py
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

```py
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

```py
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

## pg.crud-statements — SELECT, INSERT, UPDATE, DELETE

**Target depth:** Use

### What Is It?

CRUD statements are the four core SQL operations on a table's rows:
`SELECT` (read), `INSERT` (create), `UPDATE` (modify), `DELETE` (remove).

### Mental Model

Think of a table as a spreadsheet; `SELECT` is looking at rows, `INSERT`
is adding a new row, `UPDATE` is editing cells in existing rows (matched
by a condition), `DELETE` is removing rows (matched by a condition) —
`UPDATE`/`DELETE` without a `WHERE` clause act on every row, which is the
single most common expensive SQL mistake.

**SELECT reads, INSERT adds, UPDATE and DELETE both require a WHERE to
avoid touching the entire table.**

### How It Works

```sql
SELECT id, name FROM users WHERE id = 42;
INSERT INTO users (name, email) VALUES ('Ada', 'ada@example.com');
UPDATE users SET name = 'Ada L.' WHERE id = 42;
DELETE FROM users WHERE id = 42;
```

Each statement names the table, and `SELECT`/`UPDATE`/`DELETE` use
`WHERE` to scope which rows are affected.

### Important Distinctions

- `UPDATE`/`DELETE` with no `WHERE` ≠ a syntax error — it's valid SQL that
  silently affects every row in the table.
- `INSERT` ≠ `UPDATE` — inserting a row with an existing primary key
  raises a constraint error rather than overwriting it (that's what
  `UPDATE`, or an explicit "upsert," is for).

### Why Does It Exist?

Every relational database needs a minimal, universal vocabulary for
manipulating rows; these four verbs cover the complete set of ways an
application changes or reads persisted data.

### Connections

- **Prerequisite:** `pg.sql-basics`.
- **Enables:** `pg.joins`, `pg.transactions`, and directly, the database
  step of `integration.trace-request-frontend-to-db`.
- **Related:** `bq.analytical-sql` — BigQuery reuses `SELECT`'s syntax,
  but rarely `INSERT`/`UPDATE`/`DELETE` in the same row-by-row way (see
  `bq.postgres-vs-bigquery`).

### Production Appearance

This is what an ORM (like SQLAlchemy, used under FastAPI) generates
underneath calls like `db.query(User).filter(...)` or
`db.add(new_user)` — reading real backend code often means recognizing
which CRUD operation a higher-level ORM call actually compiles down to.

### Example

`db.query(User).filter(User.id == user_id).first()` in the
`fastapi.dependency-injection` trace above compiles to roughly
`SELECT * FROM users WHERE id = 42 LIMIT 1;`.

### Practice

What SQL does `db.query(Order).filter(Order.status ==
'cancelled').delete()` most likely generate, and what's the one clause
that makes it safe rather than catastrophic? *(`DELETE FROM orders WHERE
status = 'cancelled';` — safe specifically because of the `WHERE`.)*

---

## integration.trace-request-frontend-to-db — Trace: frontend → backend → database

**Target depth:** Reason (capstone)

### What Is It?

This concept is the full, ordered trace of a single request as it travels
from a frontend action through the network, into a FastAPI route, through
its dependencies, into the database, and back out as a rendered UI
update.

### Mental Model

Think of it as following one specific letter through an entire postal
system, at every intermediate office, rather than treating "call the API"
and "the API responds" as two opaque black boxes.

**Every layer this chain has taught individually — HTTP, REST, routing,
dependency injection, SQL — is one continuous pipe; a bug can live at any
single joint, so tracing the whole thing is a debugging skill, not just a
diagram.**

### How It Works — the full chain

1. User clicks "Save" in a Next.js component (`react.fundamentals`,
   `next.data-fetching`).
2. The browser sends an HTTP request (`backend.http-basics`) — e.g.
   `PATCH /orders/103` — shaped as a REST call (`backend.rest-apis`).
3. FastAPI matches the path to a route function (`fastapi.routes-endpoints`).
4. Before the route body runs, its declared dependencies resolve — a DB
   session, the authenticated user (`fastapi.dependency-injection`).
5. The route body executes business logic and issues a CRUD statement
   against Postgres (`pg.crud-statements`) — here, an `UPDATE`.
6. Postgres commits the change (possibly inside a transaction,
   `pg.transactions`, if multiple statements must succeed or fail
   together) and returns the updated row.
7. The route function returns a Python object; FastAPI serializes it to
   JSON and sends an HTTP response with a status code
   (`backend.http-methods-status-codes`).
8. The frontend receives the response and updates component state,
   triggering a re-render.

### Important Distinctions

A bug that looks like "the frontend is broken" (nothing updates) can
originate at *any* of the 8 steps above — a wrong status code, a
validation failure at step 4, a missing `WHERE` at step 5, or a frontend
state bug at step 8 all present identically as "nothing happened."
Tracing beats guessing.

### Why Does It Exist (as a skill, not a mechanism)

Reading and debugging an unfamiliar codebase requires being able to
follow one concrete action all the way through the stack, rather than
knowing each layer only in isolation — this is precisely the
"codebase-ready" goal from the curriculum's stated objective.

### Connections

This concept doesn't introduce new mechanism — it's the explicit
Connections diagram for this chain, tying together `backend.http-basics`
→ `backend.rest-apis` → `fastapi.routes-endpoints` →
`fastapi.dependency-injection` → `pg.crud-statements`, and forward into
`backend.http-methods-status-codes` and `next.data-fetching` on the way
back out.

### Production Appearance

This is exactly the exercise of opening a browser's Network tab, finding
a failed or unexpected API call, then opening the backend codebase and
following that exact route function down to its SQL — the single most
common real debugging workflow on this stack.

### Trace (worked, concrete)

"Cancel order #103":

| Step | Layer | What happens |
|---|---|---|
| 1 | Next.js component | `onClick` calls `fetch('/api/orders/103', {method: 'PATCH', body: {status: 'cancelled'}})` |
| 2 | HTTP | Browser sends a PATCH request with a JSON body |
| 3 | FastAPI routing | Matches `@app.patch("/orders/{order_id}")` |
| 4 | Dependency injection | Resolves `db` session and `current_user` |
| 5 | Business logic | Checks `current_user` owns order 103, then updates it |
| 6 | Postgres | `UPDATE orders SET status = 'cancelled' WHERE id = 103;` inside a transaction |
| 7 | Response | FastAPI returns the updated order as JSON with `200 OK` |
| 8 | Frontend | Component re-renders showing "Cancelled" |

### Common Misconceptions

**"If the UI doesn't update, the bug is in the frontend."** The fastest
way to find out is to check the Network tab first: did the request even
leave? What status came back? Only then look at frontend state logic.

### Mastery Check (Reason)

A request to cancel an order returns `200 OK`, but the order still shows
as active on refresh. Using the 8-step trace, list the three most likely
single points of failure, in the order you'd actually check them, and why
that order is efficient.

### Deeper / Deferred

Connection pooling and how a single FastAPI process serves many
concurrent requests against a shared, limited pool of DB connections —
named, not required at this depth.
