"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { isValidHexColor, normalizeHex } from "@/features/brand-color/derive-brand-tokens"

type BrandColorPickerProps = {
  value: string | null
  onChange: (color: string) => void
  onClear: () => void
}

export function BrandColorPicker({
  value,
  onChange,
  onClear,
}: BrandColorPickerProps) {
  const [inputValue, setInputValue] = useState(value ?? "#2563EB")

  useEffect(() => {
    if (value) {
      setInputValue(value)
    }
  }, [value])

  const handleInputChange = (next: string) => {
    setInputValue(next)
    const normalized = normalizeHex(next)
    if (normalized) {
      onChange(normalized)
    }
  }

  const handleColorInputChange = (next: string) => {
    const normalized = normalizeHex(next)
    if (!normalized) return
    setInputValue(normalized)
    onChange(normalized)
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Tailor the portfolio and resume to a company&apos;s brand.
      </p>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={normalizeHex(inputValue) ?? "#2563EB"}
          onChange={(event) => handleColorInputChange(event.target.value)}
          aria-label="Pick brand color"
          className="size-9 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
        />
        <Input
          value={inputValue}
          onChange={(event) => handleInputChange(event.target.value)}
          placeholder="#2563EB"
          spellCheck={false}
          aria-label="Brand color hex value"
          className="font-mono text-xs uppercase"
        />
      </div>
      {value ? (
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          Reset to preset
        </Button>
      ) : (
        <p className="text-xs text-muted-foreground">
          {isValidHexColor(inputValue)
            ? "Custom brand color active while editing."
            : "Enter a valid hex color."}
        </p>
      )}
    </div>
  )
}
