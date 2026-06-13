"use client"

import { useState } from "react"
import { BotIcon } from "lucide-react"

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AiConversationDemo() {
  return (
    <Card className="h-80">
      <CardHeader>
        <CardTitle>Conversation</CardTitle>
        <CardDescription>Scrollable message log with stick-to-bottom behavior.</CardDescription>
      </CardHeader>
      <CardContent className="h-52 p-0">
        <Conversation className="h-full rounded-lg border">
          <ConversationContent>
            <ConversationEmptyState
              icon={<BotIcon className="size-6" />}
              title="No messages yet"
            />
          </ConversationContent>
        </Conversation>
      </CardContent>
    </Card>
  )
}

export function AiMessageDemo() {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null)
  const sampleText =
    "Akshay brings 8 years of product design experience across fintech, devtools, and agentic AI."

  return (
    <div className="flex flex-col gap-4">
      <Message from="user">
        <MessageContent>Why should we hire Akshay?</MessageContent>
      </Message>
      <Message from="assistant">
        <MessageContent>
          <MessageResponse>{sampleText}</MessageResponse>
        </MessageContent>
        <MessageFeedbackBar
          text={sampleText}
          feedback={feedback}
          onFeedback={setFeedback}
        />
      </Message>
    </div>
  )
}

export function AiPromptInputDemo() {
  const [value, setValue] = useState("Tell me about the Kodo project")
  return (
    <PromptInput
      value={value}
      onValueChange={setValue}
      onSubmit={() => undefined}
      placeholder="Ask a question…"
    />
  )
}

export function AiSuggestionDemo() {
  return (
    <Suggestions>
      <Suggestion suggestion="Why hire Akshay?" onClick={() => undefined} />
      <Suggestion suggestion="Kodo case study" onClick={() => undefined} />
      <Suggestion suggestion="Design systems work" onClick={() => undefined} />
    </Suggestions>
  )
}

export function AiSourcesDemo() {
  return (
    <Sources defaultOpen>
      <SourcesTrigger count={2} />
      <SourcesContent>
        <Source href="/projects/kodo" title="Project: kodo" />
        <Source href="/about" title="About Akshay Saini" />
      </SourcesContent>
    </Sources>
  )
}

export function AiShimmerDemo() {
  return <Shimmer className="text-sm">Thinking…</Shimmer>
}

export function AiElementsDemo() {
  return (
    <div className="space-y-8">
      <AiConversationDemo />
      <AiMessageDemo />
      <AiPromptInputDemo />
      <AiSuggestionDemo />
      <AiSourcesDemo />
      <AiShimmerDemo />
    </div>
  )
}
