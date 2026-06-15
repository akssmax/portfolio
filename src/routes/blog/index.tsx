import { Link, createFileRoute } from "@tanstack/react-router"

import { BlogPostGrid } from "@/components/blog/blog-post-grid"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"
import { RouteError } from "@/components/route-error"
import { getAllPosts } from "@/lib/sanity/posts"

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Akshay Saini" },
      {
        name: "description",
        content: "Notes on design systems, design engineering, and shipping product work.",
      },
    ],
  }),
  loader: () => getAllPosts(),
  errorComponent: RouteError,
  component: BlogIndexPage,
})

function BlogIndexPage() {
  const posts = Route.useLoaderData()

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Writing
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Blog
            </h1>
            <p className="mt-3 text-base text-muted-foreground">
              Notes on design systems, design engineering, and shipping thoughtful product work.
            </p>
            <Link
              to="/"
              className="mt-4 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Back to home
            </Link>
          </div>

          <BlogPostGrid posts={posts} />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
