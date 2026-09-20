import { motion, useReducedMotion } from "motion/react"

import type { ProjectCard } from "@/lib/sanity/types"
import { FeatureCardGrid } from "@/components/marketing/feature-card-grid"

type ProjectGridProps = {
  projects: Array<ProjectCard>
  animated?: boolean
  layout?: "compact" | "case-study"
}

export function ProjectGrid({ projects, animated = true, layout = "compact" }: ProjectGridProps) {
  const shouldReduceMotion = useReducedMotion()
  const grid = <FeatureCardGrid projects={projects} linkFrom="projects" primaryLink="case-study" layout={layout} />

  if (!animated || shouldReduceMotion) return grid

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, margin: "-60px" }}
    >
      {grid}
    </motion.div>
  )
}
