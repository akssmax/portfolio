import { Link } from "@tanstack/react-router"
import { AlertTriangle, RotateCcw } from "lucide-react"

import { SiteHeader } from "@/components/landing/site-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ErrorFallbackProps = {
  error: unknown
  reset?: () => void
  title?: string
  showHeader?: boolean
  variant?: "page" | "panel"
  className?: string
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "An unexpected error occurred"
}

function isChunkLoadError(message: string) {
  return /Failed to fetch dynamically imported module|Loading chunk|Importing a module script failed/i.test(
    message,
  )
}

export function ErrorFallback({
  error,
  reset,
  title = "Something went wrong",
  showHeader = true,
  variant = "page",
  className,
}: ErrorFallbackProps) {
  const message = getErrorMessage(error)
  const isDev = import.meta.env.DEV
  const chunkError = isChunkLoadError(message)

  if (variant === "panel") {
    return (
      <div
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center",
          className,
        )}
        role="alert"
      >
        <Alert variant="destructive" className="w-full max-w-sm text-start">
          <AlertTriangle />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>
            {chunkError
              ? "The chat module failed to load. This often happens after a dev update — reload the page to restore it."
              : "We hit a snag loading this panel. Try again or reload the page."}
          </AlertDescription>
        </Alert>

        {isDev ? (
          <details className="w-full max-w-sm rounded-lg border border-border bg-muted/40 p-3 text-start text-sm">
            <summary className="cursor-pointer font-medium text-foreground">
              Error details
            </summary>
            <pre className="mt-2 overflow-auto whitespace-pre-wrap text-xs text-muted-foreground">
              {error instanceof Error && error.stack ? error.stack : message}
            </pre>
          </details>
        ) : null}

        <div className="flex flex-wrap items-center justify-center gap-2">
          {reset ? (
            <Button size="sm" onClick={reset}>
              <RotateCcw />
              Try again
            </Button>
          ) : null}
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Reload page
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      {showHeader ? <SiteHeader /> : null}
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-lg space-y-6">
          <Alert variant="destructive">
            <AlertTriangle />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
              {isDev
                ? message
                : "We hit a snag loading this page. Please try again or head back home."}
            </AlertDescription>
          </Alert>

          {isDev ? (
            <details className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
              <summary className="cursor-pointer font-medium text-foreground">
                Error details
              </summary>
              <pre className="mt-3 overflow-auto whitespace-pre-wrap text-xs text-muted-foreground">
                {error instanceof Error && error.stack
                  ? error.stack
                  : message}
              </pre>
            </details>
          ) : null}

          <div className="flex flex-wrap justify-center gap-3">
            {reset ? (
              <Button onClick={reset}>
                <RotateCcw />
                Try again
              </Button>
            ) : null}
            <Button asChild variant="outline">
              <Link to="/">Go home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
