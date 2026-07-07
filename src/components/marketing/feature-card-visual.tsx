import { getImageUrl } from "@/lib/sanity/image"
import {
  hasProjectFeatureVisual,
  ProjectFeatureVisual,
} from "@/components/marketing/feature-card-visuals/project-feature-visual"
import { getFeatureVisualConfig } from "@/lib/projects/project-feature-visuals"
import { getProjectVisualTheme } from "@/lib/projects/project-visual-themes"
import type { BentoSize } from "@/lib/projects/bento-placements"
import type { ProjectCard } from "@/lib/sanity/types"
import { cn } from "@/lib/utils"

const visualAspect: Record<BentoSize, string> = {
  compact: "aspect-[4/5] min-h-[240px] sm:min-h-[280px]",
  default: "aspect-[16/10] min-h-[220px]",
  wide: "min-h-[280px] sm:min-h-[340px] lg:min-h-[400px]",
}

type FeatureCardVisualProps = {
  project: ProjectCard
  size?: BentoSize
  className?: string
}

export function FeatureCardVisual({
  project,
  size = "default",
  className,
}: FeatureCardVisualProps) {
  const theme = getProjectVisualTheme(project.slug)
  const { Icon } = theme

  const coverUrl = project.coverImageUrl ?? getImageUrl(project.coverImage, 800)
  const alt = project.coverImage?.alt ?? project.title
  const featureConfig = getFeatureVisualConfig(project.slug)
  const useShellVisual = hasProjectFeatureVisual(project.slug)
  const isCompactPhone = featureConfig?.layout === "compact-phone"
  const aspectClass =
    isCompactPhone && size === "compact"
      ? "aspect-[9/16] min-h-[240px] sm:min-h-[280px]"
      : visualAspect[size]

  return (
    <div
      className={cn(
        "group/visual relative w-full overflow-hidden rounded-xl border border-border/50 contain-paint",
        aspectClass,
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br dark:hidden",
          theme.gradientLight,
        )}
        aria-hidden
      />
      <div
        className={cn(
          "absolute inset-0 hidden bg-gradient-to-br dark:block",
          theme.gradientDark,
        )}
        aria-hidden
      />

      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.08),transparent_60%)]"
        aria-hidden
      />

      {useShellVisual ? (
        <ProjectFeatureVisual slug={project.slug} size={size} />
      ) : coverUrl ? (
        <div className="absolute inset-x-3 bottom-0 top-4 sm:inset-x-4 sm:top-5">
          <div className="feature-card-screenshot h-full w-full overflow-hidden rounded-t-xl border border-b-0 border-white/25 bg-card shadow-[0_-10px_40px_rgba(15,23,42,0.12)] dark:border-white/10">
            <img
              src={coverUrl}
              alt={alt}
              loading="lazy"
              decoding="async"
              className="block h-full w-full object-cover object-top"
            />
          </div>
        </div>
      ) : (
        <div className="absolute inset-x-3 bottom-0 top-4 sm:inset-x-4 sm:top-5">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-t-xl border border-b-0 border-white/25 bg-card/95 shadow-[0_-10px_40px_rgba(15,23,42,0.12)]">
            <div
              className={cn(
                "flex size-20 items-center justify-center rounded-3xl border bg-background shadow-lg sm:size-24",
                theme.borderColor,
                theme.glowColor,
              )}
            >
              <Icon className={cn("size-9 sm:size-10", theme.iconColor)} aria-hidden />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
