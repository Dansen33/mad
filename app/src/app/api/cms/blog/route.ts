import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";
import { blogPostsQuery } from "@/lib/queries";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limitRaw = Number(searchParams.get("limit"));
    const limit = Math.max(1, Math.min(50, Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : 3));
    const offset = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      sanityClient.fetch(blogPostsQuery, { limit, offset }),
      sanityClient.fetch<number>('count(*[_type=="blogPost"])'),
    ]);

    const totalPages = Math.max(1, Math.ceil((total || 0) / limit));

    return NextResponse.json({
      posts,
      page,
      pageSize: limit,
      total,
      totalPages,
    });
  } catch (err) {
    console.error("Sanity blog error", err);
    return NextResponse.json({ message: "Hiba a blog lekérésénél" }, { status: 500 });
  }
}
