import { createFileRoute } from "@tanstack/react-router"
import { getDefaultChatModel } from "@/lib/llm/llm-types"
import {
  RESUME_GEN_RATE_LIMIT,
  checkRateLimit,
  getClientIp,
  rateLimitHeaders,
} from "@/lib/rag/rate-limit"

type GenerateCoverLetterRequestBody = {
  resumeDocument: any
  companyName: string
  jobTitle: string
  additionalInstructions?: string
}

function jsonError(status: number, code: string, message: string): Response {
  return Response.json({ error: { code, message } }, { status })
}

export const Route = createFileRoute("/api/resume/generate-cover-letter")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.MISTRAL_API_KEY
        if (!apiKey) {
          return jsonError(500, "missing_api_key", "MISTRAL_API_KEY is not configured.")
        }

        const clientIp = getClientIp(request)
        const rate = checkRateLimit(`cover_letter_gen:${clientIp}`, RESUME_GEN_RATE_LIMIT)
        if (!rate.allowed) {
          return Response.json(
            {
              error: {
                code: "rate_limited",
                message: "Cover letter generation limit reached (3 per day). Try again tomorrow.",
              },
            },
            { status: 429, headers: rateLimitHeaders(rate.retryAfterMs) },
          )
        }

        let body: GenerateCoverLetterRequestBody
        try {
          body = (await request.json()) as GenerateCoverLetterRequestBody
        } catch {
          return jsonError(400, "invalid_json", "Request body must be JSON.")
        }

        const { resumeDocument, companyName, jobTitle, additionalInstructions } = body

        if (!resumeDocument || !companyName || !jobTitle) {
          return jsonError(400, "missing_fields", "Resume details, company name, and job title are required.")
        }

        const todayString = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })

        const systemPrompt = [
          "You are a professional cover letter writer.",
          "Given a candidate's resume (JSON format), the company name, the target job title, and optional additional instructions, you write a cohesive, persuasive, and tailored cover letter.",
          "Your output MUST be a valid JSON object matching this schema exactly:",
          "{",
          '  "recipientName": "Hiring Manager" | "Hiring Team" | string,',
          '  "recipientCompany": string,',
          '  "recipientAddress": string (optional address or empty string),',
          '  "date": string,',
          '  "subject": string,',
          '  "body": string (3-4 paragraphs separated by double newlines \\n\\n),',
          '  "signOff": string',
          "}",
          "Rules:",
          "- Output ONLY the raw JSON object. Do not wrap in markdown fences.",
          "- Write a highly tailored letter. Relate the candidate's skills and experiences from the resume to the company and role.",
          "- The sender info (name, title, location, contact) will be automatically populated from the resume.",
          "- Keep the tone professional, confident, and direct."
        ].join("\n")

        const userPrompt = [
          `Candidate Resume:\n${JSON.stringify(resumeDocument, null, 2)}`,
          `Target Company: ${companyName}`,
          `Target Job Title: ${jobTitle}`,
          `Additional Instructions: ${additionalInstructions ?? "None"}`,
          `Current Date: ${todayString}`
        ].join("\n\n")

        try {
          const model = getDefaultChatModel()
          const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
              ],
              response_format: { type: "json_object" },
              temperature: 0.7,
              max_tokens: 2048,
            }),
          })

          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Mistral API error (${response.status}): ${errorText}`)
          }

          const payload = (await response.json()) as {
            choices?: Array<{ message?: { content?: string | null } }>
          }

          const content = payload.choices?.[0]?.message?.content?.trim() ?? ""
          
          // Parse the content to make sure it matches the structure and inject sender details
          const parsed = JSON.parse(content)
          
          const coverLetter = {
            senderName: resumeDocument.name || "",
            senderTitle: resumeDocument.title || "",
            senderLocation: resumeDocument.location || "",
            senderContact: resumeDocument.contact || {},
            recipientName: parsed.recipientName || "Hiring Manager",
            recipientCompany: parsed.recipientCompany || companyName,
            recipientAddress: parsed.recipientAddress || "",
            date: parsed.date || todayString,
            subject: parsed.subject || `Application for ${jobTitle} position`,
            body: parsed.body || "",
            signOff: parsed.signOff || `Sincerely,\n\n${resumeDocument.name || ""}`
          }

          return Response.json(coverLetter)
        } catch (error) {
          const message = error instanceof Error ? error.message : "Cover letter generation failed."
          return jsonError(500, "generation_failed", message)
        }
      },
    },
  },
})
