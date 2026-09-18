# Phase 1 — Input Analysis

Produced per `AGENT.md` Phase 1, applying `SKILL.md`'s input contract (§5)
and Decision Points 1–2 to the curriculum the user supplied on 2026-09-18.
This is content for the notebook-builder app's curriculum — separate from
the live teaching-protocol system, which is not touched by this file.

## Topic

Full-stack engineering onboarding: JavaScript, ReactJS, NextJS, backend
fundamentals, FastAPI, framework comparison, PostgreSQL, general database
concepts, BigQuery, and GCP — spanning two tracks the user labeled
"Frontend + Backend" and "Database + Cloud."

**Required?** Yes — present and specific. No question needed (DP1
outcome a, AUTO-PROCEED).

## Learner profile

From memory (`shreyash-background`, `teaching-protocol`): comfortable with
Python and SQL; not deeply experienced with modern JavaScript, React,
NextJS, FastAPI, or GCP; preparing to join an existing codebase on this
stack; wants practical codebase-reading ability over academic
completeness.

**Source:** inferred from existing project memory, not restated by the
user in this request. **AUTO-PROCEED** — used as-is; flagged here so it's
checkable against reality rather than silently assumed fresh.

## Learning objective

User's own words: *"By the end of the curriculum, I should have a clear
understanding of the core concepts, the technologies being used, their
trade-offs, and how the complete stack fits together so I can start
working with the existing codebase."*

This is a **working-practitioner-competence** objective with an explicit
**practical application context** (join an existing codebase), not exam
prep or academic mastery. It also explicitly names *trade-offs* as a goal
— which elevates comparison-type concepts (framework choice, SQL vs
NoSQL, OLTP vs OLAP) to Reason depth rather than treating them as trivia.

**Required?** Optional per the input contract, but supplied — used as
given, no default needed.

## Supplied curriculum

The user supplied a fully structured list: two top-level tracks, 14
colon-headed modules (7 per track), each with a bulleted topic list. This
is a **designed sequence with clear signaled intent to be followed** —
not a loose topic dump.

**DP2 determination: AUTHORITATIVE.** Every bullet must end up covered, in
recognizable form, somewhere in the concept map; order is preserved;
nothing is dropped, merged beyond recognition, or reordered into a
materially different sequence. Enrichment (added prerequisite concepts,
splitting an oversized bullet into multiple concept pages, added
cross-references) is allowed and used where the modeling in Phase 2
required it — each instance is called out explicitly in
`02-curriculum-model.md`'s traceability table, never silently.

No restructuring beyond additive enrichment was applied — the two-track /
14-module shape is used as the Phase → Module layer of the hierarchy
directly (see Phase 2, Decision Point 4).

## Target depth

Not stated per concept. Given the objective ("clear understanding... so I
can start working with the existing codebase" — practitioner-level, not
academic, not certification), the **default target depth is
Understand → Use → Reason** (`SKILL.md` §7), the same default the Skill
now recommends for most production-relevant concepts. Explicit exceptions
are called out per-module in Phase 2 (e.g. GCP Fundamentals stays lighter,
Recognize → Understand, matching a service *survey* rather than
hands-on infra work; comparison-type concepts — framework choice, SQL vs
NoSQL, Postgres vs BigQuery — go to Reason, matching the objective's
explicit call-out of trade-offs).

**Source:** inferred from the objective, not stated. **PROPOSE+PROCEED.**

## Duration

Not stated, and not inferred from the prior, unrelated 14-day live-teaching
plan referenced in memory — that plan governs a different system (chat-
based teaching sessions) and, per `AGENT.md` Decision Point 4, this Agent
must never default to a prior project's "N units" shape just because it
existed once. The curriculum happens to land at 14 modules because the
user's own supplied structure has 14 module headers — that is a property
of their input, not a duration this Agent imposed.

**Decision: no fixed timeframe.** The curriculum is sized to the objective
and depth (`SKILL.md` §5 default), not to a day count. **AUTO-PROCEED.**

## Practical application context

Explicit: "so I can start working with the existing codebase." This keeps
the "Codebase/practice readiness" quality standard (`SKILL.md` §15)
load-bearing throughout — every module's Production Appearance sections
(Phase 3+) should connect to how the concept actually shows up in a real
repo, not a generic example, and the curriculum closes on exactly this
(Module 13, Stack Integration & Code Reading; Module 14, Final Revision).

## Available resources / constraints

None supplied for this build. **AUTO-PROCEED** — designed from general
domain knowledge; no factual-verification flags raised (all covered
technologies are mainstream, well-documented, non-specialized).

## Implementation preferences

Not stated. Per the prior session's Design-canvas mockup, a browser-based
interactive notebook remains the working assumption, but no implementation
work (Phase 5/6) is in scope for this deliverable — see the note at the
end of `02-curriculum-model.md` on what's built versus what's modeled only.

## Threshold check (Decision Point 13)

Nothing above required asking the user: the curriculum's authority was
clear from its own structure, the learner profile and depth were
reasonably inferable, and no ambiguity here would materially change the
outcome. The one genuine fork this session — which system this curriculum
is *for* (live teaching vs. the notebook-builder app vs. both) — **was**
asked, and the user chose: **notebook-builder app curriculum**. This file
and `02-curriculum-model.md` are scoped to that answer only; the live
teaching-protocol system and its `fullstack-14day-plan` memory are
untouched by this work.
