# Module 11 — GCP Fundamentals (`gcp.*`)

Full concept content for all 8 concepts in `02-curriculum-model.md`'s GCP
Fundamentals module, in curriculum order. One was already authored in
`chain-4-react-to-cloud-deployment.md` and is reproduced verbatim here
(if edited later, edit both copies together). This module deliberately
stays lighter than most — mostly Recognize/Understand depth, matching
the curriculum model's own call: a service *survey* for codebase
readiness, not infrastructure operations training. The BigQuery bullet
from the original curriculum list is intentionally not a concept here —
it's cross-referenced to Module 10 (`bq.*`) instead, per
`02-curriculum-model.md`'s duplicate-resolution note.

---

## gcp.projects-regions — GCP projects & regions

**Target depth:** Recognize

### What Is It?

A GCP project is the top-level container for all resources, billing, and
permissions in Google Cloud — everything (a Cloud Run service, a
BigQuery dataset, a Cloud SQL instance) belongs to exactly one project.
A region is a specific geographic location (e.g. `us-central1`) where a
resource's underlying infrastructure actually runs.

### Mental Model

Think of a project as a company's account with Google Cloud — one
billing relationship, one set of permissions boundaries — and a region as
choosing which physical warehouse (out of many around the world) a
specific resource should live in, for latency and data-residency
reasons.

**A project is the administrative boundary everything belongs to; a
region is the physical location a specific resource actually runs in.**

### How It Works

Creating any GCP resource requires specifying which project it belongs
to (often set by default to whichever project is currently active) and,
for most resources, which region (and sometimes zone, a specific data
center within a region) it should run in.

### Important Distinctions

A project ≠ a region — a single project commonly has resources spread
across multiple regions; choosing a region is a per-resource decision,
not a project-wide one.

### Why Does It Exist?

Organizations need a clear administrative and billing boundary (the
project) separate from the physical, latency/compliance-driven decision
of where a resource's infrastructure actually runs (the region) —
conflating the two would make both organizing access and optimizing for
latency/compliance much harder.

### Connections

- **Enables:** `gcp.iam-permissions` (permissions are typically scoped
  at the project level), `gcp.cloud-run`, `gcp.cloud-storage`,
  `gcp.cloud-sql` — every GCP resource lives in a project and, usually, a
  region.

### Production Appearance

A GCP console URL, or a `gcloud` command, almost always includes a
project id and frequently a region flag — recognizing these two
identifiers is a basic prerequisite for reading any GCP configuration.

### Practice

If a company has one GCP project but serves users in both the US and
Europe, would they typically create a second project for the European
resources, or deploy resources in a different region within the same
project? *(Typically the same project, different region — regions
handle the geographic/latency concern; a second project would only make
sense for a genuinely separate billing or permissions boundary.)*

---

## gcp.iam-permissions — IAM & permissions

**Target depth:** Understand

### What Is It?

IAM (Identity and Access Management) is GCP's system for controlling who
(a person, or a service) can do what to which resources — granting roles
(bundles of permissions) to identities, scoped at the project, folder, or
individual-resource level.

### Mental Model

Think of IAM as a building's keycard system — each keycard (identity) is
issued specific access levels (roles) to specific doors (resources), and
the same person might have different access to different rooms depending
on what role they've been assigned for each.

**IAM answers "who can do what to which resource" — a role is a named
bundle of permissions, and it's granted to an identity at some scope
(project-wide, or narrower).**

### How It Works

A role like "BigQuery Data Viewer" bundles together the specific
permissions needed to read BigQuery data; granting that role to a
specific user (or a service account — an identity for a running
application, not a person) at the project level gives them exactly that
access, project-wide, without needing to hand-pick individual permissions
one at a time.

### Important Distinctions

- A role ≠ a single permission — it's a curated bundle of many
  individual permissions, chosen to match a common real-world job
  (viewing data, deploying services, administering a project).
- A user identity ≠ a service account — a user account belongs to a
  person logging in; a service account is an identity a running
  application or service uses to authenticate itself to other GCP
  resources, with no human directly behind it at request time.

### Why Does It Exist?

Without a structured permissions system, every team member and every
running service would need broad, unmanaged access (or none at all) —
IAM lets access be granted precisely, matching exactly what a given
identity actually needs, and revoked cleanly when it's no longer needed.

### Connections

- **Prerequisite:** `gcp.projects-regions`.
- **Enables:** every other GCP concept in this module — accessing Cloud
  Run, Cloud Storage, Cloud SQL, Secret Manager, or BigQuery all go
  through this same permissions layer. Related —
  `backend.authn-vs-authz`'s same authentication-vs-authorization
  distinction, applied here to infrastructure access rather than
  application users.

### Production Appearance

A service failing with a "permission denied" error when trying to access
another GCP resource (a Cloud Run service unable to read a Cloud Storage
bucket) is almost always an IAM issue — the calling service's account is
missing the needed role.

### Example

A Cloud Run service's own service account is granted the "Cloud SQL
Client" role, letting that specific running service (and nothing else)
connect to a specific Cloud SQL database.

### Practice

A Cloud Run service is failing to write to a Cloud Storage bucket with a
permissions error — using what you know about service accounts, what's
the most likely thing to check first? *(Whether the Cloud Run service's
own service account has been granted a role that includes write access
to that specific bucket.)*

---

## gcp.compute-storage-concepts — Compute & storage concepts

**Target depth:** Recognize

### What Is It?

A broad orientation to GCP's two foundational resource categories:
compute (running code — virtual machines, containers, serverless
functions) and storage (persisting data — object storage, block storage,
managed databases), before looking at specific services in each
category.

### Mental Model

Think of compute as the "doing" side of cloud infrastructure (something
is actively running, using CPU and memory) and storage as the "keeping"
side (data sitting durably, available whether or not anything is
actively running right now) — most real systems combine several of each.

**Compute is where your code actually runs; storage is where your data
actually lives — a real application typically needs services from both
categories, chosen based on the specific shape of work or data
involved.**

### How It Works

GCP offers multiple options within each category, suited to different
needs — compute options range from fully-managed serverless (Cloud Run,
`gcp.cloud-run`) to more manually-configured virtual machines (Compute
Engine); storage options range from object storage for files (Cloud
Storage, `gcp.cloud-storage`) to managed relational databases (Cloud
SQL, `gcp.cloud-sql`) to the analytical warehouse already covered
(BigQuery).

### Important Distinctions

- Compute ≠ storage — a common early confusion is not clearly separating
  "where does my code run" from "where does my data persist," but
  they're answered by genuinely different GCP services with different
  tradeoffs.
- More managed (like Cloud Run) ≠ always the right choice over less
  managed (like a raw virtual machine) — more management by Google means
  less manual configuration but also less low-level control; the right
  choice depends on the actual need.

### Why Does It Exist (as an orientation)

Before looking at GCP's many specific services, having this two-category
mental map (compute vs. storage) makes it much easier to understand what
problem each specific service (covered next in this module) actually
solves.

### Connections

- **Enables:** `gcp.cloud-run` (compute), `gcp.cloud-storage` and
  `gcp.cloud-sql` (storage).

### Production Appearance

An architecture diagram of almost any real cloud-deployed application
shows at least one compute service (running the application code) and
at least one storage service (persisting its data) — this two-category
split is visible at the highest level of nearly every real system.

### Practice

Would a managed relational database service (like Cloud SQL) be
classified as compute or storage? *(Storage — even though a database
technically runs processes, its role from this categorization's
perspective is persisting and serving data, the storage side of the
split.)*

---

## gcp.cloud-run — Cloud Run

**Target depth:** Use

*(Reproduced from `chain-4-react-to-cloud-deployment.md` — content unchanged.)*

### What Is It?

Cloud Run is a GCP service that runs a containerized application,
automatically scaling the number of running instances (including down to
zero) based on incoming traffic, and exposing it via a public HTTPS URL.

### Mental Model

Hand Cloud Run a container image, and it takes care of "keep this
running, give it a URL, add more copies under load, remove them when
idle" — you don't manage individual servers.

**Cloud Run runs your container and handles scaling for you — you think
in terms of the container, not in terms of provisioning machines.**

### How It Works

You build a container image (typically via a `Dockerfile`), push it to a
container registry, and deploy it to Cloud Run, which assigns a URL and
starts running instances of that container as requests arrive.

### Important Distinctions

Cloud Run ≠ a traditional always-on server you provision — it can scale
to zero instances when idle (no traffic, no running cost) and back up
automatically, which changes both cost and the kinds of state a service
can safely hold (nothing that must persist in memory between requests,
since an instance can be replaced at any time).

### Why Does It Exist?

Many applications don't need a fixed number of always-on servers — Cloud
Run removes the operational work of provisioning and scaling servers
manually for a containerized service.

### Connections

- **Prerequisite:** `gcp.compute-storage-concepts`.
- **Enables:** `gcparch.frontend-backend-deployment-flow`.

### Production Appearance

Both the Next.js frontend's server half and the FastAPI backend in this
curriculum's target stack are plausible Cloud Run services — two separate
deployed containers, communicating over HTTP
(`gcparch.service-to-service-communication`).

### Practice

Why would holding important state only in a running instance's memory
(not in Postgres) be risky on Cloud Run specifically? *(An idle instance
can scale to zero and be replaced — anything not persisted to a real
database is lost.)*

---

## gcp.cloud-storage — Cloud Storage

**Target depth:** Understand

### What Is It?

Cloud Storage is GCP's object storage service — for storing and
retrieving files (images, documents, backups, any blob of data) by name,
organized into "buckets," without the file-system-and-server model a
traditional disk implies.

### Mental Model

Think of Cloud Storage as an enormous, durable filing cabinet with
unlimited drawers (buckets) — you put a file in with a name, and later
ask for it back by that same name; there's no server to manage, no disk
to run out of space on, and objects are accessible directly over HTTP.

**Cloud Storage holds files (objects) inside buckets, addressed by
name — it's built for storing and retrieving whole files reliably at
scale, not for structured, queryable data the way a database is.**

### How It Works

A bucket is created with a globally unique name; objects (files) are
uploaded into it, each identified by a key (effectively a path-like
name); an object can be made publicly accessible or restricted via IAM,
and is typically fetched over a URL or via a client library.

### Important Distinctions

- Object storage (Cloud Storage) ≠ a database — it stores and retrieves
  whole files by name; it has no query language for searching *inside*
  file contents, no rows/columns, no relationships (that's what Cloud
  SQL or BigQuery are for).
- A bucket ≠ a folder on a traditional file system — there's no true
  nested directory structure underneath; apparent "folders" in Cloud
  Storage are really just naming conventions (object keys containing
  `/`) rather than real filesystem directories.

### Why Does It Exist?

Applications constantly need to store files (user uploads, generated
reports, backups) durably and at scale, without managing physical disks
or a traditional file server — object storage is purpose-built for
exactly that, with strong durability guarantees and effectively
unlimited capacity.

### Connections

- **Prerequisite:** `gcp.compute-storage-concepts`.
- **Related:** `dbconcepts.data-structuring-spectrum`'s unstructured
  end — files stored in Cloud Storage are the concrete, real-world
  instance of "unstructured data" from that concept.

### Production Appearance

User-uploaded profile pictures, generated PDF invoices, and application
log archives commonly live in a Cloud Storage bucket, referenced from
the application's database by their object key/URL rather than stored
directly in the database itself.

### Example

A user uploads a profile photo; the application stores the actual image
file in a Cloud Storage bucket and saves just the resulting object's URL
in the `users` table's `avatar_url` column, rather than storing the
image bytes directly in Postgres.

### Practice

Would it make sense to store a user's uploaded 5MB profile photo directly
as a column value in a Postgres table, or in Cloud Storage with just a
reference URL saved in Postgres? *(Cloud Storage with a reference URL —
object storage is purpose-built for large binary files; storing large
blobs directly in a relational database's rows is a common anti-pattern
that bloats the database and doesn't fit its structured-data
strengths.)*

---

## gcp.cloud-sql — Cloud SQL

**Target depth:** Use

### What Is It?

Cloud SQL is GCP's fully-managed relational database service — running
an actual PostgreSQL (or MySQL/SQL Server) instance, with Google handling
the underlying server provisioning, patching, backups, and failover,
rather than the team managing that infrastructure themselves.

### Mental Model

Think of Cloud SQL as renting a fully-maintained Postgres database
instead of running your own server — everything you already know about
Postgres (`pg.*`) still applies once connected; Google just handles the
"keeping a real server running, patched, and backed up" work underneath.

**Cloud SQL is managed Postgres (or MySQL) — the database itself behaves
exactly as covered in Module 8, but the operational burden of running the
server shifts to Google.**

### How It Works

A Cloud SQL instance is provisioned (choosing Postgres as the engine, a
region, and a machine size), given network access rules (often
restricted to specific GCP services or IP ranges), and an application
connects to it using a standard Postgres connection string/driver — from
the application's perspective, it behaves like any other Postgres
database.

### Important Distinctions

- Cloud SQL ≠ a different database engine from the Postgres already
  covered — it *is* Postgres, managed; SQL syntax, transactions,
  indexes, all of `pg.*` applies unchanged.
- Cloud SQL ≠ automatically accessible from anywhere — connecting to it
  typically requires specific network configuration
  (`gcparch.backend-db-connection`, `gcparch.service-to-service-communication`)
  rather than being open to the public internet by default.

### Why Does It Exist?

Running a production-grade database server yourself means handling
patching, backups, failover, and scaling manually — significant, ongoing
operational work; a managed service like Cloud SQL removes that burden
while still providing the exact same Postgres engine and behavior the
team already knows.

### Connections

- **Prerequisite (BLOCKING):** `pg.relational-fundamentals`,
  `gcp.compute-storage-concepts`.
- **Enables:** `gcparch.backend-db-connection` — the FastAPI backend
  module's connection to this managed database, in the fuller Module 12
  picture.

### Production Appearance

A backend's database connection string pointing at a Cloud SQL
instance's private IP or Unix socket (rather than `localhost`), and
infrastructure config referencing a Cloud SQL instance name, are the
concrete signals of this service in a real deployed application.

### Practice

Does moving from a self-hosted Postgres server to Cloud SQL require
rewriting any of the actual SQL queries or application code that talks
to the database? *(No — Cloud SQL runs the same Postgres engine, so
existing SQL and the application's database code work unchanged; what
changes is how the database is provisioned, connected to, and operated,
not its query behavior.)*

---

## gcp.secret-manager — Secret Manager

**Target depth:** Understand

### What Is It?

Secret Manager is GCP's service for securely storing and controlling
access to sensitive values — API keys, database passwords, credentials —
separately from application code or configuration files, with access
governed by IAM and every access logged.

### Mental Model

Think of Secret Manager as a locked safe for an application's passwords
and keys — instead of writing a database password directly into a config
file (where anyone with file access, or anyone browsing version control
history, could read it), the application asks the safe for the value at
runtime, and the safe only hands it over to identities explicitly
permitted to ask.

**Secret Manager keeps sensitive values out of code and config files
entirely — an application fetches a secret's current value at runtime,
via IAM-governed access, rather than having it hardcoded or committed
anywhere.**

### How It Works

A secret (e.g. a database password) is created in Secret Manager with a
name; a running service (like a Cloud Run instance) is granted IAM
permission to access that specific secret, and fetches its current value
at startup or runtime via an API call or a mounted reference — the
actual secret value never needs to appear in the application's source
code or a `.env` file checked into version control.

### Important Distinctions

- Secret Manager ≠ the same as `next.env-vars`'s `NEXT_PUBLIC_`
  distinction, though related in spirit — Secret Manager is specifically
  for values that must never be exposed anywhere, including to the
  backend's own source code/config files, whereas ordinary (non-public)
  environment variables are already a step better than hardcoding but
  still often live in a config file that could be accidentally exposed
  or committed.
- A secret's value ≠ static forever — Secret Manager supports
  versioning, so a compromised or rotated credential can be updated
  without redeploying application code that references it by name.

### Why Does It Exist?

Storing credentials directly in code or committed config files is a
common, serious security mistake — anyone with repository access (or
anyone who finds an old commit) could read them; a dedicated,
access-controlled, audited secret store removes that entire class of
exposure.

### Connections

- **Prerequisite:** `gcp.iam-permissions`.
- **Related:** `next.env-vars` — the same underlying principle
  (sensitive values need careful, deliberate handling) applied at the
  frontend/build-time layer versus this backend/infrastructure layer.
  Enables `gcparch.env-vars-secrets` (Module 12 covers how these come
  together across the whole deployed system).

### Production Appearance

Infrastructure/deployment configuration referencing a secret by name
(rather than containing an actual password value) is the signal that a
real system is using Secret Manager rather than a plain config file for
its credentials.

### Practice

A database password is currently hardcoded directly in a backend's
source file, which is committed to a shared git repository — what's the
risk, and how would moving it to Secret Manager address it? *(The risk
is that anyone with repository access — including in the commit history,
even if later removed from the current version — can read the actual
password; moving it to Secret Manager means the code only references the
secret's name, and the actual value is fetched at runtime by an identity
explicitly granted access, never appearing in the repository at all.)*

---

## gcp.logging-monitoring — Basic logging & monitoring

**Target depth:** Recognize

### What Is It?

GCP's logging and monitoring tools (Cloud Logging and Cloud Monitoring)
collect, store, and let you search a running application's log output
and operational metrics (CPU usage, request counts, error rates), giving
visibility into what a deployed system is actually doing.

### Mental Model

Think of logging as the running system's own written diary — every
significant event a service logs gets collected centrally, searchable
later — and monitoring as a live dashboard of vital signs (how busy is
it, how many errors, how much memory) that can alert someone when
something looks wrong.

**Logging tells you what happened, in detail, after the fact; monitoring
tells you how the system is doing, in aggregate, right now (and can page
someone when a metric crosses a threshold).**

### How It Works

A running service's standard output/error (and structured log calls) are
automatically collected by Cloud Logging without extra setup for many
GCP services (like Cloud Run); Cloud Monitoring tracks metrics over time
and can be configured with alerting policies that notify someone when,
say, error rates spike or latency crosses a threshold.

### Important Distinctions

Logging (detailed, per-event records) ≠ monitoring (aggregated metrics
and trends over time) — debugging one specific failed request usually
means searching logs; understanding whether the system is healthy
overall usually means looking at monitoring dashboards, and real
incident response typically uses both together.

### Why Does It Exist?

Without centralized logging and monitoring, understanding why a deployed
system failed (or noticing it's failing at all) would require manually
checking individual servers/containers — infeasible at any real scale,
and far too slow for catching problems before they become major
incidents.

### Connections

- **Prerequisite:** `gcp.cloud-run` (or any compute service — this
  concept applies to whatever's actually running).
- **Related:** `gcparch.overall-system-architecture` — Module 12's full
  picture includes where observability fits into the deployed system.

### Production Appearance

Opening Cloud Logging to search for a specific error message after a bug
report, or checking a Cloud Monitoring dashboard to see whether a
service's error rate spiked after a recent deploy, are both extremely
common real-world debugging workflows.

### Practice

A user reports "the app was broken for a few minutes around 2pm" — would
you start by checking logs, monitoring dashboards, or both? *(Both,
typically in sequence — monitoring dashboards quickly confirm whether
something was actually abnormal (an error-rate or latency spike) around
that time, and logs then let you dig into the specific requests/errors
during that window for the actual root cause.)*
