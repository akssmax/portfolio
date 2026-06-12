import { useId } from "react"
import type { CSSProperties, ComponentPropsWithoutRef, ReactNode, SVGProps } from "react"

import {
  getM3ShapeAsset,
  getM3ShapeSrc,
  type M3ShapeId,
} from "@/lib/m3-shapes"
import { cn } from "@/lib/utils"

export function getM3ShapeMaskStyle(shape: M3ShapeId): CSSProperties {
  const src = getM3ShapeSrc(shape)
  return {
    maskImage: `url("${src}")`,
    WebkitMaskImage: `url("${src}")`,
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
    maskMode: "alpha",
    WebkitMaskSourceType: "alpha",
  }
}

function M3ShapeSvg({
  shape,
  className,
  children,
  ...props
}: SVGProps<SVGSVGElement> & { shape: M3ShapeId }) {
  const asset = getM3ShapeAsset(shape)

  return (
    <svg
      viewBox={`0 0 ${asset.width} ${asset.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("relative isolate shrink-0 transform-gpu", className)}
      {...props}
    >
      {children}
    </svg>
  )
}

type M3ShapeProps = {
  shape: M3ShapeId
  className?: string
  fillClassName?: string
}

/** Filled M3 shape — use as icon background or decorative container. */
export function M3Shape({
  shape,
  className,
  fillClassName = "text-primary",
}: M3ShapeProps) {
  const maskId = useId()
  const asset = getM3ShapeAsset(shape)
  const maskSrc = getM3ShapeSrc(shape)

  return (
    <M3ShapeSvg
      shape={shape}
      role="presentation"
      className={cn(fillClassName, className)}
      aria-hidden
    >
      <defs>
        <mask id={maskId}>
          <image
            href={maskSrc}
            width={asset.width}
            height={asset.height}
            preserveAspectRatio="none"
          />
        </mask>
      </defs>
      <rect
        width={asset.width}
        height={asset.height}
        fill="currentColor"
        mask={`url(#${maskId})`}
      />
    </M3ShapeSvg>
  )
}

type M3ShapeClipProps = M3ShapeProps & {
  children: ReactNode
}

/** Clips children to an M3 shape — use for images and content placeholders. */
export function M3ShapeClip({
  shape,
  className,
  children,
}: M3ShapeClipProps) {
  const maskId = useId()
  const asset = getM3ShapeAsset(shape)
  const maskSrc = getM3ShapeSrc(shape)

  return (
    <M3ShapeSvg shape={shape} className={className}>
      <defs>
        <mask id={maskId}>
          <image
            href={maskSrc}
            width={asset.width}
            height={asset.height}
            preserveAspectRatio="none"
          />
        </mask>
      </defs>
      <foreignObject
        width={asset.width}
        height={asset.height}
        mask={`url(#${maskId})`}
      >
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          className="size-full overflow-hidden"
        >
          {children}
        </div>
      </foreignObject>
    </M3ShapeSvg>
  )
}

type M3ShapePlaceholderProps = M3ShapeProps & {
  label?: string
}

/** Empty placeholder box clipped to an M3 shape. */
export function M3ShapePlaceholder({
  shape,
  className,
  fillClassName = "bg-muted",
  label,
}: M3ShapePlaceholderProps) {
  return (
    <M3ShapeClip shape={shape} className={className}>
      <div
        className={cn(
          "flex size-full items-center justify-center",
          fillClassName,
        )}
        aria-label={label}
      >
        {label ? (
          <span className="px-2 text-center text-xs text-muted-foreground">
            {label}
          </span>
        ) : null}
      </div>
    </M3ShapeClip>
  )
}

type M3ShapeIconProps = M3ShapeProps & {
  children: ReactNode
  iconClassName?: string
}

/** Icon or content centered on top of a soft M3 shape background. */
export function M3ShapeIcon({
  shape,
  className,
  fillClassName = "text-primary/15",
  iconClassName,
  children,
}: M3ShapeIconProps) {
  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <M3Shape
        shape={shape}
        className="size-full"
        fillClassName={fillClassName}
      />
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center text-primary",
          iconClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}

type M3ShapeImageProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  shape: M3ShapeId
  src: string
  alt: string
}

/** Image clipped to an M3 shape. */
export function M3ShapeImage({
  shape,
  src,
  alt,
  className,
  style,
  ...props
}: M3ShapeImageProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("relative block shrink-0 bg-transparent", className)}
      style={{
        ...getM3ShapeMaskStyle(shape),
        ...style,
      }}
      {...props}
    >
      <img
        src={src}
        alt=""
        aria-hidden
        draggable={false}
        className="block size-full object-cover"
      />
    </div>
  )
}
