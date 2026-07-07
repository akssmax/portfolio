import type { BentoSize } from "@/lib/projects/bento-placements"
import {
  getFeatureVisualConfig,
  type FeatureVisualConfig,
} from "@/lib/projects/project-feature-visuals"
import { cn } from "@/lib/utils"

import { CompactPhoneCardVisual } from "./compact-phone-card-visual"
import { DesignWithAiCardVisual } from "./design-with-ai-card-visual"

type ProjectFeatureVisualProps = {
  slug: string
  size?: BentoSize
  className?: string
}

function renderFeatureVisual(config: FeatureVisualConfig, size: BentoSize, className?: string) {
  switch (config.layout) {
    case "wide-dual":
      return <DesignWithAiCardVisual config={config} size={size} className={className} />
    case "compact-phone":
      return <CompactPhoneCardVisual config={config} className={className} />
    default:
      return null
  }
}

export function ProjectFeatureVisual({
  slug,
  size = "default",
  className,
}: ProjectFeatureVisualProps) {
  const config = getFeatureVisualConfig(slug)
  if (!config) return null

  return (
    <div className={cn("absolute inset-0", className)}>
      {renderFeatureVisual(config, size)}
    </div>
  )
}

export function hasProjectFeatureVisual(slug: string) {
  return getFeatureVisualConfig(slug) !== null
}
