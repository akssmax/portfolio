import { Link } from "@tanstack/react-router"
import { motion, useReducedMotion } from "motion/react"
import { ArrowRight } from "lucide-react"

import { WorkProjectGroup } from "@/components/projects/work-project-group"
import { Button } from "@/components/ui/button"
import type { ProjectCard } from "@/lib/sanity/types"

type WorkSectionProps = {
  recentProjects: ProjectCard[]
  caseStudies: ProjectCard[]
}

export function WorkSection({ recentProjects, caseStudies }: WorkSectionProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="work"
      className="border-t border-border bg-section py-24 text-section-foreground"
    >
      <motion.div
        className="mx-auto max-w-6xl space-y-20 px-4 sm:px-6"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Work</h2>
            <p className="mt-3 text-base text-muted-foreground">
              Recent AI-assisted builds and deeper case studies from pre-LLM product design.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-border bg-transparent hover:bg-muted/50"
          >
            <Link to="/projects">
              View all work
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <WorkProjectGroup
          title="Recent projects"
          description="Agentic AI products designed and shipped with AI-assisted workflows."
          projects={recentProjects}
        />

        <WorkProjectGroup
          id="case-studies"
          title="Case studies"
          description="Deep dives from pre-LLM product design — Figma to shipped UI without AI codegen."
          projects={caseStudies}
        />
      </motion.div>
    </section>
  )
}
