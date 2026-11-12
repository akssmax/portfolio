import { Link } from "@tanstack/react-router"
import { ArrowDown, ArrowRight } from "lucide-react"

import { timelineActs, timelineChapters } from "@/lib/journey/timeline"

const stops = timelineChapters
// the ground climbs with each stop, like the journey's horizontal view
const W = 100
const H = 100
const point = (i: number) => ({
  x: 6 + (i * (W - 12)) / (stops.length - 1),
  y: 82 - Math.pow(i / (stops.length - 1), 1.35) * 58,
})
const path = stops
  .map((_, i) => {
    const { x, y } = point(i)
    return `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`
  })
  .join(" ")

/** Featured card that previews /journey: a climbing line of every stop. */
export function JourneyFeatureCard() {
  return (
    <Link
      to="/journey"
      className="group relative grid overflow-hidden rounded-2xl border border-border bg-card text-left transition-colors hover:border-foreground/25 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
    >
      <div className="flex flex-col justify-between gap-6 p-6 sm:p-8">
        <div className="space-y-3">
          <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
            Interactive · {stops.length} stops · {timelineActs.length} acts
          </p>
          <h3 className="font-heading text-2xl leading-tight tracking-tight text-foreground sm:text-3xl">
            I just like <em className="text-muted-foreground italic">making things.</em>
          </h3>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Walk the whole story, from After Effects tutorials in school to AI
            agents in production. Every stop has something to play with.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background">
            Explore the journey
            <ArrowRight
              className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <ArrowDown className="size-3" aria-hidden /> scroll or swipe
          </span>
        </div>
      </div>

      <div
        className="relative min-h-[220px] border-t border-border bg-muted/40 md:min-h-[280px] md:border-t-0 md:border-l"
        aria-hidden="true"
      >
        {/* dot grid, as on the journey page */}
        <div className="absolute inset-0 [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:14px_14px] text-foreground/[0.07]" />
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 size-full overflow-visible"
        >
          <path
            d={path}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            className="text-foreground/25"
          />
          <path
            d={path}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            strokeDasharray="1"
            className="text-foreground [stroke-dashoffset:0.62] transition-[stroke-dashoffset] duration-[1400ms] ease-out group-hover:[stroke-dashoffset:0] motion-reduce:transition-none [@media(hover:none)]:[stroke-dashoffset:0]"
          />
        </svg>
        {stops.map((c, i) => {
          const { x, y } = point(i)
          const labelBelow = i % 2 === 0
          return (
            <div
              key={c.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <span
                className="block size-3 rounded-full border-2 border-card shadow-[0_0_0_1px_var(--color-border)] transition-transform duration-300 motion-safe:group-hover:scale-125 sm:size-3.5"
                style={{
                  background: c.brand,
                  transitionDelay: `${i * 45}ms`,
                }}
              />
              <span
                className={`absolute left-1/2 hidden -translate-x-1/2 font-mono text-[10px] whitespace-nowrap text-muted-foreground sm:block ${
                  labelBelow ? "top-5" : "bottom-5"
                }`}
              >
                {c.year === "Now" ? "now" : c.company.replace(/\s*\(.*\)/, "")}
              </span>
            </div>
          )
        })}
        <div className="absolute right-4 bottom-3 left-4 flex justify-between font-mono text-[10px] text-muted-foreground sm:hidden">
          <span>{stops[0].year}</span>
          <span>now</span>
        </div>
      </div>
    </Link>
  )
}
