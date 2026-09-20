import { Link, createFileRoute } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"

import type { CaseStudyFrom } from "@/components/projects/case-study-back-link"
import { RouteError } from "@/components/route-error"
import { CaseStudyLayout } from "@/components/projects/case-study-layout"
import { CaseStudyStoryLayout } from "@/components/projects/case-study-story-layout"
import { KodoCaseStudyLayout } from "@/components/projects/kodo-case-study-layout"
import { FeaturedProjectPage } from "@/components/projects/featured-project-page"
import { UnloggedLogo } from "@/components/logos/unlogged-logo"
import { SiteHeader } from "@/components/landing/site-header"
import { ContactSection } from "@/components/landing/contact-section"
import { SiteFooter } from "@/components/landing/site-footer"
import { Button } from "@/components/ui/button"
import { getAllWorkSections, getProjectBySlug } from "@/lib/sanity/projects"
import { kodoCaseStudy } from "@/lib/projects/kodo-case-study"
import {
  TULR_PALETTE,
  UNLOGGED_PALETTE,
  tulrCaseStudy,
  unloggedCaseStudy,
} from "@/lib/projects/case-study-story"
import { siteUrl } from "@/lib/site-url"

export const Route = createFileRoute("/projects/$slug")({
  validateSearch: (
    search: Record<string, unknown>
  ): { from?: CaseStudyFrom } => ({
    from:
      search.from === "home" ||
      search.from === "projects" ||
      search.from === "intro" ||
      search.from === "journey"
        ? search.from
        : undefined,
  }),
  loader: async ({ params }) => {
    const [project, sections] = await Promise.all([
      getProjectBySlug(params.slug),
      getAllWorkSections(),
    ])
    return { project, sections }
  },
  head: ({ loaderData }) => {
    const project = loaderData?.project
    const isKodo = project?.slug === "kodo"
    const isFeaturedProject = project?.workSection === "recentProject"
    const projectMetaTitle = project?.seo?.metaTitle
    const title =
      (isKodo
        ? "Kodo — Website, Corporate Cards & P2P Workspace | Akshay Saini"
        : isFeaturedProject &&
            (!projectMetaTitle || /case study/i.test(projectMetaTitle))
          ? `${project.title} — Featured Project | Akshay Saini`
          : projectMetaTitle) ??
      (project
        ? `${project.title} — ${project.workSection === "recentProject" ? "Featured Project" : "Case Study"} by Akshay Saini`
        : "Project not found")
    const description =
      (isKodo ? kodoCaseStudy.description : project?.seo?.metaDescription) ??
      project?.description ??
      undefined
    const slug = project?.slug ?? ""
    const canonicalUrl = siteUrl(`/projects/${slug}`)
    const imageUrl = project?.coverImageUrl
      ? project.coverImageUrl.startsWith("http")
        ? project.coverImageUrl
        : siteUrl(project.coverImageUrl)
      : siteUrl("/images/og-banner.jpg")

    return {
      meta: [
        { title },
        ...(description ? [{ name: "description", content: description }] : []),
        {
          name: "keywords",
          content: `${project?.title ?? ""}, ${project?.workSection === "recentProject" ? "featured project" : "case study"}, design engineering, product design, akshay saini, bangalore, developer tools, fintech`,
        },
        { property: "og:title", content: title },
        ...(description
          ? [{ property: "og:description", content: description }]
          : []),
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonicalUrl },
        { property: "og:image", content: imageUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        ...(description
          ? [{ name: "twitter:description", content: description }]
          : []),
        { name: "twitter:image", content: imageUrl },
      ],
      links: [
        {
          rel: "canonical",
          href: canonicalUrl,
        },
      ],
    }
  },
  errorComponent: RouteError,
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const { project, sections } = Route.useLoaderData()
  const { from } = Route.useSearch()

  if (!project) {
    return (
      <div className="min-h-svh bg-background text-foreground">
        <SiteHeader />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold">Project not found</h1>
          <p className="mt-2 text-muted-foreground">
            This project doesn&apos;t exist or hasn&apos;t been published yet.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/projects">Back to projects</Link>
          </Button>
        </main>
        <SiteFooter />
      </div>
    )
  }

  // Flatten the projects list in display order:
  // 1. recentProjects (featured recent projects)
  // 2. caseStudies
  // 3. other
  const orderedProjects = [
    ...sections.recentProjects,
    ...sections.caseStudies,
    ...sections.other,
  ]

  const currentIndex = orderedProjects.findIndex((p) => p.slug === project.slug)
  const nextProject =
    currentIndex !== -1 && orderedProjects.length > 1
      ? orderedProjects[(currentIndex + 1) % orderedProjects.length]
      : null

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main className="border-t border-border">
        {project.slug === "kodo" ? (
          <KodoCaseStudyLayout />
        ) : project.slug === "unlogged" ? (
          <CaseStudyStoryLayout
            study={unloggedCaseStudy}
            palette={UNLOGGED_PALETTE}
            waveSlug="unlogged"
            logo={
              <UnloggedLogo className="h-7 w-auto text-[#17202b] dark:text-white" />
            }
          />
        ) : project.slug === "tulr" ? (
          <CaseStudyStoryLayout
            study={tulrCaseStudy}
            palette={TULR_PALETTE}
            waveSlug="tulr"
            logo={
              <img
                src="/companies/tulr.svg"
                alt="Tulr"
                className="block h-8 w-auto dark:brightness-0 dark:invert"
              />
            }
          />
        ) : project.workSection === "recentProject" ? (
          <FeaturedProjectPage project={project} />
        ) : (
          <CaseStudyLayout project={project} />
        )}

        {/* Project Pagination */}
        {nextProject ? (
          <div className="border-t border-border bg-muted/10 py-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
              <Link
                to="/projects/$slug"
                params={{ slug: nextProject.slug }}
                search={from ? { from } : undefined}
                className="group block rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg sm:p-8"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase transition-colors group-hover:text-primary">
                      Next Project
                    </span>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">
                      {nextProject.title}
                    </h3>
                    <p className="line-clamp-2 max-w-xl text-sm text-muted-foreground">
                      {nextProject.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 self-start text-sm font-medium text-primary sm:self-center">
                    <span>View project</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ) : null}
      </main>

      <ContactSection bottomCutout={true} showBorders={false} />
      <SiteFooter hasTopBorder={false} />
    </div>
  )
}
