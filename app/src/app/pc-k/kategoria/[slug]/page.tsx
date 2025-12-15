import PcOsszes from "@/app/pc-k/osszes/page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PcCategoryPage({
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
  merged.category = slug;
  const newSearchParams = Promise.resolve(merged);
  return <PcOsszes searchParams={newSearchParams} />;
}
