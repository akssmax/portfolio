import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { CollaboratorsBlock } from "@/lib/sanity/types"

function getInitials(name: string, initials?: string | null) {
  if (initials) return initials
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function CollaboratorsBlockComponent({
  block,
}: {
  block: CollaboratorsBlock
}) {
  if (!block.items?.length) return null

  return (
    <div className="space-y-4">
      {block.subtitle ? (
        <p className="text-sm text-muted-foreground">{block.subtitle}</p>
      ) : null}
      {block.teamUrl ? (
        <p className="text-sm">
          <a
            href={block.teamUrl}
            className="font-medium text-foreground underline-offset-4 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View team
          </a>
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {block.items.map((person) => (
          <div
            key={person._key ?? person.name}
            className="flex items-center gap-4 rounded-xl border border-border bg-muted/20 p-4"
          >
            <Avatar size="lg">
              {person.avatarSrc ? (
                <AvatarImage src={person.avatarSrc} alt={person.name} />
              ) : null}
              <AvatarFallback>{getInitials(person.name, person.initials)}</AvatarFallback>
            </Avatar>
            <div>
              {person.profileUrl ? (
                <a
                  href={person.profileUrl}
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {person.name}
                </a>
              ) : (
                <p className="font-medium text-foreground">{person.name}</p>
              )}
              <p className="text-sm text-muted-foreground">{person.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
