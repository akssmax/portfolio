import { Link, createFileRoute } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"

import { RouteError } from "@/components/route-error"
import { CaseStudyLayout } from "@/components/projects/case-study-layout"
import { FeaturedProjectLayout } from "@/components/projects/featured-project-layout"
import { SiteHeader } from "@/components/landing/site-header"
import { ContactSection } from "@/components/landing/contact-section"
import { SiteFooter } from "@/components/landing/site-footer"
import { Button } from "@/components/ui/button"
import { getProjectBySlug, getAllWorkSections } from "@/lib/sanity/projects"

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    const [project, sections] = await Promise.all([
      getProjectBySlug(params.slug),
      getAllWorkSections(),
    ])
    return { project, sections }
  },
  head: ({ loaderData }) => {
    const project = loaderData?.project
    const title =
      project?.seo?.metaTitle ??
      (project ? `${project.title} — Case Study by Akshay Saini` : "Project not found")
    const description =
      project?.seo?.metaDescription ?? project?.description ?? undefined
    const slug = project?.slug ?? ""
    const canonicalUrl = `https://akshaysaini.xyz/projects/${slug}`
    const imageUrl = project?.coverImageUrl
      ? project.coverImageUrl.startsWith("http")
        ? project.coverImageUrl
        : `https://akshaysaini.xyz${project.coverImageUrl}`
      : "https://akshaysaini.xyz/images/hero-portrait.png"

    return {
      meta: [
        { title },
        ...(description ? [{ name: "description", content: description }] : []),
        {
          name: "keywords",
          content: `${project?.title ?? ""}, case study, design engineering, product design, akshay saini, bangalore, developer tools, fintech`,
        },
        { property: "og:title", content: title },
        ...(description ? [{ property: "og:description", content: description }] : []),
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonicalUrl },
        { property: "og:image", content: imageUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        ...(description ? [{ name: "twitter:description", content: description }] : []),
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

  if (!project) {
    return (
      <div className="min-h-svh bg-background text-foreground">
        <SiteHeader />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold">Project not found</h1>
          <p className="mt-2 text-muted-foreground">
            This case study doesn&apos;t exist or hasn&apos;t been published yet.
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
    ...(sections?.recentProjects ?? []),
    ...(sections?.caseStudies ?? []),
    ...(sections?.other ?? []),
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
        {project.workSection === "recentProject" ? (
          <FeaturedProjectLayout project={project} />
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
                className="group block rounded-2xl border border-border bg-card p-6 sm:p-8 transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                      Next Project
                    </span>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">
                      {nextProject.title}
                    </h3>
                    <p className="max-w-xl text-sm text-muted-foreground line-clamp-2">
                      {nextProject.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-primary shrink-0 self-start sm:self-center">
                    <span>View project</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ) : null}
      </main>

      <ContactSection bottomCutout={true} />
      <SiteFooter hasTopBorder={false} />
    </div>
  )
}
