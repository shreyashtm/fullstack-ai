# Module 2 — ReactJS (`react.*`)

Full concept content for all 17 concepts in `02-curriculum-model.md`'s
ReactJS module, in curriculum order. Three were already authored
elsewhere and are reproduced verbatim here (not re-derived) so the module
reads as one continuous document — `react.fundamentals`,
`react.use-callback`, and `react.use-effect` (all from
`chain-1-closures-to-stale-state.md` / `chain-4-react-to-cloud-deployment.md`
— if any is edited later, edit every copy together).

---

## react.fundamentals — Components & composition

**Target depth:** Understand

*(Reproduced from `chain-4-react-to-cloud-deployment.md` — content unchanged.)*

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
  everything JS can do (conditionals, loops, closures — `js.scope-and-closures`)
  applies inside it.
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
- **Cross-technology:** entry point of the react-to-cloud-deployment
  chain (`chain-4-react-to-cloud-deployment.md`).

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

## react.props — Props

**Target depth:** Use

### What Is It?

Props (short for "properties") are the inputs a parent component passes
to a child component — read-only from the child's perspective, similar to
function parameters.

### Mental Model

Think of a component like a function and props like its arguments — the
parent "calls" the child with specific values, and the child renders
based on whatever it received, without being able to change what it was
handed.

**Props flow one way, parent to child — a component reads its props but
never modifies them directly.**

### How It Works

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}
function App() {
  return <Greeting name="Ada" />;
}
```

`App` passes `name="Ada"` as a prop; `Greeting` receives it as its first
argument (an object, `{ name: "Ada" }`, commonly destructured — see
`js.destructuring`).

### Important Distinctions

- Props ≠ state — props come from the parent and the child can't change
  them; state (`react.use-state`) is owned and changed by the component
  itself.
- Passing a new prop value ≠ mutating — the parent creates a new value
  and re-renders the child with it; the child never reaches back and
  edits the parent's data directly.

### Why Does It Exist?

Components need a way to be configured differently each time they're used
(a `<Button>` with different labels, a `<Card>` with different data)
without hardcoding — props are that configuration mechanism, and their
one-way flow keeps data flow predictable in a large component tree.

### Connections

- **Prerequisite:** `react.fundamentals`, `js.objects`, `js.destructuring`.
- **Enables:** `react.reusable-components`, `react.conditional-rendering`
  (often driven by a prop).

### Production Appearance

Virtually every custom component in a real codebase takes props —
reading a component's signature (`function Card({ title, price,
onSelect })`) tells you exactly what it needs to render.

### Example

`<UserCard name="Ada" role="admin" />` passes two props into `UserCard`.

### Practice

If a child component tries to do `props.name = "New Name"` inside its
body, what happens? *(It doesn't throw, but it has no effect on what's
rendered or on the parent — mutating a prop directly isn't how React
re-renders; the correct pattern is the parent passing a new value down,
typically triggered by its own state changing.)*

---

## react.context-api — Context API

**Target depth:** Use

### What Is It?

The Context API lets a value be made available to an entire subtree of
components without manually passing it down as a prop through every
intermediate level.

### Mental Model

Think of normal props as passing a note hand-to-hand down a line of
people (every person in between has to physically pass it along, "prop
drilling"); Context is more like a broadcast anyone in the room can tune
into directly, skipping the hand-offs.

**Context lets a deeply nested component read a value directly from a
provider above it, without every component in between needing to know
about or forward that value.**

### How It Works

```jsx
const ThemeContext = createContext("light");

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}
function Toolbar() { return <Button />; }
function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}
```

`Toolbar` never touches `theme` at all — `Button`, several levels deep,
reads it directly via `useContext` (`react.use-context`).

### Important Distinctions

- Context ≠ a replacement for all prop passing — it's specifically for
  values many components across a subtree need (theme, current user,
  locale), not a default way to avoid ever writing props.
- Context ≠ free of re-render cost — every component consuming a context
  re-renders when the provided value changes, which can be broad if not
  scoped carefully.

### Why Does It Exist?

"Prop drilling" — passing a value through five components that don't use
it themselves just to reach a sixth that does — is repetitive and makes
refactoring painful; Context removes the middlemen.

### Connections

- **Prerequisite:** `react.props`.
- **Enables:** `react.use-context`. One of three "State Management"
  approaches this module covers, alongside `react.use-state` and
  `react.redux`.

### Production Appearance

Theme providers, authenticated-user providers, and locale/language
providers are the textbook real-world uses of Context.

### Example

An `AuthContext` providing the current logged-in user to any component in
the app that needs to check permissions, without threading `user` through
every layout component in between.

### Practice

A component three levels deep needs to know the current user's id —
using Context, does every component in between need to accept and
forward a `user` prop? *(No — only the top-level provider and the
component actually using `useContext` need to touch it at all.)*

---

## react.redux — Redux (survey)

**Target depth:** Understand

### What Is It?

Redux is a third-party state management library that stores an
application's shared state in a single, centralized object (the
"store"), updated only through explicitly dispatched actions and pure
reducer functions.

### Mental Model

Think of Redux as a single shared whiteboard for the whole app's
important state — any component can read from it, but nobody edits the
whiteboard directly; instead, everyone submits a written request
("action") to a designated editor (the "reducer") who's the only one
allowed to actually update it, always in a predictable, traceable way.

**Redux trades React's built-in, component-local state for one
centralized store, updated only through explicit actions — more
ceremony, but a fully traceable history of every state change.**

### How It Works

A component `dispatch`es an action (a plain object describing what
happened, e.g. `{ type: "cart/addItem", payload: item }`); a reducer
function (`(state, action) => newState`) computes the next state from the
current state and that action, without mutating the old state;
components subscribed to the store re-render when the relevant slice of
state changes.

### Important Distinctions

- Redux ≠ built into React — it's a separate library, unlike
  `useState`/`useContext`.
- Redux's centralized store ≠ always the right choice — for state used by
  only one or two nearby components, `react.use-state` or
  `react.context-api` is usually simpler; Redux earns its complexity
  mainly at real scale, with state shared unpredictably across many
  distant parts of a large app.

### Why Does It Exist?

As apps grow, Context alone can become unwieldy for frequently-changing,
widely-shared state (re-render scope, debugging "what changed and why");
Redux's strict action/reducer pattern gives large apps a single,
inspectable source of truth and a predictable change history (useful for
tools that can replay every action).

### Connections

- **Prerequisite:** `react.context-api` (the simpler alternative it's
  usually compared against), `react.use-reducer` — Redux's core pattern
  (action + reducer) is essentially `useReducer` scaled up to a whole
  app, and recognizing that similarity is the fastest way to understand
  Redux from what you already know.

### Production Appearance

A `store.js` or `store/` folder, `actions`/`reducers` (or "slices," in
the common Redux Toolkit style) folders, and components calling
`useSelector`/`useDispatch` are the signature of a Redux-based codebase.

### Example

An e-commerce app's shopping cart, used and modified from many unrelated
parts of the app (a product page, a header icon, a checkout page), is a
classic case where a centralized Redux store beats prop drilling or
scattered Context providers.

### Practice

For a single form's local input value, would Redux typically be the
right tool? *(No — that's exactly the case for `react.use-state`; Redux
is reserved for state genuinely shared across many, often distant, parts
of an app.)*

---

## react.use-state — useState

**Target depth:** Reason

### What Is It?

`useState` is a Hook that gives a function component a piece of
persistent, re-render-triggering state — a value that survives between
renders, and whose change causes the component to re-render with the new
value.

### Mental Model

Think of `useState` as React handing the component a labeled box (the
current value) plus a specific, sanctioned way to swap what's in the box
(the setter function) — React watches for that specific swap and knows
to re-render because of it, unlike an ordinary variable in the function
body, which resets to its initial value on every render.

**useState gives a component memory across renders, plus a way to change
that memory that also tells React to re-render — an ordinary variable
can't do either.**

### How It Works

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

`useState(0)` returns a pair: the current value (`count`, starting at 0)
and a setter (`setCount`). Calling `setCount(newValue)` tells React
"re-render this component, and this time `count` should be `newValue`."
On the next render, `useState` returns that new value, not `0` again.

### Important Distinctions

- A `useState` value ≠ an ordinary local variable — a plain `let x = 0`
  inside the component body resets to `0` on every re-render; `useState`'s
  value survives across renders because React stores it outside the
  function itself.
- Calling the setter ≠ synchronous — `setCount(count + 1)` doesn't
  immediately update `count` within the same render; the new value is
  only available starting the *next* render (React batches and schedules
  the update).
- `setCount(count + 1)` ≠ `setCount(c => c + 1)` — the first reads
  `count` from the current closure (risky if called multiple times before
  a re-render, or from a stale closure — `js.scope-and-closures`); the
  second (the "updater function" form) always receives the truly latest
  state, regardless of closures.

### Why Does It Exist?

A component function re-runs completely on every render — without a
mechanism outside the function's own local variables to persist a value,
there'd be no way for a component to "remember" anything (how many times
a button was clicked, whether a checkbox is checked) between renders.

### Connections

- **Prerequisite (BLOCKING):** `js.objects` (for object/array state),
  `js.spread-rest` (for immutable updates).
- **Related:** `react.context-api` and `react.redux` as
  alternative/complementary state approaches; `react.use-reducer` for
  more complex state transitions.
- **Enables:** `react.rerender-optimization`, `react.forms`.

### Production Appearance

Nearly every interactive component — a toggle, a form field, a counter, a
modal's open/closed flag — holds at least one `useState`.

### Example

```jsx
const [isOpen, setIsOpen] = useState(false);
```

Toggled by `setIsOpen(!isOpen)` or, more safely, `setIsOpen(prev => !prev)`.

### Trace

Clicking a `+1` button twice in the same event handler:

```jsx
function handleClick() {
  setCount(count + 1);
  setCount(count + 1);
}
```

| What happens | Result |
|---|---|
| Both calls read `count` from the same closure (say, 0) | Both effectively say "set to 1" — ends up 1, not 2 |

vs. using the updater form:

```jsx
function handleClick() {
  setCount(c => c + 1);
  setCount(c => c + 1);
}
```

| What happens | Result |
|---|---|
| Each updater receives the true latest value in sequence | Ends up 2, as expected |

### Common Misconceptions

**"Calling setCount updates count immediately, so I can read the new
value on the next line."** It doesn't — within the same render/event
handler, `count` still refers to the old value; the update is only
visible starting the next render, which is exactly why the
double-increment example above is a real, common bug.

### Practice

Given the "double increment" trace above, which version reliably reaches
2, and why? *(The updater-function version — `setCount(c => c + 1)` —
because each call receives the actual latest state at the time React
processes it, rather than a value read from one shared closure.)*

### Code Reading

```jsx
function Toggle() {
  const [on, setOn] = useState(false);
  function handleClick() {
    setOn(!on);
    console.log(on);
  }
  return <button onClick={handleClick}>{on ? "On" : "Off"}</button>;
}
```

After clicking once, what does `console.log(on)` print — the old value
or the new one — and why? *(The old value — `on` inside `handleClick` is
from the closure captured at that render; `setOn` schedules a re-render
with the new value, but doesn't retroactively change what `on` refers to
in the currently-running function.)*

### Mastery Check (Reason)

Explain, using both the closure concept from Module 1 and this concept's
updater-function distinction, why `setCount(count + 1)` called three
times in a row inside one function only increments the display by 1,
while `setCount(c => c + 1)` called three times increments it by 3.

### Deeper / Deferred

React's internal state-update batching and scheduling (exactly when/how
multiple `setState` calls in one event handler get grouped into one
re-render) — named, not required at this depth.

---

## react.use-effect — useEffect

**Target depth:** Reason

*(Reproduced from `chain-1-closures-to-stale-state.md` — content unchanged.)*

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
- **Related:** `next.data-fetching`, `react.api-calls`.

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
  later renders.

### Practice

```jsx
useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000);
  return () => clearInterval(id);
}, []);
```

This "counter" famously gets stuck incrementing from 0 to 1 forever
instead of counting up. Using `js.scope-and-closures`, explain why, and
what the fix is. *(Either add `count` to the deps — resetting the
interval each tick — or use the updater form `setCount(c => c + 1)`,
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

Walk through why this version correctly counts up forever — what role
does the updater-function form (`s => s + 1`) play in avoiding the
closure trap entirely, and why can `tick`'s dependency array safely stay
empty?

### Mastery Check (Reason)

Given everything from closures through useCallback through useEffect,
explain in your own words what "stale state" means, why it's
fundamentally a closures problem and not a React bug, and name the two
general strategies for avoiding it.

### Deeper / Deferred

React's Fiber reconciliation and exactly when effects are scheduled
relative to paint (`useEffect` vs. `useLayoutEffect` timing) — named, not
required here.

---

## react.use-callback — useCallback

**Target depth:** Reason

*(Reproduced from `chain-1-closures-to-stale-state.md` — content unchanged.)*

### What Is It?

`useCallback` is a Hook that returns a memoized version of a function —
the same function reference across re-renders, as long as its listed
dependencies haven't changed.

### Mental Model

Normally, a component function re-running on every render creates a
brand-new copy of every function defined inside it. `useCallback` says
"don't make a new one unless these specific ingredients changed —
otherwise hand back the exact same one you gave me last time."

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

- `useCallback` ≠ making the function itself faster — only its *identity*
  (reference) is being controlled.
- `useCallback` ≠ `useMemo` — `useCallback(fn, deps)` is exactly
  `useMemo(() => fn, deps)`.

### Why Does It Exist?

A function defined inside a component is a new closure every render
(`js.scope-and-closures`) — a new reference, even if it does the exact
same thing. That matters when the function is passed to a child wrapped
in `React.memo`, or listed in another Hook's dependency array.

### Connections

- **Prerequisite (BLOCKING):** `js.scope-and-closures`. Related to
  `react.rerender-optimization`.
- **Related:** `react.use-memo`.

### Production Appearance

Wrapping an event handler or a callback passed to a memoized child
component.

### Example

A `<SearchInput onSearch={handleSearch} />` where `SearchInput` is
wrapped in `React.memo` — without `useCallback` on `handleSearch`,
`SearchInput` re-renders every time its parent does, regardless of
`React.memo`.

### Common Misconceptions

**"I should wrap every function in useCallback."** If nothing downstream
depends on reference stability, it's pure overhead for no benefit.

### Practice

Given `useCallback(() => setCount(count + 1), [])` with an empty
dependency array — does the returned function's reference change across
re-renders? *(No — empty deps means the same function reference forever,
but see `react.use-effect` for why that specific pattern is a stale-closure
trap.)*

### Mastery Check (Reason)

`() => setCount(count + 1)` with deps `[]` is a classic stale-closure bug
waiting to happen. Using what you know about closures, what's wrong with
it, and how would you fix the dependency array?

### Deeper / Deferred

React's internal memoization/comparison mechanism (`Object.is` under the
hood) — named, not required at this depth.

---

## react.use-memo — useMemo

**Target depth:** Reason

### What Is It?

`useMemo` is a Hook that memoizes the *result* of an expensive
computation — it re-runs the computation only when specific dependencies
change, and returns the cached result otherwise.

### Mental Model

Think of `useMemo` as a note that says "don't redo this calculation
unless these specific ingredients changed — otherwise just hand back the
answer you already worked out."

**useMemo caches a computed value across renders — it doesn't prevent a
re-render, it prevents redoing expensive work during a re-render that
doesn't actually need it.**

### How It Works

```jsx
const sortedItems = useMemo(() => {
  return [...items].sort((a, b) => a.price - b.price);
}, [items]);
```

On every render, React compares the new `[items]` to the previous
render's; if unchanged (by `===`), it skips re-running the sort and
returns the previously computed `sortedItems`; if `items` changed, it
recomputes.

### Important Distinctions

- `useMemo` ≠ `useCallback` in what it memoizes — `useMemo` memoizes any
  computed *value*; `useCallback(fn, deps)` is `useMemo(() => fn, deps)`,
  memoizing a *function* specifically.
- `useMemo` ≠ a guarantee — React is allowed (though rarely does) to
  discard the memoized value and recompute anyway; it's a performance
  hint, not a correctness mechanism, so code should never rely on it to
  avoid running side effects.

### Why Does It Exist?

Some computations (sorting a large list, complex derived data) are
expensive enough that redoing them on every re-render — even when the
underlying data hasn't changed — visibly hurts performance; `useMemo`
lets that cost be paid only when necessary.

### Connections

- **Prerequisite (BLOCKING):** `js.scope-and-closures` (the dependency-array
  comparison is the same closure-based mechanism as `useCallback`),
  `react.use-callback`.
- **Enables:** `react.rerender-optimization`.

### Production Appearance

Sorting/filtering a large list derived from props or state, or computing
an expensive aggregated/formatted value that doesn't need to be
recalculated on every unrelated re-render.

### Example

```jsx
const total = useMemo(() => cart.reduce((s, i) => s + i.price, 0), [cart]);
```

Avoids recomputing the cart total on renders where `cart` hasn't changed.

### Common Misconceptions

**"I should wrap every computed value in useMemo for performance."** Most
computations are cheap enough that `useMemo`'s own overhead (comparing
dependencies, storing the cached value) isn't worth it — it's meant for
genuinely expensive computations or values whose *reference* needs to
stay stable, not a blanket habit.

### Practice

`const doubled = useMemo(() => items.map(i => i * 2), [items]);` — if
`items` is a new array reference every render (even with the same
contents), does `useMemo` actually save any work? *(No — the dependency
array compares by reference; a "new but equal-content" array is still
treated as changed, so the computation reruns every time. Keeping the
underlying data reference-stable matters just as much as memoizing.)*

### Mastery Check (Reason)

A component renders slowly, and a teammate wraps a cheap calculation
(`items.length`) in `useMemo`, expecting a speedup — does this help, and
using what you know about `useMemo`'s own overhead, explain why or why
not.

### Deeper / Deferred

React Compiler / automatic memoization efforts aiming to make manual
`useMemo`/`useCallback` largely unnecessary in the future — named, not
required at this depth.

---

## react.use-ref — useRef

**Target depth:** Use

### What Is It?

`useRef` is a Hook that returns a mutable object (`{ current: ... }`)
that persists across renders without causing a re-render when it
changes — commonly used to hold a reference to a DOM element or any
mutable value that shouldn't trigger re-rendering.

### Mental Model

Think of a ref as a sticky note taped to the side of the component — you
can read and write it freely across renders, but writing on it never
tells React "something changed, re-render" the way `setState` does.

**useRef gives you a mutable box that survives renders silently —
useState gives you a value that survives renders loudly (triggering a
re-render on change).**

### How It Works

```jsx
function TextInput() {
  const inputRef = useRef(null);
  function focusInput() {
    inputRef.current.focus();
  }
  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}
```

React attaches the actual DOM `<input>` element to `inputRef.current`
once it's rendered; `focusInput` can then call real DOM methods
(`.focus()`) directly on it.

### Important Distinctions

`useRef` ≠ `useState` — mutating `ref.current` does not cause a
re-render, while calling a `useState` setter does; this is exactly why
refs are wrong for anything that needs to appear on screen, and right for
anything that shouldn't cause extra renders (a DOM node reference, a
timer id, a previous-value cache).

### Why Does It Exist?

Some values (a DOM node to imperatively focus, a `setInterval` id to
clear later, tracking "did this effect already run") need to persist
across renders but have no business triggering a re-render themselves —
`useRef` is the escape hatch for exactly that case.

### Connections

- **Prerequisite:** `react.fundamentals`.
- **Related:** `react.use-effect` — a ref is the standard place to store
  a `setInterval`/`setTimeout` id so its cleanup function can clear it.

### Production Appearance

Focusing an input programmatically, measuring a DOM element's size,
storing a mutable id between an effect's setup and its cleanup.

### Example

The interval id in `react.use-effect`'s Timer example is conceptually
the kind of value often stored in a ref when it needs to be read outside
the effect that created it.

### Practice

If a component does `const renderCount = useRef(0); renderCount.current++;`
on every render, does reading `renderCount.current` update visibly and
immediately as renders happen? *(It updates the number, but incrementing
it does not itself *cause* a re-render — you'd only see the updated count
if something else already triggered a re-render for an unrelated
reason.)*

---

## react.use-context — useContext

**Target depth:** Use

### What Is It?

`useContext` is the Hook that lets a function component read the current
value of a Context (`react.context-api`) provided by the nearest matching
`Provider` above it in the tree.

### Mental Model

Think of `useContext(SomeContext)` as tuning a radio to a specific
station — you get whatever the nearest broadcaster (Provider) above you
is currently sending, without knowing or caring how far away that
broadcaster is.

**useContext is how a component actually reads a value made available by
Context.Provider — Context alone declares the pipe; useContext is what
taps into it.**

### How It Works

```jsx
const theme = useContext(ThemeContext);
```

React walks up the component tree from where this Hook is called, finds
the nearest `<ThemeContext.Provider value={...}>`, and returns its
current `value`; if no provider exists above it, it returns the
context's default value (set when `createContext(defaultValue)` was
called).

### Important Distinctions

`useContext` ≠ subscribing to only part of the value — if a Provider's
value is an object and any field of it changes, every component calling
`useContext` on it re-renders, even if it only used one unrelated field;
this is the practical limitation that pushes large, frequently-changing
shared state toward Redux (`react.redux`) instead.

### Why Does It Exist?

Before Hooks, consuming Context inside a function component required a
more awkward pattern (a render-prop `<ThemeContext.Consumer>`);
`useContext` makes reading a context value a single, direct line.

### Connections

- **Prerequisite (BLOCKING):** `react.context-api`.
- **Related:** `react.redux` — the re-render-scope limitation noted above
  is exactly the problem Redux's selector-based subscriptions solve at
  scale.

### Production Appearance

`const user = useContext(AuthContext);` or `const theme =
useContext(ThemeContext);` near the top of any component that needs that
shared value.

### Practice

A component calls `useContext(AuthContext)` but is not rendered anywhere
inside an `<AuthContext.Provider>` — what value does it get? *(The
context's default value, the one passed to `createContext(defaultValue)` —
not an error.)*

---

## react.use-reducer — useReducer

**Target depth:** Use

### What Is It?

`useReducer` is a Hook for managing state via a reducer function —
`(state, action) => newState` — an alternative to `useState` suited to
state with multiple sub-values or complex transitions.

### Mental Model

Think of `useReducer` as `useState`'s sibling for when a single "set this
to that" isn't enough — instead of directly setting the new value, you
`dispatch` a description of *what happened* ("an action"), and a single
reducer function decides what the new state should be, similar in shape
to Redux's core pattern but scoped to one component.

**useReducer separates *what happened* (the dispatched action) from *how
state should change in response* (the reducer) — useful once state
updates depend on more than just the new value being set.**

### How It Works

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "increment": return { count: state.count + 1 };
    case "decrement": return { count: state.count - 1 };
    default: return state;
  }
}
function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return <button onClick={() => dispatch({ type: "increment" })}>{state.count}</button>;
}
```

`dispatch({ type: "increment" })` calls `reducer(currentState, { type:
"increment" })`, and React re-renders with whatever it returns.

### Important Distinctions

- `useReducer` ≠ Redux — it's a built-in React Hook for a single
  component's (or a small subtree's) state, not an app-wide store; the
  *pattern* (action + reducer) is the same idea Redux scales up.
- `dispatch` ≠ `setState` — you send a description of an event, not the
  new value directly; the reducer function alone computes the new value.

### Why Does It Exist?

When a piece of state has multiple related fields that change together,
or complex logic for how a given "event" should transform state,
spreading that logic across several `useState` calls gets tangled;
centralizing it in one reducer function makes the transition logic
testable and readable in one place.

### Connections

- **Prerequisite:** `react.use-state` (the simpler baseline it's compared
  against).
- **Related:** `react.redux` — same action/reducer shape, different
  scope; recognizing `useReducer` first makes Redux far easier to learn
  afterward.

### Production Appearance

A complex form with many interrelated fields, or a component whose state
has several valid "modes" (loading/error/success) that shouldn't be
tracked as several independent booleans.

### Practice

For a component that just needs to track a single boolean (a modal's
open/closed state), would `useReducer` typically be the better choice
over `useState`? *(No — that's exactly the simple case `useState` is
meant for; `useReducer` earns its complexity once there are multiple
related pieces of state or non-trivial transition logic.)*

---

## react.rerender-optimization — Component re-render optimization

**Target depth:** Reason

### What Is It?

Re-render optimization is the practice of preventing a component from
re-rendering (or from doing unnecessary work during a re-render) when its
actual output wouldn't change — using `React.memo`, `useMemo`, and
`useCallback` together.

### Mental Model

Think of React's default behavior as "when a parent re-renders, re-render
every child too, just in case" — optimization is opting specific
components out of that default by giving React a reliable way to check
"would this child's output actually be different this time?" and
skipping the work if not.

**React re-renders too eagerly by default on purpose — it's safer to
over-render than under-render; optimization is selectively telling React
where that safety margin isn't worth the cost.**

### How It Works

```jsx
const ExpensiveList = React.memo(function ExpensiveList({ items, onSelect }) {
  return items.map(item => <Item key={item.id} item={item} onSelect={onSelect} />);
});

function Parent() {
  const [count, setCount] = useState(0);
  const items = useMemo(() => computeItems(), []);       // stable reference
  const onSelect = useCallback((id) => console.log(id), []); // stable reference
  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <ExpensiveList items={items} onSelect={onSelect} />
    </>
  );
}
```

`React.memo` wraps `ExpensiveList` so it skips re-rendering when its
props are reference-equal to last time; `useMemo`/`useCallback` in
`Parent` ensure `items` and `onSelect` actually *stay* the same reference
across `Parent`'s re-renders (triggered by `count` changing), so
`React.memo`'s comparison actually succeeds in skipping work.

### Important Distinctions

- `React.memo` alone ≠ enough — if the props passed to a memoized
  component are new object/array/function references every render (the
  default in JavaScript), `React.memo`'s comparison always finds
  "different," defeating the optimization; this is exactly why
  `useMemo`/`useCallback` typically travel together with `React.memo`.
- Re-render ≠ always expensive — for cheap components, the default
  re-render-everything behavior costs essentially nothing, and adding
  memoization has its own (small but real) overhead; optimizing every
  component by default is itself a performance anti-pattern.

### Why Does It Exist?

Large component trees with expensive children (heavy computation, large
lists) can visibly slow down if every unrelated state change anywhere in
the tree re-renders everything beneath it; targeted memoization lets
specific expensive subtrees opt out when their actual inputs haven't
changed.

### Connections

- **Prerequisite (BLOCKING):** `react.use-memo`, `react.use-callback`,
  `js.scope-and-closures` (the entire reason new references appear every
  render).

### Production Appearance

Wrapping a large, rarely-changing list or a complex chart/visualization
component in `React.memo`, paired with `useMemo`/`useCallback` for
whatever props it receives.

### Trace

Without memoization:

| Parent re-renders because | Does ExpensiveList re-render? |
|---|---|
| `count` changes | yes — new `items`/`onSelect` references every time, even though their *content* didn't change |

With `React.memo` + `useMemo`/`useCallback`:

| Parent re-renders because | Does ExpensiveList re-render? |
|---|---|
| `count` changes | no — `items`/`onSelect` are the same references as last render |

### Common Misconceptions

**"Wrapping a component in React.memo automatically makes it fast."**
Without also stabilizing the references of the props it receives (via
`useMemo`/`useCallback` in the parent, or by not creating new
objects/functions inline as props at all), `React.memo` frequently does
nothing, because the props it's comparing are new references every
render regardless.

### Practice

Given the `Parent`/`ExpensiveList` example above, what would happen if
`useMemo`/`useCallback` were removed but `React.memo` stayed?
*(`ExpensiveList` would re-render on every `count` change anyway — `items`
and `onSelect` would be new references each render, so `React.memo`'s
comparison would always report "changed.")*

### Code Reading

```jsx
function Parent() {
  return <ExpensiveList onSelect={(id) => console.log(id)} />;
}
```

Even if `ExpensiveList` is wrapped in `React.memo`, does this pattern let
the memoization actually help? *(No — the inline arrow function is a
brand-new function reference every single render of `Parent`, regardless
of what caused that render; without `useCallback`, `React.memo` can never
see two matching renders in a row for this prop.)*

### Mastery Check (Reason)

A teammate memoizes a component with `React.memo` but doesn't see any
measurable performance improvement in profiling. Using everything from
`js.scope-and-closures` through this concept, list the two most likely
reasons, in the order you'd investigate them.

### Deeper / Deferred

React's Fiber reconciliation algorithm and exactly how it decides what to
actually repaint versus what it merely re-executes the function for —
named, not required at this depth.

---

## react.reusable-components — Reusable components

**Target depth:** Use

### What Is It?

A reusable component is one designed with a general-purpose interface
(props, and optionally `children`) so it can be used in multiple
different contexts across an app, rather than hardcoded for one specific
use.

### Mental Model

Think of a reusable component like a well-designed tool (a screwdriver,
not a single-use jig) — it does one job well, configured through clear
inputs, and doesn't assume anything about the specific situation it'll be
used in beyond what it's explicitly given.

**A reusable component's props are its entire public interface — if
using it in a new context requires editing the component's internals, it
isn't actually reusable yet.**

### How It Works

```jsx
function Button({ children, variant = "primary", onClick }) {
  return <button className={`btn btn-${variant}`} onClick={onClick}>{children}</button>;
}
// used differently in different places:
<Button onClick={save}>Save</Button>
<Button variant="danger" onClick={deleteItem}>Delete</Button>
```

`children` (a special prop) lets the caller supply arbitrary content
between the component's tags, and `variant` generalizes its appearance
without a separate component per style.

### Important Distinctions

- Reusable ≠ generic-to-the-point-of-uselessness — a component with 20
  loosely related props trying to cover every possible use case is often
  harder to use correctly than several smaller, purpose-specific
  components; reusability is a design tradeoff, not an unconditional
  goal.
- `children` as a prop ≠ an ordinary named prop — it's populated
  automatically from whatever's nested between a component's opening and
  closing tags in JSX.

### Why Does It Exist?

Rebuilding visually or behaviorally similar UI from scratch in multiple
places wastes effort and produces inconsistency; a shared, well-designed
component keeps both effort and appearance consistent.

### Connections

- **Prerequisite:** `react.props`, `react.fundamentals`.
- **Related:** `react.conditional-rendering` — a reusable component often
  varies its output based on a prop.

### Production Appearance

A `components/` or `ui/` folder full of generically-named components
(`Button`, `Card`, `Modal`, `Input`) used across many different
pages/features in a real codebase.

### Example

A `<Modal title="Confirm" onClose={close}>{content}</Modal>` reused for a
delete confirmation, a settings dialog, and an image preview, each
supplying different `children`.

### Practice

A `ProductCard` component hardcodes the text "Add to Cart" on its
button — what change would make it reusable for both a shopping app and a
wishlist feature that needs "Add to Wishlist" instead? *(Accept the
button label as a prop, e.g. `actionLabel`, instead of hardcoding the
string inside the component.)*

---

## react.event-handling — Event handling

**Target depth:** Use

### What Is It?

Event handling in React is attaching a function to a JSX element's event
prop (`onClick`, `onChange`, `onSubmit`, etc.) so that function runs when
the corresponding browser event fires on that element.

### Mental Model

Think of an event handler prop as a direct wire from a specific user
action on a specific element to a specific function — React attaches and
manages the underlying browser event listener for you.

**`onClick={handleClick}` wires a function to run on that exact element's
click — the handler is just a regular JavaScript function, called with an
event object describing what happened.**

### How It Works

```jsx
function Button() {
  function handleClick(event) {
    console.log("clicked", event.target);
  }
  return <button onClick={handleClick}>Click me</button>;
}
```

`onClick={handleClick}` passes the *function itself* (not calling it —
`onClick={handleClick()}` would call it immediately during render, a
common beginner mistake); React calls it later, exactly when the click
happens, passing a synthetic event object.

### Important Distinctions

- `onClick={handleClick}` (pass the function) ≠ `onClick={handleClick()}`
  (call the function immediately during render and pass its *return
  value* as the handler — almost always a bug).
- React's event object behaves like the raw browser event for virtually
  all common needs (`event.target`, `event.preventDefault()`).

### Why Does It Exist?

UI needs to respond to user actions; JSX's event props give a
declarative, consistent way to wire a handler function to a specific
element's interaction, integrated with React's render cycle (see
`js.functions` for why passing a function, not calling one, is the
correct shape here).

### Connections

- **Prerequisite (BLOCKING):** `js.functions` — passing vs. calling a
  function is exactly the distinction that trips people up here.
- **Enables:** `react.forms`, `react.use-state` (handlers very commonly
  call a state setter).

### Production Appearance

Every interactive element in a real UI — buttons, inputs, links
intercepted for client-side navigation — has an event handler prop wiring
it to application logic.

### Example

`<input onChange={(e) => setValue(e.target.value)} />` reads the new
value out of the event object and stores it in state on every keystroke.

### Practice

What's wrong with `<button onClick={handleClick()}>Save</button>` if
`handleClick` is meant to run only when the button is clicked? *(The
parentheses call `handleClick` immediately during render, not on
click — it should be `onClick={handleClick}`, passing the function itself
for React to call later.)*

---

## react.forms — Forms (controlled inputs)

**Target depth:** Use

### What Is It?

Forms in React are typically built with "controlled inputs" — form
fields whose value is driven by React state, with every keystroke
updating that state via an `onChange` handler, rather than letting the
DOM manage the input's value independently.

### Mental Model

Think of a controlled input as a two-way mirror between the DOM element
and a piece of state — the input always displays exactly what's in
state, and every keystroke updates that state, which is what makes the
input's displayed value change; the DOM never holds "its own" value
independent of React.

**A controlled input's displayed value always comes from state, and its
onChange handler is the only path back into that state — React is the
single source of truth, not the DOM element.**

### How It Works

```jsx
function NameForm() {
  const [name, setName] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    console.log("submitted:", name);
  }
  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Save</button>
    </form>
  );
}
```

`value={name}` forces the input to always display whatever `name`
currently is; `onChange` is the only thing that updates `name`, so every
keystroke goes through React state, and `e.preventDefault()` on submit
stops the browser's default full-page-reload form submission.

### Important Distinctions

- A controlled input (`value` set from state, plus `onChange`) ≠ an
  uncontrolled input (no `value` prop — the DOM manages its own value,
  read only when needed via a ref, `react.use-ref`) — controlled is
  React's default recommended pattern; uncontrolled is a narrower escape
  hatch.
- Omitting `e.preventDefault()` in `onSubmit` ≠ harmless — without it,
  the browser's default full-page navigation/reload happens, discarding
  the SPA's state.

### Why Does It Exist?

Letting the DOM hold form state independently of React (uncontrolled)
makes validation, conditional disabling, and syncing the UI to that value
from elsewhere in the app awkward; controlled inputs keep the form's
actual data entirely inside React's normal state/re-render model.

### Connections

- **Prerequisite (BLOCKING):** `react.use-state`, `react.event-handling`.
- **Related:** `react.use-ref` (for the uncontrolled alternative, used
  sparingly).

### Production Appearance

Virtually every text input, checkbox, and select in a real React form is
controlled — searching a codebase for `value={` on an `<input>` is a fast
way to find them.

### Example

A search box that filters a list live as the user types is a controlled
input whose `onChange` both updates state and drives the filtering logic
in the same step.

### Practice

`<input value={name} />` with no `onChange` handler at all — what happens
when the user tries to type in it? *(Nothing appears to type — React
keeps forcing the input back to whatever `name` currently is, since
there's no `onChange` to ever update it; this is a common real bug, and
React typically warns about it in the console.)*

---

## react.conditional-rendering — Conditional rendering

**Target depth:** Use

### What Is It?

Conditional rendering is choosing what JSX a component outputs based on a
condition — using ordinary JavaScript control flow (`if`, ternaries,
`&&`) rather than a special templating syntax.

### Mental Model

Think of conditional rendering as the component simply deciding, in
plain JavaScript, which piece of UI to return this time — there's no
separate "React way" to branch; it's the same `if`/ternary/`&&` logic
you'd use anywhere else in JS, just deciding what JSX comes out.

**Conditional rendering isn't special React syntax — it's ordinary
JavaScript branching that happens to produce JSX as its result.**

### How It Works

```jsx
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) return <h1>Welcome back</h1>;
  return <h1>Please sign in</h1>;
}
// or, inline:
function Badge({ count }) {
  return <div>{count > 0 && <span>{count} new</span>}</div>;
}
```

The `if` version branches before returning; the `&&` version relies on
JavaScript's short-circuit evaluation — if `count > 0` is falsy, the
expression evaluates to that falsy value (which React renders as
nothing) instead of the `<span>`.

### Important Distinctions

- `condition && <Component />` ≠ safe with every falsy value — if `count`
  is `0`, `0 && <span>...</span>` evaluates to `0`, and React actually
  renders the literal number `0` on the page (a real, common bug), unlike
  `false`/`null`/`undefined`, which React renders as nothing.
- A ternary (`cond ? <A /> : <B />`) ≠ interchangeable with `&&` when
  there's a genuine "else" case — `&&` alone has no else branch.

### Why Does It Exist?

UI constantly needs to show different things based on state (loading vs.
loaded, logged in vs. not, empty list vs. populated) — reusing plain
JavaScript's own branching keeps the mental model consistent with
everything else already known about JS.

### Connections

- **Prerequisite (BLOCKING):** `js.functions` — returning different JSX
  is just a function returning different values.
- **Related:** `next.loading-error-states` — a Next.js-specific
  structured version of exactly this pattern.

### Production Appearance

Loading spinners (`isLoading ? <Spinner /> : <Content />`), empty states
(`items.length === 0 ? <EmptyState /> : <List items={items} />`), and
permission-gated UI all use this pattern constantly.

### Example

`{error ? <ErrorBanner message={error} /> : null}` renders an error
banner only when `error` is truthy.

### Practice

`<div>{cartCount && <Badge count={cartCount} />}</div>` — what renders if
`cartCount` is `0`, and why is this considered a common bug? *(It renders
the literal text "0" on the page, because `0 && anything` evaluates to
`0`, and React renders numbers, including 0, as visible text — unlike
`false`/`null`. The fix is usually `cartCount > 0 && <Badge .../>` to
force a real boolean.)*

---

## react.api-calls — API calls from components

**Target depth:** Use

### What Is It?

Making an API call from a React component means fetching data from a
backend (typically via `fetch` or a library) and storing the result in
state so the component can render it, usually from inside a `useEffect`
in a purely client-rendered setup.

### Mental Model

Think of it as the component saying, right after it first appears on
screen, "now go get me the real data" — it renders once with nothing (or
a loading state), then re-renders once the data arrives.

**A client-side API call is inherently a two-render story — once before
the data arrives (loading/empty), once after (loaded) — because fetching
is asynchronous and rendering can't simply pause and wait for it.**

### How It Works

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => { setUser(data); setLoading(false); });
  }, [userId]);

  if (loading) return <Spinner />;
  return <div>{user.name}</div>;
}
```

The effect runs after the first render (and again whenever `userId`
changes), kicks off the fetch, and updates state once the data arrives —
which triggers the second render showing real content.

### Important Distinctions

- This client-side pattern ≠ the only way to fetch data in this
  curriculum's stack — `next.data-fetching`'s Server Components can fetch
  directly during server rendering, skipping this whole "render empty,
  then re-render with data" cycle for the initial page load; this
  `useEffect`-based pattern remains necessary for data fetched in
  response to client-side interaction.
- A fetch with no error handling ≠ safe — see `js.error-handling`; a
  failed request with no `.catch`/`try` leaves the component stuck in a
  loading state forever with no explanation.

### Why Does It Exist?

A component can't literally pause its render and wait for a network
response; triggering the fetch as a side effect and re-rendering once the
data lands is the pattern that fits React's render model.

### Connections

- **Prerequisite (BLOCKING):** `react.use-effect`, `react.use-state`,
  `js.promises`/`js.async-await`.
- **Related:** `next.data-fetching` (the Server Component alternative
  that avoids this pattern for initial loads), `js.error-handling`.

### Production Appearance

Any component showing data from a backend that isn't already known at
render time — a user profile, a product list, search results.

### Example

The `UserProfile` component above is the canonical shape of this pattern
across countless real codebases.

### Practice

In the `UserProfile` example, what does the component render during the
brief window after mount but before the fetch resolves? *(The
`<Spinner />` — `loading` starts `true`, so the first render (and any
render before the fetch resolves) shows the loading state; only once
`setUser`/`setLoading(false)` run does it switch to showing `user.name`.)*
