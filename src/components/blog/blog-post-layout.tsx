import { format, parseISO } from "date-fns"

import { MarkdownContent } from "@/components/blog/markdown-content"
import { getImageUrl } from "@/lib/sanity/image"
import type { BlogPost } from "@/lib/sanity/types"

function formatPublishedDate(value?: string | null) {
  if (!value) return null
  try {
    return format(parseISO(value), "MMMM d, yyyy")
  } catch {
    return null
  }
}

export function BlogPostLayout({ post }: { post: BlogPost }) {
  const coverUrl = getImageUrl(post.coverImage, 1400)
  const publishedLabel = formatPublishedDate(post.publishedAt)

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <header className="space-y-4 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <span>{post.tag}</span>
          {publishedLabel ? (
            <>
              <span aria-hidden>·</span>
              <time dateTime={post.publishedAt ?? undefined}>{publishedLabel}</time>
            </>
          ) : null}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {post.title}
        </h1>
        <p className="text-lg text-muted-foreground">{post.excerpt}</p>
      </header>

      {coverUrl ? (
        <div className="my-10 overflow-hidden rounded-xl border border-border">
          <img
            src={coverUrl}
            alt={post.coverImage?.alt ?? post.title}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="aspect-[16/10] w-full object-cover"
          />
        </div>
      ) : null}

      <div className="pt-2">
        <MarkdownContent>{post.body}</MarkdownContent>
      </div>
    </article>
  )
}
