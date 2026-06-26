"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, Lock } from "lucide-react"


import {
  ResumeBuilderControls,
  createInitialResumeBuilderState,
  hasEnabledSection,
} from "./resume-builder-controls"
import {
  isResumeBrandColorValid,
  
  resolveResumeBrandColor

} from "./resume-brand-color-utils"
import {
  loadCoverLetterDocument,
  loadResumeBuilderSettings,
  saveCoverLetterDocument,
  saveResumeBuilderSettings,
} from "./resume-builder-storage"
import { ResumePreview } from "./resume-preview"
import { useDownloadResume } from "./use-download-resume"
import { downloadCoverLetterPdf } from "./generate-resume-pdf"
import { buildResumeDocument, filterDocumentBySections } from "./build-resume-document"
import { DEFAULT_RESUME_SECTIONS } from "./default-sections"
import type {ResumeBrandColorSelection} from "./resume-brand-color-utils";
import type { CoverLetterDocument, ResumeDocument, ResumeLayoutId, ResumeSectionConfig } from "./types"
import { useBrandColors } from "@/hooks/use-brand-colors"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAppearance } from "@/components/appearance-provider"

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
  const { downloadResume, isGenerating: isGeneratingResume, error: resumeError } = useDownloadResume()

  // Workspace Navigation & Controls State
  const [activeTab, setActiveTab] = useState<"resume" | "cover-letter">("resume")
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)

  // Cover Letter AI Settings State
  const [companyName, setCompanyName] = useState(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("cl-meta-company") || ""
    }
    return ""
  })
  const [jobTitle, setJobTitle] = useState(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("cl-meta-role") || ""
    }
    return ""
  })
  const [instructions, setInstructions] = useState(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("cl-meta-instructions") || ""
    }
    return ""
  })
  const [coverLetterDocument, setCoverLetterDocument] = useState<CoverLetterDocument | null>(() => {
    return loadCoverLetterDocument()
  })
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false)

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
      next.name = updated.name
      next.title = updated.title
      next.location = updated.location
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

  const handleCoverLetterChange = (updated: CoverLetterDocument) => {
    setCoverLetterDocument(updated)
    saveCoverLetterDocument(updated)
  }

  const brandColor = resolveResumeBrandColor(colorSelection, primary)

  // Auto-saves layout settings
  useEffect(() => {
    saveResumeBuilderSettings({ layout, sections, colorSelection })
  }, [layout, sections, colorSelection])

  // Auto-saves AI letter settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("cl-meta-company", companyName)
      window.localStorage.setItem("cl-meta-role", jobTitle)
      window.localStorage.setItem("cl-meta-instructions", instructions)
    }
  }, [companyName, jobTitle, instructions])

  const handleDownload = async () => {
    setPdfError(null)
    if (activeTab === "resume") {
      void downloadResume({
        sections,
        brandColor,
        layout,
        document: previewDocument,
      })
    } else if (coverLetterDocument) {
      setIsGeneratingPdf(true)
      try {
        await downloadCoverLetterPdf({
          document: coverLetterDocument,
          brandColor,
          layout,
        })
      } catch (cause) {
        setPdfError(
          cause instanceof Error ? cause.message : "Unable to generate cover letter PDF.",
        )
      } finally {
        setIsGeneratingPdf(false)
      }
    }
  }

  const handleGenerateCoverLetter = async () => {
    if (!companyName || !jobTitle) return
    setIsGeneratingCoverLetter(true)
    setPdfError(null)

    try {
      const response = await fetch("/api/resume/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeDocument: editedDocument,
          companyName,
          jobTitle,
          additionalInstructions: instructions,
        }),
      })

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: { message?: string } }
        setPdfError(errorData.error?.message || "Failed to generate cover letter.")
        return
      }

      const data = (await response.json()) as CoverLetterDocument
      setCoverLetterDocument(data)
      saveCoverLetterDocument(data)
    } catch {
      setPdfError("Error communicating with AI cover letter generator. Check details.")
    } finally {
      setIsGeneratingCoverLetter(false)
    }
  }

  const isGenerating = isGeneratingResume || isGeneratingPdf
  const error = resumeError || pdfError

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
              
              activeTab={activeTab}
              companyName={companyName}
              onCompanyNameChange={setCompanyName}
              jobTitle={jobTitle}
              onJobTitleChange={setJobTitle}
              instructions={instructions}
              onInstructionsChange={setInstructions}
              onGenerateCoverLetter={handleGenerateCoverLetter}
              isGeneratingCoverLetter={isGeneratingCoverLetter}
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
              activeTab === "resume"
                ? !hasEnabledSection(sections) || !isResumeBrandColorValid(colorSelection)
                : !coverLetterDocument || !isResumeBrandColorValid(colorSelection)
            }
            error={error}
            onChange={handleDocumentChange}
            
            activeTab={activeTab}
            onActiveTabChange={setActiveTab}
            coverLetterDocument={coverLetterDocument}
            onCoverLetterDocumentChange={handleCoverLetterChange}
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
