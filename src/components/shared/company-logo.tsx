import { HundredXLogo } from "@/components/logos/hundred-x-logo"
import { KodoLogo } from "@/components/logos/kodo-logo"
import { cn } from "@/lib/utils"

export function CompanyLogo({
  src,
  name,
  className,
}: {
  src?: string
  name: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background p-1.5",
        className,
      )}
    >
      {src === "/companies/kodo.svg" ? (
        <KodoLogo
          title={name}
          className="h-4 w-auto max-w-full text-foreground"
        />
      ) : src === "/companies/100x-bot.svg" ? (
        <HundredXLogo
          title={name}
          className="h-3.5 w-auto max-w-full text-foreground"
        />
      ) : src ? (
        <img
          src={src}
          alt={`${name} logo`}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />
      ) : (
        <span className="text-xs font-medium text-muted-foreground">
          {name.charAt(0)}
        </span>
      )}
    </div>
  )
}
