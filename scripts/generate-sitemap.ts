import { writeFileSync } from "node:fs"
import { join } from "node:path"

import { fallbackPosts } from "../src/lib/sanity/fallback-posts"
import { fallbackProjects } from "../src/lib/sanity/fallback-projects"
import { SITE_URL } from "../src/lib/site-url"

type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"

type SitemapEntry = {
  path: string
  lastmod: string
  changefreq: ChangeFreq
  priority: number
}

const PUBLIC_DIR = join(import.meta.dirname, "../public")
const SITEMAP_FILES = ["sitemap-v2.xml", "sitemap.xml"] as const

function formatLastmod(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10)
  }

  return date.toISOString().slice(0, 10)
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

function toLoc(path: string): string {
  if (path === "/") {
    return `${SITE_URL}/`
  }

  return `${SITE_URL}${path}`
}

function renderUrl(entry: SitemapEntry): string {
  return `  <url>
    <loc>${escapeXml(toLoc(entry.path))}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`
}

function buildSitemapXml(entries: SitemapEntry[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(renderUrl).join("\n")}
</urlset>
`
}

const today = formatLastmod(new Date())

const corePages: SitemapEntry[] = [
  { path: "/", lastmod: today, changefreq: "weekly", priority: 1.0 },
  { path: "/about", lastmod: today, changefreq: "monthly", priority: 0.8 },
  { path: "/experience", lastmod: today, changefreq: "monthly", priority: 0.8 },
  { path: "/projects", lastmod: today, changefreq: "weekly", priority: 0.9 },
  { path: "/blog", lastmod: today, changefreq: "weekly", priority: 0.8 },
  { path: "/tools/resume", lastmod: today, changefreq: "monthly", priority: 0.7 },
]

const projectPages: SitemapEntry[] = fallbackProjects
  .map((project) => ({
    path: `/projects/${project.slug}`,
    lastmod: today,
    changefreq: "monthly" as const,
    priority: 0.8,
  }))
  .sort((left, right) => left.path.localeCompare(right.path))

const blogPages: SitemapEntry[] = fallbackPosts
  .map((post) => ({
    path: `/blog/${post.slug}`,
    lastmod: formatLastmod(post.publishedAt),
    changefreq: "monthly" as const,
    priority: 0.7,
  }))
  .sort((left, right) => right.lastmod.localeCompare(left.lastmod))

const entries = [...corePages, ...projectPages, ...blogPages]
const xml = buildSitemapXml(entries)

for (const filename of SITEMAP_FILES) {
  writeFileSync(join(PUBLIC_DIR, filename), xml)
}

console.log(
  `Generated sitemap with ${entries.length} URLs at public/sitemap-v2.xml (and legacy public/sitemap.xml)`,
)
