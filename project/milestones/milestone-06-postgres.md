# Milestone 6 — PostgreSQL Persistence

Guidance level: **Independent** (problem + acceptance criteria only).

## Objective

Replace FastAPI's in-memory expense store with real PostgreSQL
persistence. Categories become their own table (not a plain string) so
relationships and joins are genuinely required, not simulated.

## Concepts Practiced

All from `curriculum/module-08-postgresql.md`:

- `pg.relational-fundamentals` (Understand)
- `pg.tables-rows-columns` (Understand)
- `pg.primary-foreign-keys` (Use)
- `pg.relationships` (Use)
- `pg.sql-basics` (Use)
- `pg.crud-statements` (Use)
- `pg.joins` (Reason)
- `pg.indexes` (Reason)
- `pg.constraints` (Use)
- `pg.transactions` (Reason)

Plus, from `curriculum/module-09-database-concepts.md`:
`dbconcepts.basic-db-design` (Use) — schema design is a literal
requirement below, not a survey topic here.

And the first fully-real payoff of
`curriculum/module-13-stack-integration.md`'s
`integration.trace-request-frontend-to-db` (Reason) — see Verification.

## Previously Learned

`fastapi.routes-endpoints`, `fastapi.dependency-injection` (Milestone 5) —
your routes now call into real SQL instead of an in-memory dict.

## New Concepts

None new to the curriculum — Module 8 applied, plus the one `dbconcepts`
concept and one `integration` concept named above (both legitimately
project-appropriate per the framework's own rule: apply concepts where a
feature genuinely needs them, don't force the rest of their modules in).

## Requirements

1. Design `expenses` and `categories` as two separate tables — a real
   1:N relationship (`categories.id` → `expenses.category_id`), not a
   string column — `dbconcepts.basic-db-design`, `pg.relationships`,
   `pg.primary-foreign-keys`.
2. A primary key on both tables, a `NOT NULL` and a `CHECK (amount > 0)`
   constraint on `expenses` — `pg.constraints`.
3. An index on whichever column your most frequent query filters by (date
   range, or `category_id`) — `pg.indexes`.
4. Rewire every FastAPI endpoint from Milestone 5 to real SQL —
   `pg.sql-basics`, `pg.crud-statements`. Listing expenses with their
   category name requires an actual `JOIN` — `pg.joins`.
5. A "reassign category" operation (move an expense to a different
   category, updating both categories' cached running totals) wrapped in
   a real transaction — `pg.transactions`. This is also the Debugging
   Challenge below.

## Constraints

- **No ORM hiding the SQL.** Use raw SQL via a thin driver (e.g.
  `psycopg`) — every `CREATE TABLE`, `SELECT`/`JOIN`, and transaction must
  be SQL you wrote and can read back, not something SQLAlchemy's ORM layer
  generated for you. The point of this milestone is the SQL itself.

## Architecture

No prescribed internal structure beyond: a schema definition, a connection
module, and a data-access layer FastAPI's routes call into. Organize
those three responsibilities however you want inside
`project/app/milestone-06-postgres/`.

## Implementation Task

Design the schema, write the DDL, wire FastAPI to it. Build the "reassign
category" operation **without** a transaction first (two separate
statements), reproduce the failure mode described below, then fix it.

## Reasoning Questions

1. Why store categories in their own table instead of a plain string
   column on `expenses`? What specifically breaks (not "it's bad
   practice" — a concrete failure) if you'd kept it a string?
2. What does the foreign key constraint on `category_id` actually prevent
   at the database level? Try to violate it on purpose and read the exact
   error.
3. Why does your index help the query it's built for? What would you
   expect `EXPLAIN` to show with the index versus without it?
4. **Verification task:** trace one `POST /expenses` request all the way
   from the Next.js form submit, through the FastAPI route, to the SQL
   `INSERT`, and back to what the frontend renders. Write this out step by
   step — this is `integration.trace-request-frontend-to-db` at Reason
   depth, and it's the actual point of this milestone, not a side
   exercise.

## Debugging Challenge

Build "reassign category" as two separate SQL statements with no
transaction wrapper: update the expense's `category_id`, then update both
categories' cached totals. Trigger a failure between the two statements on
purpose (e.g. throw an exception, or kill the connection, right after the
first commits) and confirm the database is now inconsistent — the expense
moved, but the totals didn't update (or vice versa).

Don't just wrap it in `BEGIN`/`COMMIT` and move on. First explain: why was
a partial failure possible at all — what was the database doing between
your two statements that let it end up in a state that should be
impossible? Then fix it with a real transaction (commit on success,
rollback on any exception), and reproduce the same failure injection to
confirm the database now stays consistent.

## Verification

- **Implementation:** schema is designed and migrated; every endpoint
  reads/writes real Postgres; the join-based list query works; the index
  measurably helps its target query.
- **Reasoning:** answer questions 1-3, and complete the full request trace
  in question 4.
- **Debugging:** reproduced the pre-transaction inconsistency, fixed it,
  and can explain the failure window without re-reading a transactions
  tutorial.
- **Transfer:** name one other operation in this app that would need the
  same transaction treatment, before being told.
