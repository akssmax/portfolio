import { motion, useReducedMotion } from "motion/react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getImageUrl } from "@/lib/sanity/image"
import {
  getRecentProjectPlaceholder,
  usesAvatarCardCover,
} from "@/lib/projects/project-card-placeholder"
import type { ProjectCard as ProjectCardType } from "@/lib/sanity/types"

const imageHoverVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.03,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

type ProjectCardCoverProps = {
  project: ProjectCardType
}

function ProjectAvatarPlaceholder({ project }: ProjectCardCoverProps) {
  const { initials, fallbackClassName } = getRecentProjectPlaceholder(
    project.slug,
    project.title,
  )

  return (
    <div className="flex aspect-[16/10] items-center justify-center border-b border-border bg-muted/25">
      <Avatar className="size-28 rounded-2xl after:rounded-2xl">
        <AvatarFallback
          className={`rounded-2xl text-lg font-semibold tracking-tight ${fallbackClassName}`}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
    </div>
  )
}

export function ProjectCardCover({ project }: ProjectCardCoverProps) {
  const shouldReduceMotion = useReducedMotion()

  if (usesAvatarCardCover(project.workSection)) {
    return <ProjectAvatarPlaceholder project={project} />
  }

  const coverUrl = project.coverImageUrl ?? getImageUrl(project.coverImage, 800)

  if (coverUrl) {
    return (
      <div className="overflow-hidden border-b border-border">
        <motion.img
          src={coverUrl}
          alt={project.coverImage?.alt ?? project.title}
          className="aspect-[16/10] w-full object-cover"
          variants={shouldReduceMotion ? undefined : imageHoverVariants}
        />
      </div>
    )
  }

  return (
    <div className="flex aspect-[16/10] items-center justify-center border-b border-border bg-muted/40">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {project.tag}
      </span>
    </div>
  )
}
