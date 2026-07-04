import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router"
import * as React from "react"
import { useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"
import { useBrandColors } from "@/hooks/use-brand-colors"
import { getHomeWorkSections } from "@/lib/sanity/projects"
import { RouteError } from "@/components/route-error"

const DotField = React.lazy(() => import("@/components/DotField"))

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "").trim()
  if (normalized.length !== 6) return `rgba(168, 85, 247, ${alpha})`
  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return `rgba(168, 85, 247, ${alpha})`
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const Route = createFileRoute("/_landing")({
  loader: () => getHomeWorkSections(),
  errorComponent: RouteError,
  head: () => ({
    meta: [
      {
        title: "Ask My Portfolio Anything — Akshay Saini (Design Portfolio)",
      },
      {
        name: "description",
        content: "A prompt-first iteration of Akshay Saini's design engineer portfolio. Ask anything about his design work, experience, or system principles.",
      },
      {
        name: "keywords",
        content: "design engineer, product designer, portfolio, akshay saini, bangalore, developer tools, fintech, agentic AI, YC startups, UI/UX",
      },
      {
        property: "og:title",
        content: "Ask My Portfolio Anything — Akshay Saini (Design Portfolio)",
      },
      {
        property: "og:description",
        content: "A prompt-first iteration of Akshay Saini's design engineer portfolio. Ask anything about his design work, experience, or system principles.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: "https://akshaysaini.xyz/",
      },
      {
        property: "og:image",
        content: "https://akshaysaini.xyz/images/og-banner.jpg",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "Ask My Portfolio Anything — Akshay Saini (Design Portfolio)",
      },
      {
        name: "twitter:description",
        content: "A prompt-first iteration of Akshay Saini's design engineer portfolio. Ask anything about his design work, experience, or system principles.",
      },
      {
        name: "twitter:image",
        content: "https://akshaysaini.xyz/images/og-banner.jpg",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://akshaysaini.xyz/",
      },
    ],
  }),
  component: Landing1Layout,
})

function Landing1Layout() {
  const shouldReduceMotion = useReducedMotion()
  const brandColors = useBrandColors()
  const location = useLocation()
  const isChatRoute = location.pathname.startsWith("/chat")

  return (
    <div className={cn(
      "bg-background text-foreground flex flex-col relative overflow-hidden",
      isChatRoute ? "h-svh" : "min-h-svh"
    )}>
      {/* Animated dot field canvas background */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        {!shouldReduceMotion ? (
          <React.Suspense fallback={null}>
            <DotField
              className="absolute inset-0"
              dotRadius={1.8}
              dotSpacing={14}
              bulgeStrength={67}
              glowRadius={160}
              sparkle={false}
              waveAmplitude={0}
              gradientFrom={hexToRgba(brandColors.primary, 0.75)}
              gradientTo={hexToRgba(brandColors.secondary || brandColors.accent, 0.55)}
              glowColor={hexToRgba(brandColors.primary, 0.45)}
            />
          </React.Suspense>
        ) : null}
        {/* Theme-aware gradient mask overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/55 to-background/25 lg:bg-gradient-to-r lg:from-background/92 lg:via-background/60 lg:to-background/15 dark:from-background/85 dark:via-background/60 dark:to-background/30"
          aria-hidden
        />
      </div>

      <SiteHeader />
      
      <main className={cn(
        "flex-1 relative z-10 flex flex-col w-full",
        isChatRoute && "min-h-0 overflow-hidden"
      )}>
        <Outlet />
      </main>

      {!isChatRoute && <SiteFooter hasTopBorder={false} />}
    </div>
  )
}
