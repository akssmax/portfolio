"use client"

import { useRef } from "react"
import { Link, createFileRoute } from "@tanstack/react-router"
import { motion, useReducedMotion } from "motion/react"

import { ContactDotGridBackground } from "@/components/landing/contact-dot-grid-background"
import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"
import { WorkProjectGroup } from "@/components/projects/work-project-group"
import { RouteError } from "@/components/route-error"
import { getAllWorkSections } from "@/lib/sanity/projects"

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      {
        title: "Product Design & Design Engineering Projects — Akshay Saini",
      },
      {
        name: "description",
        content: "Explore case studies and featured projects in fintech, developer tools, and agentic AI designed and built by Akshay Saini, a Product Designer and Design Engineer based in Bangalore, India.",
      },
      {
        name: "keywords",
        content: "design engineering projects, product design projects, case studies, akshay saini, design portfolio, developer tools, fintech design, agentic ai, designer in bangalore",
      },
      {
        property: "og:title",
        content: "Product Design & Design Engineering Projects — Akshay Saini",
      },
      {
        property: "og:description",
        content: "Explore case studies and featured projects in fintech, developer tools, and agentic AI designed and built by Akshay Saini.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: "https://akshaysaini.xyz/projects",
      },
      {
        property: "og:image",
        content: "https://akshaysaini.xyz/images/hero-portrait.png",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "Product Design & Design Engineering Projects — Akshay Saini",
      },
      {
        name: "twitter:description",
        content: "Explore case studies and featured projects in fintech, developer tools, and agentic AI designed and built by Akshay Saini.",
      },
      {
        name: "twitter:image",
        content: "https://akshaysaini.xyz/images/hero-portrait.png",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://akshaysaini.xyz/projects",
      },
    ],
  }),
  loader: () => getAllWorkSections(),
  errorComponent: RouteError,
  component: ProjectsIndexPage,
})

function ProjectsIndexPage() {
  const { recentProjects, caseStudies, other } = Route.useLoaderData()
  const shouldReduceMotion = useReducedMotion()
  const mainRef = useRef<HTMLElement>(null)

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main
        ref={mainRef}
        className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden border-t border-border"
      >
        <div className="pointer-events-none absolute inset-0 z-0 opacity-45" aria-hidden>
          <ContactDotGridBackground />
          <div
            className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/55 to-background/25 lg:bg-gradient-to-r lg:from-background/92 lg:via-background/60 lg:to-background/15 dark:from-background/85 dark:via-background/60 dark:to-background/30"
            aria-hidden
          />
        </div>

        <motion.div
          className="relative z-10 mx-auto max-w-6xl space-y-20 px-4 py-24 sm:px-6"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Work
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Projects
            </h1>
            <p className="mt-3 text-base text-muted-foreground">
              Recent AI-assisted builds and deeper case studies from pre-LLM product design.
            </p>
            <Link
              to="/"
              className="mt-4 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Back to home
            </Link>
          </div>

          <WorkProjectGroup
            title="Recent projects"
            description="Agentic AI products designed and shipped with AI-assisted workflows."
            projects={recentProjects}
            animated={false}
          />

          <WorkProjectGroup
            id="case-studies"
            title="Case studies"
            description="Deep dives from pre-LLM product design — Figma to shipped UI without AI codegen."
            projects={caseStudies}
            animated={false}
          />

          <WorkProjectGroup
            title="More work"
            description="Additional projects and experiments."
            projects={other}
            animated={false}
          />
        </motion.div>
      </main>
      <SiteFooter />
    </div>
  )
}
