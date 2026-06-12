import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"

import { ErrorBoundary } from "@/components/error-boundary"
import { RouteError } from "@/components/route-error"
import { ThemeProvider } from "@/components/theme-provider"
import { DirectionProvider } from "@/components/ui/direction"
import { TooltipProvider } from "@/components/ui/tooltip"
import { APPEARANCE_INIT_SCRIPT } from "@/lib/themes/apply-appearance"

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
        content:
          "Akshay Saini — Product Designer and Design Engineer based in Bengaluru. Nearly 8 years designing fintech, devtools, and agentic AI products at 100x.bot, Kodo, and Unlogged (YC S22).",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  errorComponent: RouteError,
  notFoundComponent: () => (
    <main className="container mx-auto p-4 pt-16">
      <h1>404</h1>
      <p>The requested page could not be found.</p>
    </main>
  ),
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
    >
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: APPEARANCE_INIT_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <DirectionProvider dir="ltr">
            <TooltipProvider>
              <ErrorBoundary>{children}</ErrorBoundary>
            </TooltipProvider>
          </DirectionProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
