/**
 * Captures section screenshots from the 100x Agent Extension (Demo Design System Test).
 *
 * Prerequisite: local app running at AGENT_CAPTURE_URL (default http://127.0.0.1:5174)
 *   cd "/Users/akshaysainistarbase/Demo Design System Test" && npm run dev -- --port 5174
 *
 * Run: npm run capture:agent
 */
import { mkdir, unlink } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { chromium, type BrowserContext, type Page } from "playwright"
import sharp from "sharp"

const DEFAULT_BASE_URL = "http://127.0.0.1:5174"
const BASE_URL = (process.env.AGENT_CAPTURE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, "")
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.join(__dirname, "../public/projects/v1-100x-proto")

const NAV_OPTIONS = { waitUntil: "networkidle" as const, timeout: 90_000 }
const SETTLE_MS = 4000

const MOCK_SESSION = JSON.stringify({
  session: {
    id: "capture-session",
    token: "capture-token",
    userId: "capture-user",
    expiresAt: "2099-01-01T00:00:00.000Z",
  },
  user: {
    id: "capture-user",
    name: "Demo User",
    email: "demo@example.com",
    emailVerified: true,
  },
})

type CaptureTarget = {
  file: string
  path: string
  requiresAuth?: boolean
}

const CAPTURES: CaptureTarget[] = [
  { file: "hero.webp", path: "/100x", requiresAuth: true },
  { file: "chat.webp", path: "/dashboard", requiresAuth: true },
  { file: "home.webp", path: "/100x", requiresAuth: true },
  { file: "workflows.webp", path: "/workflows/1", requiresAuth: true },
  { file: "data.webp", path: "/data-explorer", requiresAuth: true },
  { file: "apps.webp", path: "/applets", requiresAuth: true },
  { file: "design-system.webp", path: "/design-system", requiresAuth: false },
]

async function saveWebp(pngPath: string, webpPath: string) {
  await sharp(pngPath).webp({ quality: 85 }).toFile(webpPath)
  await unlink(pngPath)
}

async function setupCaptureContext(context: BrowserContext) {
  await context.addInitScript(() => {
    localStorage.setItem("agent-name", "Agent")
    localStorage.setItem("accent-color", "#FF354B")
    localStorage.setItem("theme-mode", "light")
    localStorage.setItem(
      "data-sources",
      JSON.stringify([
        {
          id: "capture-data-source",
          title: "Lead pipeline export",
          data: [
            { company: "Acme Corp", stage: "Qualified", owner: "Alex" },
            { company: "Northwind", stage: "Discovery", owner: "Sam" },
            { company: "Globex", stage: "Proposal", owner: "Jordan" },
          ],
          metadata: { source: "chat", createdAt: Date.now() },
          timestamp: Date.now(),
        },
      ]),
    )
    localStorage.setItem(
      "applets",
      JSON.stringify([
        {
          id: "capture-applet",
          description: "Focus timer",
          title: "Pomodoro Focus Timer",
          timestamp: Date.now(),
        },
      ]),
    )
  })

  await context.route("**/neondb/auth/get-session", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: MOCK_SESSION,
    })
  })

  await context.route("**/api/user-preferences**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        preferences: {
          agent_name: "Agent",
          accent_color: "#FF354B",
          theme_mode: "light",
          interests: ["devtools", "automation"],
        },
      }),
    })
  })

  await context.route("**/api/chat-threads**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, threads: [] }),
    })
  })

  await context.route("**/api/data-sources**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, dataSources: [] }),
    })
  })
}

async function waitForPageReady(page: Page) {
  await page.waitForTimeout(SETTLE_MS)
  await page
    .locator("text=Loading...")
    .first()
    .waitFor({ state: "hidden", timeout: 15_000 })
    .catch(() => undefined)
}

async function captureMobile(page: Page) {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${BASE_URL}/agent`, NAV_OPTIONS)
  await waitForPageReady(page)

  const mobileWebp = path.join(OUTPUT_DIR, "mobile.webp")
  const mobilePng = mobileWebp.replace(/\.webp$/, ".png")
  await page.screenshot({ path: mobilePng, type: "png", fullPage: false })
  await saveWebp(mobilePng, mobileWebp)
  console.log("  ✓ mobile.webp")
}

async function capture() {
  await mkdir(OUTPUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  })

  await setupCaptureContext(context)

  const page = await context.newPage()

  try {
    await page.goto(`${BASE_URL}/design-system`, NAV_OPTIONS)
  } catch (error) {
    await browser.close()
    throw new Error(
      `Could not reach ${BASE_URL}. Start the local app first:\n` +
        `  cd "/Users/akshaysainistarbase/Demo Design System Test" && npm run dev -- --port 5174\n` +
        `Original error: ${error instanceof Error ? error.message : error}`,
    )
  }

  await page.setViewportSize({ width: 1440, height: 900 })

  for (const target of CAPTURES) {
    const webpPath = path.join(OUTPUT_DIR, target.file)
    const pngPath = webpPath.replace(/\.webp$/, ".png")

    try {
      await page.goto(`${BASE_URL}${target.path}`, NAV_OPTIONS)
      await waitForPageReady(page)
      await page.screenshot({ path: pngPath, type: "png", fullPage: false })
      await saveWebp(pngPath, webpPath)
      console.log(`  ✓ ${target.file}`)
    } catch (error) {
      console.warn(
        `Skipped ${target.file}:`,
        error instanceof Error ? error.message : error,
      )
    }
  }

  try {
    await captureMobile(page)
  } catch (error) {
    console.warn(
      "Skipped mobile.webp:",
      error instanceof Error ? error.message : error,
    )
  }

  await browser.close()
  console.log(`Saved screenshots to public/projects/v1-100x-proto/`)
  console.log(`Source: ${BASE_URL}`)
}

capture().catch((error) => {
  console.error(error)
  process.exit(1)
})
