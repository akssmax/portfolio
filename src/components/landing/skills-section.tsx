import { motion, useReducedMotion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const designSkills = [
  "Figma",
  "Design Systems",
  "Prototyping",
  "Visual Design",
  "UX Research",
] as const

const engineeringSkills = [
  "React",
  "TypeScript",
  "Tailwind CSS",
  "TanStack",
  "Framer Motion",
] as const

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
          className="grid gap-10 sm:grid-cols-2"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-foreground">Design</h3>
            <Separator />
            <motion.div
              className="flex flex-wrap gap-2"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              {designSkills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </motion.div>
          </motion.div>

          <motion.div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-foreground">Engineering</h3>
            <Separator />
            <motion.div
              className="flex flex-wrap gap-2"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {engineeringSkills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
