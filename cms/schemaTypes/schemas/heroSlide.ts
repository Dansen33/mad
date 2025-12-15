import { defineField, defineType } from "sanity";

export default defineType({
  name: "heroSlide",
  title: "Hero slide",
  type: "document",
  fields: [
    defineField({ name: "badge", title: "Badge", type: "string" }),
    defineField({
      name: "title",
      title: "Cím",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "copy", title: "Szöveg", type: "text", rows: 3 }),
    defineField({ name: "ctaLabel", title: "CTA felirat", type: "string" }),
    defineField({
      name: "ctaUrl",
      title: "CTA URL",
      type: "url",
      // Engedünk belső (relatív) és külső linkeket is
      validation: (rule) =>
        rule.uri({
          allowRelative: true,
          scheme: ["https", "http", "mailto", "tel"],
        }),
    }),
    defineField({
      name: "image",
      title: "Háttérkép",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt", type: "string" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Sorrend",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Sorrend",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "badge",
      media: "image",
    },
  },
});
