import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";
import { blogPostsQuery } from "@/lib/queries";

export async function GET() {
  try {
    const posts = await sanityClient.fetch(blogPostsQuery, { limit: 3 });
    return NextResponse.json(posts);
  } catch (err) {
    console.error("Sanity blog error", err);
    return NextResponse.json({ message: "Hiba a blog lekérésénél" }, { status: 500 });
  }
}
