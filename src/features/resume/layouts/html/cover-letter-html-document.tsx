import { cssColorWithAlpha } from "../../color-utils"
import { EditableText } from "./editable-text"
import type { CoverLetterDocument, ResumeLayoutId } from "../../types"

type CoverLetterHtmlDocumentProps = {
  document: CoverLetterDocument
  brandColor: string
  layout: ResumeLayoutId
  onChange?: (updated: CoverLetterDocument) => void
}

export function CoverLetterHtmlDocument({
  document,
  brandColor,
  layout,
  onChange,
}: CoverLetterHtmlDocumentProps) {
  const tint = cssColorWithAlpha(brandColor, 0.08)

  const handleFieldChange = (field: keyof CoverLetterDocument, value: string) => {
    if (onChange) {
      onChange({ ...document, [field]: value })
    }
  }

  const handleBodyParagraphChange = (idx: number, val: string) => {
    if (onChange) {
      const paragraphs = document.body.split("\n\n")
      paragraphs[idx] = val
      onChange({ ...document, body: paragraphs.join("\n\n") })
    }
  }

  // Render sender header based on layout
  const renderHeader = () => {
    if (layout === "designer") {
      return (
        <header className="mb-6 rounded-lg p-4" style={{ backgroundColor: tint }}>
          <div className="pb-1.5">
            <EditableText
              value={document.senderName}
              onChange={(val) => handleFieldChange("senderName", val)}
              tagName="h1"
              className="text-2xl font-bold leading-tight text-[#0F1923]"
              placeholder="Your Name"
            />
          </div>
          <div className="pb-1.5">
            <EditableText
              value={document.senderTitle}
              onChange={(val) => handleFieldChange("senderTitle", val)}
              tagName="p"
              className="text-[11px] font-bold"
              style={{ color: brandColor }}
              placeholder="Professional Title"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[9px] text-neutral-500">
            <EditableText
              value={document.senderLocation}
              onChange={(val) => handleFieldChange("senderLocation", val)}
              placeholder="Location"
            />
            {document.senderContact?.email && (
              <>
                <span className="text-neutral-300">·</span>
                <span>{document.senderContact.email}</span>
              </>
            )}
            {document.senderContact?.phone && (
              <>
                <span className="text-neutral-300">·</span>
                <span>{document.senderContact.phone}</span>
              </>
            )}
          </div>
        </header>
      )
    }

    if (layout === "modern") {
      return (
        <header
          className="mb-6 border-b pb-3 flex justify-between items-end gap-4"
          style={{ borderBottomColor: brandColor }}
        >
          <div className="min-w-0 flex-1">
            <EditableText
              value={document.senderName}
              onChange={(val) => handleFieldChange("senderName", val)}
              tagName="h1"
              className="text-[22px] font-bold leading-tight text-[#0F1923]"
              placeholder="Your Name"
            />
            <EditableText
              value={document.senderTitle}
              onChange={(val) => handleFieldChange("senderTitle", val)}
              tagName="p"
              className="text-[11px] font-semibold mt-1"
              style={{ color: brandColor }}
              placeholder="Professional Title"
            />
            <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-neutral-500 mt-1">
              <EditableText
                value={document.senderLocation}
                onChange={(val) => handleFieldChange("senderLocation", val)}
                placeholder="Location"
              />
              {document.senderContact?.email && (
                <>
                  <span className="text-neutral-300">·</span>
                  <span>{document.senderContact.email}</span>
                </>
              )}
              {document.senderContact?.phone && (
                <>
                  <span className="text-neutral-300">·</span>
                  <span>{document.senderContact.phone}</span>
                </>
              )}
            </div>
          </div>
        </header>
      )
    }

    // Classic Header
    return (
      <header
        className="mb-6 border-b-2 pb-3"
        style={{ borderBottomColor: brandColor }}
      >
        <div className="pb-1.5">
          <EditableText
            value={document.senderName}
            onChange={(val) => handleFieldChange("senderName", val)}
            tagName="h1"
            className="text-[22px] font-bold leading-tight"
            style={{ color: brandColor }}
            placeholder="Your Name"
          />
        </div>
        <div className="pb-1.5">
          <EditableText
            value={document.senderTitle}
            onChange={(val) => handleFieldChange("senderTitle", val)}
            tagName="p"
            className="text-xs"
            placeholder="Professional Title"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-neutral-600">
          <EditableText
            value={document.senderLocation}
            onChange={(val) => handleFieldChange("senderLocation", val)}
            placeholder="Location"
          />
          {document.senderContact?.email && (
            <>
              <span className="text-neutral-400">·</span>
              <span>{document.senderContact.email}</span>
            </>
          )}
          {document.senderContact?.phone && (
            <>
              <span className="text-neutral-400">·</span>
              <span>{document.senderContact.phone}</span>
            </>
          )}
        </div>
      </header>
    )
  }

  const renderLetterBody = () => {
    return (
      <div className="space-y-4">
        {/* Date */}
        <div>
          <EditableText
            value={document.date}
            onChange={(val) => handleFieldChange("date", val)}
            className="font-medium text-neutral-600 text-[9px]"
            placeholder="Date"
          />
        </div>

        {/* Recipient Block */}
        <div className="space-y-0.5 text-neutral-800 text-[9.5px]">
          <EditableText
            value={document.recipientName}
            onChange={(val) => handleFieldChange("recipientName", val)}
            className="font-semibold block"
            placeholder="Recipient Name"
          />
          <EditableText
            value={document.recipientCompany}
            onChange={(val) => handleFieldChange("recipientCompany", val)}
            className="block"
            placeholder="Company Name"
          />
          <EditableText
            value={document.recipientAddress ?? ""}
            onChange={(val) => handleFieldChange("recipientAddress", val)}
            className="block whitespace-pre-line text-neutral-600"
            singleLine={false}
            placeholder="Company Address (optional)"
          />
        </div>

        {/* Subject */}
        {document.subject !== undefined && (
          <div className="pt-2">
            <EditableText
              value={document.subject}
              onChange={(val) => handleFieldChange("subject", val)}
              className="font-bold border-b border-neutral-100 pb-1 block"
              placeholder="Subject"
            />
          </div>
        )}

        {/* Paragraphs */}
        <div className="space-y-3 pt-2 text-[10px] text-neutral-800 leading-[1.6]">
          {document.body.split("\n\n").map((paragraph, idx) => (
            <EditableText
              key={idx}
              value={paragraph}
              onChange={(val) => handleBodyParagraphChange(idx, val)}
              tagName="p"
              singleLine={false}
              className="text-justify"
              placeholder="Body paragraph..."
            />
          ))}
        </div>

        {/* Sign-off */}
        {document.signOff !== undefined && (
          <div className="pt-4 text-neutral-800">
            <EditableText
              value={document.signOff}
              onChange={(val) => handleFieldChange("signOff", val)}
              className="block whitespace-pre-line leading-[1.5]"
              singleLine={false}
              placeholder="Sign-off (e.g. Sincerely,\nName)"
            />
          </div>
        )}
      </div>
    )
  }

  if (layout === "designer") {
    return (
      <div className="flex min-h-full text-[10px] leading-[1.45] text-neutral-900 bg-white">
        <aside className="relative flex w-[52px] shrink-0 flex-col items-center pt-9">
          <span
            className="absolute inset-y-0 left-0 w-2"
            style={{ backgroundColor: brandColor }}
          />
        </aside>
        <div className="min-w-0 flex-1 pb-9 pl-2 pr-10 pt-[34px]">
          {renderHeader()}
          <main className="mt-4">{renderLetterBody()}</main>
        </div>
      </div>
    )
  }

  // Classic or Modern HTML shell
  return (
    <div className={layout === "modern" ? "px-10 py-9 bg-white min-h-full" : "px-11 py-10 bg-white min-h-full text-[10px]"}>
      {renderHeader()}
      <main className="mt-4">{renderLetterBody()}</main>
    </div>
  )
}
