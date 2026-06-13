"use client"

import { useCallback, useState } from "react"
import { motion, useReducedMotion } from "motion/react"

import { PromptInput } from "@/components/ai-elements/prompt-input"
import { PortfolioChatSheet } from "@/components/landing/portfolio-chat-sheet"
import { Suggestion } from "@/components/ai-elements/suggestion"
import { cn } from "@/lib/utils"

const HERO_SUGGESTIONS = [
  { label: "Why hire?", query: "Why should we hire Akshay?" },
  { label: "About Kodo", query: "Tell me about the Kodo project" },
  { label: "Design systems", query: "What design systems experience does Akshay have?" },
] as const

type AskAiPromptProps = {
  className?: string
}

export function AskAiPrompt({ className }: AskAiPromptProps) {
  const shouldReduceMotion = useReducedMotion()
  const [input, setInput] = useState("")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [initialMessage, setInitialMessage] = useState<string | null>(null)

  const openWithMessage = useCallback((message: string) => {
    setInitialMessage(message)
    setSheetOpen(true)
    setInput("")
  }, [])

  const handleSubmit = useCallback(
    (value: string) => {
      openWithMessage(value)
    },
    [openWithMessage],
  )

  const handleSuggestion = useCallback(
    (suggestion: string) => {
      openWithMessage(suggestion)
    },
    [openWithMessage],
  )

  return (
    <>
      <motion.div
        className={cn("mt-4 max-w-lg", className)}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        aria-label="Ask AI about Akshay's portfolio"
      >
        <div className="space-y-2">
          <PromptInput
            value={input}
            onValueChange={setInput}
            onSubmit={handleSubmit}
            placeholder="Why hire Akshay?"
            singleLine
          />
          <div className="flex flex-wrap gap-1.5">
            {HERO_SUGGESTIONS.map((item) => (
              <Suggestion
                key={item.label}
                suggestion={item.label}
                onClick={() => handleSuggestion(item.query)}
                size="sm"
                className="h-7 rounded-full px-2.5 text-xs"
              />
            ))}
          </div>
        </div>
      </motion.div>

      <PortfolioChatSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        initialMessage={initialMessage}
      />
    </>
  )
}
