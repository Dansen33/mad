import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CmsItem = {
  _id?: string;
  _type?: string;
  slug?: string;
  name?: string;
  priceHuf?: number;
  finalPriceHuf?: number;
  compareAtHuf?: number;
  invalidDiscount?: boolean;
  discounts?: { type?: string; amount?: number }[];
  brand?: string;
  shortDescription?: string;
  specs?: Record<string, unknown>;
  images?: { url?: string; alt?: string | null }[];
  stock?: number;
};

const escapeXml = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const formatPrice = (item: CmsItem) => {
  const base = typeof item.priceHuf === "number" ? item.priceHuf : 0;
  const discounts = Array.isArray(item.discounts) ? item.discounts : [];
  const bestDiscount =
    discounts
      .map((d) => {
        if (!d || typeof d.amount !== "number") return 0;
        if (d.type === "percent") return Math.round(base * d.amount * 0.01);
        if (d.type === "fixed") return d.amount;
        return 0;
      })
      .filter((v) => v > 0)
      .sort((a, b) => b - a)[0] ?? 0;
  const computed = base - bestDiscount;
  if (item.invalidDiscount || computed < 0) return base;
  if (typeof item.finalPriceHuf === "number" && !item.invalidDiscount) return Math.max(0, item.finalPriceHuf);
  return Math.max(0, computed);
};

const buildSpecsXml = (specs?: Record<string, unknown>) => {
  if (!specs || typeof specs !== "object") return "";
  const entries = Object.entries(specs).filter(
    ([, v]) => v !== null && v !== undefined && String(v).trim().length > 0,
  );
  if (!entries.length) return "";
  const inner = entries
    .map(([k, v]) => `<spec name="${escapeXml(k)}">${escapeXml(String(v))}</spec>`)
    .join("");
  return `<specs>${inner}</specs>`;
};

export async function GET() {
  const query = `
    *[_type in ["product","pc","phone","console"]]{
      _id,
      _type,
      "slug": slug.current,
      name,
      priceHuf,
      finalPriceHuf,
      compareAtHuf,
      invalidDiscount,
      // Kedvezmény projekció
      "discounts": *[_type=="discount" && active == true && (!defined(startsAt) || startsAt <= now()) && (!defined(endsAt) || endsAt >= now()) && references(^._id)]|order(amount desc){
        type,
        amount
      },
      brand,
      shortDescription,
      specs,
      stock,
      "images": images[]{ "url": asset->url, alt }
    }
  `;

  const items = await sanityClient.fetch<CmsItem[]>(query);
  const available = items.filter((item) => item.slug && (item.stock === undefined || item.stock > 0));

  const xmlItems = available
    .map((item) => {
      const id = escapeXml(item.slug ?? "");
      const name = escapeXml(item.name ?? "");
      const price = formatPrice(item);
      const url = `https://www.wellcomp.hu/${
        item._type === "pc" ? "pc-k" : item._type === "phone" ? "telefonok" : item._type === "console" ? "konzolok" : "termek"
      }/${item.slug}`;
      const image = escapeXml(item.images?.[0]?.url ?? "");
      const brand = escapeXml(item.brand ?? "");
      const description = escapeXml(item.shortDescription ?? "");
      const specsXml = buildSpecsXml(item.specs);
      return `<item>
  <id>${id}</id>
  <name>${name}</name>
  <price>${price}</price>
  <url>${escapeXml(url)}</url>
  <image>${image}</image>
  <brand>${brand}</brand>
  <description>${description}</description>
  ${specsXml}
</item>`;
    })
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<items>${xmlItems}</items>`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
