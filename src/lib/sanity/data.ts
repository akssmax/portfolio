import { createServerFn } from "@tanstack/react-start"

import * as posts from "./posts"
import * as projects from "./projects"

/**
 * Route loaders call these instead of the Sanity helpers directly. Each runs
 * on the server (an RPC during client-side navigation), so the Sanity client
 * and its dependencies never ship in the browser bundle.
 */

const homeWorkSectionsFn = createServerFn({ method: "GET" }).handler(() =>
  projects.getHomeWorkSections(),
)
const allWorkSectionsFn = createServerFn({ method: "GET" }).handler(() =>
  projects.getAllWorkSections(),
)
const projectBySlugFn = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(({ data }) => projects.getProjectBySlug(data))
const allPostsFn = createServerFn({ method: "GET" }).handler(() => posts.getAllPosts())
const postBySlugFn = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(({ data }) => posts.getPostBySlug(data))

export const getHomeWorkSections = () => homeWorkSectionsFn()
export const getAllWorkSections = () => allWorkSectionsFn()
export const getProjectBySlug = (slug: string) => projectBySlugFn({ data: slug })
export const getAllPosts = () => allPostsFn()
export const getPostBySlug = (slug: string) => postBySlugFn({ data: slug })

export type { AllWorkSections, HomeWorkSections } from "./projects"
