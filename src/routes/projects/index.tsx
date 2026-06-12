import { Link, createFileRoute } from "@tanstack/react-router"
import { motion, useReducedMotion } from "motion/react"

import { RouteError } from "@/components/route-error"

import {
  InteractiveStrandsBackground,
  useInteractiveStrands,
} from "@/components/projects/interactive-strands-background"
import { ProjectGrid } from "@/components/projects/project-grid"
import { SiteHeader } from "@/components/landing/site-header"
import { getAllProjects } from "@/lib/sanity/projects"

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Akshay Saini" },
      {
        name: "description",
        content:
          "Selected design engineering projects and case studies.",
      },
    ],
  }),
  loader: () => getAllProjects(),
  errorComponent: RouteError,
  component: ProjectsIndexPage,
})

function ProjectsIndexPage() {
  const projects = Route.useLoaderData()
  const shouldReduceMotion = useReducedMotion()
  const { dynamicPropsRef, mouseHandlers } = useInteractiveStrands()

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main
        className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden border-t border-border"
        {...(!shouldReduceMotion ? mouseHandlers : {})}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          aria-hidden
        >
          {!shouldReduceMotion ? (
            <InteractiveStrandsBackground
              dynamicPropsRef={dynamicPropsRef}
              className="absolute inset-0"
            />
          ) : null}
          <div className="absolute inset-0 bg-background/75" />
        </div>

        <motion.div
          className="relative z-10 mx-auto max-w-6xl px-4 py-24 sm:px-6"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Work
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Projects
            </h1>
            <p className="mt-3 text-base text-muted-foreground">
              Case studies where design craft and engineering rigor came together.
            </p>
            <Link
              to="/"
              className="mt-4 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Back to home
            </Link>
          </div>

          <ProjectGrid projects={projects} animated={false} />
        </motion.div>
      </main>
    </div>
  )
}
