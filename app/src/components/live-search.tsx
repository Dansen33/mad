"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Result = {
  slug: string;
  name: string;
  priceHuf: number;
  finalPriceHuf?: number;
  compareAtHuf?: number;
  invalidDiscount?: boolean;
  discounts?: { type?: string; amount?: number }[];
  brand: string;
  type: "product" | "pc" | "phone";
  image?: string | null;
};

type LiveSearchProps = {
  mode?: "all" | "desktop" | "mobile";
};

export function LiveSearch({ mode = "all" }: LiveSearchProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const placeholder = useMemo(() => "Keressen termékekre, márkára, típusra...", []);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setOpen(true);
    const controller = new AbortController();
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/cms/search?q=${encodeURIComponent(query)}&limit=6`, {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        type CmsHit = {
          slug: string;
          name: string;
          priceHuf: number;
          finalPriceHuf?: number;
          compareAtHuf?: number;
          invalidDiscount?: boolean;
          discounts?: { type?: string; amount?: number }[];
          brand: string;
          _type: "product" | "pc" | "phone";
          image?: { url?: string | null };
        };
        const parsed: Result[] = (data as CmsHit[]).map((item) => ({
          slug: item.slug,
          name: item.name,
          priceHuf: item.priceHuf,
          finalPriceHuf: item.finalPriceHuf,
          compareAtHuf: item.compareAtHuf,
          invalidDiscount: item.invalidDiscount,
          discounts: item.discounts,
          brand: item.brand,
          type: item._type,
          image: item.image?.url || null,
        }));
        setResults(parsed);
      } catch {
        /* noop */
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setMobileOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keyup", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keyup", onKey);
    };
  }, []);

  const showDesktop = mode !== "mobile";
  const showMobile = mode !== "desktop";

  const computePrice = (item: Result) => {
    const base = typeof item.priceHuf === "number" ? item.priceHuf : 0;
    const discounts = Array.isArray(item.discounts) ? item.discounts : [];
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
    const computedFinal =
      typeof item.finalPriceHuf === "number" && !item.invalidDiscount
        ? item.finalPriceHuf
        : base - bestDiscount;
    const invalid = item.invalidDiscount || computedFinal < 0;
    const final = invalid ? base : Math.max(0, computedFinal);
    const compareAt =
      !invalid && bestDiscount > 0
        ? base
        : typeof item.compareAtHuf === "number" && item.compareAtHuf > final
          ? item.compareAtHuf
          : undefined;
    const hasDiscount = typeof compareAt === "number" && compareAt > final;
    return { final, compareAt, hasDiscount };
  };

  return (
    <>
      {/* Desktop / tablet search bar */}
      {showDesktop && (
        <div
          ref={containerRef}
          className="relative hidden min-w-[260px] max-w-full flex-1 items-center gap-3 rounded-full border border-border bg-card px-4 py-2 shadow-lg shadow-black/30 md:flex"
        >
          <Image src="/searchicon.svg" alt="" width={16} height={16} className="shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (query.length >= 2) setOpen(true);
            }}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
            placeholder={placeholder}
          />
          {(loading || results.length > 0) && open && (
            <div className="absolute left-0 top-full z-30 mt-2 w-full rounded-2xl border border-border bg-popover p-2 shadow-xl shadow-black/40">
              {loading && (
                <div className="px-3 py-2 text-xs text-muted-foreground">Keresés...</div>
              )}
              {!loading && results.length === 0 && (
                <div className="px-3 py-2 text-xs text-muted-foreground">Nincs találat</div>
              )}
              {!loading &&
                results.map((item) => {
                  const href =
                    item.type === "pc"
                      ? `/pc-k/${item.slug}`
                      : item.type === "phone"
                        ? `/telefonok/${item.slug}`
                        : `/termek/${item.slug}`;
                  const { final, compareAt, hasDiscount } = computePrice(item);
                  return (
                    <Link
                      key={`${item.type}-${item.slug}`}
                      href={href}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-card"
                    >
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-border bg-secondary">
                        <Image
                          src={
                            item.image ||
                            "https://dummyimage.com/200x150/0f1320/ffffff&text=WELLCOMP"
                          }
                          alt={item.name}
                          width={40}
                          height={40}
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span className="line-clamp-1 font-semibold text-foreground">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{item.brand}</span>
                        <div className="flex flex-col text-[12px] leading-tight">
                          {hasDiscount && (
                            <span className="text-muted-foreground line-through">
                              {new Intl.NumberFormat("hu-HU").format(compareAt!)} Ft
                            </span>
                          )}
                          <span className={hasDiscount ? "text-primary font-semibold" : "text-foreground"}>
                            {new Intl.NumberFormat("hu-HU").format(final)} Ft
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* Mobile search icon + overlay */}
      {showMobile && (
        <>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-lg md:hidden"
            aria-label="Keresés"
            onClick={() => {
              setMobileOpen(true);
              if (query.length >= 2) setOpen(true);
            }}
          >
            <Image src="/searchicon.svg" alt="" width={18} height={18} />
          </button>

          {mobileOpen && (
            <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => { setMobileOpen(false); setOpen(false); }}>
              <div
                className="absolute left-1/2 top-4 w-[min(560px,calc(100vw-24px))] -translate-x-1/2 rounded-2xl border border-border bg-card p-3 shadow-2xl shadow-black/40 animate-slide-down"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-2">
                  <Image src="/searchicon.svg" alt="" width={16} height={16} className="shrink-0" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                    onFocus={() => {
                      if (query.length >= 2) setOpen(true);
                    }}
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
                    placeholder={placeholder}
                  />
                </div>
                {(loading || results.length > 0) && open && (
                  <div className="mt-2 max-h-[60vh] overflow-auto rounded-2xl border border-border bg-popover p-2 shadow-xl shadow-black/40">
                    {loading && (
                      <div className="px-3 py-2 text-xs text-muted-foreground">Keresés...</div>
                    )}
                    {!loading && results.length === 0 && (
                      <div className="px-3 py-2 text-xs text-muted-foreground">Nincs találat</div>
                    )}
                    {!loading &&
                      results.map((item) => {
                        const href =
                          item.type === "pc"
                            ? `/pc-k/${item.slug}`
                            : item.type === "phone"
                              ? `/telefonok/${item.slug}`
                              : `/termek/${item.slug}`;
                        const { final, compareAt, hasDiscount } = computePrice(item);
                        return (
                          <Link
                            key={`${item.type}-${item.slug}`}
                            href={href}
                            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-card"
                            onClick={() => {
                              setMobileOpen(false);
                              setOpen(false);
                            }}
                          >
                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-border bg-secondary">
                              <Image
                                src={
                                  item.image ||
                                  "https://dummyimage.com/200x150/0f1320/ffffff&text=WELLCOMP"
                                }
                                alt={item.name}
                                width={40}
                                height={40}
                                className="object-contain"
                                unoptimized
                              />
                            </div>
                            <div className="flex flex-1 flex-col">
                              <span className="line-clamp-1 font-semibold text-foreground">
                                {item.name}
                              </span>
                              <span className="text-[11px] text-muted-foreground">{item.brand}</span>
                              <div className="flex flex-col text-[12px] leading-tight">
                                {hasDiscount && (
                                  <span className="text-muted-foreground line-through">
                                    {new Intl.NumberFormat("hu-HU").format(compareAt!)} Ft
                                  </span>
                                )}
                                <span className={hasDiscount ? "text-primary font-semibold" : "text-foreground"}>
                                  {new Intl.NumberFormat("hu-HU").format(final)} Ft
                                </span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
