import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronDown, Loader2, Sparkles, Search, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type ChainOfThoughtState = "thinking" | "completed" | "error"

export interface ChainOfThoughtProps {
  state?: ChainOfThoughtState
  content?: string
  durationSeconds?: number
  searchQuery?: string
  toolCalls?: Array<{
    name: string
    arguments: string
    result?: string
    error?: string
  }>
  className?: string
}

export function ChainOfThought({
  state = "thinking",
  content,
  durationSeconds,
  searchQuery,
  toolCalls = [],
  className,
}: ChainOfThoughtProps) {
  const [isOpen, setIsOpen] = React.useState(state === "thinking")
  const [showArgs, setShowArgs] = React.useState<Record<number, boolean>>({})

  // Auto-open on thinking, auto-close or toggle otherwise
  React.useEffect(() => {
    if (state === "thinking") {
      setIsOpen(true)
    }
  }, [state])

  const hasContent = Boolean(content || searchQuery || toolCalls.length > 0)

  // Compute status summary label
  const getHeaderLabel = () => {
    if (state === "thinking") {
      if (searchQuery) return `Searching: "${searchQuery}"`
      if (toolCalls.length > 0 && !toolCalls[toolCalls.length - 1].result) {
        return `Calling tool: ${toolCalls[toolCalls.length - 1].name}`
      }
      return "Thinking…"
    }
    if (state === "error") return "Thinking error"
    
    // Completed state
    const elapsed = durationSeconds ? `${durationSeconds.toFixed(1)}s` : ""
    const checked = searchQuery ? "checked database" : ""
    const toolsRun = toolCalls.length > 0 ? `ran ${toolCalls.length} tool${toolCalls.length > 1 ? "s" : ""}` : ""
    
    const elements = [elapsed, checked, toolsRun].filter(Boolean)
    return elements.length > 0 ? `Thought process (${elements.join(" • ")})` : "Thought process"
  }

  return (
    <div
      className={cn(
        "w-full rounded-xl border border-border/85 bg-muted/20 overflow-hidden transition-all duration-300",
        state === "thinking" && "border-primary/20 bg-primary/2",
        className
      )}
    >
      {/* Header Bar */}
      <button
        type="button"
        disabled={!hasContent && state !== "thinking"}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 text-left text-xs font-medium text-muted-foreground select-none transition-colors",
          hasContent && "hover:bg-muted/40 hover:text-foreground cursor-pointer"
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {state === "thinking" ? (
            <div className="relative flex items-center justify-center size-4 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/30 opacity-75" />
              <Loader2 className="size-3.5 animate-spin text-primary relative z-10" />
            </div>
          ) : state === "error" ? (
            <AlertCircle className="size-3.5 text-destructive shrink-0" />
          ) : (
            <Sparkles className="size-3.5 text-primary shrink-0" />
          )}
          <span className="truncate font-medium">{getHeaderLabel()}</span>
        </div>

        {hasContent && (
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform duration-200 text-muted-foreground/60 group-hover:text-foreground",
              isOpen && "rotate-180"
            )}
          />
        )}
      </button>

      {/* Expanded Accordion Body */}
      <AnimatePresence initial={false}>
        {isOpen && hasContent && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="px-4 pb-4 pt-1.5 border-t border-border/40 text-xs text-muted-foreground/90 space-y-3.5 select-text">
              {/* RAG search query path */}
              {searchQuery && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-background/50 border border-border/50">
                  <Search className="size-3 text-primary shrink-0" />
                  <span className="font-mono text-[10px] truncate">
                    RAG Grounding Query: <span className="text-foreground font-semibold">&quot;{searchQuery}&quot;</span>
                  </span>
                </div>
              )}

              {/* Tool Calls progress logs */}
              {toolCalls.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-foreground/80 uppercase tracking-wider">Tool Execution Logs</p>
                  <div className="space-y-1.5">
                    {toolCalls.map((tc, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "flex items-start gap-2.5 p-2 rounded-lg bg-background/30 border border-border/40 font-mono text-[10px]",
                          tc.error && "border-destructive/30 bg-destructive/5"
                        )}
                      >
                        {tc.result || state === "completed" ? (
                          <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        ) : tc.error ? (
                          <AlertCircle className="size-3.5 text-destructive shrink-0 mt-0.5" />
                        ) : (
                          <Loader2 className="size-3.5 text-primary animate-spin shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground">
                            call: {tc.name}()
                          </p>
                          {tc.arguments && (
                            <>
                              <button
                                type="button"
                                onClick={() => setShowArgs((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                                className="text-[9px] text-primary/75 hover:underline mt-0.5 cursor-pointer block"
                              >
                                {showArgs[idx] ? "Hide arguments" : "View arguments"}
                              </button>
                              {showArgs[idx] && (
                                <pre className="text-[9px] text-muted-foreground/75 mt-1 overflow-x-auto p-1.5 bg-muted/50 border border-border/40 rounded max-w-full whitespace-pre-wrap break-all">
                                  {tc.arguments}
                                </pre>
                              )}
                            </>
                          )}
                          {tc.error && (
                            <p className="text-destructive mt-1 font-semibold">{tc.error}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reasoning Thought Text Block */}
              {content && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-foreground/80 uppercase tracking-wider">Thoughts</p>
                  <div className="leading-relaxed whitespace-pre-wrap font-sans text-muted-foreground pl-1.5 border-l-2 border-primary/20">
                    {content}
                  </div>
                </div>
              )}

              {/* Shimmer placeholders if model is still typing the thought block */}
              {state === "thinking" && !content && (
                <div className="space-y-2 pt-1 animate-pulse">
                  <div className="h-3 w-1/3 bg-muted/50 rounded-sm" />
                  <div className="space-y-1.5 pl-1.5 border-l-2 border-primary/10">
                    <div className="h-3 w-full bg-muted/55 rounded-sm" />
                    <div className="h-3 w-5/6 bg-muted/55 rounded-sm" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


