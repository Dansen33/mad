import { defineField, defineType } from "sanity";

const platformOptions = [
  { title: "Playstation", value: "playstation" },
  { title: "Xbox", value: "xbox" },
  { title: "Nintendo", value: "nintendo" },
  { title: "Kézikonzolok", value: "kezikonzolok" },
];

export default defineType({
  name: "console",
  title: "Konzolok",
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
      name: "platform",
      title: "Platform",
      type: "string",
      options: { list: platformOptions },
    }),
    defineField({
      name: "model",
      title: "Modell",
      type: "string",
      description: "Pl. Playstation 5, Series S, Switch",
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
      description: "Válaszd ki, hogy a konzol új vagy felújított.",
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
      name: "featured",
      title: "Kiemelt termék?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "specs",
      title: "Specifikációk",
      type: "object",
      fields: [
        { name: "cpu", title: "Processzor / SoC", type: "string" },
        { name: "gpu", title: "Grafikus egység", type: "string" },
        { name: "memory", title: "Memória", type: "string" },
        { name: "storage", title: "Tárhely", type: "string" },
        { name: "resolution", title: "Felbontás / cél FPS", type: "string" },
        { name: "extras", title: "Extrák", type: "text" },
        { name: "includes", title: "Tartozékok a dobozban", type: "text" },
        { name: "dimensions", title: "Méretek", type: "string" },
        { name: "weight", title: "Súly", type: "string" },
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
          fields: [{ name: "alt", title: "Alt szöveg", type: "string" }],
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
