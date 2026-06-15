"use client"

import {
  createContext,
  lazy,
  Suspense,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

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
  }, [])

  const openChatWithMessage = useCallback((message: string) => {
    setInitialMessage(message)
    setOpen(true)
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

export function usePortfolioChat() {
  const context = useContext(PortfolioChatContext)
  if (!context) {
    throw new Error("usePortfolioChat must be used within PortfolioChatProvider")
  }
  return context
}
