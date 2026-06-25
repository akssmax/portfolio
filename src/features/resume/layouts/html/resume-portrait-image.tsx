import { M3ShapeImage } from "@/components/m3-shapes/m3-shape"
import { isM3ShapeId, type M3ShapeId } from "@/lib/m3-shapes"
import { cn } from "@/lib/utils"

const DEFAULT_PORTRAIT_SHAPE: M3ShapeId = "arch"

type ResumePortraitImageProps = {
  src: string
  shape?: string
  alt: string
  className?: string
  brandColor?: string
}

export function ResumePortraitImage({
  src,
  shape,
  alt,
  className,
  brandColor,
}: ResumePortraitImageProps) {
  const shapeId =
    shape && isM3ShapeId(shape) ? shape : DEFAULT_PORTRAIT_SHAPE

  return (
    <M3ShapeImage
      shape={shapeId}
      src={src}
      alt={alt}
      className={cn("size-[4.5rem] shrink-0", className)}
      style={brandColor ? { backgroundColor: brandColor } : undefined}
    />
  )
}
