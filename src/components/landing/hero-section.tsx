import { motion, useReducedMotion } from "motion/react"
import { ArrowDown } from "lucide-react"

import { ErrorBoundary } from "@/components/error-boundary"
import { M3FeatureImage } from "@/components/m3-shapes"
import {
  InteractiveStrandsBackground,
  useInteractiveStrands,
} from "@/components/projects/interactive-strands-background"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { heroPortraitItems } from "@/lib/hero-portraits"
import { PRIDE_FLAG_COLORS } from "@/lib/pride-colors"
import { profile } from "@/lib/profile"

const HERO_STRAND_COLORS = [...PRIDE_FLAG_COLORS]

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion()
  const { dynamicPropsRef, mouseHandlers } = useInteractiveStrands()

  return (
    <section
      className="relative isolate overflow-hidden"
      {...(!shouldReduceMotion ? mouseHandlers : {})}
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        {!shouldReduceMotion ? (
          <ErrorBoundary title="Background animation failed" showHeader={false}>
            <InteractiveStrandsBackground
              dynamicPropsRef={dynamicPropsRef}
              colors={HERO_STRAND_COLORS}
              className="absolute inset-0"
            />
          </ErrorBoundary>
        ) : null}
        <div className="absolute inset-0 bg-background/75" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl transform-gpu items-center gap-12 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-[1fr_auto] lg:gap-16">
        <motion.div
          className="flex max-w-3xl flex-col gap-6"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="w-fit">
            {profile.role} @ {profile.company}
          </Badge>
          <p className="text-sm font-medium text-muted-foreground">
            {profile.name} · {profile.location}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {profile.title}
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            {profile.tagline}
          </p>
          <motion.div
            className="flex flex-wrap gap-3"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Button size="lg" asChild>
              <a href="#work">View work</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#contact">Get in touch</a>
            </Button>
          </motion.div>
          <motion.a
            href="#work"
            className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            aria-label="Scroll to work section"
          >
            <ArrowDown className="size-4" />
            Scroll to explore
          </motion.a>
        </motion.div>

        <motion.div
          className="relative isolate z-20 mx-auto shrink-0 lg:mx-0"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ErrorBoundary title="Portrait failed to load" showHeader={false}>
            <M3FeatureImage
              items={heroPortraitItems}
              alt={`${profile.name} portrait`}
              imageClassName="size-80 sm:size-96 lg:size-[28rem] xl:size-[32rem] 2xl:size-[36rem]"
            />
          </ErrorBoundary>
        </motion.div>
      </div>
    </section>
  )
}
