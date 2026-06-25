import { Link } from "@tanstack/react-router"
import { motion, useReducedMotion } from "motion/react"
import { History, Sparkles } from "lucide-react"

import type { ProjectCard as ProjectCardType } from "@/lib/sanity/types"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import { ProjectCardCover } from "@/components/projects/project-card-cover"
import { getBuildBadgeLabel } from "@/lib/projects/build-badge"

const MotionCard = motion.create(Card)

const cardHoverVariants = {
  rest: { y: 0 },
  hover: {
    y: -4,
    transition: { type: "spring" as const, stiffness: 400, damping: 28 },
  },
}

type ProjectCardProps = {
  project: ProjectCardType
}

function BuildBadgeTag({ badge }: { badge: NonNullable<ProjectCardType["buildBadge"]> }) {
  const label = getBuildBadgeLabel(badge)
  if (!label) return null

  const Icon = badge === "built-with-ai" ? Sparkles : History

  return (
    <Tag variant="outline" className="gap-1">
      <Icon aria-hidden />
      {label}
    </Tag>
  )
}

export function ProjectCard({ project }: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion()

  const hoverProps = shouldReduceMotion
    ? {}
    : {
        variants: cardHoverVariants,
        initial: "rest" as const,
        whileHover: "hover" as const,
      }

  return (
    <Link
      to="/projects/$slug"
      params={{ slug: project.slug }}
      className="block h-full"
    >
      <MotionCard
        className="group h-full gap-4 overflow-hidden pt-0 transition-shadow hover:shadow-md"
        {...hoverProps}
      >
        <ProjectCardCover project={project} />
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {project.tag}
            </p>
            {project.buildBadge ? <BuildBadgeTag badge={project.buildBadge} /> : null}
          </div>
          <CardTitle className="text-lg">{project.title}</CardTitle>
          <CardDescription className="text-base">
            {project.description}
          </CardDescription>
        </CardHeader>
      </MotionCard>
    </Link>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

type ProjectGridProps = {
  projects: Array<ProjectCardType>
  animated?: boolean
}

export function ProjectGrid({ projects, animated = true }: ProjectGridProps) {
  const shouldReduceMotion = useReducedMotion()

  if (!animated || shouldReduceMotion) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {projects.map((project) => (
        <motion.div key={project._id} variants={itemVariants}>
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </motion.div>
  )
}
