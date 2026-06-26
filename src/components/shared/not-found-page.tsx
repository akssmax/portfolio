"use client"

import { Link } from "@tanstack/react-router"
import { Gamepad2 } from "lucide-react"

import { FooterMonogram } from "@/components/brand/footer-monogram"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"
import { M3Shape } from "@/components/m3-shapes"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader />
      
      <main className="relative flex-1 flex flex-col items-center justify-center px-4 py-16 text-center max-w-4xl mx-auto w-full overflow-hidden">
        {/* Floating background M3 shapes for premium branding */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.06] dark:opacity-[0.03]" aria-hidden>
          <M3Shape
            shape="flower"
            className="absolute -left-20 top-[15%] size-64 rotate-12"
            fillClassName="text-primary"
          />
          <M3Shape
            shape="puffy"
            className="absolute -right-24 bottom-[20%] size-80 -rotate-45"
            fillClassName="text-primary"
          />
          <M3Shape
            shape="12-sided-cookie"
            className="absolute left-[30%] -top-20 size-48 rotate-[75deg]"
            fillClassName="text-primary"
          />
        </div>

        {/* Error notification badge */}
        <div className="relative z-10 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-6">
          <span className="size-1.5 rounded-full bg-primary animate-ping" />
          404 Error
        </div>

        {/* Heading */}
        <h1 className="relative z-10 text-4xl font-extrabold tracking-tight sm:text-6xl mb-4 bg-gradient-to-br from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
          Lost in the Design System
        </h1>
        
        {/* Subtitle */}
        <p className="relative z-10 text-base text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed sm:text-lg">
          The requested page could not be found. While you are here, guide our monogram runner back home to Akshay&apos;s portfolio!
        </p>

        {/* Game Console Box */}
        <div className="relative z-10 w-full max-w-2xl border border-border bg-card/45 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl mb-10">
          <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border">
            <Gamepad2 className="size-3 text-primary animate-pulse" />
            Minigame Console
          </div>
          <p className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-widest mb-6 text-left">
            Interactive Area
          </p>
          
          <FooterMonogram enableRunnerGame={true} size="footer" />
        </div>

        {/* CTA Actions */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button asChild size="lg" className="px-8 shadow-lg cursor-pointer">
            <Link to="/">Back to Homepage</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="px-8 cursor-pointer">
            <Link to="/projects">Browse Projects</Link>
          </Button>
        </div>
      </main>

      <SiteFooter hasTopBorder={true} />
    </div>
  )
}
