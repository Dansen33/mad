import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";
import { productsByCategoryQuery } from "@/lib/queries";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") ?? "";
  const limit = Number(searchParams.get("limit") ?? 6);
  const q = (searchParams.get("q") ?? "").trim();
  const qNoSpace = q.replace(/\s+/g, "");

  try {
    const products = await sanityClient.fetch(productsByCategoryQuery, {
      category,
      limit: Number.isFinite(limit) && limit > 0 ? limit : 6,
      q,
      qNoSpace,
    });
    return NextResponse.json(products);
  } catch (err) {
    console.error("Sanity products error", err);
    return NextResponse.json({ message: "Hiba a termékek lekérésénél" }, { status: 500 });
  }
}
