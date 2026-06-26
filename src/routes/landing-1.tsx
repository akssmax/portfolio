import { createFileRoute, Link } from "@tanstack/react-router"
import { motion, useReducedMotion } from "motion/react"
import { ArrowRight, ArrowUpRight, Code, ExternalLink, Layers, Quote, Sparkles, Terminal } from "lucide-react"

import { SiteHeader } from "@/components/landing/site-header"
import { ContactSection } from "@/components/landing/contact-section"
import { SiteFooter } from "@/components/landing/site-footer"
import { ErrorBoundary } from "@/components/error-boundary"
import { RouteError } from "@/components/route-error"
import { getHomeWorkSections } from "@/lib/sanity/projects"
import { testimonials } from "@/lib/testimonials"
import { Button } from "@/components/ui/button"
import { profile } from "@/lib/profile"

export const Route = createFileRoute("/landing-1")({
  loader: () => getHomeWorkSections(),
  errorComponent: RouteError,
  head: () => ({
    meta: [
      {
        title: "Akshay Saini — Design Engineer (Variant Landing)",
      },
      {
        name: "description",
        content: "Explore the bento-layout version of Akshay Saini's design-engineering portfolio.",
      },
    ],
  }),
  component: LandingOnePage,
})

function LandingOnePage() {
  const { recentProjects } = Route.useLoaderData()

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main>
        <LandingOneHero />
        <LandingOneBento projects={recentProjects} />
        <LandingOneTestimonials />
        <ErrorBoundary title="Contact section failed" showHeader={false}>
          <ContactSection bottomCutout={true} />
        </ErrorBoundary>
      </main>
      <SiteFooter hasTopBorder={false} />
    </div>
  )
}

function FigmaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 18C12 14.6863 14.6863 12 18 12C21.3137 12 24 14.6863 24 18C24 21.3137 21.3137 24 18 24C14.6863 24 12 21.3137 12 18Z" fill="#1ABC9C" />
      <path d="M12 6C12 2.68629 14.6863 0 18 0H24V12H18C14.6863 12 12 9.31371 12 6Z" fill="#F24E1E" />
      <path d="M24 12C27.3137 12 30 9.31371 30 6C30 2.68629 27.3137 0 24 0V12Z" fill="#FF7262" />
      <path d="M12 30C12 26.6863 14.6863 24 18 24H24V30C24 33.3137 21.3137 36 18 36C14.6863 36 12 33.3137 12 30Z" fill="#0ACF83" />
      <path d="M12 18C12 14.6863 14.6863 12 18 12V24C14.6863 24 12 21.3137 12 18Z" fill="#A259FF" />
    </svg>
  )
}

function LandingOneHero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden py-20 lg:py-32 border-b border-border/50">
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            className="flex flex-col items-start gap-6"
            initial={shouldReduceMotion ? false : { opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary tracking-wide uppercase">
              <Sparkles className="size-3.5 animate-pulse" />
              Design Engineer Portfolio
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1] font-heading">
              Designing with <span className="text-primary bg-clip-text">pixels</span>. <br />
              Engineering with <span className="text-foreground">code</span>.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
              I build high-fidelity interactive interfaces at the intersection of design systems and production frontend engineering. Specializing in AI developer workspaces, fintech products, and component design.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <Button size="lg" className="gap-2 group shadow-lg" asChild>
                <a href="#featured-bento">
                  Explore Work
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">
                  More About Me
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Interactive designer canvas card mockup */}
            <div className="w-full max-w-[420px] rounded-2xl border border-border/80 bg-card p-5 shadow-2xl backdrop-blur-sm relative group overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              
              <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-4 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-500/80" />
                  <span className="size-2.5 rounded-full bg-yellow-500/80" />
                  <span className="size-2.5 rounded-full bg-green-500/80" />
                </div>
                <span>akshay.design_system.tsx</span>
              </div>

              <div className="space-y-4">
                {/* Visual canvas editor nodes */}
                <div className="border border-dashed border-border/70 rounded-lg p-3 bg-muted/20 relative flex items-center justify-center min-h-[140px] overflow-hidden">
                  <div className="absolute top-2 left-2 text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest flex items-center gap-1">
                    <FigmaIcon className="size-3 text-purple-400" />
                    Canvas viewport
                  </div>

                  <div className="flex gap-4 items-center">
                    {/* Dynamic flower cutout preview */}
                    <motion.div 
                      className="size-16 rounded-full border border-primary/30 flex items-center justify-center bg-primary/5 text-primary"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    >
                      <svg className="size-12 overflow-visible" viewBox="0 0 1000 1000" fill="none">
                        <path d="M500 0 C 650 250, 750 350, 1000 500 C 750 650, 650 750, 500 1000 C 350 750, 250 650, 0 500 C 250 350, 350 250, 500 0 Z" className="fill-primary/10 stroke-primary" strokeWidth="20" />
                      </svg>
                    </motion.div>
                    
                    {/* Dynamic puffy cutout preview */}
                    <motion.div 
                      className="size-16 rounded-full border border-foreground/15 flex items-center justify-center bg-muted/30"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <svg className="size-12 overflow-visible" viewBox="0 0 1000 1000" fill="none">
                        <path d="M500 200 C 350 50, 150 150, 200 350 C 50 500, 150 700, 350 650 C 500 800, 700 700, 650 500 C 800 350, 700 150, 500 200 Z" className="fill-foreground/5 stroke-foreground/30" strokeWidth="20" />
                      </svg>
                    </motion.div>
                  </div>
                </div>

                {/* Simulated interactive component properties code block */}
                <div className="rounded-lg bg-black/60 p-3.5 font-mono text-[11px] leading-relaxed text-muted-foreground/90 border border-white/5 space-y-1 shadow-inner">
                  <div className="flex items-center gap-1.5 text-primary font-semibold">
                    <Code className="size-3.5" />
                    <span>const contactSectionConfig = &#123;</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-blue-400">variant:</span> <span className="text-yellow-300">&quot;dub-notch&quot;</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-blue-400">topCutout:</span> <span className="text-purple-400">true</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-blue-400">bottomCutout:</span> <span className="text-purple-400">true</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-blue-400">topCutoutPosition:</span> <span className="text-yellow-300">&quot;left&quot;</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-blue-400">bottomCutoutPosition:</span> <span className="text-yellow-300">&quot;right&quot;</span>
                  </div>
                  <div className="text-primary font-semibold">&#125;</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function LandingOneBento({ projects }: { projects: any[] }) {
  const shouldReduceMotion = useReducedMotion()

  // We want to extract projects based on their slug or fallback order
  const getProject = (slug: string) => {
    return projects.find((p) => p.slug === slug) || projects[0]
  }

  const chatShell = getProject("100x-chat-shell")
  const agentExtension = getProject("v1-100x-proto")
  const marketingSite = getProject("100x-landing-page")
  const resumeBuilder = getProject("resume-builder")

  return (
    <section id="featured-bento" className="py-24 bg-section text-section-foreground border-b border-border/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-heading">Featured Bento Box</h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              Explore featured builds across interactive AI shells, browser extensions, founder websites, and resume compilers.
            </p>
          </div>
          <Button asChild variant="outline" className="border-border/80 self-start md:self-end">
            <Link to="/projects">
              View All Work
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px] sm:auto-rows-[280px]">
          {/* Card 1: LLM Chat Shell (col-span-2, row-span-2) */}
          <motion.div
            className="md:col-span-2 md:row-span-2 rounded-2xl border border-border/60 bg-card p-6 flex flex-col justify-between overflow-hidden relative group cursor-pointer shadow-lg"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4, borderColor: "rgba(var(--primary-rgb), 0.3)" }}
            transition={{ duration: 0.4 }}
          >
            <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-red-500 to-transparent pointer-events-none" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                  <Terminal className="size-3" />
                  Product UI & Codegen
                </span>
                <Link to="/projects/$slug" params={{ slug: chatShell.slug }} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                  <ExternalLink className="size-4" />
                </Link>
              </div>
              <div className="space-y-2 max-w-lg">
                <h3 className="text-2xl font-bold tracking-tight">{chatShell.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {chatShell.description}
                </p>
              </div>
            </div>

            {/* Simulated Live streaming Terminal inside the bento */}
            <div className="mt-4 rounded-xl bg-black/60 border border-white/5 p-4 font-mono text-[11px] leading-relaxed text-emerald-400 space-y-1.5 overflow-hidden flex-1 shadow-inner min-h-[120px]">
              <div className="flex items-center justify-between text-muted-foreground border-b border-white/5 pb-2 mb-2">
                <span>shell-workspace v1.0.0</span>
                <span>streaming</span>
              </div>
              <div>$ npx agentic-codegen --prompt &quot;dashboard&quot;</div>
              <div className="text-muted-foreground animate-pulse">&gt; compiling component layout...</div>
              <div className="text-blue-400">&gt; added 12 interactive Figma auto-layouts</div>
              <div className="text-primary">&gt; compiled successfully (took 450ms)</div>
            </div>
            
            <Link to="/projects/$slug" params={{ slug: chatShell.slug }} className="absolute inset-0" aria-label={`View ${chatShell.title}`} />
          </motion.div>

          {/* Card 2: 100x Agent Extension (col-span-1, row-span-1) */}
          <motion.div
            className="md:col-span-1 md:row-span-1 rounded-2xl border border-border/60 bg-card p-6 flex flex-col justify-between overflow-hidden relative group cursor-pointer shadow-lg"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4, borderColor: "rgba(var(--primary-rgb), 0.3)" }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-purple-500 to-transparent pointer-events-none" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 flex items-center gap-1 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  <Layers className="size-3" />
                  AI Agent Workspace
                </span>
                <Link to="/projects/$slug" params={{ slug: agentExtension.slug }} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                  <ExternalLink className="size-4" />
                </Link>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold tracking-tight">{agentExtension.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {agentExtension.description}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[9px] font-mono bg-muted px-1.5 py-0.5 rounded border border-border/40 text-muted-foreground">Chrome Extension</span>
              <span className="text-[9px] font-mono bg-muted px-1.5 py-0.5 rounded border border-border/40 text-muted-foreground">React</span>
            </div>
            
            <Link to="/projects/$slug" params={{ slug: agentExtension.slug }} className="absolute inset-0" aria-label={`View ${agentExtension.title}`} />
          </motion.div>

          {/* Card 3: 100x.Bot Marketing Site (col-span-1, row-span-1) */}
          <motion.div
            className="md:col-span-1 md:row-span-1 rounded-2xl border border-border/60 bg-card p-6 flex flex-col justify-between overflow-hidden relative group cursor-pointer shadow-lg"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4, borderColor: "rgba(var(--primary-rgb), 0.3)" }}
            transition={{ duration: 0.4, delay: 0.12 }}
          >
            <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-yellow-500 to-transparent pointer-events-none" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <FigmaIcon className="size-3 text-amber-400" />
                  Founder Website
                </span>
                <Link to="/projects/$slug" params={{ slug: marketingSite.slug }} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                  <ExternalLink className="size-4" />
                </Link>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold tracking-tight">{marketingSite.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {marketingSite.description}
                </p>
              </div>
            </div>
            <div className="inline-flex w-fit items-center gap-1 rounded bg-red-500/15 border border-red-500/25 px-2 py-0.5 text-[9px] font-semibold text-red-500">
              YC Partnered
            </div>
            
            <Link to="/projects/$slug" params={{ slug: marketingSite.slug }} className="absolute inset-0" aria-label={`View ${marketingSite.title}`} />
          </motion.div>

          {/* Card 4: Resume Builder (col-span-3, row-span-1) */}
          <motion.div
            className="md:col-span-3 md:row-span-1 rounded-2xl border border-border/60 bg-card p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 overflow-hidden relative group cursor-pointer shadow-lg"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4, borderColor: "rgba(var(--primary-rgb), 0.3)" }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-green-500 to-transparent pointer-events-none" />
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Terminal className="size-3" />
                  Design-to-PDF compiler
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight">{resumeBuilder.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {resumeBuilder.description}
              </p>
            </div>
            
            <div className="flex flex-col gap-2 shrink-0 sm:min-w-[180px]">
              <div className="text-[10px] font-mono text-muted-foreground/60 flex justify-between">
                <span>Output Format:</span>
                <span className="text-emerald-400 font-bold">PDF (A4 Grid)</span>
              </div>
              <div className="rounded bg-muted p-2 font-mono text-[10px] border border-border/40 text-center text-muted-foreground">
                akshay-saini-resume.pdf
              </div>
            </div>
            
            <Link to="/projects/$slug" params={{ slug: resumeBuilder.slug }} className="absolute inset-0" aria-label={`View ${resumeBuilder.title}`} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function LandingOneTestimonials() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="marquee-testimonials" className="py-24 border-b border-border/50 relative overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 bg-radial-gradient from-card via-transparent to-transparent opacity-40" />
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mb-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-heading">Colleague Feedback</h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              What collaborators, engineers, and product heads have highlighted about our workflow.
            </p>
          </div>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground self-start md:self-end"
          >
            Verify on LinkedIn
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>

      {/* Infinite Scrolling Testimonial Marquee Cards */}
      <div className="relative flex flex-col justify-center gap-6 overflow-hidden py-4 select-none">
        {/* Row 1 Scrolling Left */}
        <div className={`flex w-max gap-6 hover:[animation-play-state:paused] ${
          shouldReduceMotion ? "overflow-x-auto max-w-full" : "animate-marquee"
        }`}>
          {/* Double array to make infinite loop seamless */}
          {[...testimonials, ...testimonials].map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="w-[340px] shrink-0 rounded-2xl border border-border/60 bg-card/65 p-6 flex flex-col justify-between gap-4 backdrop-blur-sm shadow-sm relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
              <Quote className="size-6 text-primary/15 absolute right-6 top-6" />
              <div className="space-y-3 relative">
                <blockquote className="text-xs text-muted-foreground leading-relaxed">
                  &ldquo;
                  {item.quote.map((part, index) =>
                    part.bold ? (
                      <strong key={index} className="font-semibold text-foreground">
                        {part.text}
                      </strong>
                    ) : (
                      part.text
                    ),
                  )}
                  &rdquo;
                </blockquote>
              </div>

              <div className="flex items-center gap-3 border-t border-border/40 pt-4 mt-auto">
                <div className="size-10 rounded-full border border-border bg-muted flex items-center justify-center font-bold text-xs uppercase overflow-hidden shrink-0">
                  {item.avatarSrc ? (
                    <img src={item.avatarSrc} alt={item.name} className="size-full object-cover" />
                  ) : (
                    <span>{item.name.substring(0, 2)}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <a
                    href={item.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs font-bold leading-none text-foreground hover:text-primary transition-colors truncate"
                  >
                    {item.name}
                  </a>
                  <span className="block text-[10px] text-muted-foreground truncate mt-1">
                    {item.headline}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
