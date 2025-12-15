import AllProductsPage from "@/app/kategoria/osszes/page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Márkaoldal: csak egy shortcut a laptop listára előre kitöltött brand szűrővel.
export default async function BrandPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const qs = await searchParams;
  const merged: Record<string, string> = {};
  for (const [key, value] of Object.entries(qs)) {
    if (typeof value === "string") merged[key] = value;
  }
  // slug pl. "lenovo" vagy "macbook-air" -> brand név, de a backend lower() hasonlít, így elég a dekódolt string.
  merged.brand = decodeURIComponent(slug).replace(/-/g, " ");
  const newSearchParams = Promise.resolve(merged);
  return <AllProductsPage searchParams={newSearchParams} />;
}
