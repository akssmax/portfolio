import { describe, expect, it } from "vitest"

import {
  buildSyntheticGenUiCall,
  mergeToolCallDeltas,
  normalizeToolCalls,
  parseGenUiPayloadFromText,
} from "@/lib/llm/tool-call-utils"

describe("tool-call-utils", () => {
  it("merges streamed tool call deltas by index", () => {
    const merged = mergeToolCallDeltas([], [
      {
        index: 0,
        id: "call_1",
        function: { name: "render_custom_ui", arguments: "" },
      },
      {
        index: 0,
        function: { arguments: '{"title":"Projects"' },
      },
      {
        index: 0,
        function: { arguments: ',"layout":"grid"}' },
      },
    ])

    expect(merged).toHaveLength(1)
    expect(merged[0].name).toBe("render_custom_ui")
    expect(merged[0].arguments).toContain('"title":"Projects"')
  })

  it("parses JSON content fallback for gen ui", () => {
    const payload = parseGenUiPayloadFromText(
      '{"title":"Skills","layout":"metrics","items":[{"title":"React"}]}',
    )
    expect(payload?.title).toBe("Skills")

    const call = buildSyntheticGenUiCall(payload!, "render_custom_ui")
    expect(JSON.parse(call.arguments).layout).toBe("metrics")
  })

  it("normalizes provider tool call shapes", () => {
    const calls = normalizeToolCalls([
      {
        id: "abc",
        function: { name: "render_custom_ui", arguments: "{}" },
      },
    ])
    expect(calls[0]?.name).toBe("render_custom_ui")
  })
})
