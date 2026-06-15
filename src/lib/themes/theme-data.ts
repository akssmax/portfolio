/**
 * OKLCH token sets for theme presets (light + dark).
 * Used by scripts/generate-theme-css.ts to emit CSS files.
 */

export type ThemeTokens = Record<string, string>

export type ThemePresetData = {
  id: string
  label: string
  swatch: string
  description?: string
  category: "brand" | "neutral"
  light: ThemeTokens
  dark: ThemeTokens
}

const NEUTRAL_TOKEN_KEYS = [
  "background",
  "foreground",
  "section",
  "section-foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "muted",
  "muted-foreground",
  "border",
  "input",
  "sidebar",
  "sidebar-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
] as const

export const BRAND_TOKEN_KEYS = [
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-ring",
] as const

export const NEUTRAL_THEME_PRESET_IDS = new Set([
  "zinc",
  "slate",
  "stone",
  "gray",
  "neutral",
])

function n(partial: Partial<ThemeTokens>): ThemeTokens {
  return partial as ThemeTokens
}

function nd(partial: Partial<ThemeTokens>): ThemeTokens {
  return partial as ThemeTokens
}

export function brandLight(
  primary: string,
  partial: Partial<ThemeTokens> = {},
): ThemeTokens {
  return {
    primary,
    "primary-foreground":
      partial["primary-foreground"] ?? "oklch(0.985 0 0)",
    secondary:
      partial.secondary ??
      "color-mix(in oklch, var(--primary) 14%, oklch(0.965 0.012 0))",
    "secondary-foreground":
      partial["secondary-foreground"] ??
      "color-mix(in oklch, var(--primary) 72%, oklch(0.22 0.02 0))",
    accent:
      partial.accent ??
      "color-mix(in oklch, var(--primary) 10%, oklch(0.975 0.045 145))",
    "accent-foreground":
      partial["accent-foreground"] ??
      "color-mix(in oklch, var(--primary) 68%, oklch(0.28 0.06 145))",
    destructive: partial.destructive ?? "var(--primary)",
    ring: partial.ring ?? "var(--primary)",
    "chart-1": partial["chart-1"] ?? "var(--primary)",
    "chart-2": partial["chart-2"] ?? "var(--secondary)",
    "chart-3": partial["chart-3"] ?? "var(--accent)",
    "sidebar-primary": partial["sidebar-primary"] ?? "var(--primary)",
    "sidebar-primary-foreground":
      partial["sidebar-primary-foreground"] ?? "oklch(0.985 0 0)",
    "sidebar-ring": partial["sidebar-ring"] ?? "var(--primary)",
    ...partial,
  } as ThemeTokens
}

export function brandDark(
  primary: string,
  partial: Partial<ThemeTokens> = {},
): ThemeTokens {
  return {
    primary,
    "primary-foreground":
      partial["primary-foreground"] ?? "oklch(0.985 0 0)",
    secondary:
      partial.secondary ??
      "color-mix(in oklch, var(--primary) 18%, oklch(0.24 0.02 0))",
    "secondary-foreground":
      partial["secondary-foreground"] ?? "oklch(0.985 0 0)",
    accent:
      partial.accent ??
      "color-mix(in oklch, var(--primary) 22%, oklch(0.28 0.04 145))",
    "accent-foreground":
      partial["accent-foreground"] ?? "oklch(0.985 0 0)",
    destructive: partial.destructive ?? "var(--primary)",
    ring: partial.ring ?? "var(--primary)",
    "chart-1": partial["chart-1"] ?? "var(--primary)",
    "chart-2": partial["chart-2"] ?? "var(--secondary)",
    "chart-3": partial["chart-3"] ?? "var(--accent)",
    "sidebar-primary": partial["sidebar-primary"] ?? "var(--primary)",
    "sidebar-primary-foreground":
      partial["sidebar-primary-foreground"] ?? "oklch(0.985 0 0)",
    "sidebar-ring": partial["sidebar-ring"] ?? "var(--primary)",
    ...partial,
  } as ThemeTokens
}

const TOKEN_KEYS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
] as const

/** Non-default presets — default.css is hand-authored separately */
export const THEME_PRESET_DATA: ThemePresetData[] = [
  {
    id: "zinc",
    label: "Zinc",
    category: "neutral",
    swatch: "oklch(0.552 0.016 285.938)",
    light: n({
      background: "oklch(1 0 0)",
      foreground: "oklch(0.141 0.005 285.823)",
      card: "oklch(0.985 0 0)",
      "card-foreground": "oklch(0.141 0.005 285.823)",
      popover: "oklch(1 0 0)",
      "popover-foreground": "oklch(0.141 0.005 285.823)",
      muted: "oklch(0.967 0.001 286.375)",
      "muted-foreground": "oklch(0.552 0.016 285.938)",
      border: "oklch(0.92 0.004 286.32)",
      input: "oklch(0.92 0.004 286.32)",
      sidebar: "oklch(0.985 0 0)",
      "sidebar-foreground": "oklch(0.141 0.005 285.823)",
      "sidebar-accent": "oklch(0.967 0.001 286.375)",
      "sidebar-accent-foreground": "oklch(0.21 0.006 285.885)",
      "sidebar-border": "oklch(0.92 0.004 286.32)",
    }),
    dark: nd({
      background: "oklch(0.141 0.005 285.823)",
      foreground: "oklch(0.985 0 0)",
      card: "oklch(0.21 0.006 285.885)",
      "card-foreground": "oklch(0.985 0 0)",
      popover: "oklch(0.21 0.006 285.885)",
      "popover-foreground": "oklch(0.985 0 0)",
      muted: "oklch(0.274 0.006 286.033)",
      "muted-foreground": "oklch(0.705 0.015 286.067)",
      border: "oklch(1 0 0 / 10%)",
      input: "oklch(1 0 0 / 15%)",
      sidebar: "oklch(0.21 0.006 285.885)",
      "sidebar-foreground": "oklch(0.985 0 0)",
      "sidebar-accent": "oklch(0.274 0.006 286.033)",
      "sidebar-accent-foreground": "oklch(0.985 0 0)",
      "sidebar-border": "oklch(1 0 0 / 10%)",
    }),
  },
  {
    id: "slate",
    label: "Slate",
    category: "neutral",
    swatch: "oklch(0.554 0.046 257.417)",
    light: n({
      background: "oklch(1 0 0)",
      foreground: "oklch(0.129 0.042 264.695)",
      card: "oklch(0.984 0.003 247.858)",
      "card-foreground": "oklch(0.129 0.042 264.695)",
      popover: "oklch(1 0 0)",
      "popover-foreground": "oklch(0.129 0.042 264.695)",
      muted: "oklch(0.968 0.007 247.896)",
      "muted-foreground": "oklch(0.554 0.046 257.417)",
      border: "oklch(0.929 0.013 255.508)",
      input: "oklch(0.929 0.013 255.508)",
      sidebar: "oklch(0.984 0.003 247.858)",
      "sidebar-foreground": "oklch(0.129 0.042 264.695)",
      "sidebar-accent": "oklch(0.968 0.007 247.896)",
      "sidebar-accent-foreground": "oklch(0.208 0.042 265.755)",
      "sidebar-border": "oklch(0.929 0.013 255.508)",
    }),
    dark: nd({
      background: "oklch(0.129 0.042 264.695)",
      foreground: "oklch(0.984 0.003 247.858)",
      card: "oklch(0.208 0.042 265.755)",
      "card-foreground": "oklch(0.984 0.003 247.858)",
      popover: "oklch(0.208 0.042 265.755)",
      "popover-foreground": "oklch(0.984 0.003 247.858)",
      muted: "oklch(0.279 0.041 260.031)",
      "muted-foreground": "oklch(0.704 0.04 256.788)",
      border: "oklch(1 0 0 / 10%)",
      input: "oklch(1 0 0 / 15%)",
      sidebar: "oklch(0.208 0.042 265.755)",
      "sidebar-foreground": "oklch(0.984 0.003 247.858)",
      "sidebar-accent": "oklch(0.279 0.041 260.031)",
      "sidebar-accent-foreground": "oklch(0.984 0.003 247.858)",
      "sidebar-border": "oklch(1 0 0 / 10%)",
    }),
  },
  {
    id: "stone",
    label: "Stone",
    category: "neutral",
    swatch: "oklch(0.553 0.013 58.071)",
    light: n({
      background: "oklch(1 0 0)",
      foreground: "oklch(0.147 0.004 49.25)",
      card: "oklch(0.985 0.001 106.423)",
      "card-foreground": "oklch(0.147 0.004 49.25)",
      popover: "oklch(1 0 0)",
      "popover-foreground": "oklch(0.147 0.004 49.25)",
      muted: "oklch(0.97 0.001 106.424)",
      "muted-foreground": "oklch(0.553 0.013 58.071)",
      border: "oklch(0.923 0.003 48.717)",
      input: "oklch(0.923 0.003 48.717)",
      sidebar: "oklch(0.985 0.001 106.423)",
      "sidebar-foreground": "oklch(0.147 0.004 49.25)",
      "sidebar-accent": "oklch(0.97 0.001 106.424)",
      "sidebar-accent-foreground": "oklch(0.216 0.006 56.043)",
      "sidebar-border": "oklch(0.923 0.003 48.717)",
    }),
    dark: nd({
      background: "oklch(0.147 0.004 49.25)",
      foreground: "oklch(0.985 0.001 106.423)",
      card: "oklch(0.216 0.006 56.043)",
      "card-foreground": "oklch(0.985 0.001 106.423)",
      popover: "oklch(0.216 0.006 56.043)",
      "popover-foreground": "oklch(0.985 0.001 106.423)",
      muted: "oklch(0.268 0.007 34.298)",
      "muted-foreground": "oklch(0.709 0.01 56.259)",
      border: "oklch(1 0 0 / 10%)",
      input: "oklch(1 0 0 / 15%)",
      sidebar: "oklch(0.216 0.006 56.043)",
      "sidebar-foreground": "oklch(0.985 0.001 106.423)",
      "sidebar-accent": "oklch(0.268 0.007 34.298)",
      "sidebar-accent-foreground": "oklch(0.985 0.001 106.423)",
      "sidebar-border": "oklch(1 0 0 / 10%)",
    }),
  },
  {
    id: "gray",
    label: "Gray",
    category: "neutral",
    swatch: "oklch(0.551 0.027 264.364)",
    light: n({
      background: "oklch(1 0 0)",
      foreground: "oklch(0.13 0.028 261.692)",
      card: "oklch(0.985 0.002 247.839)",
      "card-foreground": "oklch(0.13 0.028 261.692)",
      popover: "oklch(1 0 0)",
      "popover-foreground": "oklch(0.13 0.028 261.692)",
      muted: "oklch(0.967 0.003 264.542)",
      "muted-foreground": "oklch(0.551 0.027 264.364)",
      border: "oklch(0.928 0.006 264.531)",
      input: "oklch(0.928 0.006 264.531)",
      sidebar: "oklch(0.985 0.002 247.839)",
      "sidebar-foreground": "oklch(0.13 0.028 261.692)",
      "sidebar-accent": "oklch(0.967 0.003 264.542)",
      "sidebar-accent-foreground": "oklch(0.21 0.034 264.665)",
      "sidebar-border": "oklch(0.928 0.006 264.531)",
    }),
    dark: nd({
      background: "oklch(0.13 0.028 261.692)",
      foreground: "oklch(0.985 0.002 247.839)",
      card: "oklch(0.21 0.034 264.665)",
      "card-foreground": "oklch(0.985 0.002 247.839)",
      popover: "oklch(0.21 0.034 264.665)",
      "popover-foreground": "oklch(0.985 0.002 247.839)",
      muted: "oklch(0.278 0.033 256.848)",
      "muted-foreground": "oklch(0.707 0.022 261.325)",
      border: "oklch(1 0 0 / 10%)",
      input: "oklch(1 0 0 / 15%)",
      sidebar: "oklch(0.21 0.034 264.665)",
      "sidebar-foreground": "oklch(0.985 0.002 247.839)",
      "sidebar-accent": "oklch(0.278 0.033 256.848)",
      "sidebar-accent-foreground": "oklch(0.985 0.002 247.839)",
      "sidebar-border": "oklch(1 0 0 / 10%)",
    }),
  },
  {
    id: "neutral",
    label: "Neutral",
    category: "neutral",
    swatch: "oklch(0.556 0 0)",
    light: n({
      background: "oklch(1 0 0)",
      foreground: "oklch(0.145 0 0)",
      card: "oklch(0.985 0 0)",
      "card-foreground": "oklch(0.145 0 0)",
      popover: "oklch(1 0 0)",
      "popover-foreground": "oklch(0.145 0 0)",
      muted: "oklch(0.97 0 0)",
      "muted-foreground": "oklch(0.556 0 0)",
      border: "oklch(0.922 0 0)",
      input: "oklch(0.922 0 0)",
      sidebar: "oklch(0.985 0 0)",
      "sidebar-foreground": "oklch(0.145 0 0)",
      "sidebar-accent": "oklch(0.97 0 0)",
      "sidebar-accent-foreground": "oklch(0.205 0 0)",
      "sidebar-border": "oklch(0.922 0 0)",
    }),
    dark: nd({
      background: "oklch(0.145 0 0)",
      foreground: "oklch(0.985 0 0)",
      card: "oklch(0.205 0 0)",
      "card-foreground": "oklch(0.985 0 0)",
      popover: "oklch(0.205 0 0)",
      "popover-foreground": "oklch(0.985 0 0)",
      muted: "oklch(0.269 0 0)",
      "muted-foreground": "oklch(0.708 0 0)",
      border: "oklch(1 0 0 / 10%)",
      input: "oklch(1 0 0 / 15%)",
      sidebar: "oklch(0.205 0 0)",
      "sidebar-foreground": "oklch(0.985 0 0)",
      "sidebar-accent": "oklch(0.269 0 0)",
      "sidebar-accent-foreground": "oklch(0.985 0 0)",
      "sidebar-border": "oklch(1 0 0 / 10%)",
    }),
  },
  {
    id: "red",
    label: "Red",
    category: "brand",
    swatch: "oklch(0.577 0.245 27.325)",
    light: brandLight("oklch(0.577 0.245 27.325)"),
    dark: brandDark("oklch(0.704 0.191 22.216)"),
  },
  {
    id: "rose",
    label: "Rose",
    category: "brand",
    swatch: "oklch(0.586 0.253 17.585)",
    light: brandLight("oklch(0.586 0.253 17.585)"),
    dark: brandDark("oklch(0.712 0.194 13.428)"),
  },
  {
    id: "orange",
    label: "Orange",
    category: "brand",
    swatch: "oklch(0.705 0.213 47.604)",
    light: brandLight("oklch(0.705 0.213 47.604)"),
    dark: brandDark("oklch(0.75 0.183 55.934)"),
  },
  {
    id: "amber",
    label: "Amber",
    category: "brand",
    swatch: "oklch(0.769 0.188 70.08)",
    light: brandLight("oklch(0.769 0.188 70.08)", {
      "primary-foreground": "oklch(0.279 0.077 45.635)",
    }),
    dark: brandDark("oklch(0.828 0.189 84.429)", {
      "primary-foreground": "oklch(0.279 0.077 45.635)",
    }),
  },
  {
    id: "yellow",
    label: "Yellow",
    category: "brand",
    swatch: "oklch(0.852 0.199 91.936)",
    light: brandLight("oklch(0.852 0.199 91.936)", {
      "primary-foreground": "oklch(0.279 0.077 45.635)",
    }),
    dark: brandDark("oklch(0.852 0.199 91.936)", {
      "primary-foreground": "oklch(0.279 0.077 45.635)",
    }),
  },
  {
    id: "lime",
    label: "Lime",
    category: "brand",
    swatch: "oklch(0.768 0.233 130.85)",
    light: brandLight("oklch(0.768 0.233 130.85)", {
      "primary-foreground": "oklch(0.266 0.065 152.934)",
    }),
    dark: brandDark("oklch(0.768 0.233 130.85)", {
      "primary-foreground": "oklch(0.266 0.065 152.934)",
    }),
  },
  {
    id: "green",
    label: "Green",
    category: "brand",
    swatch: "oklch(0.648 0.2 131.684)",
    light: brandLight("oklch(0.648 0.2 131.684)"),
    dark: brandDark("oklch(0.696 0.17 162.48)"),
  },
  {
    id: "emerald",
    label: "Emerald",
    category: "brand",
    swatch: "oklch(0.696 0.17 162.48)",
    light: brandLight("oklch(0.696 0.17 162.48)"),
    dark: brandDark("oklch(0.765 0.177 163.223)"),
  },
  {
    id: "teal",
    label: "Teal",
    category: "brand",
    swatch: "oklch(0.6 0.118 184.704)",
    light: brandLight("oklch(0.6 0.118 184.704)"),
    dark: brandDark("oklch(0.777 0.152 181.912)"),
  },
  {
    id: "cyan",
    label: "Cyan",
    category: "brand",
    swatch: "oklch(0.715 0.143 215.221)",
    light: brandLight("oklch(0.715 0.143 215.221)"),
    dark: brandDark("oklch(0.789 0.154 211.53)"),
  },
  {
    id: "sky",
    label: "Sky",
    category: "brand",
    swatch: "oklch(0.685 0.169 237.323)",
    light: brandLight("oklch(0.685 0.169 237.323)"),
    dark: brandDark("oklch(0.746 0.16 232.661)"),
  },
  {
    id: "blue",
    label: "Blue",
    category: "brand",
    swatch: "oklch(0.623 0.214 259.815)",
    light: brandLight("oklch(0.623 0.214 259.815)"),
    dark: brandDark("oklch(0.707 0.165 254.624)"),
  },
  {
    id: "indigo",
    label: "Indigo",
    category: "brand",
    swatch: "oklch(0.585 0.233 277.117)",
    light: brandLight("oklch(0.585 0.233 277.117)"),
    dark: brandDark("oklch(0.673 0.182 276.935)"),
  },
  {
    id: "violet",
    label: "Violet",
    category: "brand",
    swatch: "oklch(0.606 0.25 292.717)",
    light: brandLight("oklch(0.606 0.25 292.717)"),
    dark: brandDark("oklch(0.702 0.183 293.541)"),
  },
  {
    id: "purple",
    label: "Purple",
    category: "brand",
    swatch: "oklch(0.627 0.265 303.9)",
    light: brandLight("oklch(0.627 0.265 303.9)"),
    dark: brandDark("oklch(0.714 0.203 305.504)"),
  },
  {
    id: "fuchsia",
    label: "Fuchsia",
    category: "brand",
    swatch: "oklch(0.667 0.295 322.15)",
    light: brandLight("oklch(0.667 0.295 322.15)"),
    dark: brandDark("oklch(0.738 0.211 322.762)"),
  },
  {
    id: "pink",
    label: "Pink",
    category: "brand",
    swatch: "oklch(0.656 0.241 354.308)",
    light: brandLight("oklch(0.656 0.241 354.308)"),
    dark: brandDark("oklch(0.725 0.175 349.761)"),
  },
  {
    id: "claude",
    label: "Claude",
    category: "brand",
    swatch: "oklch(0.646 0.222 41.116)",
    light: brandLight("oklch(0.646 0.222 41.116)", {
      background: "oklch(0.985 0.008 75)",
      card: "oklch(0.975 0.012 75)",
    }),
    dark: brandDark("oklch(0.704 0.191 22.216)", {
      background: "oklch(0.18 0.02 50)",
      card: "oklch(0.22 0.025 50)",
    }),
  },
  {
    id: "vercel",
    label: "Vercel",
    category: "brand",
    swatch: "oklch(0.205 0 0)",
    light: brandLight("oklch(0.205 0 0)", {
      "primary-foreground": "oklch(0.985 0 0)",
    }),
    dark: brandDark("oklch(0.985 0 0)", {
      "primary-foreground": "oklch(0.205 0 0)",
    }),
  },
]

export { TOKEN_KEYS }

function enrichNeutralTokens(
  tokens: ThemeTokens,
  mode: "light" | "dark",
): ThemeTokens {
  if (mode === "light") {
    return {
      ...tokens,
      section: tokens.section ?? tokens.muted,
      "section-foreground":
        tokens["section-foreground"] ?? tokens.foreground,
    }
  }

  return {
    ...tokens,
    section: tokens.section ?? tokens.muted,
    "section-foreground":
      tokens["section-foreground"] ?? tokens.foreground,
  }
}

function getOutputKeys(preset: ThemePresetData, tokens: ThemeTokens): string[] {
  if (preset.category === "neutral") {
    return NEUTRAL_TOKEN_KEYS.filter((key) => key in tokens)
  }

  const keys = new Set<string>(
    BRAND_TOKEN_KEYS.filter((key) => key in tokens),
  )

  for (const key of NEUTRAL_TOKEN_KEYS) {
    if (key in tokens) keys.add(key)
  }

  return [...keys]
}

function tokensToCssBlock(
  selector: string,
  tokens: ThemeTokens,
  keys: string[],
): string {
  const lines = keys.map((key) => `  --${key}: ${tokens[key]};`).join("\n")
  return `${selector} {\n${lines}\n}`
}

export function generateThemeCss(preset: ThemePresetData): string {
  const lightTokens =
    preset.category === "neutral"
      ? enrichNeutralTokens(preset.light, "light")
      : preset.light
  const darkTokens =
    preset.category === "neutral"
      ? enrichNeutralTokens(preset.dark, "dark")
      : preset.dark

  const lightKeys = getOutputKeys(preset, lightTokens)
  const darkKeys = getOutputKeys(preset, darkTokens)

  const attr = preset.category === "neutral" ? "data-neutral" : "data-theme"

  return [
    tokensToCssBlock(`[${attr}="${preset.id}"]`, lightTokens, lightKeys),
    tokensToCssBlock(`.dark[${attr}="${preset.id}"]`, darkTokens, darkKeys),
  ].join("\n\n")
}

export function generateAllPresetsCss(): string {
  return THEME_PRESET_DATA.map(generateThemeCss).join("\n\n")
}
