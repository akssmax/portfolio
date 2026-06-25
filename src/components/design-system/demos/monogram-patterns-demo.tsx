"use client"

import * as React from "react"
import type {MonogramPatternTone, MonogramPatternVariant} from "@/components/brand/monogram-patterns";
import {
  MonogramPattern
  
  
} from "@/components/brand/monogram-patterns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const variants: Array<{ id: MonogramPatternVariant; label: string; description: string }> = [
  {
    id: "grid",
    label: "Precision Grid",
    description: "Aligns small monograms in a standard grid layout. Staggers scale and rotation on hover.",
  },
  {
    id: "offset",
    label: "Offset Hex",
    description: "Honeycomb-like alignment where alternate rows offset and rotate in opposite directions.",
  },
  {
    id: "dots",
    label: "Dots & Monograms",
    description: "Combines minimal dots with monograms. Hovering fades the dots and enlarges the monograms.",
  },
  {
    id: "diagonal",
    label: "Diagonal Flow",
    description: "Arranges monograms on a 45-degree angle. Hovering triggers a wave running down-right.",
  },
  {
    id: "concentric",
    label: "Concentric Aperture",
    description: "Circular orbits of monograms rotating at different speeds on hover.",
  },
  {
    id: "circuit",
    label: "Tech Circuit",
    description: "A schematic tech layout connecting monogram nodes. Traces paths on hover.",
  },
  {
    id: "waves",
    label: "Sine Wave Flow",
    description: "Coordinates monograms on alternating sine wave heights. Propagates undulating hover scales.",
  },
  {
    id: "scatter",
    label: "Floating Particles",
    description: "Randomly distributes monograms like floating stardust. Hovering creates floating orbit drifts.",
  },
]

const tones: Array<{ id: MonogramPatternTone; label: string }> = [
  { id: "muted", label: "Muted (Default)" },
  { id: "primary", label: "Primary" },
  { id: "accent", label: "Accent" },
  { id: "foreground", label: "Foreground" },
]

type FadeMode = "center-radial" | "bottom-up" | "top-down" | "vignette"

function VariantCard({
  variant,
  label,
  description,
  tone,
}: {
  variant: MonogramPatternVariant
  label: string
  description: string
  tone: MonogramPatternTone
}) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="border-b border-border bg-muted/20 px-4 py-3">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>

      {/* Interactive area with the pattern */}
      <div className="relative flex h-44 w-full items-center justify-center bg-muted/5 overflow-hidden">
        {/* Subtle grid lines background overlay just for visual contrast */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <MonogramPattern
          variant={variant}
          tone={tone}
          isParentHovered={isHovered}
          className="absolute inset-0 transition-opacity duration-300"
        />

        {/* Center overlay badge on rest, fading on hover */}
        <div className="pointer-events-none z-20 rounded-md border border-border bg-background/80 px-2 py-1 text-[10px] font-medium tracking-wide uppercase text-muted-foreground backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-0">
          Hover to Preview
        </div>
      </div>

      <div className="border-t border-border px-4 py-2 text-center text-[10px] text-muted-foreground bg-muted/10 font-mono">
        variant=&quot;{variant}&quot;
      </div>
    </div>
  )
}

export function MonogramPatternsDemo() {
  const [selectedTone, setSelectedTone] = React.useState<MonogramPatternTone>("primary")
  const [largePattern, setLargePattern] = React.useState<MonogramPatternVariant>("scatter")
  const [largeTone, setLargeTone] = React.useState<MonogramPatternTone>("primary")
  const [fadeMode, setFadeMode] = React.useState<FadeMode>("center-radial")
  const [largeSectionHover, setLargeSectionHover] = React.useState(false)

  // CSS mask classes based on the fade mode selected
  const maskClasses: Record<FadeMode, string> = {
    "center-radial": "[mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_90%)]",
    "bottom-up": "[mask-image:linear-gradient(to_top,black_20%,transparent_100%)]",
    "top-down": "[mask-image:linear-gradient(to_bottom,black_20%,transparent_100%)]",
    vignette: "[mask-image:radial-gradient(circle_at_center,black_70%,transparent_100%)]",
  }

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-medium">Interactive Pattern Styles</h3>
            <p className="text-sm text-muted-foreground">
              Subtle vector background patterns created with the monogram. Hover to preview the animations.
            </p>
          </div>

          {/* Tone Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Tone:</span>
            <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted/40">
              {tones.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTone(t.id)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                    selectedTone === t.id
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {variants.map((v) => (
            <VariantCard
              key={v.id}
              variant={v.id}
              label={v.label}
              description={v.description}
              tone={selectedTone}
            />
          ))}
        </div>
      </section>

      {/* Larger Viewport Preview Section */}
      <section className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Full-Width Section Backdrop Preview</h3>
          <p className="text-sm text-muted-foreground">
            Visualize how patterns appear as full section background elements under headings and text, masked with custom gradient fades.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-muted/20 px-4 py-3 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              {/* Pattern selector */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-muted-foreground">Pattern:</span>
                <select
                  value={largePattern}
                  onChange={(e) => setLargePattern(e.target.value as MonogramPatternVariant)}
                  className="rounded-md border border-border bg-background px-2.5 py-1 font-medium text-foreground outline-none"
                >
                  {variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tone selector */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-muted-foreground">Tone:</span>
                <select
                  value={largeTone}
                  onChange={(e) => setLargeTone(e.target.value as MonogramPatternTone)}
                  className="rounded-md border border-border bg-background px-2.5 py-1 font-medium text-foreground outline-none"
                >
                  {tones.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fade mode selector */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-muted-foreground">Gradient Mask:</span>
                <select
                  value={fadeMode}
                  onChange={(e) => setFadeMode(e.target.value as FadeMode)}
                  className="rounded-md border border-border bg-background px-2.5 py-1 font-medium text-foreground outline-none"
                >
                  <option value="center-radial">Radial Center Fade</option>
                  <option value="bottom-up">Bottom-to-Top Fade</option>
                  <option value="top-down">Top-to-Bottom Fade</option>
                  <option value="vignette">Edges Vignette</option>
                </select>
              </div>
            </div>

            <span className="hidden text-[10px] text-muted-foreground font-mono sm:inline">
              Large Viewport Mode
            </span>
          </div>

          {/* Simulated Section */}
          <div
            className="group relative flex min-h-[360px] w-full flex-col items-center justify-center bg-zinc-950 p-8 text-center transition-all duration-300 dark:bg-black"
            onMouseEnter={() => setLargeSectionHover(true)}
            onMouseLeave={() => setLargeSectionHover(false)}
          >
            {/* Background Pattern */}
            <MonogramPattern
              variant={largePattern}
              tone={largeTone}
              isParentHovered={largeSectionHover}
              className={`absolute inset-0 opacity-75 group-hover:opacity-95 transition-opacity duration-500 ${maskClasses[fadeMode]}`}
            />

            {/* Simulated Section Content */}
            <div className="relative z-10 max-w-2xl space-y-6">
              <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                Backdrop Simulation
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                Premium Design Meets Dynamic Engineering
              </h2>
              <p className="text-base text-zinc-400 sm:text-lg">
                Hover anywhere on this section block to watch the custom pattern animate in the background. The gradient mask controls soft edges to maintain readability.
              </p>
              <div className="flex justify-center gap-4 pt-2">
                <button className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]">
                  Primary Action
                </button>
                <button className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-5 py-2.5 text-sm font-semibold text-zinc-200 backdrop-blur-xs transition-colors hover:bg-zinc-800">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Usage & Props</h3>
          <p className="text-sm text-muted-foreground">
            How to configure and embed the pattern backgrounds in cards or section wrappers.
          </p>
        </div>

        <Tabs defaultValue="usage" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="usage">Code Examples</TabsTrigger>
            <TabsTrigger value="props">API Reference</TabsTrigger>
          </TabsList>
          
          <TabsContent value="usage" className="mt-4 space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Section Background with Gradient Mask
              </p>
              <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs text-foreground">
{`import { MonogramPattern } from "@/components/brand/monogram-patterns"

export function FeatureSection() {
  return (
    <section className="relative overflow-hidden bg-black py-24 text-center">
      {/* Absolute pattern with Tailwind mask utility */}
      <MonogramPattern 
        variant="scatter" 
        tone="primary" 
        className="opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_90%)]"
      />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <h2>Interactive Backdrop Section</h2>
        <p>Patterns automatically scale and animate on hover.</p>
      </div>
    </section>
  )
}`}
              </pre>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Parent-Triggered Hover Sync (Propagating to Children)
              </p>
              <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs text-foreground">
{`import * as React from "react"
import { MonogramPattern } from "@/components/brand/monogram-patterns"

export function InteractiveProjectCard() {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div 
      className="relative overflow-hidden rounded-xl border p-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <MonogramPattern 
        variant="waves" 
        tone="primary" 
        isParentHovered={isHovered} 
      />
      
      <div className="relative z-10">
        <h3>Hover Synchronized Card</h3>
      </div>
    </div>
  )
}`}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="props" className="mt-4">
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-border bg-muted/40">
                  <tr>
                    <th className="px-4 py-3 font-medium">Prop</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Default</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">variant</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                      &quot;grid&quot; | &quot;offset&quot; | &quot;dots&quot; | &quot;diagonal&quot; | &quot;concentric&quot; | &quot;circuit&quot; | &quot;waves&quot; | &quot;scatter&quot;
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">&quot;grid&quot;</td>
                    <td className="px-4 py-3 text-muted-foreground">The pattern layout variant to render.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">tone</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                      &quot;primary&quot; | &quot;muted&quot; | &quot;foreground&quot; | &quot;accent&quot;
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">&quot;muted&quot;</td>
                    <td className="px-4 py-3 text-muted-foreground">Color tone corresponding to semantic theme variables.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">interactive</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">boolean</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">true</td>
                    <td className="px-4 py-3 text-muted-foreground">Enables Framer Motion animations on hover.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">isParentHovered</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">boolean</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">undefined</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Overrides the local mouse-enter listeners. Useful for aligning animation with card components.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
