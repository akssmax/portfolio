import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"

import { ErrorBoundary } from "@/components/error-boundary"
import { PostHogProvider } from "@/components/posthog-provider"
import { RouteError } from "@/components/route-error"
import { NotFoundPage } from "@/components/shared/not-found-page"
import { ThemeProvider } from "@/components/theme-provider"
import { DirectionProvider } from "@/components/ui/direction"
import { TooltipProvider } from "@/components/ui/tooltip"
import { APPEARANCE_INIT_SCRIPT } from "@/lib/themes/apply-appearance"
import { getDesignCareerSpanLabel } from "@/lib/experience-duration"
import { profile } from "@/lib/profile"

import appCss from "../styles.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Akshay Saini — Design Engineer",
      },
      {
        name: "description",
        content: `Akshay Saini — Product Designer and Design Engineer based in Bengaluru. ${getDesignCareerSpanLabel(profile.experience.map((item) => item.period))} in design across fintech, devtools, and agentic AI at 100x.bot, Kodo, and Unlogged (YC S22).`,
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        href: "/favicon-light.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        href: "/favicon-dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
      {
        rel: "icon",
        href: "/favicon-light.svg",
        type: "image/svg+xml",
      },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "preload",
        href: "/fonts/geist-pixel-square.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
    ],
  }),
  errorComponent: RouteError,
  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme="default"
      data-neutral="stone"
      data-font="geist-pixel-square"
      data-radius="default"
      data-color-vision="none"
      data-font-scale="100"
    >
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: APPEARANCE_INIT_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <DirectionProvider dir="ltr">
            <TooltipProvider>
              <PostHogProvider>
                <ErrorBoundary>{children}</ErrorBoundary>
              </PostHogProvider>
            </TooltipProvider>
          </DirectionProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
