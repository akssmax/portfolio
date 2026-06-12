import { cn } from "@/lib/utils"

export function DocPreview({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex min-h-[120px] flex-wrap items-center justify-center gap-4 rounded-xl border border-border bg-muted/30 p-8",
        className
      )}
    >
      {children}
    </div>
  )
}
