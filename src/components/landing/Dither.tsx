import { useEffect, useRef } from "react"
import { Mesh, Program, Renderer, Triangle } from "ogl"

/** Single-pass OGL adaptation of the React Bits Dither waves and Bayer palette. */
export type DitherProps = {
  waveSpeed?: number
  waveFrequency?: number
  waveAmplitude?: number
  waveColor?: [number, number, number]
  backgroundColor?: [number, number, number]
  colorNum?: number
  pixelSize?: number
  disableAnimation?: boolean
  enableMouseInteraction?: boolean
  mouseRadius?: number
  fullMotion?: boolean
}

const vertex = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`

const fragment = `
precision highp float;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;
uniform float uWaveSpeed;
uniform float uWaveFrequency;
uniform float uWaveAmplitude;
uniform vec3 uWaveColor;
uniform vec3 uBackgroundColor;
uniform float uColorNum;
uniform float uPixelSize;
uniform float uMouseEnabled;
uniform float uMouseRadius;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x);
  float b = mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x);
  return mix(a, b, f.y) * 2.0 - 1.0;
}
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 1.0;
  for (int i = 0; i < 3; i++) {
    value += amplitude * abs(noise(p));
    p *= uWaveFrequency;
    amplitude *= uWaveAmplitude;
  }
  return value;
}
float bayer8(vec2 pixel) {
  vec2 p = mod(pixel, 8.0);
  vec2 bit0 = mod(p, 2.0);
  vec2 bit1 = mod(floor(p / 2.0), 2.0);
  vec2 bit2 = mod(floor(p / 4.0), 2.0);
  float a = 3.0 * bit0.x + 2.0 * bit0.y - 4.0 * bit0.x * bit0.y;
  float b = 3.0 * bit1.x + 2.0 * bit1.y - 4.0 * bit1.x * bit1.y;
  float c = 3.0 * bit2.x + 2.0 * bit2.y - 4.0 * bit2.x * bit2.y;
  return (16.0 * a + 4.0 * b + c) / 64.0;
}
void main() {
  vec2 pixel = floor(gl_FragCoord.xy / uPixelSize);
  vec2 uv = (pixel * uPixelSize + uPixelSize * 0.5) / uResolution - 0.5;
  uv.x *= uResolution.x / uResolution.y;
  float inner = fbm(uv - uTime * uWaveSpeed);
  float field = fbm(uv + vec2(inner));
  if (uMouseEnabled > 0.5) {
    vec2 mouse = (uMouse / uResolution - 0.5);
    mouse.x *= uResolution.x / uResolution.y;
    field -= 0.5 * (1.0 - smoothstep(0.0, uMouseRadius, length(uv - mouse)));
  }
  vec3 color = mix(uBackgroundColor, uWaveColor, clamp(field, 0.0, 1.0));
  float levels = max(2.0, uColorNum) - 1.0;
  color += (bayer8(pixel) - 0.25) / levels;
  float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = clamp(color - mix(0.2, 0.0, smoothstep(0.45, 0.8, luminance)), 0.0, 1.0);
  color = floor(color * levels + 0.5) / levels;
  gl_FragColor = vec4(color, 1.0);
}
`

export default function Dither({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor = [0.32, 0.3, 0.36],
  backgroundColor = [1, 1, 1],
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 0.3,
  fullMotion = true,
}: DitherProps) {
  const holder = useRef<HTMLDivElement>(null)
  const programRef = useRef<Program | null>(null)
  const renderOnceRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const element = holder.current
    if (!element) return
    let renderer: Renderer
    try {
      renderer = new Renderer({
        alpha: false,
        antialias: false,
        dpr: 1,
        powerPreference: "low-power",
      })
    } catch {
      return
    }
    const gl = renderer.gl
    element.appendChild(gl.canvas)
    gl.canvas.style.width = "100%"
    gl.canvas.style.height = "100%"
    gl.canvas.style.display = "block"
    gl.canvas.style.imageRendering = "pixelated"
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uResolution: { value: [1, 1] },
        uMouse: { value: [-10000, -10000] },
        uTime: { value: 0 },
        uWaveSpeed: { value: waveSpeed },
        uWaveFrequency: { value: waveFrequency },
        uWaveAmplitude: { value: waveAmplitude },
        uWaveColor: { value: waveColor },
        uBackgroundColor: { value: backgroundColor },
        uColorNum: { value: colorNum },
        uPixelSize: { value: pixelSize },
        uMouseEnabled: { value: enableMouseInteraction ? 1 : 0 },
        uMouseRadius: { value: mouseRadius },
      },
    })
    programRef.current = program
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })
    const renderOnce = () => renderer.render({ scene: mesh })
    renderOnceRef.current = renderOnce
    const resize = () => {
      const width = element.clientWidth
      const height = element.clientHeight
      // Dither is intentionally coarse; cap fill rate before the CSS upscale.
      const scale = Math.min(
        window.devicePixelRatio || 1,
        fullMotion ? 0.85 : 0.7,
        1200 / Math.max(width, 1)
      )
      renderer.setSize(
        Math.max(1, Math.round(width * scale)),
        Math.max(1, Math.round(height * scale))
      )
      // OGL writes the backing dimensions to CSS; stretch the lower-resolution buffer.
      gl.canvas.style.width = "100%"
      gl.canvas.style.height = "100%"
      program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height]
      renderOnce()
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(element)
    resize()

    const onPointerMove = (event: PointerEvent) => {
      if (!enableMouseInteraction) return
      const rect = element.getBoundingClientRect()
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      program.uniforms.uMouse.value = inside
        ? [
            ((event.clientX - rect.left) * gl.canvas.width) / rect.width,
            ((rect.bottom - event.clientY) * gl.canvas.height) / rect.height,
          ]
        : [-10000, -10000]
      if (disableAnimation) renderOnce()
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    let visible = document.visibilityState === "visible"
    let inView = true
    let frame = 0
    let lastFrame = 0
    const start = performance.now()
    const draw = (now: number) => {
      if (!visible || !inView || disableAnimation) return
      frame = requestAnimationFrame(draw)
      if (now - lastFrame < (fullMotion ? 40 : 55)) return
      lastFrame = now
      program.uniforms.uTime.value = (now - start) / 1000
      renderOnce()
    }
    const syncVisibility = () => {
      visible = document.visibilityState === "visible"
      cancelAnimationFrame(frame)
      if (visible && inView && !disableAnimation)
        frame = requestAnimationFrame(draw)
    }
    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      syncVisibility()
    })
    intersection.observe(element)
    document.addEventListener("visibilitychange", syncVisibility)
    if (!disableAnimation) frame = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersection.disconnect()
      document.removeEventListener("visibilitychange", syncVisibility)
      window.removeEventListener("pointermove", onPointerMove)
      programRef.current = null
      renderOnceRef.current = null
      element.removeChild(gl.canvas)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    }
  }, [disableAnimation, enableMouseInteraction, fullMotion])

  useEffect(() => {
    const uniforms = programRef.current?.uniforms
    if (!uniforms) return
    uniforms.uWaveSpeed.value = waveSpeed
    uniforms.uWaveFrequency.value = waveFrequency
    uniforms.uWaveAmplitude.value = waveAmplitude
    uniforms.uWaveColor.value = waveColor
    uniforms.uBackgroundColor.value = backgroundColor
    uniforms.uColorNum.value = colorNum
    uniforms.uPixelSize.value = pixelSize
    uniforms.uMouseEnabled.value = enableMouseInteraction ? 1 : 0
    uniforms.uMouseRadius.value = mouseRadius
    if (disableAnimation) renderOnceRef.current?.()
  }, [
    waveSpeed,
    waveFrequency,
    waveAmplitude,
    waveColor,
    backgroundColor,
    colorNum,
    pixelSize,
    enableMouseInteraction,
    mouseRadius,
    disableAnimation,
  ])

  return <div ref={holder} className="absolute inset-0" aria-hidden="true" />
}
