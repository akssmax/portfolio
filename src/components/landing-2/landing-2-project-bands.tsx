import { CropMarks } from "@/components/landing-2/crop-marks"
import { DitherField, type DitherColor } from "@/components/landing-2/dither-field"
import { OsButton } from "@/components/landing-2/os-button"
import { OsWindow, type OsWindowTone } from "@/components/landing-2/os-window"
import { getProjectGallery } from "@/lib/landing-2/project-gallery"
import { getProjectLiveUrl } from "@/lib/landing-2/project-live-urls"
import type { ProjectCard } from "@/lib/sanity/types"
import { cn } from "@/lib/utils"

const BANDS: Array<{ color: DitherColor; tone: OsWindowTone; label: string }> = [
  { color: "cyan", tone: "cyan", label: "::  selected work  ::" },
  { color: "yellow", tone: "yellow", label: "::  shipped product  ::" },
  { color: "lime", tone: "lime", label: "::  selected work  ::" },
  { color: "orange", tone: "orange", label: "::  shipped product  ::" },
  { color: "pink", tone: "pink", label: "::  selected work  ::" },
  { color: "violet", tone: "violet", label: "::  shipped product  ::" },
]

function uniqueProjects(projects: ProjectCard[]) {
  const seen = new Set<string>()
  return projects.filter((project) => {
    if (seen.has(project.slug)) return false
    seen.add(project.slug)
    return true
  })
}

type Landing2ProjectBandsProps = {
  recentProjects: ProjectCard[]
  caseStudies: ProjectCard[]
}

export function Landing2ProjectBands({
  recentProjects,
  caseStudies,
}: Landing2ProjectBandsProps) {
  const featured = uniqueProjects([...caseStudies, ...recentProjects]).slice(0, BANDS.length)

  return (
    <>
      {featured.map((project, index) => {
        const band = BANDS[index] ?? BANDS[0]
        const liveUrl = getProjectLiveUrl(project.slug)
        const gallery = getProjectGallery(project.slug)
        const reverse = index % 2 === 1
        const secondary = gallery[0] ?? project.coverImageUrl
        const tertiary = gallery[1]

        return (
          <section
            key={project._id}
            className="relative min-h-svh overflow-x-clip border-b-2 border-foreground"
          >
            <DitherField variant="desktop" color={band.color} />
            <CropMarks className="hidden sm:block" />
            <div className="relative z-10 mx-auto grid min-h-svh max-w-[92rem] items-center gap-10 px-4 py-16 sm:px-8 md:grid-cols-12 md:gap-12 md:py-20">
              <div
                className={cn(
                  "relative md:col-span-7",
                  reverse && "md:order-2",
                )}
              >
                <OsWindow
                  title={project.title}
                  className="w-full"
                  tone={band.tone}
                  bodyClassName="p-0"
                  to="/projects/$slug"
                  params={{ slug: project.slug }}
                >
                  {project.coverImageUrl ? (
                    <img
                      src={project.coverImageUrl}
                      alt=""
                      className="aspect-[16/10] w-full object-cover"
                    />
                  ) : null}
                </OsWindow>
                {secondary ? (
                  <OsWindow
                    title={`${project.title} · 2`}
                    className="absolute -right-2 -bottom-8 hidden w-[13.5rem] rotate-2 sm:block md:-right-4"
                    tone={reverse ? "pink" : "orange"}
                    bodyClassName="p-0"
                    to="/projects/$slug"
                    params={{ slug: project.slug }}
                  >
                    <img src={secondary} alt="" className="aspect-[4/3] w-full object-cover" />
                  </OsWindow>
                ) : null}
                {tertiary ? (
                  <OsWindow
                    title="Mobile 1.1"
                    className="absolute -bottom-4 -left-2 hidden w-[8.5rem] -rotate-3 lg:block"
                    tone={reverse ? "lime" : "violet"}
                    bodyClassName="p-0"
                    to="/projects/$slug"
                    params={{ slug: project.slug }}
                  >
                    <img src={tertiary} alt="" className="aspect-[3/4] w-full object-cover object-top" />
                  </OsWindow>
                ) : null}
              </div>

              <div className={cn("md:col-span-5", reverse && "md:order-1")}>
                <p className="landing-2-ornament mb-3">{band.label}</p>
                <h2 className="landing-2-headline text-4xl sm:text-5xl lg:text-7xl">
                  {project.title}
                </h2>
                <p className="mt-6 max-w-xl text-sm leading-relaxed sm:text-base">
                  {project.description}
                </p>
                <OsWindow title="Metrics.Ship" className="mt-6 w-full max-w-md" tone={band.tone}>
                  <p className="text-sm leading-relaxed">
                    {[project.year, project.role, project.metrics].filter(Boolean).join(" · ")}
                  </p>
                </OsWindow>
                <div className="mt-8 flex flex-wrap gap-3">
                  <OsButton inverted href={`/projects/${project.slug}`}>
                    Read More
                  </OsButton>
                  {liveUrl ? <OsButton href={liveUrl}>Try it</OsButton> : null}
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}
