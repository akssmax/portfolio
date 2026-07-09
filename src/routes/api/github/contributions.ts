import { createFileRoute } from "@tanstack/react-router"

import {
  fetchGithubContributions,
  githubUsernameFromProfileUrl,
} from "@/lib/github/contributions"
import { profile } from "@/lib/profile"

const CACHE_CONTROL =
  "public, s-maxage=3600, stale-while-revalidate=86400"

export const Route = createFileRoute("/api/github/contributions")({
  server: {
    handlers: {
      GET: async () => {
        const username = githubUsernameFromProfileUrl(profile.links.github)

        try {
          const data = await fetchGithubContributions(username)
          return Response.json(data, {
            headers: {
              "Cache-Control": CACHE_CONTROL,
            },
          })
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to load GitHub contributions"
          return Response.json(
            { error: { code: "github_contributions_failed", message } },
            { status: 502 },
          )
        }
      },
    },
  },
})
