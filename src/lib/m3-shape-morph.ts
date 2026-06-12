import { interpolate } from "flubber"

import { getM3ShapePath } from "@/lib/m3-shape-paths"
import type { M3ShapeId } from "@/lib/m3-shapes"

export function createShapeMorphInterpolator(
  from: M3ShapeId,
  to: M3ShapeId,
): ((t: number) => string) | null {
  const fromPath = getM3ShapePath(from)
  const toPath = getM3ShapePath(to)

  if (!fromPath || !toPath) return null

  return interpolate(fromPath, toPath, { maxSegmentLength: 8 })
}
