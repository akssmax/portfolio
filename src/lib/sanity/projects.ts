import { isSanityConfigured, getSanityClient } from "./client"
import {
  getFallbackFeaturedProjects,
  getFallbackProjectBySlug,
  getFallbackProjectCards,
} from "./fallback-projects"
import {
  allProjectsQuery,
  featuredProjectsQuery,
  projectBySlugQuery,
} from "./queries"
import type { Project, ProjectCard } from "./types"

export async function getAllProjects(): Promise<ProjectCard[]> {
  if (!isSanityConfigured()) {
    return getFallbackProjectCards()
  }

  try {
    const projects = await getSanityClient().fetch<ProjectCard[]>(allProjectsQuery)
    return projects.length > 0 ? projects : getFallbackProjectCards()
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
    return projects.length > 0 ? projects : getFallbackFeaturedProjects()
  } catch {
    return getFallbackFeaturedProjects()
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
