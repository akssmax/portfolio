"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { UIMessage } from "ai"
import type { ChatStatus } from "ai"
import { BotIcon } from "lucide-react"
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
import { PromptInput } from "@/components/ai-elements/prompt-input"
import { Shimmer } from "@/components/ai-elements/shimmer"
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources"
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { ChatItem } from "@/lib/llm/chat-types"
import { streamChat } from "@/lib/llm/llm-service"
import type { MistralModel } from "@/lib/llm/llm-types"

const CHAT_MODEL: MistralModel = "mistral-small-latest"

type PortfolioChatSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialMessage?: string | null
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

export function PortfolioChatSheet({
  open,
  onOpenChange,
  initialMessage,
}: PortfolioChatSheetProps) {
  const [items, setItems] = useState<ChatItem[]>([])
  const [input, setInput] = useState("")
  const [status, setStatus] = useState<ChatStatus>("ready")
  const [suggestions, setSuggestions] = useState<string[]>([])
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
    }
  }, [open])

  const handleStop = useCallback(() => {
    abortRef.current?.abort()
    setStatus("ready")
  }, [])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b px-4 py-4">
          <SheetTitle>Ask about Akshay</SheetTitle>
          <SheetDescription>
            AI assistant grounded in portfolio projects, experience, and skills.
          </SheetDescription>
        </SheetHeader>

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

                return (
                  <Message key={item.id} from={item.message.role}>
                    <MessageContent>
                      {isStreamingEmpty ? (
                        <Shimmer className="text-sm">Thinking…</Shimmer>
                      ) : isAssistant ? (
                        <MessageResponse isAnimating={status === "streaming"}>
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
                  </Message>
                )
              })
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="space-y-3 border-t p-4">
          {suggestions.length > 0 ? (
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
          <PromptInput
            value={input}
            onValueChange={setInput}
            onSubmit={(value) => void sendMessage(value)}
            onStop={handleStop}
            status={status}
            placeholder="Ask a follow-up…"
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
