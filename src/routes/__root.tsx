import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"

import { RouteError } from "@/components/route-error"
import { ThemeProvider } from "@/components/theme-provider"
import { DirectionProvider } from "@/components/ui/direction"
import { TooltipProvider } from "@/components/ui/tooltip"

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
          "Design engineer portfolio — crafting interfaces where design systems meet production code.",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <DirectionProvider dir="ltr">
            <TooltipProvider>{children}</TooltipProvider>
          </DirectionProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
