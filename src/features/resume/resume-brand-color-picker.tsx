"use client"

import { useEffect, useMemo, useState } from "react"
import { Palette } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  isValidHexColor,
  normalizeHex,
} from "@/features/brand-color/derive-brand-tokens"
import type { BrandPresetId } from "@/lib/themes/types"
import { cn } from "@/lib/utils"

import {
  RESUME_BRAND_PRESETS,
  resolveResumeBrandColor,
  type ResumeBrandColorSelection,
} from "./resume-brand-color-utils"

export type { ResumeBrandColorSelection } from "./resume-brand-color-utils"
export {
  getResumeColorSelectionKey,
  isResumeBrandColorValid,
  resolveResumeBrandColor,
} from "./resume-brand-color-utils"

type ResumeBrandColorPickerProps = {
  value: ResumeBrandColorSelection
  onChange: (value: ResumeBrandColorSelection) => void
  fallbackColor: string
  onResolvedColorChange?: (hex: string) => void
}

export function ResumeBrandColorPicker({
  value,
  onChange,
  fallbackColor,
  onResolvedColorChange,
}: ResumeBrandColorPickerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const resolvedColor = useMemo(
    () => (mounted ? resolveResumeBrandColor(value, fallbackColor) : fallbackColor),
    [value, fallbackColor, mounted],
  )

  useEffect(() => {
    onResolvedColorChange?.(resolvedColor)
  }, [resolvedColor, onResolvedColorChange])

  const selectPreset = (presetId: BrandPresetId) => {
    onChange({ type: "preset", presetId })
  }

  const selectCustom = () => {
    onChange({
      type: "custom",
      hex:
        value.type === "custom"
          ? value.hex
          : normalizeHex(resolvedColor) ?? fallbackColor,
    })
  }

  const updateCustomHex = (hex: string) => {
    onChange({ type: "custom", hex })
  }

  const customHex =
    value.type === "custom"
      ? value.hex
      : normalizeHex(resolvedColor) ?? fallbackColor

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {RESUME_BRAND_PRESETS.map((preset) => {
          const isActive = value.type === "preset" && value.presetId === preset.id

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => selectPreset(preset.id as BrandPresetId)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-lg border p-2 text-center transition-colors",
                isActive
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-foreground/20 hover:bg-muted/50",
              )}
              title={preset.description ?? preset.label}
            >
              <span
                className="size-6 shrink-0 rounded-full ring-1 ring-foreground/10"
                style={{ backgroundColor: preset.swatch }}
              />
              <span className="w-full truncate text-[10px] font-medium leading-tight">
                {preset.label}
              </span>
            </button>
          )
        })}

        <button
          type="button"
          onClick={selectCustom}
          className={cn(
            "flex flex-col items-center gap-1.5 rounded-lg border p-2 text-center transition-colors",
            value.type === "custom"
              ? "border-primary bg-primary/5 ring-1 ring-primary"
              : "border-dashed border-border hover:border-foreground/20 hover:bg-muted/50",
          )}
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40">
            <Palette className="size-3.5 text-muted-foreground" />
          </span>
          <span className="w-full truncate text-[10px] font-medium leading-tight">
            Custom
          </span>
        </button>
      </div>

      {value.type === "custom" ? (
        <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-3">
          <Label htmlFor="resume-brand-color-custom">Custom hex</Label>
          <div className="flex items-center gap-2">
            <input
              id="resume-brand-color-custom"
              type="color"
              value={normalizeHex(customHex) ?? fallbackColor}
              onChange={(event) => updateCustomHex(event.target.value)}
              aria-label="Pick custom resume brand color"
              className="size-9 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
            />
            <Input
              value={customHex}
              onChange={(event) => updateCustomHex(event.target.value)}
              placeholder="#2563EB"
              spellCheck={false}
              aria-label="Custom resume brand color hex value"
              className="font-mono text-xs uppercase"
            />
          </div>
          {!isValidHexColor(customHex) ? (
            <p className="text-xs text-destructive">Enter a valid hex color.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
