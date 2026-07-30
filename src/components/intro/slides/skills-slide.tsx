"use client"

import { motion } from "motion/react"

import { SectionIntro } from "@/components/marketing/section-intro"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"
import type { DeckData } from "@/lib/intro/types"

type SkillsSlideProps = {
  data: DeckData["skills"]
}

type SkillGroupProps = {
  title: string
  items: string[]
  delay: number
  fullMotion: boolean
}

function SkillGroup({ title, items, delay, fullMotion }: SkillGroupProps) {
  return (
    <motion.div
      initial={fullMotion ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_OUT_SMOOTH, delay }}
      className="space-y-3"
    >
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-border/70 bg-muted/25 px-3 py-1 text-sm text-foreground"
          >
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export function SkillsSlide({ data }: SkillsSlideProps) {
  const { fullMotion } = useAnimationProfile()

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Skills & tools"
        heading="From Figma to React"
        description="I design and build product UI — design systems, prototypes, and production code."
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <SkillGroup
          title="Design"
          items={data.design}
          delay={0.08}
          fullMotion={fullMotion}
        />
        <SkillGroup
          title="Engineering"
          items={data.engineering}
          delay={0.14}
          fullMotion={fullMotion}
        />
        <SkillGroup
          title="Domains"
          items={data.domains}
          delay={0.2}
          fullMotion={fullMotion}
        />
        <SkillGroup
          title="Tools"
          items={data.tools}
          delay={0.26}
          fullMotion={fullMotion}
        />
      </div>
    </div>
  )
}
