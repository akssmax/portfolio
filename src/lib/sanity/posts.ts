import { isSanityConfigured, getSanityClient } from "./client"
import {
  getFallbackPostBySlug,
  getFallbackPosts,
} from "./fallback-posts"
import { allPostsQuery, postBySlugQuery } from "./queries"
import type { BlogPost, BlogPostCard } from "./types"

export async function getAllPosts(): Promise<BlogPostCard[]> {
  if (!isSanityConfigured()) {
    return getFallbackPosts()
  }

  try {
    const posts = await getSanityClient().fetch<BlogPostCard[]>(allPostsQuery)
    return posts.length > 0 ? posts : getFallbackPosts()
  } catch {
    return getFallbackPosts()
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSanityConfigured()) {
    return getFallbackPostBySlug(slug)
  }

  try {
    const post = await getSanityClient().fetch<BlogPost | null>(postBySlugQuery, {
      slug,
    })
    return post ?? getFallbackPostBySlug(slug)
  } catch {
    return getFallbackPostBySlug(slug)
  }
}
