import { CompanyLogo } from "@/components/shared/company-logo"

import {
  addCertification,
  addExperienceHighlight,
  addExperienceJob,
  addLanguage,
  addSkill,
  addSummaryParagraph,
  removeCertification,
  removeExperienceHighlight,
  removeExperienceJob,
  removeLanguage,
  removeSkill,
} from "../../resume-document-mutations"
import { EditableText } from "./editable-text"
import { HtmlResumeSection } from "./html-resume-section"
import { ResumeContactFields } from "./resume-contact-fields"
import { ResumeListAddButton, ResumeListRemoveButton } from "./resume-list-controls"
import { RESUME_HTML_ROOT_CLASS, type ResumeHtmlLayoutProps } from "./resume-html-props"
import { cn } from "@/lib/utils"

export function ModernHtmlResume({
  document,
  brandColor,
  fontFamily,
  display,
  onChange,
}: ResumeHtmlLayoutProps) {
  return (
    <div
      className={cn(
        "px-10 pt-[34px] pb-14 text-[10px] leading-[1.45] text-neutral-900 flex flex-col min-h-full",
        RESUME_HTML_ROOT_CLASS,
      )}
      style={{ fontFamily }}
    >
      <header
        className="mb-5 border-b pb-3 flex justify-between items-start gap-4"
        style={{ borderBottomColor: brandColor }}
      >
        <div className="min-w-0 flex-1">
          <EditableText
            value={document.name}
            onChange={onChange ? (val) => onChange({ ...document, name: val }) : undefined}
            tagName="h1"
            className="text-[22px] font-bold leading-tight text-[#0F1923]"
            placeholder="Your Name"
          />
          <EditableText
            value={document.title}
            onChange={onChange ? (val) => onChange({ ...document, title: val }) : undefined}
            tagName="p"
            className="text-[11px] font-semibold mt-1"
            style={{ color: brandColor }}
            placeholder="Professional Title"
          />
          <div className="flex flex-wrap items-center gap-1 text-[9px] text-neutral-500 mt-0.5">
            <EditableText
              value={document.location}
              onChange={onChange ? (val) => onChange({ ...document, location: val }) : undefined}
              placeholder="Location"
            />
            {document.contact?.website ? (
              <>
                <span className="text-neutral-400 select-none">·</span>
                <a
                  href={document.contact.website}
                  className="hover:underline"
                  style={{ color: brandColor }}
                  target="_blank"
                  rel="noreferrer"
                >
                  {document.contact.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                </a>
              </>
            ) : null}
          </div>
        </div>
        {document.portrait ? (
          <div className="shrink-0">
            <img
              src={document.portrait.src}
              alt={document.name}
              className="size-16 rounded-lg object-cover border"
              style={{ borderColor: brandColor }}
            />
          </div>
        ) : null}
      </header>

      <div className="flex-1 flex gap-5">
        <aside className="w-[150px] shrink-0 flex flex-col gap-3.5 border-r border-neutral-200 pr-2.5">
          {document.contact ? (
            <HtmlResumeSection
              sectionId="contact"
              title="Contact"
              brandColor={brandColor}
              display={display}
            >
              <ResumeContactFields
                contact={document.contact}
                brandColor={brandColor}
                display={display}
                document={document}
                onChange={onChange}
                className="text-[8.5px] text-neutral-800"
                linkClassName="truncate block"
              />
            </HtmlResumeSection>
          ) : null}

          {document.skills?.length ? (
            <HtmlResumeSection
              sectionId="skills"
              title="Skills"
              brandColor={brandColor}
              display={display}
            >
              <div className="flex flex-wrap gap-1">
                {document.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="group/skill inline-flex items-center gap-0.5 rounded-md border px-1.5 py-0.5 text-[8px] text-neutral-800 bg-neutral-50/50 border-neutral-200"
                  >
                    <EditableText
                      value={skill}
                      onChange={
                        onChange
                          ? (val) => {
                              const newSkills = [...document.skills!]
                              newSkills[sIdx] = val
                              onChange({ ...document, skills: newSkills })
                            }
                          : undefined
                      }
                      placeholder="Skill"
                    />
                    {onChange ? (
                      <ResumeListRemoveButton
                        label={`Remove skill ${sIdx + 1}`}
                        onClick={() => onChange(removeSkill(document, sIdx))}
                        className="opacity-0 group-hover/skill:opacity-100"
                      />
                    ) : null}
                  </span>
                ))}
              </div>
              {onChange ? (
                <ResumeListAddButton
                  label="Add skill"
                  onClick={() => onChange(addSkill(document))}
                  className="mt-1"
                />
              ) : null}
            </HtmlResumeSection>
          ) : null}

          {document.education ? (
            <HtmlResumeSection
              sectionId="education"
              title="Education"
              brandColor={brandColor}
              display={display}
            >
              <div className="text-[8.5px] text-neutral-800">
                <p className="font-semibold">
                  <EditableText
                    value={document.education.degree}
                    onChange={
                      onChange
                        ? (val) =>
                            onChange({
                              ...document,
                              education: { ...document.education!, degree: val },
                            })
                        : undefined
                    }
                    placeholder="Degree"
                  />
                </p>
                <p className="text-neutral-500">
                  <EditableText
                    value={document.education.school}
                    onChange={
                      onChange
                        ? (val) =>
                            onChange({
                              ...document,
                              education: { ...document.education!, school: val },
                            })
                        : undefined
                    }
                    placeholder="School"
                  />
                </p>
                <p className="text-neutral-400">
                  <EditableText
                    value={document.education.years}
                    onChange={
                      onChange
                        ? (val) =>
                            onChange({
                              ...document,
                              education: { ...document.education!, years: val },
                            })
                        : undefined
                    }
                    placeholder="Years"
                  />
                </p>
              </div>
            </HtmlResumeSection>
          ) : null}

          {document.languages?.length ? (
            <HtmlResumeSection
              sectionId="languages"
              title="Languages"
              brandColor={brandColor}
              display={display}
            >
              <div className="flex flex-col gap-1 text-[8.5px] text-neutral-800">
                {document.languages.map((language, lIdx) => (
                  <div key={lIdx} className="group/lang flex items-start justify-between gap-1">
                    <EditableText
                      value={language.name}
                      onChange={
                        onChange
                          ? (val) => {
                              const newLanguages = [...document.languages!]
                              newLanguages[lIdx] = { ...language, name: val }
                              onChange({ ...document, languages: newLanguages })
                            }
                          : undefined
                      }
                      className="font-medium"
                      placeholder="Language"
                    />
                    <div className="flex items-center gap-0.5">
                      <EditableText
                        value={language.level}
                        onChange={
                          onChange
                            ? (val) => {
                                const newLanguages = [...document.languages!]
                                newLanguages[lIdx] = { ...language, level: val }
                                onChange({ ...document, languages: newLanguages })
                              }
                            : undefined
                        }
                        className="text-neutral-500 text-right"
                        placeholder="Level"
                      />
                      {onChange ? (
                        <ResumeListRemoveButton
                          label={`Remove language ${lIdx + 1}`}
                          onClick={() => onChange(removeLanguage(document, lIdx))}
                          className="opacity-0 group-hover/lang:opacity-100"
                        />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
              {onChange ? (
                <ResumeListAddButton
                  label="Add language"
                  onClick={() => onChange(addLanguage(document))}
                  className="mt-1"
                />
              ) : null}
            </HtmlResumeSection>
          ) : null}
        </aside>

        <main className="flex-1 min-w-0 flex flex-col gap-4">
          {document.summary ? (
            <HtmlResumeSection
              sectionId="summary"
              title="Summary"
              brandColor={brandColor}
              display={display}
            >
              {document.summary.split("\n\n").map((paragraph, idx) => (
                <EditableText
                  key={idx}
                  value={paragraph}
                  onChange={
                    onChange
                      ? (val) => {
                          const paragraphs = document.summary!.split("\n\n")
                          paragraphs[idx] = val
                          onChange({ ...document, summary: paragraphs.join("\n\n") })
                        }
                      : undefined
                  }
                  tagName="p"
                  singleLine={false}
                  className="mb-1 text-neutral-800"
                  placeholder="Summary paragraph"
                />
              ))}
              {onChange ? (
                <ResumeListAddButton
                  label="Add paragraph"
                  onClick={() => onChange(addSummaryParagraph(document))}
                />
              ) : null}
            </HtmlResumeSection>
          ) : null}

          {document.experience?.length ? (
            <HtmlResumeSection
              sectionId="experience"
              title="Experience"
              brandColor={brandColor}
              display={display}
            >
              <div className="flex flex-col gap-3">
                {document.experience.map((job, jobIdx) => (
                  <article key={jobIdx} className="group/job relative">
                    {onChange ? (
                      <ResumeListRemoveButton
                        label={`Remove job ${jobIdx + 1}`}
                        onClick={() => onChange(removeExperienceJob(document, jobIdx))}
                        className="absolute -right-1 -top-1 opacity-0 group-hover/job:opacity-100"
                      />
                    ) : null}
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {job.logoSrc ? (
                          <CompanyLogo
                            src={job.logoSrc}
                            name={job.company}
                            className="size-6 rounded-md p-0.5 bg-white border border-neutral-200 text-neutral-900"
                          />
                        ) : null}
                        <p className="font-bold text-neutral-900 truncate">
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
                            placeholder="Role"
                          />
                          {" · "}
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
                            placeholder="Company"
                          />
                        </p>
                      </div>
                      <div className="text-right text-[8.5px] text-neutral-500 shrink-0">
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
                          placeholder="Period"
                        />
                      </div>
                    </div>
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
                      tagName="p"
                      singleLine={false}
                      className="text-neutral-800 mb-1"
                      placeholder="Job description"
                    />
                    {job.highlights?.length ? (
                      <ul className="list-disc pl-3 text-neutral-800 space-y-0.5">
                        {job.highlights.map((highlight, hIdx) => (
                          <li key={hIdx} className="group/hl flex items-start gap-1">
                            <EditableText
                              value={highlight}
                              onChange={
                                onChange
                                  ? (val) => {
                                      const newHighlights = [...job.highlights!]
                                      newHighlights[hIdx] = val
                                      const newExp = [...document.experience!]
                                      newExp[jobIdx] = { ...job, highlights: newHighlights }
                                      onChange({ ...document, experience: newExp })
                                    }
                                  : undefined
                              }
                              placeholder="Highlight"
                            />
                            {onChange ? (
                              <ResumeListRemoveButton
                                label={`Remove highlight ${hIdx + 1}`}
                                onClick={() =>
                                  onChange(removeExperienceHighlight(document, jobIdx, hIdx))
                                }
                                className="opacity-0 group-hover/hl:opacity-100"
                              />
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {onChange ? (
                      <ResumeListAddButton
                        label="Add bullet"
                        onClick={() => onChange(addExperienceHighlight(document, jobIdx))}
                        className="mt-0.5"
                      />
                    ) : null}
                  </article>
                ))}
              </div>
              {onChange ? (
                <ResumeListAddButton
                  label="Add role"
                  onClick={() => onChange(addExperienceJob(document))}
                  className="mt-1"
                />
              ) : null}
            </HtmlResumeSection>
          ) : null}

          {document.certifications?.length ? (
            <HtmlResumeSection
              sectionId="certifications"
              title="Certifications"
              brandColor={brandColor}
              display={display}
            >
              <div className="flex flex-col gap-1.5">
                {document.certifications.map((certification, cIdx) => (
                  <div key={cIdx} className="group/cert flex items-start gap-1 text-neutral-800">
                    <div className="min-w-0 flex-1">
                      <EditableText
                        value={certification.title}
                        onChange={
                          onChange
                            ? (val) => {
                                const newCertifications = [...document.certifications!]
                                newCertifications[cIdx] = { ...certification, title: val }
                                onChange({ ...document, certifications: newCertifications })
                              }
                            : undefined
                        }
                        className="font-medium"
                        placeholder="Certification Title"
                      />
                      {" — "}
                      <EditableText
                        value={certification.issuer}
                        onChange={
                          onChange
                            ? (val) => {
                                const newCertifications = [...document.certifications!]
                                newCertifications[cIdx] = { ...certification, issuer: val }
                                onChange({ ...document, certifications: newCertifications })
                              }
                            : undefined
                        }
                        className="text-neutral-600"
                        placeholder="Issuer"
                      />
                      {" ("}
                      <EditableText
                        value={certification.date}
                        onChange={
                          onChange
                            ? (val) => {
                                const newCertifications = [...document.certifications!]
                                newCertifications[cIdx] = { ...certification, date: val }
                                onChange({ ...document, certifications: newCertifications })
                              }
                            : undefined
                        }
                        className="text-neutral-500"
                        placeholder="Date"
                      />
                      {")"}
                    </div>
                    {onChange ? (
                      <ResumeListRemoveButton
                        label={`Remove certification ${cIdx + 1}`}
                        onClick={() => onChange(removeCertification(document, cIdx))}
                        className="opacity-0 group-hover/cert:opacity-100"
                      />
                    ) : null}
                  </div>
                ))}
              </div>
              {onChange ? (
                <ResumeListAddButton
                  label="Add certification"
                  onClick={() => onChange(addCertification(document))}
                  className="mt-1"
                />
              ) : null}
            </HtmlResumeSection>
          ) : null}

          {document.interests?.length ? (
            <HtmlResumeSection
              sectionId="interests"
              title="Interests"
              brandColor={brandColor}
              display={display}
            >
              <p className="text-neutral-800">
                <EditableText
                  value={document.interests.join(" · ")}
                  onChange={
                    onChange
                      ? (val) => {
                          const newInterests = val.split(/\s*·\s*/).filter(Boolean)
                          onChange({ ...document, interests: newInterests })
                        }
                      : undefined
                  }
                  placeholder="Interest 1 · Interest 2"
                />
              </p>
            </HtmlResumeSection>
          ) : null}
        </main>
      </div>

      <footer className="mt-auto flex items-center justify-between border-t border-neutral-200 pt-2.5">
        <span className="text-[8px] text-neutral-500">
          {document.name} · {document.title}
        </span>
      </footer>
    </div>
  )
}
