import Link from "next/link";
import { cookies } from "next/headers";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";
import { CheckoutForm } from "@/components/checkout-form";
import { sanityClient } from "@/lib/sanity";
import { catalogItemBySlugQuery } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CartItem = {
  slug: string;
  name: string;
  brand: string;
  priceHuf: number;
  quantity: number;
  image?: string | null;
  upgrades?: { label: string; deltaHuf: number }[];
};

type CatalogItem = {
  priceHuf?: number;
  finalPriceHuf?: number;
  invalidDiscount?: boolean;
  discounts?: { type?: string; amount?: number }[];
  name: string;
  brand?: string;
  images?: { url?: string | null }[];
};

function computePriceFromDiscounts(product: CatalogItem) {
  const base = typeof product.priceHuf === "number" ? product.priceHuf : null;
  if (base === null) return { finalPrice: null };
  const discounts = Array.isArray(product.discounts) ? product.discounts : [];
  const bestDiscount =
    discounts
      .map((d) => {
        if (!d || typeof d.amount !== "number") return 0;
        if (d.type === "percent") return Math.round(base * d.amount * 0.01);
        if (d.type === "fixed") return d.amount;
        return 0;
      })
      .filter((v) => v > 0)
      .sort((a, b) => b - a)[0] ?? 0;
  const finalPrice = base - bestDiscount;
  return { finalPrice };
}

async function readCart() {
  const store = await Promise.resolve(cookies());
  const raw = store.get("cart-json")?.value;
  if (!raw) return { items: [] as CartItem[], totalHuf: 0 };
  try {
    const parsed = JSON.parse(raw) as { items?: CartItem[] };
    const items = parsed.items ?? [];
    const refreshed = (
      await Promise.all(
        items.map(async (it) => {
          const product = await sanityClient.fetch<CatalogItem | null>(catalogItemBySlugQuery, {
            slug: it.slug,
          });
          if (!product) return null;
          const { finalPrice } = computePriceFromDiscounts(product);
          const priceForCart =
            typeof finalPrice === "number"
              ? finalPrice
              : typeof product.finalPriceHuf === "number"
                ? product.finalPriceHuf
                : typeof product.priceHuf === "number"
                  ? product.priceHuf
                  : null;
          if (priceForCart === null || priceForCart < 0 || product.invalidDiscount) return null;
          return {
            ...it,
            name: product.name,
            brand: product.brand ?? "",
            image: product.images?.[0]?.url,
            priceHuf: priceForCart,
          };
        }),
      )
    ).filter(Boolean) as CartItem[];

    const itemsSafe = refreshed;
    const lineTotal = (it: CartItem) => {
      const upgradeSum = (it.upgrades ?? []).reduce((s, u) => s + u.deltaHuf, 0);
      return (it.priceHuf + upgradeSum) * it.quantity;
    };
    const totalHuf = itemsSafe.reduce((sum, it) => sum + lineTotal(it), 0);
    return { items: itemsSafe, totalHuf };
  } catch {
    return { items: [] as CartItem[], totalHuf: 0 };
  }
}

export default async function CheckoutPage() {
  const { items, totalHuf } = await readCart();
  const shipping = 2490;
  const grandTotal = totalHuf + (items.length ? shipping : 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProductHeader />
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 pb-16 pt-10">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link className="hover:text-primary" href="/">
            Főoldal
          </Link>
          <span>/</span>
          <Link className="hover:text-primary" href="/kosar">
            Kosár
          </Link>
          <span>/</span>
          <span className="text-foreground">Pénztár</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-black/30">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold  text-primary">Pénztár</h1>
              <p className="text-sm text-muted-foreground">
                Add meg az elérhetőségeket és a szállítási adatokat, majd válassz fizetési módot.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-primary/15 px-4 py-2 text-xs font-bold text-primary">
              🔒 Biztonságos fizetés
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs font-semibold text-muted-foreground">
            <span className="rounded-full bg-primary/15 px-3 py-1 text-primary">1. Kosár</span>
            <span className="h-px flex-1 bg-border" />
            <span className="rounded-full bg-primary px-3 py-1 text-primary-foreground">2. Pénztár</span>
            <span className="h-px flex-1 bg-border" />
            <span className="rounded-full px-3 py-1">3. Fizetés</span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground shadow-lg shadow-black/30">
            Üres a kosár. Kezdd a válogatást az{" "}
            <Link className="font-semibold text-primary" href="/laptopok/osszes">
              összes laptop
            </Link>{" "}
            között!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <CheckoutForm items={items} subtotal={totalHuf} shipping={shipping} total={grandTotal} />
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
