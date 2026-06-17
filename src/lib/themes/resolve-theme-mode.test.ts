import { describe, expect, it } from "vitest"

import { resolveStoredThemeMode } from "@/lib/themes/resolve-theme-mode"

describe("resolveStoredThemeMode", () => {
  it("maps explicit and system theme storage to a concrete mode", () => {
    expect(resolveStoredThemeMode("light", true)).toBe("light")
    expect(resolveStoredThemeMode("dark", false)).toBe("dark")
    expect(resolveStoredThemeMode("system", true)).toBe("dark")
    expect(resolveStoredThemeMode("system", false)).toBe("light")
    expect(resolveStoredThemeMode(null, true)).toBe("dark")
  })
})
