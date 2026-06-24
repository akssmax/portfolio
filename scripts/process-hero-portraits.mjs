import { execFileSync } from "node:child_process"
import { rm, mkdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const portraitsDir = path.resolve(rootDir, "../public/images/portraits")
const assetsDir =
  "/Users/akshaysainistarbase/.cursor/projects/Users-akshaysainistarbase-Desktop-Design-Portfolio/assets"

const SOURCES = [
  {
    input: "PXL_20260611_051641114-d89689a9-7927-42c9-8713-3c19ce4f23eb.png",
    output: "01.png",
  },
  {
    input: "PXL_20260617_125220464-Photoroom-583b9c5f-b8ee-489d-bb6d-87a7ec29dfca.png",
    output: "02.png",
  },
  {
    input: "Selfie_2026-06-17_at_19.27.47-33fa834a-9fc1-45d9-87bc-e6d633f79785.png",
    output: "04.png",
  },
]

const SIZE = 1000
async function removeBackground(inputPath) {
  return execFileSync(
    "python3",
    [
      "-c",
      `from rembg import remove
from pathlib import Path
import sys
sys.stdout.buffer.write(remove(Path(sys.argv[1]).read_bytes()))`,
      inputPath,
    ],
    { encoding: "buffer", maxBuffer: 50 * 1024 * 1024 },
  )
}

async function normalizePortrait(inputBuffer) {
  const trimmed = await sharp(inputBuffer)
    .trim({ threshold: 10 })
    .toBuffer()

  const meta = await sharp(trimmed).metadata()
  const maxSide = Math.max(meta.width ?? SIZE, meta.height ?? SIZE)
  const pad = Math.round(maxSide * 0.08)

  return sharp(trimmed)
    .extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .resize(SIZE, SIZE, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()
}

await mkdir(portraitsDir, { recursive: true })

for (const file of await import("node:fs/promises").then((fs) =>
  fs.readdir(portraitsDir),
)) {
  await rm(path.join(portraitsDir, file))
}

for (const { input, output } of SOURCES) {
  const inputPath = path.join(assetsDir, input)
  console.log(`Processing ${input} -> ${output}`)

  const cutout = await removeBackground(inputPath)
  const png = await normalizePortrait(cutout)
  const pngPath = path.join(portraitsDir, output)
  const webpPath = path.join(portraitsDir, output.replace(/\.png$/, ".webp"))

  await sharp(png).toFile(pngPath)
  await sharp(png).webp({ quality: 85, alphaQuality: 100 }).toFile(webpPath)

  const info = await sharp(pngPath).metadata()
  console.log(`  ${output}: ${info.width}x${info.height}, alpha=${info.hasAlpha}`)
}

console.log("Done.")
