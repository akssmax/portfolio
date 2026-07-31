"use client"

import * as React from "react"
import { Link } from "@tanstack/react-router"
import { AnimatePresence } from "motion/react"
import { Expand, Minimize2, X } from "lucide-react"

import { DeckNavHint } from "@/components/intro/deck-nav-hint"
import { DeckProgress } from "@/components/intro/deck-progress"
import { DeckSlide } from "@/components/intro/deck-slide"
import { AboutMeSlide } from "@/components/intro/slides/about-me-slide"
import { ArchitectureSlide } from "@/components/intro/slides/architecture-slide"
import { AssumptionsSlide } from "@/components/intro/slides/assumptions-slide"
import { ExperienceSlide } from "@/components/intro/slides/experience-slide"
import { GapsSlide } from "@/components/intro/slides/gaps-slide"
import { IntentDetectionSlide } from "@/components/intro/slides/intent-detection-slide"
import { LearningsSlide } from "@/components/intro/slides/learnings-slide"
import { LiveDemoSlide } from "@/components/intro/slides/live-demo-slide"
import { ProblemSlide } from "@/components/intro/slides/problem-slide"
import { ProjectIntroSlide } from "@/components/intro/slides/project-intro-slide"
import { RoadmapSlide } from "@/components/intro/slides/roadmap-slide"
import { ThankYouSlide } from "@/components/intro/slides/thank-you-slide"
// import { SkillsSlide } from "@/components/intro/slides/skills-slide"
import { Button } from "@/components/ui/button"
import { ThemeCustomizer } from "@/components/theme-customizer"
import { useDeckNavigation } from "@/hooks/use-deck-navigation"
import { DECK_SLIDE_IDS } from "@/lib/intro/types"
import type { DeckData } from "@/lib/intro/types"

type DeckShellProps = {
  deck: DeckData
  initialIndex?: number
  onSlideChange?: (index: number) => void
}

export function DeckShell({ deck, initialIndex = 0, onSlideChange }: DeckShellProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const totalSlides = DECK_SLIDE_IDS.length

  const navigation = useDeckNavigation({
    totalSlides,
    initialIndex,
    onIndexChange: onSlideChange,
  })

  const { index, goTo, handlePointerDown, handlePointerUp } = navigation
  const activeSlideId = DECK_SLIDE_IDS[index]

  React.useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        return
      }

      await document.documentElement.requestFullscreen()
    } catch {
      // Fullscreen may be blocked by browser policy.
    }
  }

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "f") return
      if (event.metaKey || event.ctrlKey || event.altKey) return

      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA")
      ) {
        return
      }

      event.preventDefault()
      void toggleFullscreen()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  function renderSlide(slideId: (typeof DECK_SLIDE_IDS)[number]) {
    switch (slideId) {
      case "about-me":
        return <AboutMeSlide data={deck.aboutMe} />
      case "experience":
        return <ExperienceSlide data={deck.experience} />
      // case "skills":
      //   return <SkillsSlide data={deck.skills} />
      case "project-intro":
        return <ProjectIntroSlide data={deck.projectIntro} />
      case "problem":
        return <ProblemSlide data={deck.problem} />
      case "assumptions":
        return <AssumptionsSlide data={deck.assumptions} />
      case "architecture":
        return <ArchitectureSlide data={deck.architecture} />
      case "intent-detection":
        return <IntentDetectionSlide data={deck.intentDetection} />
      case "live-demo":
        return <LiveDemoSlide data={deck.liveDemo} />
      case "learnings":
        return <LearningsSlide data={deck.learnings} />
      case "gaps":
        return <GapsSlide data={deck.gaps} />
      case "roadmap":
        return (
          <RoadmapSlide
            data={deck.roadmap}
            onEndPresentation={() => goTo(DECK_SLIDE_IDS.indexOf("thank-you"))}
          />
        )
      case "thank-you":
        return <ThankYouSlide data={deck.thankYou} />
      default:
        return null
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-background text-foreground"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <DeckProgress index={index} total={totalSlides} onSelect={goTo} />

      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
          {index + 1} / {totalSlides}
        </span>

        <ThemeCustomizer triggerSize="icon-sm" />

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          onClick={() => void toggleFullscreen()}
        >
          {isFullscreen ? (
            <Minimize2 className="size-4" aria-hidden />
          ) : (
            <Expand className="size-4" aria-hidden />
          )}
        </Button>

        <Button asChild variant="outline" size="icon-sm" aria-label="Exit presentation">
          <Link to="/">
            <X className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>

      <div className="h-dvh overflow-hidden">
        <AnimatePresence mode="wait">
          <DeckSlide key={activeSlideId} slideKey={activeSlideId}>
            {renderSlide(activeSlideId)}
          </DeckSlide>
        </AnimatePresence>
      </div>

      <DeckNavHint visible={index === 0} />
    </div>
  )
}
