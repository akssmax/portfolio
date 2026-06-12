import { Link, createFileRoute } from "@tanstack/react-router"
import { motion, useReducedMotion } from "motion/react"

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
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main>
        <AboutHero />
        <ExperienceTimeline />
        <EducationSection />
        <SkillsToolsSection />
        <InterestsSection />
        <motion.div
          className="border-t border-border py-8"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Link
              to="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Back to home
            </Link>
          </div>
        </motion.div>
      </main>
      <SiteFooter />
    </div>
  )
}
