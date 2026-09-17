import * as React from "react"

import { OsButton } from "@/components/landing-2/os-button"
import { OsWindow } from "@/components/landing-2/os-window"
import {
  DEFAULT_HERO_PROMPT_SUGGESTIONS,
  HERO_PLACEHOLDER_PROMPTS,
} from "@/lib/hero-prompt-suggestions"
import { cn } from "@/lib/utils"

type OsFindDialogProps = {
  onSubmitPrompt: (text: string) => void
  className?: string
  style?: React.CSSProperties
  inputRef?: React.Ref<HTMLInputElement>
}

export function OsFindDialog({
  onSubmitPrompt,
  className,
  style,
  inputRef,
}: OsFindDialogProps) {
  const [value, setValue] = React.useState("")
  const [placeholderIndex, setPlaceholderIndex] = React.useState(0)

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      setPlaceholderIndex((current) => (current + 1) % HERO_PLACEHOLDER_PROMPTS.length)
    }, 4000)
    return () => window.clearInterval(intervalId)
  }, [])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmitPrompt(trimmed)
  }

  return (
    <OsWindow
      title="Find File"
      className={cn("w-[min(32rem,calc(100vw-2rem))]", className)}
      style={style}
      tone="yellow"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-[10px] text-muted-foreground" htmlFor="landing-2-find">
          Ask this portfolio
        </label>
        <input
          id="landing-2-find"
          ref={inputRef}
          className="os-field h-11 w-full px-3 text-sm outline-none"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={HERO_PLACEHOLDER_PROMPTS[placeholderIndex]}
          autoComplete="off"
        />
        <div className="flex flex-wrap gap-1.5">
          {DEFAULT_HERO_PROMPT_SUGGESTIONS.map((item) => (
            <button
              key={item.label}
              type="button"
              className="border border-foreground bg-background px-2 py-1 text-[10px] hover:bg-foreground hover:text-background"
              onClick={() => onSubmitPrompt(item.query)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2">
          <OsButton type="submit" inverted>
            Find
          </OsButton>
        </div>
      </form>
    </OsWindow>
  )
}
