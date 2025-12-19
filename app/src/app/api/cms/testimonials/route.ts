import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";
import { testimonialsQuery } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const testimonials = await sanityClient.fetch(testimonialsQuery);
    return NextResponse.json({ testimonials: testimonials ?? [] }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Sanity testimonials error", err);
    return NextResponse.json({ message: "Hiba a vélemények lekérésénél" }, { status: 500 });
  }
}
