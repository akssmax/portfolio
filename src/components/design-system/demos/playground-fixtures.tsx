import { useState } from "react"
import { Save, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { FooterGradients } from "@/components/landing/footer-gradients"
import { CtaSection } from "@/components/landing/contact-section"
import { MonogramPattern } from "@/components/brand/monogram-patterns"
import { FooterMonogram } from "@/components/brand/footer-monogram"
import {
  M3Shape,
  M3ShapeClip,
  M3ShapeIcon,
  M3ShapeImage,
  M3ShapePlaceholder,
} from "@/components/m3-shapes"

export function ButtonPropDemo() {
  return (
    <Button type="button">
      <Save aria-hidden="true" />
      <span className="group-data-[size=icon]/button:sr-only group-data-[size=icon-lg]/button:sr-only group-data-[size=icon-sm]/button:sr-only group-data-[size=icon-xs]/button:sr-only">
        Save changes
      </span>
    </Button>
  )
}
export function AvatarPropDemo() {
  return (
    <Avatar>
      <AvatarImage src="/images/portraits/01.webp" alt="Akshay Saini" />
      <AvatarFallback>AS</AvatarFallback>
    </Avatar>
  )
}
export function BadgePropDemo() {
  return <Badge>In progress</Badge>
}
export function InputPropDemo() {
  return (
    <div className="w-full max-w-xs space-y-2">
      <Label htmlFor="playground-email">Email address</Label>
      <Input id="playground-email" type="email" placeholder="you@example.com" />
    </div>
  )
}
export function SwitchPropDemo() {
  return (
    <div className="flex items-center gap-3">
      <Switch id="playground-notifications" />
      <Label htmlFor="playground-notifications">Email notifications</Label>
    </div>
  )
}

export function FooterGradientsPropDemo() {
  return (
    <div className="relative h-72 w-full overflow-hidden rounded-xl border border-border bg-background">
      <div className="absolute inset-x-0 bottom-0 h-4/5">
        <FooterGradients
          activeVariant="fold3d"
          reveal="mount"
          bars={9}
          blur={15}
          peak={0.98}
          valley={0.55}
          pointiness={0.5}
          foldAngle={74}
          depth={620}
          riseMs={1100}
        />
      </div>
    </div>
  )
}

export function MonogramPatternPropDemo() {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative h-72 w-full overflow-hidden rounded-xl border border-border bg-background"
    >
      <MonogramPattern
        variant="grid"
        tone="primary"
        isParentHovered={hovered}
        aria-hidden="true"
        className="absolute inset-0"
      />
    </div>
  )
}

export function FooterMonogramPropDemo() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-background px-6">
      <FooterMonogram animation="draw" size="footer" />
    </div>
  )
}

export function ContactSectionPropDemo() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card [--cta-cutout-bg:var(--card)]">
      <CtaSection
        variant="dub-notch"
        topCutout
        bottomCutout
        topCutoutPosition="center"
        bottomCutoutPosition="right"
      />
    </div>
  )
}

export function M3ShapePropDemo() {
  return (
    <div className="grid w-full max-w-lg grid-cols-2 gap-8 2xl:grid-cols-3">
      <div className="flex flex-col items-center gap-4">
        <M3Shape shape="circle" className="size-24" />
        <span className="font-mono text-[10px] text-muted-foreground">
          M3Shape
        </span>
      </div>
      <div className="flex flex-col items-center gap-4">
        <M3ShapeIcon shape="sunny" className="size-24">
          <Star className="size-9" />
        </M3ShapeIcon>
        <span className="font-mono text-[10px] text-muted-foreground">
          M3ShapeIcon
        </span>
      </div>
      <div className="flex flex-col items-center gap-4">
        <M3ShapeImage
          shape="heart"
          className="size-24"
          src="/images/portraits/01.webp"
          alt="Akshay Saini"
        />
        <span className="font-mono text-[10px] text-muted-foreground">
          M3ShapeImage
        </span>
      </div>
      <div className="flex flex-col items-center gap-4">
        <M3ShapePlaceholder
          shape="hexagon"
          className="size-24"
          label="Preview"
        />
        <span className="font-mono text-[10px] text-muted-foreground">
          M3ShapePlaceholder
        </span>
      </div>
      <div className="flex flex-col items-center gap-4">
        <M3ShapeClip shape="arch" className="size-24">
          <div className="size-full bg-primary/20" />
        </M3ShapeClip>
        <span className="font-mono text-[10px] text-muted-foreground">
          M3ShapeClip
        </span>
      </div>
    </div>
  )
}
