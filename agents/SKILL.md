---
name: learning-notebook-builder
description: Use when asked to design or build an interactive learning notebook, study companion, curriculum-driven learning app, or AI-tutor-backed course experience for any subject (programming, math, science, certification prep, corporate training, languages, humanities). Covers curriculum modeling, learning-experience design, visual-learning strategy, interaction/assessment design, AI-teacher behavior, and technical architecture for a notebook-style product — not a static document, slide deck, or bare chatbot. Extracted and generalized from a working reference implementation (a 14-day full-stack engineering notebook); contains no subject-specific content of its own.
---

# Learning Notebook Builder — Skill

> This Skill is the *methodology*. It is deliberately empty of any specific
> subject matter. It was extracted from one concrete, working learning
> notebook (a 14-day full-stack engineering curriculum) but every
> topic-specific fact from that project has been stripped out — see
> `GENERALIZATION_ANALYSIS.md` in this folder for exactly what was kept,
> configured, or discarded and why. If you find yourself typing "JavaScript"
> or "14 days" while applying this Skill to a new subject, stop — that
> means you're copying the source project instead of using the method.

## 1. Purpose

This Skill defines how to turn a body of knowledge — a curriculum, a
syllabus, a certification's objectives, or just a stated learning goal —
into a working **interactive learning notebook**: a persistent, navigable,
per-concept learning surface paired with an AI teacher that explains,
questions, evaluates, and adapts.

It solves a specific problem that neither of the two easy defaults solves
well:

- Writing static content (docs, slides, a wiki) teaches nothing — it has no
  memory of the learner, asks no questions, and can't tell whether anyone
  actually understood it.
- Wiring a bare chatbot onto a topic teaches inconsistently — it has no
  persistent structure, no guaranteed coverage of the curriculum, no notes,
  no progress, and easily drifts off the intended sequence.

The Skill's job is the middle path: a product that is simultaneously an
**interactive textbook**, a **personal notebook**, and a **private tutor**,
where the notebook owns structure and the tutor owns adaptivity, and
neither one replaces the other.

**Primary vs. secondary.** Within that middle path, the two halves are not
peers: the curriculum is the **primary** objective and must be a complete,
conceptually rich, self-sufficient body of learning content — valuable,
navigable, and teaching-complete even if the AI layer never says a word.
The AI teacher is **secondary**: an adaptive layer that observes, diagnoses,
clarifies, and re-tests, but never the mechanism by which a concept is
first taught. See §17 for how this ordering governs every trade-off in the
rest of this Skill.

## 2. Scope

**Applies to** building a new interactive learning notebook, substantially
extending or restructuring an existing one, or adapting this methodology to
a new subject area. The subject is unconstrained: programming languages and
frameworks, mathematics, machine learning, system design, finance, biology,
history, cloud platforms, exam/certification preparation, university
courses, professional/corporate training, language learning — anything with
concepts that can be sequenced, explained, and checked for understanding.

**Does not apply to**:

- Answering a single question or explaining one concept (just answer it).
- Producing a single static document, slide deck, or course outline with no
  interactivity or persistent learner state (use a document/slide skill).
- Building a generic chatbot or Q&A assistant with no persistent
  curriculum, navigation, or learner state.
- Grading or reviewing a single piece of work (that's assessment, not
  curriculum-driven learning).
- Building a marketing/sales page for a course.

## 3. When to use

Trigger on requests shaped like:

- "Build me an interactive learning notebook / study app / tutor for X."
- "Turn this curriculum/syllabus into something I can actually learn from."
- "I want an AI teacher that walks me through \[subject\] with exercises and
  progress tracking."
- "Create a study companion for my \[certification / course / exam\]."
- "Make an internal training tool for \[team/skill\] at my company."

## 4. When not to use

- The user wants a single explanation, answer, or one-off lesson.
- The user wants a plain outline, slide deck, or document as the final
  artifact, with no interactivity or state (route to the appropriate
  document/slide-authoring path instead; this Skill's curriculum and
  content-methodology sections may still inform the writing, but its
  product/technical-architecture sections do not apply).
- The user explicitly wants a bare conversational assistant with no
  persistent structure.
- The ask is to grade, review, or critique existing learner work in
  isolation, with no notebook context around it.

## 5. Input Contract

The system needs some information from the user to build a good notebook.
Not all of it is required — most has a sane default. Ask only for what is
genuinely required and cannot be inferred (see `AGENT.md` §3 and §6 Decision
Point 13 for exactly when to ask versus default).

| Input | Purpose | Required? | Expected format | If absent |
|---|---|---|---|---|
| **Learning topic / subject** | Defines what is being taught at all. | **Required** | A short phrase or sentence ("Postgres for backend engineers", "AP Biology", "AWS Solutions Architect Associate"). | Cannot proceed — this is the one truly required input (see Decision Point 1). |
| **Learner profile** | Calibrates vocabulary, assumed prior knowledge, and pacing. | Optional | Free text: role, experience level, prior background. | Default to "motivated adult learner with no assumed prior knowledge of this specific subject" and state the assumption. |
| **Learning objective** | Defines what "done" means and how deep to go. | Optional (strongly recommended) | Free text: what the learner should be able to do afterward. | Default to "a working practitioner-level understanding sufficient to read, discuss, and apply the subject's core concepts," and state the assumption. |
| **Curriculum / content list** | May supply the actual topic sequence to teach. | Optional | An ordered or unordered list of topics/chapters/objectives, in any format (prose, bullet list, pasted table of contents, a certification's official objective list, a link/reference to one). | If absent, the system designs a curriculum from the objective and depth (see §6); it is then **not authoritative** — see §6 for what that changes. |
| **Target depth** | Calibrates how much content per concept, and how far to go. | Optional | One of: overview/awareness, working practitioner competence, deep/expert mastery, exam-pass competence — or free text. | Default to "working practitioner competence" and state the assumption. |
| **Duration, if relevant** | Calibrates pacing and total scope, if the learner has a timeframe. | Optional | A number of days/weeks, a total hour budget, or "no fixed timeframe." | Default to no fixed timeframe; size the curriculum to the objective and depth instead of a duration (do not invent a duration that wasn't asked for). |
| **Practical application context** | Determines whether/how to connect concepts to real practice (a codebase, a workplace task, a real dataset, a real exam format). | Optional | Free text: "I want to apply this at my job doing X," "this is for passing exam Y," "purely for personal interest." | Default to a generic, honest connection to how the subject is actually used in practice where that's meaningful for the domain; omit entirely for purely theoretical/humanities subjects where it doesn't fit naturally. |
| **Available resources** | Existing material to build from or constraints on sourcing (a textbook, an existing repo, existing slides, no external resources allowed). | Optional | Free text, file(s), links, or "none — design from scratch." | Default to designing from general domain knowledge; flag explicitly if factual accuracy in a specialized domain can't be confidently verified (see §14). |
| **Constraints** | Technical, accessibility, organizational, or policy limits. | Optional | Free text: required tech stack, must be static/offline, must integrate with an existing system, accessibility requirements, no external AI calls allowed, etc. | Default to no constraints beyond the general quality standards in §14. |
| **Implementation preferences** | Desired form of the deliverable and its technical shape. | Optional | Free text: "a web app," "a Jupyter notebook," "inside my existing repo using X," "just design it, don't build it yet." | Default to a working, browser-based interactive prototype unless the subject/domain strongly implies another form (see Decision Points 11–12 in `AGENT.md`). |

## 6. Curriculum Principles

**Authoritative vs. non-authoritative.** A curriculum is **authoritative**
when the user supplies a structured sequence of topics and clearly intends
it to be followed — a pasted syllabus, a certification's official objective
list, "use this outline," a specific textbook's table of contents. A
curriculum is **non-authoritative** (i.e., there isn't one yet) when the
user only describes a subject and a goal and expects the system to design
the sequence.

**Rules for an authoritative curriculum:**

- Every item the user supplied must end up covered, in a recognizable form,
  somewhere in the final concept map. No item is dropped, silently merged
  beyond recognition, or reordered into a materially different sequence
  just because another structure looks cleaner.
- **Enrichment is allowed:** adding prerequisite concepts the list didn't
  spell out but later items depend on; splitting an oversized single item
  into multiple concept pages; adding a review/assessment unit; adding
  cross-references between concepts; adding depth within an item.
- **Restructuring is not allowed without asking:** removing an item,
  merging two listed items into one in a way that loses their distinct
  identity, or reordering items in a way that changes what depends on what.
- Maintain **traceability**: it must always be possible to point at any
  original curriculum item and say exactly where in the finished notebook
  it is taught (see `AGENT.md` §9 for the mechanism).

**Designing a non-authoritative curriculum**, when none is supplied:

1. Derive scope from the objective and target depth, not from an arbitrary
   guess at "how much content" is expected.
2. Default to the domain's own standard progression where one exists (a
   well-established subject usually has a conventional teaching order —
   use it rather than inventing a new one).
3. Produce an explicit, navigable hierarchy — never leave the sequence
   implicit inside a single, un-inspectable prompt to an AI model.
4. Sequence by prerequisite dependency first, then by increasing
   complexity within what's unlocked at each point.

**Validation** (applies to both authoritative and designed curricula) —
check for:

- **Coverage gaps** against the stated objective.
- **Duplicate or overlapping** concepts that should be one.
- **Concepts with unclear boundaries** (where does this one end and the
  next begin?).
- **Sequencing problems**: circular dependencies, or a concept that
  requires something not introduced until later.
- **Depth mismatches**: a concept assuming knowledge the learner profile
  doesn't have and the curriculum hasn't taught yet.

Never silently delete user-provided scope to resolve a validation issue —
see `AGENT.md` Decision Point 3.

**Mapping to learning units.** Choose whatever hierarchy depth and
vocabulary fits the domain, duration, and total concept count — a fixed
"N days × M concepts" shape is one possible instance of this, not a
requirement (see `AGENT.md` Decision Point 4). Small scopes may need only
Unit → Concept; larger ones may need Module → Unit → Concept, or whatever
vocabulary the domain conventionally uses (Course → Chapter → Lesson,
Track → Section, etc.).

**Concept relationship graph.** A curriculum is not only a sequence — it is
a graph. Every concept records its relationships to others, classified as:

- **Prerequisite / BLOCKING** — the learner cannot reliably build a mental
  model of this concept without already having this one; a genuine gap
  here must be resolved before continuing (see the prerequisite-resolution
  procedure below).
- **Related** — worth knowing and connected, but not required to
  understand this concept.
- **Enables** — concepts this one unlocks or is a foundation for.
- **Deeper / Deferred** — a genuinely related concept that goes beyond this
  concept's target depth (§7); acknowledged by name, not taught inline.
- **On-demand** — a tangent a learner might reasonably ask about, worth
  having an answer ready for, but never surfaced proactively.

Record these explicitly as structured data per concept (the same "separate
data from rendering" discipline as visuals, §8) — never leave them implicit
in prose. They drive three things: curriculum sequencing (prerequisite-first
ordering, above), the rendered "Connections" section on the concept page
(§7), and the AI Teacher's gap-detection behavior at runtime (`AGENT.md`
Decision Point 6/9).

**Cross-technology and cross-layer connections.** When a curriculum spans
multiple technologies, frameworks, or system layers, the relationship graph
must make the connections *between* them explicit, not just connections
within one layer — e.g. an early language-level concept that a later
framework's runtime behavior silently depends on, or a storage-layer
concept that a later analytics/reporting layer builds on. These cross-layer
chains are exactly the kind of connection a learner cannot discover on
their own from either page in isolation, which is what makes them required
rather than optional enrichment.

**Bounding conceptual richness.** The relationship graph exists to identify
the concepts necessary for a *reliable mental model* — not to justify
teaching everything technically connected to everything else. When a
related concept is genuinely useful but beyond the current concept's
target depth, classify it Deeper/Deferred and name it without teaching it.
Never let "this is technically related" alone promote a concept from
Deferred into required content.

**Prerequisite resolution at runtime.** When a learner's answer or question
reveals a missing prerequisite:

```
Current concept
      ↓
Missing prerequisite (classified BLOCKING?)
      ↓
Small, targeted explanation of only that gap
      ↓
Return to the current concept
```

Resolve only the amount necessary to unblock the current concept — never
redirect the learner into an unrelated chapter to backfill it wholesale. A
Related, Deeper, or On-demand gap does not trigger this procedure; only a
BLOCKING one does.

## 7. Learning Experience Methodology

**The concept structure.** Each concept, at whatever depth is warranted, is
built from some or all of these sections, always in this order when
present — not every section applies to every concept (a small, simple
concept may not need "Common Misconceptions" or a "Trace"; use judgment
based on the concept's actual complexity, never force all thirteen onto a
one-line definitional term):

```
What Is It?
        ↓
Mental Model
        ↓
How It Works
        ↓
Important Distinctions
        ↓
Why Does It Exist?
        ↓
Connections
        ↓
Production Appearance
        ↓
Example  →  Trace (when the concept has state, sequence, or process)
        ↓
Common Misconceptions
        ↓
Practice
        ↓
Code Reading (when unfamiliar-code recognition is part of the goal)
        ↓
Mastery Check
        ↓
Deeper / Deferred
```

This structure — not a conversational hook, and not the AI Teacher — is the
concept's complete first exposure. The page must be teaching-complete on
its own; see §1 and §17 for why this ordering is non-negotiable.

**What vs. why — do not merge them, and never invert the order.** "What Is
It?" answers: what is this thing, what does the term mean, what does it
represent, what happens when it's used. "Why Does It Exist?" answers: what
problem it solves, why the language/framework/system behaves this way.
Both matter, but a learner cannot evaluate *why* something was needed
before they know *what* it is — so "What Is It?" always comes first, and a
motivating scenario or "why this matters" hook must never open a concept.

**What Is It?** A precise, technically accurate definition, kept concise.
This is the conceptual anchor everything else on the page hangs off of —
get it right and get it stated plainly before anything else.

**Mental Model.** An intuitive model that makes the definition easier to
reason about and predict from. End this section on one crisp, quotable
sentence the learner can retain — the single-sentence crystallization a
prior version of this Skill treated as its own closing section now lives
here instead, moved earlier rather than dropped.

**How It Works.** The actual mechanism, generally through a small worked
case (code, a formula, a step sequence — whatever "show me how this
actually works" means in this domain). Multiple short paragraphs of
increasing technical precision beat one dense paragraph of jargon.

**Important Distinctions.** Surface the specific confusions that would
otherwise bite the learner later — pairs like "assignment ≠ equality" or
"reassignment ≠ mutation," stated explicitly rather than left for the
learner to infer. This section carries extra weight for foundational
concepts (see the foundational-concepts principle below).

**Why Does It Exist?** Only now, with the what and how established, explain
the problem the concept solves and why the surrounding system is shaped
the way it is.

**Connections.** Render the concept's relationship-graph data (§6):
prerequisites, related concepts, what it enables, and what's
Deeper/Deferred — including cross-technology chains where the curriculum
spans more than one layer. Bounded by §6's richness rule: named, not
taught inline, for anything beyond this concept's target depth.

**Production Appearance.** Where this concept actually shows up in real
work, and what to look for when it does.

**Example.** At least one small, concrete, realistic example, understandable
on its own without the rest of the curriculum as context.

**Trace.** Where the concept has state, sequence, or process, walk through
it step by step.

**Common Misconceptions.** Name specific incorrect mental models explicitly
— this is curriculum content in its own right, present on the page whether
or not the AI Teacher ever runs, not only something the teacher detects
live from a wrong answer (that live detection, §10, is a second, adaptive
layer on top of this static one, not a replacement for it).

**Practice.** Every concept that represents genuine understanding (as
opposed to pure reference/glossary material) carries at least one practice
exercise that requires reasoning, not recall. A concept central to the
stated objective may warrant more than one, using different interaction
archetypes (§9).

**Code Reading.** Where recognizing the concept in unfamiliar code/artifacts
is part of the goal, include a short unfamiliar example and ask the learner
to read it — the "read and interpret a given artifact" archetype (§9).

**Mastery Check.** A check that actually tests understanding at the
concept's assigned target depth (below), not a repeat of the Practice
question.

**Deeper / Deferred.** Name the concepts that exist underneath this one but
are not required at the current target depth — acknowledged, not taught.

**Synthesis and capstone concepts.** Not every concept teaches a new
mechanism. A recurring, legitimate concept type instead ties several
already-taught concepts together — a Phase- or unit-closing review, a
"how the whole system fits together" concept, a final capstone. For this
type, the standard sections mean something different, not something
absent: What Is It? answers "what does this tie together" rather than
"what is this mechanism"; Why Does It Exist? answers "why does the
curriculum need this checkpoint here" rather than "what problem does the
underlying thing solve"; Connections *is* the bulk of the content, not a
short closing list; and Deeper/Deferred is often honestly empty ("None —
this concept intentionally introduces nothing new") rather than force-fit
with an invented deferred topic. Recognize this type by asking whether the
concept's job is teaching something new or checking that things already
taught actually connect — don't apply the teaching-concept template to a
synthesis concept just because it's the default.

**Target depth per concept.** Every concept carries an explicit target
depth from this scale:

| Level | Means the learner can... |
|---|---|
| Recognize | identify/name it when they see it |
| Understand | explain it correctly in their own words |
| Use | apply it correctly in a straightforward case |
| Reason | predict, debug, or compare it in a novel situation |
| Master | teach it, extend it, or improvise correctly beyond taught cases |

Most concepts that matter for real practice should target **Understand →
Use → Reason**. Do not let target depth drift toward Master by default for
every concept — that is a deliberate scope decision (`AGENT.md` §6), not an
automatic ceiling. Target depth governs how far Mastery Check pushes and
how much a Deeper/Deferred link is worth surfacing versus leaving named.

**Conceptual richness, not word count.** A strong concept explanation makes
it possible for the learner to answer: what is it, what does it do, how
does it behave, why does it exist, what does it depend on, what depends on
it, what is it commonly confused with, where will they encounter it, how
will they recognize it in unfamiliar code, and what should they know about
it at their current depth. Chasing this checklist is what "conceptually
rich" means here — padding a section with extra prose that doesn't answer
one of these questions is not richness.

**Foundational concepts require extra care.** A concept that a large
portion of later material silently depends on deserves more care in its
What Is It? and Mental Model sections than an ordinary concept — write them
as if for a learner who has only ever used the surrounding *term* loosely,
never assuming that familiarity with a word implies the underlying model is
already correct. Which concepts in a given subject are foundational in
this sense is determined per project during curriculum modeling (§6); this
Skill deliberately does not hardcode any subject's list.

**Feedback.** Never a bare right/wrong. Every evaluated answer gets: a
classification (§10), what the learner got right, the specific
misconception if there is one, a corrected mental model, and — if not
fully correct — a smaller, targeted follow-up question rather than an
immediate re-explanation of everything. Revealing the "correct answer"
outright with no scaffolding is a quality violation, not a shortcut.

**Reinforcement and review.** Concepts with a partial/incorrect evaluation
history are tracked as needing review (§12). Build a review/assessment unit
near the end of the curriculum that revisits weak spots using the
learner's *own* history as the source of what to revisit — not a uniform
re-test of everything regardless of how it went the first time.

When the deliverable is content-only — no learner-state layer has been
built at all yet, not merely an AI layer that's mocked (§10's honesty
rule) — there is no answer history to drive this from. Build the review
unit anyway, as an honest, clearly-labeled *representative* self-check
covering the curriculum's real connections, and say so plainly in the
content itself rather than presenting it as if real evaluation history
shaped it. This is the same honesty principle as a mocked AI teacher,
applied one layer down — to a review mechanism with no state to read from
at all, not just an AI with no model behind it.

**Mastery.** Status is influenced by evaluation history but never decided
by a single answer alone, and the learner retains override control over
their own status and navigation at all times — mastery is evidence-informed,
not algorithm-dictated, never gate-kept behind a locked door the learner
can't open manually, and never advanced purely by having chatted with the
AI Teacher (§12).

## 8. Visual-Learning Methodology

**The test for whether a visual belongs:** it must encode a relationship,
a transformation, a state change, a structure, or a comparison that prose
alone would convey less directly. If a proposed visual would just restate
the paragraph next to it inside a box, it doesn't belong — the concept
should carry an honest note that it doesn't have (or need) a custom visual
rather than a decorative one for its own sake.

**Reusable visual archetypes** (domain-agnostic; pick from this list before
inventing a new shape):

| Archetype | Teaches | Typical use |
|---|---|---|
| Value/state-over-steps | How a value or quantity changes across a sequence of operations | Variable assignment, a running total, a chemical concentration over a reaction |
| Nested/contained scope or hierarchy | What is visible from where, or what is part of what | Lexical scope, organizational structure, taxonomy, containment |
| Stack/queue/ordered structure | Order of processing, what's "on top" or "next" | A call stack, a task queue, a stack-based algorithm |
| Timeline / multi-lane concurrent process | Multiple things happening over time, with ordering rules between lanes | An event loop, a project timeline, concurrent biological/chemical processes |
| Tree / hierarchy with relationships | Parent/child, whole/part, cause/effect structure | A component tree, an org chart, a phylogenetic tree, a decision tree, a concept's own prerequisite/related/enables graph (§6) |
| Generic ordered flow | A linear or branching sequence of steps | A request lifecycle, a recipe, an algorithm, a historical sequence of events |
| Box-and-connection architecture | How discrete parts of a system relate | A system architecture, a supply chain, an ecosystem's parts |
| Actor-to-actor sequence | Who sends what to whom, in what order | A request/response exchange, a negotiation, a multi-party protocol |
| Before/after or side-by-side comparison | What changed, or how two things differ | Refactoring, a chemical reaction's reactants/products, comparative economics |

Extend this vocabulary only when a genuinely recurring relationship shape
appears in the domain that none of the above capture well (e.g., a labeled
anatomical diagram for biology, a plotted function for mathematics, a
cash-flow timeline for finance) — and treat the addition as a reusable
archetype for that domain, not a one-off.

**Architecture rule.** Separate a visual's **data** (a small, typed
specification describing what to show — values, steps, nodes, connections)
from its **rendering** (the component/template that draws that
specification). Dispatch by a `type` field to the right renderer. This
keeps the visual language consistent across the whole notebook and keeps
authoring a new concept's visual a data-authoring task, not a
component-building task, once the archetype already exists.

## 9. Interaction Methodology

**Reusable question archetypes** (domain-agnostic):

| Archetype | What it verifies |
|---|---|
| Predict/forecast an outcome | Can the learner run the mental model forward? |
| Explain why | Does the learner understand the mechanism, not just the fact? |
| Trace / step through | Can the learner follow a process's actual sequence of state? |
| Identify and correct an error | Can the learner recognize a violation of the concept, not just recite it? |
| Compare two approaches/concepts | Does the learner understand the actual tradeoff, not just both definitions in isolation? |
| Read and interpret a given artifact | Can the learner extract meaning from a real instance (code, a passage, a diagram, a dataset), not just a textbook statement? |
| Apply to a new scenario | Can the learner transfer the concept outside the exact example it was taught with? |
| Explain in your own words | Can the learner reconstruct the idea without leaning on the source phrasing? |

Choose the archetype by asking what mental operation actually needs
verifying — pure recall/definition questions are the weakest signal of
understanding and should be reserved for genuine terminology/vocabulary
concepts, not used as the default for everything.

**Code Reading** (§7) uses the "read and interpret a given artifact"
archetype above, applied specifically to unfamiliar code/artifacts rather
than the concept's own worked example.

**Mastery Check** (§7) is not a new archetype — it is a checkpoint that
applies one or more of the archetypes above at the concept's assigned
target depth (§7), escalating toward Reason for concepts meant to reach
that depth.

## 10. AI Teacher Methodology

**The boundary — and which side is primary.** The notebook owns curriculum,
navigation, presentation, notes, and progress, **and the complete first
teaching of every concept** (§7). The AI is a secondary, adaptive layer that
observes, diagnoses, clarifies, and re-tests — it never becomes the place
where a concept is actually taught for the first time. This boundary must
be expressed as an explicit interface/contract the product code enforces —
not an implicit convention left to a prompt, and not something that quietly
inverts under pressure to make the AI "helpful" by explaining more.

**Context-passing rule.** Every call into the AI layer must be handed the
full relevant context: the current phase/module/unit and concept (including
that concept's full content, not just its id/title), the concept's declared
prerequisites and related concepts (§6), its target depth (§7), which
concepts are already completed, the concept's current status, the
learner's own notes on it, and the specific question/answer in play for an
evaluation call. The AI must never need to "rediscover" where the learner
is or what the curriculum already told them.

**Required AI behaviors** — diagnostic and adaptive, not primary delivery:

- **Diagnostic teaching** — when the learner asks for clarification, start
  by localizing what's actually missing (a small question, or asking the
  learner to restate the concept) rather than re-explaining the whole page.
- **Gap detection** — from a wrong or unclear answer, determine whether the
  real issue is this concept or a missing prerequisite, and classify a
  prerequisite gap as BLOCKING / RELATED / DEEPER-DEFERRED / ON-DEMAND
  (§6). Resolve only a BLOCKING gap, briefly, in place, then return to the
  current concept — never redirect into an unrelated chapter (§6).
- **Clarification** — re-explain from a genuinely different angle (a
  different teaching mode: analogy, worked trace, alternate example) only
  when the curriculum's own explanation was insufficient for this learner;
  never simply repeat the page's own words back.
- **Socratic questioning** — ask questions that reveal whether the learner
  actually understands, proactively, not only in response to being asked.
- **Evaluate** — classify every submitted answer (Correct / Partially
  Correct / Incorrect / Unclear), state what's right, name the
  misconception, offer a corrected mental model, and — unless fully
  correct — ask a smaller, targeted follow-up. Never a bare verdict.
- **Misconception resolution** — identify the mental model actually behind
  an incorrect answer, not just that it's incorrect.
- **Adaptive depth** — go deeper (toward Reason, §7) when the learner's
  answers show they're ready for it; offer, never force.
- **Reinforcement** — a further example or exercise when the evaluation
  history warrants it.
- **Transfer** — ask the learner to apply the concept to a new scenario,
  once they've shown basic understanding.
- **Re-teach differently**, via explicit, selectable **teaching modes**.
  "Simpler" should always be available; add whatever additional modes fit
  the domain (visual, worked-example, code/demonstration, step-through,
  one-layer-deeper, analogy). An **analogy is always explicitly marked as
  a non-technical aid**, never presented as the actual technical model.
- **Answer arbitrary doubts** without losing the learner's place — after
  answering, the learner returns to exactly where they were.
- **Maintain context** across all of the above (see context-passing rule).

**What the AI must not do:** open a concept with its own explanation before
the learner has read the curriculum's own What Is It?/Mental Model/How It
Works sections; become the only place a required section's content
actually lives; or advance a concept's status past what the curriculum-side
evidence supports purely because a conversation happened (§12).

**When no real AI backend is available.** Build the complete teacher
interface and interaction pattern anyway. Implement a clearly-labeled
rule-based/mock engine behind the exact same interface a real model would
use, and never present the mock's output as more capable or more "real"
than it is — every mock-generated response should be visibly marked as
such in the product. Define the real interface precisely enough that
swapping in an actual model requires no changes to any calling code.

## 11. Notebook / Product Principles

**Product identity:** interactive textbook + personal notebook + visual
classroom + private tutor. Explicitly **not**: a chat window with a
curriculum sidebar bolted on; a static documentation site; a slide deck; a
generic dashboard.

The primary content a learner works through must live on a **persistent,
structured page per concept** — not inside a conversation transcript. The
AI is an assistant layer alongside that page, never the container for it.

That persistent page must be **sufficient on its own**: a learner who never
opens the AI Teacher must still be able to reach full understanding at the
concept's target depth from the page alone (§7). The AI Teacher is a
secondary, contextual control — available, never dominant, and never a
mandatory gate. Do not force an AI-Teacher turn between concepts or
sections (no "ask the AI Teacher to continue" pattern); surface it instead
as a clearly optional affordance ("Need clarification?", "Check your
understanding", "Why does this work this way?") the learner reaches for
when they choose to, not one the product routes them through.

On opening the product, without any further explanation, it must be
obvious: what am I learning, where am I, what should I understand here,
what should I answer, where do I write my own understanding, where can I
ask a question, and what comes next.

Navigation must support both a **recommended sequential path** and **free
jump-anywhere navigation**, visually distinguished from each other, with
the learner's position persisted across sessions.

## 12. Learner-State Principles

At minimum, represent:

- **Current position** (which unit/concept the learner is on).
- **Per-concept status**, representing *knowledge*, not chat activity,
  from a small, ordered set spanning at least: not started → introduced →
  understood → applied → verified. (Exact vocabulary is configurable; the
  progression shape is not.) Status advances on curriculum-side evidence —
  reading a concept, submitting practice, passing a mastery check — never
  purely from having exchanged messages with the AI Teacher; a
  conversation may *inform* an evaluation that then advances status, but
  chatting alone must never auto-advance it (§7, §10).
- **Per-concept notes** — freeform, persistent, never lost on navigation
  away and back.
- **Answer history per concept**, each entry paired with its evaluation
  (not just the raw submitted text).
- **Doubt/conversation history**, scoped per concept — returning to a
  concept should show that concept's own prior conversation, not a global
  transcript.
- A derived **confidence/mastery signal** informed by evaluation history.
- A **needs-review** flag, useful even independent of the status field.
- **Last-studied timestamp** per concept.
- **Aggregate progress**, per unit and overall.

**Persistence.** Local or in-memory state is acceptable for a prototype —
but design its shape as if a real backend already sat behind it. No later
persistence decision should require restructuring this shape.

## 13. Technical Architecture Principles

Separate these concerns regardless of the chosen stack:

| Concern | Owns |
|---|---|
| Content | The curriculum and concept data — static, versionable, independent of the runtime, and complete on its own: text, examples, and the relationship-graph edges (§6), not only ids. |
| Presentation | The UI rendering content + state. |
| Learner state | The store described in §12. |
| AI | The teacher engine behind the explicit contract from §10 — secondary to Content, never required for Content to be complete or consumable; swappable mock/real implementations. |
| Persistence | Currently local for a prototype; designed to be replaced by a real backend without reshaping the learner-state model. |
| Analytics | Out of scope for an MVP by default — but the learner-state shape must not preclude adding it later. |
| Deployment | Out of scope for an MVP by default; note the eventual target only if the user asks. |

Prefer plain, portable data (objects, JSON/YAML, or markdown with
structured frontmatter) for concept content, decoupled from whatever UI
framework renders it — this keeps content authorable, reviewable, and
portable independent of a later framework change.

Match implementation complexity to actual requirements — neither
over-engineer a prototype with infrastructure nobody asked for, nor
under-engineer past the point where a quality standard in §14 breaks (see
`AGENT.md` Decision Point 11).

## 14. Deliverable Specification

| Deliverable | Purpose | Expected format | Minimum requirement | Completion criteria |
|---|---|---|---|---|
| Runnable notebook | The actual product the learner uses | Working software, in whatever form fits the implementation preference (web app, notebook file, etc.) | Builds/runs without errors | Golden path (see `AGENT.md` Gate 9) walks through cleanly |
| Curriculum | The authoritative or designed topic structure | An explicit, inspectable hierarchy (not buried in a prompt) | Every concept has an id, a title, and a place in the hierarchy | Passes curriculum validation (§6) and traceability (`AGENT.md` §9) |
| Learning content | Per-concept explanation/example/etc. | Structured data per the concept structure (§7) | Every concept has at minimum: What Is It?, Mental Model, How It Works, and one Practice item | At least a representative subset reaches full depth (Important Distinctions, Connections, Production Appearance, Common Misconceptions, Code Reading, Mastery Check, at its target depth); remaining concepts are honestly marked as lighter |
| Visual material | Concept-teaching diagrams | Data-driven specs dispatched to renderers (§8) | Visuals exist wherever a genuine relationship/structure justifies one | Each visual passes the "does it teach" test in §8 |
| Exercises/interactions | Practice, Code Reading, and Mastery Check (§7) | Interaction archetypes per §9, with real evaluation logic | Every substantive concept has ≥1 practice question with an actual evaluator behind it | Evaluation can distinguish correct / partial / incorrect / unclear, not just exact-string match |
| Learner notes | Persistent per-concept notebook | Freeform text field, per concept | Editable, persisted, retrievable on return | Notes survive navigation and a reload |
| Progress | Aggregate + per-unit status | Computed from learner state | Visible progress indicator at both levels | Advances correctly as concepts are completed/understood |
| Review mechanism | Revisiting weak spots | A unit/flow that surfaces flagged concepts | At least a way to see and jump to "needs review" concepts | Uses actual answer history, not a uniform re-test |
| AI teacher / integration point | Adaptive explanation + evaluation | The contract from §10, with a real or honestly-labeled mock implementation | Explains, questions, evaluates, and answers doubts, scoped to context | If mocked, clearly labeled; if real, fully wired |
| Documentation | Enables understanding/maintaining/extending the notebook | README + supporting docs, format fitting the project | Explains what was built, what's mocked/placeholder, and how to run it | A new reader can run it and understand its structure without re-deriving it |
| Tests/validation, where appropriate | Confidence the product actually works | Automated tests and/or a documented manual validation pass | At minimum the golden path has been manually walked and confirmed | No known broken interaction path at delivery |

## 15. Quality Standards

- **Curriculum completeness** — every stated objective is actually covered;
  no silent gaps.
- **Curriculum independence** — every concept page is complete and
  teachable on its own; a learner who never opens the AI Teacher still
  reaches the concept's target depth from the page alone (§1, §7, §11).
- **Instructional quality** — What Is It? before Mental Model before How
  It Works before Why Does It Exist? (§7); never a motivating hook or
  "why this matters" before the learner knows what the thing is; consistent
  concept-structure ordering across the whole notebook.
- **Conceptual richness** — every concept answers the checklist in §7 (what
  it is, how it behaves, why it exists, what it depends on, what depends on
  it, what it's confused with, where it's encountered, how to recognize it
  in unfamiliar code) — richness of coverage, not word count.
- **Conceptual correctness** — never assert a domain fact with unearned
  confidence; if something can't be verified confidently, say so rather
  than inventing it (see §16).
- **Visual quality** — every visual teaches a real relationship; visual
  language is consistent across the whole notebook.
- **Interaction quality** — exercises reasoning; has genuine evaluation
  logic, not a bare answer key.
- **UX** — the learner is never lost; there is always an obvious next
  action.
- **Accessibility** — readable contrast, keyboard-navigable, responsive
  down to small/phone-width screens, and no meaning conveyed by color
  alone.
- **Technical quality** — clean build, no runtime errors, typed/structured
  content where the implementation language supports it.
- **Maintainability** — adding one new concept or unit should not require
  touching unrelated code.
- **Codebase/practice readiness**, where the domain is technical or
  professional — connect concepts to where they show up in real practice
  and what to inspect when applying them, without inventing a specific
  real-world structure (repo, org, dataset) the user hasn't actually
  supplied.

## 16. Failure-Handling Principles

- **Incomplete inputs** → infer reasonable defaults for optional inputs;
  ask only for what's genuinely required and unrecoverable (§5, and
  `AGENT.md` Decision Point 1).
- **Ambiguous curriculum** → resolve conservatively, preserving the user's
  apparent intent; document the assumption; ask only if the ambiguity would
  materially change the learning outcome (`AGENT.md` Decision Point 2).
- **Excessive scope** → never silently truncate. Either propose a phased
  build (full structural coverage, deep content for a representative
  subset, honestly marked) or ask which subset should go deep first.
- **Conflicting requirements** → surface the conflict explicitly; never
  silently pick a side.
- **Missing resources** (no real AI backend, no design system, no source
  material) → build the full interface, use an honest, clearly-labeled
  placeholder, and document exactly what a real integration needs.
- **Implementation constraints** → adapt the architecture to the
  constraint; never quietly ignore it.
- **Validation failure** → never present the deliverable as complete; state
  specifically what failed and what would need to change.

## 17. Priority Order

When a trade-off has to be made anywhere in this Skill or in a build that
follows it, resolve it in this order:

1. Conceptual correctness
2. Curriculum completeness
3. Concept relationships (§6)
4. Mental-model clarity
5. Appropriate depth (§7's target-depth scale — not maximal depth)
6. Production/codebase relevance
7. Practice and verification
8. Adaptive AI Teacher (§10)
9. UI polish
10. Everything else

The AI Teacher must never displace the primary curriculum — not in
priority order, not in page layout (§11, its own position at #8 here), and
not in how much of a concept's actual teaching depends on it. A build that
follows this Skill should read as *a complete technical curriculum with an
intelligent teacher attached to it*, never as *an AI teacher that happens
to have a curriculum around it*.

---

See `AGENT.md` in this folder for how these principles become an
executable workflow, and `GENERALIZATION_ANALYSIS.md` for the concrete
decision-by-decision reasoning behind what was kept, made configurable, or
discarded from the reference project this Skill was extracted from.
