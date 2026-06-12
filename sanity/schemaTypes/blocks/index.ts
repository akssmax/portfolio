import { defineArrayMember, defineField, defineType } from "sanity"

const portableTextStyles = [
  { title: "Normal", value: "normal" },
  { title: "H3", value: "h3" },
  { title: "H4", value: "h4" },
]

export const sectionHeading = defineType({
  name: "sectionHeading",
  title: "Section Heading",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "subtitle", type: "text", rows: 2 }),
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle" },
    prepare({ title, subtitle }) {
      return { title: `Heading: ${title}`, subtitle }
    },
  },
})

export const richTextBlock = defineType({
  name: "richTextBlock",
  title: "Rich Text",
  type: "object",
  fields: [
    defineField({
      name: "body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: portableTextStyles,
          lists: [{ title: "Bullet", value: "bullet" }, { title: "Number", value: "number" }],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [{ name: "href", type: "url", validation: (rule) => rule.required() }],
              },
            ],
          },
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Rich Text" }
    },
  },
})

export const imageBlock = defineType({
  name: "imageBlock",
  title: "Image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "caption", type: "string" }),
    defineField({ name: "fullBleed", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { media: "image", caption: "caption" },
    prepare({ media, caption }) {
      return { title: "Image", subtitle: caption, media }
    },
  },
})

export const imageGallery = defineType({
  name: "imageGallery",
  title: "Image Gallery",
  type: "object",
  fields: [
    defineField({
      name: "images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", type: "string", title: "Alt text" }],
        }),
      ],
      validation: (rule) => rule.min(2).max(4),
    }),
    defineField({ name: "caption", type: "string" }),
  ],
  preview: {
    prepare() {
      return { title: "Image Gallery" }
    },
  },
})

export const metrics = defineType({
  name: "metrics",
  title: "Metrics",
  type: "object",
  fields: [
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        }),
      ],
      validation: (rule) => rule.min(1).max(6),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Metrics" }
    },
  },
})

export const quote = defineType({
  name: "quote",
  title: "Quote",
  type: "object",
  fields: [
    defineField({ name: "text", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "attribution", type: "string" }),
  ],
  preview: {
    select: { title: "text", subtitle: "attribution" },
  },
})

export const beforeAfter = defineType({
  name: "beforeAfter",
  title: "Before / After",
  type: "object",
  fields: [
    defineField({
      name: "before",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "after",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string" }],
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "caption", type: "string" }),
  ],
  preview: {
    prepare() {
      return { title: "Before / After" }
    },
  },
})

export const embed = defineType({
  name: "embed",
  title: "Embed",
  type: "object",
  fields: [
    defineField({
      name: "url",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      type: "string",
      description: "Link label shown to visitors",
    }),
    defineField({
      name: "embedType",
      type: "string",
      options: {
        list: [
          { title: "External link", value: "link" },
          { title: "Figma prototype", value: "figma" },
          { title: "Video", value: "video" },
        ],
      },
      initialValue: "link",
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "url" },
  },
})

export const separator = defineType({
  name: "separator",
  title: "Separator",
  type: "object",
  fields: [defineField({ name: "label", type: "string" })],
  preview: {
    prepare() {
      return { title: "Separator" }
    },
  },
})

export const staticImage = defineType({
  name: "staticImage",
  title: "Static Image",
  type: "object",
  fields: [
    defineField({
      name: "src",
      type: "string",
      description: "Path relative to public/, e.g. /projects/100x/hero.webp",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "alt", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "caption", type: "string" }),
    defineField({ name: "fullBleed", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "alt", subtitle: "src" },
  },
})

export const staticImageGallery = defineType({
  name: "staticImageGallery",
  title: "Static Image Gallery",
  type: "object",
  fields: [
    defineField({
      name: "images",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "src", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "alt", type: "string", validation: (rule) => rule.required() }),
          ],
          preview: {
            select: { title: "alt", subtitle: "src" },
          },
        }),
      ],
      validation: (rule) => rule.min(2).max(4),
    }),
    defineField({ name: "caption", type: "string" }),
  ],
  preview: {
    prepare() {
      return { title: "Static Image Gallery" }
    },
  },
})

export const techStack = defineType({
  name: "techStack",
  title: "Tech Stack",
  type: "object",
  fields: [
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "logoSrc", type: "string", validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "name", subtitle: "logoSrc" } },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Tech Stack" }
    },
  },
})

export const collaborators = defineType({
  name: "collaborators",
  title: "Collaborators",
  type: "object",
  fields: [
    defineField({ name: "subtitle", type: "string" }),
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "role", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "avatarSrc", type: "string" }),
            defineField({ name: "initials", type: "string" }),
          ],
          preview: { select: { title: "name", subtitle: "role" } },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Collaborators" }
    },
  },
})

export const siteMap = defineType({
  name: "siteMap",
  title: "Site Map",
  type: "object",
  fields: [
    defineField({
      name: "baseUrl",
      title: "Base URL",
      type: "url",
      description:
        "Live site origin for route links. Leave empty for label-only routes. Defaults to https://100x.bot when omitted.",
    }),
    defineField({
      name: "groups",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "description", type: "text", rows: 2 }),
            defineField({
              name: "routes",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({ name: "path", type: "string", validation: (rule) => rule.required() }),
                    defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
                  ],
                }),
              ],
            }),
            defineField({ name: "screenshotSrc", type: "string" }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Map" }
    },
  },
})

export const contentBlocks = [
  sectionHeading,
  richTextBlock,
  imageBlock,
  imageGallery,
  staticImage,
  staticImageGallery,
  techStack,
  collaborators,
  siteMap,
  metrics,
  quote,
  beforeAfter,
  embed,
  separator,
]
