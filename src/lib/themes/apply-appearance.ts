import {
  APPEARANCE_STORAGE_KEYS,
  DEFAULT_APPEARANCE,
  type AppearanceState,
  type BrandPresetId,
  type FontPresetId,
  type NeutralPresetId,
  type RadiusPresetId,
} from "./types"
import {
  isBrandPresetId,
  isFontPresetId,
  isNeutralPresetId,
  isRadiusPresetId,
  parseAppearanceState,
  RADIUS_PRESETS,
} from "./registry"

const RADIUS_BY_ID = Object.fromEntries(
  RADIUS_PRESETS.map((preset) => [preset.id, preset.value]),
) as Record<RadiusPresetId, string>

export function applyAppearanceToDocument(state: AppearanceState) {
  const root = document.documentElement

  root.setAttribute("data-theme", state.palette)

  root.setAttribute(
    "data-neutral",
    state.neutral ?? DEFAULT_APPEARANCE.neutral ?? "stone",
  )

  root.setAttribute("data-font", state.font)
  root.setAttribute("data-radius", state.radius)
  root.style.setProperty("--radius-base", RADIUS_BY_ID[state.radius])
}

export function readAppearanceFromStorage(): AppearanceState {
  if (typeof window === "undefined") return DEFAULT_APPEARANCE

  try {
    return parseAppearanceState({
      palette: localStorage.getItem(APPEARANCE_STORAGE_KEYS.palette),
      neutral: localStorage.getItem(APPEARANCE_STORAGE_KEYS.neutral),
      font: localStorage.getItem(APPEARANCE_STORAGE_KEYS.font),
      radius: localStorage.getItem(APPEARANCE_STORAGE_KEYS.radius),
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
}

export function setPalette(palette: BrandPresetId) {
  if (!isBrandPresetId(palette)) return
  const next = { ...readAppearanceFromStorage(), palette }
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

/** Inline script string for FOUC prevention — injected in __root.tsx */
export const APPEARANCE_INIT_SCRIPT = `(function(){try{var p=localStorage.getItem("${APPEARANCE_STORAGE_KEYS.palette}")||"${DEFAULT_APPEARANCE.palette}";var n=localStorage.getItem("${APPEARANCE_STORAGE_KEYS.neutral}")||"${DEFAULT_APPEARANCE.neutral}";var f=localStorage.getItem("${APPEARANCE_STORAGE_KEYS.font}")||"${DEFAULT_APPEARANCE.font}";var r=localStorage.getItem("${APPEARANCE_STORAGE_KEYS.radius}")||"${DEFAULT_APPEARANCE.radius}";var rv={default:"0.625rem",soft:"0.875rem",sharp:"0.375rem"};var root=document.documentElement;root.setAttribute("data-theme",p);root.setAttribute("data-neutral",n);root.setAttribute("data-font",f);root.setAttribute("data-radius",r);root.style.setProperty("--radius-base",rv[r]||rv.default);var t=localStorage.getItem("theme");if(t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches)){root.classList.add("dark")}}catch(e){}})();`
