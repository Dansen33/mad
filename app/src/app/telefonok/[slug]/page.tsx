import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { RecentlyViewed } from "@/components/recently-viewed";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PhoneImage = { url: string; alt?: string | null };
type PhoneData = {
  name: string;
  slug: string;
  priceHuf?: number;
  finalPriceHuf?: number;
  compareAtHuf?: number;
  invalidDiscount?: boolean;
  discounts?: { type?: string; amount?: number }[];
  brand?: string;
  condition?: string;
  shippingTime?: string;
  warranty?: string;
  shortDescription?: string;
  info?: string;
  specs?: {
    soc?: string;
    memory?: string;
    storage?: string;
    display?: string;
    battery?: string;
    camera?: string;
    os?: string;
    connectivity?: string;
  };
  images?: PhoneImage[];
};

async function fetchPhone(slug: string) {
  return sanityClient.fetch<PhoneData | null>(
    `*[_type=="phone" && slug.current==$slug][0]{
      name,
      "slug": slug.current,
      priceHuf,
      brand,
      condition,
      shippingTime,
      warranty,
      shortDescription,
      info,
      specs{
        soc,
        memory,
        storage,
        display,
        battery,
        camera,
        os,
        connectivity
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

export default async function PhonePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return notFound();

  const phone = await fetchPhone(slug);
  if (!phone) return notFound();
  const basePrice = typeof phone.priceHuf === "number" ? phone.priceHuf : undefined;
  const discounts = Array.isArray(phone.discounts) ? phone.discounts : [];
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
  if ((typeof finalPrice === "number" && finalPrice < 0) || phone.invalidDiscount) return notFound();
  const compareAt = basePrice !== undefined && bestDiscount > 0 ? basePrice : undefined;

  const images = phone.images?.length
    ? phone.images
    : [{ url: "https://dummyimage.com/900x600/0f1320/ffffff&text=Telefon", alt: phone.name }];

  const specs = phone.specs || {};
  const specsEntries = [
    { label: "Processzor (SoC)", value: specs.soc },
    { label: "Memória", value: specs.memory },
    { label: "Tárhely", value: specs.storage },
    { label: "Kijelző", value: specs.display },
    { label: "Akkumulátor", value: specs.battery },
    { label: "Kamera", value: specs.camera },
    { label: "Operációs rendszer", value: specs.os },
    { label: "Kapcsolatok", value: specs.connectivity },
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

  const price =
    typeof finalPrice === "number"
      ? `${new Intl.NumberFormat("hu-HU").format(finalPrice)} Ft`
      : "Árért érdeklődj";
  const conditionLabels: Record<string, string> = {
    UJ: "Új",
    FELUJITOTT: "Felújított",
  };

  return (
    <div className="min-h-screen text-foreground">
      <ProductHeader />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-16 pt-10">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link className="hover:text-primary" href="/">
            Főoldal
          </Link>
          <span>/</span>
          <Link className="hover:text-primary" href="/telefonok/osszes">
            Telefonok
          </Link>
          <span>/</span>
          <span className="text-foreground">{phone.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_1.1fr] md:items-stretch">
          <div className="space-y-3">
            <div className="relative w-full overflow-hidden rounded-2xl border border-border min-h-[420px]">
              <Image
                fill
                src={images[0].url}
                alt={images[0].alt || phone.name}
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
                      alt={img.alt || phone.name}
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
              {phone.brand && <span className="rounded-full bg-primary/15 px-3 py-1">{phone.brand}</span>}
              {phone.condition && (
                <span className="rounded-full bg-primary/15 px-3 py-1">
                  {conditionLabels[phone.condition] || phone.condition}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold">{phone.name}</h1>
            <p className="text-sm text-muted-foreground">
              {phone.shortDescription || phone.info || "Prémium okostelefon részletes specifikációkkal."}
            </p>
            <div className="flex items-baseline gap-3 text-3xl font-extrabold">
              <span className={compareAt !== undefined ? "text-primary" : "text-foreground"}>{price}</span>
              {compareAt !== undefined && (
                <span className="text-lg font-semibold text-muted-foreground line-through">
                  {new Intl.NumberFormat("hu-HU").format(compareAt)} Ft
                </span>
              )}
            </div>
            <AddToCartButton productSlug={phone.slug} productName={phone.name} />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-secondary p-3">
                <div className="text-xs uppercase tracking-wide text-primary">Szállítás</div>
                <div className="text-sm font-semibold text-foreground">
                  {shippingLabels[phone.shippingTime ?? ""] || phone.shippingTime || "—"}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-secondary p-3">
                <div className="text-xs uppercase tracking-wide text-primary">Garancia</div>
                <div className="text-sm font-semibold text-foreground">
                  {warrantyLabels[phone.warranty ?? ""] || phone.warranty || "—"}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-secondary p-3">
              <div className="text-xs uppercase tracking-wide text-primary">Információ</div>
              <div className="text-sm font-semibold text-foreground whitespace-pre-line">
                {phone.info || "Ha kérdésed van a készülékkel kapcsolatban, jelezd nekünk."}
              </div>
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
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-16">
        <RecentlyViewed
          current={{
            slug: phone.slug,
            name: phone.name,
            href: `/telefonok/${phone.slug}`,
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
