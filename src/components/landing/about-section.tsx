import { motion, useReducedMotion } from "motion/react"
import { GraduationCap, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { profile } from "@/lib/profile"

export function AboutSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="about" className="border-t border-border py-24">
      <motion.div
        className="mx-auto max-w-6xl px-4 sm:px-6"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            About
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Product designer with a computer science foundation.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          <motion.p
            className="text-base leading-relaxed text-muted-foreground sm:text-lg"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {profile.bio}
          </motion.p>

          <motion.div
            className="flex flex-col gap-4"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              {profile.location}
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <GraduationCap className="mt-0.5 size-4 shrink-0" />
              <div>
                <p className="text-foreground">{profile.education.degree}</p>
                <p>{profile.education.school}</p>
                <p>{profile.education.years}</p>
              </div>
            </div>
            <Badge variant="secondary" className="w-fit">
              {profile.role} @ {profile.company}
            </Badge>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
