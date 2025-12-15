import { defineField, defineType } from "sanity";

export default defineType({
  name: "shippingMethod",
  title: "Szállítási mód",
  type: "document",
  fields: [
    defineField({
      name: "id",
      title: "Azonosító",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "label",
      title: "Név",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "note",
      title: "Megjegyzés",
      type: "string",
    }),
    defineField({
      name: "priceHuf",
      title: "Ár (Ft)",
      type: "number",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "order",
      title: "Sorrend",
      type: "number",
      description: "Kisebb szám előre kerül a listában",
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "note",
    },
  },
});
