import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

export const dynamic = "force-dynamic";

const fallback = [
  {
    title: "Középkategóriás Gamer PC-k",
    href: "/pc-k/osszes?category=gamer-pc-300-600",
    image: "https://dummyimage.com/300x300/e5e7eb/0c0f14&text=K%C3%B6z%C3%A9pkateg%C3%B3ri%C3%A1s+Gamer+PC",
  },
  {
    title: "Gamer laptopok",
    href: "/kategoria/gamer",
    image: "https://dummyimage.com/300x300/e5e7eb/0c0f14&text=Gamer+laptopok",
  },
  {
    title: "Felsőkategóriás Gamer PC-k",
    href: "/pc-k/osszes?category=gamer-pc-600-felett",
    image: "https://dummyimage.com/300x300/e5e7eb/0c0f14&text=Fels%C5%91kateg%C3%B3ri%C3%A1s+Gamer+PC",
  },
  {
    title: "Üzleti laptopok",
    href: "/kategoria/uzleti",
    image: "https://dummyimage.com/300x300/e5e7eb/0c0f14&text=%C3%9Azleti+laptopok",
  },
];

export async function GET() {
  try {
    const query = `*[_type=="popularCategory"]|order(order asc)[0...4]{
      title,
      href,
      "image": image.asset->url
    }`;
    const data = await sanityClient.fetch(query);
    const list = Array.isArray(data)
      ? data
          .map((item: { title?: unknown; href?: unknown; image?: unknown }) => ({
            title: typeof item?.title === "string" ? item.title : "",
            href: typeof item?.href === "string" ? item.href : "",
            image: typeof item?.image === "string" ? item.image : "",
          }))
          .filter((x) => x.href)
      : [];
    return NextResponse.json({ items: list.length ? list : fallback });
  } catch (err) {
    console.error("popular categories fetch error", err);
    return NextResponse.json({ items: fallback });
  }
}
