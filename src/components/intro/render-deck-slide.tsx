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
import type { DeckData, DeckSlideId } from "@/lib/intro/types"

type RenderDeckSlideOptions = {
  onEndPresentation?: () => void
}

export function renderDeckSlide(
  slideId: DeckSlideId,
  deck: DeckData,
  options?: RenderDeckSlideOptions,
) {
  switch (slideId) {
    case "about-me":
      return <AboutMeSlide data={deck.aboutMe} />
    case "experience":
      return <ExperienceSlide data={deck.experience} />
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
          onEndPresentation={options?.onEndPresentation}
        />
      )
    case "thank-you":
      return <ThankYouSlide data={deck.thankYou} />
    default:
      return null
  }
}
