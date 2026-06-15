import { createFileRoute } from "@tanstack/react-router"

import {
  checkRateLimit,
  getClientIp,
  rateLimitHeaders,
  UNLOCK_RATE_LIMIT,
} from "@/lib/rag/rate-limit"
import {
  createResumeBuilderSession,
  getResumeBuilderSecret,
  resumeBuilderAuthCookie,
  verifyResumeBuilderPassword,
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

        const rate = checkRateLimit(`unlock:${getClientIp(request)}`, UNLOCK_RATE_LIMIT)
        if (!rate.allowed) {
          return Response.json(
            { error: "Too many unlock attempts. Please try again later." },
            { status: 429, headers: rateLimitHeaders(rate.retryAfterMs) },
          )
        }

        let password = ""
        try {
          const body = (await request.json()) as { password?: string }
          password = body.password?.trim() ?? ""
        } catch {
          return Response.json({ error: "Invalid request." }, { status: 400 })
        }

        if (!verifyResumeBuilderPassword(password, secret)) {
          return Response.json({ error: "Incorrect password." }, { status: 401 })
        }

        const session = createResumeBuilderSession()
        if (!session) {
          return Response.json(
            { error: "Resume builder is not configured." },
            { status: 503 },
          )
        }

        return Response.json(
          { ok: true },
          {
            headers: {
              "Set-Cookie": resumeBuilderAuthCookie(session),
            },
          },
        )
      },
    },
  },
})
