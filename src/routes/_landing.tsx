import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router"
import * as React from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"
import { getDotFieldAppearance, useBrandColors } from "@/hooks/use-brand-colors"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { useDeferredMount } from "@/hooks/use-deferred-mount"
import { useIsMobile } from "@/hooks/use-mobile"
import { getHomeWorkSections } from "@/lib/sanity/projects"
import { siteUrl } from "@/lib/site-url"
import { RouteError } from "@/components/route-error"

const DotField = React.lazy(() => import("@/components/DotField"))

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
        content: siteUrl("/"),
      },
      {
        property: "og:image",
        content: siteUrl("/images/og-banner.jpg"),
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
        content: siteUrl("/images/og-banner.jpg"),
      },
    ],
    links: [
      {
        rel: "canonical",
        href: siteUrl("/"),
      },
    ],
  }),
  component: Landing1Layout,
})

function Landing1Layout() {
  const { canAnimate, fullMotion } = useAnimationProfile()
  const showDotField = useDeferredMount(canAnimate)
  const isMobile = useIsMobile()
  const brandColors = useBrandColors()
  const { resolvedTheme } = useTheme()
  const location = useLocation()
  const isChatRoute = location.pathname.startsWith("/chat")
  const dotFieldAppearance = getDotFieldAppearance(
    brandColors,
    resolvedTheme === "light" ? "light" : "dark",
  )

  return (
    <div className={cn(
      "bg-background text-foreground flex flex-col relative",
      isChatRoute ? "h-svh" : "min-h-svh"
    )}>
      {/* Viewport-fixed canvas — avoids sizing to full page scroll height */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        {showDotField ? (
          <React.Suspense fallback={null}>
            <DotField
              className="absolute inset-0"
              dotRadius={fullMotion ? 1.8 : 1.5}
              dotSpacing={isMobile ? 18 : fullMotion ? 14 : 20}
              bulgeStrength={isMobile ? 48 : fullMotion ? 67 : 40}
              glowRadius={isMobile ? 120 : fullMotion ? 160 : 100}
              sparkle={false}
              waveAmplitude={0}
              gradientFrom={dotFieldAppearance.gradientFrom}
              gradientTo={dotFieldAppearance.gradientTo}
              glowColor={dotFieldAppearance.glowColor}
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
