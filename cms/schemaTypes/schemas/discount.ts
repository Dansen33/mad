import { defineField, defineType } from "sanity";

export default defineType({
  name: "discount",
  title: "Kedvezmények",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Név",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "active",
      title: "Aktív?",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "type",
      title: "Típus",
      type: "string",
      options: {
        list: [
          { title: "Százalékos", value: "percent" },
          { title: "Fix összeg (HUF)", value: "fixed" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amount",
      title: "Kedvezmény mértéke",
      type: "number",
      description: "Százalék esetén 0-100 közötti érték, fix esetén HUF.",
      validation: (Rule) =>
        Rule.required()
          .positive()
          .custom((value, context) => {
            const type = (context.parent as { type?: string })?.type;
            if (type === "percent" && typeof value === "number" && value > 100) {
              return "Százalékos kedvezmény nem lehet 100 fölött.";
            }
            return true;
          }),
    }),
    defineField({
      name: "startsAt",
      title: "Kezdet (opcionális)",
      type: "datetime",
    }),
    defineField({
      name: "endsAt",
      title: "Vége (opcionális)",
      type: "datetime",
    }),
    defineField({
      name: "products",
      title: "Érintett termékek",
      type: "array",
      of: [
        defineField({
          type: "reference",
          to: [{ type: "product" }, { type: "pc" }, { type: "phone" }],
          options: { disableNew: true },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
      active: "active",
      type: "type",
      amount: "amount",
    },
    prepare(selection) {
      const { title, active, type, amount } = selection as {
        title?: string;
        active?: boolean;
        type?: string;
        amount?: number;
      };
      const suffix = type === "percent" ? "%" : " Ft";
      return {
        title: title || "Kedvezmény",
        subtitle: `${active ? "Aktív" : "Inaktív"} • ${amount ?? ""}${suffix}`,
      };
    },
  },
});
