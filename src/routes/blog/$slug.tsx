import { Link, createFileRoute } from "@tanstack/react-router"

import { BlogPostLayout } from "@/components/blog/blog-post-layout"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"
import { RouteError } from "@/components/route-error"
import { Button } from "@/components/ui/button"
import { getPostBySlug } from "@/lib/sanity/posts"

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => getPostBySlug(params.slug),
  head: ({ loaderData }) => {
    const post = loaderData
    const title =
      post?.seo?.metaTitle ?? (post ? `${post.title} — Blog` : "Post not found")
    const description =
      post?.seo?.metaDescription ?? post?.excerpt ?? undefined

    return {
      meta: [
        { title },
        ...(description ? [{ name: "description", content: description }] : []),
      ],
    }
  },
  errorComponent: RouteError,
  component: BlogPostPage,
})

function BlogPostPage() {
  const post = Route.useLoaderData()

  if (!post) {
    return (
      <div className="min-h-svh bg-background text-foreground">
        <SiteHeader />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold">Post not found</h1>
          <p className="mt-2 text-muted-foreground">
            This article doesn&apos;t exist or hasn&apos;t been published yet.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/blog">Back to blog</Link>
          </Button>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
          <Link
            to="/blog"
            className="inline-flex text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to blog
          </Link>
        </div>
        <BlogPostLayout post={post} />
      </main>
      <SiteFooter />
    </div>
  )
}
