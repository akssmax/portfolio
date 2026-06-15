export const RESUME_BUILDER_COOKIE = "resume_builder"

export function getResumeBuilderSecret(): string | undefined {
  return process.env.RESUME_BUILDER_SECRET?.trim() || undefined
}

export function parseCookieHeader(header: string | null): Record<string, string> {
  if (!header) return {}

  return header.split(";").reduce<Record<string, string>>((cookies, part) => {
    const [rawKey, ...rest] = part.trim().split("=")
    if (!rawKey) return cookies
    cookies[rawKey] = decodeURIComponent(rest.join("="))
    return cookies
  }, {})
}

export function isResumeBuilderAuthorized(cookieHeader: string | null): boolean {
  const secret = getResumeBuilderSecret()
  if (!secret) return false

  const cookies = parseCookieHeader(cookieHeader)
  return cookies[RESUME_BUILDER_COOKIE] === secret
}

export function resumeBuilderAuthCookie(secret: string): string {
  return `${RESUME_BUILDER_COOKIE}=${encodeURIComponent(secret)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`
}
