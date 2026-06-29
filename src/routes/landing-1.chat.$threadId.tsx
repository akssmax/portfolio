import { createFileRoute, Link } from "@tanstack/react-router"
import * as React from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import { motion } from "motion/react"
import { nanoid } from "nanoid"

import { ChatPromptInput } from "@/components/ui/chat-prompt-input"
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation"
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message"
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion"
import { MessageFeedbackBar } from "@/components/ai-elements/message-feedback-bar"
import { Sources, Source, SourcesContent } from "@/components/ai-elements/sources"
import { GenUiRenderer } from "@/components/ui/gen-ui-renderer"
import { streamChat } from "@/lib/llm/llm-service"
import { toast } from "sonner"
import { Shimmer } from "@/components/ai-elements/shimmer"
import { M3AnimatingAvatar } from "@/components/m3-shapes/m3-animating-avatar"

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

export const Route = createFileRoute("/landing-1/chat/$threadId")({
  component: ChatThreadPage,
})

function ChatThreadPage() {
  const { threadId } = Route.useParams()
  const [messages, setMessages] = React.useState<ThreadMessage[]>([])
  const [input, setInput] = React.useState("")
  const [mode, setMode] = React.useState<"gen-ui" | "chat">("chat")
  const [status, setStatus] = React.useState<"ready" | "streaming" | "error">("ready")
  const [openSources, setOpenSources] = React.useState<Record<string, boolean>>({})
  
  const abortRef = React.useRef<AbortController | null>(null)
  const isInitialTriggered = React.useRef(false)

  // Load thread from localStorage
  React.useEffect(() => {
    const key = `portfolio_thread_${threadId}`
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ThreadStore
        setMessages(parsed.messages)
        const lastUserMsg = [...parsed.messages].reverse().find(m => m.role === "user")
        if (lastUserMsg?.mode) {
          setMode(lastUserMsg.mode)
        }
      } catch {
        // ignore
      }
    } else {
      const newThread: ThreadStore = {
        id: threadId,
        createdAt: new Date().toISOString(),
        messages: [],
      }
      localStorage.setItem(key, JSON.stringify(newThread))
    }
  }, [threadId])

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
    currentMessages = messages
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

    const nextMessages = [...currentMessages, userMsg, assistantMsg]
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
      handleSendMessage(firstMsg.content, userMode, [])
    }
  }, [messages, handleSendMessage])

  return (
    <div className="flex-1 flex flex-col w-full min-h-0 bg-transparent">
      {/* Thread Header Bar */}
      <div className="sticky top-16 z-20 flex items-center justify-between border-b border-border/80 bg-background/80 backdrop-blur-md px-4 py-3 sm:px-6 w-full shrink-0">
        <Link 
          to="/landing-1" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all"
        >
          <ArrowLeft className="size-4" />
          Back to landing
        </Link>
        <span className="text-[10px] font-mono text-muted-foreground bg-muted/65 border border-border/40 px-2 py-0.5 rounded-md">
          Thread ID: {threadId}
        </span>
      </div>

      {/* Messages Scroll Area using Conversation and StickToBottom */}
      <div className="flex-1 min-h-0 relative flex flex-col w-full overflow-y-hidden">
        <Conversation className="flex-1 min-h-0 bg-transparent px-4 py-8 sm:px-6">
          <ConversationContent className="mx-auto w-full max-w-3xl space-y-8 min-w-0 pb-60">
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
                        <M3AnimatingAvatar className="size-8.5 shrink-0" />
                        <div className="flex-1 space-y-3 min-w-0">
                          {message.content ? (
                            <MessageContent className="prose dark:prose-invert max-w-none">
                              <MessageResponse>{message.content}</MessageResponse>
                            </MessageContent>
                          ) : !message.searching ? (
                            <div className="flex items-center gap-2 pt-1">
                              <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                              <Shimmer className="text-xs">Thinking…</Shimmer>
                            </div>
                          ) : null}

                          {/* Searching status block */}
                          {message.searching && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                              <Loader2 className="size-3.5 animate-spin" />
                              <span>Searching RAG database: &quot;{message.searchQuery}&quot;...</span>
                            </div>
                          )}

                          {/* Render citations/sources if available */}
                          {message.sources && message.sources.length > 0 && (
                            <div className="pt-1">
                              <Sources open={openSources[message.id] || false} onOpenChange={(open) => setOpenSources(prev => ({ ...prev, [message.id]: open }))}>
                                <SourcesContent className="bg-card/90 border border-border p-3 rounded-lg shadow-md mt-2 space-y-1.5">
                                  {message.sources.map((src, i) => (
                                    <Source key={i} href={src.href} title={src.title} className="block text-xs hover:text-primary transition-colors text-muted-foreground leading-normal" />
                                  ))}
                                </SourcesContent>
                              </Sources>
                            </div>
                          )}

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

                          {/* Feedback Bar & Copy action */}
                          {message.content && (
                            <div className="pt-2">
                              <MessageFeedbackBar
                                text={message.content}
                                feedback={message.feedback || null}
                                onFeedback={(rating) => handleFeedback(message.id, rating)}
                                showSources={message.sources && message.sources.length > 0}
                                onSources={() => setOpenSources(prev => ({ ...prev, [message.id]: !prev[message.id] }))}
                              />
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
          <ConversationScrollButton className="fixed bottom-32 right-8 z-20" />
        </Conversation>
      </div>

      {/* Floating Bottom Sticky Prompt Box */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-background via-background/90 to-transparent p-4 pb-6 w-full flex justify-center shrink-0">
        <motion.div 
          className="w-full max-w-2xl"
          layoutId="chat-prompt-input-container"
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
        >
          <ChatPromptInput
            value={input}
            onValueChange={setInput}
            onSubmit={(text) => handleSendMessage(text, mode)}
            mode={mode}
            onModeChange={setMode}
            isModeDisabled={status === "streaming"}
            disabled={status === "streaming"}
            loading={status === "streaming"}
            placeholder="Send a message or ask another prompt..."
          />
        </motion.div>
      </div>
    </div>
  )
}
