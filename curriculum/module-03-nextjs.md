# Module 3 — NextJS (`next.*`)

Full concept content for all 6 concepts in `02-curriculum-model.md`'s
NextJS module, in curriculum order. Two were already authored in
`chain-4-react-to-cloud-deployment.md` and are reproduced verbatim here
(if either is edited later, edit both copies together).

---

## next.fundamentals — NextJS fundamentals & project structure

**Target depth:** Understand

*(Reproduced from `chain-4-react-to-cloud-deployment.md` — content unchanged.)*

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
  `next.data-fetching`. Continues the cross-technology chain toward
  `gcparch.frontend-backend-deployment-flow`.

### Production Appearance

An `app/` (or `pages/`) directory whose folder structure directly mirrors
the site's URL structure is the first thing to recognize in a Next.js
codebase.

### Practice

A Next.js project has a file at `app/settings/profile/page.tsx` — what
URL serves it? *(`/settings/profile`.)*

---

## next.app-router — App Router & routing

**Target depth:** Use

### What Is It?

The App Router is Next.js's file-system-based routing convention (using
an `app/` directory) where the folder structure directly maps to URL
paths, and special file names (`page.tsx`, `layout.tsx`, `loading.tsx`,
`error.tsx`) define what renders at each route.

### Mental Model

Think of the `app/` folder as a literal map of the site's URLs — each
folder is a URL segment, and a `page.tsx` file inside a folder is what
actually renders when a visitor lands on that URL; there's no separate
routing configuration file to keep in sync with the folder structure.

**In the App Router, the folder structure *is* the route table — creating
`app/orders/page.tsx` is the entire act of adding the `/orders` route.**

### How It Works

```
app/
  page.tsx            -> "/"
  orders/
    page.tsx          -> "/orders"
    [orderId]/
      page.tsx        -> "/orders/123" (dynamic segment)
  layout.tsx          -> shared UI wrapping every route below it
```

A folder named `[orderId]` (square brackets) creates a dynamic route
segment, whose actual value is available to the page as a parameter;
`layout.tsx` files wrap all routes nested inside their folder, letting
shared UI (navigation, headers) persist across route changes without
re-rendering.

### Important Distinctions

- A `page.tsx` file ≠ optional for a route to exist — a folder with no
  `page.tsx` doesn't correspond to a visitable URL on its own (it might
  still hold shared code or nested routes).
- `layout.tsx` ≠ re-rendered on every navigation within it — layouts
  persist across route changes inside them, which is why they're the
  right place for state that should survive navigating between sibling
  pages (like an open sidebar).

### Why Does It Exist?

Manually configuring a routing table (mapping URL patterns to components
by hand, as many earlier frameworks required) is repetitive and easy to
let drift out of sync with the actual file structure; file-system routing
makes the two identical by construction.

### Connections

- **Prerequisite (BLOCKING):** `next.fundamentals`.
- **Enables:** `next.data-fetching`, `next.loading-error-states` — both
  rely on this same file-convention system (`loading.tsx`/`error.tsx` are
  special files in exactly this scheme).

### Production Appearance

Navigating a Next.js codebase's `app/` folder and reading its structure
directly tells you the site's URL structure — the fastest way to find
"where does this page's code live" in an unfamiliar Next.js repo.

### Example

`app/settings/profile/page.tsx` serves `/settings/profile`; adding
`app/settings/billing/page.tsx` adds `/settings/billing` with zero
additional routing configuration.

### Practice

Where would you create a file to add a new page at `/products/42` where
`42` is a dynamic product id? *(`app/products/[productId]/page.tsx`)*

---

## next.server-client-components — Server vs Client Components

**Target depth:** Reason

*(Reproduced from `chain-4-react-to-cloud-deployment.md` — content unchanged.)*

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
interactivity only work in Client Components.

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
that never need interactivity, wastes bandwidth and slows the page.
Splitting the tree into server-only and client-necessary pieces lets only
the interactive parts pay that cost.

### Connections

- **Prerequisite (BLOCKING):** `react.fundamentals`, `next.fundamentals`.
- **Enables:** `next.data-fetching` — Server Components can fetch data
  directly without a client-side `useEffect` round-trip.
- Continues the cross-technology chain into
  `gcparch.frontend-backend-deployment-flow`.

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
moment any interactivity is needed, that subtree must cross into `"use
client"`, and forgetting the directive produces a build error, not
silent behavior.

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

## next.data-fetching — Data fetching & API integration

**Target depth:** Use

### What Is It?

Data fetching in Next.js's App Router is retrieving data (from a
database, an API, or a file) directly inside a Server Component —
typically with a plain `async`/`await` function — rather than fetching
from the client after the page has already loaded.

### Mental Model

Think of it as the page arriving at the browser already fully cooked,
ingredients and all, instead of arriving empty and then sending out for
each ingredient one at a time (the `react.api-calls` client-side pattern
from Module 2).

**In the App Router, a Server Component can just `await` its data
directly in the component function — no loading state, no useEffect,
because the data is already there before any HTML is sent to the
browser.**

### How It Works

```jsx
// app/orders/page.tsx (Server Component)
async function OrdersPage() {
  const orders = await db.orders.findMany();
  return <OrderList orders={orders} />;
}
```

Because `next.server-client-components` makes every component a Server
Component by default, this `async` function runs on the server, queries
the database, and only sends the finished HTML (plus the data needed by
any nested Client Components) to the browser.

### Important Distinctions

- This ≠ the same as `react.api-calls`'s `useEffect`-based fetching —
  that pattern exists specifically because a Client Component *can't*
  directly `await` a database call the way a Server Component can; the
  two patterns solve the same underlying need in two different execution
  contexts.
- Fetching directly in a Server Component ≠ available in a Client
  Component — `async function Component()` is only valid for Server
  Components; a `"use client"` component must use `react.api-calls`'s
  `useEffect` pattern instead.

### Why Does It Exist?

The `useEffect`-based client fetching pattern means the browser must
first download the JS bundle, run it, then start a second round-trip to
fetch data — visibly slower and requiring a loading state. Fetching
directly on the server, before any HTML is sent, avoids that whole extra
round-trip for the initial page load.

### Connections

- **Prerequisite (BLOCKING):** `next.server-client-components`.
- **Related:** `react.api-calls` — the client-side alternative, still
  needed for data fetched in response to user interaction after the page
  has loaded.
- **Enables:** `next.loading-error-states`.

### Production Appearance

Any Next.js page whose content clearly depends on a database or external
API, with no visible loading spinner on first load, is very likely using
this pattern.

### Example

An e-commerce product page fetching product details directly in its
Server Component means the product's name and price are already in the
HTML the browser first receives — nothing to "wait for" after the page
appears.

### Practice

A Server Component does `const data = await fetch("https://api.example.com/data")`
directly inside its function body — does the browser ever see a loading
state for this fetch on the initial page load? *(No — because it runs on
the server before any HTML is sent, the browser receives the page
already containing the fetched data; there's no client-visible "loading"
moment for this specific fetch.)*

---

## next.loading-error-states — Loading/error states

**Target depth:** Use

### What Is It?

Next.js's App Router provides special files — `loading.tsx` and
`error.tsx` — that automatically wrap a route segment, showing a loading
UI while that segment's data is being fetched on the server, and an
error UI if something throws during rendering.

### Mental Model

Think of `loading.tsx` as an automatic placeholder Next.js shows the
instant a route is requested, swapped out for the real page the moment
the server-side data fetching for that route finishes — no manual
`isLoading` state required, because the framework itself knows when a
route's data fetching is in flight.

**loading.tsx and error.tsx are structural, file-based equivalents of the
isLoading/error state you'd otherwise track by hand — the framework
triggers them automatically based on what's actually happening during a
route's render.**

### How It Works

```
app/orders/
  page.tsx     -> the real content (fetches data, may throw)
  loading.tsx  -> shown automatically while page.tsx's data fetching is in flight
  error.tsx    -> shown automatically if page.tsx throws during rendering
```

```jsx
// app/orders/loading.tsx
export default function Loading() {
  return <Spinner />;
}
```

Next.js automatically renders `loading.tsx` the moment navigation to
`/orders` starts, and swaps to the real `page.tsx` output once its data
fetching resolves — using React's Suspense mechanism under the hood.

### Important Distinctions

- This file-based loading/error handling ≠ the same mechanism as
  `react.conditional-rendering`'s manual `isLoading ? <Spinner /> :
  <Content />` pattern — that's a component deciding its own output based
  on state it tracks itself; `loading.tsx`/`error.tsx` are automatic,
  structural, and scoped to an entire route segment by the framework,
  requiring no state management at all.
- `error.tsx` ≠ catches every possible error — it specifically catches
  errors thrown during that route segment's own rendering, not errors in
  a totally separate part of the page (like a sibling layout).

### Why Does It Exist?

Without this convention, every page would need to hand-write its own
loading/error state management (exactly the `isLoading`/`error` state
pattern from `react.api-calls`) even though the underlying need is nearly
universal; the file convention handles the common case with zero
boilerplate.

### Connections

- **Prerequisite (BLOCKING):** `next.app-router`, `next.data-fetching`.
- **Related:** `react.conditional-rendering` — the manual, component-level
  version of the same underlying need.

### Production Appearance

Seeing `loading.tsx` or `error.tsx` sitting next to a `page.tsx` in the
same route folder is the signal that this route relies on the
framework's automatic loading/error handling rather than manual state.

### Practice

If `app/orders/page.tsx` throws an error while fetching its data, and
there's no `error.tsx` in that folder, what happens? *(Next.js falls back
to the nearest `error.tsx` further up the route tree — if there's a
top-level one, that's shown instead; if none exists anywhere in the tree,
the app shows a generic, less helpful default error state.)*

---

## next.env-vars — Environment variables

**Target depth:** Understand

### What Is It?

Environment variables in Next.js are configuration values (API keys,
database URLs, feature flags) kept outside the codebase, typically in a
`.env.local` file, with a naming convention (`NEXT_PUBLIC_` prefix) that
controls whether a variable is available in server code only or also
exposed to the browser.

### Mental Model

Think of environment variables as a settings sheet the app reads at
startup, kept separate from the code itself specifically so the same
code can run with different settings (a different database, a different
API key) in development versus production, without editing any source
files. The `NEXT_PUBLIC_` prefix is a deliberate, visible fence between
"server-only secret" and "safe to ship to every visitor's browser."

**An env var without NEXT_PUBLIC_ stays server-only and safe for real
secrets; one with the prefix gets bundled into the browser JavaScript for
anyone to read — treat that prefix as a public-vs-private switch, not a
formatting detail.**

### How It Works

```
# .env.local
DATABASE_URL=postgres://...
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

```js
// server-side code (Server Component, API route)
const dbUrl = process.env.DATABASE_URL; // works

// client-side code ("use client")
const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL; // works — bundled in at build time
const dbUrl2 = process.env.DATABASE_URL; // undefined in the browser — not exposed
```

### Important Distinctions

- `DATABASE_URL` (no prefix) ≠ accessible in browser-side code at all — it
  simply reads as `undefined` there, by design.
- `NEXT_PUBLIC_...` ≠ private in any sense once used — anything with that
  prefix is baked directly into the JavaScript bundle shipped to every
  visitor and can be read by anyone inspecting the site; never put a real
  secret behind that prefix.

### Why Does It Exist?

An application's secrets (database credentials, private API keys) must
never reach the browser, while some configuration (a public API's base
URL, a public feature flag) legitimately needs to be readable by
client-side code — the prefix convention makes that distinction explicit
and enforced by the build process.

### Connections

- **Prerequisite:** `next.fundamentals`.
- **Related:** `gcparch.env-vars-secrets` — the same distinction, extended
  to how secrets are actually managed and injected in a deployed GCP
  environment, and `gcp.secret-manager`.

### Production Appearance

A `.env.local` file (usually git-ignored) at a Next.js project's root,
and `process.env.SOMETHING` calls scattered through both server and
client code, are the concrete signals of this pattern in a real repo.

### Example

`NEXT_PUBLIC_ANALYTICS_ID` (safe to expose — used by client-side
analytics scripts) versus `STRIPE_SECRET_KEY` (must never have the
`NEXT_PUBLIC_` prefix, used only in server-side payment logic).

### Practice

A teammate accidentally names a real API secret
`NEXT_PUBLIC_STRIPE_SECRET_KEY` — what's the actual consequence, using
what you know about the prefix? *(The secret gets bundled into the
public JavaScript sent to every visitor's browser, making it readable by
anyone who opens the site's dev tools — a real security exposure, not
just a naming inconsistency.)*
