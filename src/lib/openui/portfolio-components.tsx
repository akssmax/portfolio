import { defineComponent, type ComponentRenderProps } from "@openuidev/react-lang"
import { Link } from "@tanstack/react-router"
import { Briefcase, ExternalLink, MapPin, Star } from "lucide-react"
import { z } from "zod/v4"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { profile } from "@/lib/profile"
import { fallbackProjects } from "@/lib/sanity/fallback-projects"

function ProjectCardView({
  slug,
  title,
  description,
  featured,
  buttonLabel,
}: {
  slug: string
  title: string
  description?: string
  featured?: boolean
  buttonLabel?: string
}) {
  const project = fallbackProjects.find((entry) => entry.slug === slug)
  const resolvedTitle = title || project?.title || slug
  const resolvedDescription = description ?? project?.description ?? ""

  return (
    <Card className="h-full flex flex-col bg-card/60 backdrop-blur-md border-border/80 hover:border-primary/30 transition-all hover:shadow-md">
      <CardHeader className="p-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-bold text-foreground">{resolvedTitle}</CardTitle>
          {(featured ?? project?.featured) && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-medium text-amber-500 whitespace-nowrap">
              <Star className="size-2 fill-amber-500" />
              Featured
            </span>
          )}
        </div>
        {resolvedDescription ? (
          <CardDescription className="text-xs text-muted-foreground mt-1 line-clamp-3">
            {resolvedDescription}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" size="sm" className="text-xs h-7" asChild>
          <Link to="/projects/$slug" params={{ slug }}>
            {buttonLabel ?? "View case study"}
            <ExternalLink className="size-3 ml-1 opacity-60" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function ProjectCardRenderer({
  props: { slug, title, description, featured, buttonLabel },
}: ComponentRenderProps<{
  slug: string
  title?: string
  description?: string
  featured?: boolean
  buttonLabel?: string
}>) {
  return (
    <ProjectCardView
      slug={slug}
      title={title ?? ""}
      description={description}
      featured={featured}
      buttonLabel={buttonLabel}
    />
  )
}

function ProjectGridRenderer({
  props: { filter = "all", title },
}: ComponentRenderProps<{
  filter?: "featured" | "all" | "recent"
  title?: string
}>) {
  const projects = fallbackProjects.filter((project) => {
    if (filter === "featured") return project.featured
    return true
  })

  return (
    <div className="w-full space-y-4">
      {title ? (
        <p className="text-xs font-semibold tracking-wide text-primary uppercase">{title}</p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.slice(0, 4).map((project) => (
          <ProjectCardView
            key={project._id}
            slug={project.slug}
            title={project.title}
            description={project.description}
            featured={project.featured}
          />
        ))}
      </div>
    </div>
  )
}

function ExperienceTimelineRenderer({
  props: { title },
}: ComponentRenderProps<{
  title?: string
}>) {
  return (
    <div className="w-full space-y-4">
      {title ? (
        <p className="text-xs font-semibold tracking-wide text-primary uppercase">{title}</p>
      ) : null}
      <div className="space-y-3">
        {profile.experience.map((exp) => (
          <Card
            key={`${exp.company}-${exp.period}`}
            className="bg-card/50 border-border/70 hover:border-primary/25 transition-colors"
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-sm font-semibold">{exp.role}</CardTitle>
                  <CardDescription className="text-xs mt-0.5">{exp.company}</CardDescription>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
                  <Briefcase className="size-3" />
                  {exp.period}
                </span>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0 space-y-2">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="size-3 shrink-0" />
                {exp.location}
              </p>
              <p className="text-xs text-foreground/90 leading-relaxed">{exp.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function PortfolioMetricRenderer({
  props: { label, value, tag },
}: ComponentRenderProps<{
  label: string
  value: string
  tag?: string
}>) {
  return (
    <div className="flex flex-col justify-between p-4 rounded-xl border border-border/50 bg-card/35 hover:border-primary/25 hover:bg-card/65 transition-all duration-200">
      <div className="space-y-1">
        {tag ? (
          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
            {tag}
          </span>
        ) : null}
        <p className="text-lg font-bold text-foreground tracking-tight">{value}</p>
        <p className="text-[11px] text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

export const ProjectCard = defineComponent({
  name: "ProjectCard",
  props: z.object({
    slug: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    featured: z.boolean().optional(),
    buttonLabel: z.string().optional(),
  }),
  description:
    "Single portfolio project tile linking to /projects/{slug}. Use real slugs from the portfolio corpus.",
  component: ProjectCardRenderer,
})

export const ProjectGrid = defineComponent({
  name: "ProjectGrid",
  props: z.object({
    filter: z.enum(["featured", "all", "recent"]).optional(),
    title: z.string().optional(),
  }),
  description:
    "Responsive grid of 2–4 portfolio projects. Prefer filter='featured' for highlights.",
  component: ProjectGridRenderer,
})

export const ExperienceTimeline = defineComponent({
  name: "ExperienceTimeline",
  props: z.object({
    title: z.string().optional(),
  }),
  description: "Vertical timeline of Akshay's work experience from the portfolio profile.",
  component: ExperienceTimelineRenderer,
})

export const PortfolioMetric = defineComponent({
  name: "PortfolioMetric",
  props: z.object({
    label: z.string(),
    value: z.string(),
    tag: z.string().optional(),
  }),
  description: "Stat chip for years of experience, location, role, or hiring facts.",
  component: PortfolioMetricRenderer,
})

export const portfolioComponentGroup = {
  name: "Portfolio",
  components: ["ProjectCard", "ProjectGrid", "ExperienceTimeline", "PortfolioMetric"],
  notes: [
    "- Prefer ProjectGrid for project highlights and ExperienceTimeline for resume questions.",
    "- ProjectCard slug must match a real portfolio project slug (e.g. kodo, unlogged, 100x-chat-shell).",
    "- PortfolioMetric is ideal for years of experience, location, and hiring stats.",
  ],
}
