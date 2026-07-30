type DeckSlideBackgroundProps = {
  className?: string
}

export function DeckSlideBackground({ className }: DeckSlideBackgroundProps) {
  return (
    <div
      className={className}
      aria-hidden
    >
      <div className="absolute -top-20 -left-12 size-72 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute top-1/3 left-1/4 size-96 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute right-0 bottom-0 size-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
    </div>
  )
}

export function DeckMediaGlow({ className }: { className?: string }) {
  return (
    <>
      <div
        className={
          className ??
          "absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-violet-500/25 via-primary/20 to-fuchsia-500/15 blur-3xl"
        }
        aria-hidden
      />
      <div
        className="absolute -inset-3 rounded-[1.75rem] bg-gradient-to-tr from-primary/15 via-transparent to-orange-500/10 blur-2xl"
        aria-hidden
      />
    </>
  )
}
