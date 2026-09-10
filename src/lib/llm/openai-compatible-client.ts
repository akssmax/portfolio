import {
  getOpenRouterChatFallbackModels,
  type ResolvedLlmConfig,
} from "@/lib/llm/provider"

type ChatCompletionBody = Record<string, unknown>

type EmbeddingBody = {
  model: string
  input: string | string[]
}

type ChatCompletionResponse = {
  choices?: Array<{
    finish_reason?: string
    message?: {
      role?: string
      content?: string | null
      tool_calls?: Array<{
        id: string
        type: "function"
        function: { name: string; arguments: string }
      }>
    }
  }>
}

type EmbeddingsResponse = {
  data?: Array<{ embedding?: number[]; index?: number }>
}

function buildHeaders(config: ResolvedLlmConfig): Record<string, string> {
  return {
    Authorization: `Bearer ${config.apiKey}`,
    "Content-Type": "application/json",
    ...config.extraHeaders,
  }
}

function providerLabel(config: ResolvedLlmConfig): string {
  return config.provider === "openrouter" ? "OpenRouter" : "Mistral"
}

function withOpenRouterModelFallbacks(
  config: ResolvedLlmConfig,
  body: ChatCompletionBody,
): ChatCompletionBody {
  if (config.provider !== "openrouter") return body

  const model =
    typeof body.model === "string" && body.model.trim()
      ? body.model.trim()
      : config.chatModel
  const models = getOpenRouterChatFallbackModels(model)

  if (models.length <= 1) {
    return { ...body, model }
  }

  return {
    ...body,
    model: models[0],
    models,
  }
}

async function readErrorText(response: Response): Promise<string> {
  return response.text().catch(() => "")
}

export async function createChatCompletion(
  config: ResolvedLlmConfig,
  body: ChatCompletionBody,
  signal?: AbortSignal,
): Promise<ChatCompletionResponse> {
  const payload = withOpenRouterModelFallbacks(config, body)
  const response = await fetch(`${config.chatBaseUrl}/chat/completions`, {
    method: "POST",
    headers: buildHeaders(config),
    body: JSON.stringify(payload),
    signal,
  })

  if (!response.ok) {
    const errorText = await readErrorText(response)
    throw new Error(`${providerLabel(config)} API error (${response.status}): ${errorText}`)
  }

  return (await response.json()) as ChatCompletionResponse
}

export async function createChatCompletionStream(
  config: ResolvedLlmConfig,
  body: ChatCompletionBody,
  signal?: AbortSignal,
): Promise<Response> {
  const payload = withOpenRouterModelFallbacks(config, body)
  return fetch(`${config.chatBaseUrl}/chat/completions`, {
    method: "POST",
    headers: buildHeaders(config),
    signal,
    body: JSON.stringify({ ...payload, stream: true }),
  })
}

export async function createEmbeddings(
  config: ResolvedLlmConfig,
  body: EmbeddingBody,
): Promise<number[][]> {
  const response = await fetch(`${config.embedBaseUrl}/embeddings`, {
    method: "POST",
    headers: buildHeaders(config),
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await readErrorText(response)
    throw new Error(`${providerLabel(config)} embeddings error (${response.status}): ${errorText}`)
  }

  const json = (await response.json()) as EmbeddingsResponse
  const rows = json.data ?? []
  const sorted = [...rows].sort((a, b) => (a.index ?? 0) - (b.index ?? 0))

  return sorted.map((row, index) => {
    if (!Array.isArray(row.embedding)) {
      throw new Error(`Missing embedding vector in ${providerLabel(config)} response (index ${index})`)
    }
    return row.embedding
  })
}

export type { ChatCompletionResponse }
