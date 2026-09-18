# Module 14 — Final Revision (`revB.*`)

Full concept content for all 4 concepts in `02-curriculum-model.md`'s
Final Revision module — the curriculum's last module. All four are new.
Like Module 7 (`revA.*`), these are synthesis/review concepts, not new
teaching material, with the same honesty caveat: the methodology's
intended review mechanism (`SKILL.md` §7) is evidence-driven, using a
real learner's own answer history; this static app has none, so these
concepts are built as representative, structured self-checks instead.

**This is the final module of the entire 103-concept curriculum.**

---

## revB.full-review — Full cross-curriculum review

**Target depth:** Reason

### What Is It?

A full, cross-curriculum revision pass spanning all 14 modules and 103
concepts — the Phase B / whole-curriculum counterpart to
`revA.js-react-next-fastapi-review`'s Phase-A-only version, checking that
the entire stack (not just Frontend + Backend) coheres as one connected
mental model.

### Mental Model

Think of this as the final, complete walk through the whole building —
every room from Module 1 through Module 13 — checking not just that each
room makes sense on its own, but that the doors between every pair of
rooms that should connect actually do.

### How It Works

Rather than introducing anything new, this concept revisits the
load-bearing cross-module connections spanning the *entire* curriculum,
extending `revA.js-react-next-fastapi-review`'s Phase-A-only chains with
the Phase-B ones:

- Everything `revA.js-react-next-fastapi-review` already covered
  (JS→React→Next→Backend→FastAPI).
- `pg.transactions`/`pg.crud-statements` →
  `integration.app-to-analytics-data-flow` → `bq.analytical-sql` (the
  OLTP→OLAP chain).
- `dbconcepts.sql-vs-nosql` ↔ `compare.fastapi-vs-flask-vs-django` (the
  same "apply a comparison, don't just recite it" reasoning skill,
  appearing twice in the curriculum).
- `gcp.iam-permissions` → every other `gcp.*`/`gcparch.*` concept (the
  permissions layer underlying the entire cloud half of the curriculum).

### Important Distinctions

This ≠ `revA.js-react-next-fastapi-review` repeated — that revision was
explicitly scoped to Phase A only; this one spans the full 103-concept
curriculum, checking connections `revA`'s own scope couldn't have
covered yet (anything touching Modules 8–13).

### Why Does It Exist?

Per `SKILL.md` §7's reinforcement-and-review principle (also honestly
caveated in `revA.js-react-next-fastapi-review` — no real learner
history exists in this static app), a final review needs to check the
*whole* curriculum's connectedness, not just repeat the Phase-A check at
a larger scale.

### Connections

- **Prerequisite (BLOCKING):** every concept in Modules 1–13.
- **Enables:** `revB.technology-comparison-recap`,
  `revB.interview-style-questions`,
  `revB.architecture-review-and-final-mastery-check` — this module's
  other three concepts.

### Practice (cross-curriculum, self-diagnostic)

1. A user cancels an order on the frontend, and three months later an
   analyst asks "how many orders were cancelled last quarter." Using
   concepts from Modules 1–10, name every layer this single fact passes
   through, start to finish. *(Tests: the full
   `integration.trace-request-frontend-to-db` chain, then
   `pg.transactions`/`pg.crud-statements` →
   `integration.app-to-analytics-data-flow` → `bq.analytical-sql`.)*
2. Why would a team choose FastAPI over Django for a pure API, but
   choose Postgres over MongoDB for the same application's order data —
   using the shared reasoning skill both `compare.choosing-a-backend-framework`
   and `dbconcepts.choosing-relational-vs-nonrelational` teach, what's
   the common thread in how both decisions get made? *(Tests: both
   "choosing" concepts, and the recognition that they're the same
   applied-reasoning skill in two different domains.)*
3. A Cloud Run service can't reach its Cloud SQL database, and
   separately can't reach an internal API on another Cloud Run
   service — are these definitely the same root cause? *(Tests:
   `gcparch.backend-db-connection` vs.
   `gcparch.service-to-service-communication` — related but structurally
   distinct connections, both gated by `gcp.iam-permissions` but through
   different specific mechanisms.)*

### Mastery Check (Reason)

Pick the one concept, anywhere in the 103-concept curriculum, that
you're least confident you could explain to someone else right now.
Explain why that one specifically — not "I don't remember it," but
what's genuinely still unclear about the *mechanism*, using the
vocabulary this curriculum has given you to describe your own gap
precisely.

---

## revB.technology-comparison-recap — Compare the different technologies covered

**Target depth:** Reason

### What Is It?

A single, side-by-side recap of every comparison concept taught across
the curriculum — `compare.fastapi-vs-flask-vs-django`,
`compare.fastapi-vs-node-frameworks`, `dbconcepts.sql-vs-nosql`,
`dbconcepts.postgres-vs-mongodb`, `bq.postgres-vs-bigquery` — checking
that the *pattern* underlying all of them (not just each individual
comparison) is actually understood.

### Mental Model

Think of this as laying five separate comparison charts on one table at
once, and asking what they all have in common structurally — each one is
"two things that look like they solve the same problem, but actually
optimize for different, real tradeoffs," and picking correctly always
comes down to matching those tradeoffs to the actual situation, never to
which one is objectively "better."

### How It Works — the five comparisons, recapped in one table

| Comparison | Core tradeoff |
|---|---|
| FastAPI vs Flask vs Django | Structure/batteries-included vs. minimal/flexible |
| FastAPI vs Express/NestJS | Python vs. JS/TS ecosystem, plus a similar structure question |
| SQL vs NoSQL | Enforced schema + relations vs. flexible, denormalized documents |
| PostgreSQL vs MongoDB | The concrete SQL-vs-NoSQL instance, same tradeoff |
| PostgreSQL vs BigQuery | OLTP (frequent small transactional ops) vs. OLAP (large historical aggregates) |

### Important Distinctions

- This recap ≠ re-teaching any of these comparisons — every fact here
  was already taught individually; this concept's job is the
  meta-pattern across all five, which is genuinely different knowledge
  from any one comparison alone.
- Knowing all five comparisons' facts ≠ the same as being able to apply
  the *shared reasoning skill*
  (`compare.choosing-a-backend-framework`,
  `dbconcepts.choosing-relational-vs-nonrelational`) to a sixth,
  never-seen comparison — that transfer is what this recap is actually
  testing for.

### Why Does It Exist?

The curriculum's own stated objective explicitly names "trade-offs" as a
goal; a learner who can recite five separate comparisons but can't
recognize the shared reasoning pattern across them hasn't actually
internalized that goal — this recap is the check for the pattern itself,
not the individual facts.

### Connections

- **Prerequisite (BLOCKING):** `compare.fastapi-vs-flask-vs-django`,
  `compare.fastapi-vs-node-frameworks`, `dbconcepts.sql-vs-nosql`,
  `dbconcepts.postgres-vs-mongodb`, `bq.postgres-vs-bigquery`,
  `compare.choosing-a-backend-framework`,
  `dbconcepts.choosing-relational-vs-nonrelational`.

### Practice

Without naming any of the five specific comparisons above, describe in
one sentence the general *shape* of reasoning this curriculum uses every
time it teaches "X vs Y" for two technologies. *(Something like:
identify what each option actually optimizes for, then match those
tradeoffs to the specific situation's real needs — never conclude one
option is universally better.)*

### Mastery Check (Reason)

A new comparison this curriculum never covered — say, choosing between
two frontend state-management libraries — comes up on the job. Using
only the *pattern* from this recap (not any specific fact about those
libraries), describe the general process you'd follow to reason about
that choice.

---

## revB.interview-style-questions — Prepare questions based on the existing tech stack

**Target depth:** Reason

### What Is It?

A representative set of interview-style questions spanning the
curriculum's full stack, designed to test the same skills a technical
interview or a real onboarding conversation would probe — explanation,
prediction, debugging, and comparison — rather than recall of isolated
facts.

### Mental Model

Think of this as a mock interview built entirely from concepts already
taught — not new material, but a different *format* of check, closer to
how understanding actually gets tested outside a learning context
(someone asking you to explain, on the spot, without the concept's own
page in front of you).

### How It Works — a representative set, spanning the stack

1. *(JavaScript)* "What's a closure, and why does it matter for React
   hooks?" — tests `js.scope-and-closures` explained in your own words,
   connected forward.
2. *(React)* "Why might a component re-render more often than expected,
   even when wrapped in `React.memo`?" — tests
   `react.rerender-optimization`'s actual diagnostic reasoning, not just
   the definition.
3. *(Backend)* "Walk me through what happens, step by step, when a
   client sends a POST request to a FastAPI endpoint with an invalid
   body." — tests `backend.request-response-lifecycle` and
   `fastapi.pydantic-validation` together.
4. *(Database)* "When would you reach for an index, and what's the cost
   of adding one?" — tests `pg.indexes`'s tradeoff, not just "indexes
   make things faster."
5. *(Cross-stack)* "Trace what happens from a user clicking 'Save' to
   that data being reflected in an analytics dashboard." — tests the
   full `integration.trace-request-frontend-to-db` →
   `integration.app-to-analytics-data-flow` chain.
6. *(Trade-offs)* "Why might a team choose FastAPI over Django for one
   project, and the opposite for another?" — tests
   `compare.choosing-a-backend-framework`'s applied reasoning, not
   memorized facts.

### Important Distinctions

- This concept ≠ a new set of facts — every question above draws on a
  concept already taught; what's different is the *format*, deliberately
  unstructured and conversational rather than a targeted practice
  question with obvious context clues about which concept it's testing.
- A prepared, memorized answer to one of these exact questions ≠ the
  same as genuine understanding — the actual skill being practiced is
  reconstructing an explanation on the spot, which a rephrased or
  follow-up version of the same question would immediately expose if it
  were memorization rather than understanding.

### Why Does It Exist?

The curriculum's objective explicitly includes being ready to "start
working with the existing codebase" — which in practice often begins
with exactly this kind of conversational, on-the-spot explanation (in an
interview, or in a first week's conversations with a new team) rather
than a structured quiz; practicing the format itself has real value
beyond the underlying facts.

### Connections

- **Prerequisite (BLOCKING):** `revB.full-review` — this concept assumes
  the cross-curriculum connections are already fresh.
- **Related:** `revB.technology-comparison-recap` — question 6 above
  draws directly on it.

### Practice

Pick any one of the six questions above and answer it out loud (or in
writing), without looking at the source concept's own page first. Then
check your answer against that concept's actual content — where did
your explanation diverge, and was the gap a genuine misunderstanding or
just an incomplete phrasing?

### Mastery Check (Reason)

Write one new interview-style question of your own, for a concept from
this curriculum that none of the six examples above already covers, and
explain what specifically it's designed to test (not just recall, but
which mental model or reasoning skill).

---

## revB.architecture-review-and-final-mastery-check — Review overall architecture and how components interact

**Target depth:** Reason

### What Is It?

The curriculum's final capstone — a last-pass review of the overall
system architecture (`gcparch.overall-system-architecture`,
`integration.how-the-stack-fits-together`) combined with a comprehensive
mastery check spanning the entire 103-concept curriculum, checking
readiness against the curriculum's own originally-stated objective.

### Mental Model

Think of this as the final walkthrough before handing over the keys —
one last pass confirming the whole building's blueprint (the
architecture) is genuinely understood, and one last, comprehensive check
that nothing critical was missed along the way.

### How It Works

This concept has two parts. First, revisit the architecture: without
looking at Module 12 or 13's own pages, sketch the complete system from
a user's click to data landing in BigQuery, naming every layer and the
GCP services each layer runs on. Second, hold that sketch against the
curriculum's original, stated objective (`01-input-analysis.md`):
*"a clear understanding of the core concepts, the technologies being
used, their trade-offs, and how the complete stack fits together so I
can start working with the existing codebase."*

### Important Distinctions

- This concept ≠ yet another isolated review pass — it's specifically
  anchored back to the curriculum's own stated goal from the very first
  phase of planning, checking not just "do I remember things" but "does
  this actually satisfy what I set out to achieve."
- A confident architecture sketch ≠ sufficient on its own — the
  curriculum's objective also names trade-offs and codebase-readiness
  explicitly, both of which `revB.technology-comparison-recap` and
  `revB.interview-style-questions` respectively were built to check.

### Why Does It Exist?

Every curriculum needs a genuine closing checkpoint that ties back to
why it was started in the first place, rather than simply ending when
the last module's content runs out — this concept is that explicit
closure, in this curriculum's own words.

### Connections

- **Prerequisite (BLOCKING):** `gcparch.overall-system-architecture`,
  `integration.how-the-stack-fits-together`, `revB.full-review`,
  `revB.technology-comparison-recap`, `revB.interview-style-questions` —
  every other concept in this final module.

### Mastery Check (Reason) — the curriculum's final one, in three parts

1. **Architecture**: sketch the complete system, frontend to analytics,
   naming every layer and its GCP service, without referring back to
   Module 12 or 13.
2. **Trade-offs**: pick any two of the five comparisons from
   `revB.technology-comparison-recap` and explain, in one paragraph
   each, what would have to be true about a project for the *less
   common* choice (Flask over FastAPI, MongoDB over Postgres) to
   actually be the right one.
3. **Codebase readiness**: given an unfamiliar repository using this
   exact stack, describe the first five things you'd look for, in
   order, before writing any code — using
   `revA.basic-project-structure-walkthrough`'s and
   `integration.representative-project-structure`'s project-layout
   knowledge.

Honestly assess each of the three parts as Understood / Partially
understood / Needs revisiting — per `SKILL.md` §15's failure-handling
honesty principle, a curriculum this size having some genuine gaps at
the end is normal and expected, not a failure; the value is in knowing
precisely which ones, not in pretending there are none.

### Deeper / Deferred

None — this is the curriculum's own closing concept.
