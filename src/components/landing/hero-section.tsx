"use client"

import { useCallback, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"

import { ErrorBoundary } from "@/components/error-boundary"
import Lightfall from "@/components/Lightfall"
import { CompanyLogoBar } from "@/components/landing/company-logo-bar"
import { HeroRotatingHeadline, HeroRotatingTagline } from "@/components/landing/hero-rotating-headline"
import {
  M3FeatureImage,
  readStoredHeroPortraitIndex,
} from "@/components/m3-shapes/m3-feature-image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useInView } from "@/hooks/use-in-view"
import { HERO_HEADLINES, HERO_TAGLINES } from "@/lib/hero-headlines"
import {
  getRandomizedHeroPortraitItems,
  HERO_PORTRAIT_SLOT_COUNT,
} from "@/lib/hero-portraits"
import { HERO_LIGHTFALL_CONFIG } from "@/lib/pride-colors"
import { profile } from "@/lib/profile"

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isHeroInView = useInView(sectionRef, { threshold: 0.08, initialInView: true })
  const [portraitItems] = useState(() => getRandomizedHeroPortraitItems())
  const [headlineIndex, setHeadlineIndex] = useState(() =>
    readStoredHeroPortraitIndex(HERO_PORTRAIT_SLOT_COUNT) % HERO_HEADLINES.length,
  )

  const handleMorphStart = useCallback((nextIndex: number) => {
    if (!isHeroInView) return
    setHeadlineIndex(nextIndex % HERO_HEADLINES.length)
  }, [isHeroInView])

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-[94svh] overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        {!shouldReduceMotion ? (
          <ErrorBoundary title="Background animation failed" showHeader={false}>
            <Lightfall
              className="absolute inset-0"
              {...HERO_LIGHTFALL_CONFIG}
              pointerRootRef={sectionRef}
              paused={!isHeroInView}
            />
          </ErrorBoundary>
        ) : null}
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/55 to-background/25 lg:bg-gradient-to-r lg:from-background/92 lg:via-background/60 lg:to-background/15 dark:from-background/85 dark:via-background/60 dark:to-background/30"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[94svh] w-full max-w-6xl items-center gap-12 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[1fr_auto] lg:gap-16">
        <motion.div
          className="flex max-w-3xl flex-col gap-6"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="w-fit">
            {profile.role} @ {profile.company}
          </Badge>
          <p className="text-sm font-medium text-muted-foreground">
            {profile.name} · {profile.location}
          </p>
          <HeroRotatingHeadline lines={HERO_HEADLINES} index={headlineIndex} />
          <HeroRotatingTagline lines={HERO_TAGLINES} index={headlineIndex} />
          <motion.div
            className="flex flex-wrap gap-3"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Button size="lg" asChild>
              <a href="#work">View work</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#contact">Get in touch</a>
            </Button>
          </motion.div>
          <CompanyLogoBar />
        </motion.div>

        <motion.div
          className="relative z-20 mx-auto shrink-0 lg:mx-0"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ErrorBoundary title="Portrait failed to load" showHeader={false}>
            <M3FeatureImage
              items={portraitItems}
              alt={`${profile.name} portrait`}
              imageClassName="size-80 sm:size-96 lg:size-[28rem] xl:size-[32rem] 2xl:size-[36rem]"
              onMorphStart={handleMorphStart}
              active={isHeroInView}
            />
          </ErrorBoundary>
        </motion.div>
      </div>
    </section>
  )
}
