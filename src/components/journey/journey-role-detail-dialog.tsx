"use client"

import { ExternalLink } from "lucide-react"
import { Link } from "@tanstack/react-router"

import { CompanyLogo } from "@/components/shared/company-logo"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { DeckExperienceItem } from "@/lib/intro/types"

type JourneyRoleDetailDialogProps = {
  item: DeckExperienceItem | null
  projectSlug?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JourneyRoleDetailDialog({
  item,
  projectSlug,
  open,
  onOpenChange,
}: JourneyRoleDetailDialogProps) {
  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(85dvh,720px)] overflow-y-auto border-border/80 bg-background/95 p-0 sm:max-w-xl">
        <div className="border-b border-border/60 bg-gradient-to-br from-violet-500/10 via-primary/5 to-fuchsia-500/10 p-6 pb-5">
          <DialogHeader className="gap-4 text-left">
            <div className="flex items-start gap-4">
              <CompanyLogo src={item.logoSrc} name={item.company} className="size-12 p-2" />

              <div className="min-w-0 space-y-1">
                <DialogTitle className="text-xl font-semibold sm:text-2xl">
                  {item.company}
                </DialogTitle>
                <p className="text-sm font-medium text-primary">{item.role}</p>
                <p className="text-xs text-muted-foreground">
                  {item.period}
                  {item.duration ? ` · ${item.duration}` : ""} · {item.location}
                </p>
              </div>
            </div>

            <DialogDescription className="text-sm leading-relaxed">
              {item.description}
            </DialogDescription>

            <div className="flex flex-wrap gap-2">
              {item.websiteUrl ? (
                <Button asChild variant="outline" size="sm">
                  <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer">
                    Visit website
                    <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                </Button>
              ) : null}

              {projectSlug ? (
                <Button asChild size="sm">
                  <Link to="/projects/$slug" params={{ slug: projectSlug }} search={{ from: "journey" }}>
                    View case study
                  </Link>
                </Button>
              ) : null}
            </div>
          </DialogHeader>
        </div>

        {item.highlights.length > 0 ? (
          <div className="space-y-3 p-6 pt-5">
            <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Highlights
            </p>
            <ul className="space-y-3">
              {item.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-sm leading-relaxed text-foreground/90">
                  <span
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden
                  />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
