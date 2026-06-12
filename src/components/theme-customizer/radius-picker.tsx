"use client"

import { cn } from "@/lib/utils"
import { RADIUS_PRESETS } from "@/lib/themes/registry"
import type { RadiusPresetId } from "@/lib/themes/types"

type RadiusPickerProps = {
  activeRadius: RadiusPresetId
  onSelect: (radius: RadiusPresetId) => void
}

export function RadiusPicker({ activeRadius, onSelect }: RadiusPickerProps) {
  return (
    <div className="flex gap-2">
      {RADIUS_PRESETS.map((preset) => {
        const isActive = preset.id === activeRadius

        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset.id)}
            className={cn(
              "flex flex-1 flex-col items-center gap-2 rounded-lg border p-2 transition-colors",
              isActive
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border hover:bg-muted/50",
            )}
          >
            <span
              className="size-8 w-full border border-foreground/20 bg-muted/40"
              style={{ borderRadius: preset.value }}
            />
            <span className="text-xs font-medium">{preset.label}</span>
          </button>
        )
      })}
    </div>
  )
}
