"use client"

import * as React from "react"
import { Sparkles, MessageSquare, Plus, Mic, MicOff, ArrowUp, X, Search, Layout, Terminal, FileUser, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProjectCard } from "@/lib/sanity/types"
import { getFallbackProjectCards } from "@/lib/sanity/fallback-projects"
import { getImageUrl } from "@/lib/sanity/image"
import { usesAvatarCardCover } from "@/lib/projects/project-card-placeholder"

const PROJECT_ICON_CONFIG: Record<
  string,
  | {
      Icon: React.ComponentType<{ className?: string }>
      bgGradient: string
      iconColor: string
    }
  | undefined
> = {
  "100x-landing-page": {
    Icon: Layout,
    bgGradient: "from-secondary/15 via-secondary/5 to-transparent",
    iconColor: "text-secondary-foreground",
  },
  "100x-chat-shell": {
    Icon: Terminal,
    bgGradient: "from-primary/15 via-primary/5 to-transparent",
    iconColor: "text-primary",
  },
  "resume-builder": {
    Icon: FileUser,
    bgGradient: "from-primary/15 via-primary/5 to-transparent",
    iconColor: "text-primary",
  },
  "v1-100x-proto": {
    Icon: Cpu,
    bgGradient: "from-accent/15 via-accent/5 to-transparent",
    iconColor: "text-accent-foreground",
  },
}

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
  projects?: ProjectCard[]
}

export function ChatPromptInput({
  value,
  onValueChange,
  onSubmit,
  placeholder = "Ask a question, type @ to attach projects...",
  disabled = false,
  loading = false,
  mode: controlledMode,
  onModeChange,
  isModeDisabled = false,
  projects,
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

  // Context overlay state
  const [attachedProjects, setAttachedProjects] = React.useState<ProjectCard[]>([])
  const [showOverlay, setShowOverlay] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const isPlusTriggered = React.useRef(false)

  // Load fallback projects if none provided as prop
  const allProjects = React.useMemo(() => {
    return projects ?? getFallbackProjectCards()
  }, [projects])

  // Filter projects for the overlay search
  const filteredProjects = React.useMemo(() => {
    const unattached = allProjects.filter(
      (p) => !attachedProjects.some((ap) => ap._id === p._id)
    )
    if (!searchQuery) return unattached

    const query = searchQuery.toLowerCase()
    return unattached.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.tag.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    )
  }, [allProjects, searchQuery, attachedProjects])

  const handleAttachProject = (project: ProjectCard) => {
    setAttachedProjects((prev) => {
      if (prev.some((p) => p._id === project._id)) return prev
      return [...prev, project]
    })

    const textarea = textareaRef.current
    if (textarea) {
      const val = value
      const selectionStart = textarea.selectionStart

      if (isPlusTriggered.current) {
        onValueChange("")
      } else {
        const textBeforeCursor = val.slice(0, selectionStart)
        const textAfterCursor = val.slice(selectionStart)
        const match = textBeforeCursor.match(/@(\w*)$/)
        if (match) {
          const replaceStart = selectionStart - match[0].length
          const newVal = val.slice(0, replaceStart) + textAfterCursor
          onValueChange(newVal)
          setTimeout(() => {
            textarea.selectionStart = replaceStart
            textarea.selectionEnd = replaceStart
          }, 10)
        }
      }
    }

    closeOverlay()
  }

  const closeOverlay = () => {
    setShowOverlay(false)
    setSearchQuery("")
    setSelectedIndex(0)
    isPlusTriggered.current = false
  }

  const handlePlusClick = () => {
    isPlusTriggered.current = true
    setShowOverlay(true)
    setSearchQuery("")
    setSelectedIndex(0)
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showOverlay) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) =>
          filteredProjects.length > 0 ? (prev + 1) % filteredProjects.length : 0
        )
        return
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) =>
          filteredProjects.length > 0
            ? (prev - 1 + filteredProjects.length) % filteredProjects.length
            : 0
        )
        return
      }
      if (e.key === "Enter") {
        e.preventDefault()
        if (filteredProjects.length > 0 && selectedIndex < filteredProjects.length) {
          handleAttachProject(filteredProjects[selectedIndex])
        }
        return
      }
      if (e.key === "Escape") {
        e.preventDefault()
        closeOverlay()
        return
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleFormSubmit()
    }
  }

  const handleFormSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed && attachedProjects.length === 0) return
    if (disabled || loading) return

    let submissionText = trimmed
    if (attachedProjects.length > 0) {
      const contextStr = attachedProjects
        .map((p) => `[Context: ${p.title} (slug: ${p.slug})]`)
        .join("\n")
      submissionText = trimmed
        ? `${trimmed}\n\nAttached Context:\n${contextStr}`
        : `Attached Context:\n${contextStr}`
    }

    onSubmit(submissionText, mode)
    setAttachedProjects([])
  }

  // Auto-resize textarea heights
  React.useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = "auto"
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [value])

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Context Overlay */}
      {showOverlay && (
        <div
          className="absolute bottom-full left-0 right-0 mb-3.5 z-35 flex flex-col max-h-[300px] rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200"
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
            <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">
              Add Context
            </span>
            <button
              type="button"
              onClick={closeOverlay}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 border-b border-border/40 px-3 py-2 bg-muted/20">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              readOnly
              value={searchQuery ? `@${searchQuery}` : "Type to filter projects..."}
              className="w-full bg-transparent text-xs text-muted-foreground outline-hidden border-none select-none"
            />
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Projects ({filteredProjects.length})
            </div>

            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, idx) => {
                const isSelected = idx === selectedIndex
                const coverUrl = project.coverImageUrl ?? getImageUrl(project.coverImage, 200)
                const isAvatar = usesAvatarCardCover(project.workSection)
                const config = PROJECT_ICON_CONFIG[project.slug] || {
                  Icon: Sparkles,
                  bgGradient: "from-primary/10 to-transparent",
                  iconColor: "text-primary",
                }
                const { Icon, bgGradient, iconColor } = config

                return (
                  <button
                    key={project._id}
                    type="button"
                    onClick={() => handleAttachProject(project)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-all duration-150 cursor-pointer select-none",
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted/40 text-foreground"
                    )}
                  >
                    {/* Thumbnail / Icon preview */}
                    <div className="shrink-0 size-8.5 rounded border border-border/50 overflow-hidden flex items-center justify-center relative bg-muted/20">
                      {isAvatar ? (
                        <div className={`w-full h-full bg-gradient-to-b ${bgGradient} flex items-center justify-center`}>
                          <Icon className={cn("size-4.5", iconColor)} />
                        </div>
                      ) : coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[9px] font-bold uppercase text-muted-foreground">
                          {project.tag.slice(0, 2)}
                        </span>
                      )}
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold truncate">
                          {project.title}
                        </span>
                        {project.featured && (
                          <span className="size-1.5 rounded-full bg-amber-500 shrink-0" title="Featured" />
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {project.tag} • {project.description}
                      </p>
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="text-center py-6 text-xs text-muted-foreground">
                No matching projects found
              </div>
            )}
          </div>

          {/* Footer instructions */}
          <div className="flex items-center gap-4 justify-between border-t border-border/50 px-4 py-2 bg-muted/30 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-0.5">
                <span className="font-mono bg-muted px-1 py-0.5 rounded border border-border/50">↑↓</span> Navigate
              </span>
              <span className="flex items-center gap-0.5">
                <span className="font-mono bg-muted px-1 py-0.5 rounded border border-border/50">↵</span> Select
              </span>
            </div>
            <span className="flex items-center gap-0.5">
              <span className="font-mono bg-muted px-1 py-0.5 rounded border border-border/50">esc</span> Close
            </span>
          </div>
        </div>
      )}

      {/* Main input box */}
      <div
        className={cn(
          "w-full flex flex-col gap-3 rounded-2xl bg-card/65 backdrop-blur-xl border border-border/80 p-2 shadow-2xl transition-all duration-300",
          isFocused && "border-accent ring-2 ring-accent/20 bg-card/85",
          className
        )}
        {...props}
      >
        {/* Pills container for attached projects context */}
        {attachedProjects.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-2 pt-1.5 border-b border-border/30 pb-2">
            {attachedProjects.map((project) => {
              const coverUrl = project.coverImageUrl ?? getImageUrl(project.coverImage, 100)
              const isAvatar = usesAvatarCardCover(project.workSection)
              const config = PROJECT_ICON_CONFIG[project.slug] || {
                Icon: Sparkles,
                bgGradient: "from-primary/10 to-transparent",
                iconColor: "text-primary",
              }
              const { Icon, bgGradient, iconColor } = config

              return (
                <div
                  key={project._id}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 dark:bg-primary/20 border border-primary/20 pl-1.5 pr-1 py-0.5 text-xs text-primary font-medium"
                >
                  <div className="size-4.5 rounded overflow-hidden flex items-center justify-center border border-primary/30 shrink-0 bg-background/55">
                    {isAvatar ? (
                      <div className={`w-full h-full bg-gradient-to-b ${bgGradient} flex items-center justify-center scale-90`}>
                        <Icon className={cn("size-2.5", iconColor)} />
                      </div>
                    ) : coverUrl ? (
                      <img
                        src={coverUrl}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    ) : (
                      <span className="text-[7px] font-bold text-primary">PJ</span>
                    )}
                  </div>
                  <span className="max-w-[120px] truncate">{project.title}</span>
                  <button
                    type="button"
                    onClick={() => setAttachedProjects((prev) => prev.filter((p) => p._id !== project._id))}
                    className="p-0.5 rounded-full hover:bg-primary/25 transition-colors cursor-pointer text-primary"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              )
            })}
          </div>
        )}

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
            onChange={(e) => {
              const val = e.target.value
              onValueChange(val)

              const selectionStart = e.target.selectionStart
              const textBeforeCursor = val.slice(0, selectionStart)
              const match = textBeforeCursor.match(/@(\w*)$/)
              if (match) {
                setShowOverlay(true)
                setSearchQuery(match[1])
                setSelectedIndex(0)
              } else if (isPlusTriggered.current) {
                setSearchQuery(val)
                setSelectedIndex(0)
              } else {
                setShowOverlay(false)
              }
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false)
              // Handle escape overlay blur safely
              setTimeout(() => {
                if (!isPlusTriggered.current) {
                  closeOverlay()
                }
              }, 150)
            }}
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
              onClick={handlePlusClick}
              disabled={disabled || loading}
              aria-label="Add project context"
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
                disabled={disabled || loading || (!value.trim() && attachedProjects.length === 0)}
                aria-label="Submit prompt"
                className={cn(
                  "flex size-7.5 items-center justify-center rounded-full border border-border/40 transition-all duration-250 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
                  value.trim() || attachedProjects.length > 0
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
    </div>
  )
}
