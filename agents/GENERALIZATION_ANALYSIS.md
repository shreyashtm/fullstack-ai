# Generalization Analysis

This document is the audit trail behind `SKILL.md` and `AGENT.md`. It is
not required to *operate* the Skill or Agent — both of those are
self-contained. It exists so the extraction can be checked: for every
notable decision made in the reference project (a 14-day full-stack
engineering learning notebook, built in this same repository), it states
whether that decision became part of the reusable system, became a
documented configurable choice, or was left behind as specific to that one
project.

Three classifications are used throughout:

- **REUSABLE** — encoded directly into `SKILL.md`/`AGENT.md` as a rule,
  principle, or required structure. Every future project built with this
  system inherits it as-is.
- **CONFIGURABLE** — the *pattern* is reusable, but the specific choice
  must be re-derived per project (usually via a Decision Point in
  `AGENT.md` §6). The reference project's specific choice is recorded here
  as one example, not as a default baked into the system.
- **PROJECT-SPECIFIC** — belonged to that one project's subject matter,
  scope, or circumstances. Deliberately **not** present anywhere in
  `SKILL.md` or `AGENT.md`.

---

## Learning architecture

| Decision in the reference project | Classification | Reasoning |
|---|---|---|
| Notebook (curriculum/nav/notes/progress) vs. AI (explain/question/evaluate/doubt) as two separate owners with an explicit contract between them | **REUSABLE** | This boundary is what keeps the product from degrading into "a chatbot with a sidebar." Encoded as `SKILL.md` §10 and the contract requirement threaded through `AGENT.md`. |
| The exact `TeacherEngine` interface shape (`evaluateAnswer` / `askDoubt` / `explainInMode`, with a `TeacherContext` bundling the full concept + status + notes) | **REUSABLE as a pattern, CONFIGURABLE in exact method/field names** | The *shape* — one evaluation call, one doubt call, one mode-explanation call, all fed a complete context object — is the reusable insight. The literal TypeScript interface belongs to that project's stack. |
| Teaching loop: hook → visual → observation → explanation → example → demonstration → trace → question → answer → feedback → next layer | **REUSABLE** | This is a domain-agnostic sequence of cognitive steps, not a code-teaching-specific one. Encoded as `SKILL.md` §7. |
| Not every stage applies to every concept (e.g., a definitional concept doesn't need a trace) | **REUSABLE** | Explicitly called out in `SKILL.md` §7 to prevent future builds from mechanically forcing every section onto every concept. |

## Curriculum architecture

| Decision | Classification | Reasoning |
|---|---|---|
| "The curriculum is the source of truth; do not invent a different one; do not reorganize it because another structure seems better" | **REUSABLE** | This is the single most important rule extracted from the project brief itself. Encoded as `SKILL.md` §6 and `AGENT.md` Decision Points 2–3, with an explicit traceability mechanism (`AGENT.md` §9) so it's checkable, not just aspirational. |
| Because no curriculum document was actually attached to the originating request, one had to be authored from the request's own structural hints (named days, named tech stack) | **PROJECT-SPECIFIC** | This was a workaround for a missing input in that specific run, not a designed behavior. The reusable version of this situation is `AGENT.md` Decision Point 2, outcome (b): design a curriculum, mark it non-authoritative, document the rationale — a general procedure, not "look for hints in the prompt." |
| 14 days, 5 concepts per day (with Day 14 having 4) | **PROJECT-SPECIFIC** | An arbitrary sizing driven by that project's own duration framing ("14-day learning program"). `AGENT.md` Decision Point 4 explicitly forbids defaulting to this shape and instead derives hierarchy depth from actual scope/duration/convention. |
| Day → Concept as the hierarchy (2 levels) | **CONFIGURABLE** | Two levels happened to fit ~69 concepts across a stated 14-unit duration. `AGENT.md` Decision Point 4 generalizes this to a hierarchy-depth choice driven by concept count and domain convention (2-level for small scope, 3-level for larger, or a domain-specific convention). |
| The specific curriculum content (JavaScript → async → React → Next.js → HTTP → FastAPI → PostgreSQL → BigQuery → GCP) | **PROJECT-SPECIFIC** | This is exactly the kind of subject-matter content `SKILL.md`/`AGENT.md` must never contain. It lives only in that project's own `src/data/` folder, not in the extracted system. |
| Every concept, including "skeleton" ones, got a real practice question and a real repo-connection note, not a placeholder | **REUSABLE** | Generalizes into the "honesty about depth, never fake completeness" principle in `SKILL.md` §7/§14 and the incomplete-content failure-handling rule in `AGENT.md` §11. |

## Content organization

| Decision | Classification | Reasoning |
|---|---|---|
| Fixed concept-page section order: title → why it matters → visual → explanation → example → code → trace → key mental model → practice → notes → repo connection → prev/next nav | **REUSABLE as an ordering principle, CONFIGURABLE on which sections a given domain needs** | The order (intuition-building before formalization, practice before notes) generalizes. "Code" specifically is a stand-in for "demonstration in whatever form the domain uses" — `SKILL.md` §7 phrases it that way explicitly rather than assuming code. |
| "Key mental model" as a single, concise, always-present closing statement per concept | **REUSABLE** | A strong, domain-agnostic technique: force one crisp sentence a learner should retain, independent of subject. Kept verbatim as a required element in `SKILL.md` §7/§14. |
| "In a real codebase" repo-connection section (appearsIn / whatToInspect) | **CONFIGURABLE, generalized** | Extremely valuable for technical/professional subjects, meaningless for e.g. poetry analysis. Generalized to "practical application context," made optional per `SKILL.md`'s input contract and explicitly noted as omittable when it doesn't fit the domain. |

## Teaching methodology

| Decision | Classification | Reasoning |
|---|---|---|
| Progressive explanation: intuition paragraph → mechanism paragraph → "deeper/under the hood" paragraph | **REUSABLE** | Domain-agnostic progression. Encoded in `SKILL.md` §7. |
| Never reveal a correct answer outright; classify, explain what's right, name the misconception, give a corrected model, ask a smaller follow-up | **REUSABLE** | This is the project brief's own explicit, non-negotiable rule ("do NOT simply reveal the correct answer and move forward"). Encoded as a hard requirement in `SKILL.md` §7 and checked at `AGENT.md` Gate 8. |
| Four-way verdict classification (Correct / Partially Correct / Incorrect / Unclear) | **REUSABLE (as a shape), CONFIGURABLE (exact labels)** | The idea that "unclear" is a distinct outcome from "incorrect" (the learner didn't demonstrate reasoning either way, versus demonstrated wrong reasoning) is a genuinely useful distinction worth keeping as a pattern; exact label strings are not sacred. |
| Rule-based, keyword/overlap-based mock answer evaluator | **PROJECT-SPECIFIC (algorithm), REUSABLE (the surrounding principle)** | The specific word-overlap heuristic was one workable way to demonstrate the evaluation contract without a real model. The reusable principle — "if no real AI is available, build the full interface and an honest, clearly labeled mock behind the same contract" — is what's kept (`SKILL.md` §10, `AGENT.md` §11). The heuristic itself is not prescribed. |

## Visual-learning methodology

| Decision | Classification | Reasoning |
|---|---|---|
| Visual spec (data) separated from visual renderer (component), dispatched by a `type` discriminator | **REUSABLE** | A strong, transferable architecture technique independent of any particular UI framework. Encoded as `SKILL.md` §8's "architecture rule." |
| The eight specific visual archetypes built (variable/value, scope-chain, call-stack, event-loop, component-tree, flow, architecture, sequence) | **CONFIGURABLE, generalized** | Four of these are literally JS/React-specific in name. `SKILL.md` §8 restates them at the level of the *relationship they encode* (value-over-steps, nested/contained hierarchy, ordered structure, multi-lane timeline, tree/hierarchy, generic flow, box-and-connection architecture, actor sequence) so a math, biology, or finance project can map its own concepts onto the same underlying shapes without inheriting code-specific names. |
| "If a visual would just restate the paragraph in a box, don't build it" | **REUSABLE** | Directly generalizes the brief's own instruction ("do not simply put paragraphs inside boxes... do not use giant ASCII diagrams as the primary visual system"). Encoded as the visual "test" in `SKILL.md` §8. |
| Only 4 of ~69 concepts got a fully bespoke visual; the rest were marked as not-yet-authored rather than given a generic filler visual | **REUSABLE (the honesty rule), PROJECT-SPECIFIC (the 4/69 ratio)** | The ratio itself was a scope/effort tradeoff for that specific build. The underlying rule — depth is honestly represented, never faked uniformly — is generalized into the incomplete-content failure-handling entry in `AGENT.md` §11 and the deliverable spec in `SKILL.md` §14. |

## Interaction patterns

| Decision | Classification | Reasoning |
|---|---|---|
| Nine question archetypes (prediction, output, trace, why, debug, architecture, code-reading, compare, own-words) | **REUSABLE as a taxonomy, CONFIGURABLE in exact set** | Several of these are already domain-neutral in spirit even though named for code ("debug" → error identification, "code-reading" → artifact reading, "output" is a special case of "prediction"). `SKILL.md` §9 restates them generically (predict, explain-why, trace, identify-and-correct-an-error, compare, read-and-interpret-an-artifact, apply-to-a-new-scenario, own-words) so the same taxonomy serves any subject. |
| Every practice question ships with `keyPoints` used for evaluation, not just a single "correct answer" string | **REUSABLE** | Encodes that real understanding is multi-faceted; evaluation should check for the presence of several distinct ideas, not exact-match one phrase. Reflected in the evaluation-quality bar at `AGENT.md` Gate 8. |

## Assessment mechanisms

| Decision | Classification | Reasoning |
|---|---|---|
| `needsReview` as a boolean independent of the enum `status` field | **REUSABLE** | Lets "this concept is nominally understood but flagged" and "this concept was never attempted" be represented without conflating them. Kept in `SKILL.md` §12. |
| Confidence score derived from evaluation verdicts (85/55/25 for Correct/Partial/Incorrect, unchanged on Unclear) | **CONFIGURABLE** | The *existence* of a derived confidence signal is reusable (`SKILL.md` §12); the specific numeric mapping was an implementation detail of one mock evaluator, not a rule. |
| A dedicated "Revision + Assessment" unit at the end of the curriculum, built from cross-concept review, architecture reasoning, a cross-cutting debugging challenge, and a self-assessment grounded in the learner's own answer history | **REUSABLE as a pattern, CONFIGURABLE in shape** | "End with a review unit driven by actual weak-spot evidence, not a uniform retest" is kept in `SKILL.md` §7. The specific four sub-concepts built for it were shaped for a software-engineering curriculum's final day and are not prescribed. |

## Learner progression

| Decision | Classification | Reasoning |
|---|---|---|
| Free navigation everywhere, with a separately-indicated "recommended" sequential path (status icons + a suggested next/prev) | **REUSABLE** | Directly from the brief's own requirement ("do not force sequential navigation... clearly distinguish recommended progression from free navigation"). Kept as a hard requirement in `SKILL.md` §11. |
| Six-state status enum (NOT_STARTED, LEARNING, CHECKING, UNDERSTOOD, NEEDS_REVIEW, COMPLETED) | **REUSABLE as a progression shape, CONFIGURABLE in exact vocabulary** | `SKILL.md` §12 keeps the *shape* (not-started → learning → checking → understood → needs-review → completed) as a minimum, while noting the exact label strings are configurable. |
| Status is influenced by answer evaluation but the learner can always manually override it | **REUSABLE** | Directly reflects the brief's explicit rule ("mastery should not be purely dependent on clicking a button... however, I should always retain control"). Kept as a hard rule in `SKILL.md` §7/§11. |

## Notes and knowledge capture

| Decision | Classification | Reasoning |
|---|---|---|
| Notes are per-concept, freeform, persistent, and never reset by navigating away | **REUSABLE** | A direct, domain-agnostic requirement. Kept verbatim in `SKILL.md` §11/§12. |
| Suggested note structure (My understanding / Questions-confusion / Examples to remember) shown as textarea placeholder text only, not enforced structure | **CONFIGURABLE** | A reasonable default prompt, not a schema — a future project may want structured fields instead of freeform text; `SKILL.md` deliberately specifies "freeform text field, persisted" as the minimum, leaving structure as an implementation choice. |

## Progress tracking

| Decision | Classification | Reasoning |
|---|---|---|
| Progress shown at both per-unit and overall levels, computed (not manually set) from concept status | **REUSABLE** | Kept as a required element of the learner-state and deliverable specs (`SKILL.md` §12/§14). |
| Visual progress bar styling and exact percentage-display format | **PROJECT-SPECIFIC** | Presentation detail, not a rule. |

## AI teacher behavior

| Decision | Classification | Reasoning |
|---|---|---|
| Every AI-generated message in the UI carries a visible "MOCK" badge distinguishing it from a real model's output | **REUSABLE** | Directly generalizes the brief's explicit instruction ("do NOT fake AI... clearly marked mock interactions"). Kept as a hard rule in `SKILL.md` §10 and `AGENT.md` §11. |
| Seven teaching modes (simple, visual, example, code, trace, deeper, analogy), with analogy explicitly marked as non-technical | **REUSABLE as a taxonomy, CONFIGURABLE in exact set** | "Simple" and "analogy-marked-as-non-technical" are universal; "code" and "trace" are stand-ins for whatever a domain's demonstration/step-through mode looks like. `SKILL.md` §10 keeps the pattern and lets the exact mode set flex per domain. |
| Curated per-concept analogy/deeper text for a handful of concepts, generic fallback text for the rest | **PROJECT-SPECIFIC (the specific curated text), REUSABLE (the fallback-honesty pattern)** | The fallback explicitly told the learner the deep response isn't authored yet rather than inventing a weak one on the fly — that honesty pattern is kept; the actual authored analogies are not. |
| Doubt conversation history scoped per concept (not a single global chat log) | **REUSABLE** | Prevents the product from degrading into "one long chat," directly serving the "not a chatbot with a sidebar" principle. Kept in `SKILL.md` §11/§12. |

## Navigation model

| Decision | Classification | Reasoning |
|---|---|---|
| Three-pane desktop layout (curriculum | concept | teacher), collapsing to a tab-switched single pane on small screens | **CONFIGURABLE (specific layout), REUSABLE (the underlying requirement)** | The requirement — curriculum nav, concept content, and AI teacher all present but with the concept content getting the most visual weight, adapting sanely to small screens — is kept in `SKILL.md` §11 and `AGENT.md` Phase 4/§9. The specific 3-column/tab-bar implementation is one valid instance, not a mandate. |
| Auto-expanding the curriculum's current unit while preserving other units' manually-toggled open/closed state | **PROJECT-SPECIFIC (UI detail)** | A specific interaction nicety, not a principle worth encoding at the methodology level. |

## UX/UI principles

| Decision | Classification | Reasoning |
|---|---|---|
| "On opening, it should be obvious: what am I learning, where am I, what should I understand, what should I answer, where do I write, where can I ask, what's next" | **REUSABLE** | Taken essentially verbatim from the project brief's own success framing. Kept as `SKILL.md` §11's orientation requirement. |
| "Modern technical notebook + engineering whiteboard + interactive textbook," not generic SaaS/dashboard/doc-site | **CONFIGURABLE (the specific aesthetic), REUSABLE (the underlying rule)** | The *rule* — a coherent, domain-appropriate, non-generic visual identity, explicitly not a bare chat/doc-site feel — is kept in `SKILL.md` §11. The specific paper/ink whiteboard palette built for that project belongs to it alone; a biology notebook or a finance notebook would earn its own identity. |
| Responsive down to ~390px phone width, side gutters preserved, no meaning conveyed by color alone | **REUSABLE** | Kept as an explicit accessibility/quality standard in `SKILL.md` §15. |

## Technical architecture

| Decision | Classification | Reasoning |
|---|---|---|
| Separation of content / presentation / learner state / AI / persistence / analytics / deployment as distinct concerns | **REUSABLE** | This is the core transferable architecture insight, independent of any specific framework. Kept as `SKILL.md` §13's table. |
| React + TypeScript + Vite + Tailwind v4 + Zustand + localStorage | **PROJECT-SPECIFIC** | A concrete, reasonable choice for *that* request (a frontend prototype, no backend requested, inside a repo with no established conventions yet). `AGENT.md` Decision Point 12 explicitly forbids defaulting to this stack for unrelated future projects and instead re-derives the stack from the actual constraints each time. |
| Prototype/local-only persistence, designed so its shape maps cleanly onto a future backend | **REUSABLE** | The "build local, but shape state as if a backend already existed" principle is kept in `SKILL.md` §12/§13. The specific choice of `localStorage` + a particular state library is not. |
| Data-driven curriculum content (plain TypeScript objects/arrays, not JSX-embedded prose) decoupled from the UI components that render it | **REUSABLE** | The underlying idea — content is portable data, independent of the rendering layer — is kept as a technical architecture principle in `SKILL.md` §13. The specific TypeScript module structure is an implementation detail. |
| `TeacherContext` always carrying the *entire* concept object (not just an id) so the AI "never has to rediscover" state | **REUSABLE** | A specific, valuable instantiation of the general context-passing rule in `SKILL.md` §10. Kept as a rule, not tied to the specific object shape. |

## Implementation patterns

| Decision | Classification | Reasoning |
|---|---|---|
| A `TeacherEngine` interface with a mock implementation and a documented seam for a real one | **REUSABLE** | Concrete instance of the mock-vs-contract separation principle; the pattern (interface first, mock behind it, real implementation is a drop-in) is worth carrying forward generally, independent of the specific interface's method names. |
| Helper factory functions (e.g. a `skeletonConcept()` builder) to keep less-deeply-authored concepts consistent and low-boilerplate | **PROJECT-SPECIFIC** | A code-organization convenience specific to that codebase's language and structure, not a methodology-level rule. |

## Project structure

| Decision | Classification | Reasoning |
|---|---|---|
| One file per curriculum day/module under a `data/concepts/` folder, aggregated by a single index module | **PROJECT-SPECIFIC** | A file-organization convenience for that specific stack and curriculum size; `AGENT.md` explicitly leaves file/implementation format to be chosen per project (§9). |
| Reusable UI components grouped by responsibility (`components/curriculum/`, `components/concept/`, `components/teacher/`, `components/shared/`) | **CONFIGURABLE** | A sound general convention for *a component-based frontend framework specifically* — kept as an example of good separation, but not assumed for a project that isn't built that way (e.g., a Jupyter-notebook-based deliverable has no analogous structure). |

## Validation methodology

| Decision | Classification | Reasoning |
|---|---|---|
| Manually walking the literal golden path in a real browser (open first concept → notes → answer → feedback → doubt → next concept) before declaring the build done, using an actual headless-browser test rather than only static type-checking | **REUSABLE** | This caught a real, otherwise-invisible bug (see "Problems encountered" below) that `tsc`/build/lint all missed. Encoded as `AGENT.md` Gate 9 — a hard requirement, not optional polish. |
| Typecheck + production build + lint as a pre-condition before any manual walkthrough | **REUSABLE (as a floor), CONFIGURABLE (exact tools)** | "The implementation must build cleanly and pass the project's own static checks before behavioral validation" is kept as part of Gate 6; the specific toolchain (`tsc`, `vite build`, `oxlint`) is an implementation detail of that stack. |

## Problems encountered and solutions (worth carrying forward as lessons)

| Problem | Root cause | Resolution | Classification |
|---|---|---|---|
| Infinite re-render loop in the curriculum navigation, only visible at runtime (never caught by the type checker or the production build) | A state-store selector (`getProgress`) allocated a brand-new default object on every call for any concept with no progress yet, which broke the "stable snapshot" requirement of the framework's reactive-state subscription mechanism | Replaced the per-call factory with a single frozen singleton default object; for selectors that *must* compute a fresh derived object (e.g., aggregate progress counts), used a shallow-equality wrapper so re-renders only fire when the actual values change | **REUSABLE as a class of bug to watch for, PROJECT-SPECIFIC in exact fix** | The general lesson — "a reactive-state selector that returns a freshly-allocated object/array on every call can silently break the reactivity system, and this class of bug is invisible to static type-checking" — is exactly the kind of thing Gate 9's mandatory runtime walkthrough exists to catch, regardless of which framework or state library a future project uses. The specific fix (a frozen singleton, `useShallow`) is tied to this project's specific stack. |
| A new dependency's first use during an active dev-server session triggered the bundler's dependency-optimizer to reload mid-session with a stale module graph, producing a misleading "invalid hook call" error that looked like a real code bug | Development-server dependency pre-bundling cache invalidation, unrelated to application code | Cleared the dev-server's dependency cache and did a clean restart before concluding the error was a real bug | **PROJECT-SPECIFIC** | A tooling quirk of one specific dev-server/bundler, not a methodology-level lesson — though the meta-lesson "rule out a tooling/cache artifact before assuming a fresh error is a logic bug" is a reasonable general debugging habit, it's too generic to encode as notebook-building-specific guidance. |

## Solutions and design decisions (meta-level)

| Decision | Classification | Reasoning |
|---|---|---|
| When the request referenced "attached" curriculum/source documents that were not actually present, and no research-augmentation tool (e.g., a connected research assistant) was available either, proceed by authoring the curriculum from the request's own explicit structural hints and general domain knowledge, rather than stalling | **REUSABLE as a procedure** | Generalized into `AGENT.md`'s failure-handling table: "poor/unclear source material" → flag what's unusable, propose filling gaps from general domain knowledge or asking for a better source, and into Decision Point 2's outcome (b) for when no curriculum is supplied at all. |
| Deepening already-written content with a second pass (adding a third, more technical paragraph and richer practice-question key points) when asked for "research-level" rigor, rather than only applying that bar going forward | **REUSABLE** | Generalizes into the instructional-quality and conceptual-correctness standards in `SKILL.md` §15 — depth and rigor are a property of every concept delivered, not just ones authored after a rigor request was made. |

## Project-specific decisions (explicitly excluded from the reusable system)

For completeness, the following were deliberately **not** carried into
`SKILL.md`/`AGENT.md` in any form, configurable or otherwise, because they
are entirely bound to the one subject and one build this system was
extracted from:

- The specific 14-day duration and "full-stack AI" subject framing.
- Every concept title, explanation, code example, and practice-question
  answer key actually authored for that curriculum.
- The specific visual data (e.g., the exact variable names and values used
  in the Variables & Values walkthrough).
- The specific color palette, font choices, and CSS custom-property names.
- The specific npm packages and their version numbers.
- The specific git branching/commit conventions used to deliver that one
  project.
