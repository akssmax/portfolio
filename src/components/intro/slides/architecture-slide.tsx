"use client"

import { motion } from "motion/react"
import { Layers } from "lucide-react"

import { SectionIntro } from "@/components/marketing/section-intro"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"
import type { DeckBuildTool, DeckData } from "@/lib/intro/types"
import { cn } from "@/lib/utils"

type ArchitectureSlideProps = {
  data: DeckData["architecture"]
}

function ToolLogo({ logoSrc, name }: { logoSrc?: string | string[]; name: string }) {
  const logos = logoSrc ? (Array.isArray(logoSrc) ? logoSrc : [logoSrc]) : []

  if (logos.length === 0) return null

  return (
    <span className="inline-flex size-8 shrink-0 items-center justify-center gap-0.5 rounded-lg border border-border/50 bg-background/80 p-1">
      {logos.map((src) => (
        <img
          key={src}
          src={src}
          alt=""
          className={cn(
            "object-contain brightness-0 invert opacity-90",
            logos.length > 1 ? "size-3" : "size-4",
          )}
        />
      ))}
      <span className="sr-only">{name}</span>
    </span>
  )
}

function ToolRow({ tool }: { tool: DeckBuildTool }) {
  const label = (
    <>
      <p className="text-sm font-medium text-foreground">{tool.name}</p>
      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{tool.role}</p>
    </>
  )

  return (
    <div className="flex items-start gap-3">
      <ToolLogo logoSrc={tool.logoSrc} name={tool.name} />
      {tool.href ? (
        <a
          href={tool.href}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 transition-colors hover:text-primary"
        >
          {label}
        </a>
      ) : (
        <div className="min-w-0">{label}</div>
      )}
    </div>
  )
}

export function ArchitectureSlide({ data }: ArchitectureSlideProps) {
  const { fullMotion } = useAnimationProfile()

  return (
    <div className="space-y-10">
      <SectionIntro
        eyebrow="Architecture"
        heading={data.heading}
        description={data.summary}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <motion.div
          initial={fullMotion ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT_SMOOTH, delay: 0.1 }}
          className="space-y-4"
        >
          {data.layers.map((layer) => (
            <div
              key={layer.label}
              className="rounded-xl border border-border/70 bg-muted/15 p-4 sm:p-5"
            >
              <div className="mb-3 flex items-center gap-2">
                <Layers className="size-4 text-primary" aria-hidden />
                <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                  {layer.label}
                </p>
              </div>
              <ul
                className={cn(
                  "space-y-2",
                  layer.items.length > 4 && "sm:columns-2 sm:gap-x-6",
                )}
              >
                {layer.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 break-inside-avoid text-sm text-muted-foreground"
                  >
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-primary/60" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="rounded-xl border border-border/70 bg-muted/15 p-4 sm:p-5">
            <p className="mb-3 text-xs font-semibold tracking-wider text-primary uppercase">
              Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {data.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs font-medium text-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={fullMotion ? { opacity: 0, x: 12 } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT_SMOOTH, delay: 0.18 }}
          className="space-y-4"
        >
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="mb-3 text-xs font-semibold tracking-wider text-primary uppercase">
              User flow
            </p>
            <ol className="space-y-3">
              {data.flow.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm text-foreground">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 leading-snug">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl border border-border/70 bg-muted/15 p-4">
            <p className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Tools
            </p>
            <div className="space-y-4">
              {data.tools.map((tool) => (
                <ToolRow key={tool.name} tool={tool} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
