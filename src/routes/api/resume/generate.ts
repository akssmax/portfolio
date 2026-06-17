import { createFileRoute } from "@tanstack/react-router"

import { structureResumeDocumentJson } from "@/features/resume/structure-resume-json"
import {
  formatResumeValidationError,
  parseResumeDocumentJson,
} from "@/features/resume/validate-resume-document"
import { getDefaultChatModel } from "@/lib/llm/llm-types"
import { runMistralToolLoop } from "@/lib/llm/mistral-tool-loop"
import {
  buildLinkedInSearchQueries,
  parseLinkedInProfileUrl,
  slugToDisplayName,
} from "@/lib/linkedin/parse-linkedin-url"
import { isWebSearchConfigured } from "@/lib/search/search-web"
import {
  checkRateLimit,
  getClientIp,
  rateLimitHeaders,
  RESUME_GEN_RATE_LIMIT,
  WEB_SEARCH_RATE_LIMIT,
} from "@/lib/rag/rate-limit"

type GenerateRequestBody = {
  linkedinUrl?: string
  profileText?: string
}

const RESUME_RESEARCH_PROMPT = [
  "You are a resume research assistant.",
  "Use web_search when available to gather public LinkedIn profile snippets and professional details.",
  "The visitor only needs to provide a LinkedIn URL — an optional pasted profile summary may also be included.",
  "Research the person and summarize findings: name, title, location, experience, education, skills.",
  "Do not invent facts. Note when public data is thin.",
].join("\n")

function jsonError(status: number, code: string, message: string): Response {
  return Response.json({ error: { code, message } }, { status })
}

function writeSse(controller: ReadableStreamDefaultController, event: string, data: unknown) {
  const encoder = new TextEncoder()
  controller.enqueue(encoder.encode(`event: ${event}\n`))
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
}

function sendGenerationError(
  controller: ReadableStreamDefaultController,
  message: string,
  title?: string,
) {
  const alert = formatResumeValidationError(message)
  writeSse(controller, "error", {
    message: message || alert.description,
    title: title ?? alert.title,
  })
}

export const Route = createFileRoute("/api/resume/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.MISTRAL_API_KEY
        if (!apiKey) {
          return jsonError(500, "missing_api_key", "MISTRAL_API_KEY is not configured.")
        }

        const clientIp = getClientIp(request)
        const rate = checkRateLimit(`resume_gen:${clientIp}`, RESUME_GEN_RATE_LIMIT)
        if (!rate.allowed) {
          return Response.json(
            {
              error: {
                code: "rate_limited",
                message: "Resume generation limit reached (3 per day). Try again tomorrow.",
              },
            },
            { status: 429, headers: rateLimitHeaders(rate.retryAfterMs) },
          )
        }

        let body: GenerateRequestBody
        try {
          body = (await request.json()) as GenerateRequestBody
        } catch {
          return jsonError(400, "invalid_json", "Request body must be JSON.")
        }

        const linkedinUrl = typeof body.linkedinUrl === "string" ? body.linkedinUrl : ""
        const profileText =
          typeof body.profileText === "string" ? body.profileText.trim() : undefined

        const parsedLinkedIn = parseLinkedInProfileUrl(linkedinUrl)
        if (!parsedLinkedIn) {
          return jsonError(
            400,
            "invalid_linkedin_url",
            "Provide a valid LinkedIn profile URL (linkedin.com/in/…).",
          )
        }

        const stream = new ReadableStream({
          async start(controller) {
            try {
              const searchEnabled = isWebSearchConfigured()
              writeSse(controller, "status", {
                phase: "searching",
                message: searchEnabled ? "Searching profile…" : "Analyzing profile…",
              })

              const seedQueries = buildLinkedInSearchQueries(parsedLinkedIn.slug, profileText)
              const userPrompt = [
                `LinkedIn profile: ${parsedLinkedIn.normalizedUrl}`,
                `Profile slug: ${parsedLinkedIn.slug}`,
                `Display name guess: ${slugToDisplayName(parsedLinkedIn.slug)}`,
                profileText
                  ? `Optional pasted profile text:\n${profileText.slice(0, 4000)}`
                  : "No profile summary was pasted — use web search and the LinkedIn URL only.",
                searchEnabled
                  ? `Suggested searches: ${seedQueries.join(" | ")}`
                  : "Web search is unavailable — infer what you safely can from the LinkedIn URL slug.",
                "Research this person for resume generation.",
              ].join("\n\n")

              const { messages: researchMessages } = await runMistralToolLoop({
                apiKey,
                model: getDefaultChatModel(),
                messages: [
                  { role: "system", content: RESUME_RESEARCH_PROMPT },
                  { role: "user", content: userPrompt },
                ],
                maxRounds: 2,
                maxSearches: 3,
                enableTools: searchEnabled,
                temperature: 0.2,
                maxTokens: 2048,
                toolContext: {
                  beforeSearch: () => {
                    const searchRate = checkRateLimit(
                      `web_search:${clientIp}`,
                      WEB_SEARCH_RATE_LIMIT,
                    )
                    return searchRate.allowed
                      ? { allowed: true }
                      : {
                          allowed: false,
                          error: "Web search rate limit exceeded.",
                        }
                  },
                },
                onToolStart: (payload) => writeSse(controller, "tool_start", payload),
                onToolEnd: (payload) => writeSse(controller, "tool_end", payload),
              })

              writeSse(controller, "status", {
                phase: "structuring",
                message: "Structuring resume…",
              })

              const content = await structureResumeDocumentJson({
                apiKey,
                model: getDefaultChatModel(),
                messages: researchMessages,
                temperature: 0.2,
                maxTokens: 4096,
              })

              const validation = parseResumeDocumentJson(content, {
                linkedInSlug: parsedLinkedIn.slug,
                linkedinUrl: parsedLinkedIn.normalizedUrl,
              })

              if (!validation.ok) {
                const alert = formatResumeValidationError(validation.error)
                writeSse(controller, "error", {
                  message: alert.description,
                  title: alert.title,
                  code: validation.error,
                })
                writeSse(controller, "done", { ok: false })
                controller.close()
                return
              }

              const document = {
                ...validation.document,
                contact: {
                  email: validation.document.contact?.email ?? "",
                  phone: validation.document.contact?.phone ?? "",
                  ...validation.document.contact,
                  linkedin: parsedLinkedIn.normalizedUrl,
                },
              }

              writeSse(controller, "document", { document })
              writeSse(controller, "status", { phase: "ready", message: "Ready" })
              writeSse(controller, "done", { ok: true })
              controller.close()
            } catch (error) {
              const message =
                error instanceof Error ? error.message : "Resume generation failed."
              sendGenerationError(controller, message)
              writeSse(controller, "done", { ok: false })
              controller.close()
            }
          },
        })

        return new Response(stream, {
          headers: {
            "Cache-Control": "no-cache, no-transform",
            "Content-Type": "text/event-stream; charset=utf-8",
            Connection: "keep-alive",
          },
        })
      },
    },
  },
})
