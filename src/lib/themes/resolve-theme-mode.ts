export type ThemeMode = "light" | "dark"

/** Resolve the effective light/dark mode for CSS + token application. */
export function resolveThemeMode(
  root: HTMLElement,
  resolvedTheme?: string | null,
): ThemeMode {
  if (resolvedTheme === "dark") return "dark"
  if (resolvedTheme === "light") return "light"

  if (root.classList.contains("dark")) return "dark"
  if (root.classList.contains("light")) return "light"

  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  }

  return "light"
}

export function syncDocumentThemeClass(
  root: HTMLElement,
  mode: ThemeMode,
): void {
  root.classList.remove("light", "dark")
  root.classList.add(mode)
}

/** Matches the inline FOUC script — keep in sync with APPEARANCE_INIT_SCRIPT. */
export function resolveStoredThemeMode(
  storedTheme: string | null,
  prefersDark: boolean,
): ThemeMode {
  if (storedTheme === "dark") return "dark"
  if (storedTheme === "light") return "light"
  return prefersDark ? "dark" : "light"
}
