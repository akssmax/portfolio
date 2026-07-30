"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowUpRight, MapPin } from "lucide-react"

import { ErrorBoundary } from "@/components/error-boundary"
import { DeckMediaGlow } from "@/components/intro/deck-slide-background"
import { M3FeatureImage } from "@/components/m3-shapes/m3-feature-image"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { getRandomizedHeroPortraitItems } from "@/lib/hero-portraits"
import { getEmployerLogos } from "@/lib/profile"
import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"
import type { DeckData } from "@/lib/intro/types"
import { cn } from "@/lib/utils"

type AboutMeSlideProps = {
  data: DeckData["aboutMe"]
}

const ROTATING_ROLES = ["design", "build", "ship"] as const

type RotatingRolePhraseProps = {
  activeRole: (typeof ROTATING_ROLES)[number]
  fullMotion: boolean
}

function RotatingRolePhrase({ activeRole, fullMotion }: RotatingRolePhraseProps) {
  return (
    <p className="inline-flex flex-wrap items-end gap-x-[0.28em] text-2xl font-medium leading-none tracking-tight sm:text-3xl">
      <span className="text-muted-foreground">I</span>
      <span
        aria-live="polite"
        className="relative inline-grid h-[1em] overflow-hidden align-bottom leading-none"
      >
        <span
          className="invisible col-start-1 row-start-1 whitespace-nowrap capitalize"
          aria-hidden
        >
          {activeRole}
        </span>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={activeRole}
            initial={fullMotion ? { y: "100%", opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            exit={fullMotion ? { y: "-100%", opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.34, ease: EASE_OUT_SMOOTH }}
            className="col-start-1 row-start-1 self-end whitespace-nowrap capitalize text-primary"
          >
            {activeRole}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="text-foreground">product UI</span>
    </p>
  )
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.45,
      ease: EASE_OUT_SMOOTH,
    },
  }),
}

export function AboutMeSlide({ data }: AboutMeSlideProps) {
  const { fullMotion } = useAnimationProfile()
  const [portraitItems] = React.useState(() => getRandomizedHeroPortraitItems())
  const [roleIndex, setRoleIndex] = React.useState(0)
  const employers = React.useMemo(() => getEmployerLogos().slice(0, 4), [])

  React.useEffect(() => {
    if (!fullMotion) return

    const timer = window.setInterval(() => {
      setRoleIndex((current) => (current + 1) % ROTATING_ROLES.length)
    }, 2200)

    return () => window.clearInterval(timer)
  }, [fullMotion])

  const activeRole = ROTATING_ROLES[roleIndex]

  return (
    <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
      <div className="flex flex-col justify-center space-y-5 sm:space-y-6">
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="font-mono text-xs tracking-[0.25em] text-primary uppercase"
        >
          Hey, I&apos;m
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="font-heading text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl"
        >
          {data.name.split(" ")[0]}
          <span className="block text-primary">{data.name.split(" ").slice(1).join(" ")}</span>
        </motion.h1>

        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="pt-1"
        >
          <RotatingRolePhrase activeRole={activeRole} fullMotion={fullMotion} />
        </motion.div>

        <motion.p
          custom={3}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {data.tagline}
        </motion.p>

        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="flex flex-wrap gap-2"
        >
          {["Fintech", "DevTools", "Agentic AI", "Design systems"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-foreground"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-600 dark:text-emerald-400">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            {data.role} @ {data.company}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" aria-hidden />
            Bengaluru
          </span>
        </motion.div>

        <motion.div
          custom={6}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="space-y-2"
        >
          <p className="text-[10px] font-semibold tracking-wider text-muted-foreground">
            previously worked at
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {employers.map((employer) => (
              <a
                key={employer.name}
                href={employer.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/40 hover:bg-primary/5"
                onPointerDown={(event) => event.stopPropagation()}
                onPointerUp={(event) => event.stopPropagation()}
              >
                <img
                  src={employer.logoSrc}
                  alt=""
                  className="size-4 object-contain"
                  aria-hidden
                />
                {employer.name}
                <ArrowUpRight
                  className="size-3 opacity-0 transition-opacity group-hover:opacity-60"
                  aria-hidden
                />
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={fullMotion ? { opacity: 0, rotate: -2, scale: 0.94 } : false}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: EASE_OUT_SMOOTH, delay: 0.1 }}
        className="relative mx-auto flex w-full max-w-sm justify-center lg:max-w-none lg:justify-end"
      >
        <DeckMediaGlow className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-violet-500/25 via-primary/20 to-fuchsia-500/15 blur-3xl" />
        <ErrorBoundary title="Portrait failed to load" showHeader={false}>
          <M3FeatureImage
            items={portraitItems}
            alt={`${data.name} portrait`}
            className="relative mx-auto lg:ms-auto lg:me-0"
            imageClassName={cn(
              "size-60 sm:size-72 md:size-80 lg:size-[21rem] xl:size-[23rem]",
              fullMotion &&
                "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:rotate-1 motion-reduce:transition-none motion-reduce:hover:rotate-0",
            )}
            active={fullMotion}
          />
        </ErrorBoundary>
      </motion.div>
    </div>
  )
}
