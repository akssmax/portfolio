import type { LlmChatMessage } from "@/lib/llm/llm-types"
import { toMistralApiMessages } from "@/lib/llm/mistral-tool-loop"

const STRUCTURE_USER_PROMPT = [
  "Using the research above, output ONLY a valid ResumeDocument JSON object with this exact shape:",
  "{ name: string, title: string, location: string, summary?: string,",
  "  experience?: [{ company, role, period, location, description, highlights?: string[] }],",
  "  education?: { degree, school, years, location },",
  "  skills?: string[], contact?: { email?, phone?, linkedin?, github?, website? },",
  "  certifications?: [{ title, issuer, date }], languages?: [{ name, level }], interests?: string[] }",
  "Rules: skills MUST be a flat string array (not an object). education MUST be one object (not array).",
  "Use role not position. Use period not start_date. description must be a string.",
  "If unknown, use - for missing text fields. No markdown fences.",
].join(" ")

export async function structureResumeDocumentJson(options: {
  apiKey: string
  model: string
  messages: LlmChatMessage[]
  temperature?: number
  maxTokens?: number
}): Promise<string> {
  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options.model,
      messages: [
        ...toMistralApiMessages(options.messages),
        { role: "user", content: STRUCTURE_USER_PROMPT },
      ],
      response_format: { type: "json_object" },
      temperature: options.temperature ?? 0.2,
      max_tokens: options.maxTokens ?? 4096,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Mistral API error (${response.status}): ${errorText}`)
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>
  }

  return payload.choices?.[0]?.message?.content?.trim() ?? ""
}
