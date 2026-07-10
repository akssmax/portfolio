/** mailto: href for resume contact email fields. */
export function toMailtoHref(email: string): string {
  const trimmed = email.trim()
  return trimmed ? `mailto:${trimmed}` : "mailto:"
}

/** tel: href for resume contact phone fields (keeps leading + for country codes). */
export function toTelHref(phone: string): string {
  const normalized = phone.replace(/[^\d+]/g, "")
  return normalized ? `tel:${normalized}` : "tel:"
}
