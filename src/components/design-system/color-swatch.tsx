import { useEffect, useRef, useState } from "react"
import { CopyButton } from "@/components/design-system/code-block"

export function ColorSwatch({
  name,
  variable,
  className,
}: {
  name: string
  variable: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState("")
  useEffect(() => {
    const update = () => {
      if (ref.current) setValue(getComputedStyle(ref.current).backgroundColor)
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [variable])
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-background">
      <div
        ref={ref}
        className={`h-20 w-full border-b border-border ${className ?? ""}`}
        style={{ backgroundColor: `var(${variable})` }}
      />
      <div className="space-y-1 p-3">
        <p className="text-xs font-medium text-foreground">{name}</p>
        <div className="flex items-center justify-between gap-1">
          <code className="truncate font-mono text-[10px] text-muted-foreground">
            {variable}
          </code>
          <CopyButton value={`var(${variable})`} label={`Copy ${variable}`} />
        </div>
        {value && (
          <p
            title={value}
            className="truncate font-mono text-[9px] text-muted-foreground"
          >
            {value}
          </p>
        )}
      </div>
    </div>
  )
}
