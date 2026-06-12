import type { LucideIcon } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { profile } from "@/lib/profile"
import { categoryIcons, skillIcons } from "@/lib/skill-icons"

function SkillBadge({
  skill,
  variant,
}: {
  skill: string
  variant: "secondary" | "outline"
}) {
  const Icon = skillIcons[skill]

  return (
    <Badge variant={variant}>
      {Icon ? <Icon aria-hidden /> : null}
      {skill}
    </Badge>
  )
}

function CategoryHeading({
  icon: Icon,
  label,
}: {
  icon: LucideIcon
  label: string
}) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
      <Icon className="size-4 text-muted-foreground" aria-hidden />
      {label}
    </h3>
  )
}

export function SkillsSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="skills" className="py-24">
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
            Fluent across the design-to-code pipeline.
          </p>
        </div>

        <motion.div
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div className="flex flex-col gap-4">
            <CategoryHeading icon={categoryIcons.design} label="Design" />
            <Separator />
            <motion.div
              className="flex flex-wrap gap-2"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              {profile.designSkills.map((skill) => (
                <SkillBadge key={skill} skill={skill} variant="secondary" />
              ))}
            </motion.div>
          </motion.div>

          <motion.div className="flex flex-col gap-4">
            <CategoryHeading icon={categoryIcons.engineering} label="Engineering" />
            <Separator />
            <motion.div
              className="flex flex-wrap gap-2"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {profile.engineeringSkills.map((skill) => (
                <SkillBadge key={skill} skill={skill} variant="outline" />
              ))}
            </motion.div>
          </motion.div>

          <motion.div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <CategoryHeading icon={categoryIcons.domains} label="Domains & tools" />
            <Separator />
            <motion.div
              className="flex flex-wrap gap-2"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              {profile.domainSkills.map((skill) => (
                <SkillBadge key={skill} skill={skill} variant="outline" />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
