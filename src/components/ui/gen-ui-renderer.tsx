import { motion } from "motion/react"
import { fallbackProjects } from "@/lib/sanity/fallback-projects"
import { profile } from "@/lib/profile"
import { ExternalLink, Star, Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type GenUiRendererProps = {
  name: string
  argumentsJson: string
  isStreaming?: boolean
}

export function GenUiRenderer({ name, argumentsJson, isStreaming = false }: GenUiRendererProps) {
  let filter: string = "all"
  try {
    const parsed = JSON.parse(argumentsJson)
    if (parsed.filter) filter = parsed.filter
  } catch {
    // ignore
  }

  // 1. Projects Grid rendering / skeleton
  if (name === "show_projects") {
    if (isStreaming) {
      // Pulse skeleton loader
      return (
        <div className="w-full space-y-4 my-2 animate-pulse">
          <div className="h-4 w-32 bg-muted rounded-md" />
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-36 rounded-xl border border-border bg-card/30 p-4 space-y-3">
                <div className="h-4 w-2/3 bg-muted rounded-md" />
                <div className="space-y-1.5 pt-1">
                  <div className="h-3 w-full bg-muted rounded-sm" />
                  <div className="h-3 w-5/6 bg-muted rounded-sm" />
                </div>
                <div className="h-6 w-24 bg-muted rounded-md pt-2" />
              </div>
            ))}
          </div>
        </div>
      )
    }

    const projects = fallbackProjects.filter((p) => {
      if (filter === "featured") return p.featured
      return true
    })

    return (
      <div className="w-full space-y-4 my-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            ⚡ Gen UI: Projects Grid ({filter} filter)
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
            >
              <Card className="h-full flex flex-col bg-card/60 backdrop-blur-md border-border/80 hover:border-primary/30 transition-all hover:shadow-md">
                <CardHeader className="p-4 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-bold text-foreground">
                      {project.title}
                    </CardTitle>
                    {project.featured && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-medium text-amber-500 whitespace-nowrap">
                        <Star className="size-2 fill-amber-500" />
                        Featured
                      </span>
                    )}
                  </div>
                  <CardDescription className="text-xs text-muted-foreground mt-1 line-clamp-3">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                {project.metrics && (
                  <CardContent className="px-4 py-2 border-t border-border/40 text-[10px] text-primary/80 font-medium bg-muted/20">
                    💡 {project.metrics}
                  </CardContent>
                )}
                <CardFooter className="p-3 bg-muted/40 flex items-center justify-between border-t border-border/40">
                  <div className="flex flex-wrap gap-1">
                    {project.tag && (
                      <span className="text-[9px] bg-background/80 text-muted-foreground px-1.5 py-0.5 rounded-md border border-border/40">
                        {project.tag}
                      </span>
                    )}
                  </div>
                  <Button asChild size="sm" variant="ghost" className="h-7 text-[10px] px-2 gap-1 hover:text-primary">
                    <a href={`/projects/${project.slug}`}>
                      Case Study
                      <ExternalLink className="size-2.5" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // 2. Experience Timeline rendering / skeleton
  if (name === "show_experience") {
    if (isStreaming) {
      return (
        <div className="w-full space-y-4 my-2 animate-pulse">
          <div className="h-4 w-36 bg-muted rounded-md" />
          <div className="relative border-l border-border ml-3 pl-6 space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="relative space-y-2">
                <div className="absolute -left-[30px] top-1.5 size-3 rounded-full bg-muted" />
                <div className="h-28 rounded-xl border border-border bg-card/30 p-4 space-y-2">
                  <div className="h-4 w-1/3 bg-muted rounded-md" />
                  <div className="h-3 w-5/6 bg-muted rounded-sm" />
                  <div className="h-3 w-2/3 bg-muted rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="w-full space-y-4 my-2">
        <p className="text-xs font-semibold tracking-wide text-primary uppercase">
          ⚡ Gen UI: Experience Timeline
        </p>
        <div className="relative border-l border-border/80 ml-3 pl-6 space-y-6">
          {profile.experience.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="relative"
            >
              {/* Timeline Bullet */}
              <div className="absolute -left-[31px] top-1.5 flex size-4.5 items-center justify-center rounded-full border border-border bg-background shadow-xs">
                <Briefcase className="size-2.5 text-primary" />
              </div>

              <div className="bg-card/50 backdrop-blur-md p-4 rounded-xl border border-border/80 space-y-2 hover:border-primary/20 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      {exp.role}
                      <span className="text-xs text-muted-foreground font-normal">at {exp.company}</span>
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-2.5" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-2.5" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {exp.description}
                </p>

                {exp.highlights && exp.highlights.length > 0 && (
                  <div className="pt-2 space-y-1">
                    <p className="text-[10px] font-semibold text-foreground uppercase tracking-wide">Key Deliverables:</p>
                    <ul className="grid gap-1 sm:grid-cols-2 text-[10px] text-muted-foreground">
                      {exp.highlights.slice(0, 4).map((highlight) => (
                        <li key={highlight} className="flex items-start gap-1">
                          <CheckCircle2 className="size-3 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return null
}
