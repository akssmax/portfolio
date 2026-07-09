"use client"

import type { ResumeDisplayPreferences } from "./resume-display-preferences"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

type ResumeDisplayControlsProps = {
  display: ResumeDisplayPreferences
  onChange: (display: ResumeDisplayPreferences) => void
}

function IconToggleRow({
  id,
  title,
  description,
  checked,
  onCheckedChange,
}: {
  id: string
  title: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background px-3 py-3">
      <div className="min-w-0 space-y-1">
        <Label htmlFor={id} className="text-sm font-medium text-foreground">
          {title}
        </Label>
        <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={title}
      />
    </div>
  )
}

export function ResumeDisplayControls({
  display,
  onChange,
}: ResumeDisplayControlsProps) {
  const update = (patch: Partial<ResumeDisplayPreferences>) => {
    onChange({ ...display, ...patch })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Icons</p>
        <IconToggleRow
          id="resume-show-contact-icons"
          title="Contact icons"
          description="Show Lucide icons beside email, phone, and links."
          checked={display.showContactIcons}
          onCheckedChange={(checked) => update({ showContactIcons: checked })}
        />
        <IconToggleRow
          id="resume-show-section-icons"
          title="Section icons"
          description="Replace accent dots with icons on section headings."
          checked={display.showSectionIcons}
          onCheckedChange={(checked) => update({ showSectionIcons: checked })}
        />
      </div>
    </div>
  )
}
