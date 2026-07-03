"use client"

import { CheckIcon, CopyIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"
import { useCallback, useState } from "react"
import { toast } from "sonner"

import { MessageAction, MessageActions } from "@/components/ai-elements/message"
import { cn } from "@/lib/utils"

export type MessageFeedback = "up" | "down"

export type MessageFeedbackBarProps = {
  className?: string
  text?: string
  feedback?: MessageFeedback | null
  showSources?: boolean
  onFeedback?: (rating: MessageFeedback) => void
  onSources?: () => void
}

export function MessageFeedbackBar({
  className,
  text,
  feedback = null,
  showSources = false,
  onFeedback,
  onSources,
}: MessageFeedbackBarProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    if (!text?.trim()) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success("Copied to clipboard")
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy message")
    }
  }, [text])

  return (
    <MessageActions
      className={cn(
        "w-fit items-center gap-1 rounded-xl border border-border/70 bg-card/80 p-1 shadow-xs backdrop-blur supports-[backdrop-filter]:bg-card/65",
        className,
      )}
    >
      <MessageAction
        tooltip="Copy message"
        label="Copy message"
        variant="ghost"
        size="icon-sm"
        className="rounded-lg text-muted-foreground hover:bg-muted/70 hover:text-foreground"
        onClick={() => void handleCopy()}
        disabled={!text?.trim()}
      >
        {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
      </MessageAction>
      <MessageAction
        tooltip="Helpful"
        label="Helpful"
        variant="ghost"
        size="icon-sm"
        aria-pressed={feedback === "up"}
        className={cn(
          "rounded-lg text-muted-foreground hover:bg-emerald-500/12 hover:text-emerald-600 dark:hover:text-emerald-400",
          feedback === "up" && "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
        )}
        onClick={() => onFeedback?.("up")}
      >
        <ThumbsUpIcon className="size-4" />
      </MessageAction>
      <MessageAction
        tooltip="Not helpful"
        label="Not helpful"
        variant="ghost"
        size="icon-sm"
        aria-pressed={feedback === "down"}
        className={cn(
          "rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
          feedback === "down" && "bg-destructive/10 text-destructive",
        )}
        onClick={() => onFeedback?.("down")}
      >
        <ThumbsDownIcon className="size-4" />
      </MessageAction>
      {showSources ? (
        <MessageAction
          tooltip="View sources"
          label="View sources"
          variant="outline"
          size="sm"
          className="ml-1 rounded-lg border-border/80 bg-background/55 text-muted-foreground hover:bg-muted/70 hover:text-foreground px-2.5 transition-colors"
          onClick={onSources}
        >
          <span className="px-1 text-xs font-medium">Sources</span>
        </MessageAction>
      ) : null}
    </MessageActions>
  )
}
