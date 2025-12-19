import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const searchQuery = `
*[_type in ["product","pc","phone"] && (
  $q=="" ||
  lower(name) match lower($q) ||
  lower(name) match lower($qNoSpace) ||
  lower(shortDescription) match lower($q) ||
  lower(shortDescription) match lower($qNoSpace) ||
  lower(brand) match lower($q) ||
  lower(specs.processor) match lower($q) ||
  lower(specs.memory) match lower($q) ||
  lower(specs.storage) match lower($q) ||
  lower(specs.gpu) match lower($q) ||
  lower(specs.soc) match lower($q) ||
  lower(specs.display) match lower($q) ||
  lower(specs.os) match lower($q)
)]{
  _id,
  _type,
  name,
  "slug": slug.current,
  priceHuf,
  // Kedvezmény projekció
  "discounts": *[_type=="discount" && active == true && (!defined(startsAt) || startsAt <= now()) && (!defined(endsAt) || endsAt >= now()) && references(^._id)]|order(amount desc){
    type,
    amount
  },
  "discountHufs": discounts[]{
    "d": select(
      type == "percent" => round(^.priceHuf * amount / 100),
      type == "fixed" => amount,
      0
    )
  }.d,
  "discountHuf": coalesce(discountHufs[0], 0),
  "compareAtHuf": priceHuf,
  "finalPriceHuf": priceHuf - coalesce(discountHufs[0], 0),
  "invalidDiscount": (priceHuf - coalesce(discountHufs[0], 0)) < 0,
  brand,
  "image": images[0]{ "url": asset->url, alt }
}|order(name asc)[0...$limit]
`;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") ?? 6);
  const qRaw = (searchParams.get("q") ?? "").trim();
  const q = qRaw ? `${qRaw}*` : "";
  const qNoSpace = qRaw ? `${qRaw.replace(/\s+/g, "")}*` : "";

  try {
    const rawItems = await sanityClient.fetch(searchQuery, {
      q,
      qNoSpace,
      limit: Number.isFinite(limit) && limit > 0 ? limit : 6,
    });
    const items = (rawItems as { priceHuf?: number; discounts?: { type?: string; amount?: number }[]; invalidDiscount?: boolean; compareAtHuf?: number }[]).map((item) => {
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
      const computedFinal = base - bestDiscount;
      const invalid = computedFinal < 0 || item.invalidDiscount;
      const finalPrice = invalid ? base : Math.max(0, computedFinal);
      const compareAt = !invalid && bestDiscount > 0 ? base : undefined;
      return {
        ...item,
        finalPriceHuf: finalPrice,
        compareAtHuf: compareAt ?? item.compareAtHuf,
      };
    });

    return NextResponse.json(items, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Sanity search error", err);
    return NextResponse.json({ message: "Hiba a keresésnél" }, { status: 500 });
  }
}
