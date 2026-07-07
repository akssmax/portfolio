"use client"

import {
  Suspense,
  createContext,
  lazy,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import posthog from "posthog-js"

const PortfolioChatSheet = lazy(() =>
  import("@/components/landing/portfolio-chat-sheet").then((module) => ({
    default: module.PortfolioChatSheet,
  })),
)

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
    setSessionKey((key) => key + 1)
    setOpen(true)

    // Track AI panel open and ensure session recording starts
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

    // Track AI panel open with context and ensure session recording starts
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
      <Suspense fallback={null}>
        <PortfolioChatSheet
          key={sessionKey}
          open={open}
          onOpenChange={setOpen}
          initialMessage={initialMessage}
        />
      </Suspense>
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
