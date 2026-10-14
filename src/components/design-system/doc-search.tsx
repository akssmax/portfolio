import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { ArrowUpRight, BookOpen, Component, Search } from "lucide-react"
import { allDocEntries, designSystemNav } from "@/lib/design-system-registry"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

export function DocSearch({
  open: controlledOpen,
  onOpenChange,
  hideTrigger = false,
  onNavigate,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  hideTrigger?: boolean
  onNavigate?: () => void
} = {}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen
  const navigate = useNavigate()
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, setOpen])
  function select(href: string) {
    setOpen(false)
    onNavigate?.()
    void navigate({ to: href })
  }
  return (
    <>
      {!hideTrigger && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-9 w-full items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground shadow-xs transition-colors hover:border-muted-foreground/50 focus-visible:outline-2 focus-visible:outline-ring"
          aria-label="Search documentation"
        >
          <Search className="size-3.5" />
          <span className="flex-1 text-left text-xs">Search docs…</span>
          <kbd className="rounded border border-border px-1 font-mono text-[10px]">
            ⌘ K
          </kbd>
        </button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="gap-0 overflow-hidden p-1 sm:max-w-xl"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Search documentation</DialogTitle>
          <DialogDescription className="sr-only">
            Find foundations, UI components, and portfolio patterns. Use arrow
            keys to navigate and Enter to open.
          </DialogDescription>
          <Command>
            <CommandInput placeholder="Search components, tokens, guides…" />
            <CommandList className="max-h-[60vh]">
              <CommandEmpty>
                No results. Try “button”, “colors”, or “customization”.
              </CommandEmpty>
              <CommandGroup heading="Foundations">
                {designSystemNav.foundations.map((item) => (
                  <CommandItem
                    key={item.href}
                    value={item.title}
                    keywords={
                      item.href === "/design-system/animation"
                        ? [
                            "motion",
                            "easing",
                            "transitions",
                            "spring",
                            "SVG",
                            "GSAP",
                            "canvas",
                            "WebGPU",
                          ]
                        : undefined
                    }
                    onSelect={() => select(item.href)}
                  >
                    <BookOpen className="size-4" />
                    {item.title}
                    <ArrowUpRight className="ml-auto size-3 text-muted-foreground" />
                  </CommandItem>
                ))}
              </CommandGroup>
              {(["components", "custom"] as const).map((category) => (
                <CommandGroup
                  key={category}
                  heading={
                    category === "components"
                      ? "Components"
                      : "Portfolio patterns"
                  }
                >
                  {allDocEntries
                    .filter((entry) => entry.category === category)
                    .map((entry) => (
                      <CommandItem
                        key={entry.slug}
                        value={`${entry.title} ${entry.description}`}
                        onSelect={() =>
                          select(`/design-system/components/${entry.slug}`)
                        }
                      >
                        <Component className="size-4" />
                        <span>{entry.title}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {category === "custom" ? "Pattern" : "Component"}
                        </span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
          <div className="flex justify-between border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
            <span>↑ ↓ to navigate · ↵ to open</span>
            <span>esc to close</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
