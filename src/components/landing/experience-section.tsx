import { motion, useReducedMotion } from "motion/react"

import { profile } from "@/lib/profile"
import { cn } from "@/lib/utils"

function CompanyLogo({
  src,
  name,
  className,
}: {
  src: string
  name: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background p-1.5",
        className,
      )}
    >
      <img
        src={src}
        alt={`${name} logo`}
        className="max-h-full max-w-full object-contain"
        loading="lazy"
      />
    </div>
  )
}

export function ExperienceSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="experience" className="border-t border-border bg-muted/30 py-24">
      <motion.div
        className="mx-auto max-w-6xl px-4 sm:px-6"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Experience
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Nearly 8 years designing products across fintech, devtools, and AI.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {profile.experience.map((item, index) => (
            <motion.article
              key={`${item.company}-${item.period}`}
              className="grid gap-2 border-b border-border pb-8 last:border-0 last:pb-0 sm:grid-cols-[200px_1fr]"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="text-sm text-muted-foreground">
                <p>{item.period}</p>
                <p className="mt-1">{item.location}</p>
              </div>
              <div className="flex gap-4">
                <CompanyLogo src={item.logoSrc} name={item.company} />
                <div className="min-w-0">
                  <h3 className="font-medium text-foreground">
                    {item.role} · {item.company}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
