LLM Evolution — Year‑Anchored Interactive Network

An interactive D3.js visualization of milestone ideas and systems in language modeling and generative AI from 1951 to 2024. Nodes are arranged by year in vertical lanes, connected by different link types to show chronology, same‑category relationships, and bridges across modalities/principles. Hover for details; drag nodes (constrained within their year lane) to explore local structure.

Live site: https://llm-evolution.vercel.app/


Overview

- Data: Embedded in `index.html` as a JSON object of `nodes` and `links`.
- Rendering: D3 v7 force layout anchored on the x‑axis by year; dynamic width enables horizontal scroll across years.
- Interactions:
  - Hover: Rich tooltip with year, venue, category, what/limits/use case, and reference.
  - Drag: Nodes are draggable but clamped to their year lane.
  - Legend: Category colors, plus distinct line styles for chronology, same‑category, and bridge links.


Quickstart (local)

Prerequisites: Node.js (to use the static server). Internet connection is required to load the D3 CDN.

Option A — one‑liner

```bash
npx serve . --listen 3000
```

Then open http://localhost:3000

Option B — via npm scripts

```bash
npm run start
# or
npm run dev
```


Deploying to Vercel

This project is set up for static hosting on Vercel.

1) First‑time deploy (or re‑deploy) from the project directory:

```bash
npx vercel --prod --yes
```

2) Local preview with Vercel Dev:

```bash
npx vercel dev --yes
```

Vercel configuration

- `vercel.json` uses `@vercel/static` to serve `index.html` and rewrites all routes to it.
- `.vercel/` is local metadata created by the Vercel CLI (ignored by Git).


Project structure

- `index.html` — The entire app (markup, styles, data, D3 rendering, interactions).
- `package.json` — Convenience scripts for local static serving.
- `vercel.json` — Static hosting config and route rewrite to `index.html`.
- `.gitignore` — Ignores `.vercel/`.
- `.vercel/` — Local Vercel project metadata (safe to ignore/omit from VCS).


Notes

- If you need offline support, replace the CDN `<script src="https://d3js.org/d3.v7.min.js"></script>` with a local copy of D3.
- No backend, build system, or environment variables are required.


