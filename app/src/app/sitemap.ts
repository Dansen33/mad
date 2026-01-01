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
    "/pc-k/osszes",
    "/telefonok/osszes",
    "/konzolok/osszes",
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

  const pcs =
    (await sanityClient.fetch<
      { slug: string; updated?: string }[]
    >(groq`*[_type=="pc" && (!defined(stock) || stock > 0)]{
      "slug": slug.current,
      "updated": coalesce(_updatedAt,_createdAt)
    }`)) || [];

  const phones =
    (await sanityClient.fetch<
      { slug: string; updated?: string }[]
    >(groq`*[_type=="phone" && (!defined(stock) || stock > 0)]{
      "slug": slug.current,
      "updated": coalesce(_updatedAt,_createdAt)
    }`)) || [];

  const consoles =
    (await sanityClient.fetch<
      { slug: string; updated?: string }[]
    >(groq`*[_type=="console" && (!defined(stock) || stock > 0)]{
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

  const pcEntries = pcs
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${site}/pc-k/${p.slug}`,
      lastModified: p.updated ? new Date(p.updated) : now,
    }));

  const phoneEntries = phones
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${site}/telefonok/${p.slug}`,
      lastModified: p.updated ? new Date(p.updated) : now,
    }));

  const consoleEntries = consoles
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${site}/konzolok/${p.slug}`,
      lastModified: p.updated ? new Date(p.updated) : now,
    }));

  const blogEntries = blogs
    .filter((b) => b.slug)
    .map((b) => ({
      url: `${site}/blog/${b.slug}`,
      lastModified: b.updated ? new Date(b.updated) : now,
    }));

  return [...staticPaths, ...productEntries, ...pcEntries, ...phoneEntries, ...consoleEntries, ...blogEntries];
}
