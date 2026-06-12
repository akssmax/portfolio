export function PlaceholderDemo({ name }: { name?: string }) {
  return (
    <p className="text-sm text-muted-foreground">
      Demo for {name ?? "this component"} is coming soon.
    </p>
  )
}
