import { Link, createFileRoute } from "@tanstack/react-router"

import { RouteError } from "@/components/route-error"
import { CaseStudyLayout } from "@/components/projects/case-study-layout"
import { SiteHeader } from "@/components/landing/site-header"
import { Button } from "@/components/ui/button"
import { getProjectBySlug } from "@/lib/sanity/projects"

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => getProjectBySlug(params.slug),
  head: ({ loaderData }) => {
    const project = loaderData
    const title =
      project?.seo?.metaTitle ??
      (project ? `${project.title} — Case Study` : "Project not found")
    const description =
      project?.seo?.metaDescription ?? project?.description ?? undefined

    return {
      meta: [
        { title },
        ...(description ? [{ name: "description", content: description }] : []),
      ],
    }
  },
  errorComponent: RouteError,
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const project = Route.useLoaderData()

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
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main className="border-t border-border">
        <CaseStudyLayout project={project} />
      </main>
    </div>
  )
}
