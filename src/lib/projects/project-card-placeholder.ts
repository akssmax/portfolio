type RecentProjectPlaceholder = {
  initials: string
  fallbackClassName: string
}

const RECENT_PROJECT_PLACEHOLDERS: Record<string, RecentProjectPlaceholder> = {
  "100x-landing-page": {
    initials: "100x",
    fallbackClassName: "bg-primary/15 text-primary",
  },
  "100x-chat-shell": {
    initials: "Chat",
    fallbackClassName: "bg-chart-2/15 text-chart-2",
  },
  "resume-builder": {
    initials: "RB",
    fallbackClassName: "bg-primary/15 text-primary",
  },
  "v1-100x-proto": {
    initials: "Agent",
    fallbackClassName: "bg-accent text-accent-foreground",
  },
}

function getProjectInitials(title: string): string {
  const words = title
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)

  if (words.length === 0) return "?"
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()

  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase()
}

export function getRecentProjectPlaceholder(slug: string, title: string) {
  const configured = RECENT_PROJECT_PLACEHOLDERS[slug]
  if (configured) return configured

  return {
    initials: getProjectInitials(title),
    fallbackClassName: "bg-muted text-muted-foreground",
  }
}

export function usesAvatarCardCover(workSection: string | null | undefined): boolean {
  return workSection === "recentProject"
}
