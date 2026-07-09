"use client"

import { useEffect, useMemo, useState } from "react"
import { Link } from "@tanstack/react-router"
import {
  AlertTriangle,
  ChevronDown,
  FileText,
  Link2,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react"

import { useAppearance } from "@/components/appearance-provider"
import { SiteHeader } from "@/components/landing/site-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { ResumeWorkspaceShell } from "@/features/resume/resume-workspace-shell"
import type { ResumeDocument, ResumeLayoutId, ResumeSectionConfig } from "@/features/resume/types"
import { useDownloadResume } from "@/features/resume/use-download-resume"
import { parseLinkedInProfileUrl } from "@/lib/linkedin/parse-linkedin-url"
import { formatResumeValidationError } from "@/features/resume/validate-resume-document"
import { cn } from "@/lib/utils"

import { usePublicResumeGenerate } from "./use-public-resume-generate"
import { filterDocumentBySections } from "@/features/resume/build-resume-document"

type WizardStep = "input" | "preview"

const PROFILE_SOURCES = [
  { label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
  { label: "GitHub", placeholder: "https://github.com/username" },
  { label: "Peerlist", placeholder: "https://peerlist.io/username" },
  { label: "Portfolio", placeholder: "https://yoursite.com" },
] as const

const ONBOARDING_STEPS = [
  {
    id: "paste",
    title: "Paste a profile URL",
    description: "LinkedIn, GitHub, Peerlist, or your portfolio.",
    icon: Link2,
  },
  {
    id: "generate",
    title: "Generate with AI",
    description: "We search public web results and structure your resume.",
    icon: Wand2,
  },
  {
    id: "customize",
    title: "Customize & download",
    description: "Pick a layout, tweak sections, export a PDF.",
    icon: FileText,
  },
] as const

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
  const [showOptionalSummary, setShowOptionalSummary] = useState(false)
  const [activeSourceHint, setActiveSourceHint] = useState(0)

  const [editedDocument, setEditedDocument] = useState<ResumeDocument | null>(null)

  useEffect(() => {
    if (document) {
      setEditedDocument(document)
    } else {
      setEditedDocument(null)
    }
  }, [document])

  const handleDocumentChange = (updated: ResumeDocument) => {
    setEditedDocument((prev) => {
      if (!prev) return prev
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
  const previewDocument = editedDocument ? filterDocumentBySections(editedDocument, sections) : null
  const generationError = error
  const validationError = inputError ? formatResumeValidationError(inputError) : null
  const urlPlaceholder = PROFILE_SOURCES[activeSourceHint]?.placeholder

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
          {step === "input" ? (
            <>
              <div className="mb-10 max-w-2xl space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="size-4" aria-hidden />
                  <p className="text-sm font-medium">AI Resume Builder</p>
                </div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Build a resume from your profile
                </h1>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Paste a public profile URL. We gather what&apos;s available online, draft a
                  structured resume, then you customize the layout and download a PDF.
                </p>
              </div>

              <ol className="mb-8 grid gap-3 sm:grid-cols-3" aria-label="How it works">
                {ONBOARDING_STEPS.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <li
                      key={item.id}
                      className="relative rounded-xl border border-border/80 bg-card/60 p-4"
                    >
                      <div className="mb-3 flex items-center gap-2.5">
                        <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {index + 1}
                        </span>
                        <Icon className="size-4 text-primary" aria-hidden />
                      </div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </li>
                  )
                })}
              </ol>

              <div className="mx-auto max-w-xl space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="space-y-3">
                  <Label htmlFor="profile-url">Profile or portfolio URL</Label>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Supported sources">
                    {PROFILE_SOURCES.map((source, index) => (
                      <button
                        key={source.label}
                        type="button"
                        onClick={() => setActiveSourceHint(index)}
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                          activeSourceHint === index
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground",
                        )}
                      >
                        {source.label}
                      </button>
                    ))}
                  </div>
                  <Input
                    id="profile-url"
                    placeholder={urlPlaceholder}
                    value={linkedinUrl}
                    onChange={(event) => setLinkedinUrl(event.target.value)}
                    autoComplete="url"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowOptionalSummary((open) => !open)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg border border-dashed border-border px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                    aria-expanded={showOptionalSummary}
                  >
                    <span>
                      Add optional context{" "}
                      <span className="text-muted-foreground/80">(if search results are thin)</span>
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 transition-transform",
                        showOptionalSummary && "rotate-180",
                      )}
                      aria-hidden
                    />
                  </button>
                  {showOptionalSummary ? (
                    <div className="space-y-2">
                      <Label htmlFor="profile-text" className="sr-only">
                        Optional profile summary
                      </Label>
                      <Textarea
                        id="profile-text"
                        placeholder="Paste a short headline, about section, or experience notes to improve accuracy…"
                        value={profileText}
                        onChange={(event) => setProfileText(event.target.value)}
                        rows={4}
                      />
                    </div>
                  ) : null}
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
                  className="h-11 w-full"
                  disabled={isGenerating}
                  onClick={() => void handleGenerate()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" aria-hidden />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Wand2 aria-hidden />
                      Generate resume
                    </>
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Free · 3 generations per day · No account required
                </p>
              </div>
            </>
          ) : (
            <div className="h-[calc(100svh-10rem)] min-h-[480px] overflow-hidden rounded-xl border border-border md:min-h-[640px] md:h-[calc(100svh-14rem)]">
              <ResumeWorkspaceShell
                controls={
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
                }
                preview={
                  previewDocument ? (
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
                      onChange={handleDocumentChange}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No preview available.
                    </div>
                  )
                }
              />
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
