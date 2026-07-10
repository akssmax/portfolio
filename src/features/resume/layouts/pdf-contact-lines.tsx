import { Link, StyleSheet, Text, View } from "@react-pdf/renderer"

import { toMailtoHref, toTelHref } from "../contact-link-utils"
import type { ResumeDocument } from "../types"

const styles = StyleSheet.create({
  block: {
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  line: {
    marginBottom: 1.5,
    color: "#262626",
    fontSize: 9,
  },
  link: {
    textDecoration: "none",
    marginBottom: 1.5,
    fontSize: 9,
  },
})

function formatLinkLabel(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")
}

/** Compact contact lines — appended after Skills to avoid a trailing orphan page. */
export function PdfContactLines({
  contact,
  brandColor,
  embedded = true,
}: {
  contact: NonNullable<ResumeDocument["contact"]>
  brandColor: string
  /** When true, adds a divider above contact (for use inside Skills). */
  embedded?: boolean
}) {
  return (
    <View style={embedded ? styles.block : undefined}>
      <Link src={toMailtoHref(contact.email)} style={styles.link}>
        <Text style={styles.line}>{contact.email}</Text>
      </Link>
      <Link src={toTelHref(contact.phone)} style={styles.link}>
        <Text style={styles.line}>{contact.phone}</Text>
      </Link>
      {contact.website ? (
        <Link src={contact.website} style={[styles.link, { color: brandColor }]}>
          <Text>{formatLinkLabel(contact.website)}</Text>
        </Link>
      ) : null}
      {contact.linkedin ? (
        <Link src={contact.linkedin} style={[styles.link, { color: brandColor }]}>
          <Text>{formatLinkLabel(contact.linkedin)}</Text>
        </Link>
      ) : null}
      {contact.github ? (
        <Link src={contact.github} style={[styles.link, { color: brandColor }]}>
          <Text>{formatLinkLabel(contact.github)}</Text>
        </Link>
      ) : null}
    </View>
  )
}
