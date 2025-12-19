import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Vélemények",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Név",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Pozíció / Cég (opcionális)",
      type: "string",
    }),
    defineField({
      name: "quote",
      title: "Szöveg",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Értékelés (1-5)",
      type: "number",
      validation: (rule) => rule.min(1).max(5),
    }),
    defineField({
      name: "avatar",
      title: "Kép (opcionális)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Sorrend",
      type: "number",
      description: "Kisebb szám előrébb kerül.",
    }),
  ],
  orderings: [
    { title: "Sorrend", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
    { title: "Létrehozás", name: "createdDesc", by: [{ field: "_createdAt", direction: "desc" }] },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "title",
      media: "avatar",
    },
  },
});
