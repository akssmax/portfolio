import { createFileRoute } from "@tanstack/react-router"

import { AboutSection } from "@/components/landing/about-section"
import { ContactSection } from "@/components/landing/contact-section"
import { ExperienceSection } from "@/components/landing/experience-section"
import { HeroSection } from "@/components/landing/hero-section"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"
import { SkillsSection } from "@/components/landing/skills-section"
import { WorkSection } from "@/components/landing/work-section"
import { getFeaturedProjects } from "@/lib/sanity/projects"

export const Route = createFileRoute("/")({
  loader: () => getFeaturedProjects(),
  component: HomePage,
})

function HomePage() {
  const featuredProjects = Route.useLoaderData()

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main>
        <HeroSection />
        <WorkSection projects={featuredProjects} />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  )
}
