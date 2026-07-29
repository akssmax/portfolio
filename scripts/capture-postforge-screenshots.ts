/**
 * Captures Postforge screenshots from the deployed app.
 * Run: npm run capture:postforge
 */
import { mkdir, unlink } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { chromium, type Page } from "playwright"
import sharp from "sharp"

const BASE_URL =
  process.env.POSTFORGE_CAPTURE_URL ?? "https://postforge-kohl.vercel.app/"
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.join(__dirname, "../public/projects/postforge")

const NAV_OPTIONS = { waitUntil: "domcontentloaded" as const, timeout: 90_000 }
const SETTLE_MS = 3500

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

async function captureDesktop(page: Page) {
  console.log("Desktop captures…")

  const routes: Array<{ path: string; file: string }> = [
    { path: "/", file: "hero.webp" },
    { path: "/tool", file: "tool.webp" },
    { path: "/visuals", file: "visuals.webp" },
    { path: "/slides", file: "slides.webp" },
  ]

  for (const route of routes) {
    await page.goto(`${BASE_URL.replace(/\/$/, "")}${route.path}`, NAV_OPTIONS)
    await page.waitForTimeout(SETTLE_MS)
    await screenshotPage(page, route.file)
  }
}

async function captureMobile(page: Page) {
  console.log("Mobile capture…")
  await page.goto(BASE_URL, NAV_OPTIONS)
  await page.waitForTimeout(SETTLE_MS)
  await screenshotPage(page, "mobile.webp")
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true })
  console.log(`Capturing Postforge from ${BASE_URL}`)
  console.log(`Output: ${OUTPUT_DIR}`)

  const browser = await chromium.launch({ headless: true })

  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  })
  const desktopPage = await desktop.newPage()
  await captureDesktop(desktopPage)
  await desktop.close()

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  const mobilePage = await mobile.newPage()
  await captureMobile(mobilePage)
  await mobile.close()

  await browser.close()
  console.log("Done.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
