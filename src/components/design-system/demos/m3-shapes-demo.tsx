import { Heart, Sparkles, Star } from "lucide-react"

import {
  M3Shape,
  M3ShapeIcon,
  M3ShapeImage,
  M3ShapePlaceholder,
} from "@/components/m3-shapes"
import { m3Shapes } from "@/lib/m3-shapes"

export function M3ShapesDemo() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">All shapes</h3>
          <p className="text-sm text-muted-foreground">
            36 Material Design 3 expressive shapes imported from Figma.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 lg:grid-cols-9">
          {m3Shapes.map((shape) => (
            <div key={shape.id} className="flex flex-col items-center gap-2">
              <M3Shape shape={shape.id} className="size-14" />
              <span className="text-center text-[10px] leading-tight text-muted-foreground">
                {shape.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Icon shape boxes</h3>
          <p className="text-sm text-muted-foreground">
            Use as soft icon containers with centered content.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <M3ShapeIcon shape="heart" className="size-16">
            <Heart className="size-7" />
          </M3ShapeIcon>
          <M3ShapeIcon shape="sunny" className="size-16">
            <Star className="size-7" />
          </M3ShapeIcon>
          <M3ShapeIcon shape="burst" className="size-16">
            <Sparkles className="size-7" />
          </M3ShapeIcon>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Image clipping masks</h3>
          <p className="text-sm text-muted-foreground">
            Clip photos and artwork to any M3 shape.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <M3ShapeImage
            shape="circle"
            className="size-24"
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop"
            alt="Mountain landscape"
          />
          <M3ShapeImage
            shape="diamond"
            className="size-24"
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop"
            alt="Mountain landscape"
          />
          <M3ShapeImage
            shape="flower"
            className="size-24"
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop"
            alt="Mountain landscape"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Placeholders</h3>
          <p className="text-sm text-muted-foreground">
            Empty boxes for loading states or content slots.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <M3ShapePlaceholder shape="arch" className="size-24" />
          <M3ShapePlaceholder
            shape="gem"
            className="size-24"
            label="Image"
          />
          <M3ShapePlaceholder
            shape="4-leaf-clover"
            className="size-24"
            fillClassName="bg-primary/10"
          />
        </div>
      </section>
    </div>
  )
}
