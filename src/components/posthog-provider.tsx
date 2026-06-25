"use client"

import { useEffect } from "react"
import { useLocation } from "@tanstack/react-router"
import posthog from "posthog-js"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = import.meta.env.VITE_POSTHOG_KEY
    const host = import.meta.env.VITE_POSTHOG_HOST || "https://eu.i.posthog.com"

    if (typeof window !== "undefined" && key) {
      try {
        posthog.init(key, {
          api_host: host,
          capture_pageview: false,
          capture_pageleave: true,
          person_profiles: "identified_only",
        })
      } catch (err) {
        console.error("PostHog initialization failed:", err)
      }
    }
  }, [])

  return (
    <>
      {children}
      <PostHogRouteTracker />
    </>
  )
}

function PostHogRouteTracker() {
  const location = useLocation()

  useEffect(() => {
    const key = import.meta.env.VITE_POSTHOG_KEY
    if (typeof window !== "undefined" && key) {
      try {
        posthog.capture("$pageview", {
          $current_url: window.location.href,
          $pathname: location.pathname,
        })
      } catch (err) {
        console.error("PostHog pageview capture failed:", err)
      }
    }
  }, [location.pathname])

  return null
}
