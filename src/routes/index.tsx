import { createFileRoute } from "@tanstack/react-router"

import { ErrorBoundary } from "@/components/error-boundary"
import { RouteError } from "@/components/route-error"
import { ContactSection } from "@/components/landing/contact-section"
import { ExperienceSection } from "@/components/landing/experience-section"
import { HeroSection } from "@/components/landing/hero-section"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"
import { SkillsSection } from "@/components/landing/skills-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { WorkSection } from "@/components/landing/work-section"
import { getHomeWorkSections } from "@/lib/sanity/projects"

export const Route = createFileRoute("/")({
  loader: () => getHomeWorkSections(),
  errorComponent: RouteError,
  component: HomePage,
})

function HomePage() {
  const { recentProjects, caseStudies } = Route.useLoaderData()

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main>
        <ErrorBoundary title="Hero section failed" showHeader={false}>
          <HeroSection />
        </ErrorBoundary>
        <ErrorBoundary title="Work section failed" showHeader={false}>
          <WorkSection recentProjects={recentProjects} caseStudies={caseStudies} />
        </ErrorBoundary>
        <ErrorBoundary title="Experience section failed" showHeader={false}>
          <ExperienceSection />
        </ErrorBoundary>
        <ErrorBoundary title="Testimonials section failed" showHeader={false}>
          <TestimonialsSection />
        </ErrorBoundary>
        <ErrorBoundary title="Skills section failed" showHeader={false}>
          <SkillsSection />
        </ErrorBoundary>
        <ErrorBoundary title="Contact section failed" showHeader={false}>
          <ContactSection />
        </ErrorBoundary>
      </main>
      <SiteFooter />
    </div>
  )
}
