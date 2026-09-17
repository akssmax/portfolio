import * as React from "react"
import { useNavigate } from "@tanstack/react-router"
import { nanoid } from "nanoid"

import { Landing2About } from "@/components/landing-2/landing-2-about"
import { Landing2Experience } from "@/components/landing-2/landing-2-experience"
import { Landing2Footer } from "@/components/landing-2/landing-2-footer"
import { Landing2Hero } from "@/components/landing-2/landing-2-hero"
import { Landing2Manifesto } from "@/components/landing-2/landing-2-manifesto"
import { Landing2ProjectBands } from "@/components/landing-2/landing-2-project-bands"
import { Landing2Proof } from "@/components/landing-2/landing-2-proof"
import { Landing2Work } from "@/components/landing-2/landing-2-work"
import { OsBootDialog } from "@/components/landing-2/os-boot-dialog"
import { OsMenuBar } from "@/components/landing-2/os-menu-bar"
import { profile } from "@/lib/profile"
import type { HomeWorkSections } from "@/lib/sanity/projects"
import { preloadFontPreset } from "@/lib/themes/font-loader"

export function Landing2Page({ recentProjects, caseStudies }: HomeWorkSections) {
  const navigate = useNavigate()
  const findInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    preloadFontPreset("outfit")
  }, [])

  const submitPrompt = React.useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return

      const threadId = nanoid(10)
      const initialThread = {
        id: threadId,
        createdAt: new Date().toISOString(),
        messages: [
          {
            id: nanoid(),
            role: "user" as const,
            content: trimmed,
            mode: "chat" as const,
          },
        ],
      }

      try {
        localStorage.setItem(`portfolio_thread_${threadId}`, JSON.stringify(initialThread))
      } catch {
        // Chat route also reads navigation state as a fallback.
      }

      void navigate({
        to: "/chat/$threadId",
        params: { threadId },
        state: {
          initialPrompt: trimmed,
          mode: "chat",
        } as never,
      })
    },
    [navigate],
  )

  const focusFind = React.useCallback(() => {
    const node = findInputRef.current ?? document.getElementById("landing-2-find")
    node?.scrollIntoView({ behavior: "smooth", block: "center" })
    if (node instanceof HTMLInputElement) {
      node.focus()
    }
  }, [])

  const latestProject = caseStudies[0] ?? recentProjects[0]

  return (
    <div id="top" className="landing-2-root min-h-svh">
      <OsBootDialog />
      <OsMenuBar name={profile.name} onAskAi={focusFind} />
      <main>
        <Landing2Hero
          latestProject={latestProject}
          onSubmitPrompt={submitPrompt}
          findInputRef={findInputRef}
        />
        <Landing2Manifesto />
        <Landing2Work recentProjects={recentProjects} caseStudies={caseStudies} />
        <Landing2ProjectBands recentProjects={recentProjects} caseStudies={caseStudies} />
        <Landing2Experience />
        <Landing2Proof />
        <Landing2About />
      </main>
      <Landing2Footer />
    </div>
  )
}
