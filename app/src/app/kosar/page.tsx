import { ProductHeader } from "@/components/product-header";
import { CartClient } from "@/components/cart-client";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import { cookies } from "next/headers";

type CartItem = {
  slug: string;
  name: string;
  brand: string;
  priceHuf: number;
  quantity: number;
  image?: string | null;
  upgrades?: { label: string; deltaHuf: number }[];
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CartPage() {
  const cookieStore = await Promise.resolve(cookies());
  const raw = cookieStore.get("cart-json")?.value;
  let items: CartItem[] = [];
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      items = parsed.items ?? [];
    } catch {
      items = [];
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProductHeader />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-16 pt-10">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link className="hover:text-primary" href="/">
            Főoldal
          </Link>
          <span>/</span>
          <span className="text-foreground">Kosár</span>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-lg shadow-black/30">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase text-primary">Kosár</div>
              <h1 className="text-2xl font-extrabold">Kosár</h1>
              <p className="text-sm text-muted-foreground">
                Frissítsd a mennyiségeket, vagy folytasd a fizetést.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-primary/15 px-4 py-2 text-xs font-bold text-primary">
               Biztonságos fizetés
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs font-semibold text-muted-foreground">
            <span className="rounded-full bg-primary/15 px-3 py-1 text-primary">1. Kosár</span>
            <span className="h-px flex-1 bg-border" />
            <span className="rounded-full px-3 py-1">2. Pénztár</span>
            <span className="h-px flex-1 bg-border" />
            <span className="rounded-full px-3 py-1">3. Rendelés leadása</span>
          </div>
        </div>

        <CartClient initialItems={items} />
      </div>
      <SiteFooter />
    </div>
  );
}
