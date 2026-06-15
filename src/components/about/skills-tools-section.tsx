import { motion, useReducedMotion } from "motion/react"

import { TechLogo } from "@/components/projects/blocks/tech-logo"
import { Badge } from "@/components/ui/badge"
import { profile } from "@/lib/profile"

const toolCategoryOrder = [
  "Design",
  "Coding tools",
  "Research",
  "Build",
  "Analytics",
  "Ops",
] as const

const toolCategories = [
  ...toolCategoryOrder.filter((category) =>
    profile.tools.some((tool) => tool.category === category),
  ),
  ...new Set(
    profile.tools
      .map((tool) => tool.category)
      .filter(
        (category) =>
          !toolCategoryOrder.includes(category as (typeof toolCategoryOrder)[number]),
      ),
  ),
]

export function SkillsToolsSection() {
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
        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Skills & tools
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Design capabilities and the tools I reach for day to day.
          </p>
        </div>

        <div className="space-y-10">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="mb-4 text-sm font-medium text-foreground">
              Design capabilities
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.designCapabilities.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </motion.div>

          {toolCategories.map((category, categoryIndex) => (
            <motion.div
              key={category}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: categoryIndex * 0.05 }}
            >
              <h3 className="mb-4 text-sm font-medium text-foreground">
                {category}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {profile.tools
                  .filter((tool) => tool.category === category)
                  .map((tool) => (
                    <div
                      key={tool.name}
                      className="group flex items-start gap-3 rounded-lg border border-border bg-background px-4 py-3"
                    >
                      <TechLogo
                        src={tool.logoSrc}
                        name={tool.name}
                        className="mt-0.5 size-5"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {tool.name}
                        </p>
                        {tool.note ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {tool.note}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
