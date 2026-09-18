# Curriculum Notebook — viewer app

A local Vite + React app that renders the 103-concept curriculum in
[`../curriculum/`](../curriculum/) as a browsable, searchable notebook.
Not a template — this is the actual, finished viewer for this project's
content.

## Running it

```bash
npm install
npm run dev
```

`npm run dev` first regenerates the content data (`npm run build-content`)
and then starts Vite, so it always reflects whatever is currently on disk
in `../curriculum/`. There's no separate "sync" step to remember.

`npm run build` does the same content regeneration, then a production
build to `dist/`. It succeeds today with one non-blocking warning
(`some chunks are larger than 500 kB`) — the whole curriculum's ~103
concepts' worth of text is bundled into one JS chunk via
`src/content/curriculum.json`. That's fine for a local tool read by one
person; if this were ever deployed for real traffic, the fix is loading
`curriculum.json` at runtime (`fetch`) instead of importing it at build
time, or code-splitting by module — neither has been done, since neither
was needed for the actual use case here.

## How content gets in

```
../curriculum/*.md  →  scripts/build-content.mjs  →  src/content/curriculum.json  →  App.jsx
```

`scripts/build-content.mjs` does two passes:

1. Parses `../curriculum/02-curriculum-model.md`'s module tables to build
   the **full 103-concept skeleton** — every concept's id, title, target
   depth, module, and prerequisite, whether or not its full content has
   been written yet.
2. Parses every `../curriculum/module-*.md` and `chain-*.md` file for
   **full concept content** (every `##`-level heading is one concept;
   every `###`-level heading inside it is one section), and fills in the
   skeleton entry for each concept id it finds — module files are
   processed before chain files, so a concept reproduced in both (see
   `curriculum/README.md`) takes its canonical copy from the module file.

The result is one JSON file with every concept's metadata, plus full
content where it exists and `null` where it doesn't. `App.jsx` renders a
concept's Markdown sections with `react-markdown` + `remark-gfm` (code
blocks, tables, bold/italic all work); a concept with no content yet
renders a "not yet authored" placeholder card instead — though at
present every one of the 103 concepts has content, so that placeholder
path is currently unreachable in practice, not dead code to remove.

### A real gotcha, if this ever breaks again

The concept-id regex in `build-content.mjs` was originally lowercase-only
and silently dropped every concept in a module whose code has a capital
letter (`revA`, `revB` specifically) — they showed up correctly in the
skeleton (from the table parse) but as permanently "not yet authored"
(the content parse skipped them). Fixed to accept mixed case. **If a
future module's concepts show `written: false` in the app despite the
Markdown file clearly existing and being well-formed, check this regex
first** before assuming the content itself is broken.

## What this app is not

- No AI Teacher, no learner state, no backend, no persistence of any
  kind — it's a static-content viewer. See the root
  [`../README.md`](../README.md#status-and-honest-limitations) for the
  full, honest list of what's out of scope.
- No design system was attached; the visual language (Ivory/Slate/Clay
  palette, Source Serif 4 + IBM Plex Sans/Mono) was chosen fresh for this
  project and matches the standalone Design-canvas mockup built earlier
  in this project's history.

## Theming

Light/dark mode is a real toggle (top-right of the sidebar header), not
just a system-preference media query — though system preference *is*
what picks the default the first time, via `prefers-color-scheme`. Once
toggled, the choice is stored in `localStorage` and wins over system
preference on every later visit. All color is defined as CSS custom
properties in `src/index.css` (`:root` for light, a
`prefers-color-scheme: dark` block and a `[data-theme="dark"]` override
for dark); `App.css` and the depth-pill colors in `App.jsx` all reference
those variables rather than hardcoded hex, so a future third theme (or a
palette change) is a `src/index.css`-only edit.

## Stack

Vite, React 19, `react-markdown` + `remark-gfm` for content rendering,
plain CSS (`App.css`) — no CSS framework, no component library, no state
management library (the app's only state is "which concept is selected,"
"search text," "only-show-authored," all plain `useState` in `App.jsx`).
