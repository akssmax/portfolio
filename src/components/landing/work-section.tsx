import { Link } from "@tanstack/react-router"
import { motion, useReducedMotion } from "motion/react"
import { ArrowRight } from "lucide-react"

import { ProjectGrid } from "@/components/projects/project-grid"
import { Button } from "@/components/ui/button"
import type { ProjectCard } from "@/lib/sanity/types"

type WorkSectionProps = {
  projects: ProjectCard[]
}

export function WorkSection({ projects }: WorkSectionProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="work"
      className="border-t border-border bg-section py-24 text-section-foreground"
    >
      <motion.div
        className="mx-auto max-w-6xl px-4 sm:px-6"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Recent work
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              A few projects where design craft and engineering rigor came together.
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

        <ProjectGrid projects={projects} />
      </motion.div>
    </section>
  )
}
