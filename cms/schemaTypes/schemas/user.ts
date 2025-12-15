import { defineField, defineType } from "sanity";

export default defineType({
  name: "user",
  title: "Felhasználók",
  type: "document",
  fields: [
    defineField({ name: "email", title: "Email", type: "string", validation: (r) => r.required() }),
    defineField({ name: "name", title: "Név", type: "string" }),
    defineField({ name: "passwordHash", title: "Jelszó hash", type: "string" }),
    defineField({ name: "provider", title: "Provider", type: "string" }),
    defineField({ name: "image", title: "Kép", type: "url" }),
    defineField({ name: "resetTokenHash", title: "Reset token hash", type: "string" }),
    defineField({ name: "resetTokenExp", title: "Reset token lejár", type: "datetime" }),
    defineField({
      name: "addresses",
      title: "Címek",
      type: "array",
      of: [
        defineField({
          type: "object",
          name: "address",
          fields: [
            { name: "label", title: "Megnevezés", type: "string" },
            { name: "fullName", title: "Kapcsolattartó", type: "string" },
            { name: "phone", title: "Telefon", type: "string" },
            { name: "country", title: "Ország", type: "string" },
            { name: "zip", title: "Irányítószám", type: "string" },
            { name: "city", title: "Város", type: "string" },
            { name: "addressLine", title: "Cím", type: "string" },
            {
              name: "isDefault",
              title: "Alapértelmezett?",
              type: "boolean",
              initialValue: false,
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "createdAt",
      title: "Létrehozva",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: { title: "email", subtitle: "provider" },
  },
});
