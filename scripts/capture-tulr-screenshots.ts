/**
 * Builds Tulr feature-card mobile asset from the existing hero artwork.
 * Run: npm run capture:tulr
 */
import { mkdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import sharp from "sharp"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.join(__dirname, "../public/projects/tulr")
const HERO_PNG = path.join(OUTPUT_DIR, "hero.png")
const MOBILE_WEBP = path.join(OUTPUT_DIR, "mobile.webp")

async function capture() {
  await mkdir(OUTPUT_DIR, { recursive: true })

  await sharp(HERO_PNG)
    .resize(780, 1386, { fit: "cover", position: "top" })
    .webp({ quality: 85 })
    .toFile(MOBILE_WEBP)

  console.log("  ✓ mobile.webp")
  console.log(`Saved Tulr mobile asset to public/projects/tulr/`)
}

capture().catch((error) => {
  console.error(error)
  process.exit(1)
})
