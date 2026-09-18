# Module 6 — Framework Comparison (`compare.*`)

Full concept content for all 3 concepts in `02-curriculum-model.md`'s
Framework Comparison module, in curriculum order. All three are new —
none were previously ported from a cross-technology chain. All three
target Reason depth, matching the curriculum's stated objective of
understanding trade-offs, not just definitions.

---

## compare.fastapi-vs-flask-vs-django — FastAPI vs Flask vs Django

**Target depth:** Reason

### What Is It?

A comparison of three Python web frameworks — FastAPI, Flask, and
Django — covering their different levels of built-in structure, their
approach to async, and what kind of application each is best suited for.

### Mental Model

Think of Flask as a bare toolbox (minimal, you assemble what you need
yourself), Django as a fully furnished house (batteries-included — ORM,
admin panel, auth, templating, all built in and opinionated), and FastAPI
as a modern toolbox built specifically around type hints and async,
sitting architecturally between the two — more structure than Flask,
less all-encompassing than Django, with async and automatic
validation/docs as its defining traits.

**Flask gives you almost nothing by default and total freedom; Django
gives you almost everything by default and its own conventions; FastAPI
gives you a typed, async-first foundation and lets you choose the
rest.**

### How It Works — concrete differences

- **Flask**: a minimal WSGI (synchronous) framework; routing and request
  handling are simple decorators, but there's no built-in ORM,
  validation, or admin panel — you choose and wire in your own
  (SQLAlchemy, Marshmallow, etc.).
- **Django**: a full-stack, synchronous-by-default (with growing async
  support) framework that includes its own ORM, an automatic admin
  interface, a templating engine, and a strong "the Django way" set of
  conventions — you get a lot for free, but with more structure imposed
  on you.
- **FastAPI**: built on Starlette/ASGI, async-native from the ground up,
  using Python type hints for automatic request validation (Pydantic,
  `fastapi.pydantic-validation`) and API documentation (`fastapi.api-docs`) —
  no built-in ORM, admin panel, or templating; it's focused specifically
  on building APIs, not full web applications with server-rendered pages.

### Important Distinctions

- "More built-in" ≠ "better" — Django's batteries-included approach
  speeds up building a full, traditional web app but can feel like
  unnecessary structure for a small, API-only service; Flask's
  minimalism is fast to start but means more decisions (and more
  third-party packages) to assemble a production-ready API.
- Async support ≠ equal across all three — FastAPI is async-native by
  design; Flask is synchronous by default (async routes are possible but
  not its core model); Django has been adding async support
  incrementally but its core (especially the ORM) has historically been
  synchronous-first.

### Why Does It Exist (as a comparison worth knowing)

Choosing a framework has real, lasting consequences for a project —
picking Django for a small, pure JSON API adds unnecessary structure;
picking Flask for a large, complex app means reinventing patterns Django
already solved; picking FastAPI for a project needing Django's admin
panel or ORM out of the box means building or importing those
separately. Knowing the actual differences, not just the names, is what
makes the choice deliberate rather than habitual.

### Connections

- **Prerequisite:** `fastapi.project-structure`, `fastapi.async-endpoints` —
  understanding what "async-native" actually means makes this comparison
  concrete rather than a list of buzzwords.
- **Enables:** `compare.choosing-a-backend-framework` — this comparison's
  practical conclusion.

### Production Appearance

Seeing which of these three a codebase uses immediately tells you a lot
about its shape — a Django app will have `models.py` files using
Django's own ORM and likely an admin panel at `/admin`; a FastAPI app
will have Pydantic models and auto-generated `/docs`; a Flask app could
look like almost anything, since it imposes the least structure.

### Common Misconceptions

**"FastAPI is just a faster version of Flask."** They're architecturally
different — FastAPI's speed advantage (where it exists) comes from being
async-native and validation-integrated, not from being "the same thing
but optimized"; a synchronous, blocking-I/O-heavy FastAPI app isn't
meaningfully faster than an equivalent Flask app.

### Practice

A team is building a traditional website with server-rendered admin
pages, user accounts, and a content management need — which of the three
is most likely to get them there fastest with the least custom wiring,
and why? *(Django — its built-in admin panel, ORM, and templating are
specifically built for exactly this kind of full, traditional web app,
whereas FastAPI and Flask would both require assembling equivalent
pieces from scratch or third-party packages.)*

### Mastery Check (Reason)

A team chooses FastAPI for a project that turns out to need a full admin
interface for non-technical staff to manage data by hand. Explain what
tradeoff they made when choosing FastAPI, and what their two realistic
options are now.

---

## compare.fastapi-vs-node-frameworks — FastAPI vs Express/NestJS

**Target depth:** Reason

### What Is It?

A comparison of FastAPI (Python) against Node.js backend frameworks —
primarily Express (minimal, flexible) and NestJS (structured, opinionated,
TypeScript-first) — covering language/runtime differences and structural
philosophy.

### Mental Model

Think of Express as Node's version of Flask — minimal, unopinionated, you
assemble the pieces; NestJS as Node's version of a more structured
framework (drawing heavily on patterns like dependency injection and
decorators, conceptually close to FastAPI's own use of type hints and
`Depends()`); and FastAPI as occupying a similar structural niche to
NestJS, but in Python instead of TypeScript, with its own async model
instead of Node's single-threaded event loop.

**The real choice here is less "which framework" and more "which
language/runtime, and how much structure" — FastAPI and NestJS sit close
together in philosophy, on opposite sides of the Python/JavaScript
language boundary.**

### How It Works — concrete differences

FastAPI runs on Python's asyncio event loop (`js.event-loop`'s
conceptual sibling); Node frameworks run on Node's own single-threaded,
non-blocking event loop (the same JS event loop model from Module 1,
since Node runs JavaScript). FastAPI gets automatic request validation
and API docs from Python type hints + Pydantic; NestJS achieves
something structurally similar using TypeScript decorators and its own
dependency-injection system; Express has neither built in — both are
assembled via separate libraries if wanted.

### Important Distinctions

- Choosing FastAPI vs. a Node framework ≠ purely a technical decision —
  it's frequently driven by which language a team's other services, or
  its frontend team, already works in (a team already writing TypeScript
  for their Next.js frontend may prefer NestJS to share language/tooling
  knowledge, independent of any framework-level technical advantage).
- FastAPI's async model ≠ literally the same mechanism as Node's — both
  are single-threaded event-loop-based concurrency for I/O-bound work,
  but they're separate runtimes (CPython's asyncio vs. Node's
  libuv-based event loop), not the same underlying implementation.

### Why Does It Exist (as a comparison worth knowing)

A team building a full-stack app already using JavaScript/TypeScript on
the frontend (React, Next.js) faces a real, practical question of
whether to keep the backend in the same language ecosystem
(Node/NestJS/Express) or use Python (FastAPI) for its own advantages —
data science/ML library access, a team's existing Python expertise, or
FastAPI's specific validation/docs ergonomics.

### Connections

- **Prerequisite:** `fastapi.async-endpoints`, `js.event-loop`.
- **Enables:** `compare.choosing-a-backend-framework`.

### Production Appearance

A codebase's `package.json` (Node) versus `requirements.txt`/
`pyproject.toml` (Python) is the fastest tell for which ecosystem a
backend lives in; NestJS codebases show heavy use of
`@Injectable()`/`@Controller()` decorators, structurally similar in
spirit to FastAPI's `Depends()` and route decorators.

### Common Misconceptions

**"Node/JavaScript backends are always faster than Python backends."**
Raw language benchmarks are rarely the deciding factor for a typical web
API, where the bottleneck is usually I/O (database, network calls) that
both ecosystems handle efficiently via their respective async models —
the more consequential differences are ecosystem, team familiarity, and
structural fit, not raw throughput.

### Practice

A team's frontend is entirely TypeScript (Next.js), and they want their
backend engineers to be able to move fluidly between frontend and
backend code — does this favor FastAPI or a Node framework, and why?
*(A Node framework, likely NestJS or Express — sharing one language
across the whole stack lets engineers move between frontend and backend
without a language-context switch, which FastAPI, being Python, doesn't
offer.)*

### Mastery Check (Reason)

Explain why "which is faster, FastAPI or Express" is often the wrong
question to lead a real framework decision with, and name two questions
that would actually matter more for a specific team's situation.

---

## compare.choosing-a-backend-framework — Choosing a backend framework

**Target depth:** Reason

### What Is It?

The applied decision-making step that follows the two comparisons
above — actually choosing a backend framework for a given project by
weighing structure, ecosystem/language fit, async needs, and team
context, rather than picking by familiarity or popularity alone.

### Mental Model

Think of this as running the previous two comparisons through an actual
decision, the way an architect chooses a building material not just by
its properties in isolation but by what the specific building actually
needs — a pure JSON API for a data-heavy service has different needs
than a full traditional web app with an admin interface.

**Choosing a framework isn't picking the "best" one in the abstract — it's
matching a framework's actual structural tradeoffs to what a specific
project and team actually need.**

### How It Works — the practical questions this decision actually turns on

1. **What kind of application is this?** A pure API (FastAPI, Express)
   vs. a full web app with server-rendered pages and an admin need
   (Django) have different natural fits.
2. **Does it need heavy async/concurrency for I/O-bound work** (many
   concurrent slow network/database calls)? FastAPI and Node frameworks
   are built around this; Django/Flask can do it but less natively.
3. **What language does the rest of the team/stack already use?** A team
   fully in TypeScript may lean Node; a team with Python data/ML
   expertise may lean FastAPI.
4. **How much built-in structure is wanted versus assembled
   independently?** Django and NestJS impose more upfront structure;
   Flask and Express impose the least.

### Important Distinctions

- This decision ≠ permanent or irreversible in the abstract, but it does
  have real switching costs — a framework choice shapes a codebase's
  structure deeply enough that changing later is a significant
  undertaking, not a minor refactor, so the decision deserves real
  weight even though it's "just" a tool choice.
- "Why FastAPI may be preferred for a particular application" ≠ "FastAPI
  is the best framework" — the honest answer is always conditional: for
  an async-heavy, type-safe, well-documented pure API, especially where
  the team already works in Python, FastAPI is frequently a strong
  fit — not universally.

### Why Does It Exist (as its own concept)

The two prior comparisons give facts; this concept is the actual
reasoning skill of applying those facts to a specific situation — the
kind of judgment a codebase-ready engineer needs when they encounter an
existing framework choice and have to understand *why* it was probably
made, or when they're asked to justify or reconsider one.

### Connections

- **Prerequisite (BLOCKING):** `compare.fastapi-vs-flask-vs-django`,
  `compare.fastapi-vs-node-frameworks`.
- **Related:** `dbconcepts.choosing-relational-vs-nonrelational` — the
  same "apply the comparison, don't just recite it" skill, applied to a
  different technology decision later in the curriculum.

### Production Appearance

This is the reasoning behind why an existing codebase uses whatever
backend framework it does — reading a project's `README` or architecture
docs (if they exist) for a stated rationale is the real-world version of
this concept; absent that, inferring it from the codebase's actual shape
(is it API-only? does it need an admin panel? is the team's other code in
Python or JS?) is exactly this skill in practice.

### Example

A startup building a data-heavy analytics API with a Python-experienced
team and no need for server-rendered admin pages chooses FastAPI — not
because it's objectively "the best" framework, but because it fits this
specific combination of needs (async I/O, Python ecosystem, pure API,
type safety) better than the alternatives.

### Practice

A team needs to build an internal tool quickly, mostly CRUD screens for
non-technical staff to manage data, with no complex async/concurrency
requirements — which of the three Python-side options from
`compare.fastapi-vs-flask-vs-django` best fits, and why? *(Django — its
built-in admin panel is specifically built for exactly this "CRUD
screens for internal staff" need, likely saving substantial development
time compared to building equivalent screens by hand in FastAPI or
Flask.)*

### Mastery Check (Reason)

You join an existing codebase that uses FastAPI for its backend. Using
everything in this module, list three questions you'd investigate to
understand *why* that choice was likely made for this specific
application — and what answer to each would make you conclude the choice
was a good fit versus a questionable one.
