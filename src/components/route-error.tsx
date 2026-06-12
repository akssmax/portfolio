import type { ErrorComponentProps } from "@tanstack/react-router"

import { ErrorFallback } from "@/components/error-fallback"

export function RouteError({ error, reset }: ErrorComponentProps) {
  return <ErrorFallback error={error} reset={reset} />
}
