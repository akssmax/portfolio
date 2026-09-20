import { isSanityConfigured, getSanityClient } from "./client"
import {
  getFallbackFeaturedProjects,
  getFallbackHomeWorkSections,
  getFallbackProjectBySlug,
  getFallbackProjectCards,
  partitionProjectsByWorkSection,
} from "./fallback-projects"
import {
  allProjectsQuery,
  featuredProjectsQuery,
  projectBySlugQuery,
} from "./queries"
import type { Project, ProjectCard } from "./types"

const localPortfolioProjectSlugs = new Set(["indus-best-mega-food-park", "ion-workspace"])

function withLocalPortfolioProjects(projects: Array<ProjectCard>): Array<ProjectCard> {
  const existingSlugs = new Set(projects.map((project) => project.slug))
  const localProjects = getFallbackProjectCards().filter(
    (project) => localPortfolioProjectSlugs.has(project.slug) && !existingSlugs.has(project.slug),
  )
  return [...projects, ...localProjects]
}

export async function getAllProjects(): Promise<ProjectCard[]> {
  if (!isSanityConfigured()) {
    return getFallbackProjectCards()
  }

  try {
    const projects = await getSanityClient().fetch<ProjectCard[]>(allProjectsQuery)
    return projects.length > 0 ? withLocalPortfolioProjects(projects) : getFallbackProjectCards()
  } catch {
    return getFallbackProjectCards()
  }
}

export async function getFeaturedProjects(): Promise<ProjectCard[]> {
  if (!isSanityConfigured()) {
    return getFallbackFeaturedProjects()
  }

  try {
    const projects = await getSanityClient().fetch<ProjectCard[]>(featuredProjectsQuery)
    return projects.length > 0 ? withLocalPortfolioProjects(projects) : getFallbackFeaturedProjects()
  } catch {
    return getFallbackFeaturedProjects()
  }
}

export type HomeWorkSections = {
  recentProjects: ProjectCard[]
  caseStudies: ProjectCard[]
}

export async function getHomeWorkSections(): Promise<HomeWorkSections> {
  if (!isSanityConfigured()) {
    return getFallbackHomeWorkSections()
  }

  try {
    const projects = await getSanityClient().fetch<ProjectCard[]>(featuredProjectsQuery)
    if (projects.length === 0) {
      return getFallbackHomeWorkSections()
    }

    const { recentProjects, caseStudies } = partitionProjectsByWorkSection(withLocalPortfolioProjects(projects))
    return { recentProjects, caseStudies }
  } catch {
    return getFallbackHomeWorkSections()
  }
}

export type AllWorkSections = HomeWorkSections & {
  other: ProjectCard[]
}

export async function getAllWorkSections(): Promise<AllWorkSections> {
  if (!isSanityConfigured()) {
    const all = getFallbackProjectCards()
    return partitionProjectsByWorkSection(all)
  }

  try {
    const projects = await getSanityClient().fetch<ProjectCard[]>(allProjectsQuery)
    if (projects.length === 0) {
      const all = getFallbackProjectCards()
      return partitionProjectsByWorkSection(all)
    }

    return partitionProjectsByWorkSection(withLocalPortfolioProjects(projects))
  } catch {
    const all = getFallbackProjectCards()
    return partitionProjectsByWorkSection(all)
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSanityConfigured()) {
    return getFallbackProjectBySlug(slug)
  }

  try {
    const project = await getSanityClient().fetch<Project | null>(projectBySlugQuery, {
      slug,
    })
    return project ?? getFallbackProjectBySlug(slug)
  } catch {
    return getFallbackProjectBySlug(slug)
  }
}

export async function getProjectCardBySlug(
  slug: string,
): Promise<ProjectCard | null> {
  const project = await getProjectBySlug(slug)
  if (!project) return null

  const { content: _content, seo: _seo, ...card } = project
  return card
}
