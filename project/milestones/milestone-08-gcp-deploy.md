# Milestone 8 — GCP Deployment

Guidance level: **Unfamiliar Codebase** (least scaffolding of any milestone — you're expected to trace and extend, not follow a boundary).

> **Prerequisite:** a real GCP project with billing enabled. This is the
> capstone milestone — everything built in Milestones 1-7 gets deployed
> for real.

> **Security constraint, stated plainly, not compressed:** database
> passwords, API tokens, and any other secret must never be committed to
> the repository, in any form, at any point — not in a `.env` file, not in
> a config example with a "real" value swapped in "temporarily." Use
> Secret Manager for every credential from the start.

## Objective

Deploy the whole stack: FastAPI backend to Cloud Run, Postgres to Cloud
SQL, secrets via Secret Manager, the Next.js frontend calling the real
backend URL, IAM scoped to least privilege, and finally a written
architecture summary tying every piece together.

## Concepts Practiced

From `curriculum/module-11-gcp-fundamentals.md`:
`gcp.projects-regions` (Recognize), `gcp.iam-permissions` (Understand),
`gcp.compute-storage-concepts` (Recognize), `gcp.cloud-run` (Use),
`gcp.cloud-storage` (Understand), `gcp.cloud-sql` (Use),
`gcp.secret-manager` (Understand), `gcp.logging-monitoring` (Recognize).

From `curriculum/module-12-gcp-architecture.md`:
`gcparch.app-deployment` (Use), `gcparch.backend-db-connection` (Use),
`gcparch.frontend-backend-deployment-flow` (Use),
`gcparch.env-vars-secrets` (Use),
`gcparch.service-to-service-communication` (Reason),
`gcparch.overall-system-architecture` (Reason).

From `curriculum/module-13-stack-integration.md`:
`integration.how-the-stack-fits-together` (Reason),
`integration.representative-project-structure` (Use).

## Previously Learned

Everything from Milestones 1-7 — this milestone deploys all of it. You
should be able to say, for every box in the final architecture, which
earlier milestone built it.

## New Concepts

None — this is the synthesis capstone. Nothing new is introduced; every
concept above is Recognize-through-Reason depth already set by the
curriculum, and none of them require new theory you haven't seen.

## Requirements

1. Containerize the FastAPI backend and deploy it to Cloud Run —
   `gcp.cloud-run`, `gcparch.app-deployment`.
2. Move Postgres to Cloud SQL and connect the backend to it via the
   Cloud SQL connector — `gcp.cloud-sql`, `gcparch.backend-db-connection`.
3. Every credential (DB password, any API token) lives in Secret Manager,
   injected into Cloud Run at deploy time — never a plaintext env file —
   `gcp.secret-manager`, `gcparch.env-vars-secrets`.
4. Deploy the Next.js frontend, configured to call the backend's real
   Cloud Run URL — `gcparch.frontend-backend-deployment-flow`.
5. Check IAM: the backend's service account can reach its own Cloud SQL
   instance and its own secrets, and nothing beyond that —
   `gcp.iam-permissions`.
6. Check Cloud Run's built-in request logs for at least one real request
   — `gcp.logging-monitoring`.
7. Write `ARCHITECTURE.md`: one section per hop (user → Next.js → FastAPI
   → Cloud SQL, and separately → the BigQuery export job), naming the GCP
   service running each piece — `gcparch.overall-system-architecture`,
   `integration.how-the-stack-fits-together`. This is a required
   deliverable, not an optional writeup.

## Constraints

- Secrets never touch the repository, at any point (see above).
- The backend's Cloud Run service account must not be the default,
  broad-permission service account — create one scoped to only what this
  app needs.

## Architecture

Not prescribed beyond the requirements above — this milestone is
deliberately closer to "unfamiliar codebase" than any prior one: you're
tracing your own system as a whole and deciding how to wire its pieces
together at the infra level, not filling in a given file tree.

`project/app/milestone-08-gcp-deploy/` ships with a `Dockerfile` and a
`main.py` entry snippet that has one seeded bug — see below — plus an
`ARCHITECTURE.md` template with section headings only, for you to fill in
after deploying.

## Implementation Task

Deploy everything. Before your first `gcloud run deploy`, read the
Debugging Challenge below — the seeded bug will otherwise cost you a real
failed deployment to discover.

## Reasoning Questions

1. Why must a container read the port to listen on from the `PORT`
   environment variable Cloud Run injects, rather than hardcoding a port
   number? What specifically does Cloud Run do if the container doesn't
   comply?
2. Why does the FastAPI service need its own scoped service account
   instead of reusing a broad project-level one? What's the actual damage
   a compromised broad account could do here that a scoped one couldn't?
3. `gcparch.service-to-service-communication`: what, right now, actually
   authenticates a call from the deployed Next.js app to the deployed
   FastAPI backend — or, if the answer is "nothing does, it's a public
   endpoint," say that plainly. What's the real current gap, and what
   would closing it require?
4. Write `overall-system-architecture` as one sentence per hop, user to
   database to analytics pipeline. Where are the two weakest points in
   this architecture, and why?

## Debugging Challenge

The provided `Dockerfile`/`main.py` snippet hardcodes the backend to
listen on port `8000` instead of reading it from the `PORT` environment
variable Cloud Run sets at runtime. Deployed as-is, the Cloud Run revision
will fail its startup health check.

Don't just change the hardcoded port and move on. First explain: why does
Cloud Run's contract require reading `PORT` dynamically — what does Cloud
Run actually do differently from a normal server host here? Then fix it,
redeploy, and confirm in Cloud Run's own logs that the revision now starts
successfully.

## Verification

- **Implementation:** the full stack is live — frontend, backend, and
  database all reachable through real GCP services, not local processes.
- **Reasoning:** answer all four questions above.
- **Debugging:** fixed the `PORT` bug, redeployed, confirmed a healthy
  revision in Cloud Run's logs.
- **Explained:** `ARCHITECTURE.md` is filled in completely — this is also
  this project's own answer to the curriculum's end-of-project
  concept-to-project coverage report for every `gcp.*`/`gcparch.*`/
  `integration.*` concept above.
- **Transfer:** given a different toy service, correctly identify what it
  would need to deploy safely to Cloud Run (port handling, secrets, IAM)
  without being walked through it.
