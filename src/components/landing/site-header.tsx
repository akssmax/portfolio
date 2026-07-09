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
import { cn } from "@/lib/utils"

export type NavItem =
  | { readonly label: string; readonly to: string; readonly isAnchor: false; readonly href?: never }
  | { readonly label: string; readonly href: string; readonly isAnchor: true; readonly to?: never }

const navItems: readonly NavItem[] = [
  { label: "Projects", to: "/projects", isAnchor: false },
  { label: "Experience", to: "/experience", isAnchor: false },
  { label: "About", to: "/about", isAnchor: false },
]

const desktopActiveClasses =
  "relative data-[status=active]:bg-primary/10 data-[status=active]:text-primary data-[status=active]:hover:bg-primary/15 data-[status=active]:hover:text-primary after:pointer-events-none after:absolute after:left-1/2 after:bottom-0.5 after:h-0.5 after:w-3 after:-translate-x-1/2 after:rounded-full after:bg-primary after:opacity-0 after:transition-opacity data-[status=active]:after:opacity-100"

const desktopOnMediaActiveClasses =
  "data-[status=active]:bg-white/15 data-[status=active]:text-white data-[status=active]:hover:bg-white/20 data-[status=active]:hover:text-white after:bg-white dark:data-[status=active]:bg-primary/10 dark:data-[status=active]:text-primary dark:data-[status=active]:hover:bg-primary/15 dark:data-[status=active]:hover:text-primary dark:after:bg-primary"

const mobileActiveClasses =
  "data-[status=active]:bg-primary/10 data-[status=active]:text-primary data-[status=active]:font-semibold"

function HeaderNavLink({
  item,
  className,
  onMedia = false,
  onNavigate,
}: {
  item: NavItem
  className?: string
  onMedia?: boolean
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
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        desktopActiveClasses,
        onMedia && desktopOnMediaActiveClasses,
        className,
      )}
      asChild
    >
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
  const linkClassName = cn(
    "flex h-11 w-full items-center rounded-md px-3 text-base font-medium text-foreground transition-colors hover:bg-muted",
    mobileActiveClasses,
  )

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

type SiteHeaderProps = {
  /** Dark glass bar for photo heroes (light mode). Dark mode stays default. */
  tone?: "default" | "on-media"
}

export function SiteHeader({ tone = "default" }: SiteHeaderProps) {
  const { fullMotion } = useAnimationProfile()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { openChat } = usePortfolioChat()
  const onMedia = tone === "on-media"

  const closeMobileMenu = () => setMobileOpen(false)

  const handleAskAi = () => {
    closeMobileMenu()
    openChat()
  }

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b",
          onMedia
            ? "border-white/10 bg-neutral-950/75 text-white backdrop-blur-md dark:border-border/60 dark:bg-background/80 dark:text-foreground dark:backdrop-blur-sm"
            : fullMotion
              ? "border-border/60 bg-background/80 backdrop-blur-sm"
              : "border-border/60 bg-background/95",
          fullMotion && "animate-in fade-in slide-in-from-top-2 duration-300",
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            to="/"
            aria-label="Akshay Saini — home"
            className={cn(
              "inline-flex min-w-0 shrink text-foreground",
              onMedia && "text-white dark:text-foreground",
            )}
          >
            <Logo className="h-5 sm:h-6" />
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <HeaderNavLink
                key={item.isAnchor ? item.href : item.to}
                item={item}
                onMedia={onMedia}
                className={
                  onMedia
                    ? "text-white/85 hover:bg-white/10 hover:text-white dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground"
                    : undefined
                }
              />
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
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Open menu"
                  className={
                    onMedia
                      ? "border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white dark:border-input dark:bg-background dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground"
                      : undefined
                  }
                >
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
