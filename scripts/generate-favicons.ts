import { writeFileSync } from "node:fs"
import { join } from "node:path"

import sharp from "sharp"

import { buildFaviconSvg } from "../src/lib/brand/monogram-mark"

const publicDir = join(import.meta.dirname, "../public")

const lightSvg = buildFaviconSvg("light")
const darkSvg = buildFaviconSvg("dark")

writeFileSync(join(publicDir, "favicon-light.svg"), lightSvg)
writeFileSync(join(publicDir, "favicon-dark.svg"), darkSvg)
writeFileSync(join(publicDir, "brand/footer-monogram.svg"), lightSvg)

async function writePng(
  svg: string,
  filename: string,
  size: number,
) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(join(publicDir, filename))
}

await writePng(lightSvg, "apple-touch-icon.png", 180)
await writePng(lightSvg, "icon-192.png", 192)
await writePng(lightSvg, "icon-512.png", 512)
await writePng(lightSvg, "favicon-32.png", 32)
await sharp(Buffer.from(lightSvg)).resize(32, 32).png().toFile(join(publicDir, "favicon.ico"))

console.log("Generated monogram favicons in public/")
