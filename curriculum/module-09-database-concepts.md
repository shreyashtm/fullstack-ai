# Module 9 — Database Concepts (`dbconcepts.*`)

Full concept content for all 5 concepts in `02-curriculum-model.md`'s
Database Concepts module, in curriculum order. All five are new — this
is the comparison/decision module following PostgreSQL, the same role
Module 6 played following FastAPI.

---

## dbconcepts.data-structuring-spectrum — Structured vs semi-structured vs unstructured data

**Target depth:** Understand

### What Is It?

Data can be structured (a fixed, predictable schema — rows and columns,
like `pg.tables-rows-columns`), semi-structured (some organization, like
nested keys, but no fixed schema every record must follow — e.g. JSON
documents that can vary shape record to record), or unstructured (no
inherent schema at all — free text, images, video).

### Mental Model

Think of structured data as a spreadsheet with fixed column headers
every row must follow; semi-structured as a folder of JSON files that
are broadly similar but each can have slightly different fields;
unstructured as a box of loose photos and documents with no consistent
fields at all, just raw content.

**The spectrum is really about how much a system can rely on every
record having the same predictable shape — structured guarantees it,
semi-structured expects it loosely, unstructured doesn't assume it at
all.**

### How It Works

A relational table (`pg.tables-rows-columns`) is structured — every row
genuinely has the same columns. A MongoDB-style document store is
semi-structured — most `user` documents might have `name` and `email`,
but one might have an extra `phone` field the others lack, and nothing
forces every document into an identical fixed shape. A folder of PDFs or
a video archive is unstructured — there's no queryable field structure
at all without extracting it first.

### Important Distinctions

- Semi-structured ≠ "no structure at all" — a JSON document still has
  internal organization (nested keys, arrays), just not a schema
  *enforced across every record* the way a SQL table's columns are.
- "Unstructured" ≠ meaning the data has no value or pattern — a photo
  has plenty of information, it's just not natively queryable as fields
  without extra processing (like an ML model extracting tags from it).

### Why Does It Exist (as a distinction to hold onto)

Different storage and query technologies are built around different
points on this spectrum — a relational database is optimized for the
guarantees structured data provides; a document store trades away that
strict guarantee for flexibility; choosing a storage technology without
understanding which point on this spectrum your actual data occupies
leads to a poor fit either way.

### Connections

- **Prerequisite:** `pg.tables-rows-columns` — the structured end of the
  spectrum, already familiar.
- **Enables:** `dbconcepts.sql-vs-nosql` — this spectrum is the
  conceptual foundation that comparison is built on.

### Production Appearance

A backend storing user profiles in Postgres (structured) while also
storing uploaded documents in cloud storage (unstructured,
`gcp.cloud-storage`) and perhaps flexible, varying-shape event logs in a
document store (semi-structured) is a realistic system using multiple
points on this spectrum simultaneously, each for the data that actually
fits it.

### Example

A `users` table (structured) versus a `user_activity_log` collection
where each event might have entirely different fields depending on what
kind of action it recorded (semi-structured) versus a folder of
user-uploaded profile photos (unstructured).

### Practice

Where on this spectrum would a collection of customer support chat
transcripts, each with a different, free-form structure, most naturally
sit? *(Semi-structured, leaning toward unstructured — there's some loose
shape (a sender, a timestamp, a message) but likely no strictly enforced
schema every transcript follows identically, and much of the actual
content is free text.)*

---

## dbconcepts.sql-vs-nosql — SQL vs NoSQL

**Target depth:** Reason

### What Is It?

SQL databases (relational, like PostgreSQL) enforce a fixed schema and
store data in related tables; NoSQL databases (a broad category
including document stores like MongoDB, key-value stores, and others)
generally trade strict schema enforcement and relational joins for
flexibility, horizontal scalability, or a data shape that maps more
directly onto how an application actually uses it.

### Mental Model

Think of SQL as a filing cabinet with labeled drawers and a strict form
every document must fill out identically; NoSQL (specifically document
stores, the most common comparison point) as a set of folders where each
document can be shaped however it needs to be, nested and self-contained,
without needing to match every other document's exact fields.

**SQL enforces one consistent shape and relates data across tables;
NoSQL (in its most common document-store form) lets each record's shape
vary and often nests related data inside one document instead of
spreading it across tables.**

### How It Works

In Postgres, a user and their orders live in two related tables, joined
by a foreign key (`pg.relationships`, `pg.joins`). In a document store
like MongoDB, a user document might have the user's recent orders nested
directly inside it as an array — no separate table, no join, the related
data travels together in one document, at the cost of the schema
enforcement and referential guarantees (`pg.constraints`,
`pg.primary-foreign-keys`) a relational database provides automatically.

### Important Distinctions

- "NoSQL" ≠ one single technology or model — it's an umbrella term
  covering meaningfully different approaches (document stores like
  MongoDB, key-value stores like Redis, wide-column stores, graph
  databases), each with its own tradeoffs; comparing "SQL vs NoSQL" as if
  NoSQL were one thing oversimplifies real decisions.
- NoSQL's flexibility ≠ free — without an enforced schema, application
  code (not the database) becomes responsible for handling documents
  that might be missing fields or shaped differently than expected,
  shifting a category of correctness burden from the database layer to
  the application layer.

### Why Does It Exist (as a distinction to hold onto)

Different applications genuinely have different needs — some data
(financial transactions, anything needing strict relational integrity)
benefits enormously from SQL's enforced structure and guarantees; other
data (rapidly-evolving, loosely-structured application state, or data
needing to scale horizontally across many servers more easily than a
traditional relational database) fits a NoSQL model's flexibility
better.

### Connections

- **Prerequisite (BLOCKING):** `dbconcepts.data-structuring-spectrum`,
  `pg.relational-fundamentals`.
- **Enables:** `dbconcepts.postgres-vs-mongodb` — one concrete instance
  of this comparison — and `dbconcepts.choosing-relational-vs-nonrelational`.

### Production Appearance

A codebase's dependencies (an ORM like SQLAlchemy vs. a MongoDB driver)
and its data models (Pydantic/SQL schema classes vs. loosely-typed
document handling) are the fastest tell for which model a given service
uses.

### Common Misconceptions

**"NoSQL is just a newer, better replacement for SQL databases."** They
solve genuinely different problems with different tradeoffs — a NoSQL
document store isn't a strict upgrade; it trades away guarantees (schema
enforcement, relational integrity, join support) that many applications
genuinely need, in exchange for flexibility and certain scaling
characteristics that not every application needs.

### Practice

An application needs to record financial transactions where correctness
(no partial writes, guaranteed referential integrity between accounts
and transactions) is critical — does this favor SQL or a typical NoSQL
document store, and why? *(SQL — its enforced constraints, foreign keys,
and transaction guarantees (`pg.transactions`) are specifically built
for exactly this kind of strict-correctness requirement; a schema-less
document store would push that correctness burden onto application code
instead.)*

### Mastery Check (Reason)

A team picks a NoSQL document store specifically because "our data model
keeps changing and we don't want to deal with migrations." Explain what
real tradeoff they're accepting in exchange for that flexibility, using
what you know about schema enforcement and application-level correctness
burden.

---

## dbconcepts.postgres-vs-mongodb — PostgreSQL vs MongoDB

**Target depth:** Reason

### What Is It?

A concrete comparison between PostgreSQL (relational, structured,
`pg.*`) and MongoDB (a widely-used document-store NoSQL database) — the
most common specific instance of the broader SQL-vs-NoSQL comparison.

### Mental Model

Think of Postgres as storing a user's data across labeled, related
drawers (a `users` table, an `orders` table, joined by keys); MongoDB as
storing a user's entire relevant record — user info, maybe recent orders
nested inside — as one self-contained JSON-like document in a
collection, without a fixed cross-document schema.

**Postgres normalizes data across related tables and enforces one shape
per table; MongoDB commonly denormalizes by nesting related data into
one flexible document per record.**

### How It Works — concrete differences

Postgres uses SQL and enforces a schema per table
(`pg.tables-rows-columns`); MongoDB stores JSON-like "documents" in
"collections," where documents in the same collection can have different
fields from each other. Postgres relates data across tables via foreign
keys and joins (`pg.joins`); MongoDB more commonly nests related data
directly inside a document (embedding) rather than joining across
collections, though it does support references and a limited join-like
operation when needed.

### Important Distinctions

- MongoDB documents ≠ never having relationships — MongoDB supports
  referencing other documents by id and even a `$lookup` join-like
  aggregation stage, but the idiomatic pattern favors nesting/embedding
  related data directly rather than normalizing across collections the
  way Postgres does.
- Choosing MongoDB ≠ automatically meaning better horizontal
  scalability for any given application — while document stores are
  often associated with easier horizontal scaling, Postgres itself has
  real scaling techniques too (read replicas, partitioning); the actual
  deciding factor is usually the data's natural shape and consistency
  needs, not raw scalability alone.

### Why Does It Exist (as its own concept)

MongoDB specifically is common enough in real-world stacks that
recognizing its concrete shape (documents, collections, embedding) — not
just the abstract "NoSQL" label — is a genuinely useful, specific piece
of codebase-reading knowledge.

### Connections

- **Prerequisite (BLOCKING):** `dbconcepts.sql-vs-nosql`,
  `pg.relational-fundamentals`.
- **Enables:** `dbconcepts.choosing-relational-vs-nonrelational`.

### Production Appearance

Seeing a `models.py`/`schemas.py` full of Pydantic/SQLAlchemy classes
(Postgres) versus loosely-typed dictionary-like document handling and a
MongoDB driver/ODM (like Motor or Mongoengine) in a codebase's
dependencies immediately tells you which of the two a service uses.

### Example

A user profile in Postgres lives as a row in `users`, with related
orders as separate rows in `orders` joined by `user_id`; the equivalent
in MongoDB might be one `users` collection document per user, with a
`recentOrders` array embedded directly inside it.

### Practice

An application's `user` document in MongoDB embeds the user's last 5
orders directly inside it for fast reads — what happens structurally if
the application later needs to query "find all orders over $100,
regardless of which user placed them," across the whole system? *(This
becomes considerably more awkward than in Postgres — since orders are
embedded inside individual user documents rather than existing as their
own independently queryable collection, a cross-cutting query like this
either requires restructuring the data model or a more complex
aggregation across every user document.)*

### Mastery Check (Reason)

A team stores each blog post's comments nested directly inside the
post's MongoDB document, for fast "load a post with all its comments"
reads. Explain the tradeoff they've made, and describe one realistic
future requirement that would make this design awkward.

---

## dbconcepts.choosing-relational-vs-nonrelational — When to use relational vs non-relational databases

**Target depth:** Reason

### What Is It?

The applied decision-making step that follows the comparisons above —
actually choosing between a relational (Postgres) and non-relational
(MongoDB or similar) approach for a given application's data, based on
its actual shape, consistency needs, and query patterns, rather than by
trend or familiarity alone.

### Mental Model

Think of this the same way as `compare.choosing-a-backend-framework`'s
reasoning skill, applied to data storage instead — running the
SQL-vs-NoSQL and Postgres-vs-MongoDB comparisons through an actual
decision, matching a storage model's real tradeoffs to what this
specific application's data actually needs.

**The right storage model follows from the data's actual shape and
consistency requirements, not from which one is more popular or
familiar.**

### How It Works — the practical questions this decision actually turns on

1. **Does the data have strong relationships that need enforced
   integrity?** (financial transactions, anything needing guaranteed
   referential consistency) → favors relational.
2. **Does each record's shape vary meaningfully, or evolve frequently
   without needing every existing record to conform?** → favors a
   flexible document model.
3. **Are the dominant queries "read one self-contained record" (favoring
   embedding/documents) or "join and aggregate across many related
   records in varied ways" (favoring relational)?**
4. **Does the team already have strong SQL/relational modeling
   experience, or document-store experience?** — genuinely relevant, the
   same way it was for framework choice.

### Important Distinctions

- This decision ≠ all-or-nothing for an entire application — many real
  systems use both, relational for data needing strict integrity (users,
  orders, payments) and a document store or key-value store for a
  specific subsystem that genuinely benefits from flexibility (session
  data, activity logs, a cache).
- "NoSQL scales better" ≠ a sufficient reason on its own — many
  applications never reach a scale where that difference matters, and
  choosing based on a scaling concern that won't materialize for years
  trades away real, immediate benefits (schema enforcement, joins) for a
  hypothetical future one.

### Why Does It Exist (as its own concept)

The two prior comparisons give facts; this is the applied reasoning
skill — the same kind of judgment a codebase-ready engineer needs when
encountering an existing storage choice and having to understand why it
was probably made, mirroring `compare.choosing-a-backend-framework`'s
role for framework decisions.

### Connections

- **Prerequisite (BLOCKING):** `dbconcepts.sql-vs-nosql`,
  `dbconcepts.postgres-vs-mongodb`.
- **Related:** `compare.choosing-a-backend-framework` — the same "apply
  the comparison, don't just recite it" skill, applied to a different
  technology decision earlier in the curriculum.

### Production Appearance

This is the reasoning behind why an existing codebase stores its core
data in Postgres versus a document store — inferring it from the actual
data's shape and how it's queried is the real-world version of this
skill.

### Example

An e-commerce platform stores users, orders, and payments in Postgres
(strict relational integrity matters for financial correctness) but
stores each user's shopping cart (temporary, frequently changing,
doesn't need strict relational guarantees) in a fast key-value store
like Redis.

### Practice

A team is building a content-management system where each "page" can
have wildly different, evolving custom fields depending on the page
type, and pages are almost always read as one complete, self-contained
record — does this favor a relational or document-store approach, and
why? *(A document-store approach — the per-record variability in shape
and the "read one self-contained record" query pattern both align with a
document model's strengths, whereas forcing this into a fixed relational
schema would likely require an awkward, sparse table or many nullable
columns.)*

### Mastery Check (Reason)

You join a team whose application uses both Postgres and MongoDB for
different parts of the system. Using this module's concepts, describe
the two or three questions you'd ask to understand why each piece of
data ended up where it did, and what a "good" versus "questionable"
answer to each would look like.

---

## dbconcepts.basic-db-design — Basic database design

**Target depth:** Use

### What Is It?

Basic database design is the process of translating a real-world set of
entities and their relationships (users, orders, products) into an
actual relational schema — deciding what tables exist, what columns each
needs, how they relate, and applying at least a basic level of
normalization (avoiding storing the same fact redundantly in multiple
places).

### Mental Model

Think of database design as sketching a floor plan before building —
identify the distinct "rooms" (entities/tables) the data needs, decide
which rooms connect to which and how (relationships,
`pg.relationships`), and make sure no single fact is duplicated across
multiple rooms in a way that could drift out of sync.

**Database design is deciding what the tables are, what belongs in each,
and how they connect — get this wrong early and every later query and
constraint fights the wrong shape.**

### How It Works

A basic design process:

1. Identify the distinct entities (User, Product, Order).
2. For each entity, list its own attributes (a User has a name and
   email; a Product has a name and price).
3. Identify relationships between entities and their shape
   (`pg.relationships` — a User has many Orders; an Order has many
   Products through an `order_items` join table).
4. Apply primary/foreign keys (`pg.primary-foreign-keys`) to represent
   those relationships structurally.
5. Add constraints (`pg.constraints`) for rules the data must always
   satisfy.

### Important Distinctions

- Normalization (avoiding duplicate, potentially-inconsistent copies of
  the same fact) ≠ an absolute rule to maximize at all costs — real
  designs sometimes deliberately denormalize (store some redundant data)
  for query performance reasons, but that should be a deliberate,
  understood tradeoff, not an accidental result of not thinking about it.
- A "basic" design ≠ a final, complete one — real schemas evolve with
  migrations as requirements change; getting a reasonable first shape is
  the goal, not a perfect, unchangeable one.

### Why Does It Exist?

Without deliberately designing the schema first, a database tends to
accumulate ad-hoc columns and duplicated data as features are added
reactively — a basic design pass up front (even a rough one) avoids the
most common structural mistakes, like storing a user's name redundantly
on every order instead of referencing the user by id.

### Connections

- **Prerequisite (BLOCKING):** `pg.relational-fundamentals`,
  `pg.relationships`, `pg.primary-foreign-keys`, `pg.constraints`.
- **Related:** `dbconcepts.choosing-relational-vs-nonrelational` — this
  design process is specifically for the relational side of that
  decision.

### Production Appearance

A migration file's history, read from the earliest onward, often tells
the story of how an application's actual database design evolved from
its initial basic shape as real requirements were discovered.

### Example

Designing a simple blog: entities `Author`, `Post`, `Comment`, `Tag`;
`Post` has a foreign key to `Author` (one-to-many); `Comment` has a
foreign key to `Post` (one-to-many); `Post` and `Tag` relate
many-to-many via a `post_tags` join table.

### Practice

A first-draft schema stores each order's shipping address as a full text
field directly on the `orders` table, but the team later realizes users
often ship to the same few addresses repeatedly — what basic design
change would better model this? *(Extract `addresses` into its own
table, related to `users` (a user can have many saved addresses) and
referenced by `orders` via a foreign key, rather than storing a full
duplicated address string on every single order.)*
