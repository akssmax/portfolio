"use client"

import { ArrowDown, ArrowUpRight, Check, Sparkles } from "lucide-react"
import type { CSSProperties, ReactNode } from "react"

import type { ContentBlock, Project } from "@/lib/sanity/types"
import type {
  VisualCaseStudyConfig,
  VisualCaseStudyGallery,
} from "@/lib/projects/visual-case-study-configs"
import { usePortfolioChat } from "@/components/landing/portfolio-chat-provider"
import { ProjectCardWaveBackground } from "@/components/marketing/project-card-wave-background"
import { CaseStudyBackLink } from "@/components/projects/case-study-back-link"
import { CaseStudyScreenshot } from "@/components/projects/case-study-screenshot"
import { Button } from "@/components/ui/button"
import { getVisualCaseStudyConfig } from "@/lib/projects/visual-case-study-configs"
import { getImageUrl } from "@/lib/sanity/image"

type FeatureTheme = {
  background: string
  accent: string
  accentInk: string
  motif: string
  format: "split" | "stacked"
  label: string
  overviewHeading: string
}

const FEATURE_THEMES: Record<string, FeatureTheme> = {
  "ion-workspace": {
    background: "#191d16",
    accent: "#d6ff3d",
    accentInk: "#111111",
    motif: "radial-gradient(circle at 80% 20%, #d6ff3d28, transparent 30%), linear-gradient(90deg, #ffffff12 1px, transparent 1px)",
    format: "split",
    label: "Work, in one place",
    overviewHeading: "The working day, together.",
  },
  "indus-best-mega-food-park": {
    background: "#173c2c",
    accent: "#dbf4aa",
    accentInk: "#173c2c",
    motif: "radial-gradient(circle at 78% 38%, #a8d88924, transparent 58%)",
    format: "split",
    label: "A place made legible",
    overviewHeading: "A complex campus, one clear path in.",
  },
  postforge: {
    background: "#622d28",
    accent: "#ffdd55",
    accentInk: "#472820",
    motif: "radial-gradient(circle at 70% 25%, #ffdf7633 0 19%, transparent 19.2%), radial-gradient(circle at 15% 78%, #ffb2ae30 0 16%, transparent 16.2%)",
    format: "stacked",
    label: "Make the brand the canvas",
    overviewHeading: "Brand-ready content from one canvas.",
  },
  rupeelens: {
    background: "#103c3e",
    accent: "#a3f0d3",
    accentInk: "#123a3c",
    motif: "repeating-linear-gradient(130deg, transparent 0 29px, #ffffff17 30px 31px, transparent 32px 60px)",
    format: "split",
    label: "Clarity for personal finance",
    overviewHeading: "See where the money goes.",
  },
  "100x-landing-page": {
    background: "#30254e",
    accent: "#ffc5df",
    accentInk: "#362348",
    motif: "radial-gradient(circle at 82% 18%, #f395ef47, transparent 34%), radial-gradient(circle at 8% 92%, #ffcf8740, transparent 35%)",
    format: "stacked",
    label: "A product story in motion",
    overviewHeading: "Make browser automation easier to grasp.",
  },
  "100x-chat-shell": {
    background: "#1b3d69",
    accent: "#c6e0ff",
    accentInk: "#203e66",
    motif: "linear-gradient(135deg, transparent 0 47%, #ffffff17 47% 48%, transparent 48% 100%)",
    format: "split",
    label: "A workspace for making",
    overviewHeading: "Turn a prompt into a workspace.",
  },
  "resume-builder": {
    background: "#254b42",
    accent: "#d7f4d3",
    accentInk: "#21473f",
    motif: "repeating-linear-gradient(0deg, transparent 0 26px, #ffffff17 27px 28px)",
    format: "stacked",
    label: "From profile to PDF",
    overviewHeading: "One pipeline, two ways to build a resume.",
  },
  "v1-100x-proto": {
    background: "#3a294a",
    accent: "#ffd2aa",
    accentInk: "#3d2947",
    motif: "radial-gradient(circle at 82% 32%, #ffbb8b38 0 17%, transparent 17.2%), radial-gradient(circle at 3% 80%, #c8a4ff38 0 22%, transparent 22.2%)",
    format: "split",
    label: "An agent in the browser",
    overviewHeading: "A browser agent with room to work.",
  },
}

const DEFAULT_THEME: FeatureTheme = {
  background: "#263e63",
  accent: "#d8e8ff",
  accentInk: "#263e63",
  motif: "radial-gradient(#ffffff29 1px, transparent 1px)",
  format: "split",
  label: "Featured project",
  overviewHeading: "The project at a glance.",
}

function getFallbackGallery(content: Array<ContentBlock>): Array<VisualCaseStudyGallery> {
  const images = content.flatMap((block) => {
    if (block._type === "staticImage") {
      return [{ src: block.src, alt: block.alt, label: block.caption ?? block.alt }]
    }
    if (block._type === "staticImageGallery") {
      return block.images.map((image) => ({
        src: image.src,
        alt: image.alt,
        label: image.alt,
      }))
    }
    return []
  })

  return images.length ? [{ title: "Selected screens", layout: "row", images }] : []
}

function getFeatureContent(project: Project): VisualCaseStudyConfig {
  const configured = getVisualCaseStudyConfig(project.slug)
  if (configured) return configured

  const content = Array.isArray(project.content) ? project.content : []
  const liveLink = content.find(
    (block) => block._type === "embed" && block.embedType === "link",
  )
  const headings = content
    .filter((block) => block._type === "sectionHeading")
    .map((block) => block.subtitle ?? block.title)
    .filter(Boolean)

  return {
    liveUrl: liveLink?._type === "embed" ? liveLink.url : "",
    ctaLabel: liveLink?._type === "embed" ? liveLink.label ?? "Explore project" : undefined,
    heroImageSrc: project.coverImageUrl ?? getImageUrl(project.coverImage),
    heroImageAlt: project.coverImage?.alt ?? `${project.title} preview`,
    stack: project.tools ?? [],
    highlights: headings.length ? headings : [project.description],
    designNotes: [],
    builtSummary: project.description,
    footerNote: project.description,
    stats: [],
    galleries: getFallbackGallery(content),
  }
}

function ProjectAction({
  href,
  children,
  primary = false,
  theme,
}: {
  href: string
  children: ReactNode
  primary?: boolean
  theme: FeatureTheme
}) {
  return (
    <a
      href={href}
      target={href.startsWith("/") ? undefined : "_blank"}
      rel={href.startsWith("/") ? undefined : "noopener noreferrer"}
      className={
        primary
          ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          : "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/45 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      }
      style={primary ? { backgroundColor: theme.accent, color: theme.accentInk } : undefined}
    >
      {children}
      <ArrowUpRight className="size-4" aria-hidden="true" />
    </a>
  )
}

export function FeaturedProjectPage({ project }: { project: Project }) {
  const feature = getFeatureContent(project)
  const theme = FEATURE_THEMES[project.slug] ?? DEFAULT_THEME
  const heroImage = feature.heroImageSrc ?? project.coverImageUrl ?? getImageUrl(project.coverImage)
  const { openChatWithMessage } = usePortfolioChat()

  const summarize = () => {
    openChatWithMessage(
      `Summarize the project "${project.title}". Focus on what was built, the design approach, and tech stack.`,
    )
  }

  const heroStyle: CSSProperties = { backgroundColor: theme.background }
  const motifStyle: CSSProperties = {
    backgroundImage: theme.motif,
  }

  return (
    <article>
      <header className="relative isolate overflow-hidden text-white" style={heroStyle}>
        {project.slug === "indus-best-mega-food-park" ? (
          <ProjectCardWaveBackground slug={project.slug} variant="hero" />
        ) : (
          <div className="pointer-events-none absolute inset-0 opacity-70" style={motifStyle} aria-hidden="true" />
        )}
        <div className="pointer-events-none absolute -right-28 -bottom-52 size-[34rem] rounded-full border border-white/20" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-12 -bottom-36 size-[27rem] rounded-full border border-white/15" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-5 pt-10 pb-16 sm:px-8 lg:px-10 lg:pt-14 lg:pb-24">
          <CaseStudyBackLink className="mb-9 text-white/75 hover:bg-white/10 hover:text-white sm:mb-12" />

          <div className={theme.format === "stacked" ? "max-w-5xl" : "grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-16"}>
            <div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase">
                <span className="rounded-full border border-white/30 px-3 py-1.5 text-white/90">Featured project</span>
                <span style={{ color: theme.accent }}>{project.tag}</span>
              </div>
              <p className="mt-7 font-mono text-sm tracking-[0.12em] text-white/65 uppercase">{theme.label}</p>
              <h1 className="mt-3 max-w-4xl font-heading text-5xl leading-[1.04] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                {project.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
                {project.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/65">
                {project.client ? <span>{project.client}</span> : null}
                {project.client && project.role ? <span aria-hidden="true">/</span> : null}
                {project.role ? <span>{project.role}</span> : null}
                {project.year ? <><span aria-hidden="true">/</span><span>{project.year}</span></> : null}
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                {feature.liveUrl ? (
                  <ProjectAction href={feature.liveUrl} primary theme={theme}>
                    {feature.ctaLabel ?? "Explore project"}
                  </ProjectAction>
                ) : null}
                {feature.secondaryUrl ? (
                  <ProjectAction href={feature.secondaryUrl} theme={theme}>
                    {feature.secondaryLabel ?? "More on this project"}
                  </ProjectAction>
                ) : null}
                <Button
                  type="button"
                  variant="outline"
                  onClick={summarize}
                  className="min-h-12 rounded-full border-white/45 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
                >
                  Summarize with AI <Sparkles className="ml-1 size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>

            {heroImage ? (
              <div className={theme.format === "stacked" ? "relative mt-10" : "relative"}>
                <div className="overflow-hidden rounded-[1.4rem] border border-white/30 bg-white/10 p-2 shadow-[0_32px_100px_#0005] sm:p-3">
                  <div className="overflow-hidden rounded-xl bg-white">
                    <div className="flex h-9 items-center gap-1.5 border-b border-black/10 bg-[#f8f8f9] px-4" aria-hidden="true">
                      <span className="size-2 rounded-full bg-[#fa746e]" />
                      <span className="size-2 rounded-full bg-[#f6bf4f]" />
                      <span className="size-2 rounded-full bg-[#5acb78]" />
                      <span className="ml-auto h-2 w-24 rounded-full bg-black/5" />
                    </div>
                    <img
                      src={heroImage}
                      alt={feature.heroImageAlt ?? `${project.title} preview`}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="block aspect-[16/10] w-full object-cover object-top"
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-4 text-xs text-white/65">
                  <span>Selected project view</span>
                  <span>{project.year}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <nav aria-label="Project sections" className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl gap-8 overflow-x-auto px-5 py-5 text-sm font-medium whitespace-nowrap text-muted-foreground sm:px-8 lg:px-10">
          <a href="#project-overview" className="hover:text-foreground">Overview</a>
          <a href="#project-highlights" className="hover:text-foreground">Highlights</a>
          {feature.galleries.length ? <a href="#project-gallery" className="hover:text-foreground">Selected screens</a> : null}
          <a href="#project-details" className="hover:text-foreground">Build notes</a>
          <ArrowDown className="ml-auto size-4 shrink-0" aria-hidden="true" />
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <section id="project-overview" className="scroll-mt-28 grid gap-10 border-b border-border py-20 lg:grid-cols-[1fr_1.15fr] lg:gap-20 lg:py-28">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">01 / At a glance</p>
            <h2 className="mt-5 max-w-lg font-heading text-4xl leading-tight font-semibold tracking-tight text-foreground sm:text-5xl">
              {theme.overviewHeading}
            </h2>
          </div>
          <div>
            <p className="max-w-2xl text-lg leading-relaxed text-foreground/80 sm:text-xl">{feature.builtSummary}</p>
            {feature.stats.length ? (
              <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-3">
                {feature.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <dt className="order-2 mt-2 text-sm leading-snug text-muted-foreground">{stat.label}</dt>
                    <dd className="order-1 font-heading text-3xl font-semibold tracking-tight text-foreground">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </section>

        <section id="project-highlights" className="scroll-mt-28 border-b border-border py-20 lg:py-28">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">02 / The work</p>
              <h2 className="mt-5 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">What this project includes</h2>
            </div>
            <span className="font-mono text-sm text-muted-foreground">{String(feature.highlights.length).padStart(2, "0")} highlights</span>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
            {feature.highlights.map((highlight, index) => (
              <div key={`${index}-${highlight}`} className="min-h-44 bg-card p-7 sm:p-9">
                <span className="font-mono text-sm text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                <p className="mt-7 max-w-md text-lg leading-relaxed text-foreground">{highlight}</p>
              </div>
            ))}
          </div>
        </section>

        {feature.galleries.length ? (
          <section id="project-gallery" className="scroll-mt-28 border-b border-border py-20 lg:py-28">
            <div className="mb-14">
              <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">03 / In the product</p>
              <h2 className="mt-5 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Selected screens</h2>
            </div>
            <div className="space-y-20 lg:space-y-28">
              {feature.galleries.map((gallery, galleryIndex) => (
                <div key={`${gallery.title}-${galleryIndex}`} className={gallery.layout === "row" ? "space-y-7" : "grid gap-8 lg:grid-cols-[0.35fr_0.65fr] lg:items-center lg:gap-12"}>
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{String(galleryIndex + 1).padStart(2, "0")} / {String(feature.galleries.length).padStart(2, "0")}</p>
                    <h3 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{gallery.title}</h3>
                    {gallery.description ? <p className="mt-3 max-w-lg leading-relaxed text-muted-foreground">{gallery.description}</p> : null}
                  </div>
                  <div className={gallery.layout === "row" ? "grid gap-5 md:grid-cols-3" : "min-w-0"}>
                    {gallery.images.map((image) => (
                      <figure key={image.src} className="min-w-0">
                        <CaseStudyScreenshot
                          src={image.src}
                          alt={image.alt}
                          href={image.href ?? (feature.liveUrl || undefined)}
                          label={image.label}
                          className="rounded-2xl"
                        />
                        <figcaption className="mt-3 text-sm text-muted-foreground">{image.label}</figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section id="project-details" className="scroll-mt-28 grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:py-28">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">04 / Behind the build</p>
            <h2 className="mt-5 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Design and engineering notes</h2>
            {feature.designNotes.length ? (
              <ul className="mt-9 space-y-5">
                {feature.designNotes.map((note) => (
                  <li key={note} className="flex gap-4 border-t border-border pt-5 text-base leading-relaxed text-foreground/80">
                    <Check className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
                    {note}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-8 max-w-prose text-lg leading-relaxed text-muted-foreground">{project.description}</p>
            )}
          </div>
          <div className="self-start rounded-2xl border border-border bg-muted/30 p-7 sm:p-9">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">Tools and stack</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {feature.stack.map((tool) => (
                <span key={tool} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground">{tool}</span>
              ))}
            </div>
            {project.role ? <p className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">Role <span className="ml-2 font-medium text-foreground">{project.role}</span></p> : null}
          </div>
        </section>
      </div>

      <section className="text-white" style={heroStyle}>
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-white/65 uppercase">Explore the project</p>
            <h2 className="mt-4 max-w-xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{feature.footerNote}</h2>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            {feature.liveUrl ? <ProjectAction href={feature.liveUrl} primary theme={theme}>{feature.ctaLabel ?? "Explore project"}</ProjectAction> : null}
            <button type="button" onClick={summarize} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/45 px-6 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Summarize with AI <Sparkles className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </article>
  )
}
