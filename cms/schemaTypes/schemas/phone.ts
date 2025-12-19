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
      name: "shippingTime",
      title: "Szállítás",
      type: "string",
      options: {
        list: [
          { title: "2 napon belül", value: "2_nap" },
          { title: "2-3 napon belül", value: "2_3_nap" },
          { title: "3-4 napon belül", value: "3_4_nap" },
          { title: "4-5 napon belül", value: "4_5_nap" },
          { title: "5-6 napon belül", value: "5_6_nap" },
        ],
      },
      description: "Válaszd ki a várható szállítási időt.",
    }),
    defineField({
      name: "stock",
      title: "Készlet (db)",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "warranty",
      title: "Garancia",
      type: "string",
      options: {
        list: [
          { title: "12 hó", value: "12_ho" },
          { title: "24 hó", value: "24_ho" },
          { title: "36 hó", value: "36_ho" },
          { title: "48 hó", value: "48_ho" },
        ],
      },
      description: "Válaszd ki a garancia időtartamát.",
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
