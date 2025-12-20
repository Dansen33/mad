import { defineField, defineType } from "sanity";

export default defineType({
  name: "order",
  title: "Rendelések",
  type: "document",
  fields: [
    defineField({
      name: "orderNumber",
      title: "Rendelésszám",
      type: "string",
      description: "Pl. 202500001 (év + 5 jegyű sorszám)",
      validation: (r) => r.required(),
    }),
    defineField({ name: "email", title: "E-mail", type: "string", validation: (r) => r.required() }),
    defineField({ name: "phone", title: "Telefon", type: "string" }),
    defineField({ name: "fullName", title: "Teljes név", type: "string", validation: (r) => r.required() }),
    defineField({ name: "company", title: "Cégnév", type: "string" }),
    defineField({ name: "taxNumber", title: "Adószám", type: "string" }),
    defineField({ name: "country", title: "Ország", type: "string" }),
    defineField({ name: "zip", title: "Irányítószám", type: "string" }),
    defineField({ name: "city", title: "Város", type: "string" }),
    defineField({ name: "address", title: "Cím", type: "string" }),
    defineField({ name: "note", title: "Megjegyzés", type: "text" }),
    defineField({ name: "shippingMethod", title: "Szállítási mód", type: "string" }),
    defineField({
      name: "paymentMethod",
      title: "Fizetési mód",
      type: "string",
      options: {
        list: [
          { title: "Bankkártya", value: "Bankkártya" },
          { title: "Átutalás", value: "Átutalás" },
          { title: "Utánvét", value: "Utánvét" },
        ],
      },
    }),
    defineField({
      name: "items",
      title: "Tételek",
      type: "array",
      of: [
        defineField({
          type: "object",
          name: "item",
          fields: [
            { name: "slug", title: "Slug", type: "string" },
            { name: "name", title: "Név", type: "string" },
            { name: "brand", title: "Márka", type: "string" },
            { name: "priceHuf", title: "Egységár (HUF)", type: "number" },
            { name: "quantity", title: "Mennyiség", type: "number" },
            { name: "image", title: "Kép URL", type: "url", description: "Bármilyen kép-link, nem kötelező." },
            defineField({
              name: "upgrades",
              title: "Bővítések",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "upgrade",
                  fields: [
                    { name: "label", title: "Címke", type: "string" },
                    { name: "deltaHuf", title: "Felár (HUF)", type: "number" },
                  ],
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "brand",
            },
          },
        }),
      ],
    }),
    defineField({ name: "subtotalHuf", title: "Részösszeg (HUF)", type: "number" }),
    defineField({ name: "shippingHuf", title: "Szállítás (HUF)", type: "number" }),
    defineField({ name: "totalHuf", title: "Végösszeg (HUF)", type: "number" }),
    defineField({ name: "barionPaymentId", title: "Barion fizetés ID", type: "string" }),
    defineField({ name: "barionStatus", title: "Barion státusz", type: "string" }),
    defineField({
      name: "stockReduced",
      title: "Készlet csökkentve",
      type: "boolean",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "billingSame",
      title: "Számlázás = Szállítás?",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "billing",
      title: "Számlázási adatok",
      type: "object",
      hidden: ({ parent }) => parent?.billingSame !== false,
      fields: [
        { name: "billingName", title: "Név", type: "string" },
        { name: "billingCompany", title: "Cégnév (legacy)", type: "string", hidden: true },
        { name: "billingTaxNumber", title: "Adószám", type: "string" },
        { name: "billingCountry", title: "Ország", type: "string" },
        { name: "billingZip", title: "Irányítószám", type: "string" },
        { name: "billingCity", title: "Város", type: "string" },
        { name: "billingAddress", title: "Cím", type: "string" },
      ],
    }),
    defineField({
      name: "status",
      title: "Státusz",
      type: "string",
      options: {
        list: [
          { title: "Leadva", value: "LEADVA" },
          { title: "Fizetve", value: "FIZETVE" },
          { title: "Feldolgozva", value: "FELDOLGOZVA" },
          { title: "Számlázva", value: "SZAMLAZVA" },
          { title: "Kiküldve", value: "KIKULDVE" },
        ],
      },
      initialValue: "LEADVA",
    }),
    defineField({
      name: "createdAt",
      title: "Létrehozva",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "orderNumber",
      name: "fullName",
      subtitle: "email",
      status: "status",
      total: "totalHuf",
    },
    prepare({ title, name, subtitle, status, total }) {
      return {
        title: title || "Rendelés",
        subtitle: `${name || ""} • ${subtitle || ""} • ${status || "PENDING"} • ${
          total ? `${total} Ft` : ""
        }`,
      };
    },
  },
});
