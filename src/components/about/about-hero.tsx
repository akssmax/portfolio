import { motion, useReducedMotion } from "motion/react"
import { Download, GraduationCap, Mail, MapPin, Phone } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { profile } from "@/lib/profile"

export function AboutHero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="border-b border-border py-24">
      <motion.div
        className="mx-auto max-w-6xl px-4 sm:px-6"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            About
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {profile.name}
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Product designer with a computer science foundation.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          <motion.p
            className="text-base leading-relaxed text-muted-foreground sm:text-lg"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {profile.bio}
          </motion.p>

          <motion.aside
            className="flex flex-col gap-4 rounded-xl border border-border bg-muted/30 p-5"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" aria-hidden />
              {profile.location}
            </div>
            <a
              href={`mailto:${profile.contact.email}`}
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="size-4 shrink-0" aria-hidden />
              {profile.contact.email}
            </a>
            <a
              href={`tel:${profile.contact.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Phone className="size-4 shrink-0" aria-hidden />
              {profile.contact.phone}
            </a>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <GraduationCap className="mt-0.5 size-4 shrink-0" aria-hidden />
              <div>
                <p className="text-foreground">{profile.education.degree}</p>
                <p>{profile.education.school}</p>
                <p>{profile.education.years}</p>
              </div>
            </div>
            <Badge variant="secondary" className="w-fit">
              {profile.role} @ {profile.company}
            </Badge>
            <Button variant="outline" size="sm" className="w-fit" asChild>
              <a href={profile.resumePath} download>
                <Download aria-hidden />
                Download resume
              </a>
            </Button>
          </motion.aside>
        </div>
      </motion.div>
    </section>
  )
}
