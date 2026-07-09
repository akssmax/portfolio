export type HeroPromptSuggestion = {
  label: string
  query: string
}

/** Hiring- and profile-focused chips; labels stay short enough for a single line. */
export const HERO_PROMPT_SUGGESTION_POOL: HeroPromptSuggestion[] = [
  {
    label: "Why should we hire Akshay?",
    query: "Why should we hire Akshay? What makes him a strong fit for product teams?",
  },
  {
    label: "What are his core strengths?",
    query: "What are Akshay's core strengths as a design engineer that hiring managers should know?",
  },
  {
    label: "How does he fit early teams?",
    query: "Why is Akshay a good fit for early-stage startups and small product teams?",
  },
  {
    label: "What's his work experience?",
    query: "Walk me through Akshay's work experience and the kinds of teams he has joined.",
  },
  {
    label: "What design systems work has he done?",
    query: "What design systems experience does Akshay have, and why does it matter for hiring?",
  },
  {
    label: "How does he work with founders?",
    query: "How does Akshay partner with founders and early product teams?",
  },
  {
    label: "What makes him a design engineer?",
    query: "What does Akshay mean by design engineer, and how does that help teams ship faster?",
  },
  {
    label: "How does he ship Figma to code?",
    query: "How does Akshay take work from Figma to production code? Give concrete examples.",
  },
  {
    label: "Which projects show his best work?",
    query: "Which of Akshay's projects best demonstrate his skills for a hiring decision?",
  },
  {
    label: "What's his impact at 100x.bot?",
    query: "What is Akshay building at 100x.bot and what impact has he had there?",
  },
  {
    label: "What agentic AI has he shipped?",
    query: "What agentic AI experiences has Akshay designed and built?",
  },
  {
    label: "What's his fintech background?",
    query: "What fintech experience does Akshay have and where has it shown up in his work?",
  },
]

export const HERO_SUGGESTION_COUNT = 3

/** Stable SSR default — same chips on server and first client paint. */
export const DEFAULT_HERO_PROMPT_SUGGESTIONS = HERO_PROMPT_SUGGESTION_POOL.slice(
  0,
  HERO_SUGGESTION_COUNT,
)

/** Short prompts that cycle in the hero chat placeholder every few seconds. */
export const HERO_PLACEHOLDER_PROMPTS = [
  "Ask about Akshay's projects, product design experience, or RAG info...",
  "What design systems has he built?",
  "How does he ship Figma to React?",
  "What's his experience with fintech?",
  "Tell me about his work at 100x.bot",
  "Which projects show his best work?",
  "How does he partner with founders?",
  "What agentic AI has he shipped?",
  "Why should we hire Akshay?",
  "What's his background in design engineering?",
] as const

function shuffleInPlace<T>(items: T[]) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
}

/** Picks a random subset of hero prompt chips — new set on each page load. */
export function getRandomHeroPromptSuggestions(
  count = HERO_SUGGESTION_COUNT,
): HeroPromptSuggestion[] {
  const pool = [...HERO_PROMPT_SUGGESTION_POOL]
  shuffleInPlace(pool)
  return pool.slice(0, Math.min(count, pool.length))
}
