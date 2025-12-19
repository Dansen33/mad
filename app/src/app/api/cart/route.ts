import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";
import { catalogItemBySlugQuery } from "@/lib/queries";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "cart-json";

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
  if (base === null) return { finalPrice: null, compareAt: undefined };
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
  const compareAt = bestDiscount > 0 ? base : undefined;
  return { finalPrice, compareAt };
}

async function readCart() {
  const store = await Promise.resolve(cookies());
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return { items: [] as CartItem[] };
  try {
    const parsed = JSON.parse(raw) as { items?: CartItem[] };
    return { items: parsed.items ?? [] };
  } catch {
    return { items: [] as CartItem[] };
  }
}

async function writeCart(items: CartItem[]) {
  const totalHuf = items.reduce((sum, it) => {
    const upgradeSum = (it.upgrades ?? []).reduce((s, u) => s + u.deltaHuf, 0);
    return sum + (it.priceHuf + upgradeSum) * it.quantity;
  }, 0);
  const res = NextResponse.json({ items, totalHuf });
  res.cookies.set({
    name: COOKIE_NAME,
    value: JSON.stringify({ items }),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

async function refreshCartItems(items: CartItem[]) {
  const refreshed: CartItem[] = [];
  for (const it of items) {
    const product = await sanityClient.fetch<CatalogItem | null>(catalogItemBySlugQuery, { slug: it.slug });
    if (!product) continue;
    const { finalPrice } = computePriceFromDiscounts(product);
    const priceForCart =
      typeof finalPrice === "number"
        ? finalPrice
        : typeof product.finalPriceHuf === "number"
          ? product.finalPriceHuf
          : typeof product.priceHuf === "number"
            ? product.priceHuf
            : null;
    if (priceForCart === null || priceForCart < 0 || product.invalidDiscount) continue;
    refreshed.push({
      ...it,
      name: product.name,
      brand: product.brand ?? "",
      image: product.images?.[0]?.url,
      priceHuf: priceForCart,
    });
  }
  return refreshed;
}

export async function GET() {
  const { items } = await readCart();
  const refreshed = await refreshCartItems(items);
  return writeCart(refreshed);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const slug = body?.slug as string | undefined;
  const quantity = Math.max(1, Number(body?.quantity) || 1);
  const upgrades = Array.isArray(body?.upgrades)
    ? body.upgrades
        .map((u: { label?: unknown; deltaHuf?: unknown }) => ({
          label: typeof u?.label === "string" ? u.label : "",
          deltaHuf: Number(u?.deltaHuf) || 0,
        }))
        .filter((u: { label: string; deltaHuf: number }) => u.label && Number.isFinite(u.deltaHuf))
    : [];
  if (!slug) {
    return NextResponse.json({ message: "slug required" }, { status: 400 });
  }

  const product = await sanityClient.fetch<CatalogItem | null>(catalogItemBySlugQuery, { slug });
  if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });
  const { finalPrice } = computePriceFromDiscounts(product);
  const priceForCart =
    typeof finalPrice === "number"
      ? finalPrice
      : typeof product.finalPriceHuf === "number"
        ? product.finalPriceHuf
        : typeof product.priceHuf === "number"
          ? product.priceHuf
          : null;
  if (priceForCart === null || priceForCart < 0 || product.invalidDiscount) {
    return NextResponse.json({ message: "Ár nem elérhető a termékhez" }, { status: 400 });
  }

  const { items } = await readCart();
  const idx = items.findIndex((it) => it.slug === slug);
  if (idx >= 0) {
    items[idx].quantity += quantity;
    // frissítjük az upgrade-eket, ha újak érkeztek
    if (upgrades.length) {
      items[idx].upgrades = upgrades;
    }
    items[idx].priceHuf = priceForCart;
    items[idx].name = product.name;
    items[idx].brand = product.brand ?? "";
    items[idx].image = product.images?.[0]?.url;
  } else {
    items.push({
      slug,
      name: product.name,
      brand: product.brand ?? "",
      priceHuf: priceForCart,
      quantity,
      image: product.images?.[0]?.url,
      upgrades,
    });
  }

  return writeCart(items);
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const slug = body?.slug as string | undefined;
  const quantity = Number(body?.quantity);
  if (!slug || !Number.isFinite(quantity)) {
    return NextResponse.json({ message: "slug and quantity required" }, { status: 400 });
  }

  const { items } = await readCart();
  const idx = items.findIndex((it) => it.slug === slug);
  if (idx < 0) return NextResponse.json({ message: "Not found" }, { status: 404 });

  if (quantity <= 0) {
    items.splice(idx, 1);
  } else {
    items[idx].quantity = quantity;
  }

  return writeCart(items);
}

export async function DELETE(request: Request) {
  const body = await request.json().catch(() => null);
  const slug = body?.slug as string | undefined;
  if (!slug) return NextResponse.json({ message: "slug required" }, { status: 400 });

  const { items } = await readCart();
  const next = items.filter((it) => it.slug !== slug);
  return writeCart(next);
}
