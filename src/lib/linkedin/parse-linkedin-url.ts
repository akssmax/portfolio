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
  
  // Try LinkedIn
  const liMatch = withProtocol.match(LINKEDIN_PROFILE_PATTERN)
  if (liMatch?.[1]) {
    const slug = liMatch[1].toLowerCase()
    return {
      slug,
      normalizedUrl: `https://www.linkedin.com/in/${slug}`,
    }
  }

  // Try GitHub
  const ghMatch = withProtocol.match(/^https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)\/?(?:\?.*)?$/i)
  if (ghMatch?.[1]) {
    const slug = ghMatch[1].toLowerCase()
    return {
      slug,
      normalizedUrl: `https://github.com/${slug}`,
    }
  }

  // Try Peerlist
  const plMatch = withProtocol.match(/^https?:\/\/(?:www\.)?peerlist\.io\/([a-zA-Z0-9_-]+)\/?(?:\?.*)?$/i)
  if (plMatch?.[1]) {
    const slug = plMatch[1].toLowerCase()
    return {
      slug,
      normalizedUrl: `https://peerlist.io/${slug}`,
    }
  }

  // Generic URL
  try {
    const url = new URL(withProtocol)
    const hostParts = url.hostname.replace("www.", "").split(".")
    const domain = hostParts[0]
    const pathParts = url.pathname.split("/").filter(Boolean)
    
    let slug = pathParts[0] || domain
    const commonPrefixes = new Set(["in", "user", "u", "profile", "member", "p", "users", "id"])
    if (commonPrefixes.has(slug.toLowerCase()) && pathParts[1]) {
      slug = pathParts[1]
    }

    return {
      slug: slug.toLowerCase(),
      normalizedUrl: url.toString(),
    }
  } catch {
    return null
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
    `site:linkedin.com/in/${slug}`,
    `${slug} portfolio OR resume`,
    `${displayName} github OR linkedin`,
  ]

  if (profileText?.trim()) {
    const nameGuess = profileText.trim().split(/\n/)[0]?.slice(0, 80)
    if (nameGuess) {
      queries.unshift(`${nameGuess} site:linkedin.com/in/${slug}`)
    }
  }

  return queries.slice(0, 3)
}
