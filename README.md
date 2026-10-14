# TanStack Start + shadcn/ui

This is a template for a new TanStack Start project with React, TypeScript, and shadcn/ui.

## Projects & Sanity CMS

Case studies are powered by [Sanity](https://www.sanity.io/) with local fallback data when credentials are not configured.

### Setup

1. Copy `.env.example` to `.env.local`
2. Set `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`, and create a write token at [sanity.io/manage](https://www.sanity.io/manage) → API → Tokens (`SANITY_API_WRITE_TOKEN`)

### Edit case studies in Studio

```bash
npm run studio
```

Opens Sanity Studio with all block types: section headings, rich text, metrics, tech stack, collaborators, site map, static images, quotes, and embeds.

### Seed fallback data to Sanity

```bash
npm run seed
```

Pushes projects from `src/lib/sanity/fallback-projects.ts` into your Sanity dataset.

### Capture 100x screenshots

```bash
npm run capture:100x
```

Captures homepage and extended page screenshots from [100x.bot](https://100x.bot/) into `public/projects/100x/`.

### Capture Kodo screenshots

```bash
npm run capture:kodo
```

Captures homepage and marketing section screenshots from [kodo.com](https://www.kodo.com/) into `public/projects/kodo/`.

## Ask AI (OpenRouter / Mistral + RAG)

The hero section includes an **Ask AI** prompt that opens a sheet chat grounded in portfolio content (profile, projects, case studies). LLM calls go through a switchable provider layer — **OpenRouter** (free models) or **Mistral**.

### Setup

1. Copy `.env.example` to `.env.local`
2. Set `OPENROUTER_API_KEY` from [openrouter.ai/keys](https://openrouter.ai/keys) (recommended)
3. Set `LLM_PROVIDER=openrouter` for production (or leave `auto` to prefer OpenRouter when its key is set)
4. Optional: `OPENROUTER_CHAT_MODEL` (default `openrouter/free`), `OPENROUTER_EMBED_MODEL` (default `nvidia/nemotron-3-embed-1b:free`)
5. To switch back to Mistral later: `LLM_PROVIDER=mistral`, set `MISTRAL_API_KEY`, re-run `npm run build:rag`

All keys are server-only — never use a `VITE_` prefix.

### Build the RAG index

After changing profile/case study content **or switching LLM provider**, regenerate vector embeddings (embeddings are provider-specific):

```bash
npm run build:rag
```

This writes `src/lib/rag/corpus-index.json`. Commit that file so production deploys do not need the API key at build time.

For local development without an API key, generate a keyword-search stub:

```bash
npm run build:rag:stub
```

### Free-model notes

- `openrouter/free` auto-selects a free model that supports tools and structured output where needed.
- Free tiers have rate limits and variable latency; pin a specific `:free` model if you need consistency.
- If the RAG index model does not match your configured embed model, chat falls back to keyword search until you re-index.

### Manual test checklist

1. Hero shows Ask AI input below the company logo bar
2. Submitting a question opens the sheet and streams a response
3. "Why hire Akshay?" returns grounded experience highlights
4. Project questions reference Kodo, 100x, or Tulr with `/projects/*` links
5. Off-topic questions are declined politely
6. Design system → AI Elements demo renders conversation components

## Web search (Brave Search API)

Portfolio chat and the public resume generator use a shared `web_search` tool backed by the [Brave Search API](https://api-dashboard.search.brave.com/).

### Setup

1. Create a free account at [api-dashboard.search.brave.com](https://api-dashboard.search.brave.com/)
2. Generate an API key and add to `.env.local` (server-only):

```env
BRAVE_SEARCH_API_KEY=your-api-key
```

3. Add the same variable in your Vercel project settings for production

Free tier includes ~2,000 queries/month — enough for portfolio chat and resume generation with existing rate limits.

## AI Resume Builder

| Route | Audience | Description |
|-------|----------|-------------|
| `/resume` | Owner (password) | Static profile from `src/lib/profile.ts` |
| `/tools/resume` | Public visitors | LinkedIn URL → Brave Search + Mistral → PDF |

Rate limits: **3 resume generations / 24h per IP**; **30 web searches / hr per IP** across chat and resume.

### Manual QA checklist

1. Work grid shows **Resume Builder** card linking to `/projects/resume-builder`
2. Case study has **Try it** → `/tools/resume` and **Owner workspace** → `/resume`
3. `/tools/resume` accepts LinkedIn URL, streams progress, shows preview + PDF download
4. Optional pasted profile text improves thin search results
5. Portfolio chat shows **Searching…** chip when `web_search` runs
6. Rate limit messaging appears after 3 resume generations in 24h

## Adding components

### Design system documentation

Open `/design-system` for the searchable component directory and foundations.
Each component page includes a live preview, complete example, local API,
theme tokens, data slots, accessibility guidance, and implementation source.
Playgrounds generate prop controls from local TypeScript: selects for literal
unions, switches for booleans, numeric and text inputs, date inputs, and JSON
editors for structured values. Choose a rendered component part to edit its
props. Callback fields report preview interactions in an event log;
composition and render-function props are documented as code fields.
Common controls appear first. Structured values, generic styling, callbacks,
and composition fields are grouped under a collapsed Advanced section.
Prop search appears only for lists of 12 or more fields, and the part selector
appears only when the example includes multiple component parts.
The current overrides are included in the copyable example.

Implementation source is fetched only when its disclosure opens; it is excluded
from route data and server hydration. Collapsed code blocks render 15 lines while
Copy always includes the complete example. Every preview has its own generated
lazy module; avoid importing the old demo galleries into the documentation shell.
The portfolio chat interface also loads on first open.

Markdown syntax highlighting uses the explicit grammar and theme imports in
`src/lib/code-highlighter.ts`. Add a grammar there when needed; unlisted languages
remain readable as plain text. Keep the cache bounded for streaming responses.
Vite externalizes React, React DOM, Lucide, and the PDF libraries in the Nitro
environment; Nitro traces the same list into deployment output. Preserve a single
React runtime when changing this list. Production builds use Node's default heap.

Foundations → Animation (`/design-system/animation`) documents the shared easing
and transition exports, motion tiers, live interaction recipes, and an inventory
of Motion, CSS, SVG, GSAP, canvas, WebGL, and WebGPU effects with their owning files.
Use `useAnimationProfile()` for new effects and clean up imperative playback,
timers, and animation frames. The docs sidebar uses `SIDEBAR_TRANSITION` from
`src/lib/motion-easing.ts`; it preserves navigation state while collapsing and
becomes inert immediately when closed.

The references come from the local implementation, rather than a copy of the
upstream shadcn API. Dev startup and production builds regenerate them.

```bash
npm run docs:generate # Refresh generated API references and example code
npm run docs:check    # Check source freshness and typecheck all complete examples
```

When customizing a component:

1. Edit its local source in `src/components/ui/` or the relevant pattern directory.
2. Update its demo in `src/components/design-system/demos/`.
3. Update authored guidance in `src/lib/design-system/guidance.ts` when behavior changes.
4. Run the documentation commands and `npm run typecheck`.
5. Verify the affected states, themes, and consumers in the browser.

Register new pages in `src/lib/design-system-registry.ts` and their live demos in
`src/components/design-system/demos/index.tsx`. Custom components also need a
source mapping in `scripts/generate-design-system-docs.ts`.
Do not edit `src/lib/design-system/generated/*.json` by hand.
Interactive renderers in `src/components/design-system/generated-playgrounds/`
are generated too. Focused examples for common primitives and M3 Shapes live in
`src/components/design-system/demos/playground-fixtures.tsx`.

The reusable workflow and layout reference live in
[design-system-docs](skills/design-system-docs/SKILL.md). Once installed in your
personal Codex skills directory, invoke `$design-system-docs` from other projects.

### Adding an upstream component

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place UI components in `src/components/ui/`. Review local changes
before replacing an existing customized component.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```
