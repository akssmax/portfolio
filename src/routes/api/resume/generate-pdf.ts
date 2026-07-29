import { createFileRoute } from "@tanstack/react-router"

import {
  generateCoverLetterPdfDirect,
  generateResumePdfDirect,
} from "@/features/resume/generate-resume-pdf-direct"
import { resolvePdfBrandColor } from "@/features/resume/color-utils"
import type { ResumeDisplayPreferences } from "@/features/resume/resume-display-preferences"
import type { CoverLetterDocument, ResumeDocument, ResumeLayoutId } from "@/features/resume/types"
import {
  checkRateLimit,
  getClientIp,
  rateLimitHeaders,
  RESUME_PDF_RATE_LIMIT,
} from "@/lib/rag/rate-limit"
import type { FontPresetId } from "@/lib/themes/types"

type GeneratePdfRequestBody = {
  kind?: "resume" | "cover-letter"
  document?: ResumeDocument
  coverLetterDocument?: CoverLetterDocument
  brandColor: string
  layout?: ResumeLayoutId
  fontPresetId?: FontPresetId
  display?: ResumeDisplayPreferences
}

function jsonError(status: number, code: string, message: string): Response {
  return Response.json({ error: { code, message } }, { status })
}

export const Route = createFileRoute("/api/resume/generate-pdf")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const clientIp = getClientIp(request)
        const rate = checkRateLimit(`resume_pdf:${clientIp}`, RESUME_PDF_RATE_LIMIT)
        if (!rate.allowed) {
          return Response.json(
            {
              error: {
                code: "rate_limited",
                message: "PDF generation limit reached. Please try again later.",
              },
            },
            { status: 429, headers: rateLimitHeaders(rate.retryAfterMs) },
          )
        }

        let body: GeneratePdfRequestBody
        try {
          body = (await request.json()) as GeneratePdfRequestBody
        } catch {
          return jsonError(400, "invalid_json", "Request body must be JSON.")
        }

        const {
          kind = "resume",
          document,
          coverLetterDocument,
          brandColor,
          layout = "classic",
          fontPresetId = "inter",
          display,
        } = body

        if (!brandColor) {
          return jsonError(400, "missing_fields", "Brand color is required.")
        }

        const pdfBrandColor = resolvePdfBrandColor(brandColor)
        const origin = new URL(request.url).origin

        try {
          const blob =
            kind === "cover-letter"
              ? coverLetterDocument
                ? await generateCoverLetterPdfDirect(coverLetterDocument, pdfBrandColor, layout)
                : null
              : document
                ? await generateResumePdfDirect(
                    document,
                    pdfBrandColor,
                    layout,
                    fontPresetId,
                    display,
                    origin,
                  )
                : null

          if (!blob) {
            return jsonError(
              400,
              "missing_fields",
              kind === "cover-letter"
                ? "Cover letter document is required."
                : "Resume document is required.",
            )
          }

          const buffer = Buffer.from(await blob.arrayBuffer())
          return new Response(buffer, {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Cache-Control": "no-store",
            },
          })
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unable to generate resume PDF."
          return jsonError(500, "generation_failed", message)
        }
      },
    },
  },
})
