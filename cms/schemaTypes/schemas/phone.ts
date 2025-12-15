import { defineField, defineType } from "sanity";

export default defineType({
  name: "phone",
  title: "Telefonok",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Név",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priceHuf",
      title: "Ár (HUF)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "stock",
      title: "Készlet",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "brand",
      title: "Márka",
      type: "string",
    }),
    defineField({
      name: "condition",
      title: "Állapot",
      type: "string",
      options: {
        list: [
          { title: "Új", value: "UJ" },
          { title: "Felújított", value: "FELUJITOTT" },
        ],
      },
      description: "Válaszd ki, hogy a telefon új vagy felújított.",
    }),
    defineField({
      name: "shortDescription",
      title: "Rövid leírás",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "info",
      title: "Információ",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "note",
      title: "Megjegyzés",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "specs",
      title: "Specifikációk",
      type: "object",
      fields: [
        { name: "soc", title: "SOC / CPU", type: "string" },
        { name: "memory", title: "Memória (RAM)", type: "string" },
        { name: "storage", title: "Tárhely", type: "string" },
        { name: "display", title: "Kijelző", type: "string" },
        { name: "battery", title: "Akkumulátor", type: "string" },
        { name: "camera", title: "Kamera", type: "string" },
        { name: "os", title: "Operációs rendszer", type: "string" },
        { name: "connectivity", title: "Kapcsolatok (5G/WiFi/BT)", type: "string" },
      ],
    }),
    defineField({
      name: "images",
      title: "Képek",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Alt szöveg",
              type: "string",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(10),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "brand",
      media: "images.0",
    },
  },
});
