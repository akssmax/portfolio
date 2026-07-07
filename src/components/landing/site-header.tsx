"use client"

import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { Menu, Sparkles } from "lucide-react"

import { Logo } from "@/components/brand/logo"
import { usePortfolioChat } from "@/components/landing/portfolio-chat-provider"
import { ThemeCustomizer } from "@/components/theme-customizer"
import { Button } from "@/components/ui/button"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export type NavItem =
  | { readonly label: string; readonly to: string; readonly isAnchor: false; readonly href?: never }
  | { readonly label: string; readonly href: string; readonly isAnchor: true; readonly to?: never }

const navItems: readonly NavItem[] = [
  { label: "Projects", to: "/projects", isAnchor: false },
  { label: "Experience", to: "/experience", isAnchor: false },
  { label: "About", to: "/about", isAnchor: false },
]

function HeaderNavLink({
  item,
  className,
  onNavigate,
}: {
  item: NavItem
  className?: string
  onNavigate?: () => void
}) {
  if (item.isAnchor) {
    return (
      <Button variant="ghost" size="sm" className={className} asChild>
        <a href={item.href} onClick={onNavigate}>
          {item.label}
        </a>
      </Button>
    )
  }

  return (
    <Button variant="ghost" size="sm" className={className} asChild>
      <Link to={item.to} onClick={onNavigate}>
        {item.label}
      </Link>
    </Button>
  )
}

function MobileNavLink({
  item,
  onNavigate,
}: {
  item: NavItem
  onNavigate: () => void
}) {
  const linkClassName =
    "flex h-11 w-full items-center rounded-md px-3 text-base font-medium text-foreground transition-colors hover:bg-muted"

  if (item.isAnchor) {
    return (
      <SheetClose asChild>
        <a href={item.href} className={linkClassName} onClick={onNavigate}>
          {item.label}
        </a>
      </SheetClose>
    )
  }

  return (
    <SheetClose asChild>
      <Link to={item.to} className={linkClassName} onClick={onNavigate}>
        {item.label}
      </Link>
    </SheetClose>
  )
}

export function SiteHeader() {
  const { fullMotion } = useAnimationProfile()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { openChat } = usePortfolioChat()

  const closeMobileMenu = () => setMobileOpen(false)

  const handleAskAi = () => {
    closeMobileMenu()
    openChat()
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-sm${
          fullMotion ? " animate-in fade-in slide-in-from-top-2 duration-300" : ""
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            to="/"
            aria-label="Akshay Saini — home"
            className="inline-flex min-w-0 shrink text-foreground"
          >
            <Logo className="h-5 sm:h-6" />
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <HeaderNavLink key={item.isAnchor ? item.href : item.to} item={item} />
            ))}
            <Button size="sm" className="ml-1 gap-1.5" onClick={handleAskAi}>
              <Sparkles className="size-3.5" aria-hidden />
              Ask AI
            </Button>
            <ThemeCustomizer />
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <Button size="sm" className="gap-1.5" onClick={handleAskAi}>
              <Sparkles className="size-3.5" aria-hidden />
              Ask AI
            </Button>
            <ThemeCustomizer />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs gap-0 p-0">
                <SheetHeader className="border-b border-border px-4 py-4 text-left">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Site navigation links
                  </SheetDescription>
                </SheetHeader>

                <nav
                  className="flex flex-col gap-1 px-2 py-3"
                  aria-label="Mobile navigation"
                >
                  {navItems.map((item) => (
                    <MobileNavLink
                      key={item.isAnchor ? item.href : item.to}
                      item={item}
                      onNavigate={closeMobileMenu}
                    />
                  ))}
                </nav>

                <div className="mt-auto border-t border-border p-4">
                  <Button className="w-full gap-1.5" onClick={handleAskAi}>
                    <Sparkles className="size-3.5" aria-hidden />
                    Ask AI
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <div className="h-16 shrink-0" aria-hidden="true" />
    </>
  )
}
