"use client"

import { useEffect } from "react"
import { useLocation } from "@tanstack/react-router"

import { captureEvent, schedulePosthogLoad } from "@/lib/analytics/posthog"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  // Load the SDK after the page is idle; events before that are queued.
  useEffect(() => schedulePosthogLoad(), [])

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
    captureEvent("$pageview", {
      $current_url: window.location.href,
      $pathname: location.pathname,
    })
  }, [location.pathname])

  return null
}
