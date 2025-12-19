import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";
import { blogPostBySlugQuery } from "@/lib/queries";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const post = await sanityClient.fetch(blogPostBySlugQuery, { slug });
    if (!post) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (err) {
    console.error("Sanity blog slug error", err);
    return NextResponse.json({ message: "Hiba a blog lekérésénél" }, { status: 500 });
  }
}
