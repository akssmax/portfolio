"use client"

import { useEffect, useMemo, useState } from "react"
import { Link } from "@tanstack/react-router"
import { AlertTriangle, Loader2, Sparkles } from "lucide-react"

import { useAppearance } from "@/components/appearance-provider"
import { SiteHeader } from "@/components/landing/site-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
} from "@/features/resume/resume-builder-controls"
import {
  isResumeBrandColorValid,
  resolveResumeBrandColor,
  type ResumeBrandColorSelection,
} from "@/features/resume/resume-brand-color-utils"
import { ResumePreview } from "@/features/resume/resume-preview"
import type { ResumeDocument, ResumeLayoutId, ResumeSectionConfig } from "@/features/resume/types"
import { useDownloadResume } from "@/features/resume/use-download-resume"
import { parseLinkedInProfileUrl } from "@/lib/linkedin/parse-linkedin-url"
import { formatResumeValidationError } from "@/features/resume/validate-resume-document"

import { usePublicResumeGenerate } from "./use-public-resume-generate"

type WizardStep = "input" | "preview"

function filterDocumentBySections(
  document: ResumeDocument,
  sections: ResumeSectionConfig,
): ResumeDocument {
  return {
    ...document,
    summary: sections.summary ? document.summary : undefined,
    experience: sections.experience ? document.experience : undefined,
    education: sections.education ? document.education : undefined,
    skills: sections.skills ? document.skills : undefined,
    contact: sections.contact ? document.contact : undefined,
    certifications: sections.certifications ? document.certifications : undefined,
    languages: sections.languages ? document.languages : undefined,
    interests: sections.interests ? document.interests : undefined,
  }
}

export function PublicResumeWizard() {
  const { appearance } = useAppearance()
  const { primary } = useBrandColors()
  const { generate, reset, phase, statusMessage, error, document, isGenerating } =
    usePublicResumeGenerate()
  const { downloadResume, isGenerating: isDownloading, error: downloadError } =
    useDownloadResume()

  const [step, setStep] = useState<WizardStep>("input")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [profileText, setProfileText] = useState("")
  const [inputError, setInputError] = useState<string | null>(null)

  const defaults = useMemo(
    () => createInitialResumeBuilderState(appearance),
    [appearance],
  )
  const [layout, setLayout] = useState<ResumeLayoutId>(defaults.layout)
  const [sections, setSections] = useState<ResumeSectionConfig>(defaults.sections)
  const [colorSelection, setColorSelection] = useState<ResumeBrandColorSelection>(
    defaults.colorSelection,
  )

  useEffect(() => {
    setLayout(defaults.layout)
    setColorSelection(defaults.colorSelection)
  }, [defaults])

  const brandColor = resolveResumeBrandColor(colorSelection, primary)
  const previewDocument = document ? filterDocumentBySections(document, sections) : null
  const generationError = error
  const validationError = inputError ? formatResumeValidationError(inputError) : null

  const handleGenerate = async () => {
    setInputError(null)
    const parsed = parseLinkedInProfileUrl(linkedinUrl)
    if (!parsed) {
      setInputError("Provide a valid profile or portfolio URL (e.g. LinkedIn, GitHub, Peerlist, or portfolio link).")
      return
    }

    try {
      await generate({
        linkedinUrl: parsed.normalizedUrl,
        profileText: profileText.trim() || undefined,
      })
      setStep("preview")
    } catch {
      // error state handled in hook
    }
  }

  const handleStartOver = () => {
    reset()
    setStep("input")
    setInputError(null)
  }

  const handleDownload = () => {
    if (!previewDocument) return
    void downloadResume({
      sections,
      brandColor,
      layout,
      document: previewDocument,
    })
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main className="border-t border-border">
        <div className="container mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="mb-8 max-w-2xl space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="size-4" aria-hidden />
              <p className="text-sm font-medium">AI Resume Builder</p>
            </div>
             <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Build a resume from your profile
            </h1>
            <p className="text-muted-foreground">
              Paste a LinkedIn, GitHub, Peerlist, or portfolio URL to get started. We search the web for public
              snippets, structure a resume with Mistral, and let you customize the PDF export.
            </p>
            <p className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              AI-generated from public web results — verify details before use. A profile
              summary is optional and only needed when search results are thin.
            </p>
          </div>

          {step === "input" ? (
            <div className="mx-auto max-w-xl space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="space-y-2">
                <Label htmlFor="profile-url">Profile or Portfolio URL</Label>
                <Input
                  id="profile-url"
                  placeholder="https://linkedin.com/in/username or https://github.com/username"
                  value={linkedinUrl}
                  onChange={(event) => setLinkedinUrl(event.target.value)}
                  autoComplete="url"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-text">
                  Optional profile summary{" "}
                  <span className="font-normal text-muted-foreground">(fallback)</span>
                </Label>
                <Textarea
                  id="profile-text"
                  placeholder="Optional — paste headline, experience, or about text to improve accuracy…"
                  value={profileText}
                  onChange={(event) => setProfileText(event.target.value)}
                  rows={5}
                />
              </div>
              {validationError ? (
                <Alert variant="destructive">
                  <AlertTriangle />
                  <AlertTitle>{validationError.title}</AlertTitle>
                  <AlertDescription>{validationError.description}</AlertDescription>
                </Alert>
              ) : null}
              {generationError ? (
                <Alert variant="destructive">
                  <AlertTriangle />
                  <AlertTitle>{generationError.title}</AlertTitle>
                  <AlertDescription>{generationError.description}</AlertDescription>
                </Alert>
              ) : null}
              {isGenerating && statusMessage ? (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  {statusMessage}
                </p>
              ) : null}
              <Button
                type="button"
                className="w-full"
                disabled={isGenerating}
                onClick={() => void handleGenerate()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden />
                    Generating…
                  </>
                ) : (
                  "Generate resume"
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Free · 3 generations per day · No account required
              </p>
            </div>
          ) : (
            <div className="h-[calc(100svh-14rem)] min-h-[640px] overflow-hidden rounded-xl border border-border">
              <ResizablePanelGroup orientation="horizontal" className="h-full">
                <ResizablePanel defaultSize={380} minSize={320} maxSize={520}>
                  <div className="flex h-full flex-col">
                    <div className="border-b border-border px-5 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">Customize</p>
                          <p className="text-xs text-muted-foreground">
                            {phase === "ready" ? "Ready to download" : statusMessage}
                          </p>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={handleStartOver}>
                          Start over
                        </Button>
                      </div>
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto">
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
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel minSize={480}>
                  {previewDocument ? (
                    <ResumePreview
                      document={previewDocument}
                      colorSelection={colorSelection}
                      fallbackColor={primary}
                      layout={layout}
                      onDownload={handleDownload}
                      isGenerating={isDownloading}
                      downloadDisabled={
                        !hasEnabledSection(sections) ||
                        !isResumeBrandColorValid(colorSelection)
                      }
                      error={downloadError}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No preview available.
                    </div>
                  )}
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          )}

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Built by{" "}
            <Link to="/" className="text-foreground underline-offset-4 hover:underline">
              Akshay Saini
            </Link>
            {" · "}
            <Link
              to="/projects/$slug"
              params={{ slug: "resume-builder" }}
              className="text-foreground underline-offset-4 hover:underline"
            >
              Case study
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
