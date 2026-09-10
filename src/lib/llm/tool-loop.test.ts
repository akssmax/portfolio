import { afterEach, describe, expect, it, vi } from "vitest"

import { runToolLoop } from "@/lib/llm/tool-loop"
import type { ResolvedLlmConfig } from "@/lib/llm/provider"

const testConfig: ResolvedLlmConfig = {
  provider: "mistral",
  apiKey: "test-key",
  chatBaseUrl: "https://api.mistral.ai/v1",
  embedBaseUrl: "https://api.mistral.ai/v1",
  chatModel: "mistral-small-latest",
  embedModel: "mistral-embed",
}

describe("runToolLoop", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it("executes tool calls then returns assistant content", async () => {
    vi.stubEnv("BRAVE_SEARCH_API_KEY", "BSAI_test_key_12345678901234567890")

    let chatCalls = 0
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)

      if (url.includes("/chat/completions")) {
        chatCalls += 1
        if (chatCalls === 1) {
          return new Response(
            JSON.stringify({
              choices: [
                {
                  finish_reason: "tool_calls",
                  message: {
                    role: "assistant",
                    content: "",
                    tool_calls: [
                      {
                        id: "call_1",
                        type: "function",
                        function: {
                          name: "web_search",
                          arguments: JSON.stringify({ query: "test query" }),
                        },
                      },
                    ],
                  },
                },
              ],
            }),
            { status: 200 },
          )
        }

        return new Response(
          JSON.stringify({
            choices: [
              {
                finish_reason: "stop",
                message: { role: "assistant", content: "Final answer" },
              },
            ],
          }),
          { status: 200 },
        )
      }

      return new Response(JSON.stringify({ results: [] }), { status: 200 })
    })

    vi.stubGlobal("fetch", fetchMock)

    const result = await runToolLoop({
      config: testConfig,
      model: "mistral-small-latest",
      messages: [{ role: "user", content: "Hello" }],
      maxRounds: 2,
    })

    expect(result.content).toBe("Final answer")
    expect(chatCalls).toBe(2)
  })

  it("can defer appending the final assistant message for streaming", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          choices: [
            {
              finish_reason: "stop",
              message: { role: "assistant", content: "Stream me" },
            },
          ],
        }),
        { status: 200 },
      ),
    )

    vi.stubGlobal("fetch", fetchMock)

    const result = await runToolLoop({
      config: testConfig,
      model: "mistral-small-latest",
      messages: [{ role: "user", content: "Hello" }],
      appendFinalAssistant: false,
    })

    expect(result.content).toBe("Stream me")
    expect(result.messages).toEqual([{ role: "user", content: "Hello" }])
  })
})
