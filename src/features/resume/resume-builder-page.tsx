"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, Lock } from "lucide-react"

import { useAppearance } from "@/components/appearance-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useBrandColors } from "@/hooks/use-brand-colors"

import {
  createInitialResumeBuilderState,
  hasEnabledSection,
  ResumeBuilderControls,
} from "./resume-builder-controls"
import {
  isResumeBrandColorValid,
} from "./resume-brand-color-utils"
import {
  loadResumeBuilderSettings,
  saveResumeBuilderSettings,
} from "./resume-builder-storage"
import { ResumePreview } from "./resume-preview"
import {
  resolveResumeBrandColor,
  type ResumeBrandColorSelection,
} from "./resume-brand-color-utils"
import { useDownloadResume } from "./use-download-resume"
import type { ResumeDocument, ResumeLayoutId, ResumeSectionConfig } from "./types"
import { buildResumeDocument, filterDocumentBySections } from "./build-resume-document"
import { DEFAULT_RESUME_SECTIONS } from "./default-sections"


function ResumeBuilderUnlock({
  onUnlocked,
}: {
  onUnlocked: () => void
}) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [configured, setConfigured] = useState(true)

  useEffect(() => {
    void fetch("/api/resume/session")
      .then((response) => response.json())
      .then((data: { configured?: boolean; authorized?: boolean }) => {
        setConfigured(data.configured ?? false)
        if (data.authorized) onUnlocked()
      })
      .catch(() => setConfigured(false))
  }, [onUnlocked])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/resume/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        const data = (await response.json()) as { error?: string }
        setError(data.error ?? "Unable to unlock resume builder.")
        return
      }

      onUnlocked()
    } catch {
      setError("Unable to unlock resume builder.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-foreground">
            <Lock className="size-4" aria-hidden />
            <h1 className="text-lg font-semibold">Resume builder</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Private workspace for tailoring resume PDFs.
          </p>
        </div>

        {!configured ? (
          <p className="text-sm text-destructive">
            Set <code className="text-xs">RESUME_BUILDER_SECRET</code> in{" "}
            <code className="text-xs">.env.local</code> to enable access.
          </p>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="resume-builder-password">Password</Label>
              <Input
                id="resume-builder-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 aria-hidden className="animate-spin" />
                  Unlocking…
                </>
              ) : (
                "Unlock"
              )}
            </Button>
          </>
        )}
      </form>
    </div>
  )
}

function ResumeBuilderWorkspace() {
  const { appearance } = useAppearance()
  const { primary } = useBrandColors()
  const { downloadResume, isGenerating, error } = useDownloadResume()

  const [layout, setLayout] = useState<ResumeLayoutId>(() => {
    const stored = loadResumeBuilderSettings()
    const defaults = createInitialResumeBuilderState(appearance)
    return (stored ?? defaults).layout
  })
  const [sections, setSections] = useState<ResumeSectionConfig>(() => {
    const stored = loadResumeBuilderSettings()
    const defaults = createInitialResumeBuilderState(appearance)
    return (stored ?? defaults).sections
  })
  const [colorSelection, setColorSelection] = useState<ResumeBrandColorSelection>(
    () => {
      const stored = loadResumeBuilderSettings()
      const defaults = createInitialResumeBuilderState(appearance)
      return (stored ?? defaults).colorSelection
    },
  )

  const [editedDocument, setEditedDocument] = useState<ResumeDocument>(() =>
    buildResumeDocument(DEFAULT_RESUME_SECTIONS)
  )

  const previewDocument = useMemo(() =>
    filterDocumentBySections(editedDocument, sections),
    [editedDocument, sections]
  )

  const handleDocumentChange = (updated: ResumeDocument) => {
    setEditedDocument((prev) => {
      const next = { ...prev }
      if (updated.name !== undefined) next.name = updated.name
      if (updated.title !== undefined) next.title = updated.title
      if (updated.location !== undefined) next.location = updated.location
      if (updated.summary !== undefined) next.summary = updated.summary
      if (updated.experience !== undefined) next.experience = updated.experience
      if (updated.education !== undefined) next.education = updated.education
      if (updated.skills !== undefined) next.skills = updated.skills
      if (updated.contact !== undefined) next.contact = updated.contact
      if (updated.certifications !== undefined) next.certifications = updated.certifications
      if (updated.languages !== undefined) next.languages = updated.languages
      if (updated.interests !== undefined) next.interests = updated.interests
      return next
    })
  }

  const brandColor = resolveResumeBrandColor(colorSelection, primary)

  useEffect(() => {
    saveResumeBuilderSettings({ layout, sections, colorSelection })
  }, [layout, sections, colorSelection])

  const handleDownload = () => {
    void downloadResume({
      sections,
      brandColor: resolveResumeBrandColor(colorSelection, primary),
      layout,
      document: previewDocument,
    })
  }

  return (
    <div className="h-svh bg-background">
      <ResizablePanelGroup orientation="horizontal" className="h-full">
        <ResizablePanel
          id="resume-controls"
          defaultSize={380}
          minSize={320}
          maxSize={520}
        >
          <div className="h-full min-w-[320px]">
            <ResumeBuilderControls
              layout={layout}
              onLayoutChange={setLayout}
              sections={sections}
              onSectionsChange={setSections}
              colorSelection={colorSelection}
              onColorSelectionChange={setColorSelection}
              brandColor={brandColor}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id="resume-preview" minSize={480}>
          <ResumePreview
            document={previewDocument}
            colorSelection={colorSelection}
            fallbackColor={primary}
            layout={layout}
            onDownload={handleDownload}
            isGenerating={isGenerating}
            downloadDisabled={
              !hasEnabledSection(sections) ||
              !isResumeBrandColorValid(colorSelection)
            }
            error={error}
            onChange={handleDocumentChange}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export function ResumeBuilderPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    void fetch("/api/resume/session")
      .then((response) => response.json())
      .then((data: { authorized?: boolean }) => setAuthorized(Boolean(data.authorized)))
      .catch(() => setAuthorized(false))
  }, [])

  if (authorized === null) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        <Loader2 aria-hidden className="animate-spin" />
      </div>
    )
  }

  if (!authorized) {
    return <ResumeBuilderUnlock onUnlocked={() => setAuthorized(true)} />
  }

  return <ResumeBuilderWorkspace />
}
