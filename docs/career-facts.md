# Career facts (source of truth)

Verified details for the resume, case studies, journey, experience page, llms.txt and RAG corpus.
When any page disagrees with this file, this file wins. Main data lives in `src/lib/profile.ts`.

## Titles
- Resume title: **Full Stack Designer** (`OFFICIAL_RESUME_TITLE`).
- Website title: **Product Designer / Design Engineer**. Keep it on the site.
- Tagline (Signature and Official): "AI-native product designer who ships: 0-to-1 products, from research to production code."
- Tagline (Designer, Modern): "Designer who builds: AI-native, 0-to-1 products taken from user research to shipped code."
- Tagline (Classic, Minimal, Executive): "From first research to shipped product: AI-native design and code for 0-to-1 teams."
- The website may keep the 0→1 arrow; the resume PDF font can't draw it, so use "0-to-1" there.
- Summary: lean UX loop, say "analytics", don't name PostHog. No "open access / no password" note on the portfolio link.

## Timeline

Team sizes below are background only. The user chose not to show headcounts on the resume or site.
| Period | Company | Role | Size | Entity / notes |
|---|---|---|---|---|
| May 2020 – Jan 2021 | Freelance | Graphic Designer | solo | Includes 3–4 months of contract design for Tulr, which led to the full-time role |
| Feb 2021 – Dec 2021 | Tulr | Founding Designer | 10–12 people | Paid by AuthMe Id Services Pvt Ltd. Gurgaon |
| Dec 2021 – Jan 2024 | Videobug → Unlogged | Founding Designer | 10–12 people | YC S22 (as Videobug). Unlogged registered as its own company at the rebrand. Remote |
| Feb 2024 – Nov 2025 | Kodo | Lead Product Designer | not listed | YC W21 fintech, Pune |
| Dec 2025 – Jun 2026 | 100x.bot | Design Engineer | not confirmed | Operated by Unlogged Inc (YC S22). Bengaluru |
| Jul 2026 – Present | Freelancing | Product Designer / Design Engineer | — | Cue, Postforge, Ion, Indus |

Tulr's official start is **Feb 2021**. Older copy said Sep 2020; replace it wherever it shows up.

## Same founder across Tulr, Videobug/Unlogged and 100x
- Founder: **Shardul Lavekar**. Serial entrepreneur: AuthMe was acquired by Airtel in 2018, he led AI products at Airtel X Labs, then co-founded Unlogged (YC S22) with **Parth Mudgal**.
- Tulr (1st product), Videobug → Unlogged (2nd), 100x.bot (3rd). Two legal entities: AuthMe Id Services Pvt Ltd (Tulr) and Unlogged (Videobug/Unlogged/100x).
- Why it matters: it answers "why so many job switches". It was one founder and three products.
- How it shows: every entry starts with "First / Second / Third product with founder Shardul Lavekar". The website timeline should link them visually (still to do).

## Per company
### Tulr
- No-code platform: videos, tables, forms, calendars plus automation. Replaces Airtable, Typeform, Calendly and Loom.
- Sole designer; worked directly with the founders and customers. Fewer than 1,000 users.
- Product Hunt: #5 Product of the Day, 175 upvotes; reviewers praised the "clutter less UI/UX". https://www.producthunt.com/products/tulr-io
- Team of 7 developers. Branding, launch animations, social media.
- Component libraries: Tulr 700+, Kodo 1,000+ (confirmed).

### Videobug → Unlogged
- Videobug: time-travel debugger for the JVM (Show HN, May 2022). Got into YC S22 under this name.
- Akshay's designs were used end to end for the YC application: product, pitch decks, marketing.
- Pivot and rebrand to Unlogged: record, replay and automated testing for Java. IntelliJ plugin (a dev tool) plus a web dashboard.
- 2 design systems, one per brand (one a modified Chakra UI). Webflow site, UI animations in Jitter, marketing videos. UX research and user testing.
- Founders' claim: Unlogged "reduced debugging time by up to 2 hours per day". Not used yet; ask before citing.
- JetBrains plugin (id 18529) has been removed; no install count was found.
- Product Hunt: Videobug #10 Product of the Day, 104 upvotes (https://www.producthunt.com/products/videobug). Unlogged #4 Product of the Day, 638 upvotes, 501 followers, open source (https://www.producthunt.com/products/unlogged).
- Links: unlogged.io and the Videobug site no longer exist; link to the Product Hunt pages. Kodo links to kodo.com (live). Tulr links to its Product Hunt page.
- YC page: /companies/videobug and /companies/unlogged redirect to /companies/100x.

### Kodo (YC W21)
- Kodo ERP procure-to-pay (P2P) v1 launch. First 2 enterprise customers: **redBus** and **Brndme** (https://brndme.in/).
- 2 design systems: **Tamagui (React Native)** for the ERP mobile apps, so they could ship faster, and **MD2 → MD3** for the corporate card product.
- Corporate card app revamp to Material Design 3. NPCI UPI app demo; NPCI-approved Bharat Connect screens. Framer website. Demos and prototypes.

### 100x.bot
- Browser automation platform. Conversational agent UI (chat, @-mentions, Claude and Gemini model selection), Chromium extension (shadcn/ui), design system, website built with MCP and Cursor.
- Managed 2 junior developers; built code prototypes for sales.

## Places that still need these facts
- [ ] Case studies: Tulr, Unlogged/Videobug, 100x (`src/lib/projects/case-study-story.ts`, `src/lib/sanity/fallback-projects.ts`)
- [ ] Journey (`src/lib/journey/story.ts`, `src/components/journey/journey-playground.tsx`)
- [ ] Experience timeline: visual same-founder link
- [ ] `src/lib/hiring-profile.ts`, RAG corpus (`npm run build:rag`), llms.txt (`npm run generate:llms`)

## Open questions
- 100x team size (Kodo size intentionally left off)

- Unlogged: YC outcome or funding, plugin usage numbers
