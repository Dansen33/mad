import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";
import { headerAnnouncementQuery } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await sanityClient.fetch(headerAnnouncementQuery);
    return NextResponse.json(
      { announcement: data?.announcement ?? null },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("Sanity announcement error", err);
    return NextResponse.json({ message: "Hiba a banner lekérésénél" }, { status: 500 });
  }
}
