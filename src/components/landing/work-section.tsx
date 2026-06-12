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
      className="border-t border-border bg-foreground py-24 text-background dark:bg-muted/80 dark:text-foreground"
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
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Selected work
            </h2>
            <p className="mt-3 text-base text-background/70 dark:text-muted-foreground">
              A few projects where design craft and engineering rigor came together.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-background/25 bg-transparent text-background hover:bg-background/10 hover:text-background dark:border-border dark:text-foreground dark:hover:bg-background/10"
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
