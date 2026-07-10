import {
  DEFAULT_CONTACT_ICONS,
  type ResumeContactIconField,
  type ResumeDisplayPreferences,
} from "../../resume-display-preferences"
import { toMailtoHref, toTelHref } from "../../contact-link-utils"
import type { ResumeContact, ResumeDocument } from "../../types"
import { EditableText } from "./editable-text"
import { ResumeIcon } from "./resume-icon"
import { cn } from "@/lib/utils"

type ResumeContactFieldsProps = {
  contact: ResumeContact
  brandColor: string
  display: ResumeDisplayPreferences
  onChange?: (updated: ResumeDocument) => void
  document: ResumeDocument
  className?: string
  itemClassName?: string
  linkClassName?: string
}

function ContactRow({
  iconField,
  display,
  brandColor,
  children,
  className,
}: {
  iconField: ResumeContactIconField
  display: ResumeDisplayPreferences
  brandColor: string
  children: React.ReactNode
  className?: string
}) {
  const showIcon = display.showContactIcons
  const iconName = DEFAULT_CONTACT_ICONS[iconField]

  return (
    <div className={cn("flex items-start gap-1.5", className)}>
      {showIcon && iconName ? (
        <ResumeIcon
          name={iconName}
          className="mt-[2px]"
          style={{ color: brandColor }}
        />
      ) : null}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

export function ResumeContactFields({
  contact,
  brandColor,
  display,
  onChange,
  document,
  className,
  itemClassName,
  linkClassName,
}: ResumeContactFieldsProps) {
  const updateContact = (patch: Partial<ResumeContact>) => {
    if (!onChange) return
    onChange({ ...document, contact: { ...contact, ...patch } })
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <ContactRow iconField="email" display={display} brandColor={brandColor} className={itemClassName}>
        {onChange ? (
          <>
            <span className="max-sm:hidden">
              <EditableText
                value={contact.email}
                onChange={(val) => updateContact({ email: val })}
                placeholder="Email"
              />
            </span>
            <a
              href={toMailtoHref(contact.email)}
              className={cn("no-underline hover:underline sm:hidden", linkClassName)}
            >
              {contact.email}
            </a>
          </>
        ) : (
          <a href={toMailtoHref(contact.email)} className={cn("hover:underline", linkClassName)}>
            {contact.email}
          </a>
        )}
      </ContactRow>
      <ContactRow iconField="phone" display={display} brandColor={brandColor} className={itemClassName}>
        {onChange ? (
          <>
            <span className="max-sm:hidden">
              <EditableText
                value={contact.phone}
                onChange={(val) => updateContact({ phone: val })}
                placeholder="Phone"
              />
            </span>
            <a
              href={toTelHref(contact.phone)}
              className={cn("no-underline hover:underline sm:hidden", linkClassName)}
            >
              {contact.phone}
            </a>
          </>
        ) : (
          <a href={toTelHref(contact.phone)} className={cn("hover:underline", linkClassName)}>
            {contact.phone}
          </a>
        )}
      </ContactRow>
      {contact.website !== undefined ? (
        <ContactRow iconField="website" display={display} brandColor={brandColor} className={itemClassName}>
          {onChange ? (
            <EditableText
              value={contact.website}
              onChange={(val) => updateContact({ website: val })}
              placeholder="Website URL"
            />
          ) : (
            <a
              href={contact.website}
              className={cn("hover:underline", linkClassName)}
              style={{ color: brandColor }}
              target="_blank"
              rel="noreferrer"
            >
              {contact.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
            </a>
          )}
        </ContactRow>
      ) : null}
      {contact.linkedin !== undefined ? (
        <ContactRow iconField="linkedin" display={display} brandColor={brandColor} className={itemClassName}>
          {onChange ? (
            <EditableText
              value={contact.linkedin}
              onChange={(val) => updateContact({ linkedin: val })}
              placeholder="LinkedIn URL"
            />
          ) : (
            <a
              href={contact.linkedin}
              className={cn("hover:underline break-all", linkClassName)}
              style={{ color: brandColor }}
              target="_blank"
              rel="noreferrer"
            >
              {contact.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
            </a>
          )}
        </ContactRow>
      ) : null}
      {contact.github !== undefined ? (
        <ContactRow iconField="github" display={display} brandColor={brandColor} className={itemClassName}>
          {onChange ? (
            <EditableText
              value={contact.github}
              onChange={(val) => updateContact({ github: val })}
              placeholder="GitHub URL"
            />
          ) : (
            <a
              href={contact.github}
              className={cn("hover:underline break-all", linkClassName)}
              style={{ color: brandColor }}
              target="_blank"
              rel="noreferrer"
            >
              {contact.github.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
            </a>
          )}
        </ContactRow>
      ) : null}
    </div>
  )
}
