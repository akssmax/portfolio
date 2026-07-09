"use client"

import { Type } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { FontPresetId } from "@/lib/themes/types"
import { cn } from "@/lib/utils"

import { RESUME_FONT_PRESET_OPTIONS } from "./resume-font-utils"

type ResumeFontSelectProps = {
  value: FontPresetId
  onChange: (font: FontPresetId) => void
  className?: string
}

export function ResumeFontSelect({ value, onChange, className }: ResumeFontSelectProps) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as FontPresetId)}>
      <SelectTrigger
        size="sm"
        className={cn("h-8 w-[min(148px,34vw)] gap-1.5 text-xs", className)}
        aria-label="Resume font"
      >
        <Type aria-hidden className="size-3.5 shrink-0 opacity-60" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {RESUME_FONT_PRESET_OPTIONS.map((preset) => (
          <SelectItem key={preset.id} value={preset.id}>
            {preset.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
