import { defineField, defineType } from "sanity"

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tag",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "workSection",
      type: "string",
      title: "Homepage section",
      options: {
        list: [
          { title: "Recent project", value: "recentProject" },
          { title: "Case study", value: "caseStudy" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "buildBadge",
      type: "string",
      title: "Build era badge",
      options: {
        list: [
          { title: "Built with AI", value: "built-with-ai" },
          { title: "Pre-LLM era", value: "pre-llm" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "coverImage",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({
      name: "coverImageUrl",
      type: "string",
      description: "Fallback cover path relative to public/, e.g. /projects/100x/hero.webp",
    }),
    defineField({ name: "year", type: "string" }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "client", type: "string" }),
    defineField({
      name: "tools",
      type: "array",
      of: [{ type: "string" }],
      description: "Tools used, e.g. Cursor",
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "seo",
      type: "object",
      fields: [
        defineField({ name: "metaTitle", type: "string" }),
        defineField({ name: "metaDescription", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "content",
      type: "array",
      of: [
        { type: "sectionHeading" },
        { type: "richTextBlock" },
        { type: "imageBlock" },
        { type: "imageGallery" },
        { type: "staticImage" },
        { type: "staticImageGallery" },
        { type: "techStack" },
        { type: "collaborators" },
        { type: "siteMap" },
        { type: "metrics" },
        { type: "quote" },
        { type: "beforeAfter" },
        { type: "embed" },
        { type: "separator" },
      ],
    }),
  ],
  orderings: [
    {
      title: "Published date, newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "tag",
      media: "coverImage",
      featured: "featured",
    },
    prepare({ title, subtitle, media, featured }) {
      return {
        title: featured ? `★ ${title}` : title,
        subtitle,
        media,
      }
    },
  },
})
