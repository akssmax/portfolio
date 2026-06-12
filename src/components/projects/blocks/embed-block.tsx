import { ExternalLink, LayoutTemplate, PlayCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
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

  if (block.embedType === "video" && block.url) {
    return (
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="aspect-video">
          <iframe
            src={block.url}
            title={label}
            className="size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    )
  }

  if (block.embedType === "figma" && block.url) {
    return (
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="aspect-video">
          <iframe
            src={block.url}
            title={label}
            className="size-full"
            allowFullScreen
          />
        </div>
      </div>
    )
  }

  return (
    <Button asChild variant="outline">
      <a href={block.url} target="_blank" rel="noreferrer">
        <Icon className="size-4" />
        {label}
      </a>
    </Button>
  )
}
