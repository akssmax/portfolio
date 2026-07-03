"use client"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"
import type { ChatStatus } from "ai"
import { CornerDownLeftIcon, SquareIcon } from "lucide-react"
import type {
  ComponentProps,
  FormEvent,
  KeyboardEvent,
} from "react"
import { useCallback, useRef } from "react"

export type PromptInputProps = Omit<ComponentProps<"form">, "onSubmit" | "onChange"> & {
  value: string
  onValueChange: (value: string) => void
  onSubmit: (value: string) => void
  onStop?: () => void
  status?: ChatStatus
  placeholder?: string
  disabled?: boolean
  singleLine?: boolean
  minRows?: number
  maxRows?: number
}

export function PromptInput({
  value,
  onValueChange,
  onSubmit,
  onStop,
  status = "ready",
  placeholder = "Ask a question…",
  disabled = false,
  singleLine = false,
  minRows = 1,
  maxRows = 4,
  className,
  ...props
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isStreaming = status === "streaming" || status === "submitted"
  const canSubmit = value.trim().length > 0 && !disabled && !isStreaming

  const handleSubmit = useCallback(
    (event?: FormEvent) => {
      event?.preventDefault()
      const trimmed = value.trim()
      if (!trimmed || isStreaming || disabled) return
      onSubmit(trimmed)
    },
    [disabled, isStreaming, onSubmit, value],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit],
  )

  const addonAlign = singleLine ? "inline-end" : "block-end"

  return (
    <form
      className={cn("w-full", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <InputGroup>
        {singleLine ? (
          <InputGroupInput
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isStreaming}
            aria-label="Chat message"
          />
        ) : (
          <InputGroupTextarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isStreaming}
            rows={minRows}
            className="min-h-[2.5rem] max-h-[12rem] resize-none overflow-y-auto"
            aria-label="Chat message"
          />
        )}
        <InputGroupAddon
          align={addonAlign}
          className={singleLine ? undefined : "justify-end"}
        >
          {isStreaming ? (
            <InputGroupButton
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={onStop}
              aria-label="Stop generating"
            >
              <SquareIcon className="size-3.5" />
            </InputGroupButton>
          ) : (
            <InputGroupButton
              type="submit"
              variant="default"
              size="icon-sm"
              disabled={!canSubmit}
              aria-label="Send message"
            >
              <CornerDownLeftIcon className="size-3.5" />
            </InputGroupButton>
          )}
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
