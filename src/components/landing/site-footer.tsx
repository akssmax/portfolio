import { Link } from "@tanstack/react-router"
import { ArrowUpRight } from "lucide-react"

import { Logo } from "@/components/brand/logo"
import { FooterRunnerSection } from "@/components/landing/footer-runner-section"
import { PrideFlag } from "@/components/landing/pride-flag"
import { profile } from "@/lib/profile"

const siteLinks = [
  { label: "Work", href: "/#work" },
  { label: "About", to: "/about" as const },
  { label: "Projects", to: "/projects" as const },
  { label: "Blog", to: "/blog" as const },
  { label: "Design System", to: "/design-system" as const },
] as const

const socialLinks = [
  { label: "LinkedIn", href: profile.links.linkedin },
  { label: "GitHub", href: profile.links.github },
] as const

export interface SiteFooterProps {
  hasTopBorder?: boolean
}

export function SiteFooter({ hasTopBorder = true }: SiteFooterProps) {
  return (
    <footer className={`${hasTopBorder ? "border-t border-border" : ""} bg-background`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 py-12 md:grid-cols-[minmax(0,1.4fr)_auto_auto] md:gap-12 lg:gap-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                aria-label="Akshay Saini — home"
                className="inline-flex shrink-0 transition-opacity hover:opacity-80"
              >
                <Logo className="h-6 sm:h-7" />
              </Link>
              <PrideFlag
                className="h-6 w-auto shrink-0 sm:h-7"
                numOfColumns={8}
                billow={0.5}
                staggeredDelay={40}
              />
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {profile.title} crafting product experiences at the intersection
              of design systems and production code.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Navigate
            </p>
            <nav className="flex flex-col gap-2">
              {siteLinks.map((item) =>
                "to" in item ? (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="w-fit text-sm text-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="w-fit text-sm text-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                ),
              )}
            </nav>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Connect
            </p>
            <nav className="flex flex-col gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-fit items-center gap-1 text-sm text-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                  <ArrowUpRight className="size-3.5 opacity-60 transition-transform group-hover:-translate-y-px group-hover:translate-x-px group-hover:opacity-100" />
                </a>
              ))}
            </nav>
          </div>
        </div>

        <FooterRunnerSection />
      </div>
    </footer>
  )
}
