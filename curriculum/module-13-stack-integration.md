# Module 13 — Stack Integration & Code Reading (`integration.*`)

Full concept content for all 4 concepts in `02-curriculum-model.md`'s
Stack Integration module, in curriculum order. Two were already
authored (`chain-2-request-lifecycle.md`, `chain-3-oltp-to-olap.md`) and
are reproduced verbatim here (if edited, edit both copies together).

---

## integration.how-the-stack-fits-together — How NextJS, FastAPI, PostgreSQL, BigQuery and GCP fit together

**Target depth:** Reason

### What Is It?

A direct restatement and extension of `gcparch.overall-system-architecture`'s
assembled picture, now explicitly framed around this module's own stated
goal — understanding how NextJS, FastAPI, PostgreSQL, BigQuery, and GCP
specifically fit together — not as a new architecture, but as the entry
point into this module's tracing and code-reading practice.

### Mental Model

Think of `gcparch.overall-system-architecture` as the completed
blueprint, and this concept as picking that blueprint back up
specifically to *use* it — walking through it once more, this time as
preparation for the hands-on tracing and code-reading exercises the rest
of this module builds on.

**This isn't new architecture — it's the same assembled system from
Module 12, revisited as the direct on-ramp into tracing real requests
and reading a real project's structure.**

### How It Works

The five pieces, restated as one connected chain:

Next.js (frontend, `next.*`) → HTTP request (`backend.*`) → FastAPI
(backend, `fastapi.*`) → PostgreSQL (operational data, `pg.*`, via
`gcp.cloud-sql`) → (separately) a pipeline into BigQuery (analytical
data, `bq.*`) → all deployed and connected via GCP (`gcparch.*`).

### Important Distinctions

This concept ≠ `gcparch.overall-system-architecture` under a different
name — that concept's job was assembling the picture for the first time;
this concept's job is treating that same picture as a working tool,
immediately put to use in the next three concepts of this module.

### Why Does It Exist?

The curriculum's stated goal for this module is explicitly "understand
how NextJS, FastAPI, PostgreSQL, BigQuery and GCP fit together" — worth
restating directly, in the module's own words, as the anchor the
module's tracing and code-reading work hangs off of, rather than
assuming the Module 12 capstone alone carries that weight forward
silently.

### Connections

- **Prerequisite (BLOCKING):** `gcparch.overall-system-architecture`.
- **Enables:** `integration.trace-request-frontend-to-db`,
  `integration.app-to-analytics-data-flow`,
  `integration.representative-project-structure` — this module's other
  three concepts.

### Production Appearance

This is the mental checklist an engineer runs through when opening an
entirely unfamiliar full-stack repository for the first time — "where's
the frontend, where's the backend, where's the data, how are they
deployed" — before diving into any specific file.

### Practice

Without checking any other module, can you name, in order, the five
technology pieces a request touches from a user's click to that data
eventually appearing in an analytics dashboard? *(Next.js → FastAPI →
PostgreSQL → (pipeline) → BigQuery, with GCP underlying how each piece is
actually deployed and connected.)*

---

## integration.trace-request-frontend-to-db — Trace: frontend → backend → database

**Target depth:** Reason

*(Reproduced from `chain-2-request-lifecycle.md` — content unchanged.)*

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
Connections diagram tying together `backend.http-basics` →
`backend.rest-apis` → `fastapi.routes-endpoints` →
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

---

## integration.app-to-analytics-data-flow — App → analytics data flow

**Target depth:** Reason

*(Reproduced from `chain-3-oltp-to-olap.md` — content unchanged.)*

### What Is It?

This is the path data takes from an application's live operational
database (OLTP, optimized for many small transactional reads/writes —
Postgres) into an analytical data warehouse (OLAP, optimized for large
aggregate queries over historical data — BigQuery), typically via a
periodic or streaming pipeline.

### Mental Model

Think of Postgres as a store's cash register — fast, transactional,
handling one sale at a time — and BigQuery as the head office's
end-of-quarter sales report — built by pulling data *out* of thousands of
registers and reshaping it for "what were our trends," not "what's in
this one register right now."

**The app never queries BigQuery directly for its live behavior, and
analytics never reads Postgres directly for reporting at scale — a
pipeline moves data from one system, shaped for the other.**

### How It Works

A pipeline (batch, e.g. nightly, or streaming) extracts rows from
Postgres tables, transforms them (reshaping, joining, aggregating, or
just copying), and loads them into BigQuery datasets/tables, where
analysts or dashboards run large aggregate SQL queries (`bq.analytical-sql`)
that would be slow or disruptive to run directly against the live
transactional database.

### Important Distinctions

- This pipeline ≠ replication in the sense of keeping two databases
  identical — the loaded data is often reshaped (denormalized,
  aggregated) for analytical query patterns, not a 1:1 copy.
- The app's live correctness (transactions, `pg.transactions`) ≠ the
  analytics layer's concern — by the time data reaches BigQuery,
  transactional guarantees have already done their job upstream.

### Why Does It Exist?

Running heavy analytical queries (scanning millions of historical rows
for a trend report) directly against the same database serving live user
transactions would compete for the same resources and risk slowing down
or locking the production app — separating the two lets each system be
optimized for its own workload.

### Connections

- **Prerequisite (BLOCKING):** `pg.transactions` — you need to know
  Postgres holds the authoritative, correctness-guaranteed live data
  before understanding why a pipeline exists to move it. Also
  `bq.what-is-a-data-warehouse`.
- **Enables:** `bq.analytical-sql`. This is the OLTP (`pg.*`) → this
  pipeline → OLAP (`bq.*`) chain.

### Production Appearance

Look for a scheduled job, an ETL/ELT tool, or a managed connector in a
real stack's infrastructure config — that's the pipeline; it's rarely
visible from the application code itself, which is exactly why it's easy
to forget it exists.

### Common Misconceptions

**"The analytics dashboard shows real-time data."** Most pipelines run on
a delay (minutes to a day); assuming a BigQuery-backed dashboard reflects
the current instant is a common, costly misunderstanding when debugging
"why doesn't this new order show up yet."

### Practice

A product manager asks why a sale made 30 seconds ago isn't showing in
the analytics dashboard yet — using what this pipeline actually does,
what's the most likely explanation? *(The pipeline hasn't run/synced
yet — it's not a bug, it's the expected lag of a batch or near-real-time
pipeline.)*

### Mastery Check (Reason)

Explain why an engineer would be wrong to add a feature that has the live
application query BigQuery directly on every page load for a
user-facing number, instead of querying Postgres.

### Deeper / Deferred

Specific pipeline tooling (e.g. managed connectors, streaming vs. batch
ETL frameworks) — named, not required at this depth; this concept teaches
the pattern, not a specific tool.

---

## integration.representative-project-structure — Go through a representative project structure

**Target depth:** Use

### What Is It?

A single, representative full-stack project layout — extending
`revA.basic-project-structure-walkthrough`'s Phase-A-only version with
the database and cloud pieces now covered — showing where a Next.js
frontend, a FastAPI backend, database migrations, and GCP deployment
configuration typically all live relative to each other in one real
repository.

### Mental Model

Think of this as the completed floor plan, picking up exactly where
`revA.basic-project-structure-walkthrough` left off — that walkthrough
showed the frontend/backend rooms; this one adds the basement (the
database) and the building's utilities and address (deployment/cloud
config).

### How It Works

An extended representative layout:

```
project/
  frontend/                    # Next.js app
    app/
    components/
  backend/                     # FastAPI app
    app/
      main.py
      routers/
      models.py
      database.py
    alembic/                   # database migrations
      versions/
  infra/                       # deployment/cloud config
    Dockerfile.frontend
    Dockerfile.backend
    cloudbuild.yaml
  .env.example                 # documents expected env vars, not real secrets
```

The `alembic/versions/` folder (or an equivalent migration tool) holds
the history of schema changes to the Postgres database
(`pg.tables-rows-columns`, `dbconcepts.basic-db-design`); `infra/` holds
the `Dockerfile`s and CI/CD config that implement `gcparch.app-deployment`.

### Important Distinctions

- This layout ≠ the only correct one (same caveat as
  `revA.basic-project-structure-walkthrough`) — but the *categories*
  (frontend code, backend code, migrations, deployment config) reliably
  exist in some form across almost any real full-stack repository, even
  when named or organized differently.
- A `.env.example` file ≠ containing real secrets — it documents which
  environment variables/secrets a deployment needs (by name), without
  containing actual values, consistent with `gcparch.env-vars-secrets`'s
  separation of plain config from Secret Manager-held values.

### Why Does It Exist?

Extending the earlier, Phase-A-only project structure walkthrough with
the database and deployment pieces gives the complete "where do I look
for X" map the curriculum's stated codebase-readiness goal actually
requires — the Phase A version was deliberately partial, this one
completes it.

### Connections

- **Prerequisite (BLOCKING):** `revA.basic-project-structure-walkthrough`,
  `gcparch.app-deployment`, `dbconcepts.basic-db-design`.
- **Enables:** `integration.trace-request-frontend-to-db` (this layout is
  where that trace's actual code lives), `revB.full-review`.

### Production Appearance

This is literally the exercise of cloning an unfamiliar full-stack
repository and spending the first ten minutes orienting — finding the
frontend, the backend, the migrations folder, and the deployment config,
before reading any actual business logic.

### Code Reading

Given the layout above, a bug report says "orders created today aren't
showing up in this week's analytics dashboard" — which folder would you
check first, and why might the issue not be in `backend/` at all?
*(Check whether the analytics pipeline (feeding BigQuery from Postgres,
`integration.app-to-analytics-data-flow`) has actually run recently —
this bug's most likely cause is pipeline lag, not a bug in `backend/`'s
order-creation code, a different kind of failure than the
request/response bugs `revA.frontend-api-backend-connection`'s trace
covers.)*

### Practice

In the layout above, where would you look to understand what the
`orders` table's actual current column structure is, without connecting
to a live database? *(`backend/alembic/versions/` — reading through the
migration history (or the most recent migration) shows the table's
structure as defined in code, without needing live database access.)*
