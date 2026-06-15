import { createFileRoute } from "@tanstack/react-router"

import { AboutConnectSection } from "@/components/about/about-connect-section"
import { AboutHero } from "@/components/about/about-hero"
import { EducationSection } from "@/components/about/education-section"
import { ExperienceTimeline } from "@/components/about/experience-timeline"
import { InterestsSection } from "@/components/about/interests-section"
import { SkillsToolsSection } from "@/components/about/skills-tools-section"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Akshay Saini" },
      {
        name: "description",
        content:
          "Product designer and design engineer with nearly 8 years of experience across fintech, devtools, and agentic AI.",
      },
    ],
  }),
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main>
        <AboutHero />
        <ExperienceTimeline />
        <EducationSection />
        <SkillsToolsSection />
        <InterestsSection />
        <AboutConnectSection />
      </main>
      <SiteFooter />
    </div>
  )
}
