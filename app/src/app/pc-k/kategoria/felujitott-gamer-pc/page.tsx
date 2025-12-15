import PcOsszes from "@/app/pc-k/osszes/page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PcFelujitottPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const qs = await searchParams;
  const merged: Record<string, string> = {};
  for (const [key, value] of Object.entries(qs)) {
    if (typeof value === "string") merged[key] = value;
  }
  merged.category = "felujitott-gamer-pc";
  return <PcOsszes searchParams={Promise.resolve(merged)} />;
}
