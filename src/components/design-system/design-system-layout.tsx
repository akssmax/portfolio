"use client"

import "@fontsource-variable/geist"
import { useCallback, useEffect, useRef, useState } from "react"
import { Link, useRouterState } from "@tanstack/react-router"
import { motion } from "motion/react"
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Component,
  House,
  Layers3,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
} from "lucide-react"
import { ErrorBoundary } from "@/components/error-boundary"
import { ThemeCustomizer } from "@/components/theme-customizer"
import { DocSearch } from "@/components/design-system/doc-search"
import {
  DocsSidebar,
  useDocsHistory,
} from "@/components/design-system/docs-sidebar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"
import { useCanAnimate } from "@/hooks/use-can-animate"
import { designSystemNav, getDocEntry } from "@/lib/design-system-registry"
import { SIDEBAR_TRANSITION } from "@/lib/motion-easing"
import { cn } from "@/lib/utils"

export function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  }).replace(/\/$/, "")
  const isMobile = useIsMobile()
  const canAnimate = useCanAnimate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const contentRef = useRef<HTMLElement>(null)
  const sidebarToggleRef = useRef<HTMLButtonElement>(null)
  const history = useDocsHistory(pathname)
  const entry = getDocEntry(pathname.split("/").at(-1) ?? "")
  const activeWorkspaceHref =
    pathname === "/design-system/customization"
      ? "/design-system/customization"
      : pathname.startsWith("/design-system/components/") &&
          entry?.category === "custom"
        ? "/design-system/components/m3-shapes"
        : "/design-system"
  const title = pathname.includes("/components/")
    ? entry?.title
    : designSystemNav.foundations.find((item) => item.href === pathname)?.title
  const closeMobile = () => setMobileOpen(false)
  const toggleNavigation = useCallback(() => {
    if (isMobile) setMobileOpen((value) => !value)
    else {
      if (
        document
          .getElementById("docs-desktop-navigation")
          ?.contains(document.activeElement)
      )
        sidebarToggleRef.current?.focus({ preventScroll: true })
      setSidebarOpen((value) => !value)
    }
  }, [isMobile])
  const search = () => {
    setMobileOpen(false)
    setSearchOpen(true)
  }
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const id = window.location.hash.slice(1)
      const target = id && document.getElementById(id)
      if (target && contentRef.current?.contains(target))
        target.scrollIntoView({ block: "start" })
      else contentRef.current?.scrollTo({ top: 0, left: 0 })
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname])
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
        event.preventDefault()
        toggleNavigation()
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [toggleNavigation])
  const sidebar = (
    <DocsSidebar
      pathname={pathname}
      onNavigate={closeMobile}
      onSearch={search}
      {...history}
    />
  )
  return (
    <div
      className="fixed inset-0 isolate flex h-svh min-h-0 flex-col overflow-clip bg-[var(--ds-chrome)] text-foreground [--ds-sidebar-width:260px] lg:[--ds-sidebar-width:280px]"
      style={
        {
          "--ds-chrome":
            "color-mix(in oklab, var(--background), var(--foreground) 10%)",
          "--ds-navigation":
            "color-mix(in oklab, var(--background), var(--foreground) 5%)",
          "--ds-content":
            "color-mix(in oklab, var(--background), var(--foreground) 1.5%)",
          fontFamily: '"Geist Variable", sans-serif',
        } as React.CSSProperties
      }
    >
      <a
        href="#documentation-content"
        className="sr-only fixed top-2 left-2 z-[150] rounded-md bg-foreground px-4 py-2 text-background focus:not-sr-only"
      >
        Skip to content
      </a>
      <header className="flex h-14 shrink-0 items-center gap-2 px-3 text-muted-foreground md:gap-0 md:px-0">
        <div className="flex shrink-0 items-center gap-2 md:w-[104px] md:px-4">
          <Link
            to="/"
            aria-label="Back to portfolio"
            title="Back to portfolio"
            className="hidden size-8 place-items-center rounded-lg hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring md:grid"
          >
            <ArrowLeft className="size-[18px]" strokeWidth={1.6} />
          </Link>
          <button
            ref={sidebarToggleRef}
            type="button"
            onClick={toggleNavigation}
            aria-label="Toggle Sidebar"
            aria-expanded={isMobile ? mobileOpen : sidebarOpen}
            aria-controls={
              isMobile ? "docs-mobile-navigation" : "docs-desktop-navigation"
            }
            title="Toggle navigation (⌘B)"
            className="grid size-8 shrink-0 place-items-center rounded-lg hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            {sidebarOpen && !isMobile ? (
              <PanelLeftClose className="size-[18px]" strokeWidth={1.6} />
            ) : (
              <PanelLeftOpen className="size-[18px]" strokeWidth={1.6} />
            )}
          </button>
        </div>
        <div className="hidden h-5 w-px shrink-0 bg-foreground/10 md:block" />
        <div className="flex min-w-0 items-center gap-2.5 px-1 text-[13px] md:px-4">
          <BookOpen
            className="hidden size-[17px] shrink-0 sm:block"
            strokeWidth={1.6}
          />
          <Link to="/design-system" className="shrink-0 hover:text-foreground">
            Design system
          </Link>
          {title && title !== "Introduction" && (
            <>
              <ChevronRight className="size-3 shrink-0 opacity-50" />
              <span className="truncate text-foreground">{title}</span>
            </>
          )}
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2 md:mr-4">
          <button
            type="button"
            onClick={search}
            aria-label="Search docs"
            title="Search documentation (⌘K)"
            className="grid size-8 place-items-center rounded-lg hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <Search className="size-[18px]" strokeWidth={1.6} />
          </button>
          <div className="h-5 w-px bg-foreground/10" />
          <div className="[&>button]:size-8 [&>button]:border-transparent [&>button]:bg-transparent [&>button]:shadow-none">
            <ThemeCustomizer />
          </div>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 pr-2 pb-2 md:pr-3 md:pb-3">
        <nav
          aria-label="Workspace"
          className="hidden w-16 shrink-0 flex-col items-center gap-2 py-3 md:flex"
        >
          {[
            { title: "Portfolio home", href: "/", icon: House },
            {
              title: "Design system",
              href: "/design-system",
              icon: Component,
            },
            {
              title: "Developer guide",
              href: "/design-system/customization",
              icon: BookOpen,
            },
            {
              title: "Portfolio patterns",
              href: "/design-system/components/m3-shapes",
              icon: Layers3,
            },
          ].map((item) => (
            <Tooltip key={item.title}>
              <TooltipTrigger asChild>
                <Link
                  to={
                    item.href.startsWith("/design-system/components/")
                      ? "/design-system/components/$slug"
                      : item.href
                  }
                  {...(item.href.startsWith("/design-system/components/")
                    ? { params: { slug: "m3-shapes" } }
                    : {})}
                  aria-label={item.title}
                  activeOptions={{ exact: true }}
                  aria-current={
                    item.href === activeWorkspaceHref ? "location" : undefined
                  }
                  className={cn(
                    "grid size-10 place-items-center rounded-xl transition-colors hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-ring",
                    item.href === activeWorkspaceHref
                      ? "bg-foreground/10 text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="size-[21px]" strokeWidth={1.6} />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.title}</TooltipContent>
            </Tooltip>
          ))}
          <span className="mt-2 h-px w-7 bg-foreground/10" />
          <div className="flex-1" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/about"
                aria-label="About Akshay Saini"
                className="grid size-9 place-items-center rounded-full bg-foreground/10 text-[11px] font-medium text-foreground transition-colors hover:bg-foreground/15 focus-visible:outline-2 focus-visible:outline-ring"
              >
                AS
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Akshay Saini</TooltipContent>
          </Tooltip>
        </nav>
        <div className="ml-2 flex min-w-0 flex-1 overflow-hidden rounded-2xl border border-foreground/[0.08] bg-[var(--ds-content)] shadow-xs md:ml-0 md:rounded-[22px]">
          {!isMobile && (
            <motion.aside
              id="docs-desktop-navigation"
              aria-label="Documentation sidebar"
              aria-hidden={!sidebarOpen}
              inert={!sidebarOpen}
              initial={false}
              animate={{
                width: sidebarOpen ? "var(--ds-sidebar-width)" : 0,
                opacity: sidebarOpen ? 1 : 0,
              }}
              transition={canAnimate ? SIDEBAR_TRANSITION : { duration: 0 }}
              className="hidden shrink-0 overflow-hidden md:block"
            >
              <div className="h-full w-[var(--ds-sidebar-width)] border-r border-foreground/[0.07] bg-[var(--ds-navigation)]">
                {sidebar}
              </div>
            </motion.aside>
          )}
          <main
            ref={contentRef}
            id="documentation-content"
            tabIndex={-1}
            className="min-h-0 min-w-0 flex-1 [scrollbar-width:thin] overflow-y-auto overscroll-contain outline-none"
            style={{ fontFamily: "var(--font-family-sans)" }}
          >
            <ErrorBoundary
              title="This page failed to render"
              showHeader={false}
            >
              {children}
            </ErrorBoundary>
            <footer className="mx-5 flex flex-wrap items-center justify-between gap-2 border-t border-border py-6 text-[11px] text-muted-foreground sm:mx-9">
              <span>Portfolio UI · Designed to evolve.</span>
              <span>React 19 · Tailwind CSS v4 · shadcn/ui</span>
            </footer>
          </main>
        </div>
      </div>
      <Sheet open={isMobile && mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          id="docs-mobile-navigation"
          side="left"
          className="gap-0 border-r border-border bg-[var(--sidebar)] p-0 [font-family:'Geist_Variable',sans-serif] data-[side=left]:w-[min(320px,88vw)]"
        >
          <SheetTitle className="sr-only">Documentation navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Browse foundations, components, portfolio patterns, and pinned
            pages.
          </SheetDescription>
          {isMobile && sidebar}
        </SheetContent>
      </Sheet>
      <DocSearch
        open={searchOpen}
        onOpenChange={setSearchOpen}
        hideTrigger
        onNavigate={closeMobile}
      />
    </div>
  )
}
