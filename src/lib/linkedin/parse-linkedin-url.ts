const LINKEDIN_PROFILE_PATTERN =
  /^https?:\/\/(?:[\w-]+\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)\/?(?:\?.*)?$/i

export type ParsedLinkedInProfile = {
  slug: string
  normalizedUrl: string
}

export function parseLinkedInProfileUrl(input: string): ParsedLinkedInProfile | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  const withProtocol = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`
  const match = withProtocol.match(LINKEDIN_PROFILE_PATTERN)
  if (!match?.[1]) return null

  const slug = match[1].toLowerCase()
  return {
    slug,
    normalizedUrl: `https://www.linkedin.com/in/${slug}`,
  }
}

export function slugToDisplayName(slug: string): string {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ")
}

export function buildLinkedInSearchQueries(slug: string, profileText?: string): string[] {
  const displayName = slugToDisplayName(slug)
  const queries = [
    `"${displayName}" site:linkedin.com/in/${slug}`,
    `"${displayName}" portfolio OR resume`,
    `"${displayName}" github OR linkedin`,
  ]

  if (profileText?.trim()) {
    const nameGuess = profileText.trim().split(/\n/)[0]?.slice(0, 80)
    if (nameGuess) {
      queries.unshift(`"${nameGuess}" site:linkedin.com/in/${slug}`)
    }
  }

  return queries.slice(0, 3)
}
