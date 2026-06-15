import {
  applyCustomBrandTokens,
  buildCustomBrandInitScriptFragment,
  clearCustomBrandTokens,
  deriveBrandTokens,
} from "@/features/brand-color/derive-brand-tokens"
import {
  applyColorVisionTokens,
  buildColorVisionInitScriptFragment,
  clearColorVisionTokens,
} from "@/lib/themes/color-vision-tokens"
import { buildFaviconInitScriptFragment, syncFavicon } from "@/lib/brand/monogram-mark"
import {
  APPEARANCE_STORAGE_KEYS,
  DEFAULT_APPEARANCE,
  type AppearanceState,
  type BrandPresetId,
  type FontPresetId,
  type NeutralPresetId,
  type RadiusPresetId,
  type FontScalePresetId,
} from "./types"
import {
  isBrandPresetId,
  isFontPresetId,
  isNeutralPresetId,
  isRadiusPresetId,
  parseAppearanceState,
  RADIUS_PRESETS,
  FONT_SCALE_PRESETS,
} from "./registry"

const RADIUS_BY_ID = Object.fromEntries(
  RADIUS_PRESETS.map((preset) => [preset.id, preset.value]),
) as Record<RadiusPresetId, string>

const FONT_SCALE_BY_ID = Object.fromEntries(
  FONT_SCALE_PRESETS.map((preset) => [preset.id, String(preset.scale)]),
) as Record<FontScalePresetId, string>

function isDarkMode(root: HTMLElement): boolean {
  if (root.classList.contains("dark")) return true
  if (root.classList.contains("light")) return false

  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

function applyCustomBrandColor(root: HTMLElement, customBrandColor: string | null) {
  if (customBrandColor) {
    applyCustomBrandTokens(
      root,
      deriveBrandTokens(customBrandColor, isDarkMode(root)),
    )
    return
  }

  clearCustomBrandTokens(root)
}

export function applyAppearanceToDocument(state: AppearanceState) {
  const root = document.documentElement

  root.setAttribute("data-theme", state.palette)

  root.setAttribute(
    "data-neutral",
    state.neutral ?? DEFAULT_APPEARANCE.neutral ?? "stone",
  )

  root.setAttribute("data-font", state.font)
  root.setAttribute("data-radius", state.radius)
  root.setAttribute("data-color-vision", state.colorVision)
  root.setAttribute("data-font-scale", state.fontScale)
  root.style.setProperty("--radius-base", RADIUS_BY_ID[state.radius])
  root.style.setProperty("--font-scale", FONT_SCALE_BY_ID[state.fontScale])

  const isDark = isDarkMode(root)
  clearColorVisionTokens(root)
  applyCustomBrandColor(root, state.customBrandColor)
  if (state.colorVision !== "none") {
    applyColorVisionTokens(root, state.colorVision, isDark)
  }

  syncFavicon(isDark)
}

export function readAppearanceFromStorage(): AppearanceState {
  if (typeof window === "undefined") return DEFAULT_APPEARANCE

  try {
    return parseAppearanceState({
      palette: localStorage.getItem(APPEARANCE_STORAGE_KEYS.palette),
      neutral: localStorage.getItem(APPEARANCE_STORAGE_KEYS.neutral),
      font: localStorage.getItem(APPEARANCE_STORAGE_KEYS.font),
      radius: localStorage.getItem(APPEARANCE_STORAGE_KEYS.radius),
      customBrandColor: localStorage.getItem(
        APPEARANCE_STORAGE_KEYS.customBrandColor,
      ),
      colorVision: localStorage.getItem(APPEARANCE_STORAGE_KEYS.colorVision),
      fontScale: localStorage.getItem(APPEARANCE_STORAGE_KEYS.fontScale),
    })
  } catch {
    return DEFAULT_APPEARANCE
  }
}

export function writeAppearanceToStorage(state: AppearanceState) {
  localStorage.setItem(APPEARANCE_STORAGE_KEYS.palette, state.palette)
  if (state.neutral) {
    localStorage.setItem(APPEARANCE_STORAGE_KEYS.neutral, state.neutral)
  } else {
    localStorage.removeItem(APPEARANCE_STORAGE_KEYS.neutral)
  }
  localStorage.setItem(APPEARANCE_STORAGE_KEYS.font, state.font)
  localStorage.setItem(APPEARANCE_STORAGE_KEYS.radius, state.radius)
  if (state.customBrandColor) {
    localStorage.setItem(
      APPEARANCE_STORAGE_KEYS.customBrandColor,
      state.customBrandColor,
    )
  } else {
    localStorage.removeItem(APPEARANCE_STORAGE_KEYS.customBrandColor)
  }
  localStorage.setItem(APPEARANCE_STORAGE_KEYS.colorVision, state.colorVision)
  localStorage.setItem(APPEARANCE_STORAGE_KEYS.fontScale, state.fontScale)
}

export function setPalette(palette: BrandPresetId) {
  if (!isBrandPresetId(palette)) return
  const next = { ...readAppearanceFromStorage(), palette, customBrandColor: null }
  writeAppearanceToStorage(next)
  applyAppearanceToDocument(next)
  return next
}

export function setNeutral(neutral: NeutralPresetId | null) {
  if (neutral !== null && !isNeutralPresetId(neutral)) return
  const next = { ...readAppearanceFromStorage(), neutral }
  writeAppearanceToStorage(next)
  applyAppearanceToDocument(next)
  return next
}

export function setFont(font: FontPresetId) {
  if (!isFontPresetId(font)) return
  const next = { ...readAppearanceFromStorage(), font }
  writeAppearanceToStorage(next)
  applyAppearanceToDocument(next)
  return next
}

export function setRadius(radius: RadiusPresetId) {
  if (!isRadiusPresetId(radius)) return
  const next = { ...readAppearanceFromStorage(), radius }
  writeAppearanceToStorage(next)
  applyAppearanceToDocument(next)
  return next
}

const CUSTOM_BRAND_INIT = buildCustomBrandInitScriptFragment(
  APPEARANCE_STORAGE_KEYS.customBrandColor,
)

const COLOR_VISION_INIT = buildColorVisionInitScriptFragment(
  APPEARANCE_STORAGE_KEYS.colorVision,
)

const FAVICON_INIT = buildFaviconInitScriptFragment()

/** Inline script string for FOUC prevention — injected in __root.tsx */
export const APPEARANCE_INIT_SCRIPT = `(function(){try{var p=localStorage.getItem("${APPEARANCE_STORAGE_KEYS.palette}")||"${DEFAULT_APPEARANCE.palette}";var n=localStorage.getItem("${APPEARANCE_STORAGE_KEYS.neutral}")||"${DEFAULT_APPEARANCE.neutral}";var f=localStorage.getItem("${APPEARANCE_STORAGE_KEYS.font}")||"${DEFAULT_APPEARANCE.font}";var r=localStorage.getItem("${APPEARANCE_STORAGE_KEYS.radius}")||"${DEFAULT_APPEARANCE.radius}";var cv=localStorage.getItem("${APPEARANCE_STORAGE_KEYS.colorVision}")||"${DEFAULT_APPEARANCE.colorVision}";var fs=localStorage.getItem("${APPEARANCE_STORAGE_KEYS.fontScale}")||"${DEFAULT_APPEARANCE.fontScale}";var rv={default:"0.625rem",soft:"0.875rem",sharp:"0.375rem"};var fsv={"100":"1","112":"1.12","125":"1.25","150":"1.5"};var root=document.documentElement;root.setAttribute("data-theme",p);root.setAttribute("data-neutral",n);root.setAttribute("data-font",f);root.setAttribute("data-radius",r);root.setAttribute("data-color-vision",cv);root.setAttribute("data-font-scale",fs);root.style.setProperty("--radius-base",rv[r]||rv.default);root.style.setProperty("--font-scale",fsv[fs]||fsv["100"]);var t=localStorage.getItem("theme");if(t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches)){root.classList.add("dark")};${CUSTOM_BRAND_INIT}${COLOR_VISION_INIT}${FAVICON_INIT}}catch(e){}})();`
