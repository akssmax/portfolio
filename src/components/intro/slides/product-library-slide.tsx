"use client"

import { motion } from "motion/react"
import { ExternalLink } from "lucide-react"

import { CaseStudyScreenshot } from "@/components/projects/case-study-screenshot"
import { DeckMediaGlow } from "@/components/intro/deck-slide-background"
import { SectionIntro } from "@/components/marketing/section-intro"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"
import type { DeckData } from "@/lib/intro/types"

type ProductLibrarySlideProps = {
  data: DeckData["productLibrary"]
}

export function ProductLibrarySlide({ data }: ProductLibrarySlideProps) {
  const { fullMotion } = useAnimationProfile()

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Product"
        heading={data.title}
        description={data.description}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {data.images.map((image, index) => (
          <motion.div
            key={image.src}
            initial={fullMotion ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              ease: EASE_OUT_SMOOTH,
              delay: 0.1 + index * 0.08,
            }}
            className="space-y-3"
          >
            <div className="relative">
              <DeckMediaGlow className="absolute -inset-4 rounded-[1.5rem] bg-gradient-to-br from-violet-500/20 via-primary/15 to-fuchsia-500/10 blur-2xl" />
              <CaseStudyScreenshot
              src={image.src}
              alt={image.alt}
              href={image.href}
              label={image.label}
            />
            </div>
            <div className="flex items-center justify-between gap-2 px-1">
              <p className="text-sm font-medium text-foreground">{image.label}</p>
              {image.href ? (
                <a
                  href={image.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Open live
                  <ExternalLink className="size-3" aria-hidden />
                </a>
              ) : null}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
