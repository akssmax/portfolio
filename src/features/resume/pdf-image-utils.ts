import type { ResumeDocument, ResumeExperienceItem } from "./types"

export async function fetchImageAsBase64(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${url}`)
  }
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export async function resolveDocumentImages(document: ResumeDocument): Promise<ResumeDocument> {
  const resolvedPortrait = document.portrait
    ? { ...document.portrait, src: await fetchImageAsBase64(document.portrait.src) }
    : undefined

  const resolvedExperience = document.experience
    ? await Promise.all(
        document.experience.map(async (job): Promise<ResumeExperienceItem> => ({
          ...job,
          logoSrc: job.logoSrc ? await fetchImageAsBase64(job.logoSrc) : undefined,
        })),
      )
    : undefined

  return {
    ...document,
    portrait: resolvedPortrait,
    experience: resolvedExperience,
  }
}