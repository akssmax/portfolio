import * as React from "react"
import { cn } from "@/lib/utils"

type ShellProps = {
  children: React.ReactNode
  className?: string
  edgeBleed?: "wide" | "compact"
  urlBar?: string
}

export function BrowserShell({ children, className, edgeBleed, urlBar }: ShellProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-col overflow-hidden border border-white/40 bg-background dark:border-white/10",
        edgeBleed === "wide" &&
          "h-full rounded-none rounded-tl-xl border-b-0 border-r-0 shadow-[0_8px_30px_-8px_rgba(15,23,42,0.25)] dark:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.45)] sm:rounded-tl-2xl",
        edgeBleed === "compact" &&
          "h-full rounded-none rounded-t-xl border-x-0 border-b-0 shadow-[0_8px_30px_-8px_rgba(15,23,42,0.22)] dark:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.4)] sm:rounded-t-2xl",
        !edgeBleed &&
          "rounded-lg shadow-[0_20px_50px_-12px_rgba(15,23,42,0.35)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.55)]",
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-border/60 bg-muted/40 px-2.5 py-1.5">
        <div className="flex gap-1" aria-hidden>
          <span className="size-1.5 rounded-full bg-[#FF5F57]" />
          <span className="size-1.5 rounded-full bg-[#FFBD2E]" />
          <span className="size-1.5 rounded-full bg-[#28CA41]" />
        </div>
        <div className="mx-auto min-w-0 flex-1 truncate rounded-md bg-background/80 px-2 py-0.5 text-center text-[8px] text-muted-foreground sm:text-[9px]">
          {urlBar ?? "localhost"}
        </div>
      </div>
      {children}
    </div>
  )
}

export function PhoneShell({ children, className }: ShellProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.25rem] border-[3px] border-foreground/10 bg-background p-1 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.4)] dark:border-white/15 dark:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.6)]",
        className,
      )}
    >
      <div className="absolute left-1/2 top-1 z-10 h-1 w-8 -translate-x-1/2 rounded-full bg-foreground/15" aria-hidden />
      <div className="size-full overflow-hidden rounded-[0.9rem] bg-background">{children}</div>
    </div>
  )
}

export function DiagonalPattern({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.2]",
        className,
      )}
      aria-hidden
      style={{
        backgroundImage:
          "repeating-linear-gradient(-45deg, transparent, transparent 6px, rgba(255,255,255,0.5) 6px, rgba(255,255,255,0.5) 7px)",
      }}
    />
  )
}
