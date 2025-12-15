import { defineField, defineType } from "sanity";

export default defineType({
  name: "coupon",
  title: "Kupon",
  type: "document",
  fields: [
    defineField({
      name: "code",
      title: "Kód",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "active",
      title: "Aktív",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "type",
      title: "Kedvezmény típusa",
      type: "string",
      options: {
        list: [
          { title: "Összeg (Ft)", value: "amount" },
          { title: "Százalék", value: "percent" },
        ],
      },
      validation: (rule) => rule.required(),
      initialValue: "amount",
    }),
    defineField({
      name: "value",
      title: "Érték",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "note",
      title: "Megjegyzés",
      type: "string",
    }),
    defineField({
      name: "expiresAt",
      title: "Lejárat",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      title: "code",
      subtitle: "note",
    },
  },
});
