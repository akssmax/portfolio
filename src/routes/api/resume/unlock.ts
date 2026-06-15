import { createFileRoute } from "@tanstack/react-router"

import {
  getResumeBuilderSecret,
  resumeBuilderAuthCookie,
} from "@/lib/resume-builder/auth"

export const Route = createFileRoute("/api/resume/unlock")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = getResumeBuilderSecret()
        if (!secret) {
          return Response.json(
            { error: "Resume builder is not configured." },
            { status: 503 },
          )
        }

        let password = ""
        try {
          const body = (await request.json()) as { password?: string }
          password = body.password?.trim() ?? ""
        } catch {
          return Response.json({ error: "Invalid request." }, { status: 400 })
        }

        if (password !== secret) {
          return Response.json({ error: "Incorrect password." }, { status: 401 })
        }

        return Response.json(
          { ok: true },
          {
            headers: {
              "Set-Cookie": resumeBuilderAuthCookie(secret),
            },
          },
        )
      },
    },
  },
})
