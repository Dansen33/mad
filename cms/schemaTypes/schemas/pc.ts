import { defineField, defineType } from "sanity";

export default defineType({
  name: "pc",
  title: "PC-k",
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
      name: "allowMemoryUpgrades",
      title: "Memória bővíthető",
      type: "boolean",
      initialValue: false,
      description: "Ha be van kapcsolva, a frontenden megjelennek a memória bővítő opciók az árlistából.",
    }),
    defineField({
      name: "memoryUpgradeGroup",
      title: "Memória bővítés típusa",
      type: "string",
      options: {
        list: [
          { title: "DDR4", value: "ddr4" },
          { title: "DDR5", value: "ddr5" },
        ],
        layout: "radio",
      },
      description: "Ha engedélyezett a memória bővítés, melyik árlistát használja (DDR4/DDR5).",
    }),
    defineField({
      name: "allowSsdUpgrades",
      title: "SSD bővíthető",
      type: "boolean",
      initialValue: false,
      description: "Ha be van kapcsolva, a frontenden megjelennek az SSD bővítési opciók az árlistából.",
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
      description: "Válaszd ki, hogy a PC új vagy felújított.",
    }),
    defineField({
      name: "category",
      title: "Kategória",
      type: "string",
      options: {
        list: [
          { title: "Belépő kategóriás Gamer PC-k 300.000 Ft-ig", value: "gamer-pc-olcso-300-alatt" },
          { title: "KözépkategóriásGamer PC-k 300-600k", value: "gamer-pc-300-600" },
          { title: "Felsőkategóriás Gamer PC-k 600k-tól", value: "gamer-pc-600-felett" },
          { title: "Professzionális Munkaállomások", value: "professzionalis-munkaallomas" },
          { title: "Felújított Gamer PC-k", value: "felujitott-gamer-pc" },
        ],
      },
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
        { name: "processor", title: "Processzor", type: "string" },
        { name: "cooler", title: "Processzor hűtés", type: "string" },
        { name: "motherboard", title: "Alaplap", type: "string" },
        { name: "memory", title: "Memória", type: "string" },
        { name: "gpu", title: "Videókártya", type: "string" },
        { name: "ssd", title: "SSD", type: "string" },
        { name: "case", title: "Ház", type: "string" },
        { name: "psu", title: "Tápegység", type: "string" },
        { name: "wifi", title: "Wifi", type: "string" },
        { name: "bluetooth", title: "Bluetooth", type: "string" },
        { name: "os", title: "Operációs rendszer", type: "string" },
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
