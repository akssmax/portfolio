"use client"

import { ArrowUpRight, Mail } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import {
  DribbbleIcon,
  GithubIcon,
  LinkedinIcon,
  MediumIcon,
  YoutubeIcon,
} from "@/components/icons/social-icons"
import { ContactDotGridBackground } from "@/components/landing/contact-dot-grid-background"
import { m3ShapePaths } from "@/lib/m3-shape-paths"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DownloadResumeButton } from "@/features/resume/download-resume-button"
import { profile } from "@/lib/profile"
import { cn } from "@/lib/utils"

const socialLinks = [
  { label: "LinkedIn", href: profile.links.linkedin, Icon: LinkedinIcon },
  { label: "GitHub", href: profile.links.github, Icon: GithubIcon },
  { label: "Dribbble", href: profile.links.dribbble, Icon: DribbbleIcon },
  { label: "Medium", href: profile.links.medium, Icon: MediumIcon },
  { label: "YouTube", href: profile.links.youtube, Icon: YoutubeIcon },
] as const

export function AboutConnectSection() {
  const shouldReduceMotion = useReducedMotion()

  const m3Size = 180
  const bottomCutoutPosition = "right"

  const getPositionClass = (pos: "left" | "center" | "right") => {
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
    const path = m3ShapePaths["flower"]
    if (!path) return null

    const pos = bottomCutoutPosition
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

  return (
    <section
      id="connect"
      className="relative overflow-hidden bg-primary text-primary-foreground"
    >
      <div className="absolute inset-0 opacity-55" aria-hidden>
        <ContactDotGridBackground />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-white/10" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <motion.div
          className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,380px)] lg:items-stretch lg:gap-12"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col justify-center gap-6">
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground/70">
                Connect
              </p>
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Open to design engineering collaborations
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
                Freelance, full-time, and founder partnerships across product design,
                design systems, and React UI. Based in {profile.location}.
              </p>
            </div>

            <nav
              className="flex flex-wrap gap-3"
              aria-label="Social profiles"
            >
              {socialLinks.map(({ label, href, Icon }) => (
                <Tooltip key={label}>
                  <TooltipTrigger asChild>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={cn(
                        "group inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10",
                        "transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/15",
                      )}
                    >
                      <Icon className="size-4 opacity-90 transition-opacity group-hover:opacity-100" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={6}>{label}</TooltipContent>
                </Tooltip>
              ))}
            </nav>
          </div>

          <motion.div
            className="flex flex-col justify-between gap-8 rounded-2xl border border-white/15 bg-background p-6 text-foreground shadow-2xl sm:p-8"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Quick actions
              </p>
              <p className="text-lg font-semibold tracking-tight">{profile.name}</p>
              <p className="text-sm text-muted-foreground">
                {profile.role} · {profile.company}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button size="lg" className="w-full justify-between" asChild>
                <a href={`mailto:${profile.contact.email}`}>
                  <span className="inline-flex items-center gap-2.5">
                    <Mail className="size-4" />
                    Email me
                  </span>
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="w-full justify-between" asChild>
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
              <DownloadResumeButton
                showIcon
                size="lg"
                variant="secondary"
                className="w-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* --- BOTTOM EDGE DECORATIONS --- */}
      <>
        {/* Straight line spanning the entire width */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-primary/30 z-10 pointer-events-none" aria-hidden />
        {/* Overlapping M3 shape acting as the cutout */}
        {renderM3Cutout(true)}
      </>
    </section>
  )
}
