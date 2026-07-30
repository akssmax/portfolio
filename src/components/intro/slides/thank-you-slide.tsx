"use client"

import { Link } from "@tanstack/react-router"
import { motion } from "motion/react"
import { ArrowUpRight, Mail, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"
import type { DeckData } from "@/lib/intro/types"

type ThankYouSlideProps = {
  data: DeckData["thankYou"]
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: EASE_OUT_SMOOTH,
    },
  }),
}

export function ThankYouSlide({ data }: ThankYouSlideProps) {
  const { fullMotion } = useAnimationProfile()

  return (
    <div className="flex min-h-[min(72dvh,680px)] flex-col items-center justify-center text-center">
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
      >
        <Sparkles className="size-3.5" aria-hidden />
        End of deck
      </motion.div>

      <motion.h1
        custom={1}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
      >
        {data.heading}
      </motion.h1>

      <motion.p
        custom={2}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
      >
        {data.message}
      </motion.p>

      <motion.p
        custom={3}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        className="mt-8 text-sm text-muted-foreground"
      >
        — {data.name}
      </motion.p>

      <motion.div
        custom={4}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        className="mt-10 flex flex-wrap items-center justify-center gap-3"
      >
        <Button asChild size="lg">
          <Link to="/">
            Back to portfolio
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </Button>

        <Button asChild variant="outline" size="lg">
          <a href={`mailto:${data.email}`}>
            <Mail className="size-4" aria-hidden />
            {data.email}
          </a>
        </Button>

        <Button asChild variant="outline" size="lg">
          <Link to="/projects/$slug" params={{ slug: "postforge" }} search={{ from: "intro" }}>
            Full case study
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </motion.div>

      <motion.div
        initial={fullMotion ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT_SMOOTH, delay: 0.45 }}
        className="mt-8"
      >
        <a
          href={data.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Connect on LinkedIn
        </a>
      </motion.div>
    </div>
  )
}
