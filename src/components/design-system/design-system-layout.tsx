"use client"

import { Link, useRouterState } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"

import { ErrorBoundary } from "@/components/error-boundary"
import { ThemeCustomizer } from "@/components/theme-customizer"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { designSystemNav } from "@/lib/design-system-registry"
import { cn } from "@/lib/utils"

function NavLink({
  href,
  title,
}: {
  href: string
  title: string
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { setOpenMobile } = useSidebar()
  const isActive = pathname === href

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link
          to={
            href.startsWith("/design-system/components/")
              ? "/design-system/components/$slug"
              : href
          }
          {...(href.startsWith("/design-system/components/")
            ? { params: { slug: href.replace("/design-system/components/", "") } }
            : {})}
          onClick={() => setOpenMobile(false)}
        >
          {title}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
          <p className="text-sm font-semibold text-sidebar-foreground">
            Design System
          </p>
          <p className="text-xs text-muted-foreground">Portfolio components</p>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Foundations</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {designSystemNav.foundations.map((item) => (
                  <NavLink key={item.href} href={item.href} title={item.title} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Components</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {designSystemNav.components.map((item) => (
                  <NavLink key={item.href} href={item.href} title={item.title} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Custom</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {designSystemNav.custom.map((item) => (
                  <NavLink key={item.href} href={item.href} title={item.title} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur-sm sm:gap-3 sm:px-6">
          <SidebarTrigger className="shrink-0" />
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 shrink-0" />
            <span className="truncate">Back to portfolio</span>
          </Link>
          <div className="ms-auto shrink-0">
            <ThemeCustomizer triggerSize="icon-sm" />
          </div>
        </header>
        <main className={cn("mx-auto w-full max-w-4xl flex-1 p-4 sm:p-6 md:p-10")}>
          <ErrorBoundary title="This page failed to render" showHeader={false}>
            {children}
          </ErrorBoundary>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
