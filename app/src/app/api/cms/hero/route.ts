import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";
import {
  allHeroSlidesQuery,
  featuredProductQuery,
  heroSlidesQuery,
} from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const fallbackFeaturedQuery = `
*[_type=="product" && featured==true][0]{
  _type,
  _id,
  name,
  "slug": slug.current,
  priceHuf,
  brand,
  shortDescription,
  specs{
    processor,
    memory,
    gpu,
    display,
    refreshRate,
    storage,
    os,
    lan,
    wifi,
    bluetooth,
    hdmi,
    usb2,
    usb3,
    usb31,
    typec,
    optical,
    keyboard,
    audio,
    webcam,
    battery,
    extras,
    moreExtras,
    size,
    weight,
    warranty
  },
  "images": images[]{ "url": asset->url, alt },
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
  "invalidDiscount": (priceHuf - coalesce(discountHufs[0], 0)) < 0
}
`;

export async function GET() {
  try {
    let hero = await sanityClient.fetch(heroSlidesQuery);
    if (!hero?.heroSlides?.length) {
      const slides = await sanityClient.fetch(allHeroSlidesQuery);
      hero = { heroSlides: slides ?? [] };
    }
    let featured = await sanityClient.fetch(featuredProductQuery);
    if (!featured?.featuredProduct) {
      const fallback = await sanityClient.fetch(fallbackFeaturedQuery);
      featured = { featuredProduct: fallback ?? null };
    }

    // Kedvezményes ár számítás a kiemelt termékre
    if (featured?.featuredProduct) {
      const fp = featured.featuredProduct as {
        priceHuf?: number;
        discounts?: { type?: string; amount?: number }[];
        invalidDiscount?: boolean;
        finalPriceHuf?: number;
        compareAtHuf?: number;
        [key: string]: unknown;
      };
      const base = typeof fp.priceHuf === "number" ? fp.priceHuf : 0;
      const discounts: { type?: string; amount?: number }[] = Array.isArray(fp.discounts) ? fp.discounts : [];
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
      const invalid = fp.invalidDiscount || computedFinal < 0;
      const final = invalid ? base : Math.max(0, computedFinal);
      const compareAt =
        !invalid && bestDiscount > 0
          ? base
          : typeof fp.compareAtHuf === "number" && fp.compareAtHuf > final
            ? fp.compareAtHuf
            : undefined;
      featured.featuredProduct = {
        ...fp,
        finalPriceHuf: final,
        compareAtHuf: compareAt,
        invalidDiscount: invalid,
      };
    }

    return NextResponse.json(
      {
        heroSlides: hero?.heroSlides ?? [],
        featured: featured?.featuredProduct ?? null,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("Sanity hero/featured error", err);
    return NextResponse.json({ message: "Hiba a hero/featured lekérésénél" }, { status: 500 });
  }
}
