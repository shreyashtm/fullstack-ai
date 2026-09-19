# System Architecture — Expense Tracker

Fill in each section after deploying. One paragraph per hop, naming the
actual GCP service running it. This doubles as this project's own
concept-to-project coverage evidence for every `gcp.*` / `gcparch.*` /
`integration.*` concept in Milestone 8 — see its Verification section.

## User → Frontend

<!-- TODO: how a user's browser reaches the deployed Next.js app -->

## Frontend → Backend

<!-- TODO: gcparch.frontend-backend-deployment-flow, gcparch.service-to-service-communication —
     what actually authenticates this call, or does anything? -->

## Backend → Database

<!-- TODO: gcparch.backend-db-connection, gcp.cloud-sql -->

## Backend → Secrets

<!-- TODO: gcp.secret-manager, gcparch.env-vars-secrets -->

## App → Analytics

<!-- TODO: integration.app-to-analytics-data-flow — how the BigQuery export job runs and what triggers it -->

## IAM

<!-- TODO: gcp.iam-permissions — what the backend's service account can and can't reach -->

## Weakest points

<!-- TODO: name the two weakest points in this architecture and why (Reasoning Question 4) -->
