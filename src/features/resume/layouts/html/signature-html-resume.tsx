"use client"

import {
  
  
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react"

import { cssColorWithAlpha } from "../../color-utils"
import {  parseProjectMetaParts } from "../official-layout-utils"
import {
  
  chunkPairs,
  getSignatureContent,
  replaceSignatureProfileParagraph,
  replaceSignatureTagline
} from "../signature-content"
import {
  SIGNATURE,
  SIGNATURE_CONTENT_HEIGHT_PT,
  SIGNATURE_CONTENT_WIDTH_PT,
  pt,
} from "../signature-tokens"
import { HtmlFounderBadge } from "../founder-badge"
import { EditableText } from "./editable-text"
import { RESUME_HTML_ROOT_CLASS  } from "./resume-html-props"
import type {SignatureJob} from "../signature-content";
import type {OfficialContactPart} from "../official-layout-utils";
import type {CSSProperties, ReactNode} from "react";
import type {ResumeHtmlLayoutProps} from "./resume-html-props";
import type { ResumeDocument, ResumeExperienceItem, ResumeProjectItem } from "../../types"
import { cn } from "@/lib/utils"

const C = SIGNATURE.color
const F = SIGNATURE.font
const PAGE_WIDTH_PX = pt(SIGNATURE.page.width)
const PAGE_HEIGHT_PX = pt(SIGNATURE.page.height)
const CONTENT_WIDTH_PX = pt(SIGNATURE_CONTENT_WIDTH_PT)
const CONTENT_HEIGHT_PX = pt(SIGNATURE_CONTENT_HEIGHT_PT)
/** Space between stacked sheets in the builder. */
const SHEET_GAP_PX = 28

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

type SignatureBlock = {
  key: string
  node: ReactNode
  /** Space after this block when the next block lands on the same page (pt). */
  gapAfter: number
}

const text = (size: number, extra?: CSSProperties): CSSProperties => ({
  fontSize: pt(size),
  lineHeight: SIGNATURE.lineHeight,
  ...extra,
})

/* -------------------------------------------------------------------------- */
/* Pagination                                                                  */
/* -------------------------------------------------------------------------- */

function paginate(heights: Array<number>, blocks: Array<SignatureBlock>): Array<Array<number>> {
  const pages: Array<Array<number>> = []
  let current: Array<number> = []
  let used = 0

  heights.forEach((height, index) => {
    const previous = current.at(-1)
    const gap = previous === undefined ? 0 : pt(blocks[previous].gapAfter)

    if (current.length > 0 && used + gap + height > CONTENT_HEIGHT_PX) {
      pages.push(current)
      current = [index]
      used = height
      return
    }

    current.push(index)
    used += gap + height
  })

  if (current.length) pages.push(current)
  return pages
}

function normalizePages(pages: Array<Array<number>>, blockCount: number): Array<Array<number>> {
  const kept = pages
    .map((page) => page.filter((index) => index < blockCount))
    .filter((page) => page.length > 0)
  const placed = kept.reduce((count, page) => count + page.length, 0)
  if (placed === blockCount) return kept
  const missing = Array.from({ length: blockCount }, (_, index) => index).filter(
    (index) => !kept.some((page) => page.includes(index)),
  )
  if (!kept.length) return [missing]
  return [...kept.slice(0, -1), [...kept[kept.length - 1], ...missing].sort((a, b) => a - b)]
}

function samePages(a: Array<Array<number>>, b: Array<Array<number>>): boolean {
  return a.length === b.length && a.every((page, i) => page.join(",") === b[i].join(","))
}

/**
 * Lays blocks out on real A4 sheets. Every block is measured off-screen at the
 * page's content width, then placed whole on the first page with room for it,
 * so each page keeps the same top and bottom margins and nothing is cut.
 */
function SignaturePages({
  blocks,
  fontFamily,
  footerLabel,
}: {
  blocks: Array<SignatureBlock>
  fontFamily: string
  footerLabel: string
}) {
  const measureRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [storedPages, setPages] = useState<Array<Array<number>>>(() => [blocks.map((_, index) => index)])
  const [scale, setScale] = useState(1)
  const blocksRef = useRef(blocks)
  blocksRef.current = blocks

  const measureRefCallback = useRef(() => {
    const root = measureRef.current
    if (!root) return
    const heights = Array.from(root.children).map((child) =>
      Math.ceil((child as HTMLElement).offsetHeight),
    )
    const next = paginate(heights, blocksRef.current)
    setPages((previous) => (samePages(previous, next) ? previous : next))
  })
  const measure = measureRefCallback.current

  // Re-paginate after every render (content edits, section toggles, font changes).
  useIsomorphicLayoutEffect(() => {
    measure()
  })

  useEffect(() => {
    const root = measureRef.current
    if (!root) return
    const observer = new ResizeObserver(() => measure())
    observer.observe(root)
    void document.fonts.ready.then(() => measure())
    return () => observer.disconnect()
  }, [measure])

  // Shrink the sheets to fit narrow preview panels without changing pagination.
  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const update = () => {
      const width = frame.clientWidth
      setScale(width > 0 && width < PAGE_WIDTH_PX ? width / PAGE_WIDTH_PX : 1)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  // Between a content change and the next measurement, the block count can differ
  // from the stored pages; keep every block visible until pagination catches up.
  const pages = normalizePages(storedPages, blocks.length)
  const stackHeight = pages.length * PAGE_HEIGHT_PX + (pages.length - 1) * SHEET_GAP_PX

  return (
    <div ref={frameRef} className="w-full" style={{ fontFamily }}>
      {/* Off-screen measuring copy: same width and font, never interactive. */}
      <div
        aria-hidden
        inert
        className={RESUME_HTML_ROOT_CLASS}
        style={{
          width: CONTENT_WIDTH_PX,
          height: 0,
          overflow: "hidden",
          visibility: "hidden",
          fontFamily,
          color: C.body,
        }}
      >
        <div ref={measureRef} style={{ width: CONTENT_WIDTH_PX }}>
          {blocks.map((block) => (
            <div key={`measure-${block.key}`} style={{ display: "flow-root" }}>
              {block.node}
            </div>
          ))}
        </div>
      </div>

      <div
        className="mx-auto"
        style={{ width: PAGE_WIDTH_PX * scale, height: stackHeight * scale }}
      >
        <div
          style={{
            width: PAGE_WIDTH_PX,
            transform: scale === 1 ? undefined : `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {pages.map((page, pageIndex) => (
            <section
              key={`sheet-${pageIndex}`}
              aria-label={`Page ${pageIndex + 1} of ${pages.length}`}
              className={`relative overflow-hidden rounded-[2px] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.12),0_1px_2px_rgba(16,24,40,0.06)] ring-1 ring-black/5 ${RESUME_HTML_ROOT_CLASS}`}
              style={{
                width: PAGE_WIDTH_PX,
                height: PAGE_HEIGHT_PX,
                marginBottom: pageIndex < pages.length - 1 ? SHEET_GAP_PX : 0,
                paddingTop: pt(SIGNATURE.page.marginTop),
                paddingLeft: pt(SIGNATURE.page.marginX),
                paddingRight: pt(SIGNATURE.page.marginX),
                color: C.body,
              }}
            >
              <div style={{ height: CONTENT_HEIGHT_PX }}>
                {page.map((blockIndex, position) => {
                  const previous = page[position - 1]
                  return (
                    <div
                      key={blocks[blockIndex].key}
                      style={{
                        display: "flow-root",
                        marginTop: position === 0 ? 0 : pt(blocks[previous].gapAfter),
                      }}
                    >
                      {blocks[blockIndex].node}
                    </div>
                  )
                })}
              </div>
              <footer
                className="absolute flex items-center justify-between"
                style={{
                  left: pt(SIGNATURE.page.marginX),
                  right: pt(SIGNATURE.page.marginX),
                  bottom: pt(SIGNATURE.footer.bottom),
                  ...text(SIGNATURE.footer.fontSize, { color: C.faint }),
                }}
              >
                <span>{footerLabel}</span>
                {pages.length > 1 ? (
                  <span>
                    Page {pageIndex + 1} of {pages.length}
                  </span>
                ) : null}
              </footer>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Pieces                                                                      */
/* -------------------------------------------------------------------------- */

function SectionTitle({ title, brandColor }: { title: string; brandColor: string }) {
  return (
    <div
      className="flex items-center"
      style={{ gap: pt(8), marginBottom: pt(SIGNATURE.gap.sectionTitle) }}
    >
      <h2
        className="font-bold uppercase"
        style={text(F.sectionTitle, { color: brandColor, letterSpacing: pt(0.4) })}
      >
        {title}
      </h2>
      <span aria-hidden className="flex-1" style={{ height: 1, backgroundColor: C.rule }} />
    </div>
  )
}

function InlineParts({
  parts,
  linkColor,
  style,
}: {
  parts: Array<OfficialContactPart>
  linkColor: string
  style: CSSProperties
}) {
  return (
    <p className="flex flex-wrap items-center" style={{ ...style, columnGap: pt(5) }}>
      {parts.map((part, index) => (
        <span key={`${part.label}-${index}`} className="inline-flex items-center" style={{ gap: pt(5) }}>
          {index > 0 ? (
            <span aria-hidden style={{ color: C.faint }}>
              ·
            </span>
          ) : null}
          {part.href ? (
            <a
              href={part.href}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
              style={{ color: linkColor }}
            >
              {part.label}
            </a>
          ) : (
            <span>{part.label}</span>
          )}
        </span>
      ))}
    </p>
  )
}

function JobEntry({
  entry,
  compact,
  onPatch,
}: {
  entry: SignatureJob
  compact?: boolean
  onPatch?: (patch: Partial<ResumeExperienceItem>) => void
}) {
  const { job } = entry
  const edit = <TKey extends keyof ResumeExperienceItem>(key: TKey) =>
    onPatch ? (value: string) => onPatch({ [key]: value }) : undefined

  return (
    <article>
      <div className="flex items-baseline justify-between" style={{ gap: pt(12) }}>
        <p className="min-w-0" style={text(compact ? F.body : F.role, { color: C.ink })}>
          <EditableText
            value={job.role}
            onChange={edit("role")}
            className="font-bold"
            placeholder="Role"
          />
          <span aria-hidden style={{ color: C.faint }}>
            {" · "}
          </span>
          <EditableText
            value={job.company}
            onChange={edit("company")}
            className={cn("font-semibold", job.companyUrl && "underline decoration-1 underline-offset-2")}
            placeholder="Company"
          />
        </p>
        <EditableText
          value={job.period}
          onChange={edit("period")}
          tagName="p"
          className="shrink-0 whitespace-nowrap"
          style={text(F.small, { color: C.muted })}
          placeholder="Period"
        />
      </div>
      {job.location && !compact ? (
        <p style={text(F.small, { color: C.muted })}>
          <EditableText value={job.location} onChange={edit("location")} placeholder="Location" />
          {job.founderBadge ? (
            <span aria-hidden style={{ color: C.faint }}>
              {"\u00A0\u00A0·"}
            </span>
          ) : null}
          <HtmlFounderBadge inline label={job.founderBadge} />
        </p>
      ) : null}
      {job.description && !compact ? (
        <EditableText
          value={job.description}
          onChange={edit("description")}
          tagName="p"
          singleLine={false}
          style={text(F.body, { color: C.body, marginTop: pt(3) })}
          placeholder="What you did here"
        />
      ) : null}
      {!compact && entry.visibleHighlights.length ? (
        <ul style={{ marginTop: pt(3), paddingLeft: pt(10) }}>
          {entry.visibleHighlights.map((highlight, highlightIndex) => (
            <li
              key={`${highlightIndex}-${highlight.slice(0, 12)}`}
              className="list-disc"
              style={text(F.body, { color: C.body, marginTop: pt(SIGNATURE.gap.bullet) })}
            >
              <EditableText
                value={highlight}
                onChange={
                  onPatch
                    ? (value) => {
                        const highlights = [...(job.highlights ?? [])]
                        highlights[highlightIndex] = value
                        onPatch({ highlights })
                      }
                    : undefined
                }
                singleLine={false}
                placeholder="Highlight"
              />
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}

function ProjectCard({ project, brandColor }: { project: ResumeProjectItem; brandColor: string }) {
  const metaParts = parseProjectMetaParts(project.meta, project.url)

  return (
    <article
      className="h-full"
      style={{
        padding: pt(8),
        borderRadius: pt(4),
        border: `1px solid ${cssColorWithAlpha(brandColor, 0.2)}`,
        backgroundColor: cssColorWithAlpha(brandColor, 0.05),
      }}
    >
      {project.url ? (
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="font-bold hover:underline"
          style={text(F.body, { color: brandColor })}
        >
          {project.title}
        </a>
      ) : (
        <p className="font-bold" style={text(F.body, { color: C.ink })}>
          {project.title}
        </p>
      )}
      <p style={text(F.tiny, { color: C.muted, marginTop: pt(1) })}>
        {metaParts.map((part) => part.label).join(" · ")}
      </p>
      <p style={text(F.small, { color: C.body, marginTop: pt(3) })}>{project.description}</p>
    </article>
  )
}

/* -------------------------------------------------------------------------- */
/* Layout                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The PDF is always set in Helvetica, so the preview uses it too. Same metrics
 * means the same line wraps and the same page breaks as the downloaded file.
 */
const SIGNATURE_PREVIEW_FONT = "Helvetica, Arial, sans-serif"

export function SignatureHtmlResume({
  document,
  brandColor,
  onChange,
}: ResumeHtmlLayoutProps) {
  const content = getSignatureContent(document)
  const G = SIGNATURE.gap

  const patchJob = (index: number) =>
    onChange
      ? (patch: Partial<ResumeExperienceItem>) => {
          const experience = [...(document.experience ?? [])]
          experience[index] = { ...experience[index], ...patch }
          onChange({ ...document, experience })
        }
      : undefined

  const update = (patch: Partial<ResumeDocument>) =>
    onChange ? onChange({ ...document, ...patch }) : undefined

  const blocks: Array<SignatureBlock> = []

  /* Header ----------------------------------------------------------------- */
  blocks.push({
    key: "header",
    gapAfter: G.section,
    node: (
      <header style={{ paddingBottom: pt(12), borderBottom: `2px solid ${brandColor}` }}>
        <EditableText
          value={document.name}
          onChange={onChange ? (value) => update({ name: value }) : undefined}
          tagName="h1"
          className="font-bold"
          style={text(F.name, { color: C.ink, lineHeight: 1.1, letterSpacing: pt(-0.2) })}
          placeholder="Your name"
        />
        <EditableText
          value={document.title}
          onChange={onChange ? (value) => update({ title: value }) : undefined}
          tagName="p"
          className="font-semibold"
          style={text(F.title, { color: brandColor, marginTop: pt(3) })}
          placeholder="Professional title"
        />
        {content.tagline ? (
          <EditableText
            value={content.tagline}
            onChange={
              onChange
                ? (value) => update({ summary: replaceSignatureTagline(document, value) })
                : undefined
            }
            tagName="p"
            singleLine={false}
            style={text(F.tagline, { color: C.body, marginTop: pt(6) })}
            placeholder="One-line positioning"
          />
        ) : null}
        {content.contactLine.length ? (
          <InlineParts
            parts={content.contactLine}
            linkColor={C.body}
            style={text(F.small, { color: C.muted, marginTop: pt(8) })}
          />
        ) : null}
        {content.linkLine.length ? (
          <InlineParts
            parts={content.linkLine}
            linkColor={brandColor}
            style={text(F.small, { color: C.muted, marginTop: pt(2) })}
          />
        ) : null}
      </header>
    ),
  })

  /* Profile + metrics ------------------------------------------------------ */
  if (content.profileParagraphs.length || content.metrics.length) {
    blocks.push({
      key: "profile",
      gapAfter: G.section,
      node: (
        <section>
          <SectionTitle title="Profile" brandColor={brandColor} />
          {content.profileParagraphs.map((paragraph, index) => (
            <EditableText
              key={`profile-${index}`}
              value={paragraph}
              onChange={
                onChange
                  ? (value) =>
                      update({ summary: replaceSignatureProfileParagraph(document, index, value) })
                  : undefined
              }
              tagName="p"
              singleLine={false}
              style={text(F.body, { color: C.body, marginTop: index ? pt(4) : 0 })}
              placeholder="Profile"
            />
          ))}
          {content.metrics.length ? (
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${content.metrics.length}, minmax(0, 1fr))`,
                marginTop: pt(10),
                borderRadius: pt(4),
                backgroundColor: C.surface,
                border: `1px solid ${C.rule}`,
              }}
            >
              {content.metrics.map((metric, index) => (
                <div
                  key={`${metric.value}-${metric.label}`}
                  className="text-center"
                  style={{
                    padding: `${pt(7)}px ${pt(6)}px`,
                    borderLeft: index ? `1px solid ${C.rule}` : undefined,
                  }}
                >
                  <p className="font-bold" style={text(F.metricValue, { color: C.ink, lineHeight: 1.15 })}>
                    {metric.value}
                  </p>
                  <p style={text(F.tiny, { color: C.muted })}>{metric.label}</p>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ),
    })
  }

  /* Toolkit ---------------------------------------------------------------- */
  if (content.toolkit.length) {
    blocks.push({
      key: "toolkit",
      gapAfter: G.section,
      node: (
        <section>
          <SectionTitle title="AI-native toolkit" brandColor={brandColor} />
          <div className="grid" style={{ rowGap: pt(3) }}>
            {content.toolkit.map((group) => (
              <p
                key={group.label}
                className="grid"
                style={text(F.small, {
                  gridTemplateColumns: `${pt(92)}px 1fr`,
                  columnGap: pt(8),
                  color: C.body,
                })}
              >
                <span className="font-bold" style={{ color: C.ink }}>
                  {group.label}
                </span>
                <span>{group.values}</span>
              </p>
            ))}
          </div>
        </section>
      ),
    })
  }

  /* Experience ------------------------------------------------------------- */
  content.professional.forEach((entry, position) => {
    const isLast = position === content.professional.length - 1
    blocks.push({
      key: `job-${entry.index}`,
      gapAfter: isLast ? G.section : G.item,
      node: (
        <>
          {position === 0 ? <SectionTitle title="Experience" brandColor={brandColor} /> : null}
          <JobEntry entry={entry} onPatch={patchJob(entry.index)} />
        </>
      ),
    })
  })

  /* Recent projects ---------------------------------------------------------- */
  const projectRows = chunkPairs(content.projects)
  projectRows.forEach((row, rowIndex) => {
    const isLast = rowIndex === projectRows.length - 1
    blocks.push({
      key: `projects-${rowIndex}`,
      gapAfter: isLast ? G.section : 8,
      node: (
        <>
          {rowIndex === 0 ? <SectionTitle title="Recent projects" brandColor={brandColor} /> : null}
          <div className="grid grid-cols-2" style={{ gap: pt(8) }}>
            {row.map((project) => (
              <ProjectCard key={project.title} project={project} brandColor={brandColor} />
            ))}
          </div>
        </>
      ),
    })
  })

  /* Earlier experience ------------------------------------------------------ */
  content.earlier.forEach((entry, position) => {
    const isLast = position === content.earlier.length - 1
    blocks.push({
      key: `earlier-${entry.index}`,
      gapAfter: isLast ? G.section : 6,
      node: (
        <>
          {position === 0 ? (
            <SectionTitle title="Earlier experience" brandColor={brandColor} />
          ) : null}
          <JobEntry entry={entry} compact onPatch={patchJob(entry.index)} />
        </>
      ),
    })
  })

  /* Education, certification, languages ------------------------------------ */
  const education = document.education
  const certifications = document.certifications ?? []
  const languages = document.languages ?? []
  if (education || certifications.length || languages.length || document.interests?.length) {
    blocks.push({
      key: "education",
      gapAfter: 0,
      node: (
        <section>
          <SectionTitle title="Education and more" brandColor={brandColor} />
          <div className="grid grid-cols-2" style={{ columnGap: pt(16), rowGap: pt(6) }}>
            {education ? (
              <div style={text(F.small, { color: C.body })}>
                <p className="font-bold" style={{ color: C.ink }}>
                  {education.degree}
                </p>
                <p>{education.school}</p>
                <p style={{ color: C.muted }}>
                  {education.years} · {education.location}
                </p>
              </div>
            ) : null}
            {certifications.map((certification) => (
              <div key={certification.title} style={text(F.small, { color: C.body })}>
                <p className="font-bold" style={{ color: C.ink }}>
                  {certification.title}
                </p>
                <p>{certification.issuer}</p>
                <p style={{ color: C.muted }}>
                  {certification.date}
                  {certification.credentialId ? ` · Credential ID ${certification.credentialId}` : ""}
                </p>
              </div>
            ))}
          </div>
          {/* Languages and interests share one line to keep Signature at 2 pages. */}
          {languages.length || document.interests?.length ? (
            <p style={text(F.small, { color: C.body, marginTop: pt(6) })}>
              {languages.length ? (
                <>
                  <span className="font-bold" style={{ color: C.ink }}>
                    Languages:{" "}
                  </span>
                  {languages.map((language) => `${language.name} (${language.level})`).join(", ")}
                </>
              ) : null}
              {languages.length && document.interests?.length ? (
                <span aria-hidden style={{ color: C.faint }}>
                  {"  ·  "}
                </span>
              ) : null}
              {document.interests?.length ? (
                <>
                  <span className="font-bold" style={{ color: C.ink }}>
                    Interests:{" "}
                  </span>
                  {document.interests.join(", ")}
                </>
              ) : null}
            </p>
          ) : null}
        </section>
      ),
    })
  }

  return (
    <SignaturePages blocks={blocks} fontFamily={SIGNATURE_PREVIEW_FONT} footerLabel={content.footerLabel} />
  )
}
