"use client"

import * as React from "react"
import { ClipboardList, Sparkles, Star } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { nanoid } from "nanoid"
import { motion, useReducedMotion } from "motion/react"

import type { HeroPromptSuggestion } from "@/lib/hero-prompt-suggestions"
import { CompanyLogoBar } from "@/components/landing/company-logo-bar"
import { HeroShapeWavesBackground } from "@/components/landing/hero-shape-waves-background"
import { LandingHeroRotatingCopy } from "@/components/landing/landing-hero-rotating-copy"
import { ChatPromptInput } from "@/components/ui/chat-prompt-input"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { LANDING_HERO_COPY } from "@/lib/hero-headlines"
import {
  DEFAULT_HERO_PROMPT_SUGGESTIONS,
  HERO_PLACEHOLDER_PROMPTS,
  HERO_PROMPT_SUGGESTION_POOL,
  getRandomHeroPromptSuggestions,
} from "@/lib/hero-prompt-suggestions"
import { EASE_OUT_SMOOTH, chipHoverTransition } from "@/lib/motion-easing"
import { cn } from "@/lib/utils"

function useHeroPromptSubmit() {
  const navigate = useNavigate()

  return React.useCallback(
    (text: string, mode: "gen-ui" | "chat") => {
      const trimmed = text.trim()
      if (!trimmed) return

      const threadId = nanoid(10)
      const initialThread = {
        id: threadId,
        createdAt: new Date().toISOString(),
        messages: [{ id: nanoid(), role: "user" as const, content: trimmed, mode }],
      }

      try {
        localStorage.setItem(`portfolio_thread_${threadId}`, JSON.stringify(initialThread))
      } catch {
        // Chat route also reads navigation state as a fallback.
      }

      navigate({
        to: "/chat/$threadId",
        params: { threadId },
        state: (previous) => ({ ...previous, initialPrompt: trimmed, mode }),
      })
    },
    [navigate],
  )
}

const HERO_SUGGESTION_DISPLAY_COUNT = 2
const HERO_SUGGESTION_ROTATE_MS = 6000

function useHeroPromptState() {
  const [prompt, setPrompt] = React.useState("")
  const [mode, setMode] = React.useState<"gen-ui" | "chat">("chat")
  const [suggestions, setSuggestions] = React.useState<ReadonlyArray<HeroPromptSuggestion>>(
    HERO_PROMPT_SUGGESTION_POOL.slice(0, HERO_SUGGESTION_DISPLAY_COUNT),
  )

  React.useEffect(() => {
    const rotate = () => {
      if (document.hidden) return
      setSuggestions(getRandomHeroPromptSuggestions(HERO_SUGGESTION_DISPLAY_COUNT))
    }

    const id = window.setInterval(rotate, HERO_SUGGESTION_ROTATE_MS)
    return () => window.clearInterval(id)
  }, [])

  return { prompt, setPrompt, mode, setMode, suggestions }
}

/** Plain-text suggestion triggers — chat-only, with a ↪ submit affordance. */
function SuggestionTextLinks({
  suggestions,
  onSelect,
  mode,
}: {
  suggestions: ReadonlyArray<HeroPromptSuggestion>
  onSelect: (query: string, mode: "gen-ui" | "chat") => void
  mode: "gen-ui" | "chat"
}) {
  return (
    <div className="-mx-1 flex w-[calc(100%+0.5rem)] flex-nowrap items-center justify-start gap-x-5 px-1 text-left">
      {suggestions.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() => onSelect(item.query, mode)}
          className={cn(
            "group inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-sm text-muted-foreground",
            "transition-colors hover:text-foreground",
            chipHoverTransition,
          )}
        >
          <span
            aria-hidden
            className="text-xs opacity-45 transition group-hover:-translate-x-0.5 group-hover:opacity-100"
          >
            ↪
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  )
}

/** Main homepage hero — compact centered, ShapeWaves bg, chat-only minimal pill + border beam. */
export function HeroMinimalCenter() {
  const { canAnimate, fullMotion } = useAnimationProfile()
  const shouldReduceMotion = useReducedMotion()
  const submit = useHeroPromptSubmit()
  const { prompt, setPrompt, mode, suggestions } = useHeroPromptState()

  const animate = canAnimate && fullMotion && !shouldReduceMotion

  return (
    <section className="relative isolate flex min-h-[85svh] items-center overflow-hidden border-b border-border/80">
      <HeroShapeWavesBackground />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-28 bg-gradient-to-b from-transparent to-background"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-24">
        <motion.div
          initial={animate ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT_SMOOTH }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/35 bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary backdrop-blur-sm">
            <Sparkles className="size-3" />
            Ask the portfolio
          </span>
        </motion.div>

        <motion.h1
          initial={animate ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: EASE_OUT_SMOOTH }}
          className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground font-heading sm:text-5xl lg:text-6xl"
        >
          Hire a design engineer who ships.
        </motion.h1>

        <motion.p
          initial={animate ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12, ease: EASE_OUT_SMOOTH }}
          className="max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Six years designing and shipping 0→1 products solo at YC-backed startups, using AI to move fast.
        </motion.p>

        <motion.div
          initial={animate ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18, ease: EASE_OUT_SMOOTH }}
          className="w-full space-y-5 pt-2"
        >
          <div className="mx-auto w-full max-w-lg space-y-4">
            <ChatPromptInput
              value={prompt}
              onValueChange={setPrompt}
              onSubmit={submit}
              mode={mode}
              placeholder="Ask anything about the work..."
              tone="on-media"
              variant="minimal"
              showModeToggle={false}
              showBorderBeam
              className="max-w-none"
            />

            <SuggestionTextLinks suggestions={suggestions} onSelect={submit} mode={mode} />
          </div>
        </motion.div>

        <motion.div
          initial={animate ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.26, ease: EASE_OUT_SMOOTH }}
          className="w-full max-w-2xl border-t border-border/50 pt-8"
        >
          <CompanyLogoBar className="[&>p]:text-center [&>ul]:justify-center" />
        </motion.div>
      </div>
    </section>
  )
}

/** Previous homepage hero — rotating headline copy with an expanded, mode-aware prompt. */
export function HeroRotatingCopy() {
  const submit = useHeroPromptSubmit()
  const [prompt, setPrompt] = React.useState("")
  const [mode, setMode] = React.useState<"gen-ui" | "chat">("chat")
  const [suggestions, setSuggestions] = React.useState<ReadonlyArray<HeroPromptSuggestion>>(
    DEFAULT_HERO_PROMPT_SUGGESTIONS,
  )

  React.useEffect(() => {
    setSuggestions(getRandomHeroPromptSuggestions())
  }, [])

  return (
    <section className="relative flex min-h-[90svh] w-full flex-col items-center justify-center overflow-hidden py-16">
      <HeroShapeWavesBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center space-y-8 px-4 text-center sm:px-6">
        <LandingHeroRotatingCopy slides={LANDING_HERO_COPY} intervalMs={7500} />

        <div className="relative z-20 w-full space-y-4 pt-4">
          <ChatPromptInput
            value={prompt}
            onValueChange={setPrompt}
            onSubmit={submit}
            mode={mode}
            onModeChange={setMode}
            placeholders={HERO_PLACEHOLDER_PROMPTS}
            tone="on-media"
            variant="expanded"
          />
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1.5">
            {suggestions.map((item, idx) => {
              const IconComponent = idx % 3 === 0 ? Sparkles : idx % 3 === 1 ? Star : ClipboardList

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => submit(item.query, mode)}
                  className={cn(
                    "rounded-full border px-4 py-2 flex items-center gap-2 cursor-pointer text-xs",
                    "border-border/80 bg-background text-foreground shadow-sm ring-1 ring-black/[0.06]",
                    "hover:-translate-y-px hover:border-primary/30 hover:bg-background hover:text-foreground hover:shadow-md",
                    "dark:border-border dark:bg-card/75 dark:text-foreground dark:ring-0",
                    "dark:hover:bg-card/90 dark:hover:text-foreground dark:shadow-sm",
                    chipHoverTransition,
                  )}
                >
                  <IconComponent className="size-3.5" />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
