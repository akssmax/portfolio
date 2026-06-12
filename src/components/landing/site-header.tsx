import { Link } from "@tanstack/react-router"
import { motion, useReducedMotion } from "motion/react"

import { Logo } from "@/components/brand/logo"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Work", href: "/#work", isAnchor: true },
  { label: "About", href: "/#about", isAnchor: true },
  { label: "Experience", href: "/#experience", isAnchor: true },
  { label: "Projects", to: "/projects" as const, isAnchor: false },
] as const

export function SiteHeader() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.header
      className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-sm"
      initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          aria-label="Akshay Saini — home"
          className="inline-flex text-foreground transition-opacity hover:opacity-80"
        >
          <Logo />
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) =>
            item.isAnchor ? (
              <Button key={item.href} variant="ghost" size="sm" asChild>
                <a href={item.href}>{item.label}</a>
              </Button>
            ) : (
              <Button key={item.to} variant="ghost" size="sm" asChild>
                <Link to={item.to}>{item.label}</Link>
              </Button>
            ),
          )}
          <Button size="sm" className="ml-1" asChild>
            <a href="/#contact">Let's build together</a>
          </Button>
          <ModeToggle />
        </nav>
      </div>
    </motion.header>
  )
}
