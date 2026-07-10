/**
 * Generates the social/SEO OG banner from the light-mode hero background.
 *
 * Run: npm run generate:og-banner
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

import sharp from "sharp"

const rootDir = join(fileURLToPath(import.meta.url), "..", "..")
const publicDir = join(rootDir, "public")
const imagesDir = join(publicDir, "images")

const WIDTH = 1200
const HEIGHT = 630

const BACKGROUND = join(imagesDir, "hero-light-valley.jpg")
const OUTPUT = join(imagesDir, "og-banner.jpg")

function buildGradientOverlay() {
  return Buffer.from(`<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="heroWash" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35" />
        <stop offset="45%" stop-color="#ffffff" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#f5f5f5" stop-opacity="0.42" />
      </linearGradient>
      <linearGradient id="textScrim" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
        <stop offset="58%" stop-color="#ffffff" stop-opacity="0.08" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.28" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#heroWash)" />
    <rect width="100%" height="100%" fill="url(#textScrim)" />
  </svg>`)
}

function buildTextOverlay() {
  const name = "Akshay Saini"
  const title = "Design Engineer • Product Designer"
  const textX = 640
  const nameY = 302
  const titleY = 358

  return Buffer.from(`<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .name {
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 68px;
        font-weight: 700;
        letter-spacing: -0.03em;
        fill: #0f1923;
      }
      .title {
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 27px;
        font-weight: 500;
        letter-spacing: -0.01em;
        fill: #404040;
      }
    </style>
    <text x="${textX}" y="${nameY}" class="name">${name}</text>
    <text x="${textX}" y="${titleY}" class="title">${title}</text>
  </svg>`)
}

async function main() {
  readFileSync(BACKGROUND)

  const background = await sharp(BACKGROUND)
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "center" })
    .toBuffer()

  await sharp(background)
    .composite([
      { input: buildGradientOverlay(), top: 0, left: 0 },
      { input: buildTextOverlay(), top: 0, left: 0 },
    ])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(OUTPUT)

  console.log(`Wrote ${OUTPUT} (${WIDTH}x${HEIGHT})`)
}

await main()
