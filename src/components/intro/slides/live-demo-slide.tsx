"use client"

import { motion } from "motion/react"
import { ExternalLink, Sparkles } from "lucide-react"

import { DeckMediaGlow } from "@/components/intro/deck-slide-background"
import { SectionIntro } from "@/components/marketing/section-intro"
import { Button } from "@/components/ui/button"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"
import type { DeckData } from "@/lib/intro/types"

type LiveDemoSlideProps = {
  data: DeckData["liveDemo"]
}

export function LiveDemoSlide({ data }: LiveDemoSlideProps) {
  const { fullMotion } = useAnimationProfile()

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 text-center">
      <motion.div
        initial={fullMotion ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT_SMOOTH, delay: 0.05 }}
        className="flex w-full flex-col items-center gap-6"
      >
        <SectionIntro
          eyebrow="Live demo"
          heading={data.heading}
          description={data.description}
          className="mx-auto max-w-2xl text-center"
        />

        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
            <Sparkles className="size-4 text-primary" aria-hidden />
            Core features
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {data.features.map((feature, index) => (
              <motion.span
                key={feature}
                initial={fullMotion ? { opacity: 0, y: 8 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  ease: EASE_OUT_SMOOTH,
                  delay: 0.14 + index * 0.04,
                }}
                className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-medium text-foreground"
              >
                {feature}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="w-fit">
            <a href={data.liveUrl} target="_blank" rel="noopener noreferrer">
              {data.ctaLabel}
              <ExternalLink className="size-4" aria-hidden />
            </a>
          </Button>

          {data.secondaryLiveUrl && data.secondaryCtaLabel ? (
            <Button asChild variant="outline" size="lg" className="w-fit">
              <a href={data.secondaryLiveUrl} target="_blank" rel="noopener noreferrer">
                {data.secondaryCtaLabel}
                <ExternalLink className="size-4" aria-hidden />
              </a>
            </Button>
          ) : null}
        </div>
      </motion.div>

      <motion.div
        initial={fullMotion ? { opacity: 0, y: 24, scale: 0.98 } : false}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: EASE_OUT_SMOOTH, delay: 0.12 }}
        className="relative w-full"
      >
        <DeckMediaGlow />

        <a
          href={data.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden rounded-2xl border border-border/80 bg-muted/20 shadow-2xl shadow-primary/5 ring-1 ring-white/5 transition-[border-color,box-shadow] hover:border-primary/30 hover:shadow-primary/10"
          aria-label={`${data.ctaLabel} — opens in a new tab`}
        >
          <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <img
            src={data.screenshot.src}
            alt={data.screenshot.alt}
            className="aspect-[16/10] w-full object-cover object-[center_78%] transition-transform duration-500 group-hover:scale-[1.01]"
          />

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-background/95 via-background/60 to-transparent px-4 py-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="text-xs font-medium text-foreground sm:text-sm">
              {data.ctaLabel}
            </span>
            <ExternalLink className="size-4 shrink-0 text-primary" aria-hidden />
          </div>
        </a>
      </motion.div>
    </div>
  )
}
