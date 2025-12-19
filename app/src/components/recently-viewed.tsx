"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type RecentItem = {
  slug: string;
  name: string;
  href: string;
  image?: string | null;
  price?: number | null;
  finalPrice?: number | null;
  compareAt?: number | null;
};

const STORAGE_KEY = "recently-viewed-products";
const FALLBACK_IMG = "https://dummyimage.com/400x400/0f1320/ffffff&text=Termek";

export function RecentlyViewed({ current }: { current: RecentItem }) {
  const [items, setItems] = useState<RecentItem[]>([]);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current) return;
    if (typeof window === "undefined") return;
    hasHydrated.current = true;
    const read = (): RecentItem[] => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return [];
        const normalized = (parsed as unknown[]).map((item): RecentItem | null => {
          if (!item || typeof item !== "object") return null;
          const { slug, name, href, image, price, finalPrice, compareAt } = item as RecentItem;
          if (!slug || !name || !href) return null;
          return {
            slug,
            name,
            href,
            image: image || null,
            price: typeof price === "number" ? price : null,
            finalPrice: typeof finalPrice === "number" ? finalPrice : null,
            compareAt: typeof compareAt === "number" ? compareAt : null,
          };
        });
        return normalized.filter((v): v is RecentItem => Boolean(v && (v.price || v.finalPrice || v.compareAt)));
      } catch {
        return [];
      }
    };
    const existing = read().filter((item) => item.slug !== current.slug);
    const next = [{ ...current }, ...existing].slice(0, 12);
    const visible = next.filter((item) => item.slug !== current.slug).slice(0, 4);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(visible);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, [current]);

  if (!items.length) return null;

  const formatPrice = (value?: number | null) =>
    typeof value === "number" && Number.isFinite(value)
      ? `${new Intl.NumberFormat("hu-HU").format(value)} Ft`
      : null;

  const primaryItems = items.slice(0, 4);

  const renderCard = (item: RecentItem) => (
    <Link
      key={item.slug}
      href={item.href}
      className="group flex h-full flex-col gap-2 rounded-xl border border-border bg-secondary p-3 shadow-sm transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg"
      style={{ aspectRatio: "1 / 1" }}
    >
      <div className="flex-1 overflow-hidden rounded-lg border border-border bg-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image || FALLBACK_IMG}
          alt={item.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="min-h-0">
        <div className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
          {item.name}
        </div>
        <div className="mt-1 flex flex-wrap items-baseline gap-2 text-sm font-bold text-foreground">
          {(() => {
            const final = formatPrice(item.finalPrice ?? item.price);
            const compare = formatPrice(item.compareAt);
            if (final && compare && final !== compare) {
              return (
                <>
                  <span className="text-primary">{final}</span>
                  <span className="text-xs font-semibold text-muted-foreground line-through">{compare}</span>
                </>
              );
            }
            if (final) return <span className="text-foreground">{final}</span>;
            return <span className="text-xs text-muted-foreground">Árért érdeklődj</span>;
          })()}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30">
      <div className="mb-3">
        <div className="text-xs uppercase text-primary">Nézz vissza</div>
        <h2 className="text-lg font-bold text-foreground">Utoljára megtekintett termékek</h2>
      </div>
      {primaryItems.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
          {primaryItems.map((item) => renderCard(item))}
        </div>
      )}
    </div>
  );
}
