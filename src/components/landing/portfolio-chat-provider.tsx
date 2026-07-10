"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import posthog from "posthog-js"

import { PortfolioChatSheet } from "@/components/landing/portfolio-chat-sheet"

type PortfolioChatContextValue = {
  openChat: () => void
  openChatWithMessage: (message: string) => void
}

const PortfolioChatContext = createContext<PortfolioChatContextValue | null>(null)

export function PortfolioChatProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [initialMessage, setInitialMessage] = useState<string | null>(null)
  const [sessionKey, setSessionKey] = useState(0)

  const openChat = useCallback(() => {
    setInitialMessage(null)
    setOpen(true)

    const key = import.meta.env.VITE_POSTHOG_KEY
    if (typeof window !== "undefined" && key) {
      try {
        posthog.capture("ai_panel_opened")
        posthog.startSessionRecording()
      } catch (err) {
        console.error("Failed to track ai_panel_opened:", err)
      }
    }
  }, [])

  const openChatWithMessage = useCallback((message: string) => {
    setInitialMessage(message)
    setOpen(true)

    const key = import.meta.env.VITE_POSTHOG_KEY
    if (typeof window !== "undefined" && key) {
      try {
        posthog.capture("ai_panel_opened", { initial_message: message })
        posthog.startSessionRecording()
      } catch (err) {
        console.error("Failed to track ai_panel_opened with message:", err)
      }
    }
  }, [])

  const value = useMemo(
    () => ({
      openChat,
      openChatWithMessage,
    }),
    [openChat, openChatWithMessage],
  )

  return (
    <PortfolioChatContext.Provider value={value}>
      {children}
      <PortfolioChatSheet
        key={sessionKey}
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) {
            setSessionKey((key) => key + 1)
          }
        }}
        initialMessage={initialMessage}
      />
    </PortfolioChatContext.Provider>
  )
}

const noopChatActions: PortfolioChatContextValue = {
  openChat: () => {},
  openChatWithMessage: () => {},
}

export function usePortfolioChat() {
  const context = useContext(PortfolioChatContext)
  if (!context) {
    if (typeof window === "undefined") {
      return noopChatActions
    }
    throw new Error("usePortfolioChat must be used within PortfolioChatProvider")
  }
  return context
}
