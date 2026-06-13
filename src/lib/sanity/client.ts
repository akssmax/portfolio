import { createClient, type SanityClient } from "@sanity/client"

export function isSanityConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_SANITY_PROJECT_ID &&
      import.meta.env.VITE_SANITY_DATASET,
  )
}

let cachedClient: SanityClient | null = null

/** Lazily created — avoids throwing when Sanity env vars are not set. */
export function getSanityClient(): SanityClient {
  if (!isSanityConfigured()) {
    throw new Error("Sanity is not configured")
  }

  if (!cachedClient) {
    cachedClient = createClient({
      projectId: import.meta.env.VITE_SANITY_PROJECT_ID!,
      dataset: import.meta.env.VITE_SANITY_DATASET ?? "production",
      apiVersion: "2024-01-01",
      useCdn: true,
    })
  }

  return cachedClient
}
