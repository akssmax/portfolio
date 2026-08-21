import { resolveQuotePdfColor } from "./color-utils"
import { ensureQuotePdfFonts } from "./quote-fonts"
import { QuotePdfDocument } from "./layouts/quote-pdf-document"
import type { QuoteDocument } from "./types"

export async function generateQuotePdf(
  document: QuoteDocument,
  brandColor: string,
): Promise<Blob> {
  const { pdf } = await import("@react-pdf/renderer")
  await ensureQuotePdfFonts()

  return pdf(
    <QuotePdfDocument
      document={document}
      brandColor={resolveQuotePdfColor(brandColor)}
    />,
  ).toBlob()
}

export function getQuoteFilename(document: QuoteDocument): string {
  const clientSlug = document.clientCompany
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  const quoteSlug = document.quoteNumber.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  const parts = [clientSlug || "quotation", quoteSlug].filter(Boolean)
  return `${parts.join("-")}.pdf`
}

export async function downloadQuotePdf({
  document,
  brandColor,
}: {
  document: QuoteDocument
  brandColor: string
}) {
  const blob = await generateQuotePdf(document, brandColor)
  const url = URL.createObjectURL(blob)
  const anchor = window.document.createElement("a")
  anchor.href = url
  anchor.download = getQuoteFilename(document)
  window.document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
