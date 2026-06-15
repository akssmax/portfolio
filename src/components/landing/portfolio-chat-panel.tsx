"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { UIMessage } from "ai"
import type { ChatStatus } from "ai"
import { ArrowLeft, BotIcon, XIcon } from "lucide-react"
import { nanoid } from "nanoid"
import { toast } from "sonner"

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
  getMessageText,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import { MessageFeedbackBar } from "@/components/ai-elements/message-feedback-bar"
import { PromptInput } from "@/components/ai-elements/prompt-input"
import { Shimmer } from "@/components/ai-elements/shimmer"
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources"
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion"
import { Button } from "@/components/ui/button"
import {
  DrawerClose,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { ChatItem } from "@/lib/llm/chat-types"
import { streamChat } from "@/lib/llm/llm-service"
import type { MistralModel } from "@/lib/llm/llm-types"
import {
  getRandomHeroPromptSuggestions,
  type HeroPromptSuggestion,
} from "@/lib/hero-prompt-suggestions"

const CHAT_MODEL: MistralModel = "mistral-small-latest"

type PortfolioChatPanelProps = {
  open: boolean
  initialMessage?: string | null
  layout: "mobile" | "desktop"
}

function createTextMessage(role: UIMessage["role"], text: string): UIMessage {
  const id = nanoid()
  return {
    id,
    role,
    parts: [{ type: "text", text }],
  }
}

function toApiMessages(items: ChatItem[]): Array<{ role: "user" | "assistant"; content: string }> {
  return items
    .map((item) => ({
      role: item.message.role,
      content: getMessageText(item.message),
    }))
    .filter(
      (item): item is { role: "user" | "assistant"; content: string } =>
        (item.role === "user" || item.role === "assistant") && item.content.trim().length > 0,
    )
}

function ChatPanelHeader({
  layout,
}: {
  layout: "mobile" | "desktop"
}) {
  const title = "Ask about Akshay"
  const CloseWrapper = layout === "mobile" ? DrawerClose : SheetClose

  if (layout === "mobile") {
    return (
      <DrawerHeader className="relative shrink-0 flex-row items-center gap-0 border-b px-4 py-3 ps-14 pe-4">
        <CloseWrapper asChild>
          <Button
            variant="ghost"
            size="sm"
            className="absolute start-2 top-1/2 -translate-y-1/2 gap-1.5 px-2"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
        </CloseWrapper>
        <DrawerTitle className="w-full text-center text-base">{title}</DrawerTitle>
      </DrawerHeader>
    )
  }

  return (
    <SheetHeader className="relative shrink-0 flex-row items-center justify-center border-b px-4 py-3 pe-14">
      <SheetTitle className="text-center">{title}</SheetTitle>
      <CloseWrapper asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute end-4 top-1/2 -translate-y-1/2"
          aria-label="Close"
        >
          <XIcon />
        </Button>
      </CloseWrapper>
    </SheetHeader>
  )
}

export function PortfolioChatPanel({
  open,
  initialMessage,
  layout,
}: PortfolioChatPanelProps) {
  const [items, setItems] = useState<ChatItem[]>([])
  const [input, setInput] = useState("")
  const [status, setStatus] = useState<ChatStatus>("ready")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [starterSuggestions, setStarterSuggestions] = useState<HeroPromptSuggestion[]>(
    () => getRandomHeroPromptSuggestions(),
  )
  const abortRef = useRef<AbortController | null>(null)
  const pendingInitialRef = useRef<string | null>(null)
  const rafRef = useRef<number | null>(null)
  const tokenBufferRef = useRef("")

  const flushTokens = useCallback((assistantId: string) => {
    if (!tokenBufferRef.current) return
    const batch = tokenBufferRef.current
    tokenBufferRef.current = ""
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== assistantId) return item
        const current = getMessageText(item.message)
        return {
          ...item,
          message: createTextMessage("assistant", current + batch),
        }
      }),
    )
  }, [])

  const scheduleTokenFlush = useCallback(
    (assistantId: string) => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        flushTokens(assistantId)
      })
    },
    [flushTokens],
  )

  const sendMessage = useCallback(
    async (rawText: string) => {
      const text = rawText.trim()
      if (!text || status === "streaming" || status === "submitted") return

      setSuggestions([])
      setStatus("submitted")

      const userItem: ChatItem = {
        id: nanoid(),
        message: createTextMessage("user", text),
      }
      const assistantId = nanoid()
      const assistantItem: ChatItem = {
        id: assistantId,
        message: createTextMessage("assistant", ""),
      }

      const nextItems = [...items, userItem, assistantItem]
      setItems(nextItems)
      setInput("")
      setStatus("streaming")

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        await streamChat({
          model: CHAT_MODEL,
          messages: toApiMessages(nextItems.slice(0, -1)),
          signal: controller.signal,
          onToken: (token) => {
            tokenBufferRef.current += token
            scheduleTokenFlush(assistantId)
          },
          onSuggestions: (next) => setSuggestions(next),
          onSources: (sources) => {
            setItems((prev) =>
              prev.map((item) =>
                item.id === assistantId
                  ? { ...item, meta: { ...item.meta, sources } }
                  : item,
              ),
            )
          },
          onCitations: (citations) => {
            setItems((prev) =>
              prev.map((item) =>
                item.id === assistantId
                  ? { ...item, meta: { ...item.meta, citations } }
                  : item,
              ),
            )
          },
          onComplete: () => {
            flushTokens(assistantId)
            setStatus("ready")
          },
        })
      } catch (error) {
        if (controller.signal.aborted) {
          flushTokens(assistantId)
          setStatus("ready")
          return
        }
        const message = error instanceof Error ? error.message : "Something went wrong."
        toast.error(message)
        setItems((prev) => prev.filter((item) => item.id !== assistantId))
        setStatus("error")
        setTimeout(() => setStatus("ready"), 300)
      }
    },
    [flushTokens, items, scheduleTokenFlush, status],
  )

  useEffect(() => {
    if (!open || !initialMessage?.trim()) return
    if (pendingInitialRef.current === initialMessage) return
    pendingInitialRef.current = initialMessage
    void sendMessage(initialMessage)
  }, [initialMessage, open, sendMessage])

  useEffect(() => {
    if (!open) {
      pendingInitialRef.current = null
      abortRef.current?.abort()
      setStatus("ready")
      return
    }

    if (items.length === 0 && !initialMessage?.trim()) {
      setStarterSuggestions(getRandomHeroPromptSuggestions())
    }
  }, [initialMessage, items.length, open])

  const handleStop = useCallback(() => {
    abortRef.current?.abort()
    setStatus("ready")
  }, [])

  const handleFeedback = useCallback((messageId: string, rating: "up" | "down") => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === messageId
          ? { ...item, meta: { ...item.meta, feedback: rating } }
          : item,
      ),
    )
  }, [])

  const lastAssistantId =
    [...items].reverse().find((item) => item.message.role === "assistant")?.id ?? null

  const showFollowUpSuggestions = suggestions.length > 0
  const showStarterSuggestions = items.length === 0 && !showFollowUpSuggestions

  return (
    <>
      <ChatPanelHeader layout={layout} />

      <Conversation className="min-h-0 flex-1">
        <ConversationContent>
          {items.length === 0 ? (
            <ConversationEmptyState
              icon={<BotIcon className="size-8" />}
              title="Ask me anything"
              description="Try questions about projects, design systems, or why you should hire Akshay."
            />
          ) : (
            items.map((item) => {
              const text = getMessageText(item.message)
              const isAssistant = item.message.role === "assistant"
              const isStreamingEmpty = isAssistant && !text && status === "streaming"
              const isLatestAssistant = isAssistant && item.id === lastAssistantId
              const showFeedbackBar =
                isAssistant &&
                Boolean(text.trim()) &&
                !(isLatestAssistant && status === "streaming")

              return (
                <Message key={item.id} from={item.message.role}>
                  <MessageContent>
                    {isStreamingEmpty ? (
                      <Shimmer className="text-sm">Thinking…</Shimmer>
                    ) : isAssistant ? (
                      <MessageResponse
                        isAnimating={isLatestAssistant && status === "streaming"}
                      >
                        {text}
                      </MessageResponse>
                    ) : (
                      text
                    )}
                    {item.meta?.sources && item.meta.sources.length > 0 ? (
                      <Sources defaultOpen={false}>
                        <SourcesTrigger count={item.meta.sources.length} />
                        <SourcesContent>
                          {item.meta.sources.map((source) => (
                            <Source
                              key={source.href}
                              href={source.href}
                              title={source.title}
                            />
                          ))}
                        </SourcesContent>
                      </Sources>
                    ) : null}
                  </MessageContent>
                  {showFeedbackBar ? (
                    <MessageFeedbackBar
                      text={text}
                      feedback={item.meta?.feedback ?? null}
                      onFeedback={(rating) => handleFeedback(item.id, rating)}
                    />
                  ) : null}
                </Message>
              )
            })
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="shrink-0 space-y-3 border-t p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {showFollowUpSuggestions ? (
          <Suggestions>
            {suggestions.map((suggestion) => (
              <Suggestion
                key={suggestion}
                suggestion={suggestion}
                onClick={(value) => void sendMessage(value)}
              />
            ))}
          </Suggestions>
        ) : null}
        {showStarterSuggestions ? (
          <Suggestions>
            {starterSuggestions.map((item) => (
              <Suggestion
                key={item.query}
                suggestion={item.label}
                onClick={() => void sendMessage(item.query)}
              />
            ))}
          </Suggestions>
        ) : null}
        <PromptInput
          value={input}
          onValueChange={setInput}
          onSubmit={(value) => void sendMessage(value)}
          onStop={handleStop}
          status={status}
          placeholder={items.length === 0 ? "Why hire Akshay?" : "Ask a follow-up…"}
        />
      </div>
    </>
  )
}
