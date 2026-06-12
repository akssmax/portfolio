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
