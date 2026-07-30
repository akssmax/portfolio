import { createFileRoute, useNavigate } from "@tanstack/react-router"

import { DeckShell } from "@/components/intro/deck-shell"
import { buildPostforgeDeck } from "@/lib/intro/postforge-deck"
import { DECK_SLIDE_IDS } from "@/lib/intro/types"
import { getVisualCaseStudyConfig } from "@/lib/projects/visual-case-study-configs"
import { getProjectBySlug } from "@/lib/sanity/projects"

const MAX_SLIDE_INDEX = DECK_SLIDE_IDS.length - 1

export const Route = createFileRoute("/intro")({
  validateSearch: (search: Record<string, unknown>): { slide?: number } => {
    const rawSlide = search.slide
    if (typeof rawSlide === "number" && Number.isFinite(rawSlide)) {
      return { slide: Math.max(0, Math.min(Math.trunc(rawSlide), MAX_SLIDE_INDEX)) }
    }

    if (typeof rawSlide === "string" && rawSlide.trim() !== "") {
      const parsed = Number.parseInt(rawSlide, 10)
      if (Number.isFinite(parsed)) {
        return { slide: Math.max(0, Math.min(parsed, MAX_SLIDE_INDEX)) }
      }
    }

    return {}
  },
  loader: async () => {
    const project = await getProjectBySlug("postforge")
    const visual = getVisualCaseStudyConfig("postforge")

    if (!project || !visual) {
      throw new Error("Postforge deck content is unavailable.")
    }

    return {
      deck: buildPostforgeDeck(project, visual),
    }
  },
  head: () => ({
    meta: [
      { title: "Interview Deck — Akshay Saini · Postforge" },
      { name: "robots", content: "noindex, nofollow, noarchive" },
      { name: "googlebot", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: IntroDeckPage,
})

function IntroDeckPage() {
  const { deck } = Route.useLoaderData()
  const { slide } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const initialIndex = slide ?? 0

  function handleSlideChange(nextIndex: number) {
    void navigate({
      search: (previous) => ({
        ...previous,
        slide: nextIndex > 0 ? nextIndex : undefined,
      }),
      replace: true,
    })
  }

  return (
    <DeckShell
      deck={deck}
      initialIndex={initialIndex}
      onSlideChange={handleSlideChange}
    />
  )
}
