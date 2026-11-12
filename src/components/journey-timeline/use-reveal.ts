import * as React from "react"

/** Tracks which stops have been seen. Once seen, a stop stays revealed (its scene starts once). */
export function useRevealed() {
  const [seen, setSeen] = React.useState<ReadonlySet<string>>(() => new Set())
  const reveal = React.useCallback((key: string) => {
    setSeen((prev) => {
      if (prev.has(key)) return prev
      const next = new Set(prev)
      next.add(key)
      return next
    })
  }, [])
  return { seen, reveal }
}
