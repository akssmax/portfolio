import { Text, View } from "@react-pdf/renderer"

import {
  DEFAULT_SECTION_ICONS,
  type ResumeDisplayPreferences,
} from "../../resume-display-preferences"
import type { ResumeSectionId } from "../../types"
import { PDF_SECTION_HEADING_PROPS } from "../pdf-pagination-props"
import { PdfResumeIcon } from "./pdf-resume-icons"

type PdfResumeSectionTitleProps = {
  sectionId: ResumeSectionId
  title: string
  brandColor: string
  display: ResumeDisplayPreferences
  style?: object
}

export function PdfResumeSectionTitle({
  sectionId,
  title,
  brandColor,
  display,
  style,
}: PdfResumeSectionTitleProps) {
  const iconName = display.showSectionIcons
    ? DEFAULT_SECTION_ICONS[sectionId] ?? "file-text"
    : undefined

  return (
    <View
      {...PDF_SECTION_HEADING_PROPS}
      style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 6, ...style }}
    >
      {!iconName ? (
        <View
          style={{
            width: 12,
            height: 3,
            borderRadius: 2,
            backgroundColor: brandColor,
          }}
        />
      ) : (
        <PdfResumeIcon name={iconName} color={brandColor} size={8} />
      )}
      <Text
        style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          color: "#0F1923",
        }}
      >
        {title}
      </Text>
    </View>
  )
}
