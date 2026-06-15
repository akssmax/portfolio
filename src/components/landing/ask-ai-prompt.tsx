"use client"

import { useCallback, useState } from "react"
import { motion, useReducedMotion } from "motion/react"

import { PromptInput } from "@/components/ai-elements/prompt-input"
import { Suggestion } from "@/components/ai-elements/suggestion"
import { usePortfolioChat } from "@/components/landing/portfolio-chat-provider"
import { getRandomHeroPromptSuggestions } from "@/lib/hero-prompt-suggestions"
import { cn } from "@/lib/utils"

type AskAiPromptProps = {
  className?: string
}

export function AskAiPrompt({ className }: AskAiPromptProps) {
  const shouldReduceMotion = useReducedMotion()
  const { openChatWithMessage } = usePortfolioChat()
  const [input, setInput] = useState("")
  const [suggestions] = useState(() => getRandomHeroPromptSuggestions())

  const openWithMessage = useCallback(
    (message: string) => {
      openChatWithMessage(message)
      setInput("")
    },
    [openChatWithMessage],
  )

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
          {suggestions.map((item) => (
            <Suggestion
              key={item.query}
              suggestion={item.label}
              onClick={() => handleSuggestion(item.query)}
              size="sm"
              className="h-7 shrink-0 rounded-full px-2.5 text-xs whitespace-nowrap"
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
