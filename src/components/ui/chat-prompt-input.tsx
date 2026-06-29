"use client"

import * as React from "react"
import { Sparkles, MessageSquare, Plus, Mic, MicOff, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

export type ChatPromptInputProps = Omit<React.ComponentProps<"div">, "onSubmit"> & {
  value: string
  onValueChange: (value: string) => void
  onSubmit: (value: string, mode: "gen-ui" | "chat") => void
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  mode?: "gen-ui" | "chat"
  onModeChange?: (mode: "gen-ui" | "chat") => void
  isModeDisabled?: boolean
}

export function ChatPromptInput({
  value,
  onValueChange,
  onSubmit,
  placeholder = "Describe your idea we will bring to life...",
  disabled = false,
  loading = false,
  mode: controlledMode,
  onModeChange,
  isModeDisabled = false,
  className,
  ...props
}: ChatPromptInputProps) {
  const [internalMode, setInternalMode] = React.useState<"gen-ui" | "chat">("chat")
  const mode = controlledMode ?? internalMode
  
  const setMode = (newMode: "gen-ui" | "chat") => {
    if (isModeDisabled) return
    if (controlledMode !== undefined) {
      onModeChange?.(newMode)
    } else {
      setInternalMode(newMode)
    }
  }

  const [isFocused, setIsFocused] = React.useState(false)
  const [isMicActive, setIsMicActive] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleFormSubmit()
    }
  }

  const handleFormSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled || loading) return
    onSubmit(trimmed, mode)
  }

  // Auto-resize textarea heights
  React.useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = "auto"
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [value])

  return (
    <div
      className={cn(
        "w-full max-w-2xl mx-auto flex flex-col gap-3 rounded-2xl bg-card/65 backdrop-blur-xl border border-border/80 p-2 shadow-2xl transition-all duration-300",
        isFocused && "border-accent ring-2 ring-accent/20 bg-card/85",
        className
      )}
      {...props}
    >
      {/* Mode Segmented Tabs */}
      <div className="flex items-center gap-1.5 self-start px-2 pt-1">
        <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border/40">
          <button
            type="button"
            disabled={isModeDisabled || disabled || loading}
            onClick={() => setMode("chat")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-250 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
              mode === "chat"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MessageSquare className="size-3.5" />
            Chat
          </button>
          <button
            type="button"
            disabled={isModeDisabled || disabled || loading}
            onClick={() => setMode("gen-ui")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-250 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
              mode === "gen-ui"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sparkles className="size-3.5" />
            Gen UI
          </button>
        </div>
      </div>

      {/* Main Input Textarea */}
      <div className="relative flex flex-col px-2 pb-1.5">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled || loading}
          rows={2}
          className="w-full resize-none bg-transparent text-sm text-foreground outline-hidden placeholder:text-muted-foreground/75 min-h-[3rem] max-h-[12rem] py-1 line-clamp-6 leading-relaxed"
        />

        {/* Action bar inside the prompt box */}
        <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2">
          {/* Left: Attachment + button */}
          <button
            type="button"
            disabled={disabled || loading}
            aria-label="Add attachment"
            className="flex size-7.5 items-center justify-center rounded-lg border border-border/40 bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            <Plus className="size-4" />
          </button>

          {/* Right: Mic & Submit arrow */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMicActive(!isMicActive)}
              disabled={disabled || loading}
              aria-label={isMicActive ? "Disable voice mode" : "Enable voice mode"}
              className={cn(
                "flex size-7.5 items-center justify-center rounded-full transition-all duration-250 cursor-pointer border border-border/40",
                isMicActive
                  ? "bg-destructive/15 text-destructive border-destructive/20 hover:bg-destructive/25 animate-pulse"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {isMicActive ? <MicOff className="size-3.5" /> : <Mic className="size-3.5" />}
            </button>

            <button
              type="button"
              onClick={handleFormSubmit}
              disabled={disabled || loading || !value.trim()}
              aria-label="Submit prompt"
              className={cn(
                "flex size-7.5 items-center justify-center rounded-full border border-border/40 transition-all duration-250 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
                value.trim()
                  ? "bg-primary text-primary-foreground border-transparent shadow-md shadow-primary/20 hover:scale-105 hover:bg-primary/95"
                  : "bg-muted/60 text-muted-foreground"
              )}
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
