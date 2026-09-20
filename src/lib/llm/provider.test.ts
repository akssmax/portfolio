import { afterEach, describe, expect, it, vi } from "vitest"

import {
  getDefaultChatModel,
  getGenUiEngine,
  getGenUiModel,
  getOpenRouterChatFallbackModels,
  isValidChatModel,
  LlmConfigError,
  OPENROUTER_FREE_AUTO_MODEL,
  resolveLlmConfig,
  type ResolvedLlmConfig,
} from "@/lib/llm/provider"

const openRouterConfig: ResolvedLlmConfig = {
  provider: "openrouter",
  apiKey: "key",
  chatBaseUrl: "https://openrouter.ai/api/v1",
  embedBaseUrl: "https://openrouter.ai/api/v1",
  chatModel: "openrouter/free",
  embedModel: "nvidia/nemotron-3-embed-1b:free",
  extraHeaders: {
    "HTTP-Referer": "https://www.akshaysaini.xyz",
    "X-Title": "Akshay Saini Portfolio",
  },
}

const mistralConfig: ResolvedLlmConfig = {
  provider: "mistral",
  apiKey: "key",
  chatBaseUrl: "https://api.mistral.ai/v1",
  embedBaseUrl: "https://api.mistral.ai/v1",
  chatModel: "mistral-small-latest",
  embedModel: "mistral-embed",
}

describe("resolveLlmConfig", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("prefers OpenRouter in auto mode when both keys are set", () => {
    vi.stubEnv("LLM_PROVIDER", "auto")
    vi.stubEnv("OPENROUTER_API_KEY", "or-key")
    vi.stubEnv("OPENROUTER_CHAT_MODEL", "openrouter/free")
    vi.stubEnv("OPENROUTER_EMBED_MODEL", "nvidia/nemotron-3-embed-1b:free")
    vi.stubEnv("MISTRAL_API_KEY", "mistral-key")

    const config = resolveLlmConfig()
    expect(config.provider).toBe("openrouter")
    expect(config.chatModel).toBe("openrouter/free")
    expect(config.embedModel).toBe("nvidia/nemotron-3-embed-1b:free")
  })

  it("uses Mistral when explicitly configured", () => {
    vi.stubEnv("LLM_PROVIDER", "mistral")
    vi.stubEnv("MISTRAL_API_KEY", "mistral-key")
    vi.stubEnv("MISTRAL_CHAT_MODEL", "mistral-medium-latest")

    const config = resolveLlmConfig()
    expect(config.provider).toBe("mistral")
    expect(config.chatModel).toBe("mistral-medium-latest")
    expect(config.embedModel).toBe("mistral-embed")
  })

  it("throws when no API keys are configured", () => {
    vi.stubEnv("LLM_PROVIDER", "auto")
    vi.stubEnv("OPENROUTER_API_KEY", "")
    vi.stubEnv("MISTRAL_API_KEY", "")

    expect(() => resolveLlmConfig()).toThrow(LlmConfigError)
  })

  it("builds OpenRouter fallback chains with free auto routing", () => {
    const models = getOpenRouterChatFallbackModels("nex-agi/nex-n2.5-mini:free")
    expect(models[0]).toBe("nex-agi/nex-n2.5-mini:free")
    expect(models).toContain(OPENROUTER_FREE_AUTO_MODEL)
    expect(models.length).toBeGreaterThan(1)
  })

  it("respects OPENROUTER_CHAT_MODEL_FALLBACKS overrides", () => {
    vi.stubEnv(
      "OPENROUTER_CHAT_MODEL_FALLBACKS",
      "openrouter/free,google/gemma-3-12b-it:free",
    )
    const models = getOpenRouterChatFallbackModels("custom/vendor:free")
    expect(models).toEqual([
      "custom/vendor:free",
      "openrouter/free",
      "google/gemma-3-12b-it:free",
    ])
  })

  it("resolves Gen UI engine from GENUI_ENGINE", () => {
    vi.stubEnv("GENUI_ENGINE", "openui")
    expect(getGenUiEngine()).toBe("openui")

    vi.stubEnv("GENUI_ENGINE", "legacy")
    expect(getGenUiEngine()).toBe("legacy")

    vi.stubEnv("GENUI_ENGINE", "")
    expect(getGenUiEngine()).toBe("legacy")
  })

  it("resolves Gen UI model from chat model with optional override", () => {
    expect(getGenUiModel(mistralConfig)).toBe("mistral-small-latest")
    expect(getGenUiModel(openRouterConfig)).toBe(openRouterConfig.chatModel)

    vi.stubEnv("MISTRAL_GENUI_MODEL", "mistral-medium-latest")
    expect(getGenUiModel(mistralConfig)).toBe("mistral-medium-latest")
  })

  it("validates chat models per provider", () => {
    expect(isValidChatModel("openrouter/free", openRouterConfig)).toBe(true)
    expect(isValidChatModel("google/gemma-2-9b-it:free", openRouterConfig)).toBe(true)
    expect(isValidChatModel("mistral-small-latest", openRouterConfig)).toBe(false)

    expect(isValidChatModel("ministral-8b-latest", mistralConfig)).toBe(true)
    expect(isValidChatModel("mistral-small-latest", mistralConfig)).toBe(true)
    expect(isValidChatModel("openrouter/free", mistralConfig)).toBe(false)
    expect(getDefaultChatModel(mistralConfig)).toBe("mistral-small-latest")
  })
})
