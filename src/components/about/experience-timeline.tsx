import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { FounderThreadBadge, experienceAnchor } from "@/components/about/founder-thread"
import { CompanyLogo } from "@/components/shared/company-logo"
import { Button } from "@/components/ui/button"
import { getExperienceDuration, getExperienceSectionSubtitle } from "@/lib/experience-duration"
import { getFounderThread, profile } from "@/lib/profile"
import { cn } from "@/lib/utils"

export function ExperienceTimeline() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="border-b border-border bg-muted/30 py-24">
      <motion.div
        className="mx-auto max-w-6xl px-4 sm:px-6"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-12 max-w-2xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Experience
          </h2>
          <p className="text-base text-muted-foreground">
            {getExperienceSectionSubtitle(profile.experience.map((item) => item.period))}
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to="/journey">
              Explore full journey
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <ol className="flex flex-col">
          {profile.experience.map((item, index) => {
            const thread = getFounderThread(item)
            const next = profile.experience[index + 1]
            const isLast = !next
            const railToNextIsThread = Boolean(thread && next && getFounderThread(next))
            const chapter = String(profile.experience.length - index).padStart(2, "0")

            return (
              <motion.li
                key={`${item.company}-${item.period}`}
                id={experienceAnchor(item.company)}
                className="grid scroll-mt-24 grid-cols-[2.5rem_1rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[4rem_1.25rem_minmax(0,1fr)] sm:gap-x-4"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
              >
                <span
                  className={cn(
                    "font-heading text-2xl leading-none tabular-nums sm:text-4xl",
                    thread ? "text-primary" : "text-muted-foreground",
                  )}
                  aria-hidden
                >
                  {chapter}
                </span>

                <div className="flex flex-col items-center" aria-hidden>
                  <span
                    className={cn(
                      "mt-2 size-2.5 shrink-0 rounded-full border-2",
                      thread ? "border-primary bg-primary" : "border-muted-foreground bg-background",
                    )}
                  />
                  {isLast ? null : (
                    <span
                      className={cn(
                        "mt-1 w-0.5 flex-1 rounded-full",
                        railToNextIsThread ? "bg-primary" : "bg-border",
                      )}
                    />
                  )}
                </div>

                <article className={cn("min-w-0", isLast ? "pb-0" : "pb-12")}>
                  <p className="font-mono text-xs text-muted-foreground">
                    {item.period} · {getExperienceDuration(item.period)} · {item.location}
                  </p>
                  <div className="mt-3 flex items-start gap-3">
                    <CompanyLogo src={item.logoSrc} name={item.company} className="size-9" />
                    <div className="min-w-0">
                      <h3 className="text-lg font-medium leading-snug text-foreground">
                        {item.role} · {item.company}
                      </h3>
                      {thread ? <FounderThreadBadge thread={thread} /> : null}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  {"highlights" in item && item.highlights?.length ? (
                    <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                      {item.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-2">
                          <span
                            className="mt-2 size-1 shrink-0 rounded-full bg-primary"
                            aria-hidden
                          />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              </motion.li>
            )
          })}
        </ol>
      </motion.div>
    </section>
  )
}
