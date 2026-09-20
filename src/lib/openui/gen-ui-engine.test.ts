import { describe, expect, it } from "vitest"

import { hasLegacyGenUiToolCalls, resolveGenUiEngine } from "@/lib/openui/gen-ui-engine"

describe("resolveGenUiEngine", () => {
  it("returns explicit engine when set", () => {
    expect(resolveGenUiEngine({ mode: "gen-ui", genUiEngine: "openui" })).toBe("openui")
  })

  it("infers legacy from tool calls", () => {
    expect(
      resolveGenUiEngine({
        mode: "gen-ui",
        toolCalls: [{ name: "render_custom_ui", arguments: '{"title":"Hi"}' }],
      }),
    ).toBe("legacy")
  })

  it("infers openui from streamed content", () => {
    expect(
      resolveGenUiEngine({
        mode: "gen-ui",
        content: 'root = Card([header])\nheader = CardHeader("Projects")',
      }),
    ).toBe("openui")
  })

  it("detects legacy tool call payloads", () => {
    expect(hasLegacyGenUiToolCalls([{ name: "render_custom_ui", arguments: "{}" }])).toBe(false)
    expect(
      hasLegacyGenUiToolCalls([
        { name: "render_custom_ui", arguments: '{"title":"Projects","layout":"grid","items":[]}' },
      ]),
    ).toBe(true)
  })
})
