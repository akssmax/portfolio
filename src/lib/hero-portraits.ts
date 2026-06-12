import type { M3FeatureImageItem } from "@/components/m3-shapes/m3-feature-image"

export const heroPortraitItems = [
  { src: "/images/portraits/01.png", shape: "gem" },
  { src: "/images/portraits/02.png", shape: "arch" },
  { src: "/images/portraits/03.png", shape: "flower" },
  { src: "/images/portraits/04.png", shape: "heart" },
  { src: "/images/portraits/05.png", shape: "soft-burst" },
  { src: "/images/portraits/06.png", shape: "diamond" },
  { src: "/images/portraits/07.png", shape: "circle" },
  { src: "/images/portraits/08.png", shape: "4-leaf-clover" },
] as const satisfies readonly M3FeatureImageItem[]
