/**
 * Seeds sample case studies into Sanity.
 *
 * Usage:
 *   1. Copy .env.example to .env.local and set Sanity credentials
 *   2. Create a write token at sanity.io/manage → API → Tokens
 *   3. Run: npm run seed
 */
import { createClient } from "@sanity/client"

import { fallbackProjects } from "../src/lib/sanity/fallback-projects"

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
  console.log(`Seeding ${fallbackProjects.length} projects to ${projectId}/${dataset}...`)

  for (const project of fallbackProjects) {
    const doc = {
      _id: `project-${project.slug}`,
      _type: "project" as const,
      title: project.title,
      slug: { _type: "slug" as const, current: project.slug },
      description: project.description,
      tag: project.tag,
      featured: project.featured,
      coverImageUrl: project.coverImageUrl,
      year: project.year,
      role: project.role,
      client: project.client,
      tools: project.tools,
      publishedAt: project.publishedAt,
      seo: project.seo,
      content: project.content,
    }

    await client.createOrReplace(doc)
    console.log(`  ✓ ${project.title}`)
  }

  console.log("Done.")
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
