# Milestone 2 — React Interactive UI

Guidance level: **Guided** (architecture + file boundaries given, you write the logic).

## Objective

Rebuild Milestone 1's expense tracker as a componentized React app. Same
features (add/edit/delete, category totals, simulated cloud sync) — now
through props, hooks, and a shared state container instead of manual DOM
manipulation.

## Concepts Practiced

All from `curriculum/module-02-react.md`:

- `react.fundamentals` (Understand) — component composition
- `react.props` (Use)
- `react.context-api` (Use)
- `react.use-state` (Reason)
- `react.use-effect` (Reason)
- `react.use-callback` (Reason)
- `react.use-memo` (Reason)
- `react.use-ref` (Use)
- `react.use-context` (Use)
- `react.use-reducer` (Use)
- `react.rerender-optimization` (Reason)
- `react.reusable-components` (Use)
- `react.event-handling` (Use)
- `react.forms` (Use)
- `react.conditional-rendering` (Use)
- `react.api-calls` (Use)

`react.redux` (Understand, survey depth) is **not implemented** here —
deliberately. It's a comparison concept in the curriculum, not something
this small an app needs. Reasoning Question 3 asks you to compare it to
what you *did* build instead.

## Previously Learned

All of `curriculum/module-01-javascript.md` (Milestone 1) — most directly
`js.scope-and-closures`, `js.arrays`, `js.objects`, `js.spread-rest`,
`js.promises`/`js.async-await`.

## New Concepts

None — pure application of Module 2 onto the same feature set Milestone 1
already built.

## Requirements

1. Break the UI into components: `ExpenseForm`, `ExpenseList`,
   `ExpenseRow`, `CategoryTotals` — composed under `App` (`react.fundamentals`,
   `react.reusable-components`, `react.props`).
2. Expense state lives in a `useReducer` + Context provider
   (`ExpensesProvider`), not five separate `useState` calls threaded
   through props (`react.use-reducer`, `react.use-context`, `react.context-api`).
3. The add-expense form uses controlled inputs with validation before
   submit (`react.forms`, `react.event-handling`, `react.conditional-rendering`
   for the error message).
4. Cloud sync (same simulated behavior as Milestone 1) is triggered from a
   `useCloudSync` hook built on `useEffect` + `useCallback`
   (`react.use-effect`, `react.use-callback`, `react.api-calls`).
5. Category totals are computed with `useMemo`, not recomputed unconditionally
   every render (`react.use-memo`).
6. `useRef` holds something that must persist across renders without
   triggering one — e.g. a count of in-flight syncs, or focusing the
   amount input on mount (`react.use-ref`).
7. `ExpenseRow` is wrapped in `React.memo` and must actually skip
   re-rendering when unrelated state changes (`react.rerender-optimization`)
   — see the Debugging Challenge, this is seeded to currently NOT work.
8. An empty-list state renders a distinct message instead of an empty
   `<ul>` (`react.conditional-rendering`).

## Constraints

- No prop-drilling past one level — anything more than one level deep goes
  through `ExpensesContext`.
- All reducer updates are immutable (same discipline as Milestone 1 — now
  React actually requires it for correct re-renders, not just good style).
- Any callback passed down to a memoized child must have a stable identity
  across renders (`useCallback` with a correct dependency array) — this is
  a real requirement, not a suggestion; violating it is exactly this
  milestone's bug.

## Architecture

```
project/app/milestone-02-react/
  package.json, vite.config.js, index.html
  src/
    main.jsx
    App.jsx
    state/
      expensesReducer.js       <- add/update/remove actions (spread/rest discipline)
      ExpensesContext.jsx        <- createContext + provider wrapping useReducer
    hooks/
      useCloudSync.js               <- useEffect + useCallback sync hook
      useCategoryTotals.js             <- useMemo-based totals
    components/
      ExpenseForm.jsx
      ExpenseList.jsx
      ExpenseRow.jsx                       <- React.memo — see Debugging Challenge
      CategoryTotals.jsx
```

## Implementation Task

Fill in every `// TODO` across `src/`. Suggested order: `expensesReducer.js`
→ `ExpensesContext.jsx` → `App.jsx` → `ExpenseForm.jsx` → `ExpenseList.jsx`
→ `useCategoryTotals.js` → `CategoryTotals.jsx` → `useCloudSync.js`.
`ExpenseRow.jsx` is provided with its bug intact — don't fix it until
you've reasoned about it.

## Reasoning Questions

1. `ExpenseRow` is wrapped in `React.memo`, yet every row still re-renders
   whenever *any* expense changes, not just the one that changed. `memo`
   compares props by reference — what reference is changing here on every
   render, and why?
2. If `useCloudSync`'s `useEffect` omitted `expenses` from its dependency
   array but still read `expenses` inside the effect body, what value
   would it see by the 3rd render? Connect this explicitly to
   `js.scope-and-closures` from Milestone 1 — same mechanism, new syntax.
3. Why `useReducer` + Context here instead of `react.redux`? What would
   Redux actually add at this app's current size, and at what size would
   that trade-off flip?
4. `useMemo` wraps the totals computation. What cost is actually being
   avoided? Under what dependency-array mistake would it silently return
   stale totals instead of recomputing?

## Debugging Challenge

`ExpenseList.jsx` renders each `ExpenseRow` and passes it a delete handler
as an **inline arrow function created fresh on every render**:
`onDelete={() => handleDelete(row.id)}`. `ExpenseRow` is wrapped in
`React.memo`, which should stop unrelated re-renders — but it doesn't,
because that inline function is a new reference every time, so `memo`'s
prop comparison always sees "changed props."

Don't just wrap the arrow in `useCallback` and move on. First explain: what
is `React.memo` actually comparing, and why does a new function reference
count as "different props" even though the function *does the same thing*
every time? Then fix it — the delete handler needs a stable identity
across renders (hint: `useCallback` with the right dependency array, or
restructure so `ExpenseRow` calls `onDelete(id)` with its own id rather
than the parent closing over it). Verify by adding a console log inside
`ExpenseRow` and confirming it only logs for the row that actually
changed.

This is `react.use-callback` + `react.rerender-optimization` together, and
it's the same closure-identity reasoning as Milestone 1's delete-button
bug (`js.scope-and-closures`) — transferred into a new context. That
transfer is the point.

## Verification

- **Implementation:** componentized app runs; add/edit/delete/totals/sync
  all work identically to Milestone 1's behavior, now through React.
- **Reasoning:** answer all four questions above from understanding, not
  guessing — check against the concept pages only afterward.
- **Debugging:** fixed the `ExpenseRow` re-render bug and can explain
  reference-equality in `React.memo` without re-reading a tutorial.
- **Transfer:** explain, out loud, how Milestone 1's `var`-in-loop bug and
  this milestone's inline-arrow-prop bug are "the same bug" underneath.
