import { Link, createFileRoute } from "@tanstack/react-router"

import { BlogPostGrid } from "@/components/blog/blog-post-grid"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"
import { RouteError } from "@/components/route-error"
import { getAllPosts } from "@/lib/sanity/posts"
import { siteUrl } from "@/lib/site-url"

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      {
        title: "Blog — Design Systems & Design Engineering by Akshay Saini",
      },
      {
        name: "description",
        content: "Articles and case study notes on token-driven design systems, frontend styling, and developer tools written by Akshay Saini, based in Bangalore, India.",
      },
      {
        name: "keywords",
        content: "design engineering blog, design systems, token systems, frontend engineering, react design system, akshay saini, designer blog bangalore",
      },
      {
        property: "og:title",
        content: "Blog — Design Systems & Design Engineering by Akshay Saini",
      },
      {
        property: "og:description",
        content: "Articles and case study notes on token-driven design systems, frontend styling, and developer tools written by Akshay Saini.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: siteUrl("/blog"),
      },
      {
        property: "og:image",
        content: siteUrl("/images/hero-portrait.png"),
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "Blog — Design Systems & Design Engineering by Akshay Saini",
      },
      {
        name: "twitter:description",
        content: "Articles and case study notes on token-driven design systems, frontend styling, and developer tools written by Akshay Saini.",
      },
      {
        name: "twitter:image",
        content: siteUrl("/images/hero-portrait.png"),
      },
    ],
    links: [
      {
        rel: "canonical",
        href: siteUrl("/blog"),
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
