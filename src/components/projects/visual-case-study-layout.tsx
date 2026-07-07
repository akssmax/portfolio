"use client"

import { Link } from "@tanstack/react-router"
import { ArrowRight, Check, ExternalLink, Sparkles } from "lucide-react"

import { usePortfolioChat } from "@/components/landing/portfolio-chat-provider"
import { CaseStudyBackLink, useCaseStudyBack } from "@/components/projects/case-study-back-link"
import { CaseStudyScreenshot } from "@/components/projects/case-study-screenshot"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { VisualCaseStudyLayoutProps } from "@/lib/projects/visual-case-study-configs"

export type { VisualCaseStudyConfig } from "@/lib/projects/visual-case-study-configs"
export { getVisualCaseStudyConfig } from "@/lib/projects/visual-case-study-configs"

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
          <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function VisualCaseStudyLayout({
  project,
  liveUrl,
  ctaLabel = "Open live app",
  secondaryUrl,
  secondaryLabel,
  heroImageSrc,
  heroImageAlt,
  heroImageHref,
  stack,
  highlights,
  designNotes,
  builtSummary,
  footerNote,
  stats,
  galleries,
}: VisualCaseStudyLayoutProps) {
  const { openChatWithMessage } = usePortfolioChat()
  const back = useCaseStudyBack()

  const handleSummarize = () => {
    openChatWithMessage(
      `Summarize the project "${project.title}". Focus on what was built, the design approach, and tech stack.`,
    )
  }

  const heroSrc = heroImageSrc ?? project.coverImageUrl ?? "/projects/chat-shell/hero.webp"
  const heroAlt = heroImageAlt ?? `${project.title} preview`

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-20">
      <div className="mb-8">
        <CaseStudyBackLink />
      </div>

      <header className="mx-auto max-w-3xl space-y-6 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge variant="secondary">{project.tag}</Badge>
          {project.buildBadge === "built-with-ai" ? (
            <Badge variant="outline" className="gap-1 border-amber-500/30 text-amber-600 dark:text-amber-400">
              <Sparkles className="size-3" />
              Built with AI
            </Badge>
          ) : null}
          {project.metrics ? (
            <Badge variant="outline" className="text-muted-foreground">
              {project.metrics}
            </Badge>
          ) : null}
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {project.title}
          </h1>
          <p className="text-lg text-muted-foreground text-balance leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>{project.client ?? "Personal"}</span>
          <span aria-hidden>·</span>
          <span>{project.role ?? "Design Engineer"}</span>
          <span aria-hidden>·</span>
          <span>{project.year}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Button size="lg" asChild>
            <a href={liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
              {ctaLabel}
              <ExternalLink className="size-4" />
            </a>
          </Button>
          {secondaryUrl ? (
            <Button size="lg" variant="outline" asChild>
              <a href={secondaryUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
                {secondaryLabel ?? "Secondary link"}
                <ExternalLink className="size-4" />
              </a>
            </Button>
          ) : null}
          <Button size="lg" variant="outline" onClick={handleSummarize} className="gap-2">
            Summarize with AI
            <Sparkles className="size-4" />
          </Button>
        </div>
      </header>

      <div className="mt-12">
        <CaseStudyScreenshot
          src={heroSrc}
          alt={heroAlt}
          href={heroImageHref ?? liveUrl}
          label={project.title}
          className="shadow-lg"
        />
      </div>

      <div className="mt-10 grid grid-cols-3 gap-4 border-y border-border/80 py-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <section className="py-12 space-y-6">
        <div className="max-w-xl space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">What I built</h2>
          <p className="text-sm text-muted-foreground">{builtSummary}</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <BulletList items={highlights.slice(0, Math.ceil(highlights.length / 2))} />
          <BulletList items={highlights.slice(Math.ceil(highlights.length / 2))} />
        </div>
      </section>

      {galleries.map((gallery) => (
        <section key={gallery.title} className="space-y-6 pb-12">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">{gallery.title}</h2>
            {gallery.description ? (
              <p className="text-sm text-muted-foreground">{gallery.description}</p>
            ) : null}
          </div>

          {gallery.layout === "row" ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {gallery.images.map((image) => (
                <figure key={image.src} className="space-y-2">
                  <CaseStudyScreenshot
                    src={image.src}
                    alt={image.alt}
                    label={image.label}
                    href={image.href ?? liveUrl}
                  />
                  <figcaption className="text-xs font-medium text-muted-foreground">
                    {image.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <CaseStudyScreenshot
              src={gallery.images[0]?.src ?? ""}
              alt={gallery.images[0]?.alt ?? ""}
              label={gallery.images[0]?.label}
              href={gallery.images[0]?.href ?? liveUrl}
            />
          )}
        </section>
      ))}

      <section className="grid gap-10 border-t border-border/80 py-12 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Design approach</h2>
          <BulletList items={designNotes} />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Stack</h2>
          <div className="flex flex-wrap gap-2">
            {stack.map((item) => (
              <Badge key={item} variant="secondary" className="font-normal">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <div className="rounded-2xl border border-border/80 bg-muted/30 px-6 py-8 text-center sm:px-10">
        <p className="text-sm text-muted-foreground">{footerNote}</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <a href={liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
              {ctaLabel}
              <ArrowRight className="size-4" />
            </a>
          </Button>
          {secondaryUrl ? (
            <Button size="lg" variant="outline" asChild>
              <a href={secondaryUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
                {secondaryLabel ?? "Secondary link"}
                <ExternalLink className="size-4" />
              </a>
            </Button>
          ) : null}
          <Button size="lg" variant="outline" asChild>
            <Link to={back.to}>{back.label}</Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
