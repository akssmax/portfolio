import { useEffect, useState } from "react"
import { CodeBlock } from "@/components/design-system/code-block"
import { loadComponentSource } from "@/lib/design-system/docs"

export function ComponentSource({
  slug,
  path,
}: {
  slug: string
  path: string
}) {
  const [open, setOpen] = useState(false)
  const [source, setSource] = useState<string>()
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!open || source !== undefined) return
    let current = true
    setError(false)
    loadComponentSource(slug).then(
      (value) => {
        if (current) setSource(value)
      },
      () => {
        if (current) setError(true)
      }
    )
    return () => {
      current = false
    }
  }, [open, slug, source, attempt])

  return (
    <details
      className="overflow-hidden rounded-xl border border-border"
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="cursor-pointer px-4 py-4 font-mono text-xs">
        {path}
      </summary>
      {open &&
        (source !== undefined ? (
          <CodeBlock
            code={source}
            filename={path}
            collapsible
            className="rounded-none border-x-0 border-b-0"
          />
        ) : (
          <div
            className="border-t border-border p-4 text-xs text-muted-foreground"
            role="status"
          >
            {error ? (
              <>
                Source couldn’t load.{" "}
                <button
                  type="button"
                  className="underline"
                  onClick={() => setAttempt((value) => value + 1)}
                >
                  Try again
                </button>
              </>
            ) : (
              "Loading source…"
            )}
          </div>
        ))}
    </details>
  )
}
