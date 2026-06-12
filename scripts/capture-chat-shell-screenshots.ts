/**
 * Captures section screenshots from the 100x Chat Shell app.
 * Run: npm run capture:chat-shell
 *
 * Defaults to https://llm-daisyui-shell.vercel.app/
 * Override with CHAT_SHELL_URL for local capture.
 */
import { mkdir, unlink } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { chromium } from "playwright"
import sharp from "sharp"

const BASE_URL =
  process.env.CHAT_SHELL_URL ?? "https://llm-daisyui-shell.vercel.app/"
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.join(__dirname, "../public/projects/chat-shell")

const NAV_OPTIONS = { waitUntil: "domcontentloaded" as const, timeout: 90_000 }
const SETTLE_MS = 2500

type CaptureTarget =
  | { file: string; type: "sidebar"; label: string }
  | { file: string; type: "design-empty" }

const CAPTURES: CaptureTarget[] = [
  { file: "hero.webp", type: "sidebar", label: "Design" },
  { file: "chat.webp", type: "sidebar", label: "New Chat" },
  { file: "memory.webp", type: "sidebar", label: "Memory" },
  { file: "knowledge.webp", type: "sidebar", label: "Knowledge" },
  { file: "design-canvas.webp", type: "design-empty" },
  { file: "playground.webp", type: "sidebar", label: "Playground" },
]

async function saveWebp(pngPath: string, webpPath: string) {
  await sharp(pngPath).webp({ quality: 85 }).toFile(webpPath)
  await unlink(pngPath)
}

async function clickSidebarItem(page: import("playwright").Page, label: string) {
  const button = page.getByRole("button", { name: label, exact: true }).first()
  await button.click({ timeout: 15_000 })
  await page.waitForTimeout(SETTLE_MS)
}

async function capture() {
  await mkdir(OUTPUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  })

  await page.goto(BASE_URL, NAV_OPTIONS)
  await page.waitForTimeout(SETTLE_MS)

  for (const target of CAPTURES) {
    const webpPath = path.join(OUTPUT_DIR, target.file)
    const pngPath = webpPath.replace(/\.webp$/, ".png")

    try {
      if (target.type === "sidebar") {
        await clickSidebarItem(page, target.label)
      } else if (target.type === "design-empty") {
        await clickSidebarItem(page, "Design")
      }

      await page.screenshot({ path: pngPath, type: "png", fullPage: false })
      await saveWebp(pngPath, webpPath)
      console.log(`  ✓ ${target.file}`)
    } catch (error) {
      console.warn(`Skipped ${target.file}:`, error instanceof Error ? error.message : error)
    }
  }

  await browser.close()
  console.log(`Saved screenshots to public/projects/chat-shell/`)
}

capture().catch((error) => {
  console.error(error)
  process.exit(1)
})
