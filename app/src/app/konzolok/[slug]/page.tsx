import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { RecentlyViewed } from "@/components/recently-viewed";
import { ViewContentTracker } from "@/components/view-content-tracker";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ConsoleImage = { url: string; alt?: string | null };
type ConsoleData = {
  name: string;
  slug: string;
  priceHuf?: number;
  finalPriceHuf?: number;
  compareAtHuf?: number;
  invalidDiscount?: boolean;
  discounts?: { type?: string; amount?: number }[];
  brand?: string;
  condition?: string;
  platform?: string;
  model?: string;
  shippingTime?: string;
  warranty?: string;
  stock?: number;
  shortDescription?: string;
  info?: string;
  note?: string;
  specs?: {
    cpu?: string;
    gpu?: string;
    memory?: string;
    storage?: string;
    resolution?: string;
    extras?: string;
    includes?: string;
    dimensions?: string;
    weight?: string;
  };
  images?: ConsoleImage[];
};

async function fetchConsole(slug: string) {
  return sanityClient.fetch<ConsoleData | null>(
    `*[_type=="console" && slug.current==$slug][0]{
      name,
      "slug": slug.current,
      priceHuf,
      brand,
      condition,
      platform,
      model,
      shippingTime,
      warranty,
      stock,
      shortDescription,
      info,
      note,
      specs{
        cpu,
        gpu,
        memory,
        storage,
        resolution,
        extras,
        includes,
        dimensions,
        weight
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

export default async function ConsolePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return notFound();

  const consoleItem = await fetchConsole(slug);
  if (!consoleItem) return notFound();
  const basePrice = typeof consoleItem.priceHuf === "number" ? consoleItem.priceHuf : undefined;
  const discounts = Array.isArray(consoleItem.discounts) ? consoleItem.discounts : [];
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
  if ((typeof finalPrice === "number" && finalPrice < 0) || consoleItem.invalidDiscount) return notFound();
  const compareAt = basePrice !== undefined && bestDiscount > 0 ? basePrice : undefined;

  const images = consoleItem.images?.length
    ? consoleItem.images
    : [{ url: "https://dummyimage.com/900x600/0f1320/ffffff&text=Konzol", alt: consoleItem.name }];

  const specs = consoleItem.specs || {};
  const specsEntries = [
    { label: "Modell", value: consoleItem.model },
    { label: "Processzor / SoC", value: specs.cpu },
    { label: "Grafikus egység", value: specs.gpu },
    { label: "Memória", value: specs.memory },
    { label: "Tárhely", value: specs.storage },
    { label: "Felbontás / cél FPS", value: specs.resolution },
    { label: "Tartozékok", value: specs.includes },
    { label: "Extrák", value: specs.extras },
    { label: "Méretek", value: specs.dimensions },
    { label: "Súly", value: specs.weight },
  ].filter((s) => s.value && String(s.value).trim().length > 0);
  const shippingLabels: Record<string, string> = {
    "2_nap": "2 napon belül",
    "2_3_nap": "2-3 napon belül",
    "3_4_nap": "3-4 napon belül",
    "4_5_nap": "4-5 napon belül",
    "5_6_nap": "5-6 napon belül",
  };
  const warrantyLabels: Record<string, string> = {
    "12_ho": "12 hó",
    "24_ho": "24 hó",
    "36_ho": "36 hó",
    "48_ho": "48 hó",
  };
  const platformLabels: Record<string, string> = {
    playstation: "Playstation",
    xbox: "Xbox",
    nintendo: "Nintendo",
    kezikonzolok: "Kézikonzolok",
  };
  const conditionLabels: Record<string, string> = {
    UJ: "Új",
    FELUJITOTT: "Felújított",
  };

  const price =
    typeof finalPrice === "number"
      ? `${new Intl.NumberFormat("hu-HU").format(finalPrice)} Ft`
      : "Árért érdeklődj";
  const stockAvailable = consoleItem.stock === undefined || (typeof consoleItem.stock === "number" && consoleItem.stock > 0);

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
          <Link className="hover:text-primary" href="/konzolok/osszes">
            Konzolok
          </Link>
          <span>/</span>
          <span className="text-foreground">{consoleItem.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_1.1fr] md:items-stretch">
          <div className="space-y-3">
            <div className="relative w-full overflow-hidden rounded-2xl border border-border min-h-[420px]">
              <Image
                fill
                src={images[0].url}
                alt={images[0].alt || consoleItem.name}
                className="object-contain bg-white"
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
                      alt={img.alt || consoleItem.name}
                      className="object-contain bg-white"
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
              {consoleItem.brand && <span className="rounded-full bg-primary/15 px-3 py-1">{consoleItem.brand}</span>}
              {consoleItem.platform && (
                <span className="rounded-full bg-primary/15 px-3 py-1">
                  {platformLabels[consoleItem.platform] || consoleItem.platform}
                </span>
              )}
              {consoleItem.condition && (
                <span className="rounded-full bg-primary/15 px-3 py-1">
                  {conditionLabels[consoleItem.condition] || consoleItem.condition}
                </span>
              )}
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold leading-tight text-foreground">{consoleItem.name}</h1>
              {consoleItem.shortDescription && (
                <p className="text-sm text-muted-foreground whitespace-pre-line">{consoleItem.shortDescription}</p>
              )}
            </div>
            <div className="flex flex-wrap items-baseline gap-3">
              {typeof compareAt === "number" && (
                <div className="text-base font-semibold text-muted-foreground line-through">
                  {new Intl.NumberFormat("hu-HU").format(compareAt)} Ft
                </div>
              )}
              <div className="text-4xl font-extrabold text-primary">{price}</div>
            </div>
            <div className="grid grid-cols-1 gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              {consoleItem.shippingTime && (
                <div className="rounded-xl border border-border bg-secondary px-3 py-2">
                  <div className="text-xs uppercase font-semibold">Szállítás</div>
                  <div className="text-foreground">
                    {shippingLabels[consoleItem.shippingTime] || consoleItem.shippingTime}
                  </div>
                </div>
              )}
              {consoleItem.warranty && (
                <div className="rounded-xl border border-border bg-secondary px-3 py-2">
                  <div className="text-xs uppercase font-semibold">Garancia</div>
                  <div className="text-foreground">{warrantyLabels[consoleItem.warranty] || consoleItem.warranty}</div>
                </div>
              )}
            </div>
            <div className="pt-2">
              <AddToCartButton productSlug={consoleItem.slug} productName={consoleItem.name} disabled={!stockAvailable} />
              {!stockAvailable && (
                <div className="mt-2 text-xs text-muted-foreground">Jelenleg nincs készleten</div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-black/30">
            <div className="mb-3">
              <div className="text-xs uppercase text-primary">Specifikációk</div>
              <h2 className="text-lg font-bold text-foreground">Részletes adatok</h2>
            </div>
            {specsEntries.length ? (
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {specsEntries.map((spec) => (
                  <div key={spec.label} className="rounded-xl border border-border bg-secondary px-3 py-2">
                    <dt className="text-xs uppercase text-muted-foreground">{spec.label}</dt>
                    <dd className="text-sm font-semibold text-foreground">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">Nincsenek részletes specifikációk megadva.</p>
            )}
          </div>

          <div className="space-y-4">
            {consoleItem.note && (
              <div className="rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30">
                <div className="text-xs uppercase text-primary">Megjegyzés</div>
                <p className="mt-1 whitespace-pre-line text-sm text-foreground">{consoleItem.note}</p>
              </div>
            )}
            {consoleItem.info && (
              <div className="rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30">
                <div className="text-xs uppercase text-primary">Információ</div>
                <p className="mt-1 whitespace-pre-line text-sm text-foreground">{consoleItem.info}</p>
              </div>
            )}
          </div>
        </div>

        <RecentlyViewed
          current={{
            slug: consoleItem.slug,
            name: consoleItem.name,
            href: `/konzolok/${consoleItem.slug}`,
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
