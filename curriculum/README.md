# Curriculum content

103 fully-authored concepts, 14 modules, covering JavaScript → React →
Next.js → Backend Fundamentals → FastAPI → Framework Comparison →
Revision (Phase A), then PostgreSQL → Database Concepts → BigQuery → GCP
Fundamentals → GCP + Application Architecture → Stack Integration →
Final Revision (Phase B). Structured and authored per the methodology in
[`../agents/SKILL.md`](../agents/SKILL.md) and
[`../agents/AGENT.md`](../agents/AGENT.md).

This is plain, portable Markdown — no build step is required to read it
directly, and no framework-specific syntax is embedded in it. The
[`../app/`](../app/) viewer renders it, but the content doesn't depend on
that app; it could be fed into a different renderer without changes.

## Files

| File | What it is |
|---|---|
| `01-input-analysis.md` | Phase 1: topic, learner profile, objective, curriculum authority, depth, and duration decisions — the reasoning behind everything that follows. |
| `02-curriculum-model.md` | Phase 2: the full 103-concept hierarchy (module tables with id/title/target-depth/prerequisite/original-curriculum-item), the relationship graph, the four cross-technology chains, and the traceability table. **Read this first** to see the whole curriculum's shape before diving into any one module. |
| `module-01-javascript.md` … `module-14-final-revision.md` | Full content for every concept, one file per module, concepts in curriculum order. |
| `chain-1-closures-to-stale-state.md` … `chain-4-react-to-cloud-deployment.md` | The four cross-technology chains, authored as connected reading before the modules containing all their concepts existed yet. See "Reproduced concepts," below. |

## Concept structure

Every concept follows the same section order (not every section applies
to every concept — lighter concepts skip some; see `SKILL.md` §7 for the
full rule):

```
What Is It?  →  Mental Model  →  How It Works  →  Important Distinctions
  →  Why Does It Exist?  →  Connections  →  Production Appearance
  →  Example  →  Trace  →  Common Misconceptions  →  Practice
  →  Code Reading  →  Mastery Check  →  Deeper / Deferred
```

Concepts never open with a "why this matters" hook — `SKILL.md`'s
curriculum-first rule is that a learner sees a precise definition before
being told why it matters, not after.

## Target depth

Every concept declares a target depth, shown as a pill in the app:

| Depth | Means the learner can... |
|---|---|
| Recognize | identify/name it when they see it |
| Understand | explain it correctly in their own words |
| Use | apply it correctly in a straightforward case |
| Reason | predict, debug, or compare it in a novel situation |

(`Master` exists in the scale but nothing in this curriculum targets it —
per `SKILL.md` §7, depth shouldn't drift there by default.) GCP
Fundamentals stays deliberately at Recognize/Understand throughout — it's
a service survey for codebase readiness, not infrastructure-operations
training. Comparison concepts (Framework Comparison, parts of Database
Concepts) sit at Reason, since the curriculum's own stated objective
names trade-offs explicitly.

## Reproduced concepts (chain files ↔ module files)

Four of this curriculum's cross-technology connections were authored
*before* the modules containing all their concepts existed yet — so a
handful of concepts exist in two places:

| Concept | Canonical chain file | Also reproduced in |
|---|---|---|
| `js.variables-values` | *(originally authored in a separate mockup, not a chain file)* | `module-01-javascript.md` |
| `js.scope-and-closures` | `chain-1-closures-to-stale-state.md` | `module-01-javascript.md` |
| `react.use-callback`, `react.use-effect` | `chain-1-closures-to-stale-state.md` | `module-02-react.md` |
| `backend.http-basics`, `backend.rest-apis`, `fastapi.routes-endpoints`, `fastapi.dependency-injection`, `pg.crud-statements`, `integration.trace-request-frontend-to-db` | `chain-2-request-lifecycle.md` | `module-04-backend.md`, `module-05-fastapi.md`, `module-08-postgresql.md`, `module-13-stack-integration.md` |
| `pg.transactions`, `integration.app-to-analytics-data-flow`, `bq.analytical-sql`, `bq.postgres-vs-bigquery` | `chain-3-oltp-to-olap.md` | `module-08-postgresql.md`, `module-10-bigquery.md`, `module-13-stack-integration.md` |
| `react.fundamentals`, `next.fundamentals`, `next.server-client-components`, `gcparch.frontend-backend-deployment-flow`, `gcp.cloud-run` | `chain-4-react-to-cloud-deployment.md` | `module-02-react.md`, `module-03-nextjs.md`, `module-12-gcp-architecture.md` |

**These are kept in sync manually, not generated from one source.** Each
reproduced copy is marked with a `*(Reproduced from ... — content
unchanged.)*` note directly under its heading. If you edit one of these
concepts, edit every copy listed above together — the app's content
parser (`app/scripts/build-content.mjs`) takes whichever file it reads
first (module files before chain files) as canonical for the "what shows
in the app" purpose, but a stale, un-updated copy left in the other file
is still misleading to a human reader of these Markdown files directly.

## Adding or editing a concept

1. Find the concept's module file (or, for a brand-new concept not yet in
   `02-curriculum-model.md`, add it to that file's relevant module table
   first, so the full-curriculum skeleton stays accurate).
2. Follow the section structure above; match the surrounding concepts'
   depth (don't add a Mastery Check to a Recognize-depth concept, don't
   skip Important Distinctions on a Reason-depth one).
3. If this concept also exists in a chain file, update that copy too, or
   remove the "reproduced" relationship deliberately (and say so in both
   places) if it's no longer accurate.
4. From `app/`, run `npm run build-content` (or just `npm run dev`,
   which runs it automatically) to confirm the concept parses — the
   command prints a `written/total` count; check it moved the way you
   expect.
