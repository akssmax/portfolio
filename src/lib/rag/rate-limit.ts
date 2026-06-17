type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

export type RateLimitConfig = {
  windowMs: number
  maxRequests: number
}

export const CHAT_RATE_LIMIT: RateLimitConfig = {
  windowMs: 60 * 60 * 1000,
  maxRequests: 20,
}

export const UNLOCK_RATE_LIMIT: RateLimitConfig = {
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
}

export const WEB_SEARCH_RATE_LIMIT: RateLimitConfig = {
  windowMs: 60 * 60 * 1000,
  maxRequests: 30,
}

export const RESUME_GEN_RATE_LIMIT: RateLimitConfig = {
  windowMs: 24 * 60 * 60 * 1000,
  maxRequests: process.env.NODE_ENV === "development" ? 50 : 3,
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig = CHAT_RATE_LIMIT,
): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now()
  const bucketKey = `${config.windowMs}:${config.maxRequests}:${key}`
  const bucket = buckets.get(bucketKey)

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(bucketKey, { count: 1, resetAt: now + config.windowMs })
    return { allowed: true }
  }

  if (bucket.count >= config.maxRequests) {
    return { allowed: false, retryAfterMs: bucket.resetAt - now }
  }

  bucket.count += 1
  return { allowed: true }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown"
  }
  return request.headers.get("x-real-ip") || "unknown"
}

export function rateLimitHeaders(retryAfterMs?: number): Record<string, string> {
  if (!retryAfterMs) return {}
  return { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) }
}
