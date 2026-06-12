export function ColorSwatch({
  name,
  variable,
  className,
}: {
  name: string
  variable: string
  className?: string
}) {
  return (
    <div className="space-y-2">
      <div
        className={`h-16 w-full rounded-lg border border-border ${className ?? ""}`}
        style={{ backgroundColor: `var(${variable})` }}
      />
      <div>
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="font-mono text-xs text-muted-foreground">{variable}</p>
      </div>
    </div>
  )
}
