import { createFileRoute } from "@tanstack/react-router"

import { ErrorBoundary } from "@/components/error-boundary"
import { Landing2Page } from "@/components/landing-2/landing-2-page"
import { RouteError } from "@/components/route-error"
import { getHomeWorkSections } from "@/lib/sanity/projects"
import { siteUrl } from "@/lib/site-url"

export const Route = createFileRoute("/landing-2")({
  loader: () => getHomeWorkSections(),
  errorComponent: RouteError,
  head: () => ({
    meta: [
      {
        title: "AkshayOS — Akshay Saini, Product Designer & Design Engineer",
      },
      {
        name: "description",
        content:
          "Classic OS take on the portfolio of Akshay Saini, a Product Designer and Design Engineer in Bangalore. Figma to React, fintech, devtools, and agentic AI.",
      },
      {
        property: "og:title",
        content: "AkshayOS — Akshay Saini, Product Designer & Design Engineer",
      },
      {
        property: "og:description",
        content:
          "A TypeSafe-inspired classic OS landing for Akshay Saini’s design engineering portfolio.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: siteUrl("/landing-2"),
      },
      {
        property: "og:image",
        content: siteUrl("/images/og-banner.jpg"),
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: siteUrl("/landing-2"),
      },
    ],
  }),
  component: Landing2Route,
})

function Landing2Route() {
  const { recentProjects, caseStudies } = Route.useLoaderData()

  return (
    <ErrorBoundary title="Landing-2 failed">
      <Landing2Page recentProjects={recentProjects} caseStudies={caseStudies} />
    </ErrorBoundary>
  )
}
