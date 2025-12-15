import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import Image from "next/image";
import { productBySlugQuery } from "@/lib/queries";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";
import { UpgradePicker } from "@/components/upgrade-picker";
import { AddToCartButton } from "@/components/add-to-cart-button";

type ProdImage = { url: string; alt?: string | null; _key?: string };
type ProductData = {
  name: string;
  slug: string;
  brand?: string;
  condition?: string;
  categories?: string[];
  category?: string;
  images?: ProdImage[];
  shortDescription?: string;
  description?: string;
  priceHuf: number;
  finalPriceHuf?: number;
  compareAtHuf?: number;
  invalidDiscount?: boolean;
  discounts?: { type?: string; amount?: number }[];
  tags?: string[];
  allowMemoryUpgrades?: boolean;
  memoryUpgradeGroup?: "ddr4" | "ddr5";
  allowSsdUpgrades?: boolean;
  specs?: {
    processor?: string;
    memory?: string;
    gpu?: string;
    display?: string;
    refreshRate?: number | string;
    storage?: string;
    os?: string;
    lan?: string;
    wifi?: string;
    bluetooth?: string;
    hdmi?: string;
    usb2?: string;
    usb3?: string;
    usb31?: string;
    typec?: string;
    optical?: string;
    keyboard?: string;
    audio?: string;
    webcam?: string;
    battery?: string;
    extras?: string;
    moreExtras?: string;
    size?: string;
    weight?: string;
    warranty?: string;
  };
  stock?: number;
};

type UpgradePricing = {
  laptopDdr4Options?: { label: string; deltaHuf: number }[];
  laptopDdr5Options?: { label: string; deltaHuf: number }[];
  laptopSsdOptions?: { label: string; deltaHuf: number }[];
};

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type PageProps = {
  params: Promise<{ slug?: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  if (!slug) return {};

  const product = await sanityClient.fetch<ProductData | null>(productBySlugQuery, { slug });
  if (!product) return {};
  return {
    title: `${product.name} | WELLCOMP`,
    description: product.shortDescription || product.description || "",
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug || typeof slug !== "string") {
    return notFound();
  }

  const product = await sanityClient.fetch<ProductData | null>(productBySlugQuery, { slug });

  if (!product) {
    return notFound();
  }

  const categoryLabels: Record<string, string> = {
    GENERAL: "Általános",
    BUSINESS: "Üzleti",
    GAMING: "Gamer",
    WORKSTATION: "Workstation",
    TOUCH: "Érintőképernyős",
  };
  const conditionLabels: Record<string, string> = {
    UJ: "Új",
    FELUJITOTT: "Felújított",
  };
  const categoryList: string[] = Array.isArray(product.categories)
    ? product.categories.filter((c): c is string => typeof c === "string" && c.trim().length > 0)
    : product.category
      ? [product.category]
      : [];

  const images: ProdImage[] = product.images?.length
    ? product.images
    : [
        {
          _key: "fallback",
          url: "https://dummyimage.com/900x600/0f1320/ffffff&text=WELLCOMP",
          alt: product.name,
        },
      ];

  const specsObj = product.specs || {};
  const rawSpecs: { label: string; value: string | number | null | undefined }[] = [
    { label: "Processzor", value: specsObj.processor },
    { label: "Memória", value: specsObj.memory },
    { label: "Grafikus vezérlő (GPU)", value: specsObj.gpu },
    { label: "Kijelző", value: specsObj.display },
    { label: "Háttértár", value: specsObj.storage },
    { label: "Operációs rendszer", value: specsObj.os },
    { label: "LAN Típus", value: specsObj.lan },
    { label: "Wi-Fi", value: specsObj.wifi },
    { label: "Bluetooth", value: specsObj.bluetooth },
    { label: "HDMI", value: specsObj.hdmi },
    { label: "USB 2.0", value: specsObj.usb2 },
    { label: "USB 3.0", value: specsObj.usb3 },
    { label: "USB 3.1", value: specsObj.usb31 },
    { label: "Type C", value: specsObj.typec },
    { label: "Optikai meghajtó", value: specsObj.optical },
    { label: "Billentyűzet", value: specsObj.keyboard },
    { label: "Audio", value: specsObj.audio },
    { label: "Webkamera", value: specsObj.webcam },
    { label: "Akkumulátor", value: specsObj.battery },
    { label: "Extrák", value: specsObj.extras },
    { label: "További extrák", value: specsObj.moreExtras },
    { label: "Méret", value: specsObj.size },
    { label: "Súly", value: specsObj.weight },
    { label: "Garancia", value: specsObj.warranty },
  ];
  if (specsObj.refreshRate !== undefined && specsObj.refreshRate !== null) {
    rawSpecs.push({ label: "Képfrissítés", value: `${specsObj.refreshRate} Hz` });
  }

  const specsEntries: { label: string; value: string }[] = rawSpecs
    .filter((spec) => {
      const value = spec.value;
      if (value === undefined || value === null) return false;
      if (typeof value === "string") return value.trim().length > 0;
      return true;
    })
    .map((spec) => ({
      label: spec.label,
      value: typeof spec.value === "string" ? spec.value : String(spec.value),
    }));

  const pricing = await sanityClient.fetch<UpgradePricing | null>(
    `*[_type=="upgradePricing"][0]{ 
      laptopDdr4Options[]{label,deltaHuf},
      laptopDdr5Options[]{label,deltaHuf},
      laptopSsdOptions[]{label,deltaHuf}
    }`,
  );
  const pricingSafe: UpgradePricing = {
    laptopDdr4Options: pricing?.laptopDdr4Options ?? [],
    laptopDdr5Options: pricing?.laptopDdr5Options ?? [],
    laptopSsdOptions: pricing?.laptopSsdOptions ?? [],
  };

  const discounts = Array.isArray(product.discounts) ? product.discounts : [];
  const bestDiscount = discounts
    .map((d) => {
      if (!d || typeof d.amount !== "number") return 0;
      if (d.type === "percent") return Math.round(product.priceHuf * d.amount * 0.01);
      if (d.type === "fixed") return d.amount;
      return 0;
    })
    .filter((v) => v > 0)
    .sort((a, b) => b - a)[0] ?? 0;
  const invalidDiscount = product.priceHuf - bestDiscount < 0;
  if (invalidDiscount) {
    return notFound();
  }
  const finalPrice = product.priceHuf - bestDiscount;
  const compareAt = bestDiscount > 0 ? product.priceHuf : undefined;

  return (
    <div className="min-h-screen text-foreground">
      <ProductHeader />

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-16 pt-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link className="hover:text-primary" href="/">
            Főoldal
          </Link>
          <span>/</span>
          <Link className="hover:text-primary" href="/laptopok/osszes">
            Termékek
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_1.1fr] md:items-stretch">
          {/* BAL OSZLOP: képek */}
          <div className="space-y-3">
            <div className="relative w-full overflow-hidden rounded-2xl border border-border min-h-[520px] md:min-h-[640px]">
              <Image
                fill
                src={images[0].url}
                alt={images[0].alt || product.name}
                className="object-cover object-bottom"
                sizes="(min-width: 1024px) 50vw, 100vw"
                unoptimized
              />
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {images.slice(1).map((img) => (
                  <div
                    key={img._key || img.url || "thumb"}
                    className="relative h-24 overflow-hidden rounded-xl border border-border"
                  >
                    <Image
                      fill
                      src={img.url}
                      alt={img.alt || product.name}
                      className="object-cover"
                      sizes="200px"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* JOBB OSZLOP: termék infó */}
          <div className="space-y-4 rounded-2xl border border-border bg-card p-6 pb-12 shadow-2xl shadow-black/30">
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide text-primary">
              <span className="rounded-full bg-primary/15 px-3 py-1">{product.brand}</span>
              {product.condition && (
                <span className="rounded-full bg-primary/15 px-3 py-1">
                  {conditionLabels[product.condition] || product.condition}
                </span>
              )}
              {categoryList.map((cat) => (
                <span key={cat} className="rounded-full bg-primary/15 px-3 py-1">
                  {categoryLabels[cat] || cat.toLowerCase()}
                </span>
              ))}
            </div>

            <h1 className="text-2xl font-extrabold">{product.name}</h1>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.shortDescription || product.description}
            </p>

            <div className="flex items-baseline gap-3 text-3xl font-extrabold">
              <span className={compareAt ? "text-primary" : "text-foreground"}>
                {new Intl.NumberFormat("hu-HU").format(finalPrice)} Ft
              </span>
              {compareAt && (
                <span className="text-lg font-semibold text-muted-foreground line-through">
                  {new Intl.NumberFormat("hu-HU").format(compareAt)} Ft
                </span>
              )}
            </div>

            {product.allowMemoryUpgrades || product.allowSsdUpgrades ? (
              <UpgradePicker
                productSlug={product.slug}
                productName={product.name}
                basePrice={finalPrice}
                memoryOptions={
                  product.allowMemoryUpgrades
                    ? product.memoryUpgradeGroup === "ddr5"
                      ? pricingSafe.laptopDdr5Options
                      : pricingSafe.laptopDdr4Options
                    : []
                }
                ssdOptions={product.allowSsdUpgrades ? pricingSafe.laptopSsdOptions : []}
                disabled={product.stock !== undefined && product.stock <= 0}
              />
            ) : (
              <div className="opacity-80">
                <AddToCartButton
                  productSlug={product.slug}
                  productName={product.name}
                  disabled={product.stock !== undefined && product.stock <= 0}
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {(product.tags ?? []).map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-secondary px-3 py-2 text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-secondary p-3">
                <div className="text-xs uppercase tracking-wide text-primary">Készlet</div>
                <div className="text-sm font-semibold text-foreground">
                  {product.stock ?? "—"} db | 24-48h szállítás
                </div>
              </div>

              <div className="rounded-xl border border-border bg-secondary p-3">
                <div className="text-xs uppercase tracking-wide text-primary">Garancia</div>
                <div className="text-sm font-semibold text-foreground">12 hó (bővíthető 24 hó)</div>
              </div>

              <div className="rounded-xl border border-border bg-secondary p-3">
                <div className="text-xs uppercase tracking-wide text-primary">Fizetés</div>
                <div className="text-sm font-semibold text-foreground">Kártya, Stripe, átutalás</div>
              </div>

              <div className="rounded-xl border border-border bg-secondary p-3">
                <div className="text-xs uppercase tracking-wide text-primary">Szerviz</div>
                <div className="text-sm font-semibold text-foreground">Bevizsgálva, újrapasztázva, tisztítva</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30">
          <h2 className="mb-3 text-lg font-bold text-foreground">Technikai adatok</h2>
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
