# Full-Stack Curriculum Notebook

A complete, 103-concept interactive curriculum covering JavaScript,
React, Next.js, backend fundamentals, FastAPI, PostgreSQL, BigQuery, and
GCP — built as a portable content library plus a local web app to browse
it — following a curriculum-first learning-notebook methodology.

**Status: content-complete.** All 103 concepts across 14 modules are
fully authored. See [Status and honest limitations](#status-and-honest-limitations)
below for what this project *doesn't* include.

## Repository layout

```
agents/       The reusable, subject-agnostic methodology (a Claude Code
              skill): what a "curriculum-first learning notebook" is and
              how to build one for any subject. Contains no content
              specific to this curriculum.
curriculum/   The actual content: this project's 103-concept JavaScript/
              React/Next.js/FastAPI/PostgreSQL/BigQuery/GCP curriculum,
              as portable Markdown. See curriculum/README.md.
app/          A local Vite + React app that reads curriculum/*.md and
              renders it as a browsable notebook. See app/README.md.
```

## Quickstart

```bash
git clone https://github.com/shreyashtm/fullstack-ai.git
cd fullstack-ai/app
npm install
npm run dev
```

Opens a local dev server (Vite will report the exact port — see
`app/README.md` if you need to know why). The app reads every file in
`curriculum/` at startup, so editing curriculum content and restarting
`npm run dev` is all that's needed to see a change reflected.

## What this actually is

This repository holds two distinct things that must not be conflated:

1. **`agents/`** — `SKILL.md` and `AGENT.md` are a generalized, portable
   methodology for building *any* subject's interactive learning
   notebook: how to model a curriculum as a knowledge graph, structure a
   concept page (What Is It? → Mental Model → How It Works → Important
   Distinctions → Why It Exists → Connections → Production Appearance →
   Example → Trace → Common Misconceptions → Practice → Code Reading →
   Mastery Check → Deeper/Deferred), and where an AI teacher fits in as a
   secondary, diagnostic layer rather than the primary way a concept gets
   taught. `GENERALIZATION_ANALYSIS.md` is the audit trail behind it —
   what was kept, made configurable, or discarded from the original
   reference project this methodology was extracted from. These three
   files contain **no subject-specific content** by design.
2. **`curriculum/` + `app/`** — one concrete application of that
   methodology: a full-stack engineering onboarding curriculum, modeled
   and authored per `AGENT.md`'s workflow (Phase 1: input analysis, Phase
   2: curriculum modeling, Phase 6: content authoring), plus a working
   viewer.

If you're extending this to a *different* subject, start from `agents/`
and its own instructions — don't copy `curriculum/`'s specific content as
a template; that's exactly the mistake `SKILL.md`'s own preamble warns
against.

## The curriculum

14 modules across two tracks, 103 concepts total:

| Track | Module | Concepts |
|---|---|---|
| Frontend + Backend | 1. JavaScript | 13 |
| | 2. ReactJS | 17 |
| | 3. NextJS | 6 |
| | 4. Backend Fundamentals | 10 |
| | 5. FastAPI | 8 |
| | 6. Framework Comparison | 3 |
| | 7. Revision, Phase A | 3 |
| Database + Cloud | 8. PostgreSQL | 10 |
| | 9. Database Concepts | 5 |
| | 10. BigQuery | 6 |
| | 11. GCP Fundamentals | 8 |
| | 12. GCP + Application Architecture | 6 |
| | 13. Stack Integration & Code Reading | 4 |
| | 14. Final Revision | 4 |

Full planning detail — why this hierarchy, the relationship graph between
concepts, the four cross-technology chains, and the traceability table
back to every originally-supplied curriculum item — lives in
[`curriculum/01-input-analysis.md`](curriculum/01-input-analysis.md) and
[`curriculum/02-curriculum-model.md`](curriculum/02-curriculum-model.md).

The curriculum's own stated objective (from `01-input-analysis.md`):

> By the end of the curriculum, I should have a clear understanding of
> the core concepts, the technologies being used, their trade-offs, and
> how the complete stack fits together so I can start working with the
> existing codebase.

## Status and honest limitations

Per this project's own methodology (`AGENT.md` §8, "never present a
deliverable as more finished than it is"):

**Done:**
- All 103 concepts, fully authored, each with content scaled honestly to
  its assigned target depth (Recognize/Understand/Use/Reason — nothing
  drifted to Master by default).
- A working local viewer (`app/`) — curriculum sidebar, search, a
  written/unwritten filter, full Markdown rendering (code, tables).
  Verified end-to-end in a real browser, repeatedly, while each module
  was authored.
- A relationship graph and four fully-authored cross-technology chains
  (Closures→React→stale state; HTTP→FastAPI→Postgres request trace;
  Postgres OLTP→BigQuery OLAP; React→Next.js→Cloud Run deployment).

**Not built — genuinely out of scope so far, not hidden gaps:**
- **No AI Teacher.** `SKILL.md`'s methodology defines one (a secondary,
  diagnostic layer — never the primary explainer), but no implementation
  exists here, mocked or real. The app is the curriculum's complete
  standalone artifact, by design — the methodology requires it to
  survive with zero AI interaction, and it does.
- **No learner state or progress persistence.** Nothing tracks what a
  learner has read, answered, or gotten wrong. The "written/unwritten"
  status the app shows reflects *authoring* completeness, not a
  learner's own progress — there's no per-learner data at all.
- **No backend.** The app is a static-content Vite/React frontend; it
  reads Markdown files at build time (see `app/README.md`) and has no
  server, database, or API of its own.
- **Not a git repository.** No commit history exists for any of this
  work.

Building any of the above is new scope, not a continuation of what's
already finished here.
