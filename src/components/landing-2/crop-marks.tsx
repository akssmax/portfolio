import { cn } from "@/lib/utils"

type CropMarksProps = {
  className?: string
}

export function CropMarks({ className }: CropMarksProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-4 sm:inset-6", className)} aria-hidden>
      <span className="absolute top-0 left-0 h-3 w-3 border-t border-l border-foreground/70" />
      <span className="absolute top-0 right-0 h-3 w-3 border-t border-r border-foreground/70" />
      <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-foreground/70" />
      <span className="absolute right-0 bottom-0 h-3 w-3 border-r border-b border-foreground/70" />
    </div>
  )
}
