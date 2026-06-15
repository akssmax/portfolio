import { BlogPostCard } from "@/components/blog/blog-post-card"
import type { BlogPostCard as BlogPostCardType } from "@/lib/sanity/types"

export function BlogPostGrid({ posts }: { posts: BlogPostCardType[] }) {
  if (!posts.length) {
    return (
      <p className="text-sm text-muted-foreground">No posts published yet.</p>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {posts.map((post) => (
        <BlogPostCard key={post._id} post={post} />
      ))}
    </div>
  )
}
