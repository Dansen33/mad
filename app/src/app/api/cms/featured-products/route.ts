import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";
import { featuredProductsCarouselQuery } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await sanityClient.fetch(featuredProductsCarouselQuery);
    const items = Array.isArray(data?.featuredProducts) ? data.featuredProducts : [];
    return NextResponse.json(items, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Sanity featured products error", err);
    return NextResponse.json({ message: "Hiba a kiemelt termékek lekérésénél" }, { status: 500 });
  }
}
