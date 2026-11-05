import { Text, View } from "@react-pdf/renderer"

/**
 * "Product 2 of 3 with founder Shardul Lavekar", as a small outlined pill under
 * the job header. Real text, so ATS and AI parsers still read it.
 */
const BADGE = {
  border: "#CBD5E1",
  background: "#F8FAFC",
  text: "#334155",
} as const

const PDF_PILL = {
  borderWidth: 0.75,
  borderColor: BADGE.border,
  backgroundColor: BADGE.background,
  borderRadius: 6,
  paddingHorizontal: 5,
  paddingVertical: 1.5,
} as const

/**
 * Own line under the header by default. `inline` sits at the end of the
 * location line instead, adding no height (used by the tighter layouts).
 */
export function PdfFounderBadge({ label, inline }: { label?: string; inline?: boolean }) {
  if (!label) return null
  if (inline) {
    return (
      <View style={[PDF_PILL, { marginLeft: 6, paddingVertical: 0.5 }]}>
        <Text style={{ fontSize: 7, color: BADGE.text }}>{label}</Text>
      </View>
    )
  }
  return (
    <View style={{ flexDirection: "row", marginTop: 3, marginBottom: 2 }}>
      <View
        style={{
          borderWidth: 0.75,
          borderColor: BADGE.border,
          backgroundColor: BADGE.background,
          borderRadius: 6,
          paddingHorizontal: 5,
          paddingVertical: 1.5,
        }}
      >
        <Text style={{ fontSize: 7.5, color: BADGE.text }}>{label}</Text>
      </View>
    </View>
  )
}

const htmlPill = (inline?: boolean) =>
  ({
    display: "inline-block",
    border: `0.75pt solid ${BADGE.border}`,
    backgroundColor: BADGE.background,
    color: BADGE.text,
    borderRadius: "6pt",
    padding: inline ? "0.5pt 5pt" : "1.5pt 5pt",
    fontSize: inline ? "7pt" : "7.5pt",
    fontWeight: 400,
    lineHeight: 1.2,
    marginLeft: inline ? "6pt" : 0,
    verticalAlign: "middle",
  }) as const

/** HTML twin of {@link PdfFounderBadge}, sized in pt like the PDF. */
export function HtmlFounderBadge({ label, inline }: { label?: string; inline?: boolean }) {
  if (!label) return null
  if (inline) return <span style={htmlPill(true)}>{label}</span>
  return (
    <p style={{ margin: "0.3em 0 0.2em", lineHeight: 1 }}>
      <span style={htmlPill()}>{label}</span>
    </p>
  )
}
