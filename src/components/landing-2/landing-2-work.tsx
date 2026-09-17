import type { CSSProperties } from "react"

import { DitherField } from "@/components/landing-2/dither-field"
import { OsClock } from "@/components/landing-2/os-clock"
import { OsWindow, type OsWindowTone } from "@/components/landing-2/os-window"
import { getProjectGallery } from "@/lib/landing-2/project-gallery"
import { getProjectLiveUrl } from "@/lib/landing-2/project-live-urls"
import type { ProjectCard } from "@/lib/sanity/types"
import { cn } from "@/lib/utils"

const DESKTOP_SLOTS = [
  { top: "8%", left: "2%", width: "26rem", z: 2, rotate: "-1deg", tone: "cyan" },
  { top: "4%", left: "33%", width: "30rem", z: 5, rotate: "0.6deg", tone: "yellow" },
  { top: "10%", left: "66%", width: "24rem", z: 3, rotate: "-0.5deg", tone: "lime" },
  { top: "46%", left: "6%", width: "27rem", z: 4, rotate: "0.8deg", tone: "orange" },
  { top: "44%", left: "40%", width: "26rem", z: 6, rotate: "-0.7deg", tone: "violet" },
  { top: "50%", left: "68%", width: "24rem", z: 3, rotate: "1.1deg", tone: "pink" },
] as const

type Landing2WorkProps = {
  recentProjects: ProjectCard[]
  caseStudies: ProjectCard[]
}

export function Landing2Work({ recentProjects, caseStudies }: Landing2WorkProps) {
  const projects = [...caseStudies, ...recentProjects].slice(0, DESKTOP_SLOTS.length)

  return (
    <section id="work" className="relative overflow-hidden border-b-2 border-foreground">
      <DitherField variant="desktop" color="pink" />
      <div className="relative z-10 mx-3 my-3 min-h-[calc(100svh-5.5rem)] border-2 border-foreground sm:mx-5">
        <DitherField variant="desktop" color="pink" />
        <span className="relative z-10 m-3 inline-block border-2 border-foreground bg-foreground px-2 py-0.5 text-[10px] text-background">
          AS.OS.1
        </span>
        <OsClock className="absolute top-4 right-4 z-20 hidden w-[14rem] sm:block" tone="yellow" />

        <div className="relative z-10 grid gap-5 p-4 sm:hidden">
          {projects.map((project, index) => (
            <ProjectWindow
              key={project._id}
              project={project}
              tone={DESKTOP_SLOTS[index]?.tone}
            />
          ))}
        </div>

        <div className="absolute inset-0 hidden sm:block">
          {projects.map((project, index) => {
            const slot = DESKTOP_SLOTS[index]
            return (
              <ProjectWindow
                key={project._id}
                project={project}
                tone={slot.tone}
                className="absolute"
                style={{
                  top: slot.top,
                  left: slot.left,
                  width: slot.width,
                  zIndex: slot.z,
                  transform: `rotate(${slot.rotate})`,
                }}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ProjectWindow({
  project,
  className,
  style,
  tone,
}: {
  project: ProjectCard
  className?: string
  style?: CSSProperties
  tone?: OsWindowTone
}) {
  const liveUrl = getProjectLiveUrl(project.slug)
  const extra = getProjectGallery(project.slug)[0]

  return (
    <OsWindow
      title={project.title}
      className={cn(className)}
      style={style}
      to="/projects/$slug"
      params={{ slug: project.slug }}
      tone={tone}
      bodyClassName="p-0"
    >
      <img
        src={project.coverImageUrl ?? extra ?? "/images/og-banner.jpg"}
        alt=""
        className="h-40 w-full border-b border-foreground object-cover sm:h-52"
      />
      <div className="p-2.5">
        <p className="text-sm font-medium">{project.title}</p>
        <p className="mt-1 line-clamp-2 text-muted-foreground">{project.description}</p>
        <p className="mt-2 text-[10px] text-muted-foreground">
          {project.year ?? "Case study"}
          {liveUrl ? " · live" : ""}
        </p>
      </div>
    </OsWindow>
  )
}
