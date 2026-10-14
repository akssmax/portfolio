import { describe, expect, it } from "vitest"
import type { HighlightOptions } from "streamdown"
import { code } from "./code-highlighter"

type Result = NonNullable<ReturnType<typeof code.highlight>>
function highlight(
  value: string,
  language: HighlightOptions["language"] = "typescript"
) {
  return new Promise<Result>((resolve) => {
    const result = code.highlight(
      { code: value, language, themes: code.getThemes() },
      resolve
    )
    if (result) resolve(result)
  })
}
const text = (result: Result) =>
  result.tokens
    .map((line) => line.map((token) => token.content).join(""))
    .join("\n")

describe("portfolio code highlighting", () => {
  it("preserves TypeScript code and supplies both theme colors", async () => {
    const source = 'const message: string = "hello"'
    const result = await highlight(source)
    expect(text(result)).toBe(source)
    expect(
      result.tokens.flat().some((token) => token.htmlStyle?.["--shiki-dark"])
    ).toBe(true)
  })

  it("resolves aliases and coalesces concurrent requests without losing callbacks", async () => {
    expect(code.supportsLanguage("ts")).toBe(true)
    const source = "export const answer = 42"
    const results = await Promise.all([
      highlight(source, "ts"),
      highlight(source, "ts"),
    ])
    expect(results.map(text)).toEqual([source, source])
  })

  it("keeps complete source in cache keys as streaming content changes", async () => {
    const prefix = "// " + "a".repeat(150)
    const suffix = "// " + "z".repeat(150)
    const first = `${prefix}\nconst value = 10\n${suffix}`
    const second = `${prefix}\nconst value = 20\n${suffix}`
    expect(text(await highlight(first))).toBe(first)
    expect(text(await highlight(second))).toBe(second)
  })

  it("keeps unsupported languages readable as plain text", async () => {
    expect(code.supportsLanguage("rust")).toBe(false)
    expect(text(await highlight("fn main() {\n}", "rust"))).toBe(
      "fn main() {\n}"
    )
  })
})
