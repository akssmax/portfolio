import type { BuildBadge } from "@/lib/sanity/types"

export const BUILD_BADGE_LABELS: Record<BuildBadge, string> = {
  "built-with-ai": "Built with AI",
  "pre-llm": "Pre-LLM era",
}

export function getBuildBadgeLabel(badge: BuildBadge | null | undefined): string | null {
  if (!badge) return null
  return BUILD_BADGE_LABELS[badge] ?? null
}
