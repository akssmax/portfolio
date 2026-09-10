import { createChatCompletion } from "@/lib/llm/openai-compatible-client"
import { toApiMessages } from "@/lib/llm/tool-loop"
import type { LlmChatMessage } from "@/lib/llm/llm-types"
import type { ResolvedLlmConfig } from "@/lib/llm/provider"

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
  config: ResolvedLlmConfig
  model: string
  messages: LlmChatMessage[]
  temperature?: number
  maxTokens?: number
}): Promise<string> {
  const payload = await createChatCompletion(options.config, {
    model: options.model,
    messages: [
      ...toApiMessages(options.messages),
      { role: "user", content: STRUCTURE_USER_PROMPT },
    ],
    response_format: { type: "json_object" },
    temperature: options.temperature ?? 0.2,
    max_tokens: options.maxTokens ?? 4096,
  })

  return payload.choices?.[0]?.message?.content?.trim() ?? ""
}
