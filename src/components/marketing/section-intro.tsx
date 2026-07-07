import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type SectionIntroProps = {
  eyebrow: string
  eyebrowIcon?: LucideIcon
  heading: string
  description?: string
  className?: string
}

export function SectionIntro({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  heading,
  description,
  className,
}: SectionIntroProps) {
  return (
    <div className={cn("max-w-2xl space-y-4", className)}>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
        {EyebrowIcon ? <EyebrowIcon className="size-3" aria-hidden /> : null}
        {eyebrow}
      </span>
      <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl lg:text-4xl font-heading">
        {heading}
      </h2>
      {description ? (
        <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
      ) : null}
    </div>
  )
}
