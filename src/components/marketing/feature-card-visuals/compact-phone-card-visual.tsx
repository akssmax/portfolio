import type { CompactPhoneFeatureVisual } from "@/lib/projects/project-feature-visuals"
import { useFullMotion } from "@/hooks/use-can-animate"
import { cn } from "@/lib/utils"

import { DiagonalPattern, PhoneShell } from "./ui-shells"

type CompactPhoneCardVisualProps = {
  config: CompactPhoneFeatureVisual
  className?: string
}

export function CompactPhoneCardVisual({
  config,
  className,
}: CompactPhoneCardVisualProps) {
  const fullMotion = useFullMotion()

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <DiagonalPattern />

      <div className="absolute inset-3">
        <PhoneShell
          className={cn(
            "size-full transition-transform duration-500 ease-out",
            fullMotion && "group-hover/visual:-translate-y-0.5",
          )}
        >
          <img
            src={config.imageSrc}
            alt={config.imageAlt}
            className="size-full object-cover object-top"
            loading="lazy"
            decoding="async"
          />
        </PhoneShell>
      </div>
    </div>
  )
}
