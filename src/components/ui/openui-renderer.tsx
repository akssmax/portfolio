import * as React from "react"
import { useNavigate } from "@tanstack/react-router"
import { Renderer, type ActionEvent, BuiltinActionType } from "@openuidev/react-lang"
import { Sparkles } from "lucide-react"

import "@openuidev/react-ui/index.css"

import { portfolioLibrary } from "@/lib/openui/portfolio-library"

type OpenUiRendererProps = {
  response: string
  isStreaming?: boolean
  title?: string
  badge?: string
}

export function OpenUiRenderer({
  response,
  isStreaming = false,
  title = "Gen UI",
  badge = "OpenUI",
}: OpenUiRendererProps) {
  const navigate = useNavigate()

  const handleAction = React.useCallback(
    (event: ActionEvent) => {
      if (event.type === BuiltinActionType.OpenUrl) {
        const url = typeof event.params.url === "string" ? event.params.url : ""
        if (url.startsWith("/")) {
          navigate({ to: url })
          return
        }
        if (url.startsWith("http://") || url.startsWith("https://")) {
          window.open(url, "_blank", "noopener,noreferrer")
        }
        return
      }

      if (event.type === BuiltinActionType.ContinueConversation) {
        const message =
          typeof event.params.message === "string"
            ? event.params.message
            : event.humanFriendlyMessage
        if (message.trim()) {
          window.dispatchEvent(
            new CustomEvent("portfolio-chat-follow-up", { detail: { message: message.trim() } }),
          )
        }
      }
    },
    [navigate],
  )

  return (
    <div className="w-full space-y-4 my-3 p-5 sm:p-6 rounded-2xl border border-border/85 bg-background/55 backdrop-blur-md relative overflow-hidden group/gen-ui shadow-sm hover:border-primary/20 transition-all duration-300">
      <div className="absolute -right-24 -top-24 size-48 bg-primary/5 rounded-full blur-3xl pointer-events-none transition-opacity duration-300 group-hover/gen-ui:opacity-100" />

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary animate-pulse" />
          <h3 className="text-sm font-semibold text-foreground tracking-tight">{title}</h3>
        </div>
        {badge ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-semibold text-primary uppercase tracking-wider border border-primary/20 shadow-xs">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="openui-portfolio min-w-0">
        <Renderer
          library={portfolioLibrary}
          response={response}
          isStreaming={isStreaming}
          onAction={handleAction}
          onError={(errors) => {
            if (errors.length > 0) {
              console.warn("[OpenUI]", errors)
            }
          }}
        />
      </div>
    </div>
  )
}
