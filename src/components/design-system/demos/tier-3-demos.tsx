"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { useState } from "react"

export function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border"
    />
  )
}

export function SonnerDemo() {
  return (
  <>
      <Button
        variant="outline"
        onClick={() => toast("Event has been created")}
      >
        Show toast
      </Button>
      <Toaster />
    </>
  )
}

export function LabelDemo() {
  return (
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <p className="text-sm text-muted-foreground" id="name">
        Label associated with form controls.
      </p>
    </div>
  )
}

export function ProviderNoteDemo({ name }: { name: string }) {
  return (
    <p className="text-sm text-muted-foreground">
      {name} requires additional providers or context. See component source in{" "}
      <code className="rounded bg-muted px-1 py-0.5 text-xs">
        src/components/ui/{name}.tsx
      </code>
      .
    </p>
  )
}
