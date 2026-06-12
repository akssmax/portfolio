export function resolveCssVariableToHex(variable: string, fallback = "#000000"): string {
  if (typeof document === "undefined") return fallback

  const probe = document.createElement("span")
  probe.style.color = `var(${variable})`
  probe.style.position = "absolute"
  probe.style.visibility = "hidden"
  probe.style.pointerEvents = "none"
  document.body.appendChild(probe)

  const rgb = getComputedStyle(probe).color
  document.body.removeChild(probe)

  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!match) return fallback

  return `#${[match[1], match[2], match[3]]
    .map((value) => Number(value).toString(16).padStart(2, "0"))
    .join("")}`
}
