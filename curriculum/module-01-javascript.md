# Module 1 — JavaScript (`js.*`)

Full concept content for all 13 concepts in `02-curriculum-model.md`'s
JavaScript module, in curriculum order. Two of these were already
authored elsewhere in this project and are reproduced here verbatim (not
re-derived) so the module reads as one continuous document — see the note
at each: `js.variables-values` (from an earlier Design-canvas mockup
built for this project — not part of this repository) and
`js.scope-and-closures` (from `chain-1-closures-to-stale-state.md`, where
it also anchors the closures→React→stale-state cross-technology chain —
if either is edited later, edit both copies together).

---

## js.es6-overview — What ES6+ changed (survey)

**Target depth:** Understand

### What Is It?

ES6 (ECMAScript 2015) and the yearly releases since are the modern
versions of JavaScript's language specification — "ES6+" is shorthand for
"JavaScript written using the modern syntax and features introduced from
2015 onward," as opposed to the older ES5 style.

### Mental Model

Think of ES5 vs. ES6+ as two dialects of the same language — same
underlying engine, but ES6+ adds shorter, safer, more expressive ways to
write things that were clunky or error-prone before: block-scoped
variables, arrow functions, template literals, classes, modules,
destructuring, promises.

**ES6+ isn't a different language — it's the same JavaScript with better
syntax and safer defaults, and it's what virtually all modern code
(React, Next.js, FastAPI-adjacent tooling) is written in.**

### How It Works

The short before/after list this whole module fills in one concept at a
time:

- `var` → `let`/`const` (block scope instead of function scope)
- function expressions → arrow functions (`=>`)
- string concatenation → template literals (`` `Hello ${name}` ``)
- manual prototype chains → class syntax
- callback pyramids → Promises → async/await
- separate `<script>` globals → modules (`import`/`export`)

### Important Distinctions

- ES6+ ≠ a new runtime — it still runs on the same JS engines.
- "ES6+" ≠ any single version — it's shorthand for "the modern feature
  set," since new features ship yearly (ES2016, ES2017...) and the
  umbrella term stuck.

### Why Does It Exist?

ES5-era JavaScript had well-known pitfalls (function-scoped `var`, no
native modules, verbose prototypal inheritance) that caused real bugs at
scale; ES6+ was a coordinated overhaul to fix the language's rough edges
without breaking backward compatibility.

### Connections

- **Enables:** every other concept in this module — `js.variables-values`
  (`let`/`const`), `js.functions` (arrow functions), `js.destructuring`,
  `js.spread-rest`, `js.modules`, `js.promises`/`js.async-await` all *are*
  ES6+ features, covered as their own concepts because each has a
  distinct mental model worth its own depth.

### Production Appearance

Any modern JS/TS/React/Next.js codebase is written almost entirely in
ES6+ syntax; seeing raw `var` in a real 2026 codebase is a signal of
either legacy code or a code smell.

### Example

```js
const name = "Ada";
console.log(`Hi ${name}`);
```

Two ES6+ features (`const`, template literals) in one line.

### Practice

Which ES6+ feature would replace this ES5 pattern —

```js
var self = this;
setTimeout(function() { self.doThing(); }, 100);
```

*(An arrow function — `setTimeout(() => this.doThing(), 100)` — since
arrow functions don't rebind `this`, there's no need for the `var self =
this` workaround. See `js.functions` for why.)*

---

## js.variables-values — Variables & Values

**Target depth:** Reason

*(Reproduced from the Design-canvas mockup — content unchanged.)*

### What Is It?

A variable is a named binding that lets a program refer to a value. In
JavaScript, `let` and `const` create these bindings; whatever you write
on the right of `=` becomes the value the name now points at.

### Mental Model

Think of a variable as a labeled box. `let` gives you a box you can open,
empty out, and refill as many times as you like. `const` nails the label
down permanently — you can't point that label at a different box later
(though if the box holds an object or array, you can still rearrange
what's *inside* that box).

**A variable is a named box — assignment replaces what's inside it, and
never leaves the old value sitting alongside the new one.**

### How It Works

```js
let total = 10;
total = total + 5;
total = total * 2;
console.log(total);
```

Same box, new contents each time: `let total = 10` → box holds `10` →
`total = total + 5` → box holds `15` → `total = total * 2` → box holds
`30`. `=` means "store the thing on the right into the box named on the
left," evaluated once, right-hand side first. `total = total + 5` reads
the current contents (10), computes 15, then overwrites the box — it
never keeps 10 around anywhere. `let` and `const` reserve a slot in
memory and bind a name to it; `const` only forbids re-pointing that name.

### Important Distinctions

- `assignment (=)` ≠ `equality (===)` — one stores a value, the other
  compares two.
- **reassignment** ≠ **mutation** — `total = 15` points the name at a new
  value; `arr.push(x)` changes the contents of the box without ever
  reassigning the name (see `js.arrays`).
- **binding** ≠ **value** — `const` locks the name-to-box binding, not
  the value inside the box.

### Why Does It Exist?

A program that can't remember anything between one line and the next
can't do much. Variables are the mechanism for carrying a value forward —
a running total, a user's name, whether a box is checked — so later
lines can read what an earlier line computed.

### Connections

- **Prerequisite:** `js.es6-overview`.
- **Enables:** `js.scope-and-closures`, `js.arrays`, `js.objects`.
- **Deeper/Deferred cross-technology chain:** `js.scope-and-closures` →
  React callbacks → `useEffect` → stale state — fully authored in
  `chain-1-closures-to-stale-state.md`.

### Production Appearance

Almost every `let`/`const` declaration — a running total in a reducer, a
counter in a loop, component state before you meet `useState`. Inspect:
is this variable ever reassigned elsewhere in the file? If it never is,
should it have been declared with `const` instead of `let`?

### Example

A checkout screen keeps a `total` variable. Each time you tap "add item,"
a line of code re-reads `total`, adds the item's price, and writes the
new sum back into the same variable — the receipt's running total is just
this pattern repeated.

### Trace

| Line | Code | total |
|---|---|---|
| 1 | `let total = 10;` | 10 |
| 2 | `total = total + 5;` | 15 |
| 3 | `total = total * 2;` | 30 |
| 4 | `console.log(total);` | prints 30 |

### Common Misconceptions

- **"const freezes the value."** It doesn't — `const` only stops the name
  from being pointed at a different value; an array or object it holds
  can still be mutated.
- **"Reassigning changes the old value everywhere it was used."** It
  doesn't — other variables that read the old value earlier already got
  their own copy (for numbers/strings); nothing downstream retroactively
  changes.

### Practice

Predict the output:

```js
let price = 8;
price = price + 2;
price = price * 3;
console.log(price);
```

*(Answer: 30 — evaluated in order, right-hand side using the box's
current contents each line. A common wrong answer is 26, from treating
the lines like simultaneous math — `(8+2)` then separately `8*3` — instead
of sequential steps where line 3 multiplies whatever's in the box after
line 2, which is 10.)*

### Code Reading

```js
let x = 1;
const y = x;
x = 2;
console.log(y);
```

What prints, and why doesn't `y` change when `x` does? *(Prints `1` — `y`
got its own independent copy of the number `1` at the moment of
assignment; numbers aren't shared references, so reassigning `x`
afterward has no effect on `y`.)*

### Mastery Check (Reason)

```js
let count = 0;
function increment() { count = count + 1; }
increment();
increment();
console.log(count);
```

What prints — and what would break if `count` had been declared with
`const` instead of `let`? *(Prints 2; with `const`, the first
`increment()` call would throw a `TypeError` for assigning to a constant
variable — `const` forbids rebinding `count`, and `increment` rebinds it
every call.)*

### Deeper / Deferred

How the JS engine actually allocates and garbage-collects a binding's
memory — named here, not needed at this depth.

---

## js.functions — Functions as values

**Target depth:** Reason

### What Is It?

A function is a reusable, callable block of code that can take inputs
(parameters) and produce an output (a return value); in JavaScript,
functions are also values — they can be stored in variables, passed as
arguments, and returned from other functions.

### Mental Model

Think of a function as a small machine: you feed it parameters, it runs
its internal steps, and it hands back a return value — and because it's
also a value, you can put that machine in a box (a variable), mail it
somewhere (pass it as an argument), or have another machine build and
hand you a new machine (return it).

**A function is a value like any other — the fact that JavaScript lets
you pass functions around like numbers or strings is what makes
closures, callbacks, and Hooks possible.**

### How It Works

Three ways to write the same function:

```js
function add(a, b) { return a + b; }             // declaration
const add2 = function(a, b) { return a + b; };    // expression
const add3 = (a, b) => a + b;                     // arrow function
```

All three are callable the same way (`add(2, 3)`), but they differ in
hoisting (declarations are usable before their line in the file;
expressions are not) and in how they handle `this` — arrow functions
don't have their own `this`; they use the surrounding scope's, which
matters heavily once event handlers or class methods enter the picture.

### Important Distinctions

- A function declaration ≠ a function expression — only the declaration
  is hoisted (usable before its definition line).
- An arrow function ≠ a regular function in how `this` behaves — arrow
  functions never have their own `this`, they inherit it from the
  enclosing scope; ordinary functions get their own `this`, determined by
  *how they're called*.

### Why Does It Exist?

Without functions being first-class values, none of "pass a callback,"
"return a function from a function" (closures), or "store an event
handler in a variable" would be possible — treating functions as ordinary
values is what makes JavaScript's callback- and Hook-heavy style workable
at all.

### Connections

- **Enables (BLOCKING forward):** `js.scope-and-closures` — closures only
  make sense once you know functions are values that can be returned and
  still hold onto their scope. Also enables `react.fundamentals`
  (components are functions) and every React Hooks concept.

### Production Appearance

Every event handler, every array method callback (`.map(x => ...)`),
every React component is a function value being passed or defined
inline.

### Example

`array.map(function(x) { return x * 2; })` and `array.map(x => x * 2)`
are the same operation — the function is a value passed as `.map`'s
argument.

### Trace

```js
function greet(name) { return "Hi " + name; }
const fn = greet;
console.log(fn("Ada"));
```

| Step | What happens |
|---|---|
| `function greet(...)` | creates a function value, binds the name `greet` to it |
| `const fn = greet;` | copies the *reference* to that same function value into `fn` |
| `fn("Ada")` | calls the function value via the `fn` reference — identical to calling `greet("Ada")` |

### Common Misconceptions

**"Arrow functions are just shorter syntax with no real behavior
difference."** The `this`-binding difference is a real, frequently
bug-causing distinction, not cosmetic.

### Practice

Predict the output:

```js
const obj = {
  value: 42,
  regular: function() { return this.value; },
  arrow: () => this.value,
};
console.log(obj.regular(), obj.arrow());
```

*(Answer: `42 undefined` — `regular` gets `this` = `obj` because it's
called as `obj.regular()`; `arrow` ignores that entirely and uses `this`
from the surrounding module/global scope, where `value` doesn't exist.)*

### Code Reading

```js
button.addEventListener("click", () => { console.log(this); });
```

vs.

```js
button.addEventListener("click", function() { console.log(this); });
```

What does `this` refer to in each, inside a click handler? *(Arrow:
whatever `this` was in the surrounding code where the listener was
written, not the button. Regular function: the `button` element itself,
because that's how `addEventListener` calls it.)*

### Mastery Check (Reason)

A teammate refactors a regular `function` event handler that used
`this.state` into an arrow function, and it breaks. Using what you know
about `this` binding, explain what likely broke and why.

### Deeper / Deferred

The full algorithm JavaScript uses to determine `this` for a regular
function call (implicit/explicit/`new`/default binding rules) — named,
not required at this depth.

---

## js.arrays — Arrays

**Target depth:** Use

### What Is It?

An array is an ordered, indexed collection of values — accessed by a
numeric position starting at 0, and able to grow or shrink.

### Mental Model

Think of an array as a numbered row of lockers — locker 0, locker 1,
locker 2 — each holding one value, and you can look inside, replace, add,
or remove lockers by position.

**An array is a value's position within an ordered list — everything you
do to it (read, add, remove, transform) is expressed in terms of that
position or a whole-array operation.**

### How It Works

```js
const nums = [1, 2, 3];
nums.push(4);          // [1, 2, 3, 4]
nums[0];                // 1
nums.map(n => n * 2);   // [2, 4, 6, 8] -- new array, nums unchanged
```

Methods like `.push`, `.pop`, `.splice` mutate the array in place;
methods like `.map`, `.filter`, `.slice` return a brand-new array and
leave the original untouched.

### Important Distinctions

- Mutating methods (`.push`, `.pop`, `.sort`, `.splice`) ≠ non-mutating
  methods (`.map`, `.filter`, `.slice`, `.concat`) — this distinction
  matters enormously in React, where mutating an array in place doesn't
  trigger a re-render (the reference didn't change) even though the
  contents did.
- An array declared with `const` ≠ frozen — `const arr = [1]; arr.push(2);`
  is legal; `const` only stops `arr` from being reassigned to a different
  array (`js.variables-values`).

### Why Does It Exist?

Programs constantly work with ordered collections — a list of items,
search results, a to-do list — and need a built-in way to represent "many
values, in order" without manually managing a chain of linked boxes.

### Connections

- **Prerequisite:** `js.variables-values` — the binding≠value distinction
  directly explains why mutating methods are risky.
- **Enables:** React's list-rendering pattern (`.map()` over an array is
  how React renders lists, `react.conditional-rendering`).

### Production Appearance

Rendering a list of items in React (`items.map(item => <li>{item.name}</li>)`)
is by far the most common place arrays and their non-mutating methods
appear together.

### Example

```js
const cart = [{ name: "Book", price: 12 }];
const total = cart.reduce((sum, item) => sum + item.price, 0);
```

`.reduce` collapses an array into a single value.

### Practice

```js
const a = [1, 2, 3];
const b = a;
b.push(4);
console.log(a);
```

What prints, and why? *(`[1, 2, 3, 4]` — `b` is a reference to the same
array as `a`, not a copy; `.push` mutates the shared array.)*

### Code Reading

```js
const doubled = nums.map(n => n * 2);
nums.push(99);
console.log(doubled);
```

Does `doubled` include 99? *(No — `.map` already ran and produced an
independent new array before `.push` happened; `doubled` and `nums` are
separate arrays after that point.)*

---

## js.objects — Objects

**Target depth:** Use

### What Is It?

An object is an unordered collection of key-value pairs — a way to group
related data under named properties.

### Mental Model

Think of an object as a labeled folder with named tabs — each tab (key)
holds one piece of paper (value), and you access a piece of paper by its
tab's name, not by position.

**An object groups related values under names; a variable holding an
object holds a reference to that folder, not a copy of its contents.**

### How It Works

```js
const user = { name: "Ada", age: 30 };
user.age;                 // 30
user.age = 31;            // mutates the object in place
user.email = "a@x.com";   // adds a new property
```

Dot notation (`user.age`) and bracket notation (`user["age"]`) both
read/write properties; bracket notation is required when the key is
dynamic (`user[someVariable]`).

### Important Distinctions

- Reading a property that doesn't exist ≠ an error — it returns
  `undefined`, silently.
- An object declared with `const` ≠ frozen (same as arrays) — properties
  can still be added, changed, or deleted; only reassigning the variable
  itself is blocked.
- Object equality with `===` compares *reference*, not contents — two
  objects with identical keys/values are still `!==` unless it's the
  literal same object.

### Why Does It Exist?

Related pieces of data (a user's name, age, email) are more meaningful
grouped under one named structure than as separate, disconnected
variables that have to be manually kept in sync.

### Connections

- **Prerequisite:** `js.variables-values` — binding≠value and
  mutation≠reassignment both apply directly to objects.
- **Enables:** `js.destructuring`, `react.props` (props are literally an
  object passed to a component), `fastapi.request-response-models` (JSON
  request/response bodies parse into object-shaped data on both ends).

### Production Appearance

Nearly every function that returns "a thing with multiple fields" returns
an object — API responses, component props, configuration values.

### Example

```js
function makeUser(name, age) {
  return { name, age, isAdult: age >= 18 };
}
```

Shorthand property syntax (`{ name, age }`) when the key name matches an
existing variable name.

### Practice

```js
const a = { x: 1 };
const b = { x: 1 };
console.log(a === b);
```

What prints, and why? *(`false` — two separate objects with the same
contents are still different references.)*

### Code Reading

```js
const settings = { theme: "dark" };
function apply(s) { s.theme = "light"; }
apply(settings);
console.log(settings.theme);
```

What prints? *(`"light"` — `s` inside `apply` is a reference to the same
object as `settings`; mutating `s.theme` mutates the shared object.)*

---

## js.destructuring — Destructuring

**Target depth:** Use

### What Is It?

Destructuring is syntax for unpacking values out of arrays or objects
into individual named variables in one step, instead of accessing each
one separately.

### Mental Model

Think of destructuring as unpacking a delivery box directly into labeled
shelf slots as you open it, instead of reaching back into the box one
item at a time every time you need something.

**Destructuring doesn't change what's in the array/object — it's a
shorthand for pulling several named or positioned values out of it at
once.**

### How It Works

```js
const user = { name: "Ada", age: 30 };
const { name, age } = user;   // name="Ada", age=30

const nums = [1, 2, 3];
const [first, second] = nums; // first=1, second=2
```

Object destructuring matches by key name; array destructuring matches by
position.

### Important Distinctions

- Object destructuring (`{ name }`) ≠ array destructuring (`[first]`) in
  matching rule — one is by name, the other by position.
- Destructuring with a default (`const { role = "guest" } = user;`) ≠ an
  error when the key is missing — it falls back to the default instead of
  `undefined`.

### Why Does It Exist?

Without it, pulling several fields out of an object or array required
repetitive, verbose lines (`const name = user.name; const age =
user.age;`); destructuring collapses that into one expressive line, and
is especially common for function parameters.

### Connections

- **Prerequisite:** `js.objects`, `js.arrays`.
- **Enables:** `react.props` — component signatures are almost always
  written as `function Card({ title, price })`, destructuring props
  directly in the parameter list.

### Production Appearance

Nearly every React functional component's parameter list destructures
its props; API response handling commonly destructures the fields
actually needed out of a larger response object.

### Example

```jsx
function Card({ title, price }) {
  return <div>{title}: ${price}</div>;
}
```

Destructures `title` and `price` straight out of the props object.

### Practice

Given `const response = { data: { id: 1, name: "Ada" }, status: 200 };`,
write one destructuring line that pulls out `name` and `status` directly.
*(`const { data: { name }, status } = response;`)*

---

## js.spread-rest — Spread / rest

**Target depth:** Use

### What Is It?

The spread operator (`...`) expands an array or object's
elements/properties into a new array, object, or argument list; the rest
operator (also `...`, used in a different position) collects multiple
remaining items into a single array or object.

### Mental Model

Spread is "pour the contents out"; rest is "sweep the leftovers into one
pile" — same three-dot symbol, opposite direction, and which one it is
depends on where it appears: an expression being *built*, versus a
parameter/destructuring pattern *receiving*.

**Spread unpacks a collection into individual pieces; rest gathers
individual pieces back into a collection — same syntax, read in the
direction it's used.**

### How It Works

```js
const a = [1, 2];
const b = [...a, 3];          // spread: [1, 2, 3] -- new array, a unchanged

const original = { x: 1 };
const copy = { ...original, y: 2 }; // spread: { x: 1, y: 2 } -- new object

function sum(...nums) {        // rest: gathers all args into one array
  return nums.reduce((s, n) => s + n, 0);
}
sum(1, 2, 3); // 6
```

### Important Distinctions

- Spread on an object/array ≠ a deep copy — it copies one level of
  keys/values; a nested object inside is still shared by reference
  between the original and the copy.
- Spread (building a new collection) ≠ rest (receiving into a
  collection) — same three dots, opposite roles, distinguished by
  position.

### Why Does It Exist?

Before spread, copying an array/object or merging two of them required
manual loops or utility functions; spread makes "copy this, then change
one field" — the exact non-mutating-update pattern React relies on for
state — a one-line, readable expression.

### Connections

- **Prerequisite:** `js.arrays`, `js.objects`.
- **Enables:** `react.use-state` — updating state immutably is almost
  always written as `setUser({ ...user, name: newName })`, spreading the
  old state into a new object with one field changed.

### Production Appearance

Any React state update that changes one field of an object or adds one
item to an array without mutating the original — `setItems([...items,
newItem])` — uses spread specifically because React detects updates by
reference change, not by inspecting contents.

### Example

```js
const updated = { ...user, age: user.age + 1 };
```

Creates a new object identical to `user` except `age`, without mutating
`user` itself.

### Practice

```js
const state = { count: 0, name: "x" };
const next = { ...state, count: state.count + 1 };
```

Does this mutate `state`? *(No — `{...state}` copies its keys into a
brand-new object; `state` itself is untouched, which is exactly why this
pattern is safe to use for React state updates.)*

### Code Reading

```js
function merge(...objects) {
  return Object.assign({}, ...objects);
}
```

What does `...objects` do in the parameter list versus inside the call to
`Object.assign`? *(In the parameter list it's rest — gathers all
arguments into one array called `objects`. Inside the call it's spread —
expands that array back out into individual arguments for
`Object.assign`.)*

---

## js.modules — Modules (import/export)

**Target depth:** Understand

### What Is It?

A module is a single JavaScript file with its own private scope, which
explicitly exports the values/functions it wants to share and imports
what it needs from other files.

### Mental Model

Think of each file as a sealed room — nothing inside is visible from
outside unless you explicitly put it through the "export" door; other
rooms can only see what you exported, and only if they explicitly
"import" it.

**Modules give every file its own private scope by default — nothing
leaks between files unless it's explicitly exported and imported.**

### How It Works

```js
// math.js
export function add(a, b) { return a + b; }
export const PI = 3.14159;

// app.js
import { add, PI } from "./math.js";
add(2, 3); // 5
```

`export` marks a value as shareable; `import` pulls specific named
exports (or a `default` export) into the importing file's own scope.

### Important Distinctions

- A module's top-level variables ≠ globally visible — unlike old-style
  scripts where every `<script>` tag shared one global scope, each module
  file has its own scope.
- A named export (`export function add`) ≠ a default export (`export
  default function`) — a file can have many named exports but at most
  one default, imported with different syntax (`import { add }` vs.
  `import add from`).

### Why Does It Exist?

Before modules, every script sharing one global scope meant naming
collisions and unclear dependencies between files (any file could
silently depend on or clobber any global). Modules make each file's
dependencies explicit and its internals private by default.

### Connections

- **Prerequisite:** `js.functions`, `js.objects` (anything can be
  exported).
- **Enables:** organizing any non-trivial React/Next.js/FastAPI
  codebase — `fastapi.project-structure` and `next.fundamentals`'s
  file-based organization both rely on the same module-per-file idea
  (Python's import system is the analogous backend-side mechanism).

### Production Appearance

Every `import ... from ...` line at the top of a React, Next.js, or
modern JS file; recognizing what a file actually exports (and therefore
what other files can use from it) is a core codebase-reading skill.

### Example

`import { useState } from "react";` imports the named export `useState`
from React's own module.

### Practice

`utils.js` has `export default function formatDate(d) { ... }` — what's
the correct way to import it elsewhere, and how does that differ from
importing a named export? *(`import formatDate from "./utils.js";` — no
curly braces, and the imported name can be anything you choose, unlike a
named import which must match the exported name unless explicitly
renamed with `as`.)*

---

## js.promises — Promises

**Target depth:** Reason

### What Is It?

A Promise is an object representing a value that isn't available yet but
will be at some point — it starts in a *pending* state and eventually
settles as either *fulfilled* (with a value) or *rejected* (with an
error).

### Mental Model

Think of a Promise as a claim ticket handed to you immediately when you
order something that takes time — you don't have the item yet, but you
have a ticket you can attach "when it's ready, do this" and "if it fails,
do this" instructions to.

**A Promise is a placeholder for a future value — code that needs that
value attaches callbacks to the promise instead of blocking and waiting
for it.**

### How It Works

```js
function fetchUser(id) {
  return fetch(`/api/users/${id}`).then(res => res.json());
}
fetchUser(42)
  .then(user => console.log(user))
  .catch(err => console.error(err));
```

`fetch` returns a Promise immediately (pending); `.then` registers what
to do once it fulfills; `.catch` registers what to do if it rejects.
Promises can be chained because `.then` itself returns a new Promise.

### Important Distinctions

- A Promise ≠ the value itself — it's a wrapper around a value that will
  exist later; calling a function that returns a Promise ≠ getting the
  result synchronously — the code after it keeps running immediately,
  before the promise settles (the entire reason `js.event-loop` exists).
- A rejected Promise with no `.catch` ≠ silently ignored — it produces an
  "unhandled promise rejection," a real class of bug.

### Why Does It Exist?

Before Promises, asynchronous operations (network requests, timers, file
reads) used raw callbacks passed directly to the async function, which
nested deeply and made error handling and sequencing painful ("callback
hell"). Promises give async operations a consistent, chainable,
composable shape.

### Connections

- **Prerequisite (BLOCKING):** `js.scope-and-closures` (the `.then`
  callback is itself a closure), `js.functions`.
- **Enables:** `js.async-await` (syntax sugar over promises),
  `js.event-loop` (explains *when* a promise's callback actually runs),
  `react.api-calls`. Cross-technology — `fastapi.async-endpoints` mirrors
  this same idea in Python.

### Production Appearance

Any `fetch()` call, any `.then()`/`.catch()` chain, and the object every
`async function` implicitly returns.

### Example

```js
Promise.all([fetchUser(1), fetchUser(2)]).then(([a, b]) => console.log(a, b));
```

Runs two requests concurrently and waits for both.

### Trace

```js
console.log("A");
fetchUser(1).then(user => console.log("B", user));
console.log("C");
```

| Order printed | Why |
|---|---|
| A | runs synchronously, first line |
| C | runs synchronously, before the promise settles — the `.then` callback is deferred |
| B, user | runs later, once the promise fulfills (see `js.event-loop` for exactly when) |

### Common Misconceptions

**"`.then()` runs immediately when the Promise is created."** It doesn't —
it runs only once the promise settles, which is always *after* the
currently executing synchronous code finishes (see the trace above: "C"
prints before "B").

### Practice

Given the trace above, what's the actual printed order, and why does "C"
print before the fetched user? *(A, C, then B — the `.then` callback can
only run after the current synchronous block finishes, no matter how
fast the promise settles.)*

### Code Reading

```js
fetchUser(1)
  .then(user => fetchPosts(user.id))
  .then(posts => console.log(posts));
```

What does returning a Promise from inside a `.then` callback do to the
chain? *(The outer chain waits for that returned Promise to settle too
before running the next `.then` — this is how promise chains sequence
dependent async steps instead of nesting callbacks.)*

### Mastery Check (Reason)

Explain why `fetchUser(1).then(user => console.log(user)); console.log("done");`
prints "done" before the user data, using what you know about promises
never resolving synchronously.

### Deeper / Deferred

The microtask queue specifically (as distinct from the macrotask queue
timers use) — named here, formalized in `js.event-loop`.

---

## js.async-await — Async/await

**Target depth:** Reason

### What Is It?

`async`/`await` is syntax that lets asynchronous, Promise-based code be
written and read like sequential, synchronous code, while still being
non-blocking underneath.

### Mental Model

`await` is a pause button placed only inside an `async` function — "pause
this function right here until the promise settles, but let everything
else in the program keep running while you wait."

**async/await doesn't replace Promises — it's a more readable way to
write promise-based code that still runs the same way underneath.**

### How It Works

```js
async function loadUser(id) {
  const res = await fetch(`/api/users/${id}`);
  const user = await res.json();
  return user;
}
```

An `async function` always returns a Promise. `await` pauses execution
*within that function* until the awaited Promise settles, then resumes
with its value — but it never blocks the rest of the program; other code
keeps running during the pause.

### Important Distinctions

- `await` ≠ usable outside an `async function` (top-level `await` has
  narrow, specific support and is the exception, not the rule).
- Pausing an `async` function ≠ pausing the whole program — other code
  (other event handlers, other promises) continues to run during the
  `await`.
- `async function foo() { return 5; }` ≠ returning `5` directly to the
  caller — it returns a Promise that resolves to `5`.

### Why Does It Exist?

`.then()` chains become hard to read once there are several sequential
async steps, especially with conditionals or loops mixed in;
`async`/`await` lets the same sequencing be written as straight-line
code, dramatically easier to follow, while compiling down to the exact
same Promise mechanics.

### Connections

- **Prerequisite (BLOCKING):** `js.promises`.
- **Related:** `js.event-loop` (explains what "the rest of the program
  keeps running" actually means mechanically), `js.error-handling`
  (`try`/`catch` wraps `await` the same way it wraps synchronous code).
- **Cross-technology:** Python's `async`/`await` in
  `fastapi.async-endpoints` is the same concept, different language.

### Production Appearance

Most modern data-fetching code (in a Next.js Server Component, a React
effect, a Node script) is written with `async`/`await` rather than raw
`.then()` chains.

### Example

```js
async function loadDashboard() {
  const user = await fetchUser();
  const orders = await fetchOrders(user.id);
  return { user, orders };
}
```

Reads as a straightforward sequence, even though both steps are
asynchronous.

### Trace

```js
console.log("A");
async function run() {
  console.log("B");
  await Promise.resolve();
  console.log("C");
}
run();
console.log("D");
```

| Printed order | Why |
|---|---|
| A | synchronous, top of file |
| B | `run()` starts executing synchronously until it hits `await` |
| D | `run()` pauses at `await`; the calling code (`console.log("D")`) keeps going |
| C | resumes after the awaited promise settles, once the synchronous code finishes |

### Common Misconceptions

**"`await` blocks the whole program while waiting."** It only pauses the
*current async function's* execution; everything else (the rest of the
call stack, other events) continues — proven directly by "D" printing
before "C" in the trace above.

### Practice

Rewrite `fetchUser(1).then(user => console.log(user))` using
`async`/`await` inside a function called `run`. *(`async function run() {
const user = await fetchUser(1); console.log(user); }`)*

### Code Reading

```js
async function getAll(ids) {
  const results = [];
  for (const id of ids) {
    results.push(await fetchUser(id));
  }
  return results;
}
```

Does this fetch all users concurrently or one at a time? What would
`Promise.all(ids.map(fetchUser))` do differently? *(One at a time — each
`await` in the loop pauses until that fetch finishes before starting the
next. `Promise.all` starts all fetches immediately and waits for all of
them together, which is faster when they don't depend on each other.)*

### Mastery Check (Reason)

Explain why sequential `await`s inside a loop can be a real performance
problem in production code, and describe the fix, using what you know
about promises resolving concurrently versus sequentially.

### Deeper / Deferred

How `async`/`await` desugars to promise chains and generator functions
under the hood — named, not required at this depth.

---

## js.event-loop — Event Loop

**Target depth:** Reason

### What Is It?

The Event Loop is the mechanism that lets JavaScript — a single-threaded
language — handle asynchronous operations (timers, network responses,
promise callbacks) without blocking, by running queued callbacks only
when the current synchronous code has finished.

### Mental Model

Think of JavaScript as one chef (single thread) working through one
recipe (the call stack) at a time; the event loop is the kitchen manager
who holds a stack of order tickets (queued callbacks) and only hands the
chef the next ticket once their hands are completely free — never
interrupting mid-step.

**JavaScript runs one thing at a time; the event loop decides what runs
next once the current synchronous code finishes, by pulling from queues
of waiting callbacks.**

### How It Works

JavaScript has one **call stack** (currently executing code), and
callbacks from finished async operations wait in queues — a **microtask
queue** (Promise `.then`/`await` continuations) and a
**macrotask/callback queue** (`setTimeout`, DOM events). After each piece
of synchronous code finishes and the call stack empties, the event loop
drains the *entire* microtask queue first, then takes one task from the
macrotask queue, then repeats.

```js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
```

Prints `1, 4, 3, 2` — synchronous code first (1, 4), then the microtask
queue (Promise callback, 3) fully drains before the macrotask queue (the
timer callback, 2) gets a turn, even though the timer was scheduled with
`0` delay.

### Important Distinctions

- Microtasks (Promises) ≠ macrotasks (`setTimeout`, events) — microtasks
  always run before the next macrotask, no matter how the delays compare.
- "Single-threaded" ≠ "nothing happens concurrently in a broader sense" —
  the browser/Node runtime itself handles the network wait, the timer
  countdown, etc. outside JavaScript's single thread; only the
  *callback* execution is single-threaded.

### Why Does It Exist?

Browsers and Node need JavaScript to stay responsive (not freeze the page
or block other requests) while waiting on slow operations like network
calls — a single thread that never blocks, deferring "what to do when
it's ready" to a queue, is how that's achieved without multithreading
complexity.

### Connections

- **Prerequisite (BLOCKING):** `js.promises`, `js.async-await`.
- **Enables:** understanding why `fastapi.async-endpoints` behaves the
  way it does — Python's asyncio event loop is the same architectural
  idea, applied server-side — and underlies the sync-vs-async comparison
  in the Backend Fundamentals module.

### Production Appearance

Any bug where "my code ran in the wrong order" or "my `setTimeout(fn, 0)`
didn't run immediately" traces directly back to event loop ordering.

### Trace

Restating the `1, 4, 3, 2` example above as a table:

| Step | Queue involved | What runs |
|---|---|---|
| 1 | call stack | `console.log("1")` |
| 2 | (scheduled) | `setTimeout` callback queued to macrotask queue |
| 3 | (scheduled) | `.then` callback queued to microtask queue |
| 4 | call stack | `console.log("4")` |
| 5 | microtask queue (drained fully) | `console.log("3")` |
| 6 | macrotask queue (one task) | `console.log("2")` |

### Common Misconceptions

**"`setTimeout(fn, 0)` runs immediately."** It doesn't — it still goes
through the macrotask queue, and the *entire* microtask queue always
drains first, so a pending Promise callback will always run before a
zero-delay timeout.

### Practice

Without running it, order the output of:

```js
console.log("start");
Promise.resolve().then(() => console.log("promise"));
setTimeout(() => console.log("timeout"), 0);
console.log("end");
```

*(start, end, promise, timeout.)*

### Mastery Check (Reason)

A React `useEffect`'s cleanup function scheduled via `setTimeout` seems
to run "late" compared to a Promise-based effect. Using the event loop's
two-queue model, explain why microtask-based code will generally appear
to run before macrotask-based code, even with similar-seeming delays.

### Deeper / Deferred

The precise browser rendering/paint timing relative to
microtask/macrotask draining (relevant to `useEffect` vs.
`useLayoutEffect` timing, named back in `chain-1-closures-to-stale-state.md`)
— not required at this depth.

---

## js.error-handling — Error handling

**Target depth:** Use

### What Is It?

Error handling in JavaScript is the set of mechanisms —
`try`/`catch`/`finally` for synchronous and `async`/`await` code,
`.catch()` for promise chains — for detecting and responding to something
going wrong instead of letting the program crash or fail silently.

### Mental Model

Think of `try`/`catch` as a safety net under a specific section of code —
if anything inside `try` throws, execution jumps straight to `catch`
instead of continuing normally, and `finally` always runs regardless of
whether an error happened.

**Throwing an error interrupts normal control flow immediately; catching
it is the only way to keep the program running past that point instead of
crashing.**

### How It Works

```js
try {
  const data = JSON.parse(input);
  console.log(data);
} catch (err) {
  console.error("Invalid JSON:", err.message);
} finally {
  console.log("done attempting parse");
}
```

If `JSON.parse` throws (invalid input), execution jumps to `catch`;
`finally` runs either way. For async code:

```js
async function loadUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    return await res.json();
  } catch (err) {
    console.error("Failed to load user:", err);
    return null;
  }
}
```

### Important Distinctions

- A rejected Promise with no `.catch` (or no surrounding `try` around an
  `await`) ≠ silently ignored — it's an unhandled rejection, a real,
  loggable failure.
- `try`/`catch` around synchronous code ≠ automatically catching errors
  from an unrelated async callback scheduled inside it — wrapping a
  `setTimeout` call in `try`/`catch` does *not* catch an error thrown
  later, inside the timer's callback, because by the time that callback
  runs, the original `try` block has already finished executing.

### Why Does It Exist?

Without structured error handling, one failure (a malformed response, a
network timeout, invalid user input) would either crash the whole program
or fail in a way impossible to detect and respond to gracefully.

### Connections

- **Prerequisite:** `js.functions`, `js.promises` (for the async form).
- **Related:** `fastapi.request-response-models`'s validation errors are
  the backend-side counterpart of the same "something went wrong, handle
  it explicitly" principle.

### Production Appearance

Every network call in production code should have error handling around
it — a `fetch` with no `.catch`/`try` is a real, common bug that surfaces
as an unhandled rejection or a broken UI with no explanation.

### Example

A form submission wraps its API call in `try`/`catch` specifically so a
failed request can show the user an error message instead of leaving the
button stuck or the page silently doing nothing.

### Practice

What happens if `await fetch(...)` inside a `try` block throws because
the network is offline, and there's a `catch` block below it?
*(Execution jumps to `catch`, where the error can be logged and
handled — e.g. showing a "connection failed" message — instead of the
unhandled rejection crashing or silently failing the async function.)*

### Code Reading

```js
try {
  setTimeout(() => { throw new Error("boom"); }, 100);
} catch (err) {
  console.log("caught:", err.message);
}
```

Does `catch` actually catch this error? Why or why not? *(No — by the
time the `setTimeout` callback runs and throws, the surrounding `try`
block has already finished executing; the error becomes an uncaught
exception instead. The fix is to put the `try`/`catch` *inside* the
`setTimeout` callback itself.)*

---

## js.scope-and-closures — Scope & Closures

**Target depth:** Reason

*(Reproduced from `chain-1-closures-to-stale-state.md`, where it also
anchors the closures→React→stale-state cross-technology chain — content
unchanged.)*

### What Is It?

A closure is a function bundled together with references to the
variables from the lexical scope it was defined in — it keeps access to
those variables even after the outer function has returned. Scope is the
set of variables a piece of code can see at a given point, determined by
where the code is written (lexical scope), not where it's called from.

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

- Closure ≠ copy of a value — the function holds a *live reference* to
  the variable's binding, not a snapshot of its value at creation time.
- Scope (where a name is visible) ≠ closure (the mechanism that keeps
  that visibility alive after the outer function returns).
- Each function *call* that creates a new inner function creates a *new*
  closure/backpack — calling `makeCounter()` twice gives two independent
  counters (see Trace).

### Why Does It Exist?

Without closures, a function that returns another function would lose
access to its own local state the moment it returns — there'd be no way
to build private state, factory functions, or callbacks that "remember"
something about when they were created.

### Connections

- **Prerequisite:** `js.functions`.
- **Enables:** `react.use-callback`, `react.use-effect` (their entire
  dependency-array behavior is a closures problem), `js.async-await`
  (callbacks passed to async code capture scope the same way).
- **Deeper/Deferred:** how the JS engine keeps closed-over variables
  alive (heap allocation instead of stack, garbage collection once
  nothing references the closure anymore).

### Production Appearance

Appears anywhere a function is defined inside another and returned or
passed onward — event handlers, `setTimeout` callbacks, and (critically
for the React module) every React Hook that takes a function argument.

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

- **"Closures share one global variable."** They don't — each
  outer-function call creates an independent closure with its own
  backpack (see the trace above: `a` and `b` never interfere).
- **"A closure captures the value at creation time."** It captures the
  *binding*, so if the outer variable changes later (e.g. a loop
  variable), the closure sees the *current* value, not a frozen
  snapshot — this exact issue is why `var` in a loop notoriously breaks
  and `let` fixes it (each loop iteration gets its own `let` binding).

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
*first* value a piece of state had, never the latest — reasoning from
what you know about closures, what's the likely cause, without seeing the
actual code yet?

### Deeper / Deferred

Heap allocation and garbage collection of closed-over variables (named
above, not needed at this depth).
