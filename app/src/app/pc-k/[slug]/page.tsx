import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";
import { RecentlyViewed } from "@/components/recently-viewed";
import { ViewContentTracker } from "@/components/view-content-tracker";
import { PcImageUpgrades } from "@/components/pc-image-upgrades";
import { UpgradePicker } from "@/components/upgrade-picker";
import { AddToCartButton } from "@/components/add-to-cart-button";

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
  shippingTime?: string;
  warranty?: string;
  category?: string;
  allowMemoryUpgrades?: boolean;
  memoryUpgradeGroup?: "ddr4" | "ddr5";
  allowSsdUpgrades?: boolean;
  allowWifiUpgrades?: boolean;
  allowCaseUpgrades?: boolean;
  allowedCaseOptions?: string[];
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
  wifiOptions?: { label: string; deltaHuf: number }[];
  caseOptions?: { label: string; deltaHuf: number; image?: string | null }[];
};

const deriveCategoryFromPrice = (price?: number | null) => {
  if (typeof price !== "number" || !Number.isFinite(price)) return null;
  if (price < 300000) return "gamer-pc-olcso-300-alatt";
  if (price < 600000) return "gamer-pc-300-600";
  return "gamer-pc-600-felett";
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
      shippingTime,
      warranty,
      category,
      allowMemoryUpgrades,
      memoryUpgradeGroup,
      allowSsdUpgrades,
      allowWifiUpgrades,
      allowCaseUpgrades,
      allowedCaseOptions,
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
      ssdOptions[]{label,deltaHuf},
      wifiOptions[]{label,deltaHuf},
      caseOptions[]{label,deltaHuf,"image": image.asset->url}
    }`,
  );
  const pricingSafe: UpgradePricing = {
    ddr4Options: pricing?.ddr4Options ?? [],
    ddr5Options: pricing?.ddr5Options ?? [],
    ssdOptions: pricing?.ssdOptions ?? [],
    wifiOptions: pricing?.wifiOptions ?? [],
    caseOptions: pricing?.caseOptions ?? [],
  };

  const images = pc.images?.length
    ? pc.images
    : [{ url: "https://dummyimage.com/900x600/0f1320/ffffff&text=PC", alt: pc.name }];

  const conditionLabels: Record<string, string> = {
    UJ: "Új",
    FELUJITOTT: "Felújított",
  };
  const categoryLabels: Record<string, string> = {
    "gamer-pc-olcso-300-alatt": "Belépő kategóriás Gamer PC",
    "gamer-pc-300-600": "Középkategóriás Gamer PC",
    "gamer-pc-600-felett": "Felsőkategóriás Gamer PC",
    "professzionalis-munkaallomas": "Professzionális Munkaállomás",
    "felujitott-gamer-pc": "Felújított Gamer PC",
  };
  const shippingLabels: Record<string, string> = {
    "2_nap": "2 napon belül",
    "2_3_nap": "2-3 napon belül",
    "3_4_nap": "3-4 napon belül",
    "4_5_nap": "4-5 napon belül",
    "5_6_nap": "5-6 napon belül",
  };
  const warrantyLabels: Record<string, string> = {
    "12_ho": "12 hó",
    "12_24_ho": "12-24 hó",
    "24_ho": "24 hó",
    "24_36_ho": "24-36 hó",
    "36_ho": "36 hó",
    "48_ho": "48 hó",
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
  const effectivePriceNumber = typeof finalPrice === "number" ? finalPrice : basePrice;
  const derivedCategory = deriveCategoryFromPrice(effectivePriceNumber);
  const pcCategory = pc.category || derivedCategory;

  return (
    <div className="min-h-screen text-foreground">
      <ProductHeader />
      <ViewContentTracker value={typeof finalPrice === "number" ? finalPrice : basePrice} currency="HUF" />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-16 pt-10">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link className="hover:text-primary" href="/">
            Főoldal
          </Link>
          <span>/</span>
          <Link className="hover:text-primary" href="/pc-k/osszes">
            PC
          </Link>
          <span>/</span>
          <span className="text-foreground">{pc.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_1.1fr] md:items-start">
          <div className="space-y-4">
            <PcImageUpgrades
              images={images}
              pcSlug={pc.slug}
              pcName={pc.name}
              basePrice={typeof finalPrice === "number" ? finalPrice : basePrice ?? 0}
              allowMemoryUpgrades={pc.allowMemoryUpgrades}
              memoryOptions={
                pc.allowMemoryUpgrades
                  ? pc.memoryUpgradeGroup === "ddr5"
                    ? pricingSafe.ddr5Options
                    : pricingSafe.ddr4Options
                  : []
              }
              allowSsdUpgrades={pc.allowSsdUpgrades}
              ssdOptions={pc.allowSsdUpgrades ? pricingSafe.ssdOptions : []}
              allowWifiUpgrades={pc.allowWifiUpgrades}
              wifiOptions={pc.allowWifiUpgrades ? pricingSafe.wifiOptions : []}
              caseOptions={
                pc.allowCaseUpgrades
                  ? Array.isArray(pc.allowedCaseOptions) && pc.allowedCaseOptions.length
                    ? (pricingSafe.caseOptions ?? []).filter((c) => pc.allowedCaseOptions?.includes(c.label))
                    : pricingSafe.caseOptions ?? []
                  : []
              }
            />

            <div className="hidden grid-cols-1 gap-3 sm:grid-cols-2 md:grid">
              <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
                <div className="text-xs uppercase tracking-wide text-primary">Szállítás</div>
                <div className="text-sm font-semibold text-foreground">
                  {shippingLabels[pc.shippingTime ?? ""] || pc.shippingTime || "—"}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
                <div className="text-xs uppercase tracking-wide text-primary">Garancia</div>
                <div className="text-sm font-semibold text-foreground">
                  {warrantyLabels[pc.warranty ?? ""] || pc.warranty || "—"}
                </div>
              </div>
            </div>

            <div className="hidden rounded-xl border border-border bg-card p-3 shadow-sm md:block">
              <div className="text-xs uppercase tracking-wide text-primary">Információ</div>
              {pc.info ? (
                <div className="text-sm font-semibold text-foreground whitespace-pre-line">{pc.info}</div>
              ) : (
                <div className="space-y-1 text-sm font-semibold text-foreground whitespace-pre-line">
                  <div>
                    Személyre szabható konfiguráció, egyéni kérés esetén kérjük vegye fel velünk a{" "}
                    <Link href="/kapcsolat" className="text-primary hover:text-primary/80">
                      kapcsolatot
                    </Link>
                    .
                  </div>
                  <div className="text-xs font-normal text-muted-foreground">A kép csak illusztráció.</div>
                </div>
              )}
              {pc.note && (
                <div className="mt-3 rounded-lg border border-border bg-card p-3 text-sm font-semibold text-foreground whitespace-pre-line shadow-sm">
                  {pc.note}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-border bg-card p-6 pb-10 shadow-2xl shadow-black/30">
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide text-primary">
              {pc.brand && <span className="rounded-full bg-primary/15 px-3 py-1">{pc.brand}</span>}
              {pc.condition && (
                <span className="rounded-full bg-primary/15 px-3 py-1">
                  {conditionLabels[pc.condition] || pc.condition}
                </span>
              )}
              {pcCategory && (
                <span className="rounded-full bg-primary/15 px-3 py-1">
                  {categoryLabels[pcCategory] || pcCategory}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold">{pc.name}</h1>
            <p className="text-sm text-muted-foreground">
              {pc.shortDescription || "Professzionális PC konfiguráció."}
            </p>
            <div className="flex items-baseline gap-3 text-3xl font-extrabold">
              <span className={compareAt !== undefined ? "text-primary" : "text-foreground"}>{price}</span>
              {compareAt !== undefined && (
                <span className="text-lg font-semibold text-muted-foreground line-through">
                  {new Intl.NumberFormat("hu-HU").format(compareAt)} Ft
                </span>
              )}
            </div>

            {pc.allowMemoryUpgrades || pc.allowSsdUpgrades || pc.allowWifiUpgrades || pc.allowCaseUpgrades ? (
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
              wifiOptions={pc.allowWifiUpgrades ? pricingSafe.wifiOptions : []}
              caseOptions={
                pc.allowCaseUpgrades
                  ? Array.isArray(pc.allowedCaseOptions) && pc.allowedCaseOptions.length
                    ? (pricingSafe.caseOptions ?? []).filter((c) => pc.allowedCaseOptions?.includes(c.label))
                    : pricingSafe.caseOptions ?? []
                  : []
              }
              disabled={pc.stock !== undefined && pc.stock <= 0}
            />
            ) : (
              <AddToCartButton productSlug={pc.slug} productName={pc.name} />
            )}
          </div>
        </div>

        {/* Mobilon: info blokk a specifikációk elé, az add-to-cart után */}
        <div className="md:hidden rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30">
          <h2 className="mb-3 text-lg font-bold text-foreground">Információk, szállítás, garancia</h2>
          <div className="space-y-3 text-sm text-foreground">
            <div className="rounded-xl border border-border bg-secondary p-3">
              <div className="text-xs uppercase tracking-wide text-primary">Szállítás</div>
              <div className="text-sm font-semibold text-foreground">
                {shippingLabels[pc.shippingTime ?? ""] || pc.shippingTime || "—"}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-secondary p-3">
              <div className="text-xs uppercase tracking-wide text-primary">Garancia</div>
              <div className="text-sm font-semibold text-foreground">
                {warrantyLabels[pc.warranty ?? ""] || pc.warranty || "—"}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-secondary p-3">
              <div className="text-xs uppercase tracking-wide text-primary">Információ</div>
              <div className="mt-1 whitespace-pre-line text-muted-foreground">
                {pc.info || pc.note || ""}                   
                <div className="text-black">
                    {" Személyre szabható konfiguráció, egyéni kérés esetén kérjük vegye fel velünk a "}
                    <Link href="/kapcsolat" className="text-primary hover:text-primary/80">
                      kapcsolatot
                    </Link>
                  </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">A kép csak illusztráció.</div>
            </div>
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

        <RecentlyViewed
          current={{
            slug: pc.slug,
            name: pc.name,
            href: `/pc-k/${pc.slug}`,
            image: images[0]?.url,
            price: basePrice,
            finalPrice,
            compareAt,
          }}
        />
      </div>
      <SiteFooter />
    </div>
  );
}
