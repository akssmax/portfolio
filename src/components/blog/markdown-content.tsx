"use client"

import { code } from "@streamdown/code"
import type { ComponentProps } from "react"
import { Streamdown } from "streamdown"

import { cn } from "@/lib/utils"

const streamdownPlugins = { code }

export type MarkdownContentProps = ComponentProps<typeof Streamdown>

export function MarkdownContent({ className, ...props }: MarkdownContentProps) {
  return (
    <Streamdown
      className={cn(
        "prose prose-neutral dark:prose-invert max-w-none text-base leading-relaxed",
        "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        "[&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight",
        "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold",
        "[&_p]:my-4 [&_p]:text-muted-foreground",
        "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-muted-foreground",
        "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-muted-foreground",
        "[&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground",
        "[&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4",
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm",
        "[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border",
        "[&_hr]:my-10 [&_hr]:border-border",
        className,
      )}
      plugins={streamdownPlugins}
      {...props}
    />
  )
}
