import { Link, createFileRoute } from "@tanstack/react-router"

import { ContactSection } from "@/components/landing/contact-section"
import { HeroSection } from "@/components/landing/hero-section"
import { SiteHeader } from "@/components/landing/site-header"
import { SkillsSection } from "@/components/landing/skills-section"
import { WorkSection } from "@/components/landing/work-section"
import { Separator } from "@/components/ui/separator"
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
        <SkillsSection />
        <ContactSection />
      </main>
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:px-6">
          <Separator className="max-w-xs" />
          <nav className="flex gap-4 text-sm">
            <Link
              to="/projects"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Projects
            </Link>
            <Link
              to="/design-system"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Design System
            </Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Akshay Saini — Design Engineer
          </p>
        </div>
      </footer>
    </div>
  )
}
