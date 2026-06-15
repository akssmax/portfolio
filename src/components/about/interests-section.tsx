import { motion, useReducedMotion } from "motion/react"
import { ArrowUpRight } from "lucide-react"

import {
  DribbbleIcon,
  GithubIcon,
  LinkedinIcon,
  MediumIcon,
  YoutubeIcon,
} from "@/components/icons/social-icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DownloadResumeButton } from "@/features/resume/download-resume-button"
import { profile } from "@/lib/profile"

const socialLinks = [
  { label: "LinkedIn", href: profile.links.linkedin, Icon: LinkedinIcon },
  { label: "GitHub", href: profile.links.github, Icon: GithubIcon },
  { label: "Dribbble", href: profile.links.dribbble, Icon: DribbbleIcon },
  { label: "Medium", href: profile.links.medium, Icon: MediumIcon },
  { label: "YouTube", href: profile.links.youtube, Icon: YoutubeIcon },
] as const

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

        <motion.div
          className="mt-16 rounded-xl border border-border bg-muted/30 p-6 sm:p-8"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold text-foreground">Connect</h2>
          <nav className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-primary"
              >
                <Icon className="shrink-0 opacity-70 transition-opacity group-hover:opacity-100" />
                {label}
                <ArrowUpRight className="size-3.5 opacity-60 transition-transform group-hover:-translate-y-px group-hover:translate-x-px group-hover:opacity-100" />
              </a>
            ))}
          </nav>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <a href="/#contact">Get in touch</a>
            </Button>
            <DownloadResumeButton showIcon={false} size="default" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
