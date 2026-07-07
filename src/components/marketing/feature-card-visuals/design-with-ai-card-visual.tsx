import type { WideDualFeatureVisual } from "@/lib/projects/project-feature-visuals"
import type { BentoSize } from "@/lib/projects/bento-placements"
import {
  cardVisualFastTransition,
  cardVisualSlowTransition,
} from "@/lib/motion-easing"
import { useFullMotion } from "@/hooks/use-can-animate"
import { cn } from "@/lib/utils"

import { BrowserShell, DiagonalPattern, PhoneShell } from "./ui-shells"

type DesignWithAiCardVisualProps = {
  config: WideDualFeatureVisual
  size?: BentoSize
  className?: string
}

export function DesignWithAiCardVisual({
  config,
  size = "wide",
  className,
}: DesignWithAiCardVisualProps) {
  const fullMotion = useFullMotion()

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <DiagonalPattern />

      <div
        className={cn(
          "absolute bottom-0 right-0 z-0 will-change-transform",
          cardVisualSlowTransition,
          fullMotion && "group-hover/visual:-translate-y-1 group-hover/visual:scale-[1.004]",
          size === "wide"
            ? "left-[calc(1rem+min(34%,148px)+1rem)] top-4 sm:left-[calc(1.25rem+min(34%,168px)+1.125rem)] sm:top-5 lg:left-[calc(1.25rem+184px+1.5rem)] lg:top-6"
            : "left-[calc(0.75rem+min(36%,128px)+0.875rem)] top-4",
        )}
      >
        <BrowserShell edgeBleed="wide" urlBar={config.urlBar} className="h-full w-full">
          <img
            src={config.desktopSrc}
            alt={config.desktopAlt}
            className="block h-full w-full object-cover object-left-top"
            loading="lazy"
            decoding="async"
          />
        </BrowserShell>
      </div>

      <div
        className={cn(
          "absolute z-10 will-change-transform",
          cardVisualFastTransition,
          fullMotion && "group-hover/visual:-translate-y-2 group-hover/visual:scale-[1.012]",
          size === "wide"
            ? "bottom-4 left-4 w-[34%] max-w-[148px] sm:bottom-5 sm:left-5 sm:max-w-[168px] lg:max-w-[184px]"
            : "bottom-3 left-3 w-[36%] max-w-[128px]",
        )}
      >
        <PhoneShell className="h-full w-full">
          <img
            src={config.mobileSrc}
            alt={config.mobileAlt}
            className="block aspect-[9/16] w-full object-cover object-left-top"
            loading="lazy"
            decoding="async"
          />
        </PhoneShell>
      </div>
    </div>
  )
}
