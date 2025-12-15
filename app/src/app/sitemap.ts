import type { MetadataRoute } from "next";
import { sanityClient } from "@/lib/sanity";
import { groq } from "next-sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();

  const staticPaths = [
    "",
    "/blog",
    "/laptopok/osszes",
    "/miert-mi",
    "/rolunk",
    "/kapcsolat",
    "/aszf",
    "/adatvedelem",
    "/impresszum",
    "/fizetes-es-szallitas",
    "/garancia",
    "/gyik",
    "/tanusitvanyok",
  ].map((path) => ({
    url: `${site}${path}`,
    lastModified: now,
  }));

  const products =
    (await sanityClient.fetch<
      { slug: string; updated?: string }[]
    >(groq`*[_type=="product" && (!defined(stock) || stock > 0)]{
      "slug": slug.current,
      "updated": coalesce(_updatedAt,_createdAt)
    }`)) || [];

  const blogs =
    (await sanityClient.fetch<
      { slug: string; updated?: string }[]
    >(groq`*[_type=="blogPost"]{
      "slug": slug.current,
      "updated": coalesce(_updatedAt,_createdAt)
    }`)) || [];

  const productEntries = products
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${site}/termek/${p.slug}`,
      lastModified: p.updated ? new Date(p.updated) : now,
    }));

  const blogEntries = blogs
    .filter((b) => b.slug)
    .map((b) => ({
      url: `${site}/blog/${b.slug}`,
      lastModified: b.updated ? new Date(b.updated) : now,
    }));

  return [...staticPaths, ...productEntries, ...blogEntries];
}
