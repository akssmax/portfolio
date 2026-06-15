"use client"

import { cn } from "@/lib/utils"
import { COLOR_VISION_PRESETS } from "@/lib/themes/registry"
import type { ColorVisionPresetId } from "@/lib/themes/types"

type ColorVisionPickerProps = {
  activeColorVision: ColorVisionPresetId
  onSelect: (colorVision: ColorVisionPresetId) => void
}

export function ColorVisionPicker({
  activeColorVision,
  onSelect,
}: ColorVisionPickerProps) {
  return (
    <div className="space-y-1">
      {COLOR_VISION_PRESETS.map((preset) => {
        const isActive = preset.id === activeColorVision

        return (
          <button
            key={preset.id}
            type="button"
            aria-pressed={isActive}
            aria-label={`${preset.label}: ${preset.description}`}
            onClick={() => onSelect(preset.id)}
            className={cn(
              "flex w-full flex-col gap-0.5 rounded-md border px-3 py-2 text-left transition-colors",
              isActive
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-transparent hover:bg-muted/50",
            )}
          >
            <span className="text-sm font-medium">{preset.label}</span>
            <span className="text-xs text-muted-foreground">{preset.description}</span>
          </button>
        )
      })}
    </div>
  )
}
