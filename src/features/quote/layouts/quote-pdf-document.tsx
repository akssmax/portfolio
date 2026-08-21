import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"


import { blendQuoteColorOverWhite } from "../color-utils"
import { QUOTE_PDF_FONT_FAMILY, QUOTE_PDF_MONO_FAMILY } from "../quote-fonts"
import { QuotePdfLogomark } from "./quote-pdf-logomark"
import type { QuoteDocument } from "../types"
import type { ReactNode } from "react"
import { BRAND_NAVY } from "@/lib/brand/logo-paths"

const PAGE_MARGIN = {
  paddingTop: 34,
  paddingBottom: 48,
  paddingLeft: 44,
  paddingRight: 44,
} as const

const INK = "#171717"
const INK_SOFT = "#404040"
const INK_MUTED = "#737373"
const HAIRLINE = "#E5E5E5"

const styles = StyleSheet.create({
  page: {
    fontFamily: QUOTE_PDF_FONT_FAMILY,
    fontSize: 9.5,
    lineHeight: 1.42,
    color: INK,
    ...PAGE_MARGIN,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  eyebrow: {
    fontFamily: QUOTE_PDF_MONO_FAMILY,
    fontWeight: 700,
    fontSize: 8,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  quoteNumber: {
    fontFamily: QUOTE_PDF_MONO_FAMILY,
    fontSize: 8,
    color: INK_MUTED,
    textAlign: "right",
  },
  titleBlock: {
    marginBottom: 12,
  },
  title: {
    fontFamily: QUOTE_PDF_FONT_FAMILY,
    fontWeight: 700,
    fontSize: 21,
    lineHeight: 1.15,
    color: BRAND_NAVY,
    marginBottom: 6,
  },
  clientLine: {
    fontSize: 11,
    color: INK_SOFT,
  },
  metaRow: {
    flexDirection: "row",
    gap: 24,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: HAIRLINE,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontFamily: QUOTE_PDF_MONO_FAMILY,
    fontWeight: 700,
    fontSize: 7,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: INK_MUTED,
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 9.5,
    fontWeight: 700,
    color: BRAND_NAVY,
  },
  section: {
    marginTop: 9,
  },
  sectionEyebrow: {
    fontFamily: QUOTE_PDF_MONO_FAMILY,
    fontWeight: 700,
    fontSize: 8,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 4,
    color: INK_SOFT,
  },
  scopeList: {
    marginTop: 2,
  },
  scopeItem: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 2.5,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  scopeIndex: {
    fontFamily: QUOTE_PDF_MONO_FAMILY,
    fontWeight: 700,
    fontSize: 9,
    width: 20,
  },
  scopeText: {
    flex: 1,
    color: INK_SOFT,
  },
  exclusionsText: {
    fontSize: 8.5,
    color: INK_MUTED,
    lineHeight: 1.55,
  },
  timelineCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: HAIRLINE,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  timelineValue: {
    fontFamily: QUOTE_PDF_FONT_FAMILY,
    fontWeight: 700,
    fontSize: 13,
    color: BRAND_NAVY,
  },
  timelineNote: {
    flex: 1,
    fontSize: 8.5,
    color: INK_MUTED,
    lineHeight: 1.45,
  },
  investmentCard: {
    borderRadius: 10,
    padding: 10,
    marginTop: 2,
  },
  investmentAmountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  investmentAmount: {
    fontFamily: QUOTE_PDF_FONT_FAMILY,
    fontWeight: 700,
    fontSize: 20,
    color: BRAND_NAVY,
  },
  investmentGst: {
    fontFamily: QUOTE_PDF_MONO_FAMILY,
    fontSize: 8.5,
    color: INK_MUTED,
  },
  milestoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 6,
  },
  milestonePercent: {
    fontFamily: QUOTE_PDF_MONO_FAMILY,
    fontWeight: 700,
    fontSize: 9,
    width: 34,
  },
  milestoneLabel: {
    fontSize: 9.5,
    color: INK_SOFT,
  },
  supportText: {
    color: INK_SOFT,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: PAGE_MARGIN.paddingLeft,
    right: PAGE_MARGIN.paddingRight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: HAIRLINE,
    paddingTop: 10,
  },
  footerBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerText: {
    fontFamily: QUOTE_PDF_MONO_FAMILY,
    fontSize: 7.5,
    color: INK_MUTED,
  },
})

function Section({
  label,
  brandColor,
  children,
}: {
  label: string
  brandColor: string
  children: ReactNode
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionEyebrow, { color: brandColor }]}>{label}</Text>
      {children}
    </View>
  )
}

export function QuotePdfDocument({
  document,
  brandColor,
}: {
  document: QuoteDocument
  brandColor: string
}) {
  const tint = blendQuoteColorOverWhite(brandColor, 0.08)
  const tintBorder = blendQuoteColorOverWhite(brandColor, 0.3)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topRow}>
          <QuotePdfLogomark brandColor={brandColor} width={30} />
          <View>
            <Text style={[styles.eyebrow, { color: brandColor, textAlign: "right" }]}>
              Quotation
            </Text>
            <Text style={styles.quoteNumber}>{document.quoteNumber}</Text>
          </View>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.title}>{document.projectTitle}</Text>
          <Text style={styles.clientLine}>{document.clientCompany}</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Prepared for</Text>
            <Text style={styles.metaValue}>{document.clientCompany}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Date</Text>
            <Text style={styles.metaValue}>{document.date}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Valid</Text>
            <Text style={styles.metaValue}>30 days</Text>
          </View>
        </View>

        {document.overview ? (
          <Section label="Overview" brandColor={brandColor}>
            {document.overview.split("\n\n").map((paragraph) => (
              <Text key={paragraph.slice(0, 32)} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </Section>
        ) : null}

        {document.scope.length ? (
          <Section label="Scope of work" brandColor={brandColor}>
            <View style={styles.scopeList}>
              {document.scope.map((item, index) => (
                <View key={item} style={styles.scopeItem} wrap={false}>
                  <Text style={[styles.scopeIndex, { color: brandColor }]}>
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                  <Text style={styles.scopeText}>{item}</Text>
                </View>
              ))}
            </View>
          </Section>
        ) : null}

        {document.exclusions.length ? (
          <Section label="Not included" brandColor={brandColor}>
            <Text style={styles.exclusionsText}>
              {document.exclusions.join("  ·  ")}
            </Text>
          </Section>
        ) : null}

        {document.timeline ? (
          <Section label="Timeline" brandColor={brandColor}>
            <View style={styles.timelineCard}>
              <Text style={styles.timelineValue}>{document.timeline}</Text>
              {document.timelineNote ? (
                <Text style={styles.timelineNote}>{document.timelineNote}</Text>
              ) : null}
            </View>
          </Section>
        ) : null}

        {document.investmentAmount ? (
          <Section label="Investment" brandColor={brandColor}>
            <View
              style={[
                styles.investmentCard,
                { backgroundColor: tint, borderColor: tintBorder, borderWidth: 1 },
              ]}
            >
              <View style={styles.investmentAmountRow}>
                <Text style={styles.investmentAmount}>{document.investmentAmount}</Text>
                {document.investmentGst ? (
                  <Text style={styles.investmentGst}>+ GST</Text>
                ) : null}
              </View>
              {document.milestones.map((milestone) => (
                <View key={milestone.label} style={styles.milestoneRow} wrap={false}>
                  <Text style={[styles.milestonePercent, { color: brandColor }]}>
                    {milestone.percent}%
                  </Text>
                  <Text style={styles.milestoneLabel}>{milestone.label}</Text>
                </View>
              ))}
            </View>
          </Section>
        ) : null}

        {document.support ? (
          <Section label="Post-launch support" brandColor={brandColor}>
            <Text style={styles.supportText}>{document.support}</Text>
          </Section>
        ) : null}

        <View style={styles.footer} fixed>
          <View style={styles.footerBrand}>
            <QuotePdfLogomark brandColor={brandColor} width={16} />
            <Text style={styles.footerText}>Akshay Saini · Design Engineer</Text>
          </View>
          <Text style={styles.footerText}>akshaysaini.design@gmail.com · +91 81682 38248</Text>
        </View>
      </Page>
    </Document>
  )
}
