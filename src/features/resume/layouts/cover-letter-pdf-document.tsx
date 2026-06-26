import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { hexToRgba } from "../color-utils"
import type { CoverLetterDocument, ResumeLayoutId } from "../types"

// PDF Page Margin coordinates
const CLASSIC_MARGINS = {
  paddingTop: 40,
  paddingBottom: 40,
  paddingHorizontal: 44,
}

const DESIGNER_MARGINS = {
  paddingTop: 34,
  paddingBottom: 44,
  paddingRight: 40,
  paddingLeft: 60,
}

const MODERN_MARGINS = {
  paddingTop: 36,
  paddingBottom: 40,
  paddingHorizontal: 40,
}

const styles = StyleSheet.create({
  pageClassic: {
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.45,
    color: "#171717",
    ...CLASSIC_MARGINS,
  },
  pageDesigner: {
    position: "relative",
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.45,
    color: "#171717",
    ...DESIGNER_MARGINS,
  },
  pageModern: {
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.45,
    color: "#171717",
    ...MODERN_MARGINS,
  },
  sidebarStripe: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 8,
  },
  headerClassic: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
  },
  headerDesigner: {
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  headerModern: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    paddingBottom: 12,
  },
  nameClassic: {
    fontSize: 22,
    fontWeight: 700,
    paddingBottom: 4,
  },
  nameDesigner: {
    fontSize: 24,
    fontWeight: 700,
    color: "#0F1923",
    paddingBottom: 4,
  },
  nameModern: {
    fontSize: 22,
    fontWeight: 700,
    color: "#0F1923",
  },
  titleClassic: {
    fontSize: 12,
    paddingBottom: 4,
  },
  titleDesigner: {
    fontSize: 11,
    fontWeight: 700,
    paddingBottom: 4,
  },
  titleModern: {
    fontSize: 11,
    fontWeight: 700,
    marginTop: 2,
  },
  metaClassic: {
    fontSize: 9,
    color: "#525252",
  },
  metaDesigner: {
    fontSize: 9,
    color: "#737373",
  },
  metaModern: {
    fontSize: 9,
    color: "#737373",
    marginTop: 4,
  },
  letterContent: {
    flex: 1,
    flexDirection: "column",
    gap: 12,
  },
  date: {
    fontSize: 9.5,
    color: "#4B5563",
    marginBottom: 8,
  },
  recipientBlock: {
    fontSize: 9.5,
    marginBottom: 10,
  },
  recipientName: {
    fontWeight: 700,
    color: "#111827",
  },
  recipientCompany: {
    color: "#1F2937",
  },
  recipientAddress: {
    color: "#4B5563",
  },
  subject: {
    fontWeight: 700,
    fontSize: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 4,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 10,
    color: "#1F2937",
    lineHeight: 1.5,
    textAlign: "justify",
    marginBottom: 10,
  },
  signOff: {
    fontSize: 10,
    color: "#1F2937",
    marginTop: 15,
    lineHeight: 1.5,
  },
})

export function CoverLetterPdfDocument({
  document,
  brandColor,
  layout = "classic",
}: {
  document: CoverLetterDocument
  brandColor: string
  layout: ResumeLayoutId
}) {
  const tint = hexToRgba(brandColor, 0.08)

  const renderClassicHeader = () => (
    <View style={[styles.headerClassic, { borderBottomColor: brandColor }]}>
      <Text style={[styles.nameClassic, { color: brandColor }]}>{document.senderName}</Text>
      <Text style={styles.titleClassic}>{document.senderTitle}</Text>
      <Text style={styles.metaClassic}>
        {document.senderLocation}
        {document.senderContact?.email ? `  ·  ${document.senderContact.email}` : ""}
        {document.senderContact?.phone ? `  ·  ${document.senderContact.phone}` : ""}
      </Text>
    </View>
  )

  const renderDesignerHeader = () => (
    <View style={[styles.headerDesigner, { backgroundColor: tint }]}>
      <Text style={[styles.nameDesigner, { color: brandColor }]}>{document.senderName}</Text>
      <Text style={[styles.titleDesigner, { color: brandColor }]}>{document.senderTitle}</Text>
      <Text style={styles.metaDesigner}>
        {document.senderLocation}
        {document.senderContact?.email ? `  ·  ${document.senderContact.email}` : ""}
        {document.senderContact?.phone ? `  ·  ${document.senderContact.phone}` : ""}
      </Text>
    </View>
  )

  const renderModernHeader = () => (
    <View style={[styles.headerModern, { borderBottomColor: brandColor }]}>
      <Text style={[styles.nameModern, { color: "#0F1923" }]}>{document.senderName}</Text>
      <Text style={[styles.titleModern, { color: brandColor }]}>{document.senderTitle}</Text>
      <Text style={styles.metaModern}>
        {document.senderLocation}
        {document.senderContact?.email ? `  ·  ${document.senderContact.email}` : ""}
        {document.senderContact?.phone ? `  ·  ${document.senderContact.phone}` : ""}
      </Text>
    </View>
  )

  const renderLetterBody = () => (
    <View style={styles.letterContent}>
      {/* Date */}
      <Text style={styles.date}>{document.date}</Text>

      {/* Recipient */}
      <View style={styles.recipientBlock}>
        <Text style={styles.recipientName}>{document.recipientName}</Text>
        <Text style={styles.recipientCompany}>{document.recipientCompany}</Text>
        {document.recipientAddress ? (
          <Text style={styles.recipientAddress}>{document.recipientAddress}</Text>
        ) : null}
      </View>

      {/* Subject */}
      {document.subject ? (
        <Text style={styles.subject}>{document.subject}</Text>
      ) : null}

      {/* Body paragraphs */}
      {document.body.split("\n\n").map((p, idx) => (
        <Text key={idx} style={styles.paragraph}>
          {p}
        </Text>
      ))}

      {/* Sign off */}
      {document.signOff ? (
        <Text style={styles.signOff}>{document.signOff}</Text>
      ) : null}
    </View>
  )

  if (layout === "designer") {
    return (
      <Document>
        <Page size="A4" style={styles.pageDesigner}>
          <View style={[styles.sidebarStripe, { backgroundColor: brandColor }]} />
          {renderDesignerHeader()}
          {renderLetterBody()}
        </Page>
      </Document>
    )
  }

  if (layout === "modern") {
    return (
      <Document>
        <Page size="A4" style={styles.pageModern}>
          {renderModernHeader()}
          {renderLetterBody()}
        </Page>
      </Document>
    )
  }

  return (
    <Document>
      <Page size="A4" style={styles.pageClassic}>
        {renderClassicHeader()}
        {renderLetterBody()}
      </Page>
    </Document>
  )
}
