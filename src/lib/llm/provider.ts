export type LlmProvider = "openrouter" | "mistral"

export type LlmProviderPreference = LlmProvider | "auto"

export type ResolvedLlmConfig = {
  provider: LlmProvider
  apiKey: string
  chatBaseUrl: string
  embedBaseUrl: string
  chatModel: string
  embedModel: string
  extraHeaders?: Record<string, string>
}

export class LlmConfigError extends Error {
  code: string

  constructor(code: string, message: string) {
    super(message)
    this.name = "LlmConfigError"
    this.code = code
  }
}

const MISTRAL_CHAT_BASE = "https://api.mistral.ai/v1"
const OPENROUTER_BASE = "https://openrouter.ai/api/v1"

export const DEFAULT_OPENROUTER_CHAT_MODEL = "openrouter/free"
const DEFAULT_OPENROUTER_EMBED_MODEL = "nvidia/nemotron-3-embed-1b:free"

/** OpenRouter auto-routes across free models; used as fallback when a pinned free model is rate-limited. */
export const OPENROUTER_FREE_AUTO_MODEL = "openrouter/free"

const DEFAULT_OPENROUTER_CHAT_FALLBACKS = [
  OPENROUTER_FREE_AUTO_MODEL,
  "google/gemma-3-12b-it:free",
  "meta-llama/llama-3.2-3b-instruct:free",
] as const
const DEFAULT_MISTRAL_CHAT_MODEL = "mistral-small-latest"
const DEFAULT_MISTRAL_EMBED_MODEL = "mistral-embed"

const OPENROUTER_MODEL_PATTERN = /^[\w.-]+\/[\w.-]+(:free)?$/

export const MISTRAL_MODELS = [
  "mistral-small-latest",
  "mistral-medium-latest",
  "mistral-large-latest",
] as const

export type MistralModel = (typeof MISTRAL_MODELS)[number]

function readProviderPreference(): LlmProviderPreference {
  const raw = process.env.LLM_PROVIDER?.trim().toLowerCase()
  if (raw === "openrouter" || raw === "mistral") return raw
  return "auto"
}

function resolveProvider(preference: LlmProviderPreference): LlmProvider {
  if (preference === "openrouter") return "openrouter"
  if (preference === "mistral") return "mistral"

  if (process.env.OPENROUTER_API_KEY?.trim()) return "openrouter"
  if (process.env.MISTRAL_API_KEY?.trim()) return "mistral"

  throw new LlmConfigError(
    "missing_api_key",
    "No LLM API key configured. Set OPENROUTER_API_KEY or MISTRAL_API_KEY.",
  )
}

function buildOpenRouterConfig(): ResolvedLlmConfig {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim()
  if (!apiKey) {
    throw new LlmConfigError(
      "missing_api_key",
      "OPENROUTER_API_KEY is not configured.",
    )
  }

  return {
    provider: "openrouter",
    apiKey,
    chatBaseUrl: OPENROUTER_BASE,
    embedBaseUrl: OPENROUTER_BASE,
    chatModel: process.env.OPENROUTER_CHAT_MODEL?.trim() || DEFAULT_OPENROUTER_CHAT_MODEL,
    embedModel: process.env.OPENROUTER_EMBED_MODEL?.trim() || DEFAULT_OPENROUTER_EMBED_MODEL,
    extraHeaders: {
      "HTTP-Referer": "https://www.akshaysaini.xyz",
      "X-Title": "Akshay Saini Portfolio",
    },
  }
}

function buildMistralConfig(): ResolvedLlmConfig {
  const apiKey = process.env.MISTRAL_API_KEY?.trim()
  if (!apiKey) {
    throw new LlmConfigError(
      "missing_api_key",
      "MISTRAL_API_KEY is not configured.",
    )
  }

  const chatModel = process.env.MISTRAL_CHAT_MODEL?.trim() || DEFAULT_MISTRAL_CHAT_MODEL

  return {
    provider: "mistral",
    apiKey,
    chatBaseUrl: MISTRAL_CHAT_BASE,
    embedBaseUrl: MISTRAL_CHAT_BASE,
    chatModel,
    embedModel: process.env.MISTRAL_EMBED_MODEL?.trim() || DEFAULT_MISTRAL_EMBED_MODEL,
  }
}

export function resolveLlmConfig(): ResolvedLlmConfig {
  const preference = readProviderPreference()
  const provider = resolveProvider(preference)
  return provider === "openrouter" ? buildOpenRouterConfig() : buildMistralConfig()
}

export function getDefaultChatModel(config?: ResolvedLlmConfig): string {
  const resolved = config ?? resolveLlmConfig()
  return resolved.chatModel
}

export function getDefaultEmbedModel(config?: ResolvedLlmConfig): string {
  const resolved = config ?? resolveLlmConfig()
  return resolved.embedModel
}

export function getOpenRouterChatFallbackModels(primaryModel: string): string[] {
  const fromEnv = process.env.OPENROUTER_CHAT_MODEL_FALLBACKS?.trim()
  const configured = fromEnv
    ? fromEnv.split(",").map((entry) => entry.trim()).filter(Boolean)
    : [...DEFAULT_OPENROUTER_CHAT_FALLBACKS]

  const models = [primaryModel]
  for (const candidate of configured) {
    if (candidate && candidate !== primaryModel && !models.includes(candidate)) {
      models.push(candidate)
    }
  }

  if (
    primaryModel !== OPENROUTER_FREE_AUTO_MODEL &&
    !models.includes(OPENROUTER_FREE_AUTO_MODEL)
  ) {
    models.push(OPENROUTER_FREE_AUTO_MODEL)
  }

  return models
}

export function isValidChatModel(model: string, config?: ResolvedLlmConfig): boolean {
  if (!model.trim()) return false

  const resolved = config ?? resolveLlmConfig()

  if (resolved.provider === "mistral") {
    return MISTRAL_MODELS.includes(model as MistralModel)
  }

  return OPENROUTER_MODEL_PATTERN.test(model)
}
