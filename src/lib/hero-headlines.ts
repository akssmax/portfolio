/** Hero copy pairs — one set per portrait, cycled every 6s in sync. */
export const HERO_COPY = [
  {
    headline: "Ship your MVP faster.",
    tagline:
      "One partner from Figma to React — launch weeks earlier, not months.",
  },
  {
    headline: "Prototype to production.",
    tagline:
      "I turn founder sketches into shippable React — fast.",
  },
  {
    headline: "Look legit on day one.",
    tagline:
      "Polished UI that helps you win users, demos, and first impressions.",
  },
  {
    headline: "Skip the handoff.",
    tagline:
      "I design what I build — built for founders moving at startup speed.",
  },
  {
    headline: "Move fast, stay clear.",
    tagline:
      "Simple flows you can ship now and scale when traction hits.",
  },
  {
    headline: "Your design co-founder.",
    tagline:
      "YC devtools, fintech, AI — I get the zero-to-one grind.",
  },
  {
    headline: "From idea to interface.",
    tagline:
      "Turn rough v0 thinking into product UI your team can actually ship.",
  },
  {
    headline: "Launch without bloat.",
    tagline:
      "Focused craft for founders who need quality on a startup timeline.",
  },
] as const

export const HERO_HEADLINES = HERO_COPY.map((item) => item.headline)
export const HERO_TAGLINES = HERO_COPY.map((item) => item.tagline)

export type HeroHeadline = (typeof HERO_COPY)[number]["headline"]

/** Homepage hero rotating lines (prompt-first landing). */
export const LANDING_HERO_COPY = [
  {
    title: "Product designer who ships",
    subtitle: "I design in Figma and ship production-ready React code.",
  },
  {
    title: "Ask my portfolio anything.",
    subtitle:
      "Use the prompt below to search my projects, case studies, and engineering background.",
  },
  {
    title: "Hire a Product Designer in Bangalore.",
    subtitle: "6+ years experience across fintech, devtools, and agentic AI.",
  },
  {
    title: "Zero handoff friction.",
    subtitle: "I bridge the gap between design systems and frontend code.",
  },
] as const
