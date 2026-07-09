import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { hexToRgba } from "../color-utils"
import type { CoverLetterDocument, ResumeLayoutId } from "../types"
import { RESUME_SPACING } from "./spacing-tokens"

const classic = RESUME_SPACING.classic
const designer = RESUME_SPACING.designer
const modern = RESUME_SPACING.modern
const minimal = RESUME_SPACING.minimal
const executive = RESUME_SPACING.executive

const styles = StyleSheet.create({
  pageClassic: {
    fontFamily: "Helvetica",
    fontSize: classic.fontSize,
    lineHeight: classic.lineHeight,
    color: "#171717",
    paddingTop: classic.page.paddingTop,
    paddingBottom: classic.page.paddingBottom,
    paddingLeft: classic.page.paddingLeft,
    paddingRight: classic.page.paddingRight,
  },
  pageDesigner: {
    position: "relative",
    fontFamily: "Helvetica",
    fontSize: designer.fontSize,
    lineHeight: designer.lineHeight,
    color: "#171717",
    paddingTop: designer.page.paddingTop,
    paddingBottom: designer.page.paddingBottom,
    paddingLeft: designer.page.paddingLeft,
    paddingRight: designer.page.paddingRight,
  },
  pageModern: {
    fontFamily: "Helvetica",
    fontSize: modern.fontSize,
    lineHeight: modern.lineHeight,
    color: "#171717",
    paddingTop: modern.page.paddingTop,
    paddingBottom: modern.page.paddingBottom,
    paddingLeft: modern.page.paddingLeft,
    paddingRight: modern.page.paddingRight,
  },
  pageMinimal: {
    fontFamily: "Helvetica",
    fontSize: minimal.fontSize,
    lineHeight: minimal.lineHeight,
    color: "#171717",
    paddingTop: minimal.page.paddingTop,
    paddingBottom: minimal.page.paddingBottom,
    paddingLeft: minimal.page.paddingLeft,
    paddingRight: minimal.page.paddingRight,
  },
  pageExecutive: {
    fontFamily: "Helvetica",
    fontSize: executive.fontSize,
    lineHeight: executive.lineHeight,
    color: "#171717",
    paddingTop: executive.page.paddingTop,
    paddingBottom: executive.page.paddingBottom,
    paddingLeft: executive.page.paddingLeft,
    paddingRight: executive.page.paddingRight,
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
  headerExecutive: {
    marginBottom: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 4,
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
  nameMinimal: {
    fontSize: 20,
    fontWeight: 700,
    paddingBottom: 4,
  },
  nameExecutive: {
    fontSize: 24,
    fontWeight: 700,
    color: "#FFFFFF",
    paddingBottom: 4,
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
  titleMinimal: {
    fontSize: 11,
    paddingBottom: 4,
  },
  titleExecutive: {
    fontSize: 12,
    fontWeight: 700,
    color: "#FFFFFF",
    paddingBottom: 4,
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
  metaMinimal: {
    fontSize: 8.5,
    color: "#737373",
  },
  metaExecutive: {
    fontSize: 9,
    color: "rgba(255,255,255,0.85)",
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

  const renderMinimalHeader = () => (
    <View style={[styles.headerClassic, { borderBottomColor: brandColor, borderBottomWidth: 1 }]}>
      <Text style={styles.nameMinimal}>{document.senderName}</Text>
      <Text style={[styles.titleMinimal, { color: brandColor }]}>{document.senderTitle}</Text>
      <Text style={styles.metaMinimal}>
        {document.senderLocation}
        {document.senderContact?.email ? `  ·  ${document.senderContact.email}` : ""}
        {document.senderContact?.phone ? `  ·  ${document.senderContact.phone}` : ""}
      </Text>
    </View>
  )

  const renderExecutiveHeader = () => (
    <View style={[styles.headerExecutive, { backgroundColor: brandColor }]}>
      <Text style={styles.nameExecutive}>{document.senderName}</Text>
      <Text style={styles.titleExecutive}>{document.senderTitle}</Text>
      <Text style={styles.metaExecutive}>
        {document.senderLocation}
        {document.senderContact?.email ? `  ·  ${document.senderContact.email}` : ""}
        {document.senderContact?.phone ? `  ·  ${document.senderContact.phone}` : ""}
      </Text>
    </View>
  )

  const renderLetterBody = () => (
    <View style={styles.letterContent}>
      <Text style={styles.date}>{document.date}</Text>
      <View style={styles.recipientBlock}>
        <Text style={styles.recipientName}>{document.recipientName}</Text>
        <Text style={styles.recipientCompany}>{document.recipientCompany}</Text>
        {document.recipientAddress ? (
          <Text style={styles.recipientAddress}>{document.recipientAddress}</Text>
        ) : null}
      </View>
      {document.subject ? <Text style={styles.subject}>{document.subject}</Text> : null}
      {document.body.split("\n\n").map((p, idx) => (
        <Text key={idx} style={styles.paragraph}>
          {p}
        </Text>
      ))}
      {document.signOff ? <Text style={styles.signOff}>{document.signOff}</Text> : null}
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

  if (layout === "minimal") {
    return (
      <Document>
        <Page size="A4" style={styles.pageMinimal}>
          {renderMinimalHeader()}
          {renderLetterBody()}
        </Page>
      </Document>
    )
  }

  if (layout === "executive") {
    return (
      <Document>
        <Page size="A4" style={styles.pageExecutive}>
          {renderExecutiveHeader()}
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
