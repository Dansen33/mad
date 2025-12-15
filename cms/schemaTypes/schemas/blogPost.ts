import { defineField, defineType } from "sanity";

export default defineType({
  name: "blogPost",
  title: "Blog bejegyzések",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Cím",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Kivonat",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title (opcionális)",
      type: "string",
      description: "Ha üres, a fő cím kerül felhasználásra.",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description (opcionális)",
      type: "text",
      rows: 2,
      description: "Ha üres, a kivonat (excerpt) kerül felhasználásra.",
    }),
    defineField({
      name: "content",
      title: "Tartalom",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "image",
      title: "Kiemelt kép",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt", type: "string" }],
    }),
    defineField({
      name: "tags",
      title: "Címkék",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Publikálva",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "excerpt",
      media: "image",
    },
  },
});
