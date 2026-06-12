import { motion, useReducedMotion } from "motion/react"
import { Mail } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ContactSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="contact" className="border-t border-border bg-muted/30 py-24">
      <motion.div
        className="mx-auto max-w-6xl px-4 text-center sm:px-6"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Let&apos;s build something
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-base text-muted-foreground">
          Open to freelance, full-time, and collaboration on design-engineering
          projects.
        </p>
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Button size="lg" asChild>
            <a href="mailto:hello@example.com">
              <Mail className="size-4" />
              hello@example.com
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
