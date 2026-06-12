import { cn } from "@/lib/utils"

type TechLogoProps = {
  src: string
  name: string
  className?: string
}

export function TechLogo({ src, name, className }: TechLogoProps) {
  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        "size-6 shrink-0 bg-current text-foreground/60 transition-colors group-hover:text-foreground",
        "[mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]",
        "[-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]",
        className,
      )}
      style={{
        maskImage: `url("${src}")`,
        WebkitMaskImage: `url("${src}")`,
      }}
    />
  )
}
