import { createFileRoute } from "@tanstack/react-router"

import { JourneyShell } from "@/components/journey/journey-shell"
import { buildJourneyTrack, findStopIndexById } from "@/lib/journey/build-journey-track"
import { siteUrl } from "@/lib/site-url"

export const Route = createFileRoute("/journey")({
  validateSearch: (search: Record<string, unknown>): { stop?: string } => {
    const rawStop = search.stop
    if (typeof rawStop === "string" && rawStop.trim() !== "") {
      return { stop: rawStop.trim() }
    }
    return {}
  },
  loader: () => ({
    track: buildJourneyTrack(),
  }),
  head: () => {
    return {
      meta: [
        { title: "Design Journey — Akshay Saini" },
        {
          name: "description",
          content: `Interactive design journey from college in 2014 to agentic AI — roles at Kodo, Unlogged, Tulr, 100x.bot, and the path in between.`,
        },
        { property: "og:title", content: "Design Journey — Akshay Saini" },
        {
          property: "og:description",
          content: `Scroll through Akshay Saini's design career — from After Effects in college to YC startups and design engineering.`,
        },
        { property: "og:url", content: siteUrl("/journey") },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: siteUrl("/journey") }],
    }
  },
  component: JourneyPage,
})

function JourneyPage() {
  const { track } = Route.useLoaderData()
  const { stop } = Route.useSearch()

  const initialStopId =
    stop && findStopIndexById(track.stops, stop) >= 0 ? stop : undefined

  return <JourneyShell track={track} initialStopId={initialStopId} />
}
