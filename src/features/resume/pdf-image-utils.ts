import type { ResumeDocument, ResumeExperienceItem } from "./types"

function isSvgImageUrl(url: string): boolean {
  const path = url.split("?")[0]?.toLowerCase() ?? ""
  return path.endsWith(".svg") || path.startsWith("data:image/svg+xml")
}

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

function toAbsoluteImageUrl(url: string, baseUrl?: string): string {
  if (!baseUrl || url.startsWith("http") || url.startsWith("data:")) return url
  if (url.startsWith("/")) return `${baseUrl}${url}`
  return `${baseUrl}/${url}`
}

async function resolveImageSrc(
  url: string,
  baseUrl?: string,
): Promise<string | undefined> {
  // Keep SVG paths as-is so PdfCompanyLogo can match known logos to vector paths.
  // react-pdf's <Image> also handles SVG data URLs poorly in some browsers.
  if (isSvgImageUrl(url)) return url

  try {
    return await fetchImageAsBase64(toAbsoluteImageUrl(url, baseUrl))
  } catch {
    // Skip broken assets rather than failing the whole PDF export.
    return undefined
  }
}

export async function resolveResumeImageSrc(
  url: string,
  baseUrl?: string,
): Promise<string | undefined> {
  return resolveImageSrc(url, baseUrl)
}

export async function resolveDocumentImages(
  document: ResumeDocument,
  baseUrl?: string,
): Promise<ResumeDocument> {
  let resolvedPortrait: ResumeDocument["portrait"]

  if (document.portrait) {
    const resolvedSrc = await resolveImageSrc(document.portrait.src, baseUrl)
    resolvedPortrait = resolvedSrc
      ? { ...document.portrait, src: resolvedSrc }
      : undefined
  }

  const resolvedExperience = document.experience
    ? await Promise.all(
        document.experience.map(async (job): Promise<ResumeExperienceItem> => ({
          ...job,
          logoSrc: job.logoSrc ? await resolveImageSrc(job.logoSrc, baseUrl) : undefined,
        })),
      )
    : undefined

  return {
    ...document,
    portrait: resolvedPortrait,
    experience: resolvedExperience,
  }
}
