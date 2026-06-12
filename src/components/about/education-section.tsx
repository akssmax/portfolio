import { motion, useReducedMotion } from "motion/react"
import { Award, GraduationCap } from "lucide-react"

import { profile } from "@/lib/profile"

export function EducationSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="border-b border-border py-24">
      <motion.div
        className="mx-auto max-w-6xl px-4 sm:px-6"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Education & certifications
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <motion.div
            className="flex gap-4 rounded-xl border border-border p-5"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <GraduationCap
              className="size-5 shrink-0 text-muted-foreground"
              aria-hidden
            />
            <div>
              <h3 className="font-medium text-foreground">
                {profile.education.degree}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {profile.education.school}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {profile.education.years} · {profile.education.location}
              </p>
            </div>
          </motion.div>

          {profile.certifications.map((cert, index) => (
            <motion.div
              key={`${cert.title}-${cert.date}`}
              className="flex gap-4 rounded-xl border border-border p-5"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (index + 1) * 0.05 }}
            >
              <Award
                className="size-5 shrink-0 text-muted-foreground"
                aria-hidden
              />
              <div>
                <h3 className="font-medium text-foreground">{cert.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {cert.issuer} · {cert.date}
                </p>
                {"credentialId" in cert && cert.credentialId ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Credential ID {cert.credentialId}
                  </p>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
