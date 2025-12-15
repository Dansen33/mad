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
  ],
  preview: {
    prepare() {
      return {
        title: "Oldal beállítások",
        subtitle: "Kiemelt termék, hero",
      };
    },
  },
});
