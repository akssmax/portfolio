"use client"

import { Link } from "@tanstack/react-router"
import { ExternalLink, Sparkles } from "lucide-react"

import { CaseStudyBackLink } from "@/components/projects/case-study-back-link"
import { BlockRenderer, ProjectCoverImage } from "@/components/projects/blocks/block-renderer"
import { CaseStudyNav } from "@/components/projects/case-study-nav"
import { usePortfolioChat } from "@/components/landing/portfolio-chat-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { ContentBlock, EmbedBlock, Project, SectionHeadingBlock } from "@/lib/sanity/types"

type CaseStudyLayoutProps = {
  project: Project
}

function getLiveSiteLink(
  content: ContentBlock[],
): { url: string; label: string } | null {
  const embed = content.find(
    (block): block is EmbedBlock =>
      block._type === "embed" &&
      block.embedType !== "figma" &&
      block.embedType !== "video" &&
      Boolean(block.url),
  )

  if (!embed) return null

  return {
    url: embed.url,
    label: embed.label ?? "View live site",
  }
}

function getTimelineLabel(year?: string | null) {
  if (!year) return "Year"
  return year.includes("–") || year.includes("-") ? "Timeline" : "Year"
}

function getSectionHeadings(content: ContentBlock[]): SectionHeadingBlock[] {
  return content.filter(
    (block): block is SectionHeadingBlock => block._type === "sectionHeading",
  )
}

export function CaseStudyLayout({ project }: CaseStudyLayoutProps) {
  const liveSite = getLiveSiteLink(project.content ?? [])
  const sectionHeadings = getSectionHeadings(project.content ?? [])
  const { openChatWithMessage } = usePortfolioChat()

  const handleSummarize = () => {
    openChatWithMessage(
      `Summarize the project "${project.title}". Give me a breakdown of what it is, the key design decisions, and the technical implementation/tech stack.`
    )
  }

  const metaItems = [
    project.year
      ? { label: getTimelineLabel(project.year), value: project.year }
      : null,
    project.role ? { label: "Role", value: project.role } : null,
    project.client ? { label: "Client", value: project.client } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="mb-8">
        <CaseStudyBackLink />
      </div>

      <header className="space-y-6 border-b border-border pb-10">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{project.tag}</Badge>
          {project.featured ? <Badge>Featured</Badge> : null}
          {project.tools?.map((tool) => (
            <Badge key={tool} variant="outline">
              {tool}
            </Badge>
          ))}
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {project.title}
          </h1>
          <p className="max-w-prose text-base text-muted-foreground sm:text-lg">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-3">
            {liveSite ? (
              <Button asChild>
                <a href={liveSite.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
                  {liveSite.label}
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            ) : null}
            {project.slug === "resume-builder" ? (
              <>
                <Button asChild>
                  <Link to="/tools/resume">View Project</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/resume">Open Project</Link>
                </Button>
              </>
            ) : null}
            <Button variant="outline" onClick={handleSummarize} className="inline-flex items-center gap-2">
              Summarize with AI <Sparkles className="size-4" />
            </Button>
          </div>
        </div>

        {metaItems.length > 0 ? (
          <dl className="grid gap-4 sm:grid-cols-3">
            {metaItems.map((item) => (
              <div key={item.label}>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <ProjectCoverImage
          image={project.coverImage}
          imageUrl={project.coverImageUrl}
          alt={project.coverImage?.alt ?? project.title}
          priority
        />
      </header>

      <Separator className="my-10" />

      <CaseStudyNav headings={sectionHeadings} />

      <div className="pb-8">
        <BlockRenderer blocks={project.content ?? []} />
      </div>
    </article>
  )
}
