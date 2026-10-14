import { useEffect, useRef, useState } from "react"
import { Link } from "@tanstack/react-router"
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Component,
  Folder,
  FolderOpen,
  Layers3,
  PanelTop,
  Pin,
  Search,
  Shapes,
} from "lucide-react"
import { componentEntries, designSystemNav } from "@/lib/design-system-registry"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type SidebarDocLink = { title: string; href: string }
export const sidebarDocLinks = [
  ...designSystemNav.foundations,
  ...designSystemNav.components,
  ...designSystemNav.custom,
]
const linksByHref = new Map(sidebarDocLinks.map((item) => [item.href, item]))
const foundationLinks = designSystemNav.foundations.filter(
  (item) =>
    !["/design-system", "/design-system/customization"].includes(item.href)
)
const componentFolders = [
  {
    title: "Actions",
    slugs: ["button", "button-group", "toggle", "toggle-group"],
  },
  {
    title: "Inputs",
    slugs: [
      "calendar",
      "checkbox",
      "combobox",
      "field",
      "input",
      "input-group",
      "input-otp",
      "label",
      "native-select",
      "radio-group",
      "select",
      "slider",
      "switch",
      "textarea",
    ],
  },
  {
    title: "Navigation",
    slugs: [
      "breadcrumb",
      "command",
      "context-menu",
      "dropdown-menu",
      "menubar",
      "navigation-menu",
      "pagination",
      "tabs",
    ],
  },
  {
    title: "Overlays",
    slugs: [
      "alert-dialog",
      "dialog",
      "drawer",
      "hover-card",
      "popover",
      "sheet",
      "tooltip",
    ],
  },
  {
    title: "Feedback",
    slugs: ["alert", "empty", "progress", "skeleton", "sonner", "spinner"],
  },
  {
    title: "Layout",
    slugs: [
      "accordion",
      "aspect-ratio",
      "card",
      "carousel",
      "collapsible",
      "item",
      "resizable",
      "scroll-area",
      "separator",
      "sidebar",
    ],
  },
  {
    title: "Data display",
    slugs: ["avatar", "badge", "chart", "kbd", "table"],
  },
]

export function useDocsHistory(pathname: string) {
  const [pinned, setPinned] = useState<string[]>([])
  const [recent, setRecent] = useState<string[]>([])
  const [ready, setReady] = useState(false)
  useEffect(() => {
    function read(key: string) {
      try {
        const value: unknown = JSON.parse(localStorage.getItem(key) ?? "[]")
        return Array.isArray(value)
          ? value
              .filter(
                (href): href is string =>
                  typeof href === "string" && linksByHref.has(href)
              )
              .slice(0, 8)
          : []
      } catch {
        return []
      }
    }
    setPinned(read("portfolio-docs:pinned"))
    setRecent(read("portfolio-docs:recent"))
    setReady(true)
  }, [])
  useEffect(() => {
    if (ready && linksByHref.has(pathname))
      setRecent((previous) =>
        [pathname, ...previous.filter((href) => href !== pathname)].slice(0, 6)
      )
  }, [pathname, ready])
  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem("portfolio-docs:pinned", JSON.stringify(pinned))
      localStorage.setItem("portfolio-docs:recent", JSON.stringify(recent))
    } catch {
      /* Navigation remains usable without storage. */
    }
  }, [pinned, recent, ready])
  return {
    pinned,
    recent,
    togglePin: (href: string) =>
      setPinned((previous) =>
        previous.includes(href)
          ? previous.filter((item) => item !== href)
          : [...previous, href].slice(-8)
      ),
  }
}

export function DocsSidebar({
  pathname,
  onNavigate,
  onSearch,
  pinned,
  recent,
  togglePin,
}: {
  pathname: string
  onNavigate: () => void
  onSearch: () => void
  pinned: string[]
  recent: string[]
  togglePin: (href: string) => void
}) {
  const currentFolder = componentFolders.find((folder) =>
    folder.slugs.some((slug) => pathname.endsWith(`/components/${slug}`))
  )?.title
  const isPattern = designSystemNav.custom.some(
    (item) => item.href === pathname
  )
  const isFoundation = foundationLinks.some((item) => item.href === pathname)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Foundations: !currentFolder && !isPattern,
    Components: true,
    "Portfolio patterns": isPattern,
    Pinned: true,
    "Recently viewed": false,
    ...(currentFolder ? { [currentFolder]: true } : {}),
  })
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setExpanded((previous) => ({
      ...previous,
      ...(currentFolder ? { Components: true, [currentFolder]: true } : {}),
      ...(isPattern ? { "Portfolio patterns": true } : {}),
      ...(isFoundation ? { Foundations: true } : {}),
    }))
  }, [currentFolder, isPattern, isFoundation])
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const container = scrollRef.current
      const active = container?.querySelector('[aria-current="page"]')
      if (!container || !active) return
      const bounds = container.getBoundingClientRect()
      const item = active.getBoundingClientRect()
      if (item.top < bounds.top) container.scrollTop += item.top - bounds.top
      else if (item.bottom > bounds.bottom)
        container.scrollTop += item.bottom - bounds.bottom
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname])
  const toggle = (name: string) =>
    setExpanded((previous) => ({ ...previous, [name]: !previous[name] }))
  function row(item: SidebarDocLink, indent = false, icon?: React.ReactNode) {
    const active = pathname === item.href
    const isPinned = pinned.includes(item.href)
    return (
      <li key={item.href} className="group relative">
        <Link
          to={
            item.href.startsWith("/design-system/components/")
              ? "/design-system/components/$slug"
              : item.href
          }
          {...(item.href.startsWith("/design-system/components/")
            ? { params: { slug: item.href.split("/").at(-1)! } }
            : {})}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          className={cn(
            "flex h-9 min-w-0 items-center gap-2.5 rounded-xl pr-8 text-[13px] transition-colors hover:bg-foreground/[0.055] focus-visible:outline-2 focus-visible:outline-ring",
            indent ? "pl-9" : "pl-3",
            active
              ? "bg-foreground/[0.085] font-medium text-foreground"
              : "text-foreground/75"
          )}
        >
          {icon}
          <span className="truncate">{item.title}</span>
        </Link>
        <button
          type="button"
          onClick={() => togglePin(item.href)}
          aria-label={`${isPinned ? "Unpin" : "Pin"} ${item.title}`}
          aria-pressed={isPinned}
          className={cn(
            "absolute top-1.5 right-1.5 rounded-md p-1.5 text-muted-foreground transition-opacity hover:bg-foreground/5 hover:text-foreground focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-ring",
            isPinned
              ? "opacity-70"
              : "opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
          )}
        >
          <Pin className={cn("size-3", isPinned && "fill-current")} />
        </button>
      </li>
    )
  }
  function section(title: string, count: number, children: React.ReactNode) {
    const id = `docs-nav-${title.toLowerCase().replaceAll(" ", "-")}`
    return (
      <section className="space-y-1.5">
        <button
          type="button"
          aria-expanded={!!expanded[title]}
          aria-controls={id}
          onClick={() => toggle(title)}
          className="group flex h-8 w-full items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span>{title}</span>
          <ChevronRight
            className={cn(
              "size-3 transition-transform",
              expanded[title] && "rotate-90"
            )}
          />
          <span className="ml-auto text-[10px] font-normal opacity-0 group-hover:opacity-70 group-focus-visible:opacity-70">
            {count}
          </span>
        </button>
        {expanded[title] && <div id={id}>{children}</div>}
      </section>
    )
  }
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-[72px] shrink-0 items-center gap-2 px-5">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex min-w-0 items-center gap-2 rounded-lg py-1 text-lg font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Portfolio UI
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-52">
            <DropdownMenuItem asChild>
              <Link to="/design-system" onClick={onNavigate}>
                Documentation
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/design-system/customization" onClick={onNavigate}>
                Customization guide
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/" onClick={onNavigate}>
                Back to portfolio
                <ArrowUpRight className="ml-auto size-3.5" />
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          type="button"
          onClick={onSearch}
          aria-label="Search documentation"
          className="ml-auto grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Search className="size-[18px]" strokeWidth={1.6} />
        </button>
      </div>
      <nav aria-label="Documentation" className="flex min-h-0 flex-1 flex-col">
        <ul className="space-y-1 px-3 pb-5">
          {row(
            { title: "Overview", href: "/design-system" },
            false,
            <PanelTop className="size-4 shrink-0" strokeWidth={1.6} />
          )}
          {row(
            { title: "Customization", href: "/design-system/customization" },
            false,
            <BookOpen className="size-4 shrink-0" strokeWidth={1.6} />
          )}
        </ul>
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 [scrollbar-width:thin] space-y-5 overflow-y-auto overscroll-contain px-3 pb-6"
        >
          {pinned.length > 0 &&
            section(
              "Pinned",
              pinned.length,
              <ul className="space-y-0.5">
                {pinned.map((href) => row(linksByHref.get(href)!))}
              </ul>
            )}
          {section(
            "Foundations",
            foundationLinks.length,
            <ul className="space-y-0.5">
              {foundationLinks.map((item) =>
                row(
                  item,
                  false,
                  <Shapes
                    className="size-4 shrink-0 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                )
              )}
            </ul>
          )}
          {section(
            "Components",
            componentEntries.length,
            <div className="space-y-1">
              {componentFolders.map((folder) => (
                <div key={folder.title}>
                  <button
                    type="button"
                    aria-expanded={!!expanded[folder.title]}
                    aria-controls={`docs-folder-${folder.title.replaceAll(" ", "-")}`}
                    onClick={() => toggle(folder.title)}
                    className="group flex h-9 w-full items-center gap-2.5 rounded-xl px-3 text-left text-[13px] text-foreground/80 hover:bg-foreground/[0.055] focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {expanded[folder.title] ? (
                      <FolderOpen
                        className="size-4 shrink-0"
                        strokeWidth={1.6}
                      />
                    ) : (
                      <Folder className="size-4 shrink-0" strokeWidth={1.6} />
                    )}
                    <span>{folder.title}</span>
                    <ChevronRight
                      className={cn(
                        "ml-auto size-3 text-muted-foreground opacity-0 transition-transform group-hover:opacity-100 group-focus-visible:opacity-100",
                        expanded[folder.title] && "rotate-90"
                      )}
                    />
                  </button>
                  {expanded[folder.title] && (
                    <ul
                      id={`docs-folder-${folder.title.replaceAll(" ", "-")}`}
                      className="space-y-0.5 py-1"
                    >
                      {folder.slugs
                        .map((slug) =>
                          componentEntries.find((entry) => entry.slug === slug)
                        )
                        .filter((entry) => !!entry)
                        .map((entry) =>
                          row(
                            {
                              title: entry.title,
                              href: `/design-system/components/${entry.slug}`,
                            },
                            true
                          )
                        )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
          {section(
            "Portfolio patterns",
            designSystemNav.custom.length,
            <ul className="space-y-0.5">
              {designSystemNav.custom.map((item) =>
                row(
                  item,
                  false,
                  <Layers3
                    className="size-4 shrink-0 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                )
              )}
            </ul>
          )}
          {recent.length > 0 &&
            section(
              "Recently viewed",
              recent.length,
              <ul className="space-y-0.5">
                {recent.map((href) => row(linksByHref.get(href)!))}
              </ul>
            )}
        </div>
      </nav>
      <div className="flex h-14 shrink-0 items-center gap-2.5 px-6 text-[11px] text-muted-foreground">
        <Component className="size-3.5" />
        <span>Local component library</span>
        <span className="ml-auto size-1.5 rounded-full bg-emerald-500/80" />
      </div>
    </div>
  )
}
