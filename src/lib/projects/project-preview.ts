import type { ProjectCard } from "@/lib/sanity/types"
import { getFeatureVisualConfig } from "@/lib/projects/project-feature-visuals"
import { getImageUrl } from "@/lib/sanity/image"

/** Prefer the project screenshot; newly added projects can fall back to their CMS cover. */
export function getProjectPreview(project: ProjectCard) {
  if (project.slug === "ion-workspace") {
    return {
      src: project.coverImageUrl ?? "/projects/ion/mail.webp",
      alt: "Ion demo workspace showing the mail inbox and an open conversation",
    }
  }
  if (project.slug === "indus-best-mega-food-park") {
    return {
      src: project.coverImageUrl ?? "/projects/indus/hero.webp",
      alt: "Screenshot of the deployed Indus Best Mega Food Park homepage",
    }
  }
  const visual = getFeatureVisualConfig(project.slug)
  if (visual?.layout === "wide-dual") return { src: visual.desktopSrc, alt: visual.desktopAlt }
  if (visual?.layout === "compact-phone") return { src: visual.imageSrc, alt: visual.imageAlt }
  return {
    src: project.coverImageUrl ?? getImageUrl(project.coverImage, 900),
    alt: project.coverImage?.alt ?? `${project.title} project screenshot`,
  }
}
