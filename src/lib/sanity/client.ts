import { createClient } from "@sanity/client"

export function isSanityConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_SANITY_PROJECT_ID &&
      import.meta.env.VITE_SANITY_DATASET,
  )
}

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID ?? "placeholder",
  dataset: import.meta.env.VITE_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: true,
})
