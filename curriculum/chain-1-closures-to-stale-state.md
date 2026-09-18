# Cross-technology chain 1 — Closures → React callbacks → useEffect → stale state

Concepts, in dependency order: `js.scope-and-closures` (Reason) →
`react.use-callback` (Reason) → `react.use-effect` (Reason). The chain's
endpoint — "stale state" — is a Deeper/Deferred bug pattern named from
`react.use-effect`, not a concept of its own; it only makes sense once all
three concepts above it are in place, which is exactly the point of
building this chain as connected content instead of three isolated pages.

---

## js.scope-and-closures — Scope & Closures

**Target depth:** Reason

### What Is It?

A closure is a function bundled together with references to the variables
from the lexical scope it was defined in — it keeps access to those
variables even after the outer function has returned. Scope is the set of
variables a piece of code can see at a given point, determined by where
the code is *written* (lexical scope), not where it's called from.

### Mental Model

Think of a function as a backpack. Whatever variables were in reach when
the function was *defined* get zipped into the backpack, and the function
carries that backpack wherever it's called later — even to a place where
those variables no longer exist on their own.

**A closure is a function plus the backpack of variables it was defined
next to — it reads from that backpack, not from wherever it happens to be
called.**

### How It Works

```js
function makeCounter() {
  let count = 0;
  return function increment() {
    count = count + 1;
    return count;
  };
}
const counter = makeCounter();
counter(); // 1
counter(); // 2
```

`makeCounter` runs once; `count = 0` is created in its scope, then it
returns the inner `increment` function. Normally `count` would be
discarded when `makeCounter` finishes — but `increment` still references
it, so JavaScript keeps it alive. Each call to `counter()` reads and
updates the *same* `count`, because it's the same backpack every time
(`counter` is one closure instance, not a fresh one per call).

### Important Distinctions

- Closure ≠ copy of a value — the function holds a *live reference* to the
  variable's binding, not a snapshot of its value at creation time.
- Scope (where a name is visible) ≠ closure (the mechanism that keeps that
  visibility alive after the outer function returns).
- Each function *call* that creates a new inner function creates a *new*
  closure/backpack — calling `makeCounter()` twice gives two independent
  counters (see Trace).

### Why Does It Exist?

Without closures, a function that returns another function would lose
access to its own local state the moment it returns — there'd be no way to
build private state, factory functions, or callbacks that "remember"
something about when they were created.

### Connections

- **Prerequisite:** `js.functions`.
- **Enables:** `react.use-callback`, `react.use-effect` (their entire
  dependency-array behavior is a closures problem), `js.async-await`
  (callbacks passed to async code capture scope the same way).
- **Deeper/Deferred:** how the JS engine keeps closed-over variables alive
  (heap allocation instead of stack, garbage collection once nothing
  references the closure anymore).

### Production Appearance

Appears anywhere a function is defined inside another and returned or
passed onward — event handlers, `setTimeout` callbacks, and (critically
for this chain) every React Hook that takes a function argument.

### Example

A `debounce(fn, delay)` utility is a closure factory — it returns a new
function that closes over a `timer` variable, so repeated calls can
cancel the previous pending call.

### Trace

```js
function makeCounter() {
  let count = 0;
  return function() { count++; return count; };
}
const a = makeCounter();
const b = makeCounter();
a(); // count(a) = 1
a(); // count(a) = 2
b(); // count(b) = 1
```

| Call | Which backpack | count after |
|---|---|---|
| `a()` | a's | 1 |
| `a()` | a's | 2 |
| `b()` | b's (separate) | 1 |

### Common Misconceptions

- **"Closures share one global variable."** They don't — each outer-function
  call creates an independent closure with its own backpack (see the
  trace above: `a` and `b` never interfere).
- **"A closure captures the value at creation time."** It captures the
  *binding*, so if the outer variable changes later (e.g. a loop
  variable), the closure sees the *current* value, not a frozen snapshot —
  this exact issue is why `var` in a loop notoriously breaks and `let`
  fixes it (each loop iteration gets its own `let` binding).

### Practice

Predict the output:

```js
function makeAdder(x) {
  return function(y) { return x + y; };
}
const add5 = makeAdder(5);
const add10 = makeAdder(10);
console.log(add5(2), add10(2));
```

*(Answer: `7 12` — two independent closures, each with its own `x`.)*

### Code Reading

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

What does this print, and why does replacing `var` with `let` change the
answer? *(Prints `3 3 3` with `var` — one shared binding, all three
callbacks read the final value; prints `0 1 2` with `let` — a fresh
binding per iteration.)*

### Mastery Check (Reason)

A teammate's code has a button's `onClick` handler that always logs the
*first* value a piece of state had, never the latest — reasoning from what
you know about closures, what's the likely cause, without seeing the
actual code yet?

### Deeper / Deferred

Heap allocation and garbage collection of closed-over variables (named
above, not needed at this depth).

---

## react.use-callback — useCallback

**Target depth:** Reason

### What Is It?

`useCallback` is a Hook that returns a memoized version of a function —
the same function reference across re-renders, as long as its listed
dependencies haven't changed.

### Mental Model

Normally, a component function re-running on every render creates a
brand-new copy of every function defined inside it (new backpack, same
code). `useCallback` says "don't make a new backpack unless these specific
ingredients changed — otherwise hand back the exact same one you gave me
last time."

**useCallback doesn't change what a function does — it changes whether
re-rendering creates a new function reference or reuses the old one.**

### How It Works

```jsx
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

On every render, React compares the new dependency array (`[id]`) to the
previous one. If every entry is `===` equal, React discards the newly
created function and returns the previous render's function reference
instead; if any entry changed, it keeps the new one.

### Important Distinctions

- `useCallback` ≠ making the function itself faster — the function's own
  execution is identical either way; only its *identity* (reference) is
  being controlled.
- `useCallback` ≠ `useMemo` — `useCallback(fn, deps)` is exactly
  `useMemo(() => fn, deps)`; one memoizes a function, the other memoizes
  any computed value.

### Why Does It Exist?

A function defined inside a component is a *new closure* every render
(`js.scope-and-closures`) — a new reference, even if it does the exact
same thing. That matters when the function is passed as a prop to a child
wrapped in `React.memo`, or listed in another Hook's dependency array: a
"new" reference each render defeats memoization and can re-trigger effects
that should only run when something meaningfully changed.

### Connections

- **Prerequisite (BLOCKING):** `js.scope-and-closures` — you cannot reason
  about when the reference changes without understanding that each render
  is a new closure. Also relates to `react.rerender-optimization`.
- **Related:** `react.use-memo`.
- **Deeper/Deferred:** the stale-closure bug this chain is building
  toward — covered fully under `react.use-effect` below.

### Production Appearance

Wrapping an event handler or a callback passed down to a memoized child
component, so that child doesn't re-render just because the parent
re-rendered and created a "new" (but functionally identical) function.

### Example

A `<SearchInput onSearch={handleSearch} />` where `SearchInput` is wrapped
in `React.memo` — without `useCallback` on `handleSearch`, `SearchInput`
re-renders every time its parent does, regardless of `React.memo`, because
`onSearch` is a new function reference each time.

### Common Misconceptions

- **"useCallback makes my function faster."** It doesn't touch execution
  speed, only reference identity.
- **"I should wrap every function in useCallback."** If nothing downstream
  depends on reference stability (no memoized child, no dependency array),
  it's pure overhead for no benefit.

### Practice

Given `useCallback(() => setCount(count + 1), [])` with an empty
dependency array, and a component that re-renders because a *different*
piece of state changed — does the returned function's reference change?
*(No — empty deps means the same function reference forever, but watch
the next concept for why that specific pattern is a trap.)*

### Mastery Check (Reason)

The function above, `() => setCount(count + 1)` with deps `[]`, is a
classic stale-closure bug waiting to happen. Using what you know about
closures capturing the variables in scope at creation time — what's wrong
with it, and how would you fix the dependency array?

### Deeper / Deferred

React's internal memoization/comparison mechanism (`Object.is` under the
hood) — named, not required at this depth.

---

## react.use-effect — useEffect

**Target depth:** Reason

### What Is It?

`useEffect` is a Hook that runs a function ("the effect") after React has
committed a render to the screen, and optionally re-runs it when specific
dependency values change.

### Mental Model

Think of `useEffect` as leaving a sticky note that says "after you finish
painting the screen, also do this" — and the dependency array is the
instruction for when to leave a *new* sticky note versus reuse the last
one.

**useEffect syncs a component with something outside React (the network,
the DOM, a subscription) — it runs after render, and only re-runs when its
dependencies actually changed.**

### How It Works

```jsx
useEffect(() => {
  const id = setInterval(() => setCount(c => c + 1), 1000);
  return () => clearInterval(id);
}, []);
```

React renders the component, commits it to the DOM, then runs the effect
function. The returned function is the *cleanup* — React runs it before
the next effect run, and on unmount. With an empty `[]` dependency array,
the effect runs once after the first render and cleans up once on
unmount.

### Important Distinctions

- The dependency array is not "what this effect uses" as documentation —
  it's a literal comparison React uses to decide whether to re-run;
  omitting a value the effect actually reads is a real bug, not a style
  choice.
- Effect cleanup ≠ optional — any effect that subscribes, opens a
  connection, or sets a timer needs a cleanup function or it leaks.

### Why Does It Exist?

Rendering in React is meant to be a pure calculation of "what should the
UI look like" — talking to the network, the DOM directly, or timers are
*side effects* that don't belong in that calculation. `useEffect` gives
side effects an explicit, ordered place to run, separate from render.

### Connections

- **Prerequisite (BLOCKING):** `js.scope-and-closures`, `react.use-callback`.
- **Related:** `next.data-fetching` (client-side data fetching commonly
  happens in an effect before the App Router's server-side fetching is
  available).
- This is where the chain's headline bug lives — named below rather than
  treated as a separate concept.

### Production Appearance

Fetching data when a component mounts or an id prop changes; subscribing
to a WebSocket or browser event; syncing a document title to state.

### Example

```jsx
useEffect(() => {
  document.title = `${unreadCount} unread`;
}, [unreadCount]);
```

Re-runs only when `unreadCount` changes, not on every render.

### Trace

Component with `const [id, setId] = useState(1)` and
`useEffect(() => { fetchUser(id); }, [id])`:

| Render | id | Effect re-runs? | Why |
|---|---|---|---|
| 1 (mount) | 1 | yes | first run always fires |
| 2 (id set to 1 again, same value) | 1 | no | dependency unchanged |
| 3 (id set to 2) | 2 | yes | dependency changed |

### Common Misconceptions

- **"useEffect runs during render."** It doesn't — it runs *after* the
  browser paints, which is why it's safe for side effects but wrong for
  anything the user must see synchronously with the render.
- **"An empty dependency array means the effect never sees updated
  state."** This is actually correct, and is precisely the **stale
  closure** bug: the effect function is a closure created on the *first*
  render, so with `[]` it never gets a fresh copy of state or props from
  later renders — reading `count` inside it always returns the `count`
  from mount, even though the component has re-rendered many times since.

### Practice

```jsx
useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000);
  return () => clearInterval(id);
}, []);
```

This "counter" famously gets stuck incrementing from 0 to 1 forever
instead of counting up. Using `js.scope-and-closures`, explain why, and
what the fix is. *(Either add `count` to the deps — causing the interval
to reset each tick — or use the updater form `setCount(c => c + 1)`,
which doesn't need to read `count` from the closure at all.)*

### Code Reading

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const tick = useCallback(() => setSeconds(s => s + 1), []);
  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);
  return <div>{seconds}</div>;
}
```

Walk through why this version, unlike the Practice example, correctly
counts up forever — what role does the updater-function form (`s => s +
1`) play in avoiding the closure trap entirely, and why can `tick`'s
dependency array safely stay empty?

### Mastery Check (Reason)

Given everything in this chain (closures → useCallback → useEffect),
explain in your own words what "stale state" means, why it's fundamentally
a closures problem and not a React bug, and name the two general
strategies for avoiding it: updater functions that don't read the
closed-over value at all, or correctly including every actually-used
value in the dependency array.

### Deeper / Deferred

React's Fiber reconciliation and exactly when effects are scheduled
relative to paint (`useEffect` vs. `useLayoutEffect` timing) — named, not
required here.
