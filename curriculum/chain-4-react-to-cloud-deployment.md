# Cross-technology chain 4 — React → Next.js → Server/Client boundary → Cloud deployment

Concepts, in dependency order: `react.fundamentals` (Understand) →
`next.fundamentals` (Understand) → `next.server-client-components`
(Reason) → `gcparch.frontend-backend-deployment-flow` (Use) →
`gcp.cloud-run` (Use).

---

## react.fundamentals — Components & composition

**Target depth:** Understand

### What Is It?

React is a JavaScript library for building user interfaces out of
components — functions that return a description of what should appear
on screen (JSX), composed together into a tree.

### Mental Model

Think of a React app as nested boxes-within-boxes, where each box
(component) is responsible for describing its own contents and can
contain other boxes — the whole screen is one tree of these functions,
each one re-run (re-rendered) whenever its inputs might have changed.

**A component is a function that takes some inputs (props/state) and
returns what the UI should look like right now — React's job is figuring
out when to re-run that function and how to efficiently update the real
screen to match.**

### How It Works

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}
function App() {
  return <Greeting name="Ada" />;
}
```

`App` renders `Greeting`, passing it `name` as a prop (`react.props`);
JSX (the `<h1>...</h1>` syntax) compiles down to plain JavaScript function
calls that build a description of the UI, which React then uses to
update the actual browser DOM.

### Important Distinctions

- A component ≠ a template — it's a real JavaScript function, and
  everything JS can do (conditionals, loops, closures — see
  `js.scope-and-closures` in chain 1) applies inside it.
- JSX ≠ HTML — it looks similar but compiles to JavaScript, which is why
  it can embed `{expressions}` freely.

### Why Does It Exist?

Before component-based UI libraries, keeping a complex UI's actual DOM
state in sync with an application's data required manual, error-prone DOM
manipulation. React lets developers describe *what* the UI should look
like for a given state, and handles the *how* of updating the screen
efficiently.

### Connections

- **Prerequisite:** `js.functions`.
- **Enables:** `react.props`, all of the Hooks concepts, and directly —
  `next.fundamentals` (Next.js is a framework built around React
  components).
- **Cross-technology:** this is the entry point of this chain, continuing
  into Next.js and eventually cloud deployment.

### Production Appearance

Any `.jsx`/`.tsx` file defining a function that returns JSX is a
component — the basic unit you'll be reading constantly in a React or
Next.js codebase.

### Example

A `<Button>` component reused across a whole app, taking `label` and
`onClick` as props rather than each button being hand-written separately.

### Practice

Is `function UserCard(props) { return <div>{props.name}</div>; }` a valid
React component? What would you need to add to make it usable elsewhere
in an app? *(Yes, valid; to reuse it, import it and render `<UserCard
name="Ada" />` wherever needed.)*

---

## next.fundamentals — NextJS fundamentals & project structure

**Target depth:** Understand

### What Is It?

Next.js is a React framework that adds an opinionated project structure,
file-based routing, and a choice of where components render (server or
client) on top of plain React.

### Mental Model

If React is the raw material (components), Next.js is the building's
blueprint and construction crew — it decides how files map to URLs, when
and where each component actually runs, and how the whole thing gets
bundled and served.

**Next.js takes React components and adds the missing pieces a real app
needs — routing, rendering strategy, and a deployable build — that plain
React doesn't decide for you.**

### How It Works

A file at `app/orders/page.tsx` automatically becomes the page served at
the `/orders` URL (App Router, `next.app-router`) — no separate routing
configuration file to maintain by hand; Next.js's build process bundles,
optimizes, and prepares the app to run in a Node.js (or edge) server
environment.

### Important Distinctions

Next.js ≠ a replacement for React — every Next.js component is still a
React component; Next.js decides *when and where* it runs and *how it's
routed*, not what component syntax looks like.

### Why Does It Exist?

Plain React alone leaves routing, data fetching strategy, and
server/client rendering entirely up to the developer to wire together
from scratch; Next.js provides sensible, production-tested defaults for
all three.

### Connections

- **Prerequisite (BLOCKING):** `react.fundamentals`.
- **Enables:** `next.app-router`, `next.server-client-components`,
  `next.data-fetching`. Continues this chain toward
  `gcparch.frontend-backend-deployment-flow`.

### Production Appearance

An `app/` (or `pages/`) directory whose folder structure directly mirrors
the site's URL structure is the first thing to recognize in a Next.js
codebase.

### Practice

A Next.js project has a file at `app/settings/profile/page.tsx` — what
URL serves it? *(`/settings/profile`.)*

---

## next.server-client-components — Server vs Client Components

**Target depth:** Reason

### What Is It?

In the Next.js App Router, every component is a **Server Component** by
default — rendered on the server, never shipped to the browser as
JavaScript — unless explicitly marked `"use client"`, which makes it a
**Client Component** that renders (and re-renders) in the browser and can
use state, effects, and event handlers.

### Mental Model

Think of Server Components as printed, pre-rendered pages handed to the
visitor — they can read from a database directly but can't react to a
click after being handed over. Client Components are the interactive
parts glued onto that page — smaller, shipped as real JavaScript, able to
hold state and respond to the user.

**A Server Component runs once, on the server, and produces static HTML
for this request; a Client Component ships as JavaScript and keeps
running in the browser — the boundary between them is a real
architectural line, not a style choice.**

### How It Works

```jsx
// app/orders/page.tsx (Server Component by default)
async function OrdersPage() {
  const orders = await db.orders.findMany(); // direct DB access, server-only
  return <OrderList orders={orders} />;
}
```

```jsx
// components/OrderList.tsx
"use client";
export function OrderList({ orders }) {
  const [filter, setFilter] = useState("all"); // useState needs a Client Component
  // ...
}
```

`OrdersPage` runs only on the server (can query a database directly,
never ships its code to the browser); `OrderList` is marked `"use
client"` because it needs `useState` — Hooks that involve browser-side
interactivity (`react.use-state`, `react.use-effect`, event handlers)
only work in Client Components.

### Important Distinctions

- Server Component ≠ "slower" or "worse" — it ships zero JavaScript for
  that piece of UI, which is often faster to load.
- Server Component ≠ able to use `useState`/`useEffect`/`onClick` at
  all — those require the browser runtime a Client Component provides.
- `"use client"` marks the *boundary*, not every component below it
  individually — everything a Client Component renders is also part of
  the client bundle from that point down.

### Why Does It Exist?

Shipping every component's full JavaScript to the browser, even ones
that never need interactivity (a static product description, a
server-rendered list), wastes bandwidth and slows the page. Splitting the
tree into server-only and client-necessary pieces lets only the
interactive parts pay that cost.

### Connections

- **Prerequisite (BLOCKING):** `react.fundamentals`, `next.fundamentals`.
- **Enables:** `next.data-fetching` — Server Components can fetch data
  directly without a client-side `useEffect` round-trip.
- Continues this chain into `gcparch.frontend-backend-deployment-flow` —
  where a component runs (server vs. browser) directly shapes what
  "deploying the frontend" even means for a Next.js app, since the
  server half runs as part of the deployed application, not as a
  separate static bundle.

### Production Appearance

Seeing `"use client"` as the very first line of a file is the fastest way
to identify which parts of a Next.js codebase are interactive versus
server-rendered.

### Trace

A request for `/orders`:

| Step | Where | What happens |
|---|---|---|
| 1 | Server | `OrdersPage` (Server Component) runs, queries the DB directly |
| 2 | Server | Produces HTML + a description of the `OrderList` Client Component and its props |
| 3 | Network | HTML sent to browser immediately (fast first paint); `OrderList`'s JS bundle also sent |
| 4 | Browser | `OrderList` "hydrates" — becomes interactive, `useState` starts working |

### Common Misconceptions

**"Everything in a Next.js app runs on the server, so I never need to
think about the client/server boundary."** The default is server, but the
moment any interactivity (state, effects, event handlers,
closures-dependent hooks — chain 1) is needed, that subtree must cross
into `"use client"`, and forgetting the directive produces a build error,
not silent behavior.

### Code Reading

A component uses `onClick` but has no `"use client"` directive at the top
of its file — what will happen, and why does that error message exist
rather than the framework just guessing? *(A build-time error — event
handlers can't run without the client runtime; Next.js can't safely guess
where the interactivity boundary should be, so it requires it explicit.)*

### Mastery Check (Reason)

Given `next.data-fetching`'s existence for Server Components, explain why
a component that needs to both query the database directly AND hold
`useState` for a filter dropdown typically gets split into two
components — a server parent that fetches, and a client child that holds
the filter state — rather than being written as one component.

### Deeper / Deferred

React Server Components' streaming/suspense boundaries and exactly how
"hydration" reconciles server-rendered HTML with the client bundle —
named, not required at this depth.

---

## gcparch.frontend-backend-deployment-flow — Frontend/backend deployment flow

**Target depth:** Use

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

- **Prerequisite (BLOCKING):** `next.server-client-components` — explains
  why the frontend needs a real running service now. Also `gcp.cloud-run`.
- **Enables:** `gcparch.overall-system-architecture`.
- This is this chain's final link.

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

## gcp.cloud-run — Cloud Run

**Target depth:** Use

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
- **Enables:** `gcparch.frontend-backend-deployment-flow`, completing
  this chain.

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
