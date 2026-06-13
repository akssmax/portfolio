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

## Ask AI (Mistral + RAG)

The hero section includes an **Ask AI** prompt that opens a sheet chat grounded in portfolio content (profile, projects, case studies).

### Setup

1. Copy `.env.example` to `.env.local`
2. Set `MISTRAL_API_KEY` (server-only — never use a `VITE_` prefix)
3. Optional: `MISTRAL_CHAT_MODEL`, `MISTRAL_EMBED_MODEL`

### Build the RAG index

After changing profile or case study content, regenerate vector embeddings:

```bash
npm run build:rag
```

This writes `src/lib/rag/corpus-index.json`. Commit that file so production deploys do not need the API key at build time.

For local development without an API key, generate a keyword-search stub:

```bash
npm run build:rag:stub
```

### Manual test checklist

1. Hero shows Ask AI input below the company logo bar
2. Submitting a question opens the sheet and streams a response
3. "Why hire Akshay?" returns grounded experience highlights
4. Project questions reference Kodo, 100x, or Tulr with `/projects/*` links
5. Off-topic questions are declined politely
6. Design system → AI Elements demo renders conversation components

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```
