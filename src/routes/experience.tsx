import { createFileRoute } from "@tanstack/react-router"

import { ExperienceTimeline } from "@/components/about/experience-timeline"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"
import { siteUrl } from "@/lib/site-url"

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      {
        title: "Work Experience — Akshay Saini",
      },
      {
        name: "description",
        content: "Professional work history of Akshay Saini as a Product Designer and Design Engineer, specialized in building fintech, developer tools, and AI agents.",
      },
      {
        name: "keywords",
        content: "akshay saini, design engineer experience, product designer experience, designer cv, kodo design, unlogged designer, fintech designer, bangalore design engineer",
      },
      {
        property: "og:url",
        content: siteUrl("/experience"),
      },
    ],
    links: [
      {
        rel: "canonical",
        href: siteUrl("/experience"),
      },
    ],
  }),
  component: ExperiencePage,
})

function ExperiencePage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main className="border-t border-border">
        <ExperienceTimeline />
      </main>
      <SiteFooter hasTopBorder={false} />
    </div>
  )
}
