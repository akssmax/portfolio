import { createFileRoute } from "@tanstack/react-router"

import type { JourneyView } from "@/components/journey-timeline/journey-timeline"
import { JourneyTimeline } from "@/components/journey-timeline/journey-timeline"
import { findTimelineChapter } from "@/lib/journey/timeline"
import { siteUrl } from "@/lib/site-url"

import "@/styles/journey-timeline.css"

/** Old deck links used different stop ids; keep them landing on the right stop. */
const LEGACY_STOPS: Record<string, string> = {
  "100x-bot": "100x",
  freelancing: "now",
}

export const Route = createFileRoute("/journey")({
  validateSearch: (
    search: Record<string, unknown>
  ): { view?: JourneyView; stop?: string } => {
    const out: { view?: JourneyView; stop?: string } = {}
    if (search.view === "vertical" || search.view === "horizontal")
      out.view = search.view
    const raw = typeof search.stop === "string" ? search.stop.trim() : ""
    const stop = LEGACY_STOPS[raw] ?? raw
    if (stop && findTimelineChapter(stop)) out.stop = stop
    return out
  },
  head: () => ({
    meta: [
      { title: "Design Journey — Akshay Saini" },
      {
        name: "description",
        content:
          "A scroll-driven story of Akshay Saini's design career in five acts, from motion graphics and Wallzy to fintech at Kodo and AI agents.",
      },
      { property: "og:title", content: "Design Journey — Akshay Saini" },
      {
        property: "og:description",
        content:
          "Ten stops, one thread: the products and people behind Akshay Saini's design career.",
      },
      { property: "og:url", content: siteUrl("/journey") },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: siteUrl("/journey") },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap",
      },
    ],
  }),
  component: JourneyPage,
})

function JourneyPage() {
  const { view, stop } = Route.useSearch()
  return <JourneyTimeline initialView={view} initialStop={stop} />
}
