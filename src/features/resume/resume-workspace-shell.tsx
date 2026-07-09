"use client"

import * as React from "react"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

type MobilePane = "edit" | "preview"

type ResumeWorkspaceShellProps = {
  controls: React.ReactNode
  preview: React.ReactNode
  className?: string
  /** Extra chrome above the workspace (e.g. public wizard header). */
  topSlot?: React.ReactNode
}

export function ResumeWorkspaceShell({
  controls,
  preview,
  className,
  topSlot,
}: ResumeWorkspaceShellProps) {
  const isMobile = useIsMobile()
  const [mobilePane, setMobilePane] = React.useState<MobilePane>("edit")

  if (isMobile) {
    return (
      <div className={cn("flex h-full min-h-0 flex-col bg-background", className)}>
        {topSlot}
        <div className="sticky top-0 z-20 border-b border-border bg-background/95 px-3 py-2 backdrop-blur-sm">
          <div
            className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1"
            role="tablist"
            aria-label="Resume workspace"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mobilePane === "edit"}
              onClick={() => setMobilePane("edit")}
              className={cn(
                "rounded-md px-3 py-2.5 text-sm font-semibold transition-colors",
                mobilePane === "edit"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Edit
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mobilePane === "preview"}
              onClick={() => setMobilePane("preview")}
              className={cn(
                "rounded-md px-3 py-2.5 text-sm font-semibold transition-colors",
                mobilePane === "preview"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Preview
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          {mobilePane === "edit" ? (
            <div className="h-full overflow-y-auto">{controls}</div>
          ) : (
            <div className="h-full min-h-0">{preview}</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex h-full min-h-0 flex-col bg-background", className)}>
      {topSlot}
      <ResizablePanelGroup orientation="horizontal" className="min-h-0 flex-1">
        <ResizablePanel
          id="resume-controls"
          defaultSize={380}
          minSize={320}
          maxSize={520}
        >
          <div className="h-full min-w-[320px] overflow-y-auto">{controls}</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id="resume-preview" minSize={480}>
          <div className="h-full min-h-0">{preview}</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
