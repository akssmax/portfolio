import { createFileRoute } from "@tanstack/react-router"

import { AboutConnectSection } from "@/components/about/about-connect-section"
import { AboutHero } from "@/components/about/about-hero"
import { EducationSection } from "@/components/about/education-section"
import { ExperienceTimeline } from "@/components/about/experience-timeline"
import { InterestsSection } from "@/components/about/interests-section"
import { GithubActivitySection } from "@/components/about/github-activity-section"
import { SkillsToolsSection } from "@/components/about/skills-tools-section"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"
import { getDesignCareerSpanLabel } from "@/lib/experience-duration"
import { profile } from "@/lib/profile"
import { siteUrl } from "@/lib/site-url"

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      {
        title: "About Akshay Saini — Product Designer & Design Engineer in Bangalore, India",
      },
      {
        name: "description",
        content: `Learn more about Akshay Saini, a Product Designer and Design Engineer based in Bangalore (Bengaluru), India, with ${getDesignCareerSpanLabel(profile.experience.map((item) => item.period)).toLowerCase()} in design across fintech, devtools, and agentic AI.`,
      },
      {
        name: "keywords",
        content: "about akshay saini, product designer in bangalore, design engineer in bangalore, designer in bangalore, product designer in india, design engineer in india, ux designer bangalore, design system engineer, design developer",
      },
      {
        property: "og:title",
        content: "About Akshay Saini — Product Designer & Design Engineer in Bangalore, India",
      },
      {
        property: "og:description",
        content: `Learn more about Akshay Saini, a Product Designer and Design Engineer based in Bangalore (Bengaluru), India, with ${getDesignCareerSpanLabel(profile.experience.map((item) => item.period)).toLowerCase()} in design.`,
      },
      {
        property: "og:type",
        content: "profile",
      },
      {
        property: "og:url",
        content: siteUrl("/about"),
      },
      {
        property: "og:image",
        content: siteUrl("/images/hero-portrait.png"),
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "About Akshay Saini — Product Designer & Design Engineer in Bangalore, India",
      },
      {
        name: "twitter:description",
        content: `Learn more about Akshay Saini, a Product Designer and Design Engineer based in Bangalore (Bengaluru), India.`,
      },
      {
        name: "twitter:image",
        content: siteUrl("/images/hero-portrait.png"),
      },
    ],
    links: [
      {
        rel: "canonical",
        href: siteUrl("/about"),
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
        <GithubActivitySection />
        <InterestsSection />
        <AboutConnectSection />
      </main>
      <SiteFooter hasTopBorder={false} />
    </div>
  )
}
