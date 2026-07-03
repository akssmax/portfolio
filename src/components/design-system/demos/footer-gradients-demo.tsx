"use client"

import { useState } from "react"
import { Check, Copy, RotateCcw } from "lucide-react"

import type {FooterGradientVariant, Stop} from "@/components/landing/footer-gradients";
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import {
  AURORA_STOPS_DARK,
  AURORA_STOPS_LIGHT,
  DIA_STOPS_DARK,
  DIA_STOPS_LIGHT,
  
  FooterGradients
  
} from "@/components/landing/footer-gradients"

const SUNSET_STOPS: Array<Stop> = [
  { offset: 0, color: "#1F0022" },
  { offset: 0.25, color: "#5F0A87" },
  { offset: 0.5, color: "#A4508B" },
  { offset: 0.75, color: "#F78FAD" },
  { offset: 0.9, color: "#FFC0E4" },
  { offset: 1, color: "#FFC0E400" },
]

export function FooterGradientsDemo() {
  const [variant, setVariant] = useState<FooterGradientVariant>("fold3d")
  const [reveal, setReveal] = useState<"mount" | "scroll" | "none">("mount")
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark")
  
  // Sliders
  const [bars, setBars] = useState(9)
  const [blur, setBlur] = useState(15)
  const [peak, setPeak] = useState(0.98)
  const [valley, setValley] = useState(0.55)
  const [pointiness, setPointiness] = useState(0.5)
  const [foldAngle, setFoldAngle] = useState(74)
  const [depth, setDepth] = useState(620)
  
  // Custom scheme
  const [colorScheme, setColorScheme] = useState<"default" | "candy" | "aurora" | "sunset">("aurora")
  const [replayKey, setReplayKey] = useState(0)
  const [copied, setCopied] = useState(false)

  // Resolve stops based on colorScheme & theme
  const getActiveStops = (): Array<Stop> | undefined => {
    if (colorScheme === "candy") return DIA_STOPS_LIGHT
    if (colorScheme === "aurora") {
      return previewTheme === "light" ? AURORA_STOPS_LIGHT : AURORA_STOPS_DARK
    }
    if (colorScheme === "sunset") return SUNSET_STOPS
    // default
    return previewTheme === "light" ? DIA_STOPS_LIGHT : DIA_STOPS_DARK
  }

  const triggerReplay = () => {
    setReplayKey((k) => k + 1)
  }

  const copyCode = () => {
    let code = ""
    if (variant === "fold3d") {
      code = `<FooterGradients\n  activeVariant="fold3d"\n  reveal="${reveal}"\n  bars={${bars}}\n  blur={${blur}}\n  peak={${peak}}\n  valley={${valley}}\n  foldAngle={${foldAngle}}\n  depth={${depth}}\n/>`
    } else if (variant === "dia") {
      code = `<FooterGradients\n  activeVariant="dia"\n  reveal="${reveal}"\n  bars={${bars}}\n  blur={${blur}}\n  peak={${peak}}\n  valley={${valley}}\n/>`
    } else if (variant === "peaked") {
      code = `<FooterGradients\n  activeVariant="peaked"\n  reveal="${reveal}"\n  peak={${peak}}\n  pointiness={${pointiness}}\n  blur={${blur}}\n/>`
    } else {
      code = `<FooterGradients\n  activeVariant="dodge"\n  reveal="${reveal}"\n/>`
    }
    
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Interactive Playground</h3>
          <p className="text-sm text-muted-foreground">
            Configure the columns, stdDeviation blur, perspective camera projection, and curves.
            Glows are styled differently for light/dark backdrops.
          </p>
        </div>

        {/* Top bar configuration */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex flex-wrap gap-2">
            {(["fold3d", "dia", "peaked", "dodge"] as const).map((v) => (
              <Button
                key={v}
                variant={variant === v ? "default" : "outline"}
                size="sm"
                onClick={() => setVariant(v)}
                className="capitalize"
              >
                {v === "fold3d" ? "3D Fold" : v === "dia" ? "Dia Bars" : v}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Preview Theme:</span>
            <Button
              variant={previewTheme === "dark" ? "default" : "outline"}
              size="xs"
              onClick={() => setPreviewTheme("dark")}
            >
              Dark
            </Button>
            <Button
              variant={previewTheme === "light" ? "default" : "outline"}
              size="xs"
              onClick={() => setPreviewTheme("light")}
            >
              Light
            </Button>
          </div>
        </div>

        {/* Live Canvas & Controls Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col gap-4">
            {/* Live Canvas */}
            <div
              className={`relative flex aspect-video items-end justify-center overflow-hidden rounded-xl border border-border transition-colors duration-300 ${
                previewTheme === "dark" ? "bg-black" : "bg-white"
              }`}
            >
              {/* Reset/Trigger trigger overlay button */}
              <div className="absolute left-3 top-3 z-30 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={triggerReplay}
                  title="Replay reveal animation"
                >
                  <RotateCcw className="size-4" />
                </Button>
              </div>

              {/* Status info */}
              <div className="absolute right-3 top-3 z-30 pointer-events-none rounded-md bg-background/80 px-2 py-1 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground border border-border">
                {reveal === "scroll" ? "Scroll Triggered" : reveal === "mount" ? "Mount Animation" : "Static State"}
              </div>

              {/* Core Component under testing */}
              <div className="absolute inset-x-0 bottom-0 h-[80%] pointer-events-none overflow-hidden">
                <FooterGradients
                  activeVariant={variant}
                  reveal={reveal}
                  bars={bars}
                  blur={blur}
                  peak={peak}
                  valley={valley}
                  pointiness={pointiness}
                  foldAngle={foldAngle}
                  depth={depth}
                  stops={getActiveStops()}
                  replayKey={replayKey}
                />
              </div>
            </div>

            {/* Code Box */}
            <div className="relative rounded-lg bg-muted p-4 font-mono text-xs">
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-2 h-7 w-7"
                onClick={copyCode}
              >
                {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
              </Button>
              <pre className="overflow-x-auto pr-8">
                <code>
                  {variant === "fold3d" &&
                    `<FooterGradients
  activeVariant="fold3d"
  reveal="${reveal}"
  bars={${bars}}
  blur={${blur}}
  peak={${peak}}
  valley={${valley}}
  foldAngle={${foldAngle}}
  depth={${depth}}
/>`}
                  {variant === "dia" &&
                    `<FooterGradients
  activeVariant="dia"
  reveal="${reveal}"
  bars={${bars}}
  blur={${blur}}
  peak={${peak}}
  valley={${valley}}
/>`}
                  {variant === "peaked" &&
                    `<FooterGradients
  activeVariant="peaked"
  reveal="${reveal}"
  peak={${peak}}
  pointiness={${pointiness}}
  blur={${blur}}
/>`}
                  {variant === "dodge" &&
                    `<FooterGradients
  activeVariant="dodge"
  reveal="${reveal}"
/>`}
                </code>
              </pre>
            </div>
          </div>

          {/* Controls Box */}
          <Card className="h-fit">
            <CardContent className="space-y-5 pt-6">
              {/* Reveal Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reveal Behavior</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["mount", "scroll", "none"] as const).map((r) => (
                    <Button
                      key={r}
                      variant={reveal === r ? "default" : "outline"}
                      size="xs"
                      onClick={() => setReveal(r)}
                      className="capitalize"
                    >
                      {r}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Palette Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Color Scheme</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(["default", "candy", "aurora", "sunset"] as const).map((s) => (
                    <Button
                      key={s}
                      variant={colorScheme === s ? "default" : "outline"}
                      size="xs"
                      onClick={() => setColorScheme(s)}
                      className="capitalize text-left justify-start"
                    >
                      <span className="size-2 rounded-full mr-2" style={{
                        background: s === "candy" ? "#FF7AB6" : s === "aurora" ? "#1FD18E" : s === "sunset" ? "#5F0A87" : "#0358F7"
                      }} />
                      {s === "default" ? "Classic Dia" : s === "aurora" ? "Aurora (3D)" : s}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-4">
                {/* Columns / Bars - Dia & 3D Fold */}
                {(variant === "dia" || variant === "fold3d") && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Bars</span>
                      <span className="text-xs font-mono text-muted-foreground">{bars}</span>
                    </div>
                    <Slider
                      value={[bars]}
                      min={3}
                      max={21}
                      step={1}
                      onValueChange={(val) => setBars(val[0] ?? 9)}
                    />
                  </div>
                )}

                {/* Blur */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Blur</span>
                    <span className="text-xs font-mono text-muted-foreground">{blur}px</span>
                  </div>
                  <Slider
                    value={[blur]}
                    min={2}
                    max={45}
                    step={1}
                    onValueChange={(val) => setBlur(val[0] ?? 15)}
                  />
                </div>

                {/* Peak - Dia, peaked, 3d fold */}
                {variant !== "dodge" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Peak Height</span>
                      <span className="text-xs font-mono text-muted-foreground">{Math.round(peak * 100)}%</span>
                    </div>
                    <Slider
                      value={[peak * 100]}
                      min={40}
                      max={100}
                      step={1}
                      onValueChange={(val) => setPeak((val[0] ?? 98) / 100)}
                    />
                  </div>
                )}

                {/* Valley - Dia & 3d fold */}
                {(variant === "dia" || variant === "fold3d") && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Valley Height</span>
                      <span className="text-xs font-mono text-muted-foreground">{Math.round(valley * 100)}%</span>
                    </div>
                    <Slider
                      value={[valley * 100]}
                      min={10}
                      max={100}
                      step={1}
                      onValueChange={(val) => setValley((val[0] ?? 55) / 100)}
                    />
                  </div>
                )}

                {/* Pointiness - Peaked */}
                {variant === "peaked" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Pointiness</span>
                      <span className="text-xs font-mono text-muted-foreground">{Math.round(pointiness * 100)}%</span>
                    </div>
                    <Slider
                      value={[pointiness * 100]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(val) => setPointiness((val[0] ?? 50) / 100)}
                    />
                  </div>
                )}

                {/* Fold Angle - 3D Fold */}
                {variant === "fold3d" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Fold Angle</span>
                      <span className="text-xs font-mono text-muted-foreground">{foldAngle}°</span>
                    </div>
                    <Slider
                      value={[foldAngle]}
                      min={20}
                      max={89}
                      step={1}
                      onValueChange={(val) => setFoldAngle(val[0] ?? 74)}
                    />
                  </div>
                )}

                {/* Depth perspective - 3D Fold */}
                {variant === "fold3d" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Depth Perspective</span>
                      <span className="text-xs font-mono text-muted-foreground">{depth}px</span>
                    </div>
                    <Slider
                      value={[depth]}
                      min={300}
                      max={1400}
                      step={10}
                      onValueChange={(val) => setDepth(val[0] ?? 620)}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
