# Module 8 — PostgreSQL (`pg.*`)

Full concept content for all 10 concepts in `02-curriculum-model.md`'s
PostgreSQL module, in curriculum order. Two were already authored in
`chain-2-request-lifecycle.md` and `chain-3-oltp-to-olap.md` and are
reproduced verbatim here (if either is edited later, edit both copies
together). This is the first module of Phase B ("Database + Cloud").

---

## pg.relational-fundamentals — Relational database fundamentals

**Target depth:** Understand

### What Is It?

A relational database organizes data into tables of rows and columns,
where relationships between different kinds of data (a user and their
orders) are represented by shared key values rather than by nesting one
inside another.

### Mental Model

Think of a relational database as a set of separate spreadsheets, each
one holding one kind of thing (users, orders, products), where a row in
one spreadsheet can point to a row in another by storing that row's
identifying number — rather than copying the whole related record
inline.

**A relational database keeps each kind of data in its own table and
links related rows together by reference (a shared id), instead of
nesting or duplicating data.**

### How It Works

A `users` table and an `orders` table are separate; each row in `orders`
stores a `user_id` value that matches a row's `id` in `users` — to find
"this user's orders," you look up rows in `orders` where `user_id`
matches. This linking-by-reference is what "relational" in the name
refers to.

### Important Distinctions

- Relational ≠ the only way to structure data (contrast with
  `dbconcepts.sql-vs-nosql`'s document-style alternative, where related
  data is often nested inside one record instead).
- A relationship existing ≠ the same as the data being duplicated — a
  user's name lives in exactly one row in `users`; every order
  referencing that user points to it by id rather than copying the name
  into every order row.

### Why Does It Exist?

Storing each kind of data once, in its own table, and linking by
reference avoids duplicating (and having to keep in sync) the same
information in many places — if a user changes their name, it changes in
exactly one row, not in every order that happens to reference them.

### Connections

- **Prerequisite:** `backend.json`'s notion of structured data — a table
  row is conceptually similar to one JSON object, just constrained to a
  fixed, table-wide shape.
- **Enables:** `pg.tables-rows-columns`, `pg.primary-foreign-keys`,
  `pg.relationships`.

### Production Appearance

Any backend using PostgreSQL, MySQL, or SQLite is built on this model;
recognizing a `users` table and an `orders` table with a `user_id`
column linking them is the most basic real-world instance of this idea.

### Example

A blog's `posts` table and `comments` table — each comment row stores a
`post_id` pointing at which post it belongs to, rather than each post
containing all its comments nested inline.

### Practice

If a user changes their email address, and 50 orders reference that
user, how many rows actually need to be updated in a properly relational
design? *(One — the single row in the `users` table; every order's
`user_id` reference still correctly points at that same, now-updated,
user row.)*

---

## pg.tables-rows-columns — Tables, rows and columns

**Target depth:** Understand

### What Is It?

A table is a named collection of records with a fixed set of columns;
each row is one individual record, and each column defines one named,
typed field every row in that table has.

### Mental Model

Think of a table exactly like a spreadsheet — the column headers define
what kind of information is tracked (name, email, created_at), and each
row below is one specific record with a value (or null) in each of those
columns.

**A table's columns are its fixed shape, defined once; each row is one
instance of that shape, filled in with actual values.**

### How It Works

A `users` table might be defined with columns `id` (integer), `name`
(text), `email` (text), `created_at` (timestamp) — every row in that
table has a value for each of those four columns (or `NULL`, if the
column allows it).

### Important Distinctions

- A column's type ≠ optional in practice — every row's value in that
  column must match the declared type (an `integer` column can't hold
  text).
- A column allowing `NULL` ≠ the same as a column with a default
  value — `NULL` means "no value was given," a default means "a specific
  value fills in automatically if none is given."

### Why Does It Exist?

A fixed, declared structure per table lets the database enforce
consistency (every row genuinely has the fields the application expects,
in the right types) and lets queries be written generically against a
known, stable shape.

### Connections

- **Prerequisite:** `pg.relational-fundamentals`.
- **Enables:** `pg.primary-foreign-keys`, `pg.sql-basics`.

### Production Appearance

Running `\d tablename` in `psql`, or looking at a migration file that
defines `CREATE TABLE`, shows exactly this column structure for a real
table.

### Example

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE
);
```

Defines a table with three columns, one of which (`email`) is
constrained to be unique across all rows.

### Practice

If a `users` table has a `NOT NULL` column called `email`, what happens
if you try to insert a row without providing a value for it? *(The
insert fails — the database rejects it, since `NOT NULL` requires every
row to have a value in that column.)*

---

## pg.primary-foreign-keys — Primary & foreign keys

**Target depth:** Use

### What Is It?

A primary key is a column (or set of columns) that uniquely identifies
each row in a table; a foreign key is a column in one table whose values
are constrained to match an existing primary key value in another
table — the actual mechanism that implements the "linking by reference"
idea from `pg.relational-fundamentals`.

### Mental Model

Think of a primary key as a table's unique serial number stamped on every
row — no two rows share one, and nothing can be added without one. A
foreign key is a row pointing at another table's serial number, the way
a library card catalog entry points at a specific shelf location by its
call number.

**A primary key uniquely identifies a row within its own table; a
foreign key is one table's column pointing at another table's primary
key, and the database itself enforces that the pointed-at row actually
exists.**

### How It Works

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT
);
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total NUMERIC
);
```

`orders.user_id` is a foreign key referencing `users.id`; the database
rejects any attempt to insert an order with a `user_id` that doesn't
match an existing user's `id`.

### Important Distinctions

- A primary key ≠ required to be a meaningless auto-incrementing
  number — it can be any column (or combination) guaranteed unique,
  though an auto-incrementing id is the common default.
- A foreign key constraint ≠ optional bookkeeping — the database actively
  rejects inserts/updates that would violate it, which is a real,
  structural guarantee, not just documentation of intent.

### Why Does It Exist?

Without an enforced link, nothing would stop an `orders` row from
referencing a `user_id` that doesn't actually exist — a "dangling
reference" that silently corrupts the data's integrity; foreign keys
make that class of bug structurally impossible rather than something the
application has to remember to check.

### Connections

- **Prerequisite (BLOCKING):** `pg.tables-rows-columns`.
- **Enables:** `pg.relationships`, `pg.joins` — joins work by matching
  primary/foreign key values across tables.

### Production Appearance

Reading a database schema (a migration file, or an ORM's model
definitions) and looking for `PRIMARY KEY` and `REFERENCES`/`ForeignKey`
declarations tells you exactly how the tables relate to each other.

### Example

`orders.user_id REFERENCES users(id)` — the database won't allow an
order to be created for a user id that doesn't exist in the `users`
table.

### Practice

An attempt to insert an order with `user_id = 999`, but no user with `id
= 999` exists — what happens? *(The insert fails with a foreign key
constraint violation — the database enforces that the referenced user
must actually exist.)*

---

## pg.relationships — Relationships (1:1, 1:N, N:N)

**Target depth:** Use

### What Is It?

The three common shapes a relationship between two tables can take:
one-to-one (each row in table A relates to exactly one row in table B),
one-to-many (one row in A relates to many rows in B — the most common
shape), and many-to-many (many rows in A relate to many rows in B,
usually via a third "join table" in between).

### Mental Model

Think of one-to-many as one author writing many books (each book has
exactly one author, but an author can have many books); many-to-many as
students and courses (a student takes many courses, a course has many
students) — which needs a separate table just to record each individual
enrollment pairing, since neither "students" nor "courses" alone can
hold that many-sided link.

**One-to-many is a foreign key pointing one direction; many-to-many needs
a whole extra table in the middle, because neither original table can
hold a variable-length list of the other.**

### How It Works

One-to-many (users → orders, already seen): a foreign key on the "many"
side (`orders.user_id`). Many-to-many (students ↔ courses):

```sql
CREATE TABLE enrollments (
  student_id INTEGER REFERENCES students(id),
  course_id INTEGER REFERENCES courses(id),
  PRIMARY KEY (student_id, course_id)
);
```

Each row in `enrollments` represents one specific student-course
pairing; a student with 4 courses has 4 rows in `enrollments`, and a
course with 30 students has 30 rows.

### Important Distinctions

- One-to-many ≠ requiring an extra table — the foreign key alone on the
  "many" side is sufficient.
- Many-to-many ≠ representable with a simple foreign key on either
  original table — trying to store multiple course ids in one column of
  `students` would violate the basic "each column holds one value"
  structure of a relational table (this is exactly why the join table
  exists).

### Why Does It Exist?

Real-world data genuinely has these different shapes of connection, and
each needs a different structural representation to stay correctly
modeled and queryable — forcing a many-to-many relationship into a
one-to-many shape (or vice versa) produces a schema that can't correctly
represent the actual data.

### Connections

- **Prerequisite (BLOCKING):** `pg.primary-foreign-keys`.
- **Enables:** `pg.joins` (joining through a many-to-many join table is a
  common, slightly more involved join pattern), `dbconcepts.basic-db-design`.

### Production Appearance

Seeing a table whose name is often two other table names combined
(`student_courses`, `order_items`) is the signal of a many-to-many join
table in a real schema.

### Example

A `posts`/`tags` many-to-many relationship (one post can have many tags,
one tag can apply to many posts) needs a `post_tags` join table, not a
column on either `posts` or `tags` directly.

### Practice

A blog has `posts` and `authors`, where each post has exactly one
author, but an author can write many posts — is this one-to-many or
many-to-many, and where would the foreign key live? *(One-to-many — the
foreign key `author_id` lives on the `posts` table, since each post
points at exactly one author.)*

---

## pg.sql-basics — SQL basics

**Target depth:** Use

### What Is It?

SQL (Structured Query Language) is the language used to define, query,
and modify data in a relational database — a small set of declarative
statements (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, and schema-definition
statements like `CREATE TABLE`) describing *what* data you want or want
to change, not the step-by-step procedure for finding it.

### Mental Model

Think of SQL as ordering from a very specific menu rather than giving
step-by-step cooking instructions — you describe the result you want
(`SELECT name FROM users WHERE age > 18`), and the database itself
figures out the most efficient way to actually retrieve it.

**SQL is declarative — you say what you want, not how to get it; the
database's own query planner decides the actual execution steps.**

### How It Works

A SQL statement is built from a small set of consistent clauses —
`SELECT` (which columns), `FROM` (which table), `WHERE` (which rows,
filtered by a condition), and others layered on as needed (`ORDER BY`,
`GROUP BY`, `JOIN`). The same clause vocabulary is reused across nearly
every query, just combined differently.

### Important Distinctions

- SQL ≠ a general-purpose programming language — it has no loops or
  variables in the way JavaScript or Python do (though procedural
  extensions exist); its core strength is expressing *what result is
  wanted* over a set of rows, declaratively.
- Case sensitivity ≠ consistent — SQL keywords (`SELECT`, `WHERE`) are
  conventionally uppercase but not case-sensitive; table/column names'
  case sensitivity depends on how they were created and quoted (Postgres
  lowercases unquoted identifiers by default).

### Why Does It Exist?

A declarative query language lets the database engine choose the most
efficient actual execution strategy (which index to use, which join
order) without the application needing to know or control those
details — a genuinely different division of responsibility than writing
an explicit retrieval algorithm by hand.

### Connections

- **Prerequisite:** `pg.tables-rows-columns`.
- **Enables:** `pg.crud-statements`, `pg.joins`, `bq.analytical-sql` — the
  same language, reused for a very different query shape.

### Production Appearance

Any raw SQL string embedded in a backend codebase, or the SQL an ORM
(like SQLAlchemy) ultimately generates underneath its own Python API, is
this language in action.

### Example

`SELECT name, email FROM users WHERE created_at > '2026-01-01' ORDER BY
name;` — describes exactly what's wanted (recent users' names and
emails, alphabetically) without specifying how to scan the table.

### Practice

Without writing full SQL, what are the three most essential clauses
almost every basic query needs, and what does each specify? *(`SELECT` —
which columns; `FROM` — which table; `WHERE` — which rows, by
condition.)*

---

## pg.crud-statements — SELECT, INSERT, UPDATE, DELETE

**Target depth:** Use

*(Reproduced from `chain-2-request-lifecycle.md` — content unchanged.)*

### What Is It?

CRUD statements are the four core SQL operations on a table's rows:
`SELECT` (read), `INSERT` (create), `UPDATE` (modify), `DELETE` (remove).

### Mental Model

Think of a table as a spreadsheet; `SELECT` is looking at rows, `INSERT`
is adding a new row, `UPDATE` is editing cells in existing rows (matched
by a condition), `DELETE` is removing rows (matched by a condition) —
`UPDATE`/`DELETE` without a `WHERE` clause act on every row, which is the
single most common expensive SQL mistake.

**SELECT reads, INSERT adds, UPDATE and DELETE both require a WHERE to
avoid touching the entire table.**

### How It Works

```sql
SELECT id, name FROM users WHERE id = 42;
INSERT INTO users (name, email) VALUES ('Ada', 'ada@example.com');
UPDATE users SET name = 'Ada L.' WHERE id = 42;
DELETE FROM users WHERE id = 42;
```

Each statement names the table, and `SELECT`/`UPDATE`/`DELETE` use
`WHERE` to scope which rows are affected.

### Important Distinctions

- `UPDATE`/`DELETE` with no `WHERE` ≠ a syntax error — it's valid SQL that
  silently affects every row in the table.
- `INSERT` ≠ `UPDATE` — inserting a row with an existing primary key
  raises a constraint error rather than overwriting it (that's what
  `UPDATE`, or an explicit "upsert," is for).

### Why Does It Exist?

Every relational database needs a minimal, universal vocabulary for
manipulating rows; these four verbs cover the complete set of ways an
application changes or reads persisted data.

### Connections

- **Prerequisite:** `pg.sql-basics`.
- **Enables:** `pg.joins`, `pg.transactions`, and directly, the database
  step of `integration.trace-request-frontend-to-db`.
- **Related:** `bq.analytical-sql` — BigQuery reuses `SELECT`'s syntax,
  but rarely `INSERT`/`UPDATE`/`DELETE` in the same row-by-row way (see
  `bq.postgres-vs-bigquery`).

### Production Appearance

This is what an ORM (like SQLAlchemy, used under FastAPI) generates
underneath calls like `db.query(User).filter(...)` or
`db.add(new_user)` — reading real backend code often means recognizing
which CRUD operation a higher-level ORM call actually compiles down to.

### Example

`db.query(User).filter(User.id == user_id).first()` compiles to roughly
`SELECT * FROM users WHERE id = 42 LIMIT 1;`.

### Practice

What SQL does `db.query(Order).filter(Order.status ==
'cancelled').delete()` most likely generate, and what's the one clause
that makes it safe rather than catastrophic? *(`DELETE FROM orders WHERE
status = 'cancelled';` — safe specifically because of the `WHERE`.)*

---

## pg.joins — JOINs

**Target depth:** Reason

### What Is It?

A join combines rows from two (or more) tables into one result set,
matching rows based on a related column — typically a foreign key
matching a primary key — letting a single query pull together data
that's stored in separate tables.

### Mental Model

Think of a join as physically laying two spreadsheets side by side and
drawing lines between rows that share a matching id, then reading across
both halves as if they were one combined table — an `INNER JOIN` only
keeps rows where a match exists on both sides; a `LEFT JOIN` keeps every
row from the left table regardless of whether a match exists, filling in
blanks (`NULL`) where it doesn't.

**A join answers a question that spans two tables in one query, by
matching rows on a shared key — INNER keeps only matched pairs, LEFT
keeps every row from one side even when there's no match.**

### How It Works

```sql
SELECT orders.id, orders.total, users.name
FROM orders
JOIN users ON orders.user_id = users.id;
```

This produces one row per order, with that order's user's name
attached — combining data that lives in two separate tables
(`pg.relational-fundamentals`) into one query result, without the
application needing to fetch users and orders separately and stitch them
together itself.

### Important Distinctions

- `INNER JOIN` (the default `JOIN`) ≠ `LEFT JOIN` — an inner join drops
  any order whose `user_id` somehow doesn't match a user (or any user
  with zero orders, from the users' side); a left join keeps every row
  from the "left" table even with no match, filling the unmatched side
  with `NULL`s — choosing the wrong one silently drops or silently
  includes rows depending on the direction of the mistake.
- A join across a many-to-many join table (`pg.relationships`) ≠ a single
  join — it typically requires joining through the join table to both
  original tables, two joins in one query.

### Why Does It Exist?

Without joins, retrieving related data spanning two tables would require
a separate query per table and manually matching rows together in
application code — slower, and pushes work the database is specifically
optimized to do (matching on indexed key columns) into a less efficient
place.

### Connections

- **Prerequisite (BLOCKING):** `pg.primary-foreign-keys`,
  `pg.relationships`, `pg.sql-basics`.
- **Enables:** realistic queries in `pg.indexes` (a join's performance
  heavily depends on whether the joined columns are indexed),
  `bq.analytical-sql` (joins reappear there, at a different scale).

### Production Appearance

Nearly any query more complex than "look up one row by id" in a real
backend involves at least one join — an ORM's `.join(...)` call, or raw
SQL with an explicit `JOIN` clause, is a very common sight in real query
code.

### Trace

`orders` table has rows for user_ids 1 and 2; `users` table has rows for
ids 1, 2, and 3 (user 3 has no orders):

| Join type | Result rows |
|---|---|
| `INNER JOIN` (orders JOIN users) | 2 rows — one per order, only users 1 and 2 (user 3 excluded, no matching order) |
| `LEFT JOIN` (orders LEFT JOIN users) | 2 rows — same, since every order does have a matching user here |
| `users LEFT JOIN orders` | 3 rows — all three users, with `NULL` order columns for user 3 |

### Common Misconceptions

**"A LEFT JOIN and an INNER JOIN return the same thing if I'm confident
every row has a match."** Even when that's usually true, an unexpected
orphaned or unmatched row silently changes the result differently
depending on which join type was used — defensively choosing the join
type that matches the actual guaranteed relationship (not just the usual
case) avoids a class of subtle, intermittent bugs.

### Practice

Using the trace above, if you wanted a list of *every* user, including
ones with zero orders, showing their order total if they have one —
which join direction and type would you use? *(`users LEFT JOIN
orders` — keeping every row from `users` regardless of whether a
matching order exists, with `NULL` filled in for users with none.)*

### Code Reading

```sql
SELECT users.name, COUNT(orders.id) AS order_count
FROM users
LEFT JOIN orders ON users.id = orders.user_id
GROUP BY users.name;
```

Why does this use `LEFT JOIN` rather than a plain `JOIN`, given the
query is trying to show an order count per user? *(A plain `JOIN`
(inner) would exclude users with zero orders entirely from the result,
since they have no matching row in `orders`; `LEFT JOIN` keeps them,
correctly showing an order count of 0 for them instead of omitting
them.)*

### Mastery Check (Reason)

A report is supposed to show every product, along with its total units
sold (0 if never sold) — using what you know about join types, explain
the bug in a query that used a plain `JOIN` between `products` and
`order_items` instead of a `LEFT JOIN`, and what specifically goes wrong
in the output.

### Deeper / Deferred

How the query planner actually chooses a join algorithm (nested loop,
hash join, merge join) based on table size and available indexes —
named, not required at this depth.

---

## pg.indexes — Indexes

**Target depth:** Reason

### What Is It?

An index is an auxiliary data structure that lets Postgres find rows
matching a condition (usually on a specific column) without scanning
every row in the table — at the cost of extra storage and slightly
slower writes to keep the index itself up to date.

### Mental Model

Think of an index like a book's index page — instead of reading every
page to find every mention of a topic, you jump straight to the relevant
pages via a pre-built lookup; building and maintaining that lookup costs
something, but it pays off enormously whenever you need to look
something up by that topic.

**An index trades some storage and slower writes for dramatically faster
reads on the specific column(s) it covers — without one, finding a row
means scanning the whole table.**

### How It Works

```sql
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

Once this index exists, a query like `SELECT * FROM orders WHERE
user_id = 42` can use the index's own ordered structure (commonly a
B-tree) to jump almost directly to matching rows, instead of checking
every row in `orders` one by one (a "sequential scan"). Postgres's query
planner (`EXPLAIN`) decides automatically whether using a given index is
actually faster than a sequential scan for a specific query.

### Important Distinctions

- An index ≠ free — every `INSERT`/`UPDATE`/`DELETE` on an indexed column
  also has to update the index itself, so tables with many indexes have
  slower writes; more indexes ≠ always better, since each one adds that
  overhead whether or not it's actually used often.
- A primary key ≠ needing a separately created index — Postgres
  automatically creates an index for primary key (and unique)
  constraints, since enforcing uniqueness efficiently requires one
  anyway.

### Why Does It Exist?

Without an index, finding rows matching a condition requires scanning
every single row in the table — fine for a tiny table, prohibitively
slow for a table with millions of rows; an index lets that lookup scale
far better, at the cost of the storage/write overhead of maintaining it.

### Connections

- **Prerequisite (BLOCKING):** `pg.tables-rows-columns`,
  `pg.crud-statements` — understanding what a `WHERE`-filtered query
  actually needs to do is what motivates why an index helps.
- **Enables:** real-world query performance work generally, and directly
  connects to `bq.postgres-vs-bigquery`'s OLTP-vs-OLAP distinction —
  Postgres's row-level indexes solve a fundamentally different problem
  than BigQuery's columnar scan-everything approach.

### Production Appearance

Any column frequently used in a `WHERE` clause, a `JOIN`'s `ON`
condition, or an `ORDER BY` in a real, growing application is a strong
candidate for an index — and a slow query in production is very often
traced back to a missing index on exactly the column being filtered on.

### Trace

A `users` table with 1,000,000 rows, querying `WHERE email =
'ada@example.com'`:

| Scenario | What happens |
|---|---|
| No index on `email` | Postgres scans all 1,000,000 rows checking each one — a sequential scan |
| Index on `email` | Postgres uses the index's B-tree structure to jump almost directly to the matching row(s) |

### Common Misconceptions

**"Adding an index always makes queries faster, so index every
column."** Every index adds write overhead and storage cost, and an
index that's rarely used in a `WHERE`/`JOIN`/`ORDER BY` clause provides
no read benefit to offset that cost — the real skill is indexing the
columns actually used in frequent, performance-sensitive queries, not
indexing everything defensively.

### Practice

A table has a column that's updated extremely frequently (on every
single write) but is almost never used to filter or search for rows — is
this a good candidate for an index? *(No — the write overhead of
maintaining the index on every update would be paid constantly, with
little to no read benefit, since the column is rarely queried on.)*

### Mastery Check (Reason)

A specific query has become slow as a table grew from 1,000 to
10,000,000 rows. Using what you know about indexes, describe the general
diagnostic process you'd follow (what you'd check, in order) before
concluding "add an index" is actually the right fix, rather than jumping
straight to adding one blindly.

### Deeper / Deferred

B-tree internals, and how `EXPLAIN ANALYZE`'s query plan output is
actually read and interpreted — named, not required at this depth.

---

## pg.constraints — Constraints

**Target depth:** Use

### What Is It?

Constraints are rules Postgres enforces on a table's data at write
time — `NOT NULL` (a value must be provided), `UNIQUE` (no two rows can
share this value), `CHECK` (a custom condition must hold), and foreign
key constraints (`pg.primary-foreign-keys`) — rejecting any insert or
update that would violate them.

### Mental Model

Think of constraints as the database's own built-in quality checks at
the door — rather than trusting every piece of application code to
remember to validate "is this email actually unique," the database
itself refuses to store data that breaks a declared rule, no matter
which code path tried to write it.

**A constraint is a rule the database enforces itself, on every write,
from every source — application-level validation can be skipped or
buggy; a database constraint can't be bypassed once declared.**

### How It Works

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  age INTEGER CHECK (age >= 0)
);
```

`NOT NULL` rejects an insert missing `email`; `UNIQUE` rejects a second
row with an already-used `email`; `CHECK (age >= 0)` rejects any row
where `age` is negative — all enforced by Postgres itself, regardless of
what inserted the row.

### Important Distinctions

- A database constraint ≠ the same as application-level validation (like
  `fastapi.pydantic-validation`) — Pydantic validates a request's shape
  before it ever becomes a database write; a database constraint is the
  last line of defense, enforced even if some other code path (a script,
  a different service, a manual `psql` session) writes to the table
  directly, bypassing the application entirely.
- `UNIQUE` ≠ the same as a `PRIMARY KEY` — a table can have one primary
  key but multiple separate `UNIQUE` constraints on other columns.

### Why Does It Exist?

Relying solely on application code to enforce data integrity rules means
any bug, any bypassed validation, or any other system writing to the
same database can silently corrupt data; constraints make invalid data
structurally impossible to store, independent of which code path
attempted the write.

### Connections

- **Prerequisite:** `pg.tables-rows-columns`, `pg.primary-foreign-keys` —
  a foreign key is itself one kind of constraint.
- **Related:** `fastapi.pydantic-validation` — the same "reject bad
  input" idea, enforced at a different layer, for a different reason
  (usability of error messages vs. absolute data integrity).

### Production Appearance

A migration file's `CREATE TABLE`/`ALTER TABLE` statements listing `NOT
NULL`, `UNIQUE`, and `CHECK` constraints define exactly which
data-integrity rules a given table actually enforces at the database
level.

### Example

`CREATE TABLE orders (..., quantity INTEGER CHECK (quantity > 0));`
makes it structurally impossible to ever insert an order with zero or
negative quantity, regardless of which application code path tried.

### Practice

An application's form validation checks that an email is provided before
submitting, but the database's `email` column has no `NOT NULL`
constraint — if a different internal script inserts a row directly into
the database, bypassing the form entirely, what's the risk? *(The script
could insert a row with no email at all, since nothing at the database
level actually enforces that requirement — the form's validation only
protects that one code path, not the table itself.)*

---

## pg.transactions — Transactions

**Target depth:** Reason

*(Reproduced from `chain-3-oltp-to-olap.md` — content unchanged.)*

### What Is It?

A transaction is a group of one or more SQL statements executed as a
single all-or-nothing unit — either every statement in it succeeds and is
committed, or (on any failure) all of them are rolled back as if none had
happened.

### Mental Model

Think of a transaction as an envelope around several statements with a
single wax seal — you can't half-open it; either the whole envelope's
contents take effect, or none do.

**A transaction makes several statements behave like one — atomic, so a
failure partway through leaves the database exactly as it was before any
of them ran.**

### How It Works

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

If the second `UPDATE` fails for any reason (a constraint violation, a
crash), Postgres discards the first `UPDATE`'s effect too —
`ROLLBACK` instead of `COMMIT`. Without wrapping both statements in a
transaction, a crash between them would leave $100 deducted from account
1 but never added to account 2.

### Important Distinctions

- A transaction ≠ a performance optimization — it's a correctness
  guarantee (the "A" in ACID: atomicity), not primarily a speed feature.
- `COMMIT` ≠ automatic — outside an explicit transaction block, most
  drivers auto-commit each statement individually, which is exactly the
  unsafe case the example above avoids.

### Why Does It Exist?

Real operations often require multiple statements to succeed together
(transferring money between two rows, creating an order and decrementing
inventory) — without transactions, a crash or error mid-sequence could
leave the database in an inconsistent, half-updated state with no way to
detect or repair it automatically.

### Connections

- **Prerequisite:** `pg.crud-statements`.
- **Enables:** `integration.app-to-analytics-data-flow` — OLTP systems
  like Postgres are optimized for exactly this kind of frequent, small,
  transactional write, the defining trait BigQuery's OLAP model
  deliberately trades away (see `bq.postgres-vs-bigquery`).

### Production Appearance

Any operation touching more than one table that must succeed or fail
together — placing an order (create order row + decrement stock row), a
money transfer, a user signup that also creates a related profile row.

### Example

The "cancel order" trace in `integration.trace-request-frontend-to-db`
step 6 is itself typically wrapped in a transaction if cancelling also
needs to restore inventory in a second table.

### Common Misconceptions

**"Wrapping everything in a transaction is always safer, so just do it
everywhere."** Long-running transactions hold locks and can block other
queries; transactions should scope exactly the statements that truly need
to succeed together, not the whole request handler by habit.

### Practice

An order-cancellation flow updates the order's status AND increments a
product's stock count, in two separate `UPDATE` statements. Without a
transaction, what specific failure mode becomes possible if the second
statement fails? *(The order shows cancelled but stock was never
restored — a permanently inconsistent state.)*

### Mastery Check (Reason)

Explain, in terms of atomicity, why a data pipeline reading from Postgres
for analytics needs to worry about *which* rows are safe to read —
specifically, rows from a transaction that hasn't committed yet.

### Deeper / Deferred

Isolation levels and MVCC (how Postgres lets concurrent transactions see
consistent snapshots without blocking each other) — named, not required
at this depth.
