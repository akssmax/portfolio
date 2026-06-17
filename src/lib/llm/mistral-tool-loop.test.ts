import { afterEach, describe, expect, it, vi } from "vitest"

import { runMistralToolLoop } from "@/lib/llm/mistral-tool-loop"

describe("runMistralToolLoop", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it("executes tool calls then returns assistant content", async () => {
    vi.stubEnv("BRAVE_SEARCH_API_KEY", "BSAI_test_key_12345678901234567890")

    let mistralCalls = 0
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)

      if (url.includes("mistral.ai")) {
        mistralCalls += 1
        if (mistralCalls === 1) {
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

    const result = await runMistralToolLoop({
      apiKey: "test-key",
      model: "mistral-small-latest",
      messages: [{ role: "user", content: "Hello" }],
      maxRounds: 2,
    })

    expect(result.content).toBe("Final answer")
    expect(mistralCalls).toBe(2)
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

    const result = await runMistralToolLoop({
      apiKey: "test-key",
      model: "mistral-small-latest",
      messages: [{ role: "user", content: "Hello" }],
      appendFinalAssistant: false,
    })

    expect(result.content).toBe("Stream me")
    expect(result.messages).toEqual([{ role: "user", content: "Hello" }])
  })
})
