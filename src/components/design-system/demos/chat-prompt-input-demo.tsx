"use client"

import * as React from "react"
import { ChatPromptInput } from "@/components/ui/chat-prompt-input"
import { toast } from "sonner"

export function ChatInputDemo() {
  const [val1, setVal1] = React.useState("")
  const [val2, setVal2] = React.useState("")
  const [lastSubmission, setLastSubmission] = React.useState<{
    text: string
    mode: "gen-ui" | "chat"
  } | null>(null)

  const handleSubmit = (text: string, mode: "gen-ui" | "chat") => {
    setLastSubmission({ text, mode })
    toast.success(`Prompt submitted in ${mode === "gen-ui" ? "Gen UI" : "Chat"} mode!`)
    setVal1("")
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl">
      {/* 1. Interactive Demo */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Interactive State
        </h4>
        <ChatPromptInput
          value={val1}
          onValueChange={setVal1}
          onSubmit={handleSubmit}
          placeholder="Describe your SaaS idea or agent workflow..."
        />
        {lastSubmission && (
          <div className="rounded-xl border border-border/80 bg-card/60 p-4 text-xs space-y-1.5 transition-all">
            <p className="font-semibold text-foreground">Last Submitted Data:</p>
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Mode:</span>{" "}
              {lastSubmission.mode === "gen-ui" ? "✨ Gen UI" : "💬 Chat"}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Prompt:</span> &quot;
              {lastSubmission.text}&quot;
            </p>
          </div>
        )}
      </div>

      {/* 2. Disabled/Loading States */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Disabled / Loading States
        </h4>
        <div className="space-y-4 opacity-75">
          <ChatPromptInput
            value={val2}
            onValueChange={setVal2}
            onSubmit={() => {}}
            disabled
            placeholder="This input is disabled..."
          />
        </div>
      </div>
    </div>
  )
}
