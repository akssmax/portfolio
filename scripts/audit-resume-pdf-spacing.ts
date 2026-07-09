/**
 * Generates resume PDFs for all layouts and PNG previews for spacing audit.
 * Run: node --import tsx scripts/audit-resume-pdf-spacing.ts
 */
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { buildResumeDocument } from "../src/features/resume/build-resume-document"
import { generateResumePdf } from "../src/features/resume/generate-resume-pdf"
import { DEFAULT_RESUME_SECTIONS } from "../src/features/resume/default-sections"
import type { ResumeDocument, ResumeLayoutId } from "../src/features/resume/types"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, "..")
const PUBLIC = path.join(ROOT, "public")
const OUT_DIR = process.env.RESUME_PDF_AUDIT_DIR ?? "/tmp/resume-pdf-audit"

const LAYOUTS: ResumeLayoutId[] = [
  "classic",
  "minimal",
  "modern",
  "designer",
  "executive",
]

const BRAND_COLOR = "#0F766E"

function toAbsolutePublicPath(relativePath: string): string {
  const normalized = relativePath.startsWith("/") ? relativePath.slice(1) : relativePath
  return path.join(PUBLIC, normalized)
}

function resolveDocumentPaths(document: ResumeDocument): ResumeDocument {
  return {
    ...document,
    portrait: document.portrait
      ? { ...document.portrait, src: toAbsolutePublicPath(document.portrait.src) }
      : undefined,
    experience: document.experience?.map((job) => ({
      ...job,
      logoSrc: job.logoSrc ? toAbsolutePublicPath(job.logoSrc) : undefined,
    })),
  }
}

async function blobToBuffer(blob: Blob): Promise<Buffer> {
  const arrayBuffer = await blob.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const document = resolveDocumentPaths(buildResumeDocument(DEFAULT_RESUME_SECTIONS))
  const summary: Array<{ layout: ResumeLayoutId; pages: number; bytes: number }> = []

  for (const layout of LAYOUTS) {
    process.stdout.write(`Generating ${layout}… `)
    const blob = await generateResumePdf(document, BRAND_COLOR, layout, "inter")
    const buffer = await blobToBuffer(blob)
    const pdfPath = path.join(OUT_DIR, `${layout}.pdf`)
    await writeFile(pdfPath, buffer)

    // Page count via simple PDF trailer scan
    const pdfText = buffer.toString("latin1")
    const countMatch = pdfText.match(/\/Type\s*\/Page[^s]/g)
    const pages = countMatch?.length ?? 0

    summary.push({ layout, pages, bytes: buffer.length })
    console.log(`${pages} page(s), ${(buffer.length / 1024).toFixed(1)} KB → ${pdfPath}`)
  }

  await writeFile(
    path.join(OUT_DIR, "summary.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), layouts: summary }, null, 2),
  )

  console.log("\nDone. Output:", OUT_DIR)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
