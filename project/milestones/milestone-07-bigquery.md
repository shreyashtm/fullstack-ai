# Milestone 7 — BigQuery Analytics Pipeline

Guidance level: **Independent** (problem + acceptance criteria only).

> **Prerequisite:** this milestone needs your own real GCP project with
> BigQuery enabled. It's the first milestone that can't run entirely
> locally — say so up front rather than pretending otherwise.

## Objective

Get spend data out of the OLTP Postgres database (Milestone 6) and into
BigQuery for analytics: a batch export, then real analytical SQL —
monthly spend by category, and a month-over-month trend.

## Concepts Practiced

All from `curriculum/module-10-bigquery.md`:

- `bq.what-is-a-data-warehouse` (Understand)
- `bq.architecture-use-cases` (Understand)
- `bq.datasets-tables` (Use)
- `bq.analytical-sql` (Use)
- `bq.postgres-vs-bigquery` (Reason)
- `bq.partitioning-clustering` (Understand)

Plus `integration.app-to-analytics-data-flow` (Reason) from
`curriculum/module-13-stack-integration.md` — this milestone's literal
subject, per Verification below.

## Previously Learned

`pg.transactions`, `pg.sql-basics` (Milestone 6) — you're reading out of
the same database you just built.

## New Concepts

None new — Module 10 applied, plus the one directly-relevant
`integration.*` concept.

## Requirements

1. A BigQuery dataset and an `expenses_analytics` table, schema-designed
   for analytics (can be a flattened version of the Postgres join, not
   identical to it) — `bq.datasets-tables`.
2. A batch export script (Python, `google-cloud-bigquery`) that reads from
   Postgres and loads into BigQuery — this is a simple batch ETL, not
   Dataflow or Pub/Sub; that scope matches the curriculum's own
   Understand-level ceiling for this module, don't over-build it.
3. The table partitioned by date and clustered by category —
   `bq.partitioning-clustering`.
4. Two real analytical queries run in BigQuery: monthly total by category,
   and month-over-month trend — `bq.analytical-sql`.

## Constraints

- Batch export only — no real-time streaming pipeline. Justify this
  choice in Reasoning Question 1 rather than treating it as a given.

## Architecture

No prescribed internal structure beyond: an export script, a BigQuery
schema definition, and your two query files. Organize
`project/app/milestone-07-bigquery/` however you want.

## Implementation Task

Build the export script first with a naive approach (plain `INSERT`/load
job, no de-duplication logic), run it twice on purpose, and observe what
happens to your analytical query's totals before fixing it.

## Reasoning Questions

1. Why is a nightly batch export appropriate for this app's actual usage
   pattern, instead of real-time streaming? What would streaming cost you
   here that isn't worth paying?
2. What would the month-over-month trend query look like — and cost — if
   you ran it against Postgres directly on a million-row table, versus
   BigQuery? Be concrete about *why* (`bq.postgres-vs-bigquery`).
3. What does partitioning by date actually change about which bytes
   BigQuery scans for a "last 30 days" query?
4. Walk `integration.app-to-analytics-data-flow` end to end, specifically
   for this app: where does a dollar spent in the Next.js UI end up, and
   through how many systems, before it shows up in your trend query?

## Debugging Challenge

Run your export script twice without any de-duplication logic (a plain
append/load job, no watermark, no `WRITE_TRUNCATE`). Query your monthly
totals and notice they're inflated — every expense counted twice.

Don't just add a truncate-and-reload and move on. First explain: why did
re-running the exact same script produce different (wrong) totals — what
assumption did the naive script make about how often, and how completely,
it would ever run? Then fix it with either a watermark column (only
export rows newer than the last successful export) or a full
truncate-and-reload strategy, and justify which one fits *this* app's
data volume better than the other.

## Verification

- **Implementation:** export runs correctly and idempotently; both
  analytical queries return correct, sensible numbers; partitioning is in
  place.
- **Reasoning:** answer all four questions above.
- **Debugging:** reproduced the duplication, fixed it, and can explain why
  the naive script was wrong without re-reading an ETL tutorial.
- **Transfer:** given a different naive batch script (any domain), predict
  whether it's idempotent before being told.
