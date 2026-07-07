import { Link, getRouteApi } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type CaseStudyFrom = "home" | "projects"

export type CaseStudyBackTarget = {
  to: "/" | "/projects"
  label: string
}

export function getCaseStudyBack(from?: CaseStudyFrom): CaseStudyBackTarget {
  if (from === "home") {
    return { to: "/", label: "Back to home" }
  }

  return { to: "/projects", label: "All projects" }
}

const projectRoute = getRouteApi("/projects/$slug")

type CaseStudyBackLinkProps = {
  className?: string
}

export function CaseStudyBackLink({ className }: CaseStudyBackLinkProps) {
  const { from } = projectRoute.useSearch()
  const back = getCaseStudyBack(from)

  return (
    <Button asChild variant="ghost" size="sm" className={cn("-ml-2 text-muted-foreground", className)}>
      <Link to={back.to}>
        <ArrowLeft className="mr-2 size-4" />
        {back.label}
      </Link>
    </Button>
  )
}

export function useCaseStudyBack() {
  const { from } = projectRoute.useSearch()
  return getCaseStudyBack(from)
}
