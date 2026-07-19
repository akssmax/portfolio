"use client"

import "@fontsource-variable/geist"
import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  Sparkles,
  MessageSquare,
  Plus,
  Mic,
  MicOff,
  ArrowUp,
  X,
  Search,
  Layout,
  Terminal,
  FileUser,
  Cpu,
  IndianRupee,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  PROMPT_LAYOUT_TRANSITION,
  promptHeightTransition,
} from "@/lib/motion-easing"

export const CHAT_PROMPT_SHARED_LAYOUT_ID = "chat-prompt-input-container"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import type { ProjectCard } from "@/lib/sanity/types"
import { getFallbackProjectCards } from "@/lib/sanity/fallback-projects"
import { getImageUrl } from "@/lib/sanity/image"
import { usesAvatarCardCover } from "@/lib/projects/project-card-placeholder"
import { toast } from "sonner"

const PLACEHOLDER_CYCLE_MS = 3000

const PROJECT_ICON_CONFIG: Record<
  string,
  | {
      Icon: React.ComponentType<{ className?: string }>
      bgGradient: string
      iconColor: string
    }
  | undefined
> = {
  rupeelens: {
    Icon: IndianRupee,
    bgGradient: "from-emerald-500/15 via-teal-500/5 to-transparent",
    iconColor: "text-emerald-700 dark:text-emerald-300",
  },
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
  placeholders?: readonly string[]
  disabled?: boolean
  loading?: boolean
  mode?: "gen-ui" | "chat"
  onModeChange?: (mode: "gen-ui" | "chat") => void
  isModeDisabled?: boolean
  projects?: ProjectCard[]
  tone?: "default" | "on-media"
  /** adaptive: ChatGPT-style pill when idle, full panel when active. */
  variant?: "adaptive" | "expanded" | "minimal"
}

type ChatPromptController = ReturnType<typeof useChatPromptInput>

function useChatPromptInput({
  value,
  onValueChange,
  onSubmit,
  placeholder = "Ask a question, type @ to attach projects...",
  placeholders,
  disabled = false,
  loading = false,
  mode: controlledMode,
  onModeChange,
  isModeDisabled = false,
  projects,
  variant = "adaptive",
}: ChatPromptInputProps) {
  const [internalMode, setInternalMode] = React.useState<"gen-ui" | "chat">("chat")
  const mode = controlledMode ?? internalMode

  const cyclingPlaceholders = React.useMemo(() => {
    if (placeholders && placeholders.length > 1) return placeholders
    return null
  }, [placeholders])

  const [placeholderIndex, setPlaceholderIndex] = React.useState(0)
  const showAnimatedPlaceholder =
    Boolean(cyclingPlaceholders) && !value.trim() && !disabled && !loading

  React.useEffect(() => {
    if (!cyclingPlaceholders || !showAnimatedPlaceholder) return
    const timer = window.setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % cyclingPlaceholders.length)
    }, PLACEHOLDER_CYCLE_MS)
    return () => window.clearInterval(timer)
  }, [cyclingPlaceholders, showAnimatedPlaceholder])

  const activePlaceholder =
    cyclingPlaceholders?.[placeholderIndex % cyclingPlaceholders.length] ?? placeholder

  const setMode = React.useCallback(
    (newMode: "gen-ui" | "chat") => {
      if (isModeDisabled) return
      if (controlledMode !== undefined) {
        onModeChange?.(newMode)
      } else {
        setInternalMode(newMode)
      }
    },
    [controlledMode, isModeDisabled, onModeChange],
  )

  const [isFocused, setIsFocused] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const voiceBaseValueRef = React.useRef("")
  const voiceFinalTranscriptRef = React.useRef("")

  const buildVoiceValue = React.useCallback((interim = "") => {
    const base = voiceBaseValueRef.current
    const final = voiceFinalTranscriptRef.current
    const spoken = `${final}${interim}`.trim()
    if (!base) return spoken
    if (!spoken) return base
    return `${base} ${spoken}`
  }, [])

  const { isSupported: isVoiceSupported, isListening, start: startVoice, stop: stopVoice } =
    useSpeechRecognition({
      onResult: (transcript, isFinal) => {
        if (isFinal) {
          voiceFinalTranscriptRef.current = `${voiceFinalTranscriptRef.current}${transcript}`
          onValueChange(buildVoiceValue())
          return
        }
        onValueChange(buildVoiceValue(transcript))
      },
      onError: (message) => {
        toast.error(message)
      },
    })

  const toggleVoiceInput = React.useCallback(() => {
    if (isListening) {
      stopVoice()
      return
    }

    voiceBaseValueRef.current = value.trim()
    voiceFinalTranscriptRef.current = ""
    const started = startVoice()
    if (started) {
      textareaRef.current?.focus()
    }
  }, [isListening, startVoice, stopVoice, value])

  React.useEffect(() => {
    if ((disabled || loading) && isListening) {
      stopVoice()
    }
  }, [disabled, isListening, loading, stopVoice])

  const [attachedProjects, setAttachedProjects] = React.useState<ProjectCard[]>([])
  const [showOverlay, setShowOverlay] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const isPlusTriggered = React.useRef(false)

  const allProjects = React.useMemo(() => projects ?? getFallbackProjectCards(), [projects])

  const filteredProjects = React.useMemo(() => {
    const unattached = allProjects.filter(
      (p) => !attachedProjects.some((ap) => ap._id === p._id),
    )
    if (!searchQuery) return unattached

    const query = searchQuery.toLowerCase()
    return unattached.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.tag.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query),
    )
  }, [allProjects, searchQuery, attachedProjects])

  const closeOverlay = React.useCallback(() => {
    setShowOverlay(false)
    setSearchQuery("")
    setSelectedIndex(0)
    isPlusTriggered.current = false
  }, [])

  const handleAttachProject = React.useCallback(
    (project: ProjectCard) => {
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
    },
    [closeOverlay, onValueChange, value],
  )

  const handlePlusClick = React.useCallback(() => {
    isPlusTriggered.current = true
    setShowOverlay(true)
    setSearchQuery("")
    setSelectedIndex(0)
    textareaRef.current?.focus()
  }, [])

  const handleFormSubmit = React.useCallback(() => {
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
    stopVoice()
  }, [attachedProjects, disabled, loading, mode, onSubmit, stopVoice, value])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (showOverlay) {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelectedIndex((prev) =>
            filteredProjects.length > 0 ? (prev + 1) % filteredProjects.length : 0,
          )
          return
        }
        if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelectedIndex((prev) =>
            filteredProjects.length > 0
              ? (prev - 1 + filteredProjects.length) % filteredProjects.length
              : 0,
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
    },
    [
      closeOverlay,
      filteredProjects,
      handleAttachProject,
      handleFormSubmit,
      selectedIndex,
      showOverlay,
    ],
  )

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value
      if (isListening) {
        stopVoice()
        voiceBaseValueRef.current = ""
        voiceFinalTranscriptRef.current = ""
      }
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
    },
    [isListening, onValueChange, stopVoice],
  )

  const handleFocus = React.useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleBlur = React.useCallback(() => {
    setIsFocused(false)
    setTimeout(() => {
      if (!isPlusTriggered.current) {
        closeOverlay()
      }
    }, 150)
  }, [closeOverlay])

  const showExpanded = variant === "expanded"
  const [isMultiline, setIsMultiline] = React.useState(false)

  React.useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const isMinimalSurface = variant !== "expanded"
    const maxHeight = isMinimalSurface ? 128 : 192
    const previousHeight = textarea.getBoundingClientRect().height

    textarea.style.height = "auto"
    const nextHeight = Math.min(textarea.scrollHeight, maxHeight)

    if (Math.abs(previousHeight - nextHeight) > 1) {
      textarea.style.height = `${previousHeight}px`
      void textarea.offsetHeight
    }

    textarea.style.height = `${nextHeight}px`
    setIsMultiline(isMinimalSurface && nextHeight > 30)
  }, [showExpanded, value, variant])

  const canSubmit = Boolean(value.trim() || attachedProjects.length > 0)

  return {
    mode,
    setMode,
    value,
    disabled,
    loading,
    isModeDisabled,
    isFocused,
    isVoiceSupported,
    isListening,
    toggleVoiceInput,
    attachedProjects,
    setAttachedProjects,
    showOverlay,
    closeOverlay,
    searchQuery,
    filteredProjects,
    selectedIndex,
    handleAttachProject,
    handlePlusClick,
    handleKeyDown,
    handleChange,
    handleFocus,
    handleBlur,
    handleFormSubmit,
    textareaRef,
    activePlaceholder,
    showAnimatedPlaceholder,
    showExpanded,
    isMultiline,
    canSubmit,
    placeholder,
  }
}

function ModeToggle({
  mode,
  setMode,
  disabled,
  loading,
  isModeDisabled,
  compact = false,
}: {
  mode: "gen-ui" | "chat"
  setMode: (mode: "gen-ui" | "chat") => void
  disabled?: boolean
  loading?: boolean
  isModeDisabled?: boolean
  compact?: boolean
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center bg-muted/60 p-0.5 border border-border/40",
        compact ? "rounded-full shadow-sm" : "rounded-lg",
      )}
    >
      <button
        type="button"
        disabled={isModeDisabled || disabled || loading}
        onClick={() => setMode("chat")}
        className={cn(
          "flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full font-semibold transition-[color,background-color,box-shadow] duration-250 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
          compact ? "px-2.5 py-1 text-[10px]" : "gap-1.5 rounded-md px-3 py-1.5 text-xs",
          mode === "chat"
            ? "bg-background text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <MessageSquare className={compact ? "size-3" : "size-3.5"} />
        Chat
      </button>
      <button
        type="button"
        disabled={isModeDisabled || disabled || loading}
        onClick={() => setMode("gen-ui")}
        className={cn(
          "flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full font-semibold transition-[color,background-color,box-shadow] duration-250 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
          compact ? "px-2.5 py-1 text-[10px]" : "gap-1.5 rounded-md px-3 py-1.5 text-xs",
          mode === "gen-ui"
            ? "bg-background text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Sparkles className={compact ? "size-3" : "size-3.5"} />
        Gen UI
      </button>
    </div>
  )
}

function ProjectContextOverlay({
  controller,
}: {
  controller: ChatPromptController
}) {
  if (!controller.showOverlay) return null

  return (
    <div
      className="absolute bottom-full left-0 right-0 z-40 mb-3.5 flex max-h-[300px] flex-col overflow-hidden rounded-2xl border border-border bg-card/95 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200"
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
        <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">
          Add Context
        </span>
        <button
          type="button"
          onClick={controller.closeOverlay}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2 border-b border-border/40 px-3 py-2 bg-muted/20">
        <Search className="size-4 text-muted-foreground shrink-0" />
        <input
          type="text"
          readOnly
          value={
            controller.searchQuery
              ? `@${controller.searchQuery}`
              : "Type to filter projects..."
          }
          className="w-full bg-transparent text-xs text-muted-foreground outline-hidden border-none select-none"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
        <div className="px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Projects ({controller.filteredProjects.length})
        </div>

        {controller.filteredProjects.length > 0 ? (
          controller.filteredProjects.map((project, idx) => {
            const isSelected = idx === controller.selectedIndex
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
                onClick={() => controller.handleAttachProject(project)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-all duration-150 cursor-pointer select-none",
                  isSelected
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted/40 text-foreground",
                )}
              >
                <div className="shrink-0 size-8.5 rounded border border-border/50 overflow-hidden flex items-center justify-center relative bg-muted/20">
                  {isAvatar ? (
                    <div
                      className={`w-full h-full bg-gradient-to-b ${bgGradient} flex items-center justify-center`}
                    >
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

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold truncate">{project.title}</span>
                    {project.featured ? (
                      <span
                        className="size-1.5 rounded-full bg-amber-500 shrink-0"
                        title="Featured"
                      />
                    ) : null}
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

      <div className="flex items-center gap-4 justify-between border-t border-border/50 px-4 py-2 bg-muted/30 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-0.5">
            <span className="font-mono bg-muted px-1 py-0.5 rounded border border-border/50">
              ↑↓
            </span>{" "}
            Navigate
          </span>
          <span className="flex items-center gap-0.5">
            <span className="font-mono bg-muted px-1 py-0.5 rounded border border-border/50">
              ↵
            </span>{" "}
            Select
          </span>
        </div>
        <span className="flex items-center gap-0.5">
          <span className="font-mono bg-muted px-1 py-0.5 rounded border border-border/50">
            esc
          </span>{" "}
          Close
        </span>
      </div>
    </div>
  )
}

function AttachedProjectPills({ controller }: { controller: ChatPromptController }) {
  if (controller.attachedProjects.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5 px-2 pt-1.5 border-b border-border/30 pb-2">
      {controller.attachedProjects.map((project) => {
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
                <div
                  className={`w-full h-full bg-gradient-to-b ${bgGradient} flex items-center justify-center scale-90`}
                >
                  <Icon className={cn("size-2.5", iconColor)} />
                </div>
              ) : coverUrl ? (
                <img src={coverUrl} className="w-full h-full object-cover" alt="" />
              ) : (
                <span className="text-[7px] font-bold text-primary">PJ</span>
              )}
            </div>
            <span className="max-w-[120px] truncate">{project.title}</span>
            <button
              type="button"
              onClick={() =>
                controller.setAttachedProjects((prev) =>
                  prev.filter((p) => p._id !== project._id),
                )
              }
              className="p-0.5 rounded-full hover:bg-primary/25 transition-colors cursor-pointer text-primary"
            >
              <X className="size-3" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

function ModeToggleShell({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div layout={false} className={className}>
      {children}
    </motion.div>
  )
}

function PromptLayoutSurface({
  className,
  children,
  sharedLayout = false,
}: {
  className?: string
  children: React.ReactNode
  sharedLayout?: boolean
}) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      layout
      layoutId={sharedLayout ? CHAT_PROMPT_SHARED_LAYOUT_ID : undefined}
      transition={PROMPT_LAYOUT_TRANSITION}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function PromptTextarea({
  controller,
  rows = 1,
  className,
  singleLine = false,
}: {
  controller: ChatPromptController
  rows?: number
  className?: string
  singleLine?: boolean
}) {
  const shouldReduceMotion = useReducedMotion()

  const surfaceClass = singleLine ? "min-h-5 py-0" : "min-h-10 py-1"
  const typographyClass = cn(
    "font-input-ui w-full text-sm leading-5",
    surfaceClass,
  )

  return (
    <div
      className={cn(
        "grid w-full [&>*]:col-start-1 [&>*]:row-start-1",
        singleLine ? "min-h-5" : "min-h-10",
        className,
      )}
    >
      {controller.showAnimatedPlaceholder ? (
        <div
          className={cn(
            "pointer-events-none overflow-hidden text-left text-muted-foreground/75",
            typographyClass,
          )}
          aria-hidden
        >
          {shouldReduceMotion ? (
            <span className="block truncate">{controller.activePlaceholder}</span>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={controller.activePlaceholder}
                className="block truncate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {controller.activePlaceholder}
              </motion.span>
            </AnimatePresence>
          )}
        </div>
      ) : null}
      <textarea
        ref={controller.textareaRef}
        value={controller.value}
        onChange={controller.handleChange}
        onKeyDown={controller.handleKeyDown}
        onFocus={controller.handleFocus}
        onBlur={controller.handleBlur}
        placeholder={
          controller.showAnimatedPlaceholder ? undefined : controller.placeholder
        }
        aria-label={controller.activePlaceholder}
        disabled={controller.disabled || controller.loading}
        rows={rows}
        className={cn(
          "relative z-[1] resize-none bg-transparent text-foreground outline-hidden placeholder:text-muted-foreground/75 overflow-y-auto",
          promptHeightTransition,
          typographyClass,
          singleLine ? "max-h-32" : "max-h-[12rem]",
        )}
      />
    </div>
  )
}

function VoiceButton({ controller }: { controller: ChatPromptController }) {
  return (
    <button
      type="button"
      onClick={controller.toggleVoiceInput}
      disabled={controller.disabled || controller.loading || !controller.isVoiceSupported}
      aria-pressed={controller.isListening}
      aria-label={
        !controller.isVoiceSupported
          ? "Voice input not supported in this browser"
          : controller.isListening
            ? "Stop voice input"
            : "Start voice input"
      }
      className={cn(
        "flex size-8 items-center justify-center rounded-full transition-all duration-250 cursor-pointer border border-border/40 disabled:cursor-not-allowed disabled:opacity-40 shrink-0",
        controller.isListening
          ? "bg-destructive/15 text-destructive border-destructive/20 hover:bg-destructive/25 animate-pulse"
          : "bg-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {controller.isListening ? (
        <MicOff className="size-4" />
      ) : (
        <Mic className="size-4" />
      )}
    </button>
  )
}

function SubmitButton({ controller }: { controller: ChatPromptController }) {
  return (
    <button
      type="button"
      onClick={controller.handleFormSubmit}
      disabled={
        controller.disabled || controller.loading || !controller.canSubmit
      }
      aria-label="Submit prompt"
      className={cn(
        "flex size-8 items-center justify-center rounded-full border transition-all duration-250 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0",
        controller.canSubmit
          ? "bg-primary text-primary-foreground border-transparent shadow-md shadow-primary/20 hover:scale-105 hover:bg-primary/95"
          : "border-border/40 bg-muted/60 text-muted-foreground",
      )}
    >
      <ArrowUp className="size-4" />
    </button>
  )
}

/** ChatGPT-style single-row pill — stays in this layout while typing in adaptive mode. */
export function ChatPromptInputMinimal({
  controller,
  onMedia = false,
  className,
}: {
  controller: ChatPromptController
  onMedia?: boolean
  className?: string
}) {
  return (
    <div className={cn("relative", className)}>
      <ModeToggleShell className="absolute bottom-full left-3 z-20 mb-2">
        <ModeToggle
          mode={controller.mode}
          setMode={controller.setMode}
          disabled={controller.disabled}
          loading={controller.loading}
          isModeDisabled={controller.isModeDisabled}
          compact
        />
      </ModeToggleShell>

      {controller.attachedProjects.length > 0 ? (
        <div className="mb-2 rounded-2xl border border-border/60 bg-background/90 p-1.5 shadow-sm backdrop-blur-sm">
          <AttachedProjectPills controller={controller} />
        </div>
      ) : null}

      <PromptLayoutSurface
        sharedLayout
        className={cn(
          "flex gap-1 rounded-[1.75rem] border px-2 py-1.5 shadow-sm transition-[border-color,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          controller.isMultiline ? "items-end" : "items-center",
          onMedia
            ? "border-border/70 bg-background/90 backdrop-blur-md dark:bg-card/70"
            : "border-border/60 bg-muted/35 backdrop-blur-sm dark:bg-muted/25",
          controller.isFocused && "border-primary dark:border-primary bg-background/95",
        )}
      >
        <button
          type="button"
          onClick={controller.handlePlusClick}
          disabled={controller.disabled || controller.loading}
          aria-label="Add project context"
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground cursor-pointer disabled:opacity-50"
        >
          <Plus className="size-4" />
        </button>

        <div
          className={cn(
            "relative flex min-w-0 flex-1 px-1",
            controller.isMultiline ? "items-end py-0.5" : "min-h-8 items-center",
          )}
        >
          <PromptTextarea controller={controller} rows={1} singleLine />
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <VoiceButton controller={controller} />
          <SubmitButton controller={controller} />
        </div>
      </PromptLayoutSurface>
    </div>
  )
}

/** Full-featured prompt panel with mode tabs, attachments, and action bar. */
export function ChatPromptInputExpanded({
  controller,
  onMedia = false,
  className,
}: {
  controller: ChatPromptController
  onMedia?: boolean
  className?: string
}) {
  return (
    <div className={cn("relative w-full", className)}>
      <ModeToggleShell className="absolute left-4 top-3 z-10">
        <ModeToggle
          mode={controller.mode}
          setMode={controller.setMode}
          disabled={controller.disabled}
          loading={controller.loading}
          isModeDisabled={controller.isModeDisabled}
        />
      </ModeToggleShell>

      <PromptLayoutSurface
        sharedLayout
        className={cn(
          "w-full flex flex-col gap-3 rounded-2xl bg-card/65 backdrop-blur-xl border border-border/80 p-2 pt-12 shadow-2xl transition-[border-color,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          onMedia &&
            "border-border/80 bg-background text-foreground shadow-2xl backdrop-blur-none dark:border-border/80 dark:bg-card/65 dark:backdrop-blur-xl",
          controller.isFocused && "border-primary dark:border-primary bg-card/85",
          controller.isFocused && onMedia && "bg-background dark:bg-card/85 dark:border-primary",
        )}
      >
        <AttachedProjectPills controller={controller} />

        <div className="relative flex flex-col px-2 pb-1.5">
        <PromptTextarea controller={controller} rows={1} />

        <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2">
          <button
            type="button"
            onClick={controller.handlePlusClick}
            disabled={controller.disabled || controller.loading}
            aria-label="Add project context"
            className="flex size-7.5 items-center justify-center rounded-lg border border-border/40 bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            <Plus className="size-4" />
          </button>

          <div className="flex items-center gap-2">
            <VoiceButton controller={controller} />
            <SubmitButton controller={controller} />
          </div>
        </div>
      </div>
      </PromptLayoutSurface>
    </div>
  )
}

export function ChatPromptInput({
  tone = "default",
  variant = "adaptive",
  className,
  ...props
}: ChatPromptInputProps) {
  const onMedia = tone === "on-media"
  const shouldReduceMotion = useReducedMotion()
  const controller = useChatPromptInput({ ...props, tone, variant })

  const showMinimal =
    variant === "minimal" || (variant === "adaptive" && !controller.showExpanded)

  return (
    <div className={cn("relative w-full max-w-2xl mx-auto", className)}>
      <ProjectContextOverlay controller={controller} />

      {shouldReduceMotion ? (
        showMinimal ? (
          <ChatPromptInputMinimal controller={controller} onMedia={onMedia} />
        ) : (
          <ChatPromptInputExpanded controller={controller} onMedia={onMedia} />
        )
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          {showMinimal ? (
            <motion.div
              key="minimal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, pointerEvents: "none" }}
              transition={{ duration: 0.15, ease: [0, 0, 0.2, 1] }}
            >
              <ChatPromptInputMinimal controller={controller} onMedia={onMedia} />
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, pointerEvents: "none" }}
              transition={{ duration: 0.15, ease: [0, 0, 0.2, 1] }}
            >
              <ChatPromptInputExpanded controller={controller} onMedia={onMedia} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
