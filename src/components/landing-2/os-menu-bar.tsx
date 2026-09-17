import { OsBrandMark } from "@/components/landing-2/os-brand-mark"
import { OsButton } from "@/components/landing-2/os-button"
import { cn } from "@/lib/utils"

const NAV = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
] as const

type OsMenuBarProps = {
  name: string
  onAskAi?: () => void
  className?: string
}

export function OsMenuBar({ name, onAskAi, className }: OsMenuBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b-2 border-foreground bg-background px-3 py-2 sm:px-5",
        className,
      )}
    >
      <div className="relative flex items-center justify-between gap-3">
        <a href="#top" className="inline-flex items-center gap-2 text-xs tracking-wide">
          <OsBrandMark />
          <span>{name}</span>
        </a>
        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-4 text-xs sm:flex"
          aria-label="Landing sections"
        >
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="hover:underline">
              {item.label}
            </a>
          ))}
        </nav>
        <OsButton inverted onClick={onAskAi}>
          Ask AI
        </OsButton>
      </div>
      <nav
        className="mt-2 flex items-center justify-center gap-4 text-xs sm:hidden"
        aria-label="Landing sections"
      >
        {NAV.map((item) => (
          <a key={item.href} href={item.href} className="hover:underline">
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
