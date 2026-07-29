import type { ResumeExperienceItem, ResumeProjectItem, ResumeSectionId } from "../../types"
import { EditableText } from "./editable-text"
import { HtmlResumeSection } from "./html-resume-section"
import { ResumePortraitImage } from "./resume-portrait-image"
import { RESUME_HTML_ROOT_CLASS, type ResumeHtmlLayoutProps } from "./resume-html-props"
import {
  buildOfficialContactParts,
  buildOfficialFooterLabel,
  buildOfficialLinkParts,
  formatLanguageLine,
  formatOfficialTitle,
  formatOfficialMetricText,
  getOfficialCapabilities,
  getOfficialCertifications,
  getOfficialCoreStrengths,
  getOfficialEducation,
  getOfficialHighlightMetrics,
  getOfficialProjects,
  getOfficialSummaryParts,
  parseProjectMetaParts,
  splitExperienceGroups,
} from "../official-layout-utils"
import { cn } from "@/lib/utils"
import { cssColorWithAlpha } from "../../color-utils"
import { getSectionSpacingMbClass } from "../../section-spacing-utils"
import {
  OFFICIAL_HEADER_BG,
  OFFICIAL_HEADER_CONTACT_SEPARATOR,
  OFFICIAL_HEADER_NAME_COLOR,
  OFFICIAL_HEADER_TAGLINE_COLOR,
} from "../../official-resume-content"

function OfficialSection({
  title,
  brandColor,
  display,
  sectionId,
  className,
  children,
}: {
  title: string
  brandColor: string
  display: ResumeHtmlLayoutProps["display"]
  sectionId?: ResumeSectionId
  className?: string
  children: React.ReactNode
}) {
  return (
    <HtmlResumeSection
      sectionId={sectionId}
      title={title}
      brandColor={brandColor}
      display={display}
      variant="plain"
      className={cn(
        getSectionSpacingMbClass(display.sectionSpacing),
        "[&>div:first-child]:mb-1",
        className,
      )}
      titleClassName="text-[9.5px] tracking-[0.12em]"
    >
      {children}
    </HtmlResumeSection>
  )
}

function ExperienceBlock({
  job,
  jobIdx,
  document,
  onChange,
  variant = "stack",
}: {
  job: ResumeExperienceItem
  jobIdx: number
  document: ResumeHtmlLayoutProps["document"]
  onChange?: ResumeHtmlLayoutProps["onChange"]
  variant?: "stack" | "grid"
}) {
  return (
    <article
      className={cn(
        variant === "grid"
          ? "h-full rounded-sm border border-neutral-200 bg-white p-2"
          : "mb-2.5 last:mb-0",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <EditableText
            value={job.role}
            onChange={
              onChange
                ? (val) => {
                    const newExp = [...document.experience!]
                    newExp[jobIdx] = { ...job, role: val }
                    onChange({ ...document, experience: newExp })
                  }
                : undefined
            }
            tagName="p"
            className="text-[10.5px] font-bold text-[#0F1923]"
            placeholder="Role"
          />
          <EditableText
            value={job.company}
            onChange={
              onChange
                ? (val) => {
                    const newExp = [...document.experience!]
                    newExp[jobIdx] = { ...job, company: val }
                    onChange({ ...document, experience: newExp })
                  }
                : undefined
            }
            tagName="span"
            className="text-[10px] font-bold text-neutral-800"
            placeholder="Company"
          />
          {job.location ? (
            <>
              <span className="select-none font-normal text-neutral-400"> · </span>
              <EditableText
                value={job.location}
                onChange={
                  onChange
                    ? (val) => {
                        const newExp = [...document.experience!]
                        newExp[jobIdx] = { ...job, location: val }
                        onChange({ ...document, experience: newExp })
                      }
                    : undefined
                }
                tagName="span"
                className="text-[10px] font-normal text-neutral-600"
                placeholder="Location"
              />
            </>
          ) : null}
        </div>
        <EditableText
          value={job.period}
          onChange={
            onChange
              ? (val) => {
                  const newExp = [...document.experience!]
                  newExp[jobIdx] = { ...job, period: val }
                  onChange({ ...document, experience: newExp })
                }
              : undefined
          }
          tagName="p"
          className="max-w-[84px] shrink-0 text-right text-[8.5px] leading-tight text-neutral-600"
          placeholder="Period"
        />
      </div>
      {job.description ? (
        <p className="text-[8.5px] text-neutral-600">
          <EditableText
            value={job.description}
            onChange={
              onChange
                ? (val) => {
                    const newExp = [...document.experience!]
                    newExp[jobIdx] = { ...job, description: val }
                    onChange({ ...document, experience: newExp })
                  }
                : undefined
            }
            singleLine={false}
            placeholder="Role context"
          />
        </p>
      ) : null}
      {job.highlights?.length ? (
        <ul className="mt-1 list-none space-y-0.5 pl-2.5">
          {job.highlights.map((highlight, highlightIdx) => (
            <li key={`${highlight}-${highlightIdx}`} className="text-[9.5px] text-neutral-800">
              <span className="select-none">• </span>
              <EditableText
                value={highlight}
                onChange={
                  onChange
                    ? (val) => {
                        const newExp = [...document.experience!]
                        const newHighlights = [...(job.highlights ?? [])]
                        newHighlights[highlightIdx] = val
                        newExp[jobIdx] = { ...job, highlights: newHighlights }
                        onChange({ ...document, experience: newExp })
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

function CoreStrengthsGrid({ rows }: { rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white">
      {rows.map((row, rowIndex) => (
        <div
          key={`strength-row-${rowIndex}`}
          className={cn("grid", rowIndex > 0 && "border-t border-neutral-200")}
          style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))` }}
        >
          {row.map((skill, columnIndex) => (
            <div
              key={`${skill}-${columnIndex}`}
              className={cn(
                "px-2 py-2 text-center text-[8.5px] font-medium leading-tight text-neutral-800",
                columnIndex > 0 && "border-l border-neutral-200",
              )}
            >
              {skill}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function ProjectCard({
  project,
  brandColor,
}: {
  project: ResumeProjectItem
  brandColor: string
}) {
  const cardTint = cssColorWithAlpha(brandColor, 0.07)
  const cardBorder = cssColorWithAlpha(brandColor, 0.22)
  const metaParts = parseProjectMetaParts(project.meta, project.url)

  return (
    <article
      className="rounded-sm border p-2"
      style={{ backgroundColor: cardTint, borderColor: cardBorder }}
    >
      {project.url ? (
        <a
          href={project.url}
          className="text-[10px] font-bold leading-tight hover:underline"
          style={{ color: brandColor }}
          target="_blank"
          rel="noreferrer"
        >
          {project.title}
        </a>
      ) : (
        <p className="text-[10px] font-bold text-[#0F1923]">{project.title}</p>
      )}
      <p className="mt-0.5 text-[8px] text-neutral-600">
        {metaParts.map((part, index) => (
          <span key={`${part.label}-${index}`} className="inline">
            {index > 0 ? <span className="text-neutral-400 select-none"> | </span> : null}
            {part.href ? (
              <a
                href={part.href}
                className="hover:underline"
                style={{ color: brandColor }}
                target="_blank"
                rel="noreferrer"
              >
                {part.label}
              </a>
            ) : (
              part.label
            )}
          </span>
        ))}
      </p>
      <p className="mt-1 text-[9px] leading-snug text-neutral-800">{project.description}</p>
      <p className="mt-1 text-[8px] leading-snug text-neutral-600">Stack: {project.stack}</p>
    </article>
  )
}

export function OfficialHtmlResume({
  document,
  brandColor,
  fontFamily,
  display,
  onChange,
}: ResumeHtmlLayoutProps) {
  const summaryParts = getOfficialSummaryParts(document)
  const contactParts = buildOfficialContactParts(document)
  const linkParts = buildOfficialLinkParts(document)
  const metrics = getOfficialHighlightMetrics(document)
  const coreStrengths = getOfficialCoreStrengths(document)
  const projects = getOfficialProjects(document)
  const capabilities = getOfficialCapabilities(document)
  const education = getOfficialEducation(document)
  const certifications = getOfficialCertifications(document)
  const capabilityLastRowStart =
    capabilities.length - (capabilities.length % 2 === 0 ? 2 : 1)
  const experience = document.experience ?? []
  const { professional, earlier } = splitExperienceGroups(experience)

  const sectionSpacingClass = getSectionSpacingMbClass(display.sectionSpacing)

  const renderExperienceSection = (
    title: string,
    jobs: ResumeExperienceItem[],
    startIndex: number,
  ) => {
    if (!jobs.length) return null

    const experienceVariant = display.experienceGridLayout ? "grid" : "stack"
    const blocks = jobs.map((job, index) => (
      <ExperienceBlock
        key={`${job.company}-${job.period}-${startIndex + index}`}
        job={job}
        jobIdx={startIndex + index}
        document={document}
        onChange={onChange}
        variant={experienceVariant}
      />
    ))

    return (
      <OfficialSection
        sectionId="experience"
        title={title}
        brandColor={brandColor}
        display={display}
      >
        {display.experienceGridLayout ? (
          <div className="grid grid-cols-2 gap-2">{blocks}</div>
        ) : (
          blocks
        )}
      </OfficialSection>
    )
  }

  return (
    <div
      className={cn(
        "flex min-h-full flex-col px-10 pb-14 text-[10px] leading-[1.45] text-neutral-900",
        RESUME_HTML_ROOT_CLASS,
      )}
      style={{ fontFamily }}
    >
      <header className="-mx-10 mb-4">
        <div
          className="flex items-start justify-between gap-4 px-10 pt-7 pb-4"
          style={{ backgroundColor: OFFICIAL_HEADER_BG }}
        >
          <div className="min-w-0 flex-1">
            <EditableText
              value={document.name}
              onChange={onChange ? (val) => onChange({ ...document, name: val }) : undefined}
              tagName="h1"
              className="text-[19px] font-bold leading-[1.05] tracking-[0.01em]"
              style={{ color: OFFICIAL_HEADER_NAME_COLOR }}
              placeholder="Your Name"
            />
            <EditableText
              value={formatOfficialTitle(document.title)}
              onChange={
                onChange
                  ? (val) => onChange({ ...document, title: val.replace(/\s*\|\s*/g, " / ") })
                  : undefined
              }
              tagName="p"
              className="mt-1.5 text-[11.5px] font-bold leading-snug tracking-[0.02em]"
              style={{ color: brandColor }}
              placeholder="Professional Title"
            />
            {summaryParts.tagline ? (
              <EditableText
                value={summaryParts.tagline}
                onChange={
                  onChange
                    ? (val) => {
                        const parts = document.summary!.split("\n\n")
                        parts[0] = val
                        onChange({ ...document, summary: parts.join("\n\n") })
                      }
                    : undefined
                }
                tagName="p"
                singleLine={false}
                className="mt-2.5 max-w-[42rem] text-[9px] font-normal leading-[1.45]"
                style={{ color: OFFICIAL_HEADER_TAGLINE_COLOR }}
                placeholder="Professional tagline"
              />
            ) : null}
            {contactParts.length ? (
              <p className="mt-3 flex flex-wrap items-center gap-x-1 text-[8px] font-normal leading-snug">
                {contactParts.map((part, index) => (
                  <span key={`${part.label}-${index}`} className="inline-flex items-center gap-1">
                    {index > 0 ? (
                      <span
                        style={{ color: OFFICIAL_HEADER_CONTACT_SEPARATOR }}
                        className="select-none"
                      >
                        |
                      </span>
                    ) : null}
                    {part.href ? (
                      <a
                        href={part.href}
                        className="underline decoration-white/40 underline-offset-2"
                        style={{ color: OFFICIAL_HEADER_NAME_COLOR }}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {part.label}
                      </a>
                    ) : (
                      <span style={{ color: OFFICIAL_HEADER_TAGLINE_COLOR }}>{part.label}</span>
                    )}
                  </span>
                ))}
              </p>
            ) : null}
          </div>
          {document.portrait ? (
            <ResumePortraitImage
              src={document.portrait.src}
              shape="flower"
              alt={`${document.name} portrait`}
              brandColor={brandColor}
              className="h-[4.25rem] w-[5.375rem] shrink-0"
            />
          ) : null}
        </div>
      </header>

      {summaryParts.profile || metrics.length ? (
        <div className={sectionSpacingClass}>
          {summaryParts.profile ? (
            <OfficialSection
              sectionId="summary"
              title="Professional Profile"
              brandColor={brandColor}
              display={display}
              className={metrics.length ? "mb-0" : undefined}
            >
              {summaryParts.profile.split("\n\n").map((paragraph, idx) => (
                <EditableText
                  key={idx}
                  value={paragraph}
                  onChange={
                    onChange
                      ? (val) => {
                          const parts = getOfficialSummaryParts(document)
                          const profileParts = (parts.profile ?? "").split("\n\n")
                          profileParts[idx] = val
                          onChange({
                            ...document,
                            summary: parts.tagline
                              ? [parts.tagline, ...profileParts].join("\n\n")
                              : profileParts.join("\n\n"),
                          })
                        }
                      : undefined
                  }
                  tagName="p"
                  singleLine={false}
                  className="mb-1 last:mb-0 text-[9.5px] text-neutral-800"
                  placeholder="Professional profile paragraph"
                />
              ))}
            </OfficialSection>
          ) : null}

          {metrics.length ? (
            <div
              className={cn(
                "overflow-hidden rounded-sm border border-neutral-200 bg-white",
                summaryParts.profile && "mt-1.5",
              )}
            >
              <div
                className="grid"
                style={{ gridTemplateColumns: `repeat(${metrics.length}, minmax(0, 1fr))` }}
              >
                {metrics.map((metric, index) => (
                  <div
                    key={`${metric.value}-${metric.label}`}
                    className={cn(
                      "px-2 py-2 text-center",
                      index > 0 && "border-l border-neutral-200",
                    )}
                  >
                    <p className="text-[14px] font-bold leading-tight text-neutral-900">
                      {formatOfficialMetricText(metric.value)}
                    </p>
                    <p className="mt-0.5 text-[7.5px] font-medium leading-tight text-neutral-600">
                      {formatOfficialMetricText(metric.label)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {coreStrengths.length ? (
        <OfficialSection sectionId="skills" title="Core Strengths" brandColor={brandColor} display={display}>
          <CoreStrengthsGrid rows={coreStrengths} />
        </OfficialSection>
      ) : null}

      {renderExperienceSection("Professional Experience", professional, 0)}

      {projects.length ? (
        <OfficialSection sectionId="skills" title="Selected Product Work" brandColor={brandColor} display={display}>
          <div className="grid grid-cols-2 gap-2">
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} brandColor={brandColor} />
            ))}
          </div>
        </OfficialSection>
      ) : null}

      {renderExperienceSection("Earlier Experience", earlier, professional.length)}

      {education || certifications.length ? (
        <OfficialSection
          sectionId="education"
          title="Education and Certification"
          brandColor={brandColor}
          display={display}
        >
          <div
            className={cn(
              "grid overflow-hidden rounded-sm border border-neutral-200",
              education && certifications.length > 0 ? "grid-cols-2" : "grid-cols-1",
            )}
          >
            {education ? (
              <div
                className={cn(
                  "p-2 text-[9.5px] text-neutral-800",
                  certifications.length > 0 && "border-r border-neutral-200",
                )}
              >
                <EditableText
                  value={education.degree}
                  onChange={
                    onChange
                      ? (val) =>
                          onChange({
                            ...document,
                            education: { ...education, degree: val },
                          })
                      : undefined
                  }
                  tagName="p"
                  className="font-medium"
                  placeholder="Degree"
                />
                <EditableText
                  value={education.school}
                  onChange={
                    onChange
                      ? (val) =>
                          onChange({
                            ...document,
                            education: { ...education, school: val },
                          })
                      : undefined
                  }
                  tagName="p"
                  placeholder="School"
                />
                <p>
                  <EditableText
                    value={education.years}
                    onChange={
                      onChange
                        ? (val) =>
                            onChange({
                              ...document,
                              education: { ...education, years: val },
                            })
                        : undefined
                    }
                    placeholder="Years"
                  />
                  <span className="text-neutral-400 select-none"> | </span>
                  <EditableText
                    value={education.location}
                    onChange={
                      onChange
                        ? (val) =>
                            onChange({
                              ...document,
                              education: { ...education, location: val },
                            })
                        : undefined
                    }
                    placeholder="Location"
                  />
                </p>
              </div>
            ) : null}
            {certifications.length ? (
              <div className="space-y-2 p-2 text-[9.5px] text-neutral-800">
                {certifications.map((certification, certIdx) => (
                  <div key={`${certification.title}-${certification.date}`}>
                    <EditableText
                      value={certification.title}
                      onChange={
                        onChange
                          ? (val) => {
                              const newCerts = [...certifications]
                              newCerts[certIdx] = { ...certification, title: val }
                              onChange({ ...document, certifications: newCerts })
                            }
                          : undefined
                      }
                      tagName="p"
                      className="font-medium"
                      placeholder="Certification"
                    />
                    <EditableText
                      value={certification.issuer}
                      onChange={
                        onChange
                          ? (val) => {
                              const newCerts = [...certifications]
                              newCerts[certIdx] = { ...certification, issuer: val }
                              onChange({ ...document, certifications: newCerts })
                            }
                          : undefined
                      }
                      tagName="p"
                      placeholder="Issuer"
                    />
                    <p>
                      <EditableText
                        value={certification.date}
                        onChange={
                          onChange
                            ? (val) => {
                                const newCerts = [...certifications]
                                newCerts[certIdx] = { ...certification, date: val }
                                onChange({ ...document, certifications: newCerts })
                              }
                            : undefined
                        }
                        placeholder="Date"
                      />
                      {certification.credentialId ? (
                        <>
                          <span className="text-neutral-400 select-none"> | Credential ID </span>
                          {certification.credentialId}
                        </>
                      ) : null}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </OfficialSection>
      ) : null}

      {capabilities.length ? (
        <OfficialSection
          sectionId="skills"
          title="Capabilities and Tools"
          brandColor={brandColor}
          display={display}
        >
          <div className="grid grid-cols-2 overflow-hidden rounded-sm border border-neutral-200">
            {capabilities.map((category, index) => (
              <div
                key={category.label}
                className={cn(
                  "p-2",
                  index % 2 === 0 && "border-r border-neutral-200",
                  index < capabilityLastRowStart && "border-b border-neutral-200",
                )}
              >
                <p className="text-[9px] font-bold text-[#0F1923]">{category.label}</p>
                <p className="text-[8.5px] leading-snug text-neutral-600">{category.values}</p>
              </div>
            ))}
          </div>
        </OfficialSection>
      ) : null}

      {document.languages?.length || linkParts.length ? (
        <div className={cn(sectionSpacingClass, "space-y-3")}>
          {document.languages?.length ? (
            <div>
              <p
                className="text-[9.5px] font-bold uppercase tracking-[0.08em]"
                style={{ color: brandColor }}
              >
                Languages
              </p>
              <p className="mt-1 text-[9.5px] text-neutral-800">
                {formatLanguageLine(document.languages)}
              </p>
            </div>
          ) : null}

          {linkParts.length ? (
            <div>
              <p
                className="text-[9.5px] font-bold uppercase tracking-[0.08em]"
                style={{ color: brandColor }}
              >
                Links
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-x-1 text-[8.5px] text-neutral-600">
                {linkParts.map((part, index) => (
                  <span key={`${part.label}-footer-${index}`} className="inline-flex items-center gap-1">
                    {index > 0 ? <span className="text-neutral-400 select-none">|</span> : null}
                    <a
                      href={part.href}
                      className="hover:underline"
                      style={{ color: brandColor }}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {part.label}
                    </a>
                  </span>
                ))}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      <footer className="mt-6 text-left">
        <span className="text-[7.5px] text-neutral-500">{buildOfficialFooterLabel(document)}</span>
      </footer>
    </div>
  )
}
