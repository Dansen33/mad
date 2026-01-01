import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Oldal beállítások",
  type: "document",
  fields: [
    defineField({
      name: "featuredProduct",
      title: "Kiemelt termék",
      type: "reference",
      to: [{ type: "product" }],
    }),
    defineField({
      name: "heroSlides",
      title: "Hero slide-ok",
      type: "array",
      of: [{ type: "reference", to: [{ type: "heroSlide" }] }],
      validation: (rule) => rule.max(5),
    }),
    defineField({
      name: "featuredProducts",
      title: "Kiemelt termékek (főoldali carousel)",
      description: "Legfeljebb 10 termék, 5-ös csoportokban görgethető a főoldalon.",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "product" }, { type: "pc" }, { type: "phone" }],
          options: { disableNew: true },
        },
      ],
      validation: (rule) => rule.max(10),
    }),
    defineField({
      name: "announcement",
      title: "Fejléc banner",
      type: "object",
      fields: [
        defineField({ name: "enabled", title: "Aktív", type: "boolean", initialValue: true }),
        defineField({
          name: "text",
          title: "Szöveg",
          type: "text",
          rows: 3,
          description: 'Pl.: "Ingyenes szállítás 30 000 Ft felett" – több sor is megadható',
        }),
        defineField({
          name: "link",
          title: "Link (opcionális)",
          type: "url",
          description: "Ha meg van adva, a banner kattintható.",
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Oldal beállítások",
        subtitle: "Kiemelt termék, hero, featured lista",
      };
    },
  },
});
