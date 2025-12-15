import { defineField, defineType } from "sanity";

export default defineType({
  name: "upgradePricing",
  title: "Bővítési árlista",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Név",
      type: "string",
      initialValue: "Alap bővítési árlista",
    }),
    defineField({
      name: "ddr4Options",
      title: "DDR4 bővítések",
      type: "array",
      of: [
        defineField({
          type: "object",
          name: "ddr4Item",
          fields: [
            { name: "label", title: "Címke", type: "string", validation: (rule) => rule.required() },
            {
              name: "deltaHuf",
              title: "Felár (HUF)",
              type: "number",
              validation: (rule) => rule.required().integer(),
            },
          ],
        }),
      ],
      description: "Memóriabővítések felárai (DDR4).",
    }),
    defineField({
      name: "ddr5Options",
      title: "DDR5 bővítések",
      type: "array",
      of: [
        defineField({
          type: "object",
          name: "ddr5Item",
          fields: [
            { name: "label", title: "Címke", type: "string", validation: (rule) => rule.required() },
            {
              name: "deltaHuf",
              title: "Felár (HUF)",
              type: "number",
              validation: (rule) => rule.required().integer(),
            },
          ],
        }),
      ],
      description: "Memóriabővítések felárai (DDR5).",
    }),
    defineField({
      name: "ssdOptions",
      title: "SSD bővítések",
      type: "array",
      of: [
        defineField({
          type: "object",
          name: "ssdItem",
          fields: [
            { name: "label", title: "Címke", type: "string", validation: (rule) => rule.required() },
            {
              name: "deltaHuf",
              title: "Felár (HUF)",
              type: "number",
              validation: (rule) => rule.required().integer(),
            },
          ],
        }),
      ],
      description: "SSD bővítések felárai.",
    }),
    defineField({
      name: "laptopDdr4Options",
      title: "Laptop DDR4 bővítések",
      type: "array",
      of: [
        defineField({
          type: "object",
          name: "laptopDdr4Item",
          fields: [
            { name: "label", title: "Címke", type: "string", validation: (rule) => rule.required() },
            {
              name: "deltaHuf",
              title: "Felár (HUF)",
              type: "number",
              validation: (rule) => rule.required().integer(),
            },
          ],
        }),
      ],
      description: "Laptop DDR4 memóriabővítések felárai.",
    }),
    defineField({
      name: "laptopDdr5Options",
      title: "Laptop DDR5 bővítések",
      type: "array",
      of: [
        defineField({
          type: "object",
          name: "laptopDdr5Item",
          fields: [
            { name: "label", title: "Címke", type: "string", validation: (rule) => rule.required() },
            {
              name: "deltaHuf",
              title: "Felár (HUF)",
              type: "number",
              validation: (rule) => rule.required().integer(),
            },
          ],
        }),
      ],
      description: "Laptop DDR5 memóriabővítések felárai.",
    }),
    defineField({
      name: "laptopSsdOptions",
      title: "Laptop SSD bővítések",
      type: "array",
      of: [
        defineField({
          type: "object",
          name: "laptopSsdItem",
          fields: [
            { name: "label", title: "Címke", type: "string", validation: (rule) => rule.required() },
            {
              name: "deltaHuf",
              title: "Felár (HUF)",
              type: "number",
              validation: (rule) => rule.required().integer(),
            },
          ],
        }),
      ],
      description: "Laptop SSD bővítések felárai.",
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
