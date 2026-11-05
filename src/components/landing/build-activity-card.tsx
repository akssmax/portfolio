import { useState } from "react"
import { Asterisk } from "lucide-react"

import { ClaudeActivityCard } from "@/components/landing/claude-activity-card"
import { GithubActivityCard } from "@/components/landing/github-activity-card"
import { GithubIcon } from "@/components/icons/social-icons"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ActivitySource = "github" | "claude"

function ActivitySourceToggle({
  value,
  onChange,
}: {
  value: ActivitySource
  onChange: (value: ActivitySource) => void
}) {
  return (
    <Tabs value={value} onValueChange={(next) => onChange(next as ActivitySource)}>
      <TabsList aria-label="Activity source" className="h-8">
        <TabsTrigger value="github" className="px-2.5 text-xs">
          <GithubIcon className="size-3.5" aria-hidden />
          GitHub
        </TabsTrigger>
        <TabsTrigger value="claude" className="px-2.5 text-xs">
          <Asterisk className="size-3.5" aria-hidden />
          Claude Code
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

/** One activity card at a time: GitHub by default, Claude Code on request. */
export function BuildActivityCard() {
  const [source, setSource] = useState<ActivitySource>("github")
  const toggle = <ActivitySourceToggle value={source} onChange={setSource} />

  return source === "github" ? (
    <GithubActivityCard toggle={toggle} />
  ) : (
    <ClaudeActivityCard toggle={toggle} />
  )
}
