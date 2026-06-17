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
