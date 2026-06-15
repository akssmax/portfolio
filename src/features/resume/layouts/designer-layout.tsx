import type { ReactNode } from "react"
import { Image, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

import { hexToRgba } from "../color-utils"
import { resolvePdfAssetUrl } from "../pdf-asset-url"
import type { ResumeDocument } from "../types"
import { ResumeLogomark } from "./resume-logomark"

const PAGE_MARGIN = {
  paddingTop: 34,
  paddingBottom: 44,
  paddingRight: 40,
  paddingLeft: 60,
} as const

const styles = StyleSheet.create({
  page: {
    position: "relative",
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.45,
    color: "#171717",
    ...PAGE_MARGIN,
  },
  sidebarStripe: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 8,
  },
  continuationHeader: {
    position: "absolute",
    top: 0,
    left: PAGE_MARGIN.paddingLeft,
    right: PAGE_MARGIN.paddingRight,
    height: PAGE_MARGIN.paddingTop,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  continuationName: {
    fontSize: 9,
    fontWeight: 700,
    color: "#0F1923",
  },
  continuationMeta: {
    fontSize: 8,
    color: "#737373",
    textAlign: "right",
  },
  pageFooter: {
    position: "absolute",
    bottom: 22,
    left: PAGE_MARGIN.paddingLeft,
    right: PAGE_MARGIN.paddingRight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    paddingTop: 8,
  },
  footerMark: {
    width: 18,
    height: 13.4,
  },
  footerText: {
    fontSize: 8,
    color: "#737373",
  },
  header: {
    marginBottom: 20,
    padding: 14,
    borderRadius: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 10,
  },
  portrait: {
    width: 72,
    height: 72,
    borderRadius: 12,
    objectFit: "cover",
  },
  headerText: {
    flex: 1,
    paddingTop: 2,
  },
  headerLine: {
    paddingBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    color: "#0F1923",
  },
  title: {
    fontSize: 11,
    fontWeight: 700,
  },
  meta: {
    fontSize: 9,
    color: "#737373",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  contactPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    fontSize: 8.5,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionAccent: {
    width: 14,
    height: 3,
    borderRadius: 999,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "#0F1923",
  },
  paragraph: {
    marginBottom: 4,
    color: "#262626",
  },
  job: {
    marginBottom: 12,
    paddingLeft: 10,
    borderLeftWidth: 2,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingBottom: 4,
  },
  jobTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  jobLogo: {
    width: 28,
    height: 28,
    borderRadius: 6,
    objectFit: "contain",
  },
  jobTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    color: "#171717",
    flex: 1,
  },
  jobMeta: {
    fontSize: 8.5,
    color: "#737373",
    textAlign: "right",
  },
  bulletList: {
    marginTop: 4,
    paddingLeft: 8,
  },
  bulletItem: {
    marginBottom: 2,
    color: "#404040",
    fontSize: 9.5,
  },
  skillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    fontSize: 8.5,
    borderWidth: 1,
  },
  link: {
    textDecoration: "none",
    marginBottom: 4,
  },
})

function Section({
  title,
  brandColor,
  children,
}: {
  title: string
  brandColor: string
  children: ReactNode
}) {
  return (
    <View style={styles.section}>
      <View wrap={false} minPresenceAhead={40} style={styles.sectionHeader}>
        <View style={[styles.sectionAccent, { backgroundColor: brandColor }]} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  )
}

function formatWebsiteLabel(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "")
}

function PageChrome({
  document,
  brandColor,
}: {
  document: ResumeDocument
  brandColor: string
}) {
  return (
    <>
      <View
        fixed
        style={[styles.sidebarStripe, { backgroundColor: brandColor }]}
      />

      <View
        fixed
        render={({ pageNumber }) =>
          pageNumber > 1 ? (
            <View style={styles.continuationHeader}>
              <Text style={styles.continuationName}>{document.name}</Text>
              <Text style={styles.continuationMeta}>{document.title}</Text>
            </View>
          ) : null
        }
      />

      <View fixed style={styles.pageFooter}>
        <View style={styles.footerMark}>
          <ResumeLogomark brandColor={brandColor} width={18} />
        </View>
        <Text
          style={styles.footerText}
          render={({ pageNumber, totalPages }) =>
            totalPages > 1
              ? `Akshay Saini · Design Engineer · ${pageNumber}/${totalPages}`
              : "Akshay Saini · Design Engineer"
          }
        />
      </View>
    </>
  )
}

export function DesignerResumeLayout({
  document,
  brandColor,
}: {
  document: ResumeDocument
  brandColor: string
}) {
  const tint = hexToRgba(brandColor, 0.08)
  const pillBackground = hexToRgba(brandColor, 0.12)
  const pillBorder = hexToRgba(brandColor, 0.25)

  return (
    <Page size="A4" style={styles.page}>
      <PageChrome document={document} brandColor={brandColor} />

      <View style={[styles.header, { backgroundColor: tint }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <View style={styles.headerLine}>
              <Text style={styles.name}>{document.name}</Text>
            </View>
            <View style={styles.headerLine}>
              <Text style={[styles.title, { color: brandColor }]}>
                {document.title}
              </Text>
            </View>
            <View>
              <Text style={styles.meta}>{document.location}</Text>
            </View>
          </View>
          {document.portrait ? (
            <Image
              src={resolvePdfAssetUrl(document.portrait.src)}
              style={styles.portrait}
            />
          ) : null}
        </View>

        {document.contact ? (
          <View style={styles.contactRow}>
            <Text
              style={[
                styles.contactPill,
                { backgroundColor: pillBackground, color: brandColor },
              ]}
            >
              {document.contact.email}
            </Text>
            <Text
              style={[
                styles.contactPill,
                { backgroundColor: pillBackground, color: brandColor },
              ]}
            >
              {document.contact.phone}
            </Text>
            {document.contact.website ? (
              <Text
                style={[
                  styles.contactPill,
                  { backgroundColor: pillBackground, color: brandColor },
                ]}
              >
                {formatWebsiteLabel(document.contact.website)}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>

      {document.summary ? (
        <Section title="Summary" brandColor={brandColor}>
          {document.summary.split("\n\n").map((paragraph) => (
            <Text key={paragraph.slice(0, 24)} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
        </Section>
      ) : null}

      {document.experience?.length ? (
        <Section title="Experience" brandColor={brandColor}>
          {document.experience.map((job) => (
            <View
              key={`${job.company}-${job.period}`}
              style={[styles.job, { borderLeftColor: brandColor }]}
            >
              <View wrap={false} minPresenceAhead={48} style={styles.jobHeader}>
                <View style={styles.jobTitleRow}>
                  {job.logoSrc ? (
                    <Image
                      src={resolvePdfAssetUrl(job.logoSrc)}
                      style={styles.jobLogo}
                    />
                  ) : null}
                  <Text style={styles.jobTitle}>
                    {job.role} · {job.company}
                  </Text>
                </View>
                <Text style={styles.jobMeta}>
                  {job.period}
                  {"\n"}
                  {job.location}
                </Text>
              </View>
              <Text style={styles.paragraph}>{job.description}</Text>
              {job.highlights?.length ? (
                <View style={styles.bulletList}>
                  {job.highlights.map((highlight) => (
                    <Text key={highlight} style={styles.bulletItem}>
                      • {highlight}
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          ))}
        </Section>
      ) : null}

      {document.education ? (
        <Section title="Education" brandColor={brandColor}>
          <View wrap={false} minPresenceAhead={32}>
            <Text style={styles.paragraph}>
              {document.education.degree}
              {"\n"}
              {document.education.school} · {document.education.years}
              {"\n"}
              {document.education.location}
            </Text>
          </View>
        </Section>
      ) : null}

      {document.skills?.length ? (
        <Section title="Skills" brandColor={brandColor}>
          <View style={styles.skillWrap}>
            {document.skills.map((skill) => (
              <Text
                key={skill}
                style={[
                  styles.skillPill,
                  {
                    backgroundColor: pillBackground,
                    borderColor: pillBorder,
                    color: "#262626",
                  },
                ]}
              >
                {skill}
              </Text>
            ))}
          </View>
        </Section>
      ) : null}

      {document.certifications?.length ? (
        <Section title="Certifications" brandColor={brandColor}>
          {document.certifications.map((certification) => (
            <View
              key={`${certification.title}-${certification.date}`}
              wrap={false}
              minPresenceAhead={24}
            >
              <Text style={styles.paragraph}>
                {certification.title} — {certification.issuer} (
                {certification.date})
                {certification.credentialId
                  ? ` · ID ${certification.credentialId}`
                  : ""}
              </Text>
            </View>
          ))}
        </Section>
      ) : null}

      {document.languages?.length ? (
        <Section title="Languages" brandColor={brandColor}>
          {document.languages.map((language) => (
            <View key={language.name} wrap={false} minPresenceAhead={20}>
              <Text style={styles.paragraph}>
                {language.name} — {language.level}
              </Text>
            </View>
          ))}
        </Section>
      ) : null}

      {document.interests?.length ? (
        <Section title="Interests" brandColor={brandColor}>
          <View style={styles.skillWrap}>
            {document.interests.map((interest) => (
              <Text
                key={interest}
                style={[
                  styles.skillPill,
                  {
                    backgroundColor: pillBackground,
                    borderColor: pillBorder,
                    color: "#262626",
                  },
                ]}
              >
                {interest}
              </Text>
            ))}
          </View>
        </Section>
      ) : null}

      {document.contact ? (
        <Section title="Links" brandColor={brandColor}>
          {document.contact.website ? (
            <Link
              src={document.contact.website}
              style={[styles.link, { color: brandColor }]}
            >
              <Text>{document.contact.website}</Text>
            </Link>
          ) : null}
          {document.contact.linkedin ? (
            <Link
              src={document.contact.linkedin}
              style={[styles.link, { color: brandColor }]}
            >
              <Text>{document.contact.linkedin}</Text>
            </Link>
          ) : null}
          {document.contact.github ? (
            <Link
              src={document.contact.github}
              style={[styles.link, { color: brandColor }]}
            >
              <Text>{document.contact.github}</Text>
            </Link>
          ) : null}
        </Section>
      ) : null}
    </Page>
  )
}
