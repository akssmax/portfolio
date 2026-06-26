import { ArrowUpRight, Mail } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { ContactDotGridBackground } from "@/components/landing/contact-dot-grid-background"
import { GithubIcon, LinkedinIcon } from "@/components/icons/social-icons"
import { Button } from "@/components/ui/button"
import { profile } from "@/lib/profile"
import { MONOGRAM_MAIN, MONOGRAM_ACCENT, MONOGRAM_VIEWBOX } from "@/lib/brand/monogram-mark"
import { m3ShapePaths } from "@/lib/m3-shape-paths"

export type CtaSectionVariant =
  | "dub-notch"
  | "m3-arch"
  | "m3-flower"
  | "m3-cookie"
  | "m3-heart"
  | "m3-pill"
  | "m3-hexagon"
  | "m3-puffy"
  | "minimal"

export type CtaSectionPosition = "left" | "center" | "right"

export interface CtaSectionProps {
  variant?: CtaSectionVariant
  id?: string
  className?: string
  
  // Cutout configuration
  topCutout?: boolean
  bottomCutout?: boolean
  topCutoutPosition?: CtaSectionPosition
  bottomCutoutPosition?: CtaSectionPosition

  // Size configuration
  m3Size?: number
  dubWidth?: number
}

const M3_SHAPE_MAP: Record<string, string> = {
  "m3-arch": "arch",
  "m3-flower": "flower",
  "m3-cookie": "12-sided-cookie",
  "m3-heart": "heart",
  "m3-pill": "pill",
  "m3-hexagon": "hexagon",
  "m3-puffy": "puffy",
}

export function CtaSection({
  variant = "dub-notch",
  id = "contact",
  className,
  topCutout = true,
  bottomCutout = false,
  topCutoutPosition = "center",
  bottomCutoutPosition = "center",
  m3Size = 72,
  dubWidth = 320,
}: CtaSectionProps) {
  const shouldReduceMotion = useReducedMotion()

  const getPositionClass = (pos: CtaSectionPosition) => {
    switch (pos) {
      case "left":
        return "left-8 sm:left-16"
      case "right":
        return "right-8 sm:right-16"
      default:
        return "left-1/2 -translate-x-1/2"
    }
  }

  const renderM3Cutout = (isBottom = false) => {
    const shapeKey = M3_SHAPE_MAP[variant]
    const path = m3ShapePaths[shapeKey as keyof typeof m3ShapePaths]
    if (!path) return null

    const pos = isBottom ? bottomCutoutPosition : topCutoutPosition
    const posClass = getPositionClass(pos)

    return (
      <div
        className={`absolute shrink-0 overflow-visible flex items-center justify-center z-20 ${
          isBottom ? "transform scale-y-[-1]" : ""
        } ${posClass}`}
        style={{
          width: `${m3Size}px`,
          height: `${m3Size}px`,
          top: isBottom ? undefined : `${-m3Size / 2}px`,
          bottom: isBottom ? `${-m3Size / 2}px` : undefined,
        }}
        aria-hidden
      >
        <svg style={{ width: `${m3Size}px`, height: `${m3Size}px` }} className="overflow-visible" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Solid fill blocks the straight border line running underneath it */}
          <path d={path} className="fill-[var(--cta-cutout-bg,var(--background))]" />
          <path d={path} className="stroke-primary opacity-30" strokeWidth="15" fill="none" />
        </svg>
      </div>
    )
  }

  const isM3Shape = variant.startsWith("m3-")

  return (
    <section
      id={id}
      className={`relative overflow-hidden bg-primary text-primary-foreground ${className || ""}`}
    >
      {/* --- TOP EDGE DECORATIONS --- */}
      {topCutout && variant === "dub-notch" && (
        <div className="absolute top-0 left-0 right-0 flex items-start pointer-events-none z-10" aria-hidden>
          <div className={`h-px bg-primary/30 ${
            topCutoutPosition === "left" ? "w-8 sm:w-16" : "flex-1"
          }`} />
          <svg style={{ width: `${dubWidth}px` }} className="h-[36px] shrink-0" viewBox={`0 0 ${dubWidth} 36`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d={`M24 -1 C 40 -1, 40 35, 56 35 H${dubWidth - 56} C ${dubWidth - 40} 35, ${dubWidth - 40} -1, ${dubWidth - 24} -1 Z`} className="fill-[var(--cta-cutout-bg,var(--background))]" />
            <path d={`M0 0.5 H24 C 40 0.5, 40 35.5, 56 35.5 H${dubWidth - 56} C ${dubWidth - 40} 35.5, ${dubWidth - 40} 0.5, ${dubWidth - 24} 0.5 H${dubWidth}`} className="stroke-primary opacity-30" strokeWidth="1" />
          </svg>
          <div className={`h-px bg-primary/30 ${
            topCutoutPosition === "right" ? "w-8 sm:w-16" : "flex-1"
          }`} />
        </div>
      )}

      {topCutout && isM3Shape && (
        <>
          {/* Straight line spanning the entire width */}
          <div className="absolute top-0 left-0 right-0 h-px bg-primary/30 z-10 pointer-events-none" aria-hidden />
          {/* Overlapping M3 shape acting as the cutout */}
          {renderM3Cutout(false)}
        </>
      )}

      {/* Fallback/straight top border when top cutout is disabled or variant is minimal */}
      {(variant === "minimal" || (!topCutout && !isM3Shape)) && (
        <div className="absolute top-0 left-0 right-0 h-px bg-primary/30 z-10 pointer-events-none" aria-hidden />
      )}


      {/* --- BOTTOM EDGE DECORATIONS --- */}
      {bottomCutout && variant === "dub-notch" && (
        <div className="absolute bottom-0 left-0 right-0 flex items-start pointer-events-none z-10 transform scale-y-[-1]" aria-hidden>
          <div className={`h-px bg-primary/30 ${
            bottomCutoutPosition === "left" ? "w-8 sm:w-16" : "flex-1"
          }`} />
          <svg style={{ width: `${dubWidth}px` }} className="h-[36px] shrink-0" viewBox={`0 0 ${dubWidth} 36`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d={`M24 -1 C 40 -1, 40 35, 56 35 H${dubWidth - 56} C ${dubWidth - 40} 35, ${dubWidth - 40} -1, ${dubWidth - 24} -1 Z`} className="fill-[var(--cta-cutout-bg,var(--background))]" />
            <path d={`M0 0.5 H24 C 40 0.5, 40 35.5, 56 35.5 H${dubWidth - 56} C ${dubWidth - 40} 35.5, ${dubWidth - 40} 0.5, ${dubWidth - 24} 0.5 H${dubWidth}`} className="stroke-primary opacity-30" strokeWidth="1" />
          </svg>
          <div className={`h-px bg-primary/30 ${
            bottomCutoutPosition === "right" ? "w-8 sm:w-16" : "flex-1"
          }`} />
        </div>
      )}

      {bottomCutout && isM3Shape && (
        <>
          {/* Straight line spanning the entire width */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-primary/30 z-10 pointer-events-none" aria-hidden />
          {/* Overlapping M3 shape acting as the cutout */}
          {renderM3Cutout(true)}
        </>
      )}

      {/* Fallback/straight bottom border when bottom cutout is disabled or variant is minimal */}
      {(variant === "minimal" || (!bottomCutout && !isM3Shape)) && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-primary/30 z-10 pointer-events-none" aria-hidden />
      )}


      {/* Background container with dots */}
      <div className="absolute inset-0 opacity-55" aria-hidden>
        <ContactDotGridBackground />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-white/10" />
      </div>

      {/* Subtle Brand Watermarks on top-left and bottom-right */}
      {variant !== "minimal" && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.08] dark:opacity-[0.05]" aria-hidden>
          <svg
            className="absolute -left-20 -top-20 w-[450px] h-[450px] text-primary-foreground fill-current rotate-[12deg]"
            viewBox={MONOGRAM_VIEWBOX}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d={MONOGRAM_MAIN} />
            <path d={MONOGRAM_ACCENT} />
          </svg>
          <svg
            className="absolute -right-24 -bottom-24 w-[500px] h-[500px] text-primary-foreground fill-current -rotate-[15deg]"
            viewBox={MONOGRAM_VIEWBOX}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d={MONOGRAM_MAIN} />
            <path d={MONOGRAM_ACCENT} />
          </svg>
        </div>
      )}

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <motion.div
          className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-stretch lg:gap-12"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col justify-center gap-5">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground/70">
              Contact
            </p>
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Let&apos;s build something together
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
              Open to freelance, full-time, and collaboration on product design and
              design-engineering projects. Based in {profile.location}.
            </p>
          </div>

          <motion.div
            className="flex flex-col justify-between gap-6 rounded-2xl border border-white/15 bg-background p-6 text-foreground shadow-2xl sm:p-8"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Available for work
              </p>
              <p className="text-lg font-semibold tracking-tight">
                {profile.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {profile.role} · {profile.company}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button size="lg" className="w-full justify-between" asChild>
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <LinkedinIcon />
                    Connect on LinkedIn
                  </span>
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="w-full justify-between" asChild>
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <GithubIcon />
                    View GitHub
                  </span>
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="w-full justify-between"
                asChild
              >
                <a href="mailto:akshaysaini.design@gmail.com">
                  <span className="inline-flex items-center gap-2.5">
                    <Mail className="size-4" />
                    Send an email
                  </span>
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export function ContactSection({
  variant = "dub-notch",
  topCutout = true,
  bottomCutout = false,
  topCutoutPosition = "center",
  bottomCutoutPosition = "center",
  m3Size = 72,
  dubWidth = 320,
}: {
  variant?: CtaSectionVariant
  topCutout?: boolean
  bottomCutout?: boolean
  topCutoutPosition?: CtaSectionPosition
  bottomCutoutPosition?: CtaSectionPosition
  m3Size?: number
  dubWidth?: number
}) {
  return (
    <CtaSection
      variant={variant}
      topCutout={topCutout}
      bottomCutout={bottomCutout}
      topCutoutPosition={topCutoutPosition}
      bottomCutoutPosition={bottomCutoutPosition}
      m3Size={m3Size}
      dubWidth={dubWidth}
    />
  )
}
