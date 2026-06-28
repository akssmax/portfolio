"use client"

import type { FooterGradientType } from "@/components/appearance-provider"
import { cn } from "@/lib/utils"

type GradientOption = {
  id: FooterGradientType
  label: string
  preview: React.ReactNode
}

const GRADIENT_OPTIONS: Array<GradientOption> = [
  {
    id: "none",
    label: "None",
    preview: (
      <div className="relative flex h-8 w-full items-center justify-center border border-dashed border-foreground/30 bg-muted/40 rounded">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground opacity-60">Off</span>
      </div>
    ),
  },
  {
    id: "fold3d",
    label: "3D Fold",
    preview: (
      <div className="relative overflow-hidden h-8 w-full bg-muted/40 rounded border border-foreground/10" style={{ perspective: "40px" }}>
        {/* Tilted colorful trapezoid/bars */}
        <div 
          className="absolute inset-x-0 bottom-0 h-[200%] origin-top bg-gradient-to-t from-emerald-500 via-cyan-400 to-transparent opacity-70"
          style={{ transform: "rotateX(50deg)" }}
        />
      </div>
    ),
  },
  {
    id: "dia",
    label: "Dia Bars",
    preview: (
      <div className="relative overflow-hidden flex h-8 w-full items-end justify-center gap-[1px] px-1 bg-muted/40 rounded border border-foreground/10">
        <div className="h-[20%] w-full bg-indigo-400 opacity-60 rounded-t-sm" />
        <div className="h-[40%] w-full bg-blue-400 opacity-70 rounded-t-sm" />
        <div className="h-[75%] w-full bg-yellow-300 opacity-90 rounded-t-sm" />
        <div className="h-[90%] w-full bg-red-400 opacity-90 rounded-t-sm" />
        <div className="h-[75%] w-full bg-pink-400 opacity-90 rounded-t-sm" />
        <div className="h-[40%] w-full bg-purple-400 opacity-70 rounded-t-sm" />
        <div className="h-[20%] w-full bg-indigo-400 opacity-60 rounded-t-sm" />
      </div>
    ),
  },
  {
    id: "peaked",
    label: "Peaked",
    preview: (
      <div className="relative overflow-hidden flex h-8 w-full items-end justify-center bg-muted/40 rounded border border-foreground/10">
        <div className="absolute -bottom-1 h-[80%] w-[120%] rounded-[100%] bg-gradient-to-t from-red-500/80 via-yellow-400/80 to-transparent blur-[1px]" />
        <div className="absolute -bottom-2 h-[50%] w-[80%] rounded-[100%] bg-gradient-to-t from-blue-500/80 via-white/80 to-transparent blur-[1px]" />
      </div>
    ),
  },
  {
    id: "dodge",
    label: "Dodge",
    preview: (
      <div className="relative overflow-hidden flex h-8 w-full items-end justify-center bg-black rounded border border-foreground/10">
        <div className="absolute bottom-0 h-full w-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500 mix-blend-screen opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>
    ),
  },
]

type FooterGradientPickerProps = {
  activeGradient: FooterGradientType
  onSelect: (type: FooterGradientType) => void
}

export function FooterGradientPicker({ activeGradient, onSelect }: FooterGradientPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {GRADIENT_OPTIONS.map((opt) => {
        const isActive = opt.id === activeGradient

        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-lg border p-1.5 transition-colors cursor-pointer",
              isActive
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border hover:bg-muted/50",
            )}
          >
            {opt.preview}
            <span className="text-[10px] font-medium leading-none whitespace-nowrap text-muted-foreground group-hover:text-foreground">
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
