"use client"

import { Download, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useBrandColors } from "@/hooks/use-brand-colors"
import { cn } from "@/lib/utils"

import { DEFAULT_RESUME_SECTIONS } from "./default-sections"
import { DEFAULT_RESUME_LAYOUT } from "./layout-options"
import { useDownloadResume } from "./use-download-resume"

type DownloadResumeButtonProps = {
  size?: React.ComponentProps<typeof Button>["size"]
  variant?: React.ComponentProps<typeof Button>["variant"]
  className?: string
  showIcon?: boolean
}

export function DownloadResumeButton({
  size = "sm",
  variant = "outline",
  className,
  showIcon = true,
}: DownloadResumeButtonProps) {
  const { primary } = useBrandColors()
  const { downloadResume, isGenerating } = useDownloadResume()

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn("w-fit", className)}
      disabled={isGenerating}
      aria-busy={isGenerating}
      onClick={() =>
        void downloadResume({
          sections: DEFAULT_RESUME_SECTIONS,
          brandColor: primary,
          layout: DEFAULT_RESUME_LAYOUT,
        })
      }
    >
      {showIcon ? (
        isGenerating ? (
          <Loader2 aria-hidden className="animate-spin" />
        ) : (
          <Download aria-hidden />
        )
      ) : null}
      {isGenerating ? "Generating…" : "Download resume"}
    </Button>
  )
}
