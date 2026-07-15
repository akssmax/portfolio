import { createFileRoute, useLocation } from "@tanstack/react-router"
import * as React from "react"
import { X } from "lucide-react"
import { nanoid } from "nanoid"

import { ChatPromptInput } from "@/components/ui/chat-prompt-input"
import { useFullMotion } from "@/hooks/use-can-animate"
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation"
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message"
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion"
import { MessageFeedbackBar } from "@/components/ai-elements/message-feedback-bar"
import { Source } from "@/components/ai-elements/sources"
import { GenUiRenderer } from "@/components/ui/gen-ui-renderer"
import { streamChat } from "@/lib/llm/llm-service"
import { toast } from "sonner"
import { M3AnimatingAvatar } from "@/components/m3-shapes/m3-animating-avatar"
import { ChainOfThought } from "@/components/ai-elements/chain-of-thought"

type ThreadMessage = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  mode?: "gen-ui" | "chat"
  toolCalls?: Array<{
    name: string
    arguments: string
    result?: string
  }>
  citations?: Array<{ href: string; label: string }>
  sources?: Array<{ href: string; title: string }>
  searching?: boolean
  searchQuery?: string
  suggestions?: string[]
  feedback?: "up" | "down" | null
}

type ThreadStore = {
  id: string
  createdAt: string
  messages: ThreadMessage[]
}

type ChatThreadNavigationState = {
  initialPrompt?: string
  mode?: "gen-ui" | "chat"
}

export const Route = createFileRoute("/_landing/chat/$threadId")({
  component: ChatThreadPage,
})

function ChatThreadPage() {
  const { threadId } = Route.useParams()
  const location = useLocation()
  const fullMotion = useFullMotion()
  const [messages, setMessages] = React.useState<ThreadMessage[]>([])
  const [input, setInput] = React.useState("")
  const [mode, setMode] = React.useState<"gen-ui" | "chat">("chat")
  const [status, setStatus] = React.useState<"ready" | "streaming" | "error">("ready")
  const [openSources, setOpenSources] = React.useState<Record<string, boolean>>({})
  
  const abortRef = React.useRef<AbortController | null>(null)
  const isInitialTriggered = React.useRef(false)

  // Load thread from localStorage, with router-state fallback for fresh navigations.
  React.useEffect(() => {
    const key = `portfolio_thread_${threadId}`
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ThreadStore
        if (parsed.messages.length > 0) {
          setMessages(parsed.messages)
          const lastUserMsg = [...parsed.messages].reverse().find((m) => m.role === "user")
          if (lastUserMsg?.mode) {
            setMode(lastUserMsg.mode)
          }
          return
        }
      } catch {
        // ignore malformed cache and fall through to navigation state
      }
    }

    const navState = location.state as ChatThreadNavigationState | undefined
    const initialPrompt = navState?.initialPrompt?.trim()
    if (initialPrompt) {
      const seededThread: ThreadStore = {
        id: threadId,
        createdAt: new Date().toISOString(),
        messages: [
          {
            id: nanoid(),
            role: "user",
            content: initialPrompt,
            mode: navState?.mode ?? "chat",
          },
        ],
      }
      try {
        localStorage.setItem(key, JSON.stringify(seededThread))
      } catch {
        // ignore storage failures — in-memory state still boots the thread
      }
      setMessages(seededThread.messages)
      setMode(navState?.mode ?? "chat")
      return
    }

    const newThread: ThreadStore = {
      id: threadId,
      createdAt: new Date().toISOString(),
      messages: [],
    }
    try {
      localStorage.setItem(key, JSON.stringify(newThread))
    } catch {
      // ignore
    }
  }, [location.state, threadId])

  // Save messages to localStorage
  const saveThread = React.useCallback((updatedMessages: ThreadMessage[]) => {
    const key = `portfolio_thread_${threadId}`
    const stored = localStorage.getItem(key)
    let createdAt = new Date().toISOString()
    if (stored) {
      try {
        createdAt = (JSON.parse(stored) as ThreadStore).createdAt
      } catch {
        // ignore
      }
    }
    const updatedStore: ThreadStore = {
      id: threadId,
      createdAt,
      messages: updatedMessages,
    }
    localStorage.setItem(key, JSON.stringify(updatedStore))
  }, [threadId])

  // Handle recorded feedback
  const handleFeedback = (messageId: string, rating: "up" | "down") => {
    setMessages((prev) => {
      const updated = prev.map((m) =>
        m.id === messageId ? { ...m, feedback: rating } : m
      )
      saveThread(updated)
      return updated
    })
    toast.success("Feedback recorded, thank you!")
  }

  // stream submit
  const handleSendMessage = React.useCallback(async (
    text: string,
    selectedMode: "gen-ui" | "chat",
    currentMessages = messages,
    options?: { skipUserMessage?: boolean },
  ) => {
    if (!text.trim() || status === "streaming") return

    const userMsg: ThreadMessage = {
      id: nanoid(),
      role: "user",
      content: text,
      mode: selectedMode,
    }

    const assistantId = nanoid()
    const assistantMsg: ThreadMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
    }

    const nextMessages = options?.skipUserMessage
      ? [...currentMessages, assistantMsg]
      : [...currentMessages, userMsg, assistantMsg]
    setMessages(nextMessages)
    saveThread(nextMessages)
    setInput("")
    setStatus("streaming")

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const apiMessages = nextMessages.slice(0, -1).map((m) => ({
      role: m.role,
      content: m.content,
      ...(m.toolCalls && m.toolCalls.length > 0
        ? {
            tool_calls: m.toolCalls.map((tc, idx) => ({
              id: `call_${m.id}_${idx}`,
              type: "function" as const,
              function: {
                name: tc.name,
                arguments: tc.arguments,
              },
            })),
          }
        : {}),
    }))

    try {
      let buffer = ""
      let finalSuggestions: string[] = []
      await streamChat({
        model: "mistral-small-latest",
        messages: apiMessages,
        mode: selectedMode,
        signal: controller.signal,
        onToken: (token) => {
          buffer += token
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: buffer } : m))
          )
        },
        onToolDelta: (deltas) => {
          setMessages((prev) =>
            prev.map((m) => {
              if (m.id !== assistantId) return m
              const existingCalls = m.toolCalls ? [...m.toolCalls] : []
              for (const delta of deltas) {
                const idx = delta.index ?? 0
                if (!existingCalls[idx]) {
                  existingCalls[idx] = {
                    name: delta.function?.name || "",
                    arguments: "",
                  }
                }
                if (delta.function?.name) {
                  existingCalls[idx].name = delta.function.name
                }
                if (delta.function?.arguments) {
                  existingCalls[idx].arguments += delta.function.arguments
                }
              }
              return { ...m, toolCalls: existingCalls }
            })
          )
        },
        onSuggestions: (next) => {
          finalSuggestions = next
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, suggestions: next } : m))
          )
        },
        onSources: (sources) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, sources } : m))
          )
        },
        onCitations: (citations) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, citations } : m))
          )
        },
        onToolStart: (payload) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    searching: true,
                    searchQuery: payload.query || "analyzing system RAG details",
                    toolCalls: [
                      ...(m.toolCalls || []),
                      { name: payload.name, arguments: JSON.stringify({ query: payload.query }) },
                    ],
                  }
                : m
            )
          )
        },
        onToolEnd: (payload) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    searching: false,
                    toolCalls: m.toolCalls?.map((tc) =>
                      tc.name === payload.name
                        ? { ...tc, result: payload.result, error: payload.error }
                        : tc
                    ),
                  }
                : m
            )
          )
        },
        onComplete: () => {
          setStatus("ready")
          setMessages((prev) => {
            const final = prev.map((m) =>
              m.id === assistantId ? { ...m, content: buffer, suggestions: finalSuggestions } : m
            )
            saveThread(final)
            return final
          })
        },
      })
    } catch (err) {
      if (controller.signal.aborted) {
        setStatus("ready")
        return
      }
      toast.error(err instanceof Error ? err.message : "Response stream failed.")
      setStatus("error")
      setMessages((prev) => prev.filter((m) => m.id !== assistantId))
      setTimeout(() => setStatus("ready"), 500)
    }
  }, [messages, status, saveThread])

  // trigger initial message
  React.useEffect(() => {
    if (messages.length === 1 && messages[0].role === "user" && !isInitialTriggered.current) {
      isInitialTriggered.current = true
      const firstMsg = messages[0]
      const userMode = firstMsg.mode || "chat"
      setMode(userMode)
      void handleSendMessage(firstMsg.content, userMode, messages, {
        skipUserMessage: true,
      })
    }
  }, [messages, handleSendMessage])

  return (
    <div className="flex-1 flex flex-col w-full min-h-0 bg-transparent">
      {/* Messages Scroll Area using Conversation and StickToBottom */}
      <div className="flex-1 min-h-0 relative flex flex-col w-full overflow-y-hidden">
        <Conversation className="flex-1 min-h-0 bg-transparent px-4 py-8 sm:px-6">
          <ConversationContent className="mx-auto w-full max-w-3xl space-y-8 min-w-0 pb-8">
            {messages.map((message, msgIdx) => {
              const isUser = message.role === "user"
              return (
                <div key={message.id} className="w-full flex flex-col">
                  <Message from={message.role} className="w-full">
                    {/* User Message Layout */}
                    {isUser ? (
                      <MessageContent className="bg-primary text-primary-foreground select-text">
                        {message.content}
                      </MessageContent>
                    ) : (
                      /* Assistant Message Layout */
                      <div className="flex gap-3 items-start select-text w-full">
                        <M3AnimatingAvatar className="size-8.5 shrink-0 max-md:hidden" />
                        <div className="flex-1 space-y-3 min-w-0">
                          {/* Chain of Thought accordion */}
                          {(message.searching || (message.toolCalls && message.toolCalls.length > 0) || !message.content) && (
                            <ChainOfThought
                              state={
                                status === "streaming" && msgIdx === messages.length - 1
                                  ? "thinking"
                                  : "completed"
                              }
                              searchQuery={message.searching ? message.searchQuery : undefined}
                              toolCalls={message.toolCalls}
                            />
                          )}

                          {message.content && (
                            <MessageContent className="prose dark:prose-invert max-w-none">
                              <MessageResponse>{message.content}</MessageResponse>
                            </MessageContent>
                          )}

                          {/* Sources are now rendered as a floating popover overlay relative to the feedback bar below */}

                          {/* Render custom Gen UI components if tools completed */}
                          {message.toolCalls && message.toolCalls.length > 0 && (
                            <div className="space-y-3 pt-2">
                              {message.toolCalls.map((tc, idx) => (
                                <GenUiRenderer
                                  key={idx}
                                  name={tc.name}
                                  argumentsJson={tc.arguments}
                                  isStreaming={status === "streaming" && msgIdx === messages.length - 1}
                                />
                              ))}
                            </div>
                          )}

                          {/* Feedback Bar & Copy action with absolute-positioned sources popup overlay */}
                          {message.content && (
                            <div className="pt-2 relative">
                              <MessageFeedbackBar
                                text={message.content}
                                feedback={message.feedback || null}
                                onFeedback={(rating) => handleFeedback(message.id, rating)}
                                showSources={message.sources && message.sources.length > 0}
                                onSources={() => setOpenSources(prev => ({ ...prev, [message.id]: !prev[message.id] }))}
                              />

                              {openSources[message.id] && message.sources && message.sources.length > 0 && (
                                <div className="absolute bottom-full left-0 mb-2.5 z-30 w-72 rounded-xl border border-border bg-card/95 p-3.5 shadow-xl backdrop-blur-md flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
                                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                      Used {message.sources.length} sources
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setOpenSources(prev => ({ ...prev, [message.id]: false }))}
                                      className="rounded-md p-0.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors cursor-pointer"
                                    >
                                      <X className="size-3.5" />
                                    </button>
                                  </div>
                                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                                    {message.sources.map((src, i) => (
                                      <Source
                                        key={i}
                                        href={src.href}
                                        title={src.title}
                                        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-all duration-150"
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Dynamic Vercel AI suggestions */}
                          {message.suggestions && message.suggestions.length > 0 && (
                            <div className="pt-2">
                              <Suggestions className="pt-1">
                                {message.suggestions.map((sug) => (
                                  <Suggestion
                                    key={sug}
                                    suggestion={sug}
                                    onClick={() => handleSendMessage(sug, mode)}
                                  />
                                ))}
                              </Suggestions>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Message>
                </div>
              )
            })}
          </ConversationContent>
          <ConversationScrollButton className="absolute bottom-4 right-4 md:right-auto md:left-1/2 md:translate-x-[300px] z-20" />
        </Conversation>
      </div>

      {/* Static flex-flow Bottom Prompt Box */}
      <div className="bg-gradient-to-t from-background via-background/90 to-transparent p-4 pb-6 w-full flex justify-center shrink-0 border-t border-border/20 z-10">
        {fullMotion ? (
          <div className="w-full max-w-2xl" style={{ pointerEvents: "auto" }}>
            <ChatPromptInput
              value={input}
              onValueChange={setInput}
              onSubmit={(text) => handleSendMessage(text, mode)}
              mode={mode}
              onModeChange={setMode}
              isModeDisabled={status === "streaming"}
              disabled={status === "streaming"}
              loading={status === "streaming"}
              placeholder="Ask anything..."
            />
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            <ChatPromptInput
              value={input}
              onValueChange={setInput}
              onSubmit={(text) => handleSendMessage(text, mode)}
              mode={mode}
              onModeChange={setMode}
              isModeDisabled={status === "streaming"}
              disabled={status === "streaming"}
              loading={status === "streaming"}
              placeholder="Ask anything..."
            />
          </div>
        )}
      </div>
    </div>
  )
}
