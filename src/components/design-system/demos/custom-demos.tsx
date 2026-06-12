"use client"

import { ContactSection } from "@/components/landing/contact-section"
import { HeroSection } from "@/components/landing/hero-section"
import { SiteHeader } from "@/components/landing/site-header"
import { SkillsSection } from "@/components/landing/skills-section"
import { WorkSection } from "@/components/landing/work-section"
import { ModeToggle } from "@/components/mode-toggle"
import { getFallbackFeaturedProjects } from "@/lib/sanity/fallback-projects"

export function ModeToggleDemo() {
  return <ModeToggle />
}

export function SiteHeaderDemo() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border">
      <SiteHeader />
    </div>
  )
}

export function HeroSectionDemo() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border">
      <HeroSection />
    </div>
  )
}

export function WorkSectionDemo() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border">
      <WorkSection projects={getFallbackFeaturedProjects()} />
    </div>
  )
}

export function SkillsSectionDemo() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border">
      <SkillsSection />
    </div>
  )
}

export function ContactSectionDemo() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border">
      <ContactSection />
    </div>
  )
}
