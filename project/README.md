# Project Layer — Expense Tracker

This is the **Project-Driven Practical Learning** layer. It is an addition to
the curriculum in [`../curriculum/`](../curriculum/), not a replacement for
it. Nothing here re-explains a concept — every feature below links to a
concept ID already authored in `curriculum/02-curriculum-model.md` and its
module file. If you need to *understand* a concept, go read it there. This
layer is only for *applying, integrating, debugging, and tracing* it.

Three lanes, kept separate:

| Lane | Lives in | Job |
|---|---|---|
| Curriculum | `curriculum/` | concepts, mental models, theory |
| **Project (this)** | `project/` | implementation, integration, debugging, tracing, architecture, transfer |
| AI Teacher | live chat sessions | diagnosis, misconceptions, adaptive Q&A |

## The project

A personal **expense tracker**: add/edit/delete expenses, categorize them,
see totals, sync to "the cloud," eventually backed by a real API, a real
database, and a real analytics pipeline. It's the same app end to end —
each milestone below evolves it, it never gets thrown away and restarted.

The build order follows the curriculum's own module order, not a
final-architecture-first approach. A milestone only uses concepts from
modules already authored. Don't reach ahead.

```
JS (Module 1)        → application logic, no framework yet
React (Module 2)     → interactive interface
Next.js (Module 3)   → app structure, routing
HTTP (Module 4)      → real client-server communication
FastAPI (Module 5)   → real backend
PostgreSQL (Module 8)→ real persistence
BigQuery (Module 10) → analytics on usage/spend data
GCP (Modules 11-12)  → real deployment
```

## Milestones

All 8 are now spec'd (docs + scaffold). "Status" tracks whether *you've*
built it — not whether the spec exists. Build in order; the guidance
ladder below assumes you have.

| # | Milestone | Modules practiced | Status |
|---|---|---|---|
| 1 | [Vanilla JS expense tracker](milestones/milestone-01-vanilla-js.md) | Module 1 — JavaScript | **Current** |
| 2 | [React interactive UI](milestones/milestone-02-react.md) | Module 2 — ReactJS | Not started |
| 3 | [Next.js app structure](milestones/milestone-03-nextjs.md) | Module 3 — NextJS | Not started |
| 4 | [Real HTTP client/server split](milestones/milestone-04-http-server.md) | Module 4 — Backend Fundamentals | Not started |
| 5 | [FastAPI backend](milestones/milestone-05-fastapi.md) | Module 5 — FastAPI | Not started |
| 6 | [PostgreSQL persistence](milestones/milestone-06-postgres.md) | Module 8 — PostgreSQL + dbconcepts + integration | Not started |
| 7 | [BigQuery analytics pipeline](milestones/milestone-07-bigquery.md) | Module 10 — BigQuery + integration | Not started |
| 8 | [GCP deployment](milestones/milestone-08-gcp-deploy.md) | Modules 11-12 — GCP + integration | Not started |

Each milestone doc uses the same template: Objective, Concepts Practiced,
Previously Learned, New Concepts, Requirements, Constraints, Architecture,
Implementation Task, Reasoning Questions, Debugging Challenge, Verification.

## Guidance level ladder

Starts **Guided** (architecture + boundaries given, you write the logic) and
should reduce over time toward **Independent** and **Unfamiliar Codebase** as
milestones progress. The engine does not write your implementation — code
under `project/app/milestone-NN-*/` ships as TODO-stubbed scaffolding, not
finished features, except where a milestone deliberately seeds a bug for a
debugging challenge.

## Concept coverage

Rolled up by module rather than one row per concept (each milestone doc's
own "Concepts Practiced" section already lists every ID individually —
this table tracks *implementation progress*, not which IDs exist).

`Practiced` = the milestone's design exercises these concepts (true for
all 8 now that every milestone is spec'd). `Built / Debugged / Verified`
only get checked once *you've* actually implemented that milestone and
passed its Verification section — not before, regardless of whether the
spec exists.

| Milestone | Module(s) | Concepts practiced | Built | Debugged | Verified |
|---|---|---|---|---|---|
| 1 | `js.*` (Module 1) | 13/13 | | | |
| 2 | `react.*` (Module 2) | 16/17 — `react.redux` discussed in Reasoning Q3, not implemented (survey depth, correctly excluded) | | | |
| 3 | `next.*` (Module 3) | 6/6 | | | |
| 4 | `backend.*` (Module 4) | 10/10 | | | |
| 5 | `fastapi.*` (Module 5) | 8/8 | | | |
| 6 | `pg.*` (Module 8) + `dbconcepts.basic-db-design` + `integration.trace-request-frontend-to-db` | 12 | | | |
| 7 | `bq.*` (Module 10) + `integration.app-to-analytics-data-flow` | 7 | | | |
| 8 | `gcp.*` + `gcparch.*` (Modules 11-12) + `integration.how-the-stack-fits-together` + `integration.representative-project-structure` | 16 | | | |

**88 of 103 concepts practiced across the 8 milestones** (all 4
`integration.*` concepts from Module 13 land in Milestones 6-8, exactly
where the real cross-stack trace becomes possible — see each milestone's
Concepts Practiced section for why).

## Concepts intentionally curriculum-only

Per the framework's own rule — *"don't force every concept into the
project"* — 14 concepts stay curriculum-only, all for the same reason:
they're comparison/survey/revision content, not something a single app's
feature set can genuinely exercise:

- `compare.*` (Module 6, 3 concepts) — FastAPI vs Flask/Django/Express/NestJS.
  You only ever build with one framework; comparing requires having used
  several, which isn't this project's job.
- `revA.*` (Module 7, 3 concepts) and `revB.*` (Module 14, 4 concepts) —
  cross-curriculum revision/interview-prep content, not new application.
- `dbconcepts.*` minus `basic-db-design` (Module 9, 4 of 5 concepts) —
  SQL vs NoSQL, Postgres vs MongoDB, when to choose relational vs
  non-relational. This project only ever uses Postgres, so there's nothing
  to *choose between* inside it. (`dbconcepts.basic-db-design` is the one
  exception — schema design is a literal Milestone 6 requirement, so it's
  practiced there.)

If a future milestone ever needed a real technology choice (e.g. "should
this have used MongoDB"), that would be the moment to promote one of these
out of curriculum-only — not before.
