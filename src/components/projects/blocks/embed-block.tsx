import { ExternalLink, LayoutTemplate, PlayCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { sanitizeExternalHref, isAllowedEmbedUrl } from "@/lib/url-safety"
import type { EmbedBlock } from "@/lib/sanity/types"

function getEmbedIcon(embedType: EmbedBlock["embedType"]) {
  switch (embedType) {
    case "figma":
      return LayoutTemplate
    case "video":
      return PlayCircle
    default:
      return ExternalLink
  }
}

export function EmbedBlockComponent({ block }: { block: EmbedBlock }) {
  const Icon = getEmbedIcon(block.embedType)
  const label = block.label ?? block.url
  const safeUrl = sanitizeExternalHref(block.url)

  if (block.embedType === "video" && safeUrl && isAllowedEmbedUrl(safeUrl)) {
    return (
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="aspect-video">
          <iframe
            src={safeUrl}
            title={label}
            className="size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    )
  }

  if (block.embedType === "figma" && safeUrl && isAllowedEmbedUrl(safeUrl)) {
    return (
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="aspect-video">
          <iframe
            src={safeUrl}
            title={label}
            className="size-full"
            allowFullScreen
          />
        </div>
      </div>
    )
  }

  if (!safeUrl) return null

  return (
    <Button asChild variant="outline">
      <a href={safeUrl} target="_blank" rel="noreferrer">
        <Icon className="size-4" />
        {label}
      </a>
    </Button>
  )
}
