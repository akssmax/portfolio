import { Suspense, lazy, useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

import type { BentoSize } from "@/lib/projects/bento-placements"
import type { ProjectCard } from "@/lib/sanity/types"
import { KodoLogo } from "@/components/logos/kodo-logo"
import { UnloggedLogo } from "@/components/logos/unlogged-logo"
import { cn } from "@/lib/utils"
import { useCanAnimate } from "@/hooks/use-can-animate"

const ShapeWaves = lazy(() => import("./ShapeWaves"))

const palettes: Record<
  string,
  { background: string; wave: string; hover: string; accent: string }
> = {
  kodo: {
    background: "#faf5fa",
    wave: "#cab9cd",
    hover: "#df78ac",
    accent: "rgba(219, 118, 169, 0.2)",
  },
  unlogged: {
    background: "#f4f9ff",
    wave: "#adc8e3",
    hover: "#4b96d2",
    accent: "rgba(80, 146, 199, 0.18)",
  },
  tulr: {
    background: "#f8f5ff",
    wave: "#c6b7e2",
    hover: "#8564bc",
    accent: "rgba(128, 97, 189, 0.2)",
  },
}

const darkPalettes: Record<
  string,
  { background: string; wave: string; hover: string; accent: string }
> = {
  kodo: { background: "#111113", wave: "#4a4650", hover: "#ffffff", accent: "rgba(255, 255, 255, 0.12)" },
  unlogged: { background: "#101215", wave: "#434a54", hover: "#ffffff", accent: "rgba(255, 255, 255, 0.12)" },
  tulr: { background: "#121115", wave: "#4d4856", hover: "#ffffff", accent: "rgba(255, 255, 255, 0.12)" },
}

function ProjectLogo({ project }: { project: ProjectCard }) {
  if (project.slug === "kodo")
    return <KodoLogo className="w-full text-[#17151c] dark:text-white" />
  if (project.slug === "unlogged")
    return <UnloggedLogo className="w-full text-[#17202b] dark:text-white" />
  if (project.slug === "tulr") {
    return (
      <img
        src="/companies/tulr.svg"
        alt="Tulr"
        className="block w-full dark:brightness-0 dark:invert"
        loading="lazy"
      />
    )
  }
  return (
    <span className="font-semibold tracking-tight text-[#17151c] dark:text-white">
      {project.title}
    </span>
  )
}

export function CaseStudyFeatureVisual({
  project,
  size,
  className,
}: {
  project: ProjectCard
  size: BentoSize
  className?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [nearViewport, setNearViewport] = useState(false)
  const canAnimate = useCanAnimate()
  const { resolvedTheme } = useTheme()
  const palette = resolvedTheme === "dark"
    ? darkPalettes[project.slug] ?? darkPalettes.kodo
    : palettes[project.slug] ?? palettes.kodo

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      ([entry]) => setNearViewport(entry.isIntersecting),
      { rootMargin: "120px" }
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={rootRef}
      className={cn(
        "group/case-visual relative isolate w-full overflow-hidden rounded-xl border border-black/[0.06] dark:border-white/10 contain-paint",
        size === "wide"
          ? "h-[290px] sm:h-[340px] lg:h-[390px]"
          : "h-[260px] sm:h-[300px]",
        className
      )}
      style={{ backgroundColor: palette.background }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${palette.accent}, transparent 60%), radial-gradient(${palette.wave} 0.5px, transparent 0.5px)`,
          backgroundSize: "100% 100%, 16px 16px",
        }}
        aria-hidden
      />
      {nearViewport && canAnimate && (
        <div
          className="pointer-events-none absolute inset-0 opacity-75"
          aria-hidden
        >
          <Suspense fallback={null}>
            <ShapeWaves
              shapes="mixed"
              cellSize={13}
              dotSize={0.66}
              color={palette.wave}
              hoverColor={palette.hover}
              backgroundColor={palette.background}
              speed={0.35}
              scale={1.35}
              contrast={1.15}
              brightness={0.48}
              fade={0.62}
              interactive
              splashRadius={48}
              splashStrength={0.42}
              glow={0}
              intro
              introDuration={1.5}
            />
          </Suspense>
        </div>
      )}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_44%_40%_at_50%_50%,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.8)_36%,rgba(255,255,255,0)_100%)] dark:bg-[radial-gradient(ellipse_44%_40%_at_50%_50%,rgba(18,19,21,0.92)_0%,rgba(18,19,21,0.7)_36%,rgba(18,19,21,0)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/90 dark:bg-white/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/[0.04] dark:bg-white/5"
        aria-hidden
      />
      <div className="relative z-10 flex h-full items-center justify-center px-8">
        <div className="w-[min(40%,220px)] min-w-[135px] drop-shadow-[0_14px_30px_rgba(29,26,52,0.08)] transition-transform duration-500 ease-out group-hover/card:scale-[1.045]">
          <ProjectLogo project={project} />
        </div>
      </div>
    </div>
  )
}
