import type { PostHog } from "posthog-js"

/**
 * PostHog is loaded lazily so its SDK stays out of the main bundle and its
 * recorder / extension scripts don't compete with first paint and hydration.
 * Calls made before it loads are queued and flushed in order.
 */

let client: PostHog | null = null
let loading: Promise<PostHog | null> | null = null
const queue: Array<(posthog: PostHog) => void> = []

function getKey(): string | undefined {
  return typeof window === "undefined" ? undefined : import.meta.env.VITE_POSTHOG_KEY
}

export function loadPosthog(): Promise<PostHog | null> {
  const key = getKey()
  if (!key) return Promise.resolve(null)
  if (loading) return loading

  loading = import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(key, {
        api_host: import.meta.env.VITE_POSTHOG_HOST || "https://eu.i.posthog.com",
        ui_host: "https://eu.posthog.com",
        defaults: "2026-05-30",
        capture_pageview: false,
        capture_pageleave: true,
        person_profiles: "identified_only",
        enable_recording_console_log: true,
      })
      // Start recording explicitly so landing and interactions are captured.
      posthog.startSessionRecording()
      client = posthog
      for (const run of queue.splice(0)) run(posthog)
      return posthog
    })
    .catch((err: unknown) => {
      console.error("PostHog initialization failed:", err)
      return null
    })

  return loading
}

/** Load once the browser is idle after the page has finished loading. */
export function schedulePosthogLoad(): () => void {
  if (!getKey()) return () => {}

  let idleId: number | undefined
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const start = () => {
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(() => void loadPosthog(), { timeout: 4000 })
    } else {
      timeoutId = setTimeout(() => void loadPosthog(), 2000)
    }
  }

  if (document.readyState === "complete") start()
  else window.addEventListener("load", start, { once: true })

  return () => {
    window.removeEventListener("load", start)
    if (idleId !== undefined) window.cancelIdleCallback(idleId)
    if (timeoutId !== undefined) clearTimeout(timeoutId)
  }
}

function withPosthog(run: (posthog: PostHog) => void) {
  if (!getKey()) return
  if (client) {
    run(client)
    return
  }
  queue.push(run)
}

export function captureEvent(event: string, properties?: Record<string, unknown>) {
  withPosthog((posthog) => posthog.capture(event, properties))
}

/** User-intent events load PostHog right away instead of waiting for idle. */
export function captureIntent(event: string, properties?: Record<string, unknown>) {
  withPosthog((posthog) => {
    posthog.capture(event, properties)
    posthog.startSessionRecording()
  })
  void loadPosthog()
}
