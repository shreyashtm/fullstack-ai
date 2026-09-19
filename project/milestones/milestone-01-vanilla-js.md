# Milestone 1 — Vanilla JS Expense Tracker

Guidance level: **Guided** (architecture + file boundaries given, you write the logic).

## Objective

Build the first working version of the expense tracker: add, edit, delete,
and list expenses; see a running total per category; persist across page
reloads; simulate an async "cloud sync." No framework yet — plain
JavaScript + DOM, split into ES modules.

## Concepts Practiced

All from `curriculum/module-01-javascript.md`:

- `js.variables-values` (Reason)
- `js.functions` (Reason)
- `js.arrays` (Use)
- `js.objects` (Use)
- `js.scope-and-closures` (Reason)
- `js.destructuring` (Use)
- `js.spread-rest` (Use)
- `js.modules` (Understand)
- `js.promises` (Reason)
- `js.async-await` (Reason)
- `js.event-loop` (Reason)
- `js.error-handling` (Use)
- `js.es6-overview` (Understand) — implicitly, by using `let`/`const`,
  arrow functions, template literals, and destructured imports throughout
  instead of the ES5 equivalents.

If you don't remember the precise definition or mental model for any of
these, go read the concept in `curriculum/module-01-javascript.md` first.
This doc will not re-explain them.

## Previously Learned

None — this is Milestone 1, first concepts of the whole curriculum.

## New Concepts

None introduced by this milestone. It's pure application of Module 1.

## Requirements

The app must:

1. Let the user add an expense (amount, category, note, date).
2. Let the user edit and delete an existing expense.
3. Render the current list of expenses.
4. Show a running total **per category**.
5. Persist expenses across a page reload (no backend yet — `localStorage`).
6. Simulate a "cloud sync" for each expense: an async operation that takes
   ~500ms and can fail ~20% of the time, with the UI logging when the sync
   starts, when it finishes (or fails), and continuing to work while it's
   pending (the UI must not freeze/block waiting for it).

## Constraints

- No framework, no build tool, no bundler. Open `index.html` directly in a
  browser (or serve it statically) — native ES modules only
  (`<script type="module">`, `import`/`export`).
- No mutating array/object updates for state changes — every state change
  must produce a new array/object (`spread`/`rest`), not `.push()`/direct
  property assignment on existing state. This is deliberate: it's the same
  discipline React's reconciliation will require in Milestone 2 — you're
  practicing it before you're forced to.
- `localStorage` reads/writes and `JSON.parse` must be wrapped so a
  corrupted/missing value doesn't crash the app on load.
- The category totals must be computed via a **closure-based** tracker
  (a factory function returning functions that share private state), not a
  plain object recomputed from scratch each time — see `src/totals.js`.

## Architecture

```
project/app/milestone-01-vanilla-js/
  index.html          <- shell, mounts the app, loads main.js as a module
  src/
    state.js           <- in-memory expense list + CRUD (arrays/objects/destructuring/spread-rest)
    storage.js          <- localStorage load/save (error-handling)
    sync.js              <- simulated async cloud sync (promises/async-await/event-loop)
    totals.js            <- closure-based per-category totals (scope-and-closures/functions)
    ui.js                  <- DOM rendering + event wiring
    main.js                  <- imports + wires everything together (modules)
```

Data flows one direction: user action (DOM event in `ui.js`) → state change
(`state.js`) → persist (`storage.js`) + sync (`sync.js`) → re-render
(`ui.js`). `totals.js` derives from `state.js`, never owns its own copy of
the expense list.

## Implementation Task

Every file under `project/app/milestone-01-vanilla-js/src/` is stubbed with
function signatures, JSDoc comments, and `// TODO` markers naming the
concept each function should exercise. Fill them in. **One file,
`ui.js`, has one function already implemented on purpose — see Debugging
Challenge below, don't "fix" it until you've reasoned about it.**

Suggested order: `state.js` → `storage.js` → `totals.js` → `sync.js` →
`ui.js` → `main.js`.

## Reasoning Questions

Answer these in your own words (out loud or written — don't skip because
they feel obvious):

1. Why does the constraint above forbid `expenses.push(newExpense)` in
   favor of `[...expenses, newExpense]`? What would actually break later
   (Milestone 2) if you mutated the array in place, and why doesn't it
   break *this* milestone's UI?
2. `totals.js` is required to use a closure factory instead of a plain
   object recomputed on every render. What does the closure actually keep
   private that a plain module-level object wouldn't? What real bug does
   this design decision avoid?
3. In `sync.js`, if you forget the `await` before calling the sync
   function, what actually happens — does the app crash, silently misbehave,
   or something else? Walk through the event loop: when does your
   "sync started" log run relative to the rest of `main.js` finishing?
4. `storage.js` wraps `JSON.parse` in a try/catch. Construct a concrete
   scenario (not "corrupted data" in the abstract — an actual sequence of
   user/browser actions) where that catch block is the only thing standing
   between a working app and a crash on load.

## Debugging Challenge

`ui.js`'s expense-list renderer wires a delete button to each rendered
expense row **inside a loop**, and it's already implemented — using `var`
for the loop index instead of `let`, and reading that index inside the
button's click handler. Every delete button will delete the *last*
expense in the list, regardless of which one you click.

Task: don't just change `var` to `let` and move on. Explain *first* —
before you touch the code — why this bug happens: what does each button's
click handler actually close over, and why do all the handlers end up
sharing the same value? Then fix it, and verify by adding three expenses
and confirming each delete button removes the correct one.

This is `js.scope-and-closures` at Reason depth, applied directly — the
same bug class the curriculum's chain-1 (`chain-1-closures-to-stale-state.md`)
exists to prevent you from carrying into React's `useEffect`/`useCallback`
in Milestone 2.

## Verification

- **Implementation:** app runs from `index.html` with no console errors;
  add/edit/delete/list all work; category totals are correct after several
  adds/edits/deletes; refreshing the page preserves the expense list;
  sync-started/sync-finished(or failed) logs appear for every add without
  blocking the UI.
- **Reasoning:** answer all four Reasoning Questions above without looking
  up the concept first — then check yourself against the concept page if
  unsure.
- **Debugging:** fixed the delete-button bug, and can explain the closure
  mechanism that caused it without re-reading a tutorial.
- **Transfer:** given a *different* small loop-with-closures snippet (ask
  for one if you want it), correctly predict its output before running it.
