import type { PortableTextBlock } from "@portabletext/react"

export type SanityImage = {
  _type: "image"
  asset: {
    _ref: string
    _type: "reference"
  }
  alt?: string
}

export type WorkSection = "recentProject" | "caseStudy"
export type BuildBadge = "built-with-ai" | "pre-llm"

export type ProjectCard = {
  _id: string
  title: string
  slug: string
  description: string
  tag: string
  featured: boolean
  workSection?: WorkSection | null
  buildBadge?: BuildBadge | null
  coverImage?: SanityImage | null
  coverImageUrl?: string | null
  year?: string | null
  role?: string | null
  client?: string | null
  tools?: string[] | null
  publishedAt?: string | null
}

export type SectionHeadingBlock = {
  _type: "sectionHeading"
  _key: string
  title: string
  subtitle?: string | null
}

export type RichTextBlock = {
  _type: "richTextBlock"
  _key: string
  body: PortableTextBlock[]
}

export type ImageBlock = {
  _type: "imageBlock"
  _key: string
  image: SanityImage
  caption?: string | null
  fullBleed?: boolean | null
}

export type ImageGalleryBlock = {
  _type: "imageGallery"
  _key: string
  images: SanityImage[]
  caption?: string | null
}

export type MetricsBlock = {
  _type: "metrics"
  _key: string
  items: Array<{ value: string; label: string; _key?: string }>
}

export type QuoteBlock = {
  _type: "quote"
  _key: string
  text: string
  attribution?: string | null
}

export type BeforeAfterBlock = {
  _type: "beforeAfter"
  _key: string
  before: SanityImage
  after: SanityImage
  caption?: string | null
}

export type EmbedBlock = {
  _type: "embed"
  _key: string
  url: string
  label?: string | null
  embedType?: "link" | "figma" | "video" | null
}

export type SeparatorBlock = {
  _type: "separator"
  _key: string
  label?: string | null
}

export type StaticImageBlock = {
  _type: "staticImage"
  _key: string
  src: string
  alt: string
  caption?: string | null
  fullBleed?: boolean | null
}

export type StaticImageGalleryBlock = {
  _type: "staticImageGallery"
  _key: string
  images: Array<{ src: string; alt: string; _key?: string }>
  caption?: string | null
}

export type TechStackBlock = {
  _type: "techStack"
  _key: string
  items: Array<{ name: string; logoSrc: string; _key?: string }>
}

export type CollaboratorsBlock = {
  _type: "collaborators"
  _key: string
  subtitle?: string | null
  teamUrl?: string | null
  items: Array<{
    name: string
    role: string
    avatarSrc?: string | null
    initials?: string | null
    profileUrl?: string | null
    _key?: string
  }>
}

export type SiteMapBlock = {
  _type: "siteMap"
  _key: string
  /** Defaults to https://100x.bot. Set to "" for label-only routes (no links). */
  baseUrl?: string | null
  groups: Array<{
    title: string
    description?: string | null
    routes?: Array<{ path: string; label: string; _key?: string }>
    screenshotSrc?: string | null
    _key?: string
  }>
}

export type ContentBlock =
  | SectionHeadingBlock
  | RichTextBlock
  | ImageBlock
  | ImageGalleryBlock
  | StaticImageBlock
  | StaticImageGalleryBlock
  | TechStackBlock
  | CollaboratorsBlock
  | SiteMapBlock
  | MetricsBlock
  | QuoteBlock
  | BeforeAfterBlock
  | EmbedBlock
  | SeparatorBlock

export type Project = ProjectCard & {
  content: ContentBlock[]
  seo?: {
    metaTitle?: string | null
    metaDescription?: string | null
  } | null
}

export type BlogPostCard = {
  _id: string
  title: string
  slug: string
  excerpt: string
  tag: string
  coverImage?: SanityImage | null
  publishedAt?: string | null
}

export type BlogPost = BlogPostCard & {
  body: string
  seo?: {
    metaTitle?: string | null
    metaDescription?: string | null
  } | null
}

export function isProjectCard(project: Project | ProjectCard): project is ProjectCard {
  return !("content" in project)
}
