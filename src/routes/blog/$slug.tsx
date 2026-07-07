import { Link, createFileRoute } from "@tanstack/react-router"
 
import { BlogPostLayout } from "@/components/blog/blog-post-layout"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"
import { RouteError } from "@/components/route-error"
import { Button } from "@/components/ui/button"
import { getImageUrl } from "@/lib/sanity/image"
import { getPostBySlug } from "@/lib/sanity/posts"
import { siteUrl } from "@/lib/site-url"
 
export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => getPostBySlug(params.slug),
  head: ({ loaderData }) => {
    const post = loaderData
    const title =
      post?.seo?.metaTitle ?? (post ? `${post.title} — Blog by Akshay Saini` : "Post not found")
    const description =
      post?.seo?.metaDescription ?? post?.excerpt ?? undefined
    const slug = post?.slug ?? ""
    const canonicalUrl = siteUrl(`/blog/${slug}`)
    
    const coverUrl = post?.coverImage ? getImageUrl(post.coverImage, 1200) : null
    const imageUrl = coverUrl ?? siteUrl("/images/og-banner.jpg")
 
    return {
      meta: [
        { title },
        ...(description ? [{ name: "description", content: description }] : []),
        {
          name: "keywords",
          content: `${post?.title ?? ""}, design systems, frontend, react, engineering, blog, akshay saini`,
        },
        { property: "og:title", content: title },
        ...(description ? [{ property: "og:description", content: description }] : []),
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonicalUrl },
        { property: "og:image", content: imageUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        ...(description ? [{ name: "twitter:description", content: description }] : []),
        { name: "twitter:image", content: imageUrl },
      ],
      links: [
        {
          rel: "canonical",
          href: canonicalUrl,
        },
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
