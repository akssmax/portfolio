"use client"

import { motion } from "motion/react"
import { ArrowRight, Brain, ChevronRight, GitBranch, Sparkles } from "lucide-react"

import { SectionIntro } from "@/components/marketing/section-intro"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"
import type { DeckData } from "@/lib/intro/types"
import { cn } from "@/lib/utils"

type IntentDetectionSlideProps = {
  data: DeckData["intentDetection"]
}

const STAGE_ACCENTS = [
  "border-border/70 bg-muted/15",
  "border-border/70 bg-muted/15",
  "border-primary/25 bg-primary/5",
  "border-border/70 bg-muted/15",
] as const

function PipelineArrow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center text-primary/50",
        className,
      )}
      aria-hidden
    >
      <ChevronRight className="hidden size-5 lg:block" />
      <ArrowRight className="size-4 rotate-90 lg:hidden" />
    </div>
  )
}

function IntentPipelineDiagram({
  stages,
  fullMotion,
}: {
  stages: DeckData["intentDetection"]["stages"]
  fullMotion: boolean
}) {
  return (
    <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-stretch lg:gap-0">
      {stages.map((stage, index) => (
        <div key={stage.label} className="contents">
          <motion.div
            initial={fullMotion ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: EASE_OUT_SMOOTH,
              delay: 0.1 + index * 0.08,
            }}
            className={cn(
              "flex min-w-0 flex-1 flex-col rounded-xl border p-4 sm:p-4",
              STAGE_ACCENTS[index % STAGE_ACCENTS.length],
            )}
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                  {stage.label}
                </p>
                {stage.subtitle ? (
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{stage.subtitle}</p>
                ) : null}
              </div>
              {stage.badge ? (
                <span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  {stage.badge}
                </span>
              ) : null}
            </div>
            <ul className="mt-auto space-y-1.5">
              {stage.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-xs leading-snug text-muted-foreground sm:text-[13px]"
                >
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/50" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {index < stages.length - 1 ? (
            <PipelineArrow className="py-1 lg:px-1.5 lg:py-0" />
          ) : null}
        </div>
      ))}
    </div>
  )
}

export function IntentDetectionSlide({ data }: IntentDetectionSlideProps) {
  const { fullMotion } = useAnimationProfile()

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Intent detection"
        eyebrowIcon={Brain}
        heading={data.heading}
        description={data.description}
      />

      <motion.div
        initial={fullMotion ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT_SMOOTH, delay: 0.08 }}
        className="rounded-xl border border-border/70 bg-muted/10 p-4 sm:p-5"
      >
        <div className="mb-4 flex items-center gap-2">
          <GitBranch className="size-4 text-primary" aria-hidden />
          <p className="text-xs font-semibold tracking-wider text-primary uppercase">
            High-level flow
          </p>
        </div>

        <IntentPipelineDiagram stages={data.stages} fullMotion={fullMotion} />

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 border-t border-border/60 pt-4">
          {data.flowNotes.map((note) => (
            <span
              key={note}
              className="rounded-full border border-border/70 bg-background/60 px-2.5 py-1 font-mono text-[10px] text-muted-foreground sm:text-[11px]"
            >
              {note}
            </span>
          ))}
        </div>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={fullMotion ? { opacity: 0, y: 14 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT_SMOOTH, delay: 0.16 }}
          className="rounded-xl border border-border/70 bg-muted/15 p-4 sm:p-5"
        >
          <p className="mb-3 text-xs font-semibold tracking-wider text-primary uppercase">
            Stage 1 — what gets detected
          </p>
          <p className="mb-4 text-sm text-muted-foreground">
            Brief → <span className="font-medium text-foreground">CampaignPlan</span> — marketing
            strategy only, no layout IDs or pixel geometry.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {data.detectedDimensions.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border/60 bg-background/40 px-3 py-2"
              >
                <p className="text-xs font-medium text-foreground">{item.label}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={fullMotion ? { opacity: 0, y: 14 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT_SMOOTH, delay: 0.22 }}
          className="flex flex-col gap-4"
        >
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="size-4 text-primary" aria-hidden />
              <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                Design choice
              </p>
            </div>
            <p className="text-sm leading-relaxed text-foreground">{data.designChoice}</p>
          </div>

          <div className="rounded-xl border border-border/70 bg-muted/15 p-4">
            <p className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Online vs offline
            </p>
            <ul className="space-y-2">
              {data.modes.map((mode) => (
                <li key={mode.label} className="text-sm">
                  <span className="font-medium text-foreground">{mode.label}</span>
                  <span className="text-muted-foreground"> — {mode.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
