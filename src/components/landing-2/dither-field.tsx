import { cn } from "@/lib/utils"

export type DitherColor = "pink" | "cyan" | "yellow" | "lime" | "orange" | "violet"

type DitherFieldProps = {
  variant?: "sky" | "desktop"
  color?: DitherColor
  className?: string
}

export function DitherField({
  variant = "desktop",
  color = "pink",
  className,
}: DitherFieldProps) {
  if (variant === "sky") {
    return (
      <div className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden>
        <picture>
          <source srcSet="/images/hero-light-valley.avif" type="image/avif" />
          <source srcSet="/images/hero-light-valley.webp" type="image/webp" />
          <img
            src="/images/hero-light-valley.jpg"
            alt=""
            width={1600}
            height={900}
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 size-full object-cover object-center contrast-125 saturate-150"
          />
        </picture>
        <div className="absolute inset-0 bg-[oklch(0.78_0.18_350_/_0.28)] mix-blend-color" />
        <div
          className="absolute inset-0 opacity-55 mix-blend-multiply"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(0.55 0.2 350) 0.7px, transparent 0.8px)",
            backgroundSize: "3px 3px",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
      </div>
    )
  }

  return (
    <div
      className={cn("landing-2-dither absolute inset-0 overflow-hidden", className)}
      data-color={color}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[var(--os-desktop)]" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--os-desktop-dot) 1px, transparent 1.15px)",
          backgroundSize: "4px 4px",
        }}
      />
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 12% 80%, oklch(0.28 0.08 0 / 0.28), transparent 62%), radial-gradient(ellipse 50% 65% at 92% 18%, oklch(0.28 0.08 0 / 0.22), transparent 60%)",
        }}
      />
    </div>
  )
}
