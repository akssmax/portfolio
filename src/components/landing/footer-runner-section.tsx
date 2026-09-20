"use client"

import { profile } from "@/lib/profile"

export function FooterRunnerSection() {
  return (
    <div className="flex flex-col gap-3 border-t border-border py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <p>© {new Date().getFullYear()} {profile.name}</p>
      <p>{profile.location}</p>
    </div>
  )
}
