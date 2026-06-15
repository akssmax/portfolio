/**
 * Seeds blog posts into Sanity.
 *
 * Usage:
 *   1. Copy .env.example to .env.local and set Sanity credentials
 *   2. Create a write token at sanity.io/manage → API → Tokens
 *   3. Run: npm run seed:posts
 */
import { createClient } from "@sanity/client"

import { fallbackPosts } from "../src/lib/sanity/fallback-posts"

const projectId = process.env.VITE_SANITY_PROJECT_ID
const dataset = process.env.VITE_SANITY_DATASET ?? "production"
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !token) {
  console.error(
    "Missing VITE_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in environment.",
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
})

async function seed() {
  console.log(`Seeding ${fallbackPosts.length} blog posts to ${projectId}/${dataset}...`)

  for (const post of fallbackPosts) {
    const doc = {
      _id: `post-${post.slug}`,
      _type: "blogPost" as const,
      title: post.title,
      slug: { _type: "slug" as const, current: post.slug },
      excerpt: post.excerpt,
      body: post.body,
      tag: post.tag,
      publishedAt: post.publishedAt,
      seo: post.seo,
    }

    await client.createOrReplace(doc)
    console.log(`  ✓ ${post.title}`)
  }

  console.log("Done.")
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
