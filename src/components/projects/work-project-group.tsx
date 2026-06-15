import { ProjectGrid } from "@/components/projects/project-grid"
import type { ProjectCard } from "@/lib/sanity/types"

type WorkProjectGroupProps = {
  id?: string
  title: string
  description: string
  projects: ProjectCard[]
  animated?: boolean
}

export function WorkProjectGroup({
  id,
  title,
  description,
  projects,
  animated = true,
}: WorkProjectGroupProps) {
  if (projects.length === 0) return null

  return (
    <section id={id} className="space-y-8">
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
        <p className="mt-2 text-base text-muted-foreground">{description}</p>
      </div>
      <ProjectGrid projects={projects} animated={animated} />
    </section>
  )
}
