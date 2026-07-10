/**
 * Captures Resume Builder screenshots from the portfolio app.
 *
 * Prerequisite: portfolio dev server running (default http://localhost:3000)
 *   cd design-portfolio && npm run dev
 *
 * Optional owner workspace capture — set RESUME_CAPTURE_PASSWORD to match
 * RESUME_BUILDER_SECRET in .env.local (auto-read from .env.local when unset).
 *
 * Run: npm run capture:resume
 */
import { readFileSync } from "node:fs"
import { mkdir, unlink } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { chromium, type BrowserContext, type Page } from "playwright"
import sharp from "sharp"

const DEFAULT_BASE_URL = "http://localhost:3000"
const BASE_URL = (process.env.RESUME_CAPTURE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, "")
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.join(__dirname, "../public/projects/resume-builder")
const ENV_LOCAL_PATH = path.join(__dirname, "../.env.local")

const NAV_OPTIONS = { waitUntil: "domcontentloaded" as const, timeout: 90_000 }
const SETTLE_MS = 2500

const SAMPLE_DOCUMENT = {
  name: "Akshay Saini",
  title: "Product Designer / Design Engineer",
  location: "Bengaluru, India",
  portrait: {
    src: "/images/hero-portrait.png",
    shape: "arch",
  },
  summary:
    "Product designer who ships — I design in Figma and build production-ready React. 8+ years across fintech, devtools, and agentic AI.",
  experience: [
    {
      company: "100x.bot",
      role: "Design Engineer",
      period: "2025 — Present",
      location: "Remote",
      description:
        "Design and build agentic AI product experiences for a browser-native automation platform — extension UI, marketing site, and design system.",
      highlights: [
        "Redesigned the Chromium extension with shadcn/ui and semantic design tokens",
        "Managed and collaborated with 2 junior developers to ship features faster",
        "Website revamp with MCP & Cursor — code-based handoff from initial Figma design",
        "Built design system on shadcn/ui with AI-native components",
        "Multiple code-based prototypes for sales team and feature development",
      ],
    },
    {
      company: "Kodo",
      role: "Senior Product Designer",
      period: "2024 — 2025",
      location: "Bengaluru",
      description: "Enterprise fintech marketing and product UI for intake-to-pay workflows.",
    },
  ],
  education: {
    degree: "B.Tech, Computer Science",
    school: "Example University",
    years: "2014 — 2018",
    location: "India",
  },
  skills: [
    "Design: Product UI, design systems, prototyping, user research",
    "Engineering: React, TypeScript, Tailwind, TanStack Start",
    "Tools: Figma, Cursor, Framer Motion",
  ],
  contact: {
    email: "akshaysaini.design@gmail.com",
    phone: "+91 00000 00000",
    website: "https://www.akshaysaini.xyz",
    linkedin: "https://linkedin.com/in/akshaysaini",
    github: "https://github.com/akssmax",
  },
}

function loadUnlockPassword(): string | undefined {
  if (process.env.RESUME_CAPTURE_PASSWORD?.trim()) {
    return process.env.RESUME_CAPTURE_PASSWORD.trim()
  }

  try {
    const content = readFileSync(ENV_LOCAL_PATH, "utf8")
    const match = content.match(/^RESUME_BUILDER_SECRET=(.+)$/m)
    return match?.[1]?.trim()
  } catch {
    return undefined
  }
}

async function saveWebp(pngPath: string, webpPath: string) {
  await sharp(pngPath).webp({ quality: 85 }).toFile(webpPath)
  await unlink(pngPath)
}

async function screenshotPage(page: Page, fileName: string) {
  const webpPath = path.join(OUTPUT_DIR, fileName)
  const pngPath = webpPath.replace(/\.webp$/, ".png")
  await page.screenshot({ path: pngPath, type: "png", fullPage: false })
  await saveWebp(pngPath, webpPath)
  console.log(`  ✓ ${fileName}`)
}

async function mockResumeGenerate(page: Page) {
  const sseBody = [
    `event: status\ndata: ${JSON.stringify({ phase: "searching", message: "Searching profile…" })}\n\n`,
    `event: status\ndata: ${JSON.stringify({ phase: "structuring", message: "Structuring resume…" })}\n\n`,
    `event: document\ndata: ${JSON.stringify({ document: SAMPLE_DOCUMENT })}\n\n`,
    `event: status\ndata: ${JSON.stringify({ phase: "ready", message: "Ready to download" })}\n\n`,
  ].join("")

  await page.route("**/api/resume/generate", async (route) => {
    await route.fulfill({
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
      },
      body: sseBody,
    })
  })
}

async function openPublicPreview(page: Page) {
  await mockResumeGenerate(page)
  await page.goto(`${BASE_URL}/tools/resume`, NAV_OPTIONS)
  await page.waitForTimeout(SETTLE_MS)

  await page.locator("#profile-url").fill("https://linkedin.com/in/akshaysaini")
  await page.getByRole("button", { name: "Generate resume" }).click()
  await page.getByText("Customize", { exact: true }).waitFor({ timeout: 20_000 })
  await page.waitForTimeout(SETTLE_MS)
}

async function unlockOwnerWorkspace(context: BrowserContext): Promise<boolean> {
  const password = loadUnlockPassword()
  if (!password) return false

  const response = await context.request.post(`${BASE_URL}/api/resume/unlock`, {
    data: { password },
  })

  if (!response.ok()) {
    console.warn("Skipped owner workspace: unlock failed", response.status())
    return false
  }

  return true
}

async function capture() {
  await mkdir(OUTPUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()

  try {
    await page.goto(`${BASE_URL}/tools/resume`, NAV_OPTIONS)
  } catch (error) {
    await browser.close()
    throw new Error(
      `Could not reach ${BASE_URL}. Start the portfolio dev server first:\n` +
        `  cd design-portfolio && npm run dev\n` +
        `Original error: ${error instanceof Error ? error.message : error}`,
    )
  }

  try {
    await screenshotPage(page, "wizard-input.webp")
  } catch (error) {
    console.warn("Skipped wizard-input.webp:", error instanceof Error ? error.message : error)
  }

  try {
    await openPublicPreview(page)
    await screenshotPage(page, "hero.webp")
    await screenshotPage(page, "preview.webp")
  } catch (error) {
    console.warn("Skipped preview captures:", error instanceof Error ? error.message : error)
  }

  try {
    const unlocked = await unlockOwnerWorkspace(context)
    if (unlocked) {
      await page.goto(`${BASE_URL}/resume`, NAV_OPTIONS)
      await page.getByRole("heading", { name: "Resume builder" }).waitFor({ timeout: 20_000 })
      await page.waitForTimeout(SETTLE_MS)
      await screenshotPage(page, "owner.webp")
    } else {
      console.warn("Skipped owner.webp: RESUME_BUILDER_SECRET not configured for capture")
    }
  } catch (error) {
    console.warn("Skipped owner.webp:", error instanceof Error ? error.message : error)
  }

  try {
    await page.setViewportSize({ width: 390, height: 844 })
    await openPublicPreview(page)
    await screenshotPage(page, "mobile.webp")
  } catch (error) {
    console.warn("Skipped mobile.webp:", error instanceof Error ? error.message : error)
  }

  await browser.close()
  console.log(`Saved screenshots to public/projects/resume-builder/`)
  console.log(`Source: ${BASE_URL}`)
}

capture().catch((error) => {
  console.error(error)
  process.exit(1)
})
