"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type CartItem = {
  slug: string;
  name: string;
  brand: string;
  image?: string | null;
  quantity: number;
  priceHuf: number;
  upgrades?: { label: string; deltaHuf: number }[];
};

type Props = {
  initialItems: CartItem[];
};

export function CartClient({ initialItems }: Props) {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  const upgradeSum = (item: CartItem) => (item.upgrades ?? []).reduce((s, u) => s + u.deltaHuf, 0);
  const lineTotal = (item: CartItem) => (item.priceHuf + upgradeSum(item)) * item.quantity;

  const totalHuf = useMemo(() => items.reduce((sum, item) => sum + lineTotal(item), 0), [items]);

  const updateQuantity = async (slug: string, quantity: number) => {
    setLoadingSlug(slug);
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, quantity }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.items);
      window.dispatchEvent(
        new CustomEvent("cart-updated", { detail: { totalHuf: data.totalHuf, items: data.items } }),
      );
      if (typeof window !== "undefined" && typeof data.totalHuf === "number") {
        window.localStorage.setItem("cart-total-huf", String(data.totalHuf));
      }
    } finally {
      setLoadingSlug(null);
    }
  };

  const removeItem = async (slug: string) => {
    setLoadingSlug(slug);
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.items);
      window.dispatchEvent(
        new CustomEvent("cart-updated", { detail: { totalHuf: data.totalHuf, items: data.items } }),
      );
      if (typeof window !== "undefined" && typeof data.totalHuf === "number") {
        window.localStorage.setItem("cart-total-huf", String(data.totalHuf));
      }
    } finally {
      setLoadingSlug(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground text-center shadow-lg shadow-black/30">
        Üres a kosár. Válogass az{" "}
        <Link className="text-primary font-semibold" href="/laptopok/osszes">
          összes laptop
        </Link>{" "}
        között!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.slug}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30 md:flex-row md:items-center"
          >
            <Link
              href={`/termek/${item.slug}`}
              className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary"
            >
              <Image
                src={
                  item.image ||
                  "https://dummyimage.com/300x200/0f1320/ffffff&text=WELLCOMP"
                }
                alt={item.name}
                width={96}
                height={96}
                className="h-full w-full object-contain"
                unoptimized
              />
            </Link>
            <div className="flex flex-1 flex-col gap-2">
                <Link
                  href={`/termek/${item.slug}`}
                  className="text-base font-semibold hover:text-primary"
                >
                  {item.name}
                </Link>
                <div className="text-xs uppercase text-muted-foreground">{item.brand}</div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-lg font-bold">
                    {new Intl.NumberFormat("hu-HU").format(item.priceHuf + upgradeSum(item))} Ft
                  </div>
                  {item.upgrades && item.upgrades.length > 0 && (
                    <div className="flex flex-col text-[11px] text-muted-foreground">
                      <span>Alapár: {new Intl.NumberFormat("hu-HU").format(item.priceHuf)} Ft</span>
                      {item.upgrades.map((u) => (
                        <span key={u.label}>
                          {u.label} ({new Intl.NumberFormat("hu-HU").format(u.deltaHuf)} Ft)
                        </span>
                      ))}
                    </div>
                  )}
                <div className="flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-sm">
                  <button
                    onClick={() => updateQuantity(item.slug, Math.max(0, item.quantity - 1))}
                    disabled={loadingSlug === item.slug}
                    className="px-1 text-lg leading-none disabled:opacity-50"
                    aria-label="Kevesebb"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                    disabled={loadingSlug === item.slug}
                    className="px-1 text-lg leading-none disabled:opacity-50"
                    aria-label="Több"
                  >
                    +
                  </button>
                </div>
                </div>
              </div>
            <div className="flex items-center gap-3 md:flex-col md:items-end">
              <div className="text-sm text-muted-foreground">
                Összesen:{" "}
                <span className="font-semibold text-foreground">
                  {new Intl.NumberFormat("hu-HU").format(lineTotal(item))} Ft
                </span>
              </div>
              <button
                onClick={() => removeItem(item.slug)}
                disabled={loadingSlug === item.slug}
                className="text-sm font-semibold text-red-400 hover:text-red-300 disabled:opacity-50"
              >
                Eltávolítás
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="lg:sticky lg:top-24 rounded-2xl border border-border bg-card p-5 shadow-xl shadow-black/30">
        <h2 className="mb-3 text-lg font-extrabold">Összegzés</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Részösszeg</span>
            <span className="font-semibold text-foreground">
              {new Intl.NumberFormat("hu-HU").format(totalHuf)} Ft
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Szállítás</span>
            <span className="text-xs uppercase">Pénztárban</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Kedvezmény</span>
            <span className="text-xs uppercase">Opció a pénztárban</span>
          </div>
        </div>
        <div className="mt-4 h-px w-full bg-border" />
        <div className="mt-3 flex items-center justify-between text-base font-bold">
          <span>Végösszeg</span>
          <span>{new Intl.NumberFormat("hu-HU").format(totalHuf)} Ft</span>
        </div>
        <div className="mt-6 space-y-2">
          <Link
            href="/penztar"
            className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30"
          >
            Tovább a pénztárhoz
          </Link>
          <Link
            href="/laptopok/osszes"
            className="inline-flex w-full items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/60"
          >
            Még válogatok
          </Link>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          A fizetés és szállítás adatai a pénztárban adhatók meg. Kártyás és átutalásos fizetés
          elérhető.
        </p>
      </div>
    </div>
  );
}
