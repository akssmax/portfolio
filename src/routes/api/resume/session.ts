import { createFileRoute } from "@tanstack/react-router"

import {
  getResumeBuilderSecret,
  isResumeBuilderAuthorized,
} from "@/lib/resume-builder/auth"

export const Route = createFileRoute("/api/resume/session")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const secret = getResumeBuilderSecret()

        return Response.json({
          configured: Boolean(secret),
          authorized: isResumeBuilderAuthorized(request.headers.get("cookie")),
        })
      },
    },
  },
})
