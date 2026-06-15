import {
  BRAND_TOKEN_KEYS,
  brandDark,
  brandLight,
} from "@/lib/themes/theme-data"

const HEX_PATTERN = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/

export function isValidHexColor(value: string): boolean {
  return HEX_PATTERN.test(value.trim())
}

export function normalizeHex(value: string): string | null {
  const trimmed = value.trim()
  if (!HEX_PATTERN.test(trimmed)) return null

  if (trimmed.length === 4) {
    const [, r, g, b] = trimmed
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase()
  }

  return trimmed.toUpperCase()
}

export function deriveBrandTokens(
  primaryHex: string,
  isDark: boolean,
): Record<string, string> {
  const primary = normalizeHex(primaryHex)
  if (!primary) return {}

  const tokens = isDark ? brandDark(primary) : brandLight(primary)
  return Object.fromEntries(
    BRAND_TOKEN_KEYS.map((key) => [key, tokens[key] ?? ""]),
  )
}

export function applyCustomBrandTokens(
  root: HTMLElement,
  tokens: Record<string, string>,
) {
  for (const [key, value] of Object.entries(tokens)) {
    if (value) {
      root.style.setProperty(`--${key}`, value)
    }
  }
}

export function clearCustomBrandTokens(root: HTMLElement) {
  for (const key of BRAND_TOKEN_KEYS) {
    root.style.removeProperty(`--${key}`)
  }
}

/** Inline JS for FOUC prevention — must stay in sync with deriveBrandTokens */
export function buildCustomBrandInitScriptFragment(storageKey: string): string {
  const lightTokens = brandLight("var(--primary)")
  const darkTokens = brandDark("var(--primary)")

  const lightAssignments = BRAND_TOKEN_KEYS.filter((key) => key !== "primary")
    .map(
      (key) =>
        `root.style.setProperty("--${key}","${lightTokens[key].replace(/"/g, '\\"')}");`,
    )
    .join("")

  const darkAssignments = BRAND_TOKEN_KEYS.filter((key) => key !== "primary")
    .map(
      (key) =>
        `root.style.setProperty("--${key}","${darkTokens[key].replace(/"/g, '\\"')}");`,
    )
    .join("")

  return `var cb=localStorage.getItem("${storageKey}");if(cb&&/^#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/.test(cb)){if(cb.length===4){cb="#"+cb[1]+cb[1]+cb[2]+cb[2]+cb[3]+cb[3];}root.style.setProperty("--primary",cb);var isDark=root.classList.contains("dark");if(isDark){${darkAssignments}}else{${lightAssignments}}}`
}
