import { Link } from "@tanstack/react-router"
import { motion, useReducedMotion } from "motion/react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getImageUrl } from "@/lib/sanity/image"
import type { ProjectCard as ProjectCardType } from "@/lib/sanity/types"

const MotionCard = motion.create(Card)

const cardHoverVariants = {
  rest: { y: 0 },
  hover: {
    y: -4,
    transition: { type: "spring" as const, stiffness: 400, damping: 28 },
  },
}

const imageHoverVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.03,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

type ProjectCardProps = {
  project: ProjectCardType
}

export function ProjectCard({ project }: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion()
  const coverUrl = project.coverImageUrl ?? getImageUrl(project.coverImage, 800)

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
        className="h-full gap-4 overflow-hidden pt-0 transition-shadow hover:shadow-md"
        {...hoverProps}
      >
        {coverUrl ? (
          <div className="overflow-hidden border-b border-border">
            <motion.img
              src={coverUrl}
              alt={project.coverImage?.alt ?? project.title}
              className="aspect-[16/10] w-full object-cover"
              variants={shouldReduceMotion ? undefined : imageHoverVariants}
            />
          </div>
        ) : (
          <div className="flex aspect-[16/10] items-center justify-center border-b border-border bg-muted/40">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {project.tag}
            </span>
          </div>
        )}
        <CardHeader>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {project.tag}
          </p>
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
  projects: ProjectCardType[]
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
