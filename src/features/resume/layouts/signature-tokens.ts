/**
 * Signature layout — one set of measurements (in PDF points) shared by the
 * editable HTML preview and the downloaded PDF, so both paginate the same way.
 *
 * A4 is 595.28 × 841.89 pt. The HTML preview converts with `pt()` (96 / 72).
 */
export const SIGNATURE = {
  page: {
    width: 595.28,
    height: 841.89,
    /** Applied on every page, so content never touches a page edge. */
    marginTop: 40,
    marginBottom: 46,
    marginX: 44,
  },
  footer: {
    /** Distance from the page bottom to the footer baseline area. */
    bottom: 20,
    fontSize: 7.5,
  },
  font: {
    name: 22,
    title: 11,
    tagline: 9.5,
    body: 9.5,
    small: 8.5,
    tiny: 7.5,
    sectionTitle: 8,
    role: 10.5,
    metricValue: 13,
  },
  lineHeight: 1.45,
  /** Vertical rhythm between blocks. */
  gap: {
    section: 16,
    item: 10,
    sectionTitle: 6,
    bullet: 2,
  },
  color: {
    ink: "#101828",
    body: "#344054",
    muted: "#667085",
    faint: "#98A2B3",
    rule: "#EAECF0",
    surface: "#F9FAFB",
  },
} as const

/** PDF points → CSS pixels. */
export function pt(value: number): number {
  return (value * 96) / 72
}

export const SIGNATURE_CONTENT_WIDTH_PT =
  SIGNATURE.page.width - SIGNATURE.page.marginX * 2

export const SIGNATURE_CONTENT_HEIGHT_PT =
  SIGNATURE.page.height - SIGNATURE.page.marginTop - SIGNATURE.page.marginBottom

export function formatSignatureWebsiteLabel(url: string): string {
  return url.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "")
}
