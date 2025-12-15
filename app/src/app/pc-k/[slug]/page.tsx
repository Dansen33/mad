import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { UpgradePicker } from "@/components/upgrade-picker";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PcImage = { url: string; alt?: string | null };
type PcData = {
  name: string;
  slug: string;
  priceHuf?: number;
  finalPriceHuf?: number;
  compareAtHuf?: number;
  invalidDiscount?: boolean;
  discounts?: { type?: string; amount?: number }[];
  brand?: string;
  condition?: string;
  stock?: number;
  category?: string;
  allowMemoryUpgrades?: boolean;
  memoryUpgradeGroup?: "ddr4" | "ddr5";
  allowSsdUpgrades?: boolean;
  shortDescription?: string;
  info?: string;
  note?: string;
  specs?: {
    processor?: string;
    cooler?: string;
    motherboard?: string;
    memory?: string;
    gpu?: string;
    ssd?: string;
    case?: string;
    psu?: string;
    wifi?: string;
    bluetooth?: string;
    os?: string;
  };
  images?: PcImage[];
};

type UpgradePricing = {
  ddr4Options?: { label: string; deltaHuf: number }[];
  ddr5Options?: { label: string; deltaHuf: number }[];
  ssdOptions?: { label: string; deltaHuf: number }[];
};

async function fetchPc(slug: string) {
  return sanityClient.fetch<PcData | null>(
    `*[_type=="pc" && slug.current==$slug][0]{
      name,
      "slug": slug.current,
      priceHuf,
      brand,
      condition,
      stock,
      category,
      allowMemoryUpgrades,
      memoryUpgradeGroup,
      allowSsdUpgrades,
      shortDescription,
      info,
      note,
      specs{
        processor,
        cooler,
        motherboard,
        memory,
        gpu,
        ssd,
        case,
        psu,
        wifi,
        bluetooth,
        os
      },
      "images": images[]{ "url": asset->url, alt },
      // Kedvezmény számítás
      "discounts": *[_type=="discount" && active == true && (!defined(startsAt) || startsAt <= now()) && (!defined(endsAt) || endsAt >= now()) && references(^._id)]|order(amount desc){
        type,
        amount
      },
      "discountHufs": discounts[]{
        "d": select(
          type == "percent" => round(^.priceHuf * amount / 100),
          type == "fixed" => amount,
          0
        )
      }.d,
      "discountHuf": coalesce(discountHufs[0], 0),
      "compareAtHuf": priceHuf,
      "finalPriceHuf": priceHuf - coalesce(discountHufs[0], 0),
      "invalidDiscount": (priceHuf - coalesce(discountHufs[0], 0)) < 0
    }`,
    { slug },
  );
}

export default async function PcPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return notFound();

  const pc = await fetchPc(slug);
  if (!pc) return notFound();
  const basePrice = typeof pc.priceHuf === "number" ? pc.priceHuf : undefined;
  const discounts = Array.isArray(pc.discounts) ? pc.discounts : [];
  const bestDiscount =
    basePrice !== undefined
      ? discounts
          .map((d) => {
            if (!d || typeof d.amount !== "number") return 0;
            if (d.type === "percent") return Math.round(basePrice * d.amount * 0.01);
            if (d.type === "fixed") return d.amount;
            return 0;
          })
          .filter((v) => v > 0)
          .sort((a, b) => b - a)[0] ?? 0
      : 0;
  const finalPrice = basePrice !== undefined ? basePrice - bestDiscount : undefined;
  if ((typeof finalPrice === "number" && finalPrice < 0) || pc.invalidDiscount) return notFound();
  const compareAt = basePrice !== undefined && bestDiscount > 0 ? basePrice : undefined;

  const pricing = await sanityClient.fetch<UpgradePricing | null>(
    `*[_type=="upgradePricing"][0]{
      ddr4Options[]{label,deltaHuf},
      ddr5Options[]{label,deltaHuf},
      ssdOptions[]{label,deltaHuf}
    }`,
  );
  const pricingSafe: UpgradePricing = {
    ddr4Options: pricing?.ddr4Options ?? [],
    ddr5Options: pricing?.ddr5Options ?? [],
    ssdOptions: pricing?.ssdOptions ?? [],
  };

  const images = pc.images?.length
    ? pc.images
    : [{ url: "https://dummyimage.com/900x600/0f1320/ffffff&text=PC", alt: pc.name }];

  const conditionLabels: Record<string, string> = {
    UJ: "Új",
    FELUJITOTT: "Felújított",
  };

  const specs = pc.specs || {};
  const specsEntries = [
    { label: "Processzor", value: specs.processor },
    { label: "Processzor hűtés", value: specs.cooler },
    { label: "Alaplap", value: specs.motherboard },
    { label: "Memória", value: specs.memory },
    { label: "Videókártya", value: specs.gpu },
    { label: "SSD", value: specs.ssd },
    { label: "Ház", value: specs.case },
    { label: "Tápegység", value: specs.psu },
    { label: "Wifi", value: specs.wifi },
    { label: "Bluetooth", value: specs.bluetooth },
    { label: "Operációs rendszer", value: specs.os },
  ].filter((s) => s.value && String(s.value).trim().length > 0);

  const price =
    typeof finalPrice === "number"
      ? `${new Intl.NumberFormat("hu-HU").format(finalPrice)} Ft`
      : "Árért érdeklődj";

  return (
    <div className="min-h-screen text-foreground">
      <ProductHeader />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-16 pt-10">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link className="hover:text-primary" href="/">
            Főoldal
          </Link>
          <span>/</span>
          <Link className="hover:text-primary" href="/pc-k/osszes">
            PC-k
          </Link>
          <span>/</span>
          <span className="text-foreground">{pc.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_1.1fr] md:items-stretch">
          <div className="space-y-3">
            <div className="relative w-full overflow-hidden rounded-2xl border border-border min-h-[710px]">
              <Image
                fill
                src={images[0].url}
                alt={images[0].alt || pc.name}
                className="object-cover object-bottom"
                sizes="(min-width: 1024px) 50vw, 100vw"
                unoptimized
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {images.slice(1).map((img) => (
                  <div key={img.url} className="relative h-24 overflow-hidden rounded-xl border border-border">
                    <Image
                      fill
                      src={img.url}
                      alt={img.alt || pc.name}
                      className="object-cover"
                      sizes="200px"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 rounded-2xl border border-border bg-card p-6 pb-10 shadow-2xl shadow-black/30">
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide text-primary">
              {pc.brand && <span className="rounded-full bg-primary/15 px-3 py-1">{pc.brand}</span>}
              {pc.condition && (
                <span className="rounded-full bg-primary/15 px-3 py-1">
                  {conditionLabels[pc.condition] || pc.condition}
                </span>
              )}
              {pc.category && <span className="rounded-full bg-primary/15 px-3 py-1">{pc.category}</span>}
            </div>
            <h1 className="text-2xl font-extrabold">{pc.name}</h1>
            <p className="text-sm text-muted-foreground">
              {pc.shortDescription || pc.info || "Professzionális PC konfiguráció."}
            </p>
            <div className="flex items-baseline gap-3 text-3xl font-extrabold">
              <span className={compareAt !== undefined ? "text-primary" : "text-foreground"}>{price}</span>
              {compareAt !== undefined && (
                <span className="text-lg font-semibold text-muted-foreground line-through">
                  {new Intl.NumberFormat("hu-HU").format(compareAt)} Ft
                </span>
              )}
            </div>

            {pc.allowMemoryUpgrades || pc.allowSsdUpgrades ? (
              <UpgradePicker
                productSlug={pc.slug}
                productName={pc.name}
                basePrice={typeof finalPrice === "number" ? finalPrice : basePrice ?? 0}
                memoryOptions={
                  pc.allowMemoryUpgrades
                    ? pc.memoryUpgradeGroup === "ddr5"
                      ? pricingSafe.ddr5Options
                      : pricingSafe.ddr4Options
                    : []
                }
                ssdOptions={pc.allowSsdUpgrades ? pricingSafe.ssdOptions : []}
                disabled={pc.stock !== undefined && pc.stock <= 0}
              />
            ) : (
              <AddToCartButton productSlug={pc.slug} productName={pc.name} />
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-secondary p-3">
                <div className="text-xs uppercase tracking-wide text-primary">Készlet</div>
                <div className="text-sm font-semibold text-foreground">
                  {pc.stock ?? "—"} db | 24-48h szállítás
                </div>
              </div>
              <div className="rounded-xl border border-border bg-secondary p-3">
                <div className="text-xs uppercase tracking-wide text-primary">Garancia</div>
                <div className="text-sm font-semibold text-foreground">12 hó (bővíthető)</div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-secondary p-3">
              <div className="text-xs uppercase tracking-wide text-primary">Információ</div>
              <div className="text-sm font-semibold text-foreground whitespace-pre-line">
                {pc.info || "Testre szabható konfiguráció, kérd ajánlatunkat."}
              </div>
            </div>
            {pc.note && (
              <div className="rounded-xl border border-border bg-secondary p-3">
                <div className="text-xs uppercase tracking-wide text-primary">Megjegyzés</div>
                <div className="text-sm font-semibold text-foreground whitespace-pre-line">{pc.note}</div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30">
          <h2 className="mb-3 text-lg font-bold text-foreground">Specifikációk</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {specsEntries.map((spec) => (
              <div key={spec.label} className="rounded-xl border border-border bg-secondary p-3">
                <div className="text-xs uppercase tracking-wide text-primary">{spec.label}</div>
                <div className="text-sm font-semibold text-foreground">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
