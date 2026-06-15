import { createHmac, randomUUID, timingSafeEqual } from "node:crypto"

export const RESUME_BUILDER_COOKIE = "resume_builder"
const SESSION_MAX_AGE = 604800

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

function signSessionToken(token: string, secret: string): string {
  return createHmac("sha256", secret).update(token).digest("base64url")
}

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)
  if (aBuf.length !== bBuf.length) return false
  return timingSafeEqual(aBuf, bBuf)
}

export function createResumeBuilderSession(): string | null {
  const secret = getResumeBuilderSecret()
  if (!secret) return null

  const token = randomUUID()
  return `${token}.${signSessionToken(token, secret)}`
}

export function isResumeBuilderAuthorized(cookieHeader: string | null): boolean {
  const secret = getResumeBuilderSecret()
  if (!secret) return false

  const cookies = parseCookieHeader(cookieHeader)
  const value = cookies[RESUME_BUILDER_COOKIE]
  if (!value) return false

  const dotIndex = value.lastIndexOf(".")
  if (dotIndex <= 0) return false

  const token = value.slice(0, dotIndex)
  const signature = value.slice(dotIndex + 1)
  if (!token || !signature) return false

  return safeEqual(signature, signSessionToken(token, secret))
}

export function resumeBuilderAuthCookie(sessionValue: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : ""
  return `${RESUME_BUILDER_COOKIE}=${encodeURIComponent(sessionValue)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_MAX_AGE}${secure}`
}

export function verifyResumeBuilderPassword(password: string, secret: string): boolean {
  const passwordBuf = Buffer.from(password)
  const secretBuf = Buffer.from(secret)
  if (passwordBuf.length !== secretBuf.length) return false
  return timingSafeEqual(passwordBuf, secretBuf)
}
