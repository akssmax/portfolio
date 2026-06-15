import { Link } from "@tanstack/react-router"
import { format, parseISO } from "date-fns"
import { FileText } from "lucide-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getImageUrl } from "@/lib/sanity/image"
import type { BlogPostCard } from "@/lib/sanity/types"

function formatPublishedDate(value?: string | null) {
  if (!value) return null
  try {
    return format(parseISO(value), "MMM d, yyyy")
  } catch {
    return null
  }
}

export function BlogPostCard({ post }: { post: BlogPostCard }) {
  const coverUrl = getImageUrl(post.coverImage, 800)
  const publishedLabel = formatPublishedDate(post.publishedAt)

  return (
    <Link to="/blog/$slug" params={{ slug: post.slug }} className="block h-full">
      <Card className="h-full gap-4 overflow-hidden pt-0 transition-shadow hover:shadow-md">
        {coverUrl ? (
          <div className="overflow-hidden border-b border-border">
            <img
              src={coverUrl}
              alt={post.coverImage?.alt ?? post.title}
              loading="lazy"
              decoding="async"
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
        ) : (
          <div
            className="flex aspect-[16/10] flex-col items-center justify-center gap-3 border-b border-border bg-muted/40"
            aria-hidden
          >
            <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-background/80 text-muted-foreground">
              <FileText className="size-5" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {post.tag}
            </span>
          </div>
        )}
        <CardHeader>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span>{post.tag}</span>
            {publishedLabel ? (
              <>
                <span aria-hidden>·</span>
                <time dateTime={post.publishedAt ?? undefined}>{publishedLabel}</time>
              </>
            ) : null}
          </div>
          <CardTitle className="text-lg">{post.title}</CardTitle>
          <CardDescription className="text-base">{post.excerpt}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
