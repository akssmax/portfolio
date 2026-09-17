import { cn } from "@/lib/utils"

type OsBrandMarkProps = {
  className?: string
}

/** Pixel runs of the A-mark on a 24×18 grid — 1 CSS px per cell, matching Geist Pixel Square. */
const RUNS = [
  [11, 1, 2],
  [10, 2, 4],
  [10, 3, 4],
  [9, 4, 6],
  [8, 5, 7],
  [8, 6, 6],
  [7, 7, 6],
  [6, 8, 7],
  [6, 9, 6],
  [17, 9, 1],
  [5, 10, 6],
  [17, 10, 2],
  [4, 11, 7],
  [16, 11, 4],
  [4, 12, 6],
  [15, 12, 5],
  [3, 13, 12],
  [20, 13, 1],
  [2, 14, 12],
  [19, 14, 3],
  [2, 15, 11],
  [18, 15, 4],
  [1, 16, 12],
  [18, 16, 5],
  [0, 17, 12],
  [17, 17, 7],
] as const

export function OsBrandMark({ className }: OsBrandMarkProps) {
  return (
    <svg
      viewBox="0 0 24 18"
      width={24}
      height={18}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      shapeRendering="crispEdges"
      className={cn("landing-2-brand-mark", className)}
    >
      {RUNS.map(([x, y, w]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={1} />
      ))}
    </svg>
  )
}
