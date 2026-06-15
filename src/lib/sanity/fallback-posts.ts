import type { BlogPost } from "./types"

export const fallbackPosts: BlogPost[] = [
  {
    _id: "post-design-systems-in-production",
    title: "Design systems in production",
    slug: "design-systems-in-production",
    excerpt:
      "What I learned shipping a token-driven design system that designers and engineers both actually use.",
    tag: "Design",
    publishedAt: "2026-03-01T10:00:00.000Z",
    body: `A design system only earns its keep when it survives contact with production code. Here is what worked when bridging Figma tokens and shadcn-style components on a real portfolio.

## Start with constraints, not components

Before adding another button variant, define the **non-negotiables**:

- Color roles that map to CSS variables, not hex values in components
- Typography scales that work in both marketing pages and dense tools
- Radius and spacing presets that survive theme switching

> The goal is not a component catalog. It is a shared language that reduces decision fatigue.

## Make the happy path the default path

Engineers will reach for \`className="text-sm text-muted-foreground"\` hundreds of times. If that pattern is already encoded in your primitives, you win by default.

1. Document tokens in a live design-system route
2. Mirror every primitive with a demo
3. Ship theme customization only after base tokens are stable

## Measure adoption, not completeness

Track what matters:

- How often teams import shared primitives vs. one-off styles
- Time to implement a new page section
- Bug count tied to inconsistent spacing or color usage

When adoption stalls, the fix is usually **documentation and examples**, not more components.

---

*Published as part of the portfolio design-system work — explore the live docs at [/design-system](/design-system).*`,
    seo: {
      metaTitle: "Design systems in production — Akshay Saini",
      metaDescription:
        "Lessons from shipping a token-driven design system that designers and engineers both use in production.",
    },
  },
  {
    _id: "post-shipping-ai-features-responsibly",
    title: "Shipping AI features responsibly",
    slug: "shipping-ai-features-responsibly",
    excerpt:
      "Patterns for portfolio chat: server-side RAG, rate limits, sanitized markdown, and honest guardrails.",
    tag: "Engineering",
    publishedAt: "2026-02-15T10:00:00.000Z",
    body: `Adding an AI chat surface to a portfolio is easy. Shipping one you can defend in production is harder.

## Keep retrieval on the server

Never trust the client to supply context. The chat API should:

1. Accept user messages only
2. Run RAG retrieval server-side
3. Inject grounded context as a system message

\`\`\`ts
const results = await retrieveForQuery(lastUserMessage)
const retrievedContext = buildRetrievedContext(results)
\`\`\`

## Render markdown safely

Assistant responses use the same **Streamdown** pipeline as this blog — sanitized HTML, hardened links, and syntax highlighting via \`@streamdown/code\`.

That means code blocks, lists, and inline formatting work consistently without \`dangerouslySetInnerHTML\`.

## Set honest expectations

The system prompt should say what the assistant *can* and *cannot* do:

- Answer from indexed portfolio content
- Link to projects and public pages
- Refuse to invent employment history or private details

## Protect the API

Even on a personal site, unauthenticated chat endpoints get abused:

- Rate limit by IP
- Cap token usage per request
- Return generic errors; log upstream failures server-side

---

Learn more about the implementation on [GitHub](https://github.com/akssmax/portfolio).`,
    seo: {
      metaTitle: "Shipping AI features responsibly — Akshay Saini",
      metaDescription:
        "Server-side RAG, sanitized markdown rendering, and API guardrails for portfolio AI chat.",
    },
  },
]

export function getFallbackPosts() {
  return fallbackPosts
}

export function getFallbackPostBySlug(slug: string): BlogPost | null {
  return fallbackPosts.find((post) => post.slug === slug) ?? null
}
