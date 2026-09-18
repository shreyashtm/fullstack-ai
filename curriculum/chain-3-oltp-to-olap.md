# Cross-technology chain 3 — PostgreSQL (OLTP) → data pipeline → BigQuery (OLAP)

Concepts, in dependency order: `pg.transactions` (Reason) →
`integration.app-to-analytics-data-flow` (Reason) → `bq.analytical-sql`
(Use) → `bq.postgres-vs-bigquery` (Reason, the comparison anchor that
closes the loop). `pg.crud-statements` is a shared prerequisite already
fully authored in `chain-2-request-lifecycle.md` — not repeated here.

---

## pg.transactions — Transactions

**Target depth:** Reason

### What Is It?

A transaction is a group of one or more SQL statements executed as a
single all-or-nothing unit — either every statement in it succeeds and is
committed, or (on any failure) all of them are rolled back as if none had
happened.

### Mental Model

Think of a transaction as an envelope around several statements with a
single wax seal — you can't half-open it; either the whole envelope's
contents take effect, or none do.

**A transaction makes several statements behave like one — atomic, so a
failure partway through leaves the database exactly as it was before any
of them ran.**

### How It Works

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

If the second `UPDATE` fails for any reason (a constraint violation, a
crash), Postgres discards the first `UPDATE`'s effect too —
`ROLLBACK` instead of `COMMIT`. Without wrapping both statements in a
transaction, a crash between them would leave $100 deducted from account
1 but never added to account 2.

### Important Distinctions

- A transaction ≠ a performance optimization — it's a correctness
  guarantee (the "A" in ACID: atomicity), not primarily a speed feature.
- `COMMIT` ≠ automatic — outside an explicit transaction block, most
  drivers auto-commit each statement individually, which is exactly the
  unsafe case the example above avoids.

### Why Does It Exist?

Real operations often require multiple statements to succeed together
(transferring money between two rows, creating an order and decrementing
inventory) — without transactions, a crash or error mid-sequence could
leave the database in an inconsistent, half-updated state with no way to
detect or repair it automatically.

### Connections

- **Prerequisite:** `pg.crud-statements` (see `chain-2-request-lifecycle.md`).
- **Enables:** `integration.app-to-analytics-data-flow` — OLTP systems
  like Postgres are optimized for exactly this kind of frequent, small,
  transactional write, the defining trait BigQuery's OLAP model
  deliberately trades away (see `bq.postgres-vs-bigquery`).

### Production Appearance

Any operation touching more than one table that must succeed or fail
together — placing an order (create order row + decrement stock row), a
money transfer, a user signup that also creates a related profile row.

### Example

The "cancel order" trace in `integration.trace-request-frontend-to-db`
(chain 2) step 6 is itself typically wrapped in a transaction if
cancelling also needs to restore inventory in a second table.

### Common Misconceptions

**"Wrapping everything in a transaction is always safer, so just do it
everywhere."** Long-running transactions hold locks and can block other
queries; transactions should scope exactly the statements that truly need
to succeed together, not the whole request handler by habit.

### Practice

An order-cancellation flow updates the order's status AND increments a
product's stock count, in two separate `UPDATE` statements. Without a
transaction, what specific failure mode becomes possible if the second
statement fails? *(The order shows cancelled but stock was never
restored — a permanently inconsistent state.)*

### Mastery Check (Reason)

Explain, in terms of atomicity, why a data pipeline reading from Postgres
for analytics (next concept) needs to worry about *which* rows are safe
to read — specifically, rows from a transaction that hasn't committed
yet.

### Deeper / Deferred

Isolation levels and MVCC (how Postgres lets concurrent transactions see
consistent snapshots without blocking each other) — named, not required
at this depth.

---

## integration.app-to-analytics-data-flow — App → analytics data flow

**Target depth:** Reason

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
- **Enables:** `bq.analytical-sql`.
- This concept is chain 3's core: OLTP (`pg.*`) → this pipeline → OLAP
  (`bq.*`).

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

## bq.analytical-sql — Running analytical SQL queries

**Target depth:** Use

### What Is It?

Analytical SQL queries are `SELECT` statements (reusing standard SQL
syntax) run against BigQuery, typically aggregating over very large
numbers of rows — `COUNT`, `SUM`, `AVG`, `GROUP BY` over
millions/billions of rows — rather than looking up a handful of rows by
id.

### Mental Model

The syntax looks like the `SELECT` you already know from Postgres, but
the *shape* of the query is different — instead of "get me this one
row," it's "summarize this entire column across everything."

**Analytical SQL asks summary questions over huge historical datasets,
not lookup questions over the current state of one row.**

### How It Works

```sql
SELECT DATE(created_at) AS day, COUNT(*) AS orders, SUM(total) AS revenue
FROM `project.dataset.orders`
WHERE created_at >= '2026-01-01'
GROUP BY day
ORDER BY day;
```

BigQuery scans the relevant columns across a massive dataset (aided by
partitioning, `bq.partitioning-clustering`) and aggregates rather than
fetching individual rows.

### Important Distinctions

`bq.analytical-sql` ≠ `pg.crud-statements`'s `SELECT` in execution shape —
Postgres's `SELECT ... WHERE id = 42` is optimized to fetch one row fast
via an index; BigQuery's aggregate queries are optimized to scan and
summarize huge column ranges, and don't benefit from row-level indexes
the same way at all.

### Why Does It Exist?

Business questions ("what were last month's trends by region") are
fundamentally aggregate questions over historical volume, not single-row
lookups — a query engine built for that shape needs different internals
than one built for fast individual transactions.

### Connections

- **Prerequisite:** `pg.sql-basics` (syntax transfers),
  `integration.app-to-analytics-data-flow` — this is where the moved
  data ends up being queried.
- **Related:** `bq.partitioning-clustering` — how these large scans stay
  affordable and fast.

### Production Appearance

Dashboards, scheduled reports, and any "trend over time" feature in a
product are backed by queries shaped like the example above.

### Practice

Would `SELECT * FROM orders WHERE id = 42` (a single-row lookup) be a
typical BigQuery query, or is it a sign someone is using the wrong tool
for the job? *(A sign of the wrong tool — that's exactly
`pg.crud-statements`'s job, not an analytical warehouse's.)*

---

## bq.postgres-vs-bigquery — PostgreSQL vs BigQuery

**Target depth:** Reason

### What Is It?

A comparison between Postgres (a row-oriented, transactional — OLTP —
relational database) and BigQuery (a column-oriented, analytical — OLAP —
data warehouse), covering when each is the right tool.

### Mental Model

Postgres is built to change one row correctly, fast, right now, many
times a second. BigQuery is built to scan billions of rows and summarize
them, and doesn't expect to be updated row-by-row at that same frequency
at all.

**OLTP (Postgres) optimizes for many small transactional writes and
lookups; OLAP (BigQuery) optimizes for large aggregate reads over
historical data — picking the wrong one for the job is the actual
mistake, not either tool being universally better.**

### How It Works — the concrete differences

Postgres stores data row-by-row on disk (fast to fetch one whole row);
BigQuery stores data column-by-column (fast to scan one column across
billions of rows while ignoring the others). Postgres enforces
transactions and constraints tightly per write (`pg.transactions`,
`pg.constraints`); BigQuery is built for large batch/streaming loads, not
per-row transactional writes.

### Important Distinctions

**"BigQuery is just a bigger, faster Postgres."** False — they're
optimized for opposite access patterns, and using BigQuery for frequent
single-row updates, or Postgres for billion-row aggregate scans, will
both perform badly and likely cost more.

### Why Does It Exist (as a distinction to hold onto)

A team that doesn't distinguish these will eventually either bottleneck
their live app with analytical queries or pay far more than necessary
running transactional-style single-row logic against a warehouse billed
for scanned bytes.

### Connections

This is chain 3's explicit comparison anchor, connecting
`pg.relational-fundamentals` and `bq.what-is-a-data-warehouse`. Related —
`dbconcepts.sql-vs-nosql`, a parallel "pick the right tool" comparison one
module over.

### Production Appearance

Architecture decisions and system diagrams that show "the app talks to
Postgres; a pipeline feeds BigQuery for analytics" — exactly the shape of
`integration.app-to-analytics-data-flow`.

### Common Misconceptions

**"Since BigQuery uses SQL too, I can just point my app at it instead of
Postgres."** The query language being familiar doesn't mean the
underlying engine suits the app's access pattern.

### Mastery Check (Reason)

A new feature needs to show a user their own order history (a handful of
rows, looked up by user id, needs to be fast and always current) — which
database, and why, using the OLTP/OLAP distinction rather than "because
that's what we already use"?

### Deeper / Deferred

The specifics of BigQuery's distributed columnar execution engine —
named, not required at this depth.
