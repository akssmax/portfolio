export type BentoSize = "compact" | "default" | "wide"

export type BentoPlacement = {
  colSpan: string
  size: BentoSize
}

export const BENTO_HERO_SLUG = "rupeelens"

const compactPlacement: BentoPlacement = {
  colSpan: "col-span-full lg:col-span-1",
  size: "compact",
}

const widePlacement: BentoPlacement = {
  colSpan: "col-span-full lg:col-span-3",
  size: "wide",
}

/** Stripe-style bento spans for a project list length. */
export function getBentoPlacements(projectCount: number): BentoPlacement[] {
  switch (projectCount) {
    case 1:
      return [{ colSpan: "col-span-full", size: "wide" }]
    case 2:
      return [
        { colSpan: "col-span-full md:col-span-1", size: "default" },
        { colSpan: "col-span-full md:col-span-1", size: "default" },
      ]
    case 3:
      return [compactPlacement, compactPlacement, compactPlacement]
    case 4:
      return [compactPlacement, compactPlacement, compactPlacement, widePlacement]
    default:
      return Array.from({ length: projectCount }, (_, index) => {
        if ((index + 1) % 4 === 0) {
          return widePlacement
        }
        return compactPlacement
      })
  }
}

/** Assign bento spans per project, with an optional hero slug getting the wide slot. */
export function getBentoPlacementsForProjects(
  projects: Array<{ slug: string }>,
  heroSlug: string = BENTO_HERO_SLUG,
): BentoPlacement[] {
  const heroIndex = projects.findIndex((project) => project.slug === heroSlug)

  if (projects.length === 4 && heroIndex !== -1) {
    return projects.map((_, index) =>
      index === heroIndex ? widePlacement : compactPlacement,
    )
  }

  return getBentoPlacements(projects.length)
}

export function getBentoGridClass(projectCount: number): string {
  if (projectCount <= 1) return "grid-cols-1"
  if (projectCount === 2) return "grid-cols-1 md:grid-cols-2"
  return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
}
