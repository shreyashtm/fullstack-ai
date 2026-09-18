# Module 10 — BigQuery (`bq.*`)

Full concept content for all 6 concepts in `02-curriculum-model.md`'s
BigQuery module, in curriculum order. Two were already authored in
`chain-3-oltp-to-olap.md` and are reproduced verbatim here (if either is
edited later, edit both copies together).

---

## bq.what-is-a-data-warehouse — What is a data warehouse?

**Target depth:** Understand

### What Is It?

A data warehouse is a database system specifically designed to store
large volumes of historical data from multiple sources and support fast,
large-scale analytical queries (aggregations, trends over time) — as
opposed to a transactional (OLTP) database built for fast, frequent,
small reads/writes of current operational data.

### Mental Model

Think of a data warehouse as a company's archive and reporting
library — data is copied in from many operational sources (the live
app's database, third-party tools, logs) and reorganized specifically to
make "summarize everything across the last two years" fast, even though
it might be relatively slow (and isn't meant) to update a single record.

**A data warehouse isn't where an application's live data lives — it's
where copies of that data (and data from other sources) get
consolidated, specifically to make large-scale analysis fast.**

### How It Works

Operational systems (a Postgres-backed app, a marketing tool, a support
system) each hold their own current, live data; a pipeline
(`integration.app-to-analytics-data-flow`) periodically extracts and
loads relevant data from all of them into the warehouse, often reshaping
it along the way (denormalizing, aggregating) for the kinds of broad,
historical queries analysts and dashboards actually run.

### Important Distinctions

- A data warehouse ≠ a backup or a replica of an operational
  database — it's reorganized and consolidated from potentially many
  sources, not a 1:1 copy of any single one of them.
- A data warehouse ≠ meant to be queried by the live application for its
  own operational behavior — querying it for a single user-facing
  request would be slow and is the wrong tool for that job (that's
  `pg.crud-statements` territory).

### Why Does It Exist?

Answering business questions that span large volumes of historical data,
often from multiple different source systems, requires a different
structure and different query patterns than any single operational
database is built for; consolidating that data once, in a system
optimized for exactly this kind of query, is far more effective than
trying to run those queries against live operational systems directly.

### Connections

- **Prerequisite:** `pg.relational-fundamentals`,
  `integration.app-to-analytics-data-flow` — the mechanism that gets
  data into a warehouse in the first place.
- **Enables:** `bq.architecture-use-cases` — BigQuery is one concrete
  data warehouse implementation.

### Production Appearance

A company's "analytics" or "data" team working primarily in a data
warehouse (BigQuery, Snowflake, Redshift), separate from the engineering
team's operational Postgres database, is the typical real-world split
this concept describes.

### Example

A retail company's data warehouse combines sales data from its
Postgres-backed e-commerce app, marketing spend from an ad platform's
export, and support ticket data from a helpdesk tool — letting an
analyst ask "what's the relationship between marketing spend and support
ticket volume" in one place, something no single source system could
answer alone.

### Practice

Would it make sense for a live checkout page to query a data warehouse
directly to check "is this specific item currently in stock"? *(No —
that's a fast, current-state, single-record lookup, exactly what an
operational database like Postgres is built for; a data warehouse is
optimized for large historical/aggregate queries, not fast single-record
lookups.)*

---

## bq.architecture-use-cases — BigQuery architecture & use cases

**Target depth:** Understand

### What Is It?

BigQuery is Google Cloud's serverless, fully-managed data warehouse —
built on a columnar storage architecture (storing data column-by-column
rather than row-by-row) and a distributed query engine that automatically
scales to scan very large datasets, with no servers for the user to
provision or manage.

### Mental Model

Think of BigQuery as ordering a massive, elastic computing job on demand
rather than owning and maintaining your own warehouse's machinery — you
just submit a query, and Google's infrastructure automatically allocates
however much compute is needed to scan the relevant data and return a
result, then releases it.

**BigQuery is serverless — there's no cluster to size or manage; you
write a query, BigQuery figures out how much compute to throw at it, and
you're billed mainly for the data scanned.**

### How It Works

Data is organized into datasets (a container, roughly analogous to a
database/schema) and tables within them; BigQuery stores each column of
a table separately on disk (columnar storage), which is what makes it
fast to scan just the columns a query actually needs across billions of
rows, rather than reading whole rows just to use one or two fields
(`bq.postgres-vs-bigquery`'s row-vs-column storage distinction). Queries
are distributed automatically across many machines behind the scenes.

### Important Distinctions

- "Serverless" ≠ "no infrastructure exists" — there are still servers,
  but Google manages and scales them automatically; the user never
  provisions, sizes, or maintains a cluster themselves, unlike a
  traditional self-managed data warehouse.
- BigQuery's typical use case ≠ the same as a typical Postgres use
  case — it's built for large-scale analytical (OLAP) queries, not the
  fast, frequent, small transactional (OLTP) operations Postgres
  handles.

### Why Does It Exist?

Traditional data warehouses often required provisioning and managing a
fixed-size cluster, which meant either paying for idle capacity or
hitting a ceiling under heavy analytical load; BigQuery's serverless,
automatically-scaling architecture removes that capacity-planning burden
entirely.

### Connections

- **Prerequisite (BLOCKING):** `bq.what-is-a-data-warehouse`.
- **Enables:** `bq.datasets-tables`, `bq.analytical-sql`,
  `gcp.iam-permissions` — BigQuery access is governed by the same GCP
  IAM system covered in Module 11.

### Production Appearance

A GCP project's BigQuery console showing datasets and tables, and
queries billed by the amount of data scanned rather than by a reserved
server's uptime, are the concrete signals of this architecture in
practice.

### Example

An analyst running a query that scans a 2-terabyte table returns results
in seconds, without anyone having provisioned a specific-sized cluster to
handle that particular query's load — BigQuery allocated the needed
compute automatically, for that query alone.

### Practice

Why might a traditional, fixed-size self-managed data warehouse struggle
with an unpredictable, occasionally massive analytical query that a
serverless system like BigQuery handles smoothly? *(A fixed-size cluster
caps how much compute is available regardless of a given query's actual
needs — it's either over-provisioned (wasting cost most of the time) or
under-provisioned (too slow for occasional large queries); BigQuery's
automatic scaling avoids having to make that tradeoff up front.)*

---

## bq.datasets-tables — Datasets & tables

**Target depth:** Use

### What Is It?

In BigQuery, a dataset is a top-level container (roughly analogous to a
schema or database in Postgres) that holds tables, and access permissions
are typically granted at the dataset level; a table within a dataset
holds the actual columnar data, with its own defined schema (column
names and types).

### Mental Model

Think of a BigQuery project as a filing cabinet, a dataset as one
labeled drawer in that cabinet, and a table as one specific folder
inside that drawer — permissions are commonly granted per drawer
(dataset), and each folder (table) has its own defined structure.

**A dataset groups related tables together and is the usual unit for
setting access permissions; a table is where the actual rows and columns
of data live, referenced as `project.dataset.table`.**

### How It Works

A table is referenced in a query using its fully-qualified path —
`` `my-project.sales_data.orders` `` — project, then dataset, then
table; a query can join tables across different datasets (even, with the
right permissions, across different projects) within the same query,
similar in spirit to how a Postgres query can join tables within one
database.

### Important Distinctions

- A BigQuery dataset ≠ the same concept as a "dataset" in general
  data-science parlance (a loose collection of data for analysis) — here
  it specifically means the BigQuery container object that groups tables
  and controls access.
- A BigQuery table's schema ≠ as rigidly enforced at write time in every
  ingestion path as a Postgres table's — depending on how data is
  loaded, some flexibility (like schema auto-detection or explicit
  schema evolution) is more common than in a strict OLTP database.

### Why Does It Exist?

Large organizations with many teams and many tables need a structural
way to group related tables and control who can access which groups of
data — datasets provide that organizational and permissions boundary
within a BigQuery project.

### Connections

- **Prerequisite:** `bq.architecture-use-cases`, `pg.tables-rows-columns`
  — the general table concept, already familiar.
- **Enables:** `bq.analytical-sql` — queries reference tables via this
  dataset structure — and `gcp.iam-permissions`.

### Production Appearance

A query's `FROM` clause using the fully-qualified
`` `project.dataset.table` `` syntax, and a BigQuery console's left
sidebar showing a tree of projects → datasets → tables, are the
concrete, everyday signals of this structure.

### Example

A company might organize BigQuery datasets by domain — `sales_data`,
`marketing_data`, `product_analytics` — each containing several related
tables, with different teams granted access to different datasets based
on what they actually need.

### Practice

What does the fully-qualified reference
`` `acme-corp.sales_data.orders` `` tell you about where this table
lives, reading left to right? *(`acme-corp` is the GCP project,
`sales_data` is the dataset within that project, and `orders` is the
specific table within that dataset.)*

---

## bq.analytical-sql — Running analytical SQL queries

**Target depth:** Use

*(Reproduced from `chain-3-oltp-to-olap.md` — content unchanged.)*

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
  `bq.datasets-tables`, `integration.app-to-analytics-data-flow` — this
  is where the moved data ends up being queried.
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

*(Reproduced from `chain-3-oltp-to-olap.md` — content unchanged.)*

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

This is the explicit comparison anchor connecting
`pg.relational-fundamentals` and `bq.what-is-a-data-warehouse`. Related —
`dbconcepts.sql-vs-nosql` — a parallel "pick the right tool" comparison
one module over.

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

---

## bq.partitioning-clustering — Partitioning & clustering basics

**Target depth:** Understand

### What Is It?

Partitioning divides a BigQuery table into segments based on a column's
value (commonly a date), so a query filtering on that column only scans
the relevant segments instead of the whole table; clustering further
sorts data within each partition (or the whole table) by one or more
other columns, so queries filtering on those columns can skip irrelevant
data even within a scanned partition.

### Mental Model

Think of partitioning like organizing a massive archive into separate
boxes by year — asking "what happened in 2026" only requires opening the
2026 box, not every box ever filled. Clustering is then organizing the
papers *within* each box alphabetically by customer name, so finding one
specific customer's records within that year's box is faster too,
without needing a separate index structure the way Postgres uses
(`pg.indexes`).

**Partitioning skips whole irrelevant chunks of a table before scanning;
clustering makes scanning within the relevant chunk faster and
cheaper — both exist specifically to reduce how much data a query
actually has to read.**

### How It Works

A table partitioned by a `date` column, when queried with `WHERE
order_date BETWEEN '2026-01-01' AND '2026-01-31'`, only scans the
partitions covering January 2026, ignoring every other month's data
entirely — directly reducing both query cost (BigQuery bills largely by
data scanned) and query time. Clustering that same table by
`customer_id` additionally sorts the data within each date partition so
that filtering by a specific customer within the scanned date range
reads even less data.

### Important Distinctions

- Partitioning ≠ the same mechanism as a Postgres index (`pg.indexes`) —
  an index is a separate lookup structure pointing at rows; partitioning
  physically segments the table's stored data itself into distinct
  chunks that can be skipped wholesale.
- Partitioning without a filter on the partition column in a query ≠
  providing any benefit — if a query doesn't filter on the partitioned
  column at all, BigQuery still has to scan every partition, gaining
  nothing from the partitioning.

### Why Does It Exist?

BigQuery bills largely by the amount of data a query actually scans, and
scanning is slower the more data is involved — partitioning and
clustering are the primary tools for keeping both cost and query time
proportional to how much data a specific query actually needs, rather
than the size of the entire table.

### Connections

- **Prerequisite (BLOCKING):** `bq.datasets-tables`, `bq.analytical-sql`.
- **Related:** `pg.indexes` — the same underlying goal (avoid scanning
  irrelevant data) achieved by a structurally different mechanism suited
  to BigQuery's columnar, scan-heavy query model rather than Postgres's
  row-lookup model.

### Production Appearance

A large, frequently-queried BigQuery table (like an events or orders
table spanning years of history) that isn't partitioned by date is a
common, expensive real-world mistake — every query against it scans (and
is billed for) the entire table's history, even a query only interested
in the last week.

### Example

An events table partitioned by day and clustered by `user_id` lets a
query like "this specific user's events from the last 7 days" scan only
7 day-partitions, and within those, jump quickly to the relevant user's
clustered rows.

### Practice

A 5-year-old, un-partitioned events table is queried with `WHERE
event_date = '2026-09-01'` — does BigQuery scan only that day's data, or
the whole table? *(The whole table — without partitioning on
`event_date`, BigQuery has no way to physically skip the other days'
data; the `WHERE` clause filters the results but doesn't reduce how much
data actually has to be scanned to find them.)*
