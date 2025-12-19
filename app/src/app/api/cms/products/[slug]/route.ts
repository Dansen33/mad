import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";
import { productBySlugQuery } from "@/lib/queries";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_: Request, { params }: Params) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ message: "Missing slug" }, { status: 400 });
  }
  try {
    const product = await sanityClient.fetch(productBySlugQuery, { slug });
    if (!product) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err) {
    console.error("Sanity product slug error", err);
    return NextResponse.json({ message: "Hiba a termék lekérésénél" }, { status: 500 });
  }
}
