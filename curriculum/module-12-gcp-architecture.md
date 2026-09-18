# Module 12 — GCP + Application Architecture (`gcparch.*`)

Full concept content for all 6 concepts in `02-curriculum-model.md`'s GCP
+ Application Architecture module, in curriculum order. One was already
authored in `chain-4-react-to-cloud-deployment.md` and is reproduced
verbatim here (if edited later, edit both copies together). This module
assembles everything from Modules 1–11 into one connected system —
`gcparch.overall-system-architecture` is this curriculum's Phase-B
counterpart to `revA.frontend-api-backend-connection`.

---

## gcparch.app-deployment — How applications are deployed on GCP

**Target depth:** Use

### What Is It?

Application deployment on GCP is the process of taking an application's
code and turning it into a running, publicly reachable service —
building a container image, pushing it to a registry, and deploying that
image to a compute service (typically Cloud Run for this curriculum's
stack).

### Mental Model

Think of deployment as the pipeline between "code on a laptop" and "a
real, running thing users can reach" — package the code into a portable,
self-contained unit (a container), send that unit somewhere it can run
continuously (Cloud Run), and get back a live URL.

**Deployment turns source code into a container image, and turns a
container image into a running, reachable service — two distinct steps,
each with its own tooling.**

### How It Works

A `Dockerfile` in the project defines how to build a container image
from the source code (installing dependencies, copying files, specifying
the startup command); a build step (often automated via CI/CD) builds
that image and pushes it to a container registry (like Google's Artifact
Registry); a deploy step tells Cloud Run to run a new revision using
that pushed image, which then becomes reachable at the service's URL.

### Important Distinctions

- Building the image ≠ the same step as deploying it — building produces
  a portable artifact; deploying is telling a specific compute service to
  actually run that artifact.
- A new deployment ≠ overwriting the running service destructively by
  default — Cloud Run typically creates a new "revision" and can shift
  traffic to it gradually or instantly, which is what makes rollbacks to
  a previous revision straightforward if something goes wrong.

### Why Does It Exist?

Without a defined, repeatable deployment process, getting code from a
developer's machine into production would be manual, inconsistent, and
error-prone; a container-based pipeline makes "what's actually running"
precisely reproducible from the same source that was built and tested.

### Connections

- **Prerequisite (BLOCKING):** `gcp.cloud-run`.
- **Enables:** `gcparch.frontend-backend-deployment-flow` — the
  two-service, frontend+backend specific version of this same process.

### Production Appearance

A `Dockerfile` at a project's root, and a CI/CD configuration file (like
a `cloudbuild.yaml` or a GitHub Actions workflow) that builds and deploys
on every push to a main branch, are the concrete artifacts of this
process in a real repository.

### Example

Pushing a code change to the main branch automatically triggers a build
of a new container image and a deploy to Cloud Run, making the change
live within minutes without anyone manually running deployment commands.

### Practice

If a newly deployed revision has a bug, and the previous revision was
working fine, what's generally the fastest way to restore service on
Cloud Run? *(Roll back by shifting traffic back to the previous,
known-good revision — since Cloud Run keeps prior revisions available
rather than only the latest, this is typically much faster than
diagnosing and fixing the bug under pressure.)*

---

## gcparch.backend-db-connection — Connecting backend services with databases

**Target depth:** Use

### What Is It?

The specific mechanism by which a deployed backend service (like a
FastAPI app on Cloud Run) actually connects to its database (like Cloud
SQL) at runtime — network configuration, connection strings, and
credentials, all working together securely.

### Mental Model

Think of this as the actual wiring between two separately deployed
pieces — the backend service and the database aren't automatically aware
of each other just because they're in the same GCP project; the
connection has to be explicitly configured, both for network
reachability and for authentication.

**A backend and its database are two separate deployed things —
connecting them means both making the database network-reachable from
the backend and giving the backend credentials it's actually allowed to
use, neither of which happens automatically.**

### How It Works

A Cloud Run service connects to a Cloud SQL instance typically via a
Cloud SQL connector (using a secure, authenticated proxy connection
rather than a raw public IP) or a private IP within the same network;
the actual database password is fetched from Secret Manager
(`gcp.secret-manager`) rather than hardcoded, and the Cloud Run service's
own service account is granted IAM permission (`gcp.iam-permissions`) to
both access that secret and connect to that specific Cloud SQL instance.

### Important Distinctions

- This connection ≠ automatic just because both services are in the
  same GCP project — explicit configuration (network access, IAM grants,
  connection string construction) is required on both sides.
- The actual SQL/database code (`pg.*`) ≠ different in a deployed
  environment versus local development — once connected, the application
  talks to Postgres exactly as it always has; what changes is entirely
  how that connection gets established and secured.

### Why Does It Exist?

A production database needs to be reachable only by the services that
legitimately need it, never openly exposed to the public internet — the
specific connection mechanism (proxying, IAM-gated credentials) is what
enforces that boundary while still letting the legitimate backend
service connect reliably.

### Connections

- **Prerequisite (BLOCKING):** `fastapi.routes-endpoints`/
  `fastapi.dependency-injection` (the database session pattern),
  `pg.crud-statements`, `gcp.cloud-sql`, `gcp.secret-manager`.
- **Enables:** the deployed-environment version of
  `integration.trace-request-frontend-to-db`'s database step.

### Production Appearance

A backend's deployment configuration specifying a Cloud SQL connection
name (rather than `localhost`), and environment variables/secrets
referencing database credentials rather than containing them directly,
are the concrete signals of this setup in real deployment config.

### Example

A FastAPI app's `get_db()` dependency (`fastapi.dependency-injection`)
constructs its connection string at startup by reading the database
password from an environment variable that was itself populated from
Secret Manager, and connects via the Cloud SQL connector's socket path
rather than a public hostname.

### Practice

A newly deployed backend service can't connect to its Cloud SQL
database, but the same code works fine locally against a local Postgres
instance — using what you know about this connection mechanism, what's
the most likely category of issue (versus a bug in the actual query
code)? *(A configuration/permissions issue specific to the deployed
environment — most likely the service account lacks the IAM role to
connect to Cloud SQL, or the network/connector configuration is missing,
since the actual database code itself is unchanged from what works
locally.)*

---

## gcparch.frontend-backend-deployment-flow — Frontend/backend deployment flow

**Target depth:** Use

*(Reproduced from `chain-4-react-to-cloud-deployment.md` — content unchanged.)*

### What Is It?

This concept covers how a Next.js application (with its server and
client halves, `next.server-client-components`) and its backend
(FastAPI) actually get deployed and run as live services on GCP.

### Mental Model

Think of it as the difference between a script on your laptop and a
service that stays running, reachable by URL, restarts itself if it
crashes, and scales when traffic increases — deployment is the process of
turning the former into the latter.

**Deployment packages the app (frontend's server half included, since
it's not purely static anymore) into a container, and a managed service
runs that container, reachable by a public URL.**

### How It Works

A Next.js app (server components included) and a FastAPI app are each
typically packaged as a container image and deployed to Cloud Run
(`gcp.cloud-run`), which runs the container, exposes it via HTTPS, and
can scale the number of running instances up or down based on traffic.

### Important Distinctions

This isn't "upload some HTML files to a static host" — because Next.js
Server Components run real server-side code per request, the frontend
needs an actual running service, not just static file hosting (unlike a
purely client-rendered React app, which *could* be hosted as static
files).

### Why Does It Exist?

An application built as code needs an actual running environment,
reachable on the internet, to be usable by real users — deployment is the
bridge from "code in a repository" to "a live product."

### Connections

- **Prerequisite (BLOCKING):** `next.server-client-components`,
  `gcp.cloud-run`, `gcparch.app-deployment`.
- **Enables:** `gcparch.overall-system-architecture`.

### Production Appearance

Look for a `Dockerfile` and a deployment config (e.g. a `cloudbuild.yaml`
or CI/CD pipeline step referencing Cloud Run) in a real repo — that's
what turns this concept from an idea into an actual running service.

### Practice

Could a Next.js app that uses Server Components be deployed as a plain
static file host with no server running at all? *(No — Server Components
need a running server per request; a purely client-rendered React app
could be static, but this one can't.)*

---

## gcparch.env-vars-secrets — Environment variables and secrets

**Target depth:** Use

### What Is It?

How environment variables and secrets actually come together across a
deployed system — non-sensitive configuration (an API base URL, a
feature flag) set as plain environment variables at deploy time, while
sensitive values (database passwords, API keys) are instead injected
from Secret Manager, never as plain deployment configuration.

### Mental Model

Think of a deployed service's configuration as having two tiers — an
open bulletin board (plain environment variables, visible in deployment
config, fine for non-sensitive values) and a locked safe (Secret
Manager, for anything that must stay confidential) — the deployment
process pulls from both, but only the safe requires the extra IAM-gated
access step.

**Non-sensitive config becomes a plain environment variable at deploy
time; sensitive config is referenced by name and fetched from Secret
Manager at runtime — mixing the two up (putting a secret in plain
config) is exactly the mistake this concept exists to prevent.**

### How It Works

A Cloud Run service's deployment configuration sets plain environment
variables directly (e.g. `LOG_LEVEL=info`, or
`NEXT_PUBLIC_API_BASE_URL` for the frontend, `next.env-vars`) and
separately references specific secrets by name (e.g.
`DATABASE_PASSWORD` mapped to a Secret Manager secret), which Cloud Run
injects as an environment variable at runtime without ever storing the
actual value in the deployment configuration itself.

### Important Distinctions

- A plain environment variable set in deployment config ≠ hidden from
  anyone who can view that configuration — it's visible to anyone with
  read access to the deployment settings, which is fine for non-sensitive
  values but wrong for secrets.
- A secret referenced from Secret Manager ≠ visible in deployment
  configuration at all — only its *name* appears there; the actual value
  is resolved at runtime, governed entirely by IAM.

### Why Does It Exist?

Deployment configuration is often more broadly readable (by more team
members, in more tools) than the tightly IAM-gated Secret Manager —
routing sensitive values through Secret Manager specifically, rather
than as plain deployment config, keeps the actual values restricted to
only the identities that truly need them.

### Connections

- **Prerequisite (BLOCKING):** `next.env-vars`, `gcp.secret-manager`.
- **Related:** `gcparch.backend-db-connection` — a concrete instance of
  this pattern, the database password specifically routed through
  Secret Manager.

### Production Appearance

A deployment configuration file (or Cloud Run's own console) showing a
mix of plain `key: value` environment variables and separate `secret:
<secret-name>` references is the direct, visible signal of this pattern
in practice.

### Example

A Cloud Run service's config sets `NODE_ENV=production` as a plain
environment variable but references `STRIPE_SECRET_KEY` from Secret
Manager rather than setting it directly — the same distinction
`next.env-vars`'s `NEXT_PUBLIC_` prefix makes at the frontend build
layer, now applied at the deployed backend's runtime layer.

### Practice

A teammate is about to add a new required configuration value for a
service — a third-party API key — directly as a plain environment
variable in the deployment config. What would you flag, and what should
they do instead? *(Flag that an API key is a secret and shouldn't be
visible in plain deployment configuration; it should be stored in Secret
Manager and referenced by name instead, so its actual value stays
IAM-gated rather than readable by anyone with deployment-config
access.)*

---

## gcparch.service-to-service-communication — Service-to-service communication

**Target depth:** Reason

### What Is It?

How separately deployed services within the same system (a frontend, a
backend, perhaps additional internal services) communicate with each
other over the network — which involves the same HTTP request/response
mechanics already covered, but now with an added layer of network access
control and service-level authentication, since these calls cross real
network and trust boundaries.

### Mental Model

Think of each deployed service as a separate building; service-to-service
communication is how one building's staff actually reach another
building — over real roads (the network), sometimes needing to show ID
at the door (authentication) depending on how open or restricted that
particular building's access is meant to be.

**Two services calling each other isn't fundamentally different from a
browser calling an API — it's still HTTP — but now both the network path
and the calling service's identity need to be deliberately configured,
rather than assumed.**

### How It Works

A Cloud Run service calling another Cloud Run service makes a normal
HTTP request (`backend.http-basics`), but whether that request is even
allowed to reach its target, and whether the target trusts it, depends
on configuration — a public service accepts requests from anyone; a
private/internal-only service requires the calling service to
authenticate itself (commonly via an identity token tied to its own
service account, verified by IAM) before the request is processed at
all.

### Important Distinctions

- Service-to-service communication ≠ automatically trusted just because
  both services are in the same GCP project — by default, a service can
  be configured to require authentication from any caller, internal or
  not.
- This concept ≠ the same as `gcparch.backend-db-connection` — that's a
  backend connecting to a *database*; this is one *application service*
  calling another application service, a different kind of dependency
  with its own network/auth considerations.

### Why Does It Exist?

As a system grows beyond one frontend and one backend (perhaps an
internal service handling a specific piece of business logic, or a
background job triggered by another service), those pieces need a
secure, deliberate way to call each other — without explicit
configuration, either everything would need to be public (a security
risk) or nothing could communicate at all.

### Connections

- **Prerequisite (BLOCKING):** `backend.http-basics`,
  `gcp.iam-permissions`.
- **Related:** `backend.api-vs-webhook-vs-websocket-vs-polling` — the
  same communication-pattern choices apply between internal services,
  not just between a frontend and a public API.

### Production Appearance

A Cloud Run service configured with "require authentication" and a
calling service's deployment granting it the "Cloud Run Invoker" role on
the target service are the concrete GCP signals of secured
service-to-service communication.

### Common Misconceptions

**"Since both services are mine, in the same project, they can obviously
talk to each other."** Nothing about being in the same project grants
network or authentication access automatically — every service-to-service
call needs its access explicitly configured, the same as access to any
other resource.

### Practice

A background job service needs to call an internal API that should
never be reachable from the public internet — using what you know about
GCP's authentication options, roughly how would this be configured?
*(The internal API would be deployed to require authentication rather
than allowing public/unauthenticated access, and the background job's
own service account would be granted the IAM role permitting it
specifically to invoke that service — so only that job, not the public
internet, can reach it.)*

### Mastery Check (Reason)

A new internal service is deployed and left with default "allow
unauthenticated" access because it made local testing easier during
development. Explain the actual production risk this creates, and what
should change before it goes live.

---

## gcparch.overall-system-architecture — Understanding the overall system architecture

**Target depth:** Reason

### What Is It?

The complete picture of how every piece covered in this curriculum's
Frontend + Backend and Database + Cloud tracks — Next.js, FastAPI,
PostgreSQL, BigQuery, and GCP's compute/storage/IAM services — fits
together as one deployed, running system, rather than a set of
separately-learned pieces.

### Mental Model

Think of this as finally stepping back from each individual module's own
room and looking at the entire building's blueprint at once — where the
frontend and backend each run, how they reach their respective data
stores, how secrets and permissions flow through the whole thing, and how
a request actually moves through all of it end to end.

### How It Works — the assembled picture

- **Frontend**: a Next.js app (`next.*`), with its server half deployed
  to Cloud Run (`gcparch.frontend-backend-deployment-flow`,
  `gcp.cloud-run`).
- **Backend**: a FastAPI app (`fastapi.*`), also deployed to Cloud Run,
  connecting to its database via the pattern in
  `gcparch.backend-db-connection`.
- **Operational data**: PostgreSQL, running as a managed Cloud SQL
  instance (`gcp.cloud-sql`), holding the live, transactional
  application data.
- **Analytical data**: BigQuery (`bq.*`), fed by a pipeline
  (`integration.app-to-analytics-data-flow`) from Postgres, for
  reporting and analysis separate from the live application.
- **Cross-cutting**: IAM (`gcp.iam-permissions`) governs every
  service-to-service and service-to-data connection; Secret Manager
  (`gcp.secret-manager`) and environment variables
  (`gcparch.env-vars-secrets`) supply configuration and credentials;
  Cloud Logging/Monitoring (`gcp.logging-monitoring`) provide visibility
  into the whole running system.

### Important Distinctions

- This concept ≠ introducing any new mechanism — every piece named above
  was taught individually in an earlier module; this concept's entire
  job is the connected view, the same synthesis role
  `revA.frontend-api-backend-connection` played for Phase A, now
  extended across the full stack including data and cloud.
- A system architecture diagram ≠ static trivia to memorize — its real
  value is as a tool for reasoning about where a given bug, security
  concern, or scaling question actually lives within the system.

### Why Does It Exist?

The curriculum's own stated objective — "understand... how the complete
stack fits together so I can start working with the existing
codebase" — is exactly this concept; every module before this one taught
one piece in isolation specifically so this synthesis could be genuinely
understood rather than memorized as an abstract diagram.

### Connections

- **Prerequisite (BLOCKING):** effectively every concept in Modules
  1–11.
- **Enables:** `integration.how-the-stack-fits-together` (Module 13
  restates and extends this exact picture with an explicit focus on
  tracing and code reading), `revB.architecture-review-and-final-mastery-check`
  (Module 14's final capstone revisits this same architecture).

### Production Appearance

An actual architecture diagram (if one exists) in a real codebase's
documentation, or the mental map an experienced engineer draws on a
whiteboard when explaining "how this system works" to someone new, is
this concept made concrete.

### Mastery Check (Reason)

Without looking back at any other module, sketch (in words) the path a
single "create an order" request takes through every layer of this
system — frontend, backend, database — and then separately describe how
that same order's data eventually reaches BigQuery for analytics. If any
step feels uncertain, that's the specific concept to revisit.

### Deeper / Deferred

This concept intentionally introduces nothing new — any deeper detail
belongs to the specific module it came from.
