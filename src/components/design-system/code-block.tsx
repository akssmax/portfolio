import { memo, useState } from "react"
import { Check, Copy, FileCode2 } from "lucide-react"

import { cn } from "@/lib/utils"

export function CopyButton({
  value,
  label = "Copy code",
}: {
  value: string
  label?: string
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle")
  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setStatus("copied")
      window.setTimeout(() => setStatus("idle"), 2000)
    } catch {
      setStatus("error")
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={status === "copied" ? "Copied" : label}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
    >
      {status === "copied" ? (
        <Check className="size-3.5" />
      ) : (
        <Copy className="size-3.5" />
      )}
      <span aria-live="polite">
        {status === "copied"
          ? "Copied"
          : status === "error"
            ? "Select to copy"
            : "Copy"}
      </span>
    </button>
  )
}

const Highlight = memo(function Highlight({ code }: { code: string }) {
  // Render text nodes, never HTML, so copied examples remain safe to display.
  const tokens = code.split(
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\/\/[^\n]*|\b(?:import|from|export|default|function|return|const|let|type|interface|true|false|null|undefined|async|await|if|as|satisfies)\b)/g
  )
  return tokens.map((token, index) => (
    <span
      key={index}
      className={
        token.startsWith("//")
          ? "text-muted-foreground"
          : /^["'`]/.test(token)
            ? "text-emerald-700 dark:text-emerald-300"
            : /^(import|from|export|default|function|return|const|let|type|interface|true|false|null|undefined|async|await|if|as|satisfies)$/.test(
                  token
                )
              ? "text-violet-700 dark:text-violet-300"
              : undefined
      }
    >
      {token}
    </span>
  ))
})

export function CodeBlock({
  code,
  filename = "example.tsx",
  className,
  collapsible = false,
}: {
  code: string
  filename?: string
  className?: string
  collapsible?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const long = collapsible && code.split("\n").length > 15
  const displayedCode =
    long && !expanded ? code.split("\n").slice(0, 15).join("\n") + "\n…" : code
  return (
    <div
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border border-border bg-muted/25",
        className
      )}
    >
      <div className="flex min-h-10 items-center justify-between gap-3 border-b border-border px-4">
        <span className="flex min-w-0 items-center gap-2 font-mono text-xs text-muted-foreground">
          <FileCode2 className="size-3.5 shrink-0" />
          <span className="truncate">{filename}</span>
        </span>
        <CopyButton value={code} />
      </div>
      <pre
        tabIndex={0}
        aria-label={filename}
        className={cn(
          "overflow-auto p-4 font-mono text-[12px] leading-6 outline-offset-[-2px] focus-visible:outline-2 focus-visible:outline-ring sm:p-5 sm:text-[13px]",
          long && !expanded ? "max-h-72" : "max-h-[640px]"
        )}
      >
        <code>
          <Highlight code={displayedCode} />
        </code>
      </pre>
      {long && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="w-full border-t border-border bg-background py-2.5 text-xs font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
        >
          {expanded ? "Collapse code" : "Expand full example"}
        </button>
      )}
    </div>
  )
}
