import { Link } from "@tanstack/react-router"
import { AlertTriangle, RotateCcw } from "lucide-react"

import { SiteHeader } from "@/components/landing/site-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

type ErrorFallbackProps = {
  error: unknown
  reset?: () => void
  title?: string
  showHeader?: boolean
}

export function ErrorFallback({
  error,
  reset,
  title = "Something went wrong",
  showHeader = true,
}: ErrorFallbackProps) {
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred"
  const isDev = import.meta.env.DEV

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
