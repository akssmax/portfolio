import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/design-system/typography")({
  head: () => ({
    meta: [{ title: "Typography — Design System" }],
  }),
  component: TypographyPage,
})

const typeScale = [
  { token: "text-xs", sample: "The quick brown fox", size: "12px" },
  { token: "text-sm", sample: "The quick brown fox", size: "14px" },
  { token: "text-base", sample: "The quick brown fox", size: "16px" },
  { token: "text-lg", sample: "The quick brown fox", size: "18px" },
  { token: "text-xl", sample: "The quick brown fox", size: "20px" },
  { token: "text-2xl", sample: "The quick brown fox", size: "24px" },
  { token: "text-3xl", sample: "The quick brown fox", size: "30px" },
  { token: "text-4xl", sample: "The quick brown fox", size: "36px" },
  { token: "text-5xl", sample: "Design System", size: "48px" },
  { token: "text-6xl", sample: "Design System", size: "60px" },
] as const

function TypographyPage() {
  return (
    <article className="space-y-10">
      <header className="space-y-3 border-b border-border pb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Foundations
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Typography
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Geist Variable is the default typeface. Switch fonts from the nav theme
          picker to preview Inter, DM Sans, Outfit, and more.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Font family</h2>
        <p className="font-sans text-2xl">Geist Variable</p>
        <p className="text-sm text-muted-foreground">
          font-sans · &apos;Geist Variable&apos;, sans-serif
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Type scale</h2>
        <div className="divide-y divide-border rounded-xl border border-border">
          {typeScale.map((row) => (
            <div
              key={row.token}
              className="flex flex-col gap-2 p-4 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className={`${row.token} truncate`}>{row.sample}</span>
              </div>
              <div className="flex shrink-0 gap-4 font-mono text-xs text-muted-foreground">
                <span>{row.token}</span>
                <span>{row.size}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Font weights</h2>
        <div className="space-y-3">
          <p className="text-lg font-normal">Regular (400) — body text</p>
          <p className="text-lg font-medium">Medium (500) — labels</p>
          <p className="text-lg font-semibold">Semibold (600) — headings</p>
        </div>
      </section>
    </article>
  )
}
