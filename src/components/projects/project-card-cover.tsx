import { motion, useReducedMotion } from "motion/react"
import { Cpu, FileUser, Layout, Sparkles, Terminal } from "lucide-react"

import type { ProjectCard as ProjectCardType } from "@/lib/sanity/types"
import type {MonogramPatternTone, MonogramPatternVariant} from "@/components/brand/monogram-patterns";
import { getImageUrl } from "@/lib/sanity/image"
import { usesAvatarCardCover } from "@/lib/projects/project-card-placeholder"
import {
  MonogramPattern
  
  
} from "@/components/brand/monogram-patterns"

function getPatternVariantForSlug(slug: string): MonogramPatternVariant {
  switch (slug) {
    case "100x-landing-page":
      return "offset"
    case "100x-chat-shell":
      return "diagonal"
    case "resume-builder":
      return "grid"
    case "v1-100x-proto":
      return "concentric"
    default:
      return "dots"
  }
}

function getPatternToneForSlug(slug: string): MonogramPatternTone {
  switch (slug) {
    case "100x-landing-page":
      return "accent"
    case "100x-chat-shell":
      return "primary"
    case "resume-builder":
      return "primary"
    case "v1-100x-proto":
      return "accent"
    default:
      return "muted"
  }
}

const imageHoverVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.03,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

const iconContainerVariants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.08,
    y: -4,
    transition: { type: "spring" as const, stiffness: 300, damping: 15 },
  },
}

const iconVariants = {
  rest: { rotate: 0 },
  hover: {
    rotate: 6,
    transition: { type: "spring" as const, stiffness: 200, damping: 10 },
  },
}

const PROJECT_ICON_CONFIG: Record<
  string,
  | {
      Icon: React.ComponentType<{ className?: string }>
      bgGradient: string
      iconColor: string
      glowColor: string
      borderColor: string
    }
  | undefined
> = {
  "100x-landing-page": {
    Icon: Layout,
    bgGradient: "from-secondary/15 via-secondary/5 to-transparent",
    iconColor: "text-secondary-foreground",
    glowColor: "shadow-secondary/10 dark:shadow-secondary/5",
    borderColor: "border-secondary/20",
  },
  "100x-chat-shell": {
    Icon: Terminal,
    bgGradient: "from-primary/15 via-primary/5 to-transparent",
    iconColor: "text-primary",
    glowColor: "shadow-primary/10 dark:shadow-primary/5",
    borderColor: "border-primary/20",
  },
  "resume-builder": {
    Icon: FileUser,
    bgGradient: "from-primary/15 via-primary/5 to-transparent",
    iconColor: "text-primary",
    glowColor: "shadow-primary/10 dark:shadow-primary/5",
    borderColor: "border-primary/20",
  },
  "v1-100x-proto": {
    Icon: Cpu,
    bgGradient: "from-accent/15 via-accent/5 to-transparent",
    iconColor: "text-accent-foreground",
    glowColor: "shadow-accent/10 dark:shadow-accent/5",
    borderColor: "border-accent/20",
  },
}

type ProjectCardCoverProps = {
  project: ProjectCardType
}

function ProjectIconPlaceholder({ project }: ProjectCardCoverProps) {
  const config = PROJECT_ICON_CONFIG[project.slug] || {
    Icon: Sparkles,
    bgGradient: "from-primary/10 via-primary/5 to-transparent",
    iconColor: "text-primary",
    glowColor: "shadow-primary/10",
    borderColor: "border-primary/20",
  }

  const { Icon, bgGradient, iconColor, glowColor, borderColor } = config

  return (
    <div className={`relative flex aspect-[16/10] items-center justify-center border-b border-border bg-gradient-to-b ${bgGradient} overflow-hidden`}>
      {/* Animated custom monogram background patterns */}
      <MonogramPattern
        variant={getPatternVariantForSlug(project.slug)}
        tone={getPatternToneForSlug(project.slug)}
        className="opacity-70 group-hover:opacity-95 transition-opacity duration-300 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"
      />
      
      <motion.div
        variants={iconContainerVariants}
        className={`relative z-10 flex size-24 items-center justify-center rounded-3xl border bg-card/80 shadow-sm ${borderColor} ${glowColor} backdrop-blur-xs transition-colors duration-300`}
      >
        <motion.div variants={iconVariants}>
          <Icon className={`size-10 ${iconColor}`} />
        </motion.div>
      </motion.div>
    </div>
  )
}

export function ProjectCardCover({ project }: ProjectCardCoverProps) {
  const shouldReduceMotion = useReducedMotion()

  if (usesAvatarCardCover(project.workSection)) {
    return <ProjectIconPlaceholder project={project} />
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
