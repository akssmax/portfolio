import { Link } from "@tanstack/react-router"
import { motion, useReducedMotion } from "motion/react"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Work", href: "#work", isAnchor: true },
  { label: "Projects", to: "/projects" as const, isAnchor: false },
  { label: "Skills", href: "#skills", isAnchor: true },
  { label: "Contact", href: "#contact", isAnchor: true },
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
          className="text-base font-semibold tracking-tight text-foreground"
        >
          Akshay Saini
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
          <ModeToggle />
        </nav>
      </div>
    </motion.header>
  )
}
