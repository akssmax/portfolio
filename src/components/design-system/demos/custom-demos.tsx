"use client"

import { useState } from "react"
import { FeatureCard } from "@/components/marketing/feature-card"
import { FeatureCardGrid } from "@/components/marketing/feature-card-grid"
import { FeatureCardVisual } from "@/components/marketing/feature-card-visual"
import { ProjectsShowcase } from "@/components/marketing/projects-showcase"
import { CtaSection, type CtaSectionVariant, type CtaSectionPosition } from "@/components/landing/contact-section"
import { HeroSection } from "@/components/landing/hero-section"
import { SiteHeader } from "@/components/landing/site-header"
import { SkillsSection } from "@/components/landing/skills-section"
import { WorkSection } from "@/components/landing/work-section"
import { ModeToggle } from "@/components/mode-toggle"
import { ThemeCustomizer } from "@/components/theme-customizer"
import { getFallbackHomeWorkSections } from "@/lib/sanity/fallback-projects"

export function ModeToggleDemo() {
  return <ModeToggle />
}

export function ThemeCustomizerDemo() {
  return <ThemeCustomizer />
}

export function SiteHeaderDemo() {
  return (
    <div className="relative w-full rounded-lg border border-border bg-background p-4">
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
  const { recentProjects, caseStudies } = getFallbackHomeWorkSections()

  return (
    <div className="w-full overflow-hidden rounded-lg border border-border">
      <WorkSection recentProjects={recentProjects} caseStudies={caseStudies} />
    </div>
  )
}

export function FeatureCardDemo() {
  const { recentProjects } = getFallbackHomeWorkSections()
  const project = recentProjects[0]

  if (!project) return null

  return (
    <div className="w-full max-w-xl rounded-lg border border-border bg-background p-4">
      <FeatureCard
        title={project.title}
        description={project.description}
        slug={project.slug}
        tag={project.tag}
        buildBadge={project.buildBadge}
        metrics={project.metrics}
        featured={project.featured}
        visual={<FeatureCardVisual project={project} />}
      />
    </div>
  )
}

export function FeatureCardGridDemo() {
  const { recentProjects } = getFallbackHomeWorkSections()

  return (
    <div className="w-full rounded-lg border border-border bg-background p-4">
      <FeatureCardGrid projects={recentProjects.slice(0, 3)} />
    </div>
  )
}

export function ProjectsShowcaseDemo() {
  const { recentProjects, caseStudies } = getFallbackHomeWorkSections()

  return (
    <div className="w-full overflow-hidden rounded-lg border border-border">
      <ProjectsShowcase recentProjects={recentProjects} caseStudies={caseStudies} />
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
  const [variant, setVariant] = useState<CtaSectionVariant>("dub-notch")
  const [topCutout, setTopCutout] = useState(true)
  const [bottomCutout, setBottomCutout] = useState(true)
  const [topPosition, setTopPosition] = useState<CtaSectionPosition>("center")
  const [bottomPosition, setBottomPosition] = useState<CtaSectionPosition>("right")
  const [m3Size, setM3Size] = useState(72)
  const [dubWidth, setDubWidth] = useState(320)

  return (
    <div className="flex flex-col w-full overflow-hidden rounded-lg border border-border bg-card [--cta-cutout-bg:var(--card)]">
      {/* Selector controls for variant, top/bottom toggles, and positions */}
      <div className="flex flex-col gap-3 border-b border-border p-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-muted-foreground w-36">CTA Cutout Variant:</span>
          {(["dub-notch", "m3-arch", "m3-flower", "m3-cookie", "m3-heart", "m3-pill", "m3-hexagon", "m3-puffy", "minimal"] as CtaSectionVariant[]).map((v) => (
            <button
              key={v}
              onClick={() => setVariant(v)}
              className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                variant === v
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {variant !== "minimal" && (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-muted-foreground w-36">Active Cutouts:</span>
              <button
                onClick={() => setTopCutout(!topCutout)}
                className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                  topCutout
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Top Cutout: {topCutout ? "ON" : "OFF"}
              </button>
              <button
                onClick={() => setBottomCutout(!bottomCutout)}
                className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                  bottomCutout
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Bottom Cutout: {bottomCutout ? "ON" : "OFF"}
              </button>
            </div>

            {topCutout && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-muted-foreground w-36">Top Cutout Position:</span>
                {(["left", "center", "right"] as CtaSectionPosition[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setTopPosition(p)}
                    className={`rounded-md px-2.5 py-1 font-medium transition-all capitalize ${
                      topPosition === p
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {bottomCutout && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-muted-foreground w-36">Bottom Cutout Position:</span>
                {(["left", "center", "right"] as CtaSectionPosition[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setBottomPosition(p)}
                    className={`rounded-md px-2.5 py-1 font-medium transition-all capitalize ${
                      bottomPosition === p
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {variant === "dub-notch" && (topCutout || bottomCutout) && (
              <div className="flex items-center gap-4 mt-1">
                <span className="font-semibold text-muted-foreground w-36">Dub Notch Width:</span>
                <input
                  type="range"
                  min="120"
                  max="600"
                  value={dubWidth}
                  onChange={(e) => setDubWidth(Number(e.target.value))}
                  className="w-48 accent-primary cursor-pointer"
                />
                <span className="font-mono text-muted-foreground">{dubWidth}px</span>
              </div>
            )}

            {variant.startsWith("m3-") && (topCutout || bottomCutout) && (
              <div className="flex items-center gap-4 mt-1">
                <span className="font-semibold text-muted-foreground w-36">M3 Shape Size:</span>
                <input
                  type="range"
                  min="40"
                  max="200"
                  value={m3Size}
                  onChange={(e) => setM3Size(Number(e.target.value))}
                  className="w-48 accent-primary cursor-pointer"
                />
                <span className="font-mono text-muted-foreground">{m3Size}px</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="w-full overflow-hidden">
        <CtaSection
          variant={variant}
          topCutout={topCutout}
          bottomCutout={bottomCutout}
          topCutoutPosition={topPosition}
          bottomCutoutPosition={bottomPosition}
          m3Size={m3Size}
          dubWidth={dubWidth}
        />
      </div>
    </div>
  )
}
