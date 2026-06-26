import { ArrowUpRight, Mail } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { ContactDotGridBackground } from "@/components/landing/contact-dot-grid-background"
import { GithubIcon, LinkedinIcon } from "@/components/icons/social-icons"
import { Button } from "@/components/ui/button"
import { profile } from "@/lib/profile"

import { MONOGRAM_ACCENT, MONOGRAM_MAIN } from "@/lib/brand/monogram-mark"

export function ContactSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-primary text-primary-foreground"
    >
      {/* Top Cutout Notch matching brand diagonal angles */}
      <div className="absolute top-0 left-0 right-0 flex items-start pointer-events-none z-10" aria-hidden>
        <div className="h-px flex-1 bg-primary/30" />
        <svg className="w-[320px] h-[32px] shrink-0" viewBox="0 0 320 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cover the top-center of the CTA background with the page background */}
          <path d="M0 -1 L22 32 H298 L320 -1 Z" className="fill-[var(--background)]" />
          {/* Draw the border line along the cutout */}
          <path d="M0 0.5 L22 32.5 H298 L320 0.5" className="stroke-primary opacity-30" strokeWidth="1" />
        </svg>
        <div className="h-px flex-1 bg-primary/30" />
      </div>

      <div className="absolute inset-0 opacity-55" aria-hidden>
        <ContactDotGridBackground />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-white/10" />

        {/* Masked Glowing Accent Area */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-45 mix-blend-screen"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cta-glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="50%" stopColor="var(--secondary)" />
              <stop offset="100%" stopColor="var(--primary)" />
            </linearGradient>

            <mask id="monogram-glow-mask">
              <rect width="1000" height="600" fill="black" />
              {/* Animated large monogram shape */}
              <motion.g
                transform="translate(550, 80) scale(2.8)"
                fill="white"
                animate={shouldReduceMotion ? undefined : {
                  y: [80, 95, 80],
                  x: [550, 565, 550],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <path d={MONOGRAM_MAIN} />
                <path d={MONOGRAM_ACCENT} />
              </motion.g>

              {/* Second smaller animated monogram shape */}
              <motion.g
                transform="translate(150, 220) scale(1.8)"
                fill="white"
                opacity="0.6"
                animate={shouldReduceMotion ? undefined : {
                  y: [220, 210, 220],
                  x: [150, 160, 150],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <path d={MONOGRAM_MAIN} />
                <path d={MONOGRAM_ACCENT} />
              </motion.g>
            </mask>
          </defs>

          <rect
            width="1000"
            height="600"
            fill="url(#cta-glow-grad)"
            mask="url(#monogram-glow-mask)"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <motion.div
          className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-stretch lg:gap-12"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col justify-center gap-5">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground/70">
              Contact
            </p>
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Let&apos;s build something together
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
              Open to freelance, full-time, and collaboration on product design and
              design-engineering projects. Based in {profile.location}.
            </p>
          </div>

          <motion.div
            className="flex flex-col justify-between gap-6 rounded-2xl border border-white/15 bg-background p-6 text-foreground shadow-2xl sm:p-8"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Available for work
              </p>
              <p className="text-lg font-semibold tracking-tight">
                {profile.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {profile.role} · {profile.company}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button size="lg" className="w-full justify-between" asChild>
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <LinkedinIcon />
                    Connect on LinkedIn
                  </span>
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="w-full justify-between" asChild>
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <GithubIcon />
                    View GitHub
                  </span>
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="w-full justify-between"
                asChild
              >
                <a href="mailto:akshaysaini.design@gmail.com">
                  <span className="inline-flex items-center gap-2.5">
                    <Mail className="size-4" />
                    Send an email
                  </span>
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
