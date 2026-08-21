
import { blendQuoteColorOverWhite } from "../color-utils"
import { QuoteHtmlLogomark } from "./quote-html-logomark"
import type { QuoteDocument } from "../types"
import { getResumePreviewFontFamily } from "@/features/resume/resume-font-utils"

const HAIRLINE = "#E5E5E5"
const NAVY = "#0F1923"

type QuotePaperProps = {
  document: QuoteDocument
  brandColor: string
}

function SectionEyebrow({
  label,
  brandColor,
}: {
  label: string
  brandColor: string
}) {
  return (
    <p
      className="mb-2 font-mono text-[8px] font-bold uppercase tracking-[0.24em]"
      style={{ color: brandColor }}
    >
      {label}
    </p>
  )
}

export function QuotePaper({ document, brandColor }: QuotePaperProps) {
  const tint = blendQuoteColorOverWhite(brandColor, 0.08)
  const tintBorder = blendQuoteColorOverWhite(brandColor, 0.3)
  const fontFamily = getResumePreviewFontFamily(document.font)

  return (
    <div
      className="flex h-full flex-col px-11 pt-9 pb-14 text-[9.5px] leading-[1.42] text-neutral-800"
      style={{ fontFamily }}
    >
      <div className="flex items-start justify-between">
        <QuoteHtmlLogomark brandColor={brandColor} width={30} />
        <div className="text-right">
          <p
            className="font-mono text-[8px] font-bold uppercase tracking-[0.24em]"
            style={{ color: brandColor }}
          >
            Quotation
          </p>
          <p className="font-mono text-[8px] text-neutral-500">{document.quoteNumber}</p>
        </div>
      </div>

      <div className="mt-5">
        <h1
          className="text-[21px] font-bold leading-[1.15] tracking-tight"
          style={{ color: NAVY }}
        >
          {document.projectTitle}
        </h1>
        <p className="mt-1 text-[11px] text-neutral-600">{document.clientCompany}</p>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-6 border-t pt-2.5" style={{ borderColor: HAIRLINE }}>
        <div>
          <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-neutral-500">
            Prepared for
          </p>
          <p className="mt-0.5 text-[9.5px] font-bold" style={{ color: NAVY }}>
            {document.clientCompany}
          </p>
        </div>
        <div>
          <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-neutral-500">Date</p>
          <p className="mt-0.5 text-[9.5px] font-bold" style={{ color: NAVY }}>
            {document.date}
          </p>
        </div>
        <div>
          <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-neutral-500">Valid</p>
          <p className="mt-0.5 text-[9.5px] font-bold" style={{ color: NAVY }}>
            30 days
          </p>
        </div>
      </div>

      {document.overview ? (
        <section className="mt-3">
          <SectionEyebrow label="Overview" brandColor={brandColor} />
          {document.overview.split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="mb-1.5 text-neutral-600">
              {paragraph}
            </p>
          ))}
        </section>
      ) : null}

      {document.scope.length ? (
        <section className="mt-2.5">
          <SectionEyebrow label="Scope of work" brandColor={brandColor} />
          <div>
            {document.scope.map((item, index) => (
              <div
                key={item}
                className="flex gap-2.5 border-b py-[3.5px]"
                style={{ borderColor: "#F0F0F0" }}
              >
                <span
                  className="w-5 shrink-0 font-mono text-[9px] font-bold"
                  style={{ color: brandColor }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-neutral-600">{item}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {document.exclusions.length ? (
        <section className="mt-2.5">
          <SectionEyebrow label="Not included" brandColor={brandColor} />
          <p className="text-[8.5px] leading-[1.55] text-neutral-500">
            {document.exclusions.join("  ·  ")}
          </p>
        </section>
      ) : null}

      {document.timeline ? (
        <section className="mt-2.5">
          <SectionEyebrow label="Timeline" brandColor={brandColor} />
          <div
            className="flex items-center gap-3.5 rounded-lg border p-2.5"
            style={{ borderColor: HAIRLINE }}
          >
            <span className="text-[13px] font-bold" style={{ color: NAVY }}>
              {document.timeline}
            </span>
            {document.timelineNote ? (
              <span className="flex-1 text-[8.5px] leading-[1.45] text-neutral-500">
                {document.timelineNote}
              </span>
            ) : null}
          </div>
        </section>
      ) : null}

      {document.investmentAmount ? (
        <section className="mt-2.5">
          <SectionEyebrow label="Investment" brandColor={brandColor} />
          <div
            className="rounded-[10px] border p-3"
            style={{ backgroundColor: tint, borderColor: tintBorder }}
          >
            <div className="flex items-baseline justify-between">
              <span className="text-[22px] font-bold leading-none" style={{ color: NAVY }}>
                {document.investmentAmount}
              </span>
              {document.investmentGst ? (
                <span className="font-mono text-[8.5px] text-neutral-500">+ GST</span>
              ) : null}
            </div>
            <div className="mt-2 space-y-1">
              {document.milestones.map((milestone) => (
                <div key={milestone.label} className="flex items-center gap-2.5">
                  <span
                    className="w-8 shrink-0 font-mono text-[9px] font-bold"
                    style={{ color: brandColor }}
                  >
                    {milestone.percent}%
                  </span>
                  <span className="text-neutral-600">{milestone.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {document.support ? (
        <section className="mt-2.5">
          <SectionEyebrow label="Post-launch support" brandColor={brandColor} />
          <p className="text-neutral-600">{document.support}</p>
        </section>
      ) : null}

      <footer
        className="mt-auto flex items-center justify-between border-t pt-2.5"
        style={{ borderColor: HAIRLINE }}
      >
        <div className="flex items-center gap-2">
          <QuoteHtmlLogomark brandColor={brandColor} width={16} />
          <span className="font-mono text-[7.5px] text-neutral-500">
            Akshay Saini · Design Engineer
          </span>
        </div>
        <span className="font-mono text-[7.5px] text-neutral-500">
          akshaysaini.design@gmail.com · +91 81682 38248
        </span>
      </footer>
    </div>
  )
}
