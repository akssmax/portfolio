import { motion, useReducedMotion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { profile } from "@/lib/profile"

export function InterestsSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="py-24">
      <motion.div
        className="mx-auto max-w-6xl px-4 sm:px-6"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Languages
            </h2>
            <ul className="mt-6 space-y-3">
              {profile.languages.map((language) => (
                <li
                  key={language.name}
                  className="flex items-center justify-between border-b border-border pb-3 text-sm last:border-0"
                >
                  <span className="font-medium text-foreground">
                    {language.name}
                  </span>
                  <span className="text-muted-foreground">{language.level}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Interests
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <Badge key={interest} variant="outline">
                  {interest}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
