export const M3_SHAPE_IDS = [
  "circle",
  "square",
  "slanted",
  "arch",
  "fan",
  "arrow",
  "semicircle",
  "oval",
  "pill",
  "triangle",
  "diamond",
  "hexagon",
  "pentagon",
  "gem",
  "very-sunny",
  "sunny",
  "4-sided-cookie",
  "6-sided-cookie",
  "7-sided-cookie",
  "9-sided-cookie",
  "12-sided-cookie",
  "ghost-ish",
  "4-leaf-clover",
  "8-leaf-clover",
  "burst",
  "soft-burst",
  "shape36",
  "boom",
  "soft-boom",
  "flower",
  "puffy",
  "puffy-diamond",
  "pixel-circle",
  "pixel-triangle",
  "bun",
  "heart",
] as const

export type M3ShapeId = (typeof M3_SHAPE_IDS)[number]

export type M3ShapeAsset = {
  id: M3ShapeId
  label: string
  width: number
  height: number
  extension: "svg" | "png"
}

export const m3Shapes: M3ShapeAsset[] = [
  { id: "circle", label: "Circle", width: 320, height: 320, extension: "svg" },
  { id: "square", label: "Square", width: 320, height: 320, extension: "svg" },
  { id: "slanted", label: "Slanted", width: 320, height: 300, extension: "svg" },
  { id: "arch", label: "Arch", width: 310, height: 310, extension: "svg" },
  { id: "fan", label: "Fan", width: 300, height: 300, extension: "svg" },
  { id: "arrow", label: "Arrow", width: 320, height: 290, extension: "svg" },
  {
    id: "semicircle",
    label: "Semicircle",
    width: 320,
    height: 200,
    extension: "svg",
  },
  { id: "oval", label: "Oval", width: 300, height: 300, extension: "svg" },
  { id: "pill", label: "Pill", width: 316, height: 316, extension: "svg" },
  { id: "triangle", label: "Triangle", width: 316, height: 286, extension: "svg" },
  { id: "diamond", label: "Diamond", width: 268, height: 320, extension: "svg" },
  { id: "hexagon", label: "Hexagon", width: 372, height: 254, extension: "svg" },
  {
    id: "pentagon",
    label: "Pentagon",
    width: 314.663,
    height: 305.127,
    extension: "svg",
  },
  { id: "gem", label: "Gem", width: 584, height: 604, extension: "png" },
  {
    id: "very-sunny",
    label: "Very sunny",
    width: 320,
    height: 320,
    extension: "svg",
  },
  { id: "sunny", label: "Sunny", width: 640, height: 640, extension: "png" },
  {
    id: "4-sided-cookie",
    label: "4-sided cookie",
    width: 292,
    height: 292,
    extension: "svg",
  },
  {
    id: "6-sided-cookie",
    label: "6-sided cookie",
    width: 296,
    height: 316,
    extension: "svg",
  },
  {
    id: "7-sided-cookie",
    label: "7-sided cookie",
    width: 320,
    height: 316,
    extension: "svg",
  },
  {
    id: "9-sided-cookie",
    label: "9-sided cookie",
    width: 324,
    height: 319.95,
    extension: "svg",
  },
  {
    id: "12-sided-cookie",
    label: "12-sided cookie",
    width: 320,
    height: 320,
    extension: "svg",
  },
  {
    id: "ghost-ish",
    label: "Ghost-ish",
    width: 300,
    height: 300,
    extension: "svg",
  },
  {
    id: "4-leaf-clover",
    label: "4-leaf clover",
    width: 296,
    height: 296,
    extension: "svg",
  },
  {
    id: "8-leaf-clover",
    label: "8-leaf clover",
    width: 320,
    height: 320,
    extension: "svg",
  },
  { id: "burst", label: "Burst", width: 332, height: 332, extension: "svg" },
  {
    id: "soft-burst",
    label: "Soft burst",
    width: 320,
    height: 330,
    extension: "svg",
  },
  { id: "shape36", label: "Shape 36", width: 328, height: 328, extension: "svg" },
  { id: "boom", label: "Boom", width: 312, height: 312, extension: "svg" },
  {
    id: "soft-boom",
    label: "Soft boom",
    width: 320,
    height: 320,
    extension: "svg",
  },
  { id: "flower", label: "Flower", width: 363, height: 287, extension: "svg" },
  { id: "puffy", label: "Puffy", width: 320, height: 320, extension: "svg" },
  {
    id: "puffy-diamond",
    label: "Puffy diamond",
    width: 312,
    height: 312,
    extension: "svg",
  },
  {
    id: "pixel-circle",
    label: "Pixel circle",
    width: 248,
    height: 320,
    extension: "svg",
  },
  {
    id: "pixel-triangle",
    label: "Pixel triangle",
    width: 302.25,
    height: 312,
    extension: "svg",
  },
  { id: "bun", label: "Bun", width: 302.25, height: 312, extension: "svg" },
  { id: "heart", label: "Heart", width: 320, height: 286, extension: "svg" },
]

const m3ShapeById = Object.fromEntries(
  m3Shapes.map((shape) => [shape.id, shape]),
) as Record<M3ShapeId, M3ShapeAsset>

export function getM3ShapeAsset(id: M3ShapeId): M3ShapeAsset {
  return m3ShapeById[id]
}

export function getM3ShapeSrc(id: M3ShapeId): string {
  const asset = getM3ShapeAsset(id)
  return `/m3-shapes/${id}.${asset.extension}`
}

export function getM3ShapeMeta(id: M3ShapeId): M3ShapeAsset {
  return getM3ShapeAsset(id)
}

export function isM3ShapeId(value: string): value is M3ShapeId {
  return (M3_SHAPE_IDS as readonly string[]).includes(value)
}
