import { motion, useReducedMotion } from "motion/react"
import { ArrowDown } from "lucide-react"

import {
  InteractiveStrandsBackground,
  useInteractiveStrands,
} from "@/components/projects/interactive-strands-background"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { profile } from "@/lib/profile"

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion()
  const { dynamicProps, mouseHandlers } = useInteractiveStrands()

  return (
    <section
      className="relative overflow-hidden"
      {...(!shouldReduceMotion ? mouseHandlers : {})}
    >
      {!shouldReduceMotion ? (
        <InteractiveStrandsBackground
          dynamicProps={dynamicProps}
          className="pointer-events-none absolute inset-0"
        />
      ) : null}
      <div
        className="pointer-events-none absolute inset-0 bg-background/75"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
        <motion.div
          className="flex max-w-3xl flex-col gap-6"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="w-fit">
            {profile.role} @ {profile.company}
          </Badge>
          <p className="text-sm font-medium text-muted-foreground">
            {profile.name} · {profile.location}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {profile.title}
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            {profile.tagline}
          </p>
          <motion.div
            className="flex flex-wrap gap-3"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Button size="lg" asChild>
              <a href="#work">View work</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#contact">Get in touch</a>
            </Button>
          </motion.div>
          <motion.a
            href="#work"
            className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            aria-label="Scroll to work section"
          >
            <ArrowDown className="size-4" />
            Scroll to explore
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
