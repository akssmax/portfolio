import { PortableText } from "@portabletext/react"
import { ExternalLink } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { getImageSrcSet, getImageUrl } from "@/lib/sanity/image"
import type { ContentBlock } from "@/lib/sanity/types"
import { sanitizeExternalHref } from "@/lib/url-safety"

import { BeforeAfterBlockComponent } from "./before-after-block"
import { EmbedBlockComponent } from "./embed-block"
import { ImageBlockComponent } from "./image-block"
import { ImageGalleryBlockComponent } from "./image-gallery-block"
import { MetricsBlockComponent } from "./metrics-block"
import { QuoteBlockComponent } from "./quote-block"
import { SectionHeadingBlockComponent } from "./section-heading-block"
import { StaticImageBlockComponent } from "./static-image-block"
import { StaticImageGalleryBlockComponent } from "./static-image-gallery-block"
import { CollaboratorsBlockComponent } from "./collaborators-block"
import { SiteMapBlockComponent } from "./site-map-block"
import { TechStackBlockComponent } from "./tech-stack-block"

const portableTextComponents = {
  block: {
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mt-8 text-xl font-semibold tracking-tight text-foreground first:mt-0">
        {children}
      </h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="mt-6 text-lg font-semibold tracking-tight text-foreground first:mt-0">
        {children}
      </h4>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-base leading-7 text-muted-foreground">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => <em>{children}</em>,
    link: ({
      children,
      value,
    }: {
      children?: React.ReactNode
      value?: { href?: string }
    }) => {
      const href = sanitizeExternalHref(value?.href)
      if (!href) return <span>{children}</span>

      return (
        <a
          href={href}
          className="inline-flex items-center gap-1 text-foreground underline underline-offset-4 transition-colors hover:text-foreground/80"
          target={href.startsWith("/") ? undefined : "_blank"}
          rel={href.startsWith("/") ? undefined : "noreferrer"}
        >
          {children}
          {!href.startsWith("/") ? <ExternalLink className="size-3.5" /> : null}
        </a>
      )
    },
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc space-y-2 pl-5 text-muted-foreground">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">{children}</ol>
    ),
  },
}

function RichTextBlockComponent({ block }: { block: Extract<ContentBlock, { _type: "richTextBlock" }> }) {
  return (
    <div className="max-w-prose space-y-4">
      <PortableText value={block.body} components={portableTextComponents} />
    </div>
  )
}

function SeparatorBlockComponent({
  block,
}: {
  block: Extract<ContentBlock, { _type: "separator" }>
}) {
  return (
    <div className="py-2">
      <Separator />
      {block.label ? (
        <p className="mt-3 text-center text-xs uppercase tracking-wide text-muted-foreground">
          {block.label}
        </p>
      ) : null}
    </div>
  )
}

function renderBlock(block: ContentBlock) {
  switch (block._type) {
    case "sectionHeading":
      return <SectionHeadingBlockComponent block={block} />
    case "richTextBlock":
      return <RichTextBlockComponent block={block} />
    case "imageBlock":
      return <ImageBlockComponent block={block} />
    case "imageGallery":
      return <ImageGalleryBlockComponent block={block} />
    case "staticImage":
      return <StaticImageBlockComponent block={block} />
    case "staticImageGallery":
      return <StaticImageGalleryBlockComponent block={block} />
    case "techStack":
      return <TechStackBlockComponent block={block} />
    case "collaborators":
      return <CollaboratorsBlockComponent block={block} />
    case "siteMap":
      return <SiteMapBlockComponent block={block} />
    case "metrics":
      return <MetricsBlockComponent block={block} />
    case "quote":
      return <QuoteBlockComponent block={block} />
    case "beforeAfter":
      return <BeforeAfterBlockComponent block={block} />
    case "embed":
      return <EmbedBlockComponent block={block} />
    case "separator":
      return <SeparatorBlockComponent block={block} />
    default:
      return null
  }
}

export function BlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  if (!blocks.length) {
    return null
  }

  return (
    <div className="space-y-16">
      {blocks.map((block) => (
        <div key={block._key}>{renderBlock(block)}</div>
      ))}
    </div>
  )
}

export function ProjectCoverImage({
  image,
  imageUrl,
  alt,
  className,
  priority = false,
}: {
  image?: import("@/lib/sanity/types").SanityImage | null | undefined
  imageUrl?: string | null
  alt: string
  className?: string
  priority?: boolean
}) {
  const src = imageUrl ?? getImageUrl(image, 1600)
  const srcSet = image ? getImageSrcSet(image, [960, 1200, 1600]) : undefined

  if (!src) {
    return (
      <div
        className={`flex aspect-[16/10] items-center justify-center rounded-xl border border-border bg-muted/40 ${className ?? ""}`}
      >
        <span className="text-sm text-muted-foreground">No cover image</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes="(min-width: 1024px) 960px, 100vw"
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={`aspect-[16/10] w-full rounded-xl border border-border object-cover ${className ?? ""}`}
    />
  )
}
