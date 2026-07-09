import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ResumeListAddButton({
  label,
  onClick,
  className,
}: {
  label: string
  onClick: () => void
  className?: string
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn(
        "h-6 gap-1 px-2 text-[10px] text-muted-foreground hover:text-foreground",
        className,
      )}
      onClick={onClick}
    >
      <Plus className="size-3" aria-hidden />
      {label}
    </Button>
  )
}

export function ResumeListRemoveButton({
  label,
  onClick,
  className,
}: {
  label: string
  onClick: () => void
  className?: string
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      className={cn(
        "size-6 shrink-0 text-muted-foreground hover:text-destructive",
        className,
      )}
      onClick={onClick}
      aria-label={label}
    >
      <Trash2 className="size-3" aria-hidden />
    </Button>
  )
}
