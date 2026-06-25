import { describe, expect, it } from "vitest"
import { resolveCssColorToHex, resolveCssVariableToHex } from "./resolve-colors"

describe("resolve-colors", () => {
  it("resolves basic hex colors", () => {
    expect(resolveCssColorToHex("#FF0000")).toBe("#FF0000")
    expect(resolveCssColorToHex("#00ff00")).toBe("#00FF00")
  })

  it("resolves basic rgb/rgba colors", () => {
    expect(resolveCssColorToHex("rgb(255, 0, 0)")).toBe("#FF0000")
    expect(resolveCssColorToHex("rgba(0, 255, 0, 0.5)")).toBe("#00FF00")
  })

  it("falls back gracefully for invalid colors", () => {
    expect(resolveCssColorToHex("invalid-color-name", "#123456")).toBe("#123456")
  })

  it("falls back gracefully for unresolved CSS variables", () => {
    expect(resolveCssVariableToHex("--non-existent-var", "#654321")).toBe("#654321")
  })
})
