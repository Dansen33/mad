"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";

type Slide = {
  badge: string;
  title: string;
  copy: string;
  cta: string;
  ctaUrl?: string;
  image: string;
};

type Product = {
  id?: number;
  _id?: string;
  slug: string;
  name: string;
  description?: string;
  shortDescription?: string;
  priceHuf: number;
  finalPriceHuf?: number;
  compareAtHuf?: number;
  invalidDiscount?: boolean;
  discounts?: { type?: string; amount?: number }[];
  currency?: string;
  stock?: number;
  category?: string;
  brand: string;
  tags?: string | null;
  specs?: {
    processor?: string;
    memory?: string;
    gpu?: string;
    display?: string;
    refreshRate?: number;
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
  images: { url: string; alt: string | null }[];
};

type BlogPost = {
  id: number;
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string | null;
  publishedAt: string;
  tags: string | null;
};

type FeaturedProduct = {
  _type?: string;
  id: number;
  slug: string;
  name: string;
  priceHuf: number;
  finalPriceHuf?: number;
  compareAtHuf?: number;
  invalidDiscount?: boolean;
  discounts?: { type?: string; amount?: number }[];
  brand: string;
  description: string;
  specs?: Product["specs"];
  images: { url: string; alt: string | null }[];
};

type FeaturedCarouselProduct = {
  _type?: string;
  _id?: string;
  slug: string;
  name: string;
  brand: string;
  priceHuf: number;
  finalPriceHuf?: number;
  compareAtHuf?: number;
  invalidDiscount?: boolean;
  discounts?: { type?: string; amount?: number }[];
  shortDescription?: string;
  stock?: number;
  images?: { url: string; alt?: string | null }[];
};

type Testimonial = {
  _id?: string;
  name: string;
  title?: string;
  quote: string;
  rating?: number;
  avatar?: string | null;
};

const faqs = [
  {
    q: "Milyen termékeket forgalmaztok?",
    a: "PC-ket (gamer gépek, munkaállomások, általános), laptopokat (gamer, üzleti, mindennapi) és telefonokat értékesítünk újonnan és használtan.\n• PC-k: gamer / workstation / általános\n• Laptopok: gamer / üzleti / mindennapi\n• Telefonok: új és használt",
  },
  {
    q: "Új és használt termékek is vannak? Mi a különbség köztük nálatok?",
    a: "Igen, mindkettő elérhető. Az új termékek gyári állapotúak, a használtak előélettel rendelkeznek; állapotuk (külső, akkumulátor, tartozékok) eltérhet.\n• A használt eszközök állapota típusonként változhat\n• Ha van állapotbesorolás, azt a termékoldalon kell nézni",
  },
  {
    q: "Mennyi garanciát adtok?",
    a: "Használt termékekre is 24 hónap garanciát vállalunk; a pontos feltételek és kivételek a Garancia oldalon vannak részletezve.\n• 24 hónap limitált garancia használt termékekre is\n• A kivételek és részletek a Garancia oldalon találhatók",
  },
  {
    q: "Van-e elállás / visszaküldés?",
    a: "Általában van elállási lehetőség; a pontos feltételek (határidő, állapot, visszaküldés módja) az ÁSZF / Elállás oldalon találhatók.\n• A pontos feltételek az ÁSZF / Elállás információkban vannak\n• Visszaküldésnél fontos lehet a csomagolás és tartozékok megléte",
  },
  {
    q: "Csak online működtök? Van személyes átvétel?",
    a: "Igen, 100%-ban online működünk; ha lesz személyes átvétel, azt külön jelezzük a weboldalon vagy a rendelési folyamatban.\n• Jelenleg online vásárlás, kiszállítással\n• Személyes átvétel csak akkor, ha külön fel van tüntetve",
  },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState<Slide[]>([]);
  const [heroLoading, setHeroLoading] = useState(true);
  const [featured, setFeatured] = useState<FeaturedProduct | null>(null);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [featuredMainImage, setFeaturedMainImage] = useState<string | null>(null);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [popularCats, setPopularCats] = useState<{ title: string; href: string; image: string }[]>([]);
  const [popularLoading, setPopularLoading] = useState(true);
  const featuredCarouselRef = useRef<HTMLDivElement | null>(null);
  const testimonialsRef = useRef<HTMLDivElement | null>(null);

  const featuredCarouselQuery = useQuery<FeaturedCarouselProduct[]>({
    queryKey: ["featured-carousel"],
    queryFn: async () => {
      const res = await fetch("/api/cms/featured-products", { cache: "no-cache" });
      if (!res.ok) throw new Error("Hiba a kiemelt termékek lekérésénél");
      return res.json();
    },
  });

  const blogQuery = useQuery<BlogPost[]>({
    queryKey: ["blog"],
    queryFn: async () => {
      const res = await fetch("/api/cms/blog");
      if (!res.ok) throw new Error("Hiba a blog lekérésénél");
      return res.json();
    },
  });

  useEffect(() => {
    const loadHero = async () => {
      try {
        setHeroLoading(true);
        setFeaturedLoading(true);
        const res = await fetch("/api/cms/hero", { cache: "no-cache" });
        if (!res.ok) return;
        type CmsHero = {
          heroSlides?: {
            badge?: string;
            title?: string;
            copy?: string;
            ctaLabel?: string;
            cta?: string;
            ctaUrl?: string;
            image?: { url?: string } | string;
          }[];
          featured?: {
            _type?: string;
            slug: string;
            name: string;
            priceHuf: number;
            finalPriceHuf?: number;
            compareAtHuf?: number;
            invalidDiscount?: boolean;
            discounts?: { type?: string; amount?: number }[];
            brand: string;
            shortDescription?: string;
            specs?: Product["specs"];
            images?: { url: string; alt?: string | null }[];
          };
        };
        const data: CmsHero = await res.json();
        const slides =
          (data.heroSlides ?? []).map((s) => ({
            badge: s.badge || "",
            title: s.title || "",
            copy: s.copy || "",
            cta: s.ctaLabel || s.cta || "Megnézem",
            ctaUrl: s.ctaUrl || "#",
            image: typeof s.image === "string" ? s.image : s.image?.url || "",
          })) ?? [];
        setHeroSlides(slides);
        setActiveSlide(0);
        if (data.featured) {
          const base = typeof data.featured.priceHuf === "number" ? data.featured.priceHuf : 0;
          const discounts = Array.isArray(data.featured.discounts) ? data.featured.discounts : [];
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
          const rawFinal =
            typeof data.featured.finalPriceHuf === "number" && !data.featured.invalidDiscount
              ? data.featured.finalPriceHuf
              : base - bestDiscount;
          const invalid = data.featured.invalidDiscount || rawFinal < 0;
          const final = invalid ? base : Math.max(0, rawFinal);
          const compareAt =
            !invalid && bestDiscount > 0
              ? base
              : typeof data.featured.compareAtHuf === "number" &&
                  data.featured.compareAtHuf > final
                ? data.featured.compareAtHuf
                : undefined;
          const safeImages =
            data.featured.images?.map((img) => ({
              url: img.url,
              alt: img.alt ?? data.featured?.name ?? null,
            })) ?? [];
          setFeatured({
            id: 0,
            _type: data.featured._type,
            slug: data.featured.slug,
            name: data.featured.name,
            priceHuf: data.featured.priceHuf,
            finalPriceHuf: final,
            compareAtHuf: compareAt,
            invalidDiscount: invalid,
            discounts: data.featured.discounts,
            brand: data.featured.brand,
            description: data.featured.shortDescription || "",
            specs: data.featured.specs,
            images: safeImages,
          });
        }
      } finally {
        setFeaturedLoading(false);
        setHeroLoading(false);
      }
    };
    loadHero();
  }, []);

  useEffect(() => {
    const loadPopular = async () => {
      try {
        setPopularLoading(true);
        const res = await fetch("/api/cms/popular-categories", { cache: "no-store" });
        if (!res.ok) throw new Error("fail");
        const data = await res.json();
        const items = Array.isArray(data?.items) ? data.items : [];
        setPopularCats(items);
      } catch {
        setPopularCats([]);
      } finally {
        setPopularLoading(false);
      }
    };
    loadPopular();
  }, []);

  useEffect(() => {
    if (!heroSlides.length) return;
    const slidesCount = heroSlides.length;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slidesCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    if (featured?.images?.[0]?.url) {
      setFeaturedMainImage(featured.images[0].url);
    } else {
      setFeaturedMainImage("https://dummyimage.com/900x900/0f1320/ffffff&text=Kiemelt+ajanlat");
    }
    setShowAllSpecs(false);
  }, [featured]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    update(mq);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const featuredPrice = (() => {
    if (!featured) {
      return { final: undefined as number | undefined, compareAt: undefined as number | undefined, hasDiscount: false };
    }
    return computePriceDisplay(featured);
  })();

  const featuredCarouselSlides = useMemo(() => featuredCarouselQuery.data ?? [], [featuredCarouselQuery.data]);
  const featuredCarouselItems: (FeaturedCarouselProduct | null)[] =
    featuredCarouselSlides.length
      ? featuredCarouselSlides
      : featuredCarouselQuery.isLoading
        ? Array.from({ length: 6 }, () => null as FeaturedCarouselProduct | null)
        : [];

  const testimonialsQuery = useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const res = await fetch("/api/cms/testimonials", { cache: "no-store" });
      if (!res.ok) throw new Error("Hiba a vélemények lekérésénél");
      const data = await res.json();
      return data?.testimonials ?? [];
    },
  });

  function computePriceDisplay(item?: {
    priceHuf?: number;
    finalPriceHuf?: number;
    compareAtHuf?: number;
    invalidDiscount?: boolean;
    discounts?: { type?: string; amount?: number }[];
  }) {
    const base = typeof item?.priceHuf === "number" ? item.priceHuf : 0;
    if (!item) return { final: base, compareAt: undefined as number | undefined, hasDiscount: false };

    const discountedByRules = (() => {
      const discounts = Array.isArray(item.discounts) ? item.discounts : [];
      if (!discounts.length) return base;
      const best =
        discounts
          .map((d) => {
            if (!d || typeof d.amount !== "number") return 0;
            if (d.type === "percent") return Math.round(base * d.amount * 0.01);
            if (d.type === "fixed") return d.amount;
            return 0;
          })
          .filter((v) => v > 0)
          .sort((a, b) => b - a)[0] ?? 0;
      const candidate = base - best;
      return candidate >= 0 ? candidate : base;
    })();

    const candidateFinals = [
      base,
      discountedByRules,
      item.invalidDiscount === true ? base : item.finalPriceHuf,
    ].filter((v): v is number => typeof v === "number" && Number.isFinite(v));

    const final = Math.max(0, Math.min(...candidateFinals));

    const rawCompare =
      typeof item.compareAtHuf === "number" && item.compareAtHuf > 0 ? item.compareAtHuf : base;

    const hasDiscount = final < rawCompare;
    const compareAt = hasDiscount ? rawCompare : undefined;

    return { final, compareAt, hasDiscount };
  }

  const scrollFeaturedCarousel = (direction: "prev" | "next") => {
    const el = featuredCarouselRef.current;
    if (!el) return;
    const amount = el.clientWidth;
    el.scrollBy({ left: direction === "next" ? amount : -amount, behavior: "smooth" });
  };

  const scrollTestimonials = (direction: "prev" | "next") => {
    const el = testimonialsRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "next" ? amount : -amount, behavior: "smooth" });
  };

  const productHref = (item?: { slug?: string; _type?: string }) => {
    if (!item?.slug) return "#";
    const t = (item._type || "").toLowerCase();
    if (t === "pc") return `/pc-k/${item.slug}`;
    if (t === "phone") return `/telefonok/${item.slug}`;
    return `/termek/${item.slug}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProductHeader />
      <div className="mx-auto flex max-w-7xl flex-col px-8 pb-16">

        <main className="space-y-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-stretch">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/15 via-transparent to-transparent p-8 shadow-2xl shadow-black/40">
              <div className="inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                Gondosan válogatott
              </div>
              <h1 className="mt-3 text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
                Tökéletességre törekszünk:
              </h1>
              <h2 className="mt-1 text-2xl font-bold leading-tight text-foreground md:text-3xl"> minden termékünkön több mint 30 tesztet végzünk el átadás előtt!</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Minden gépet diagnosztikával, garanciával és prémium
                csomagolással adunk át. Vállalkozásoknak és magánszemélyeknek
                egyaránt.
              </p>
              <div className="mt-4 -mx-4 flex flex-wrap gap-2">
                {[
                  "24-48 órás szállítás",
                  "2 év limitált garancia felújított termékekre",
                  "Kiváló minőségű termékek",
                ].map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold"
                  >
                    {pill}
                  </span>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: "Készlet", value: "100+ modell", sub: "Folyamatosan frissítve" },
                  { label: "Átlag értékelés", value: "4.9 / 5", sub: "Ügyfélelégedettség" },
                  { label: "Szerviz", value: "30+ teszt", sub: "Átadás előtt" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <div className="text-xs uppercase tracking-wide text-primary">
                      {item.label}
                    </div>
                    <div className="text-xl font-extrabold text-foreground">
                      {item.value}
                    </div>
                    <div className="text-xs text-muted-foreground">{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/40">
              {heroLoading ? (
                <div className="flex flex-col gap-4 p-6">
                  <div className="aspect-[16/7] w-full rounded-xl bg-secondary" />
                  <div className="space-y-3">
                    <div className="h-5 w-24 rounded-full bg-secondary" />
                    <div className="h-6 w-2/3 rounded bg-secondary" />
                    <div className="h-4 w-11/12 rounded bg-secondary" />
                    <div className="h-4 w-10/12 rounded bg-secondary" />
                    <div className="h-10 w-32 rounded-full bg-secondary" />
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                  >
                    {heroSlides.map((slide) => (
                      <div
                        key={slide.title}
                        className="flex min-w-full flex-col gap-4 p-6"
                      >
                        <div className="relative w-full overflow-hidden rounded-2xl border border-border">
                          <div className="aspect-[16/7]" />
                          <Image
                            fill
                            src={
                              slide.image ||
                              "https://dummyimage.com/900x600/0f1320/ffffff&text=wellcomp"
                            }
                            alt={slide.title}
                            className="h-full w-full object-cover"
                            sizes="(min-width: 1024px) 100vw, 100vw"
                            priority
                            unoptimized
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                            {slide.badge}
                          </div>
                          <h2 className="text-2xl font-bold text-foreground">
                            {slide.title}
                          </h2>
                          <p className="text-sm text-muted-foreground">{slide.copy}</p>
                          <div className="pt-2">
                            {slide.ctaUrl ? (
                              slide.ctaUrl.startsWith("http") ? (
                                <a
                                  href={slide.ctaUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30"
                                >
                                  {slide.cta}
                                </a>
                              ) : (
                                <Link
                                  href={slide.ctaUrl}
                                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30"
                                >
                                  {slide.cta}
                                </Link>
                              )
                            ) : (
                              <button className="rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30">
                                {slide.cta}
                              </button>
                            )}
            </div>
          </div>
        </div>

                    ))}
                  </div>
                  {heroSlides.length > 1 && (
                    <div className="flex items-center justify-end gap-2 px-4 pb-4">
                      {heroSlides.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveSlide(idx)}
                          className={`h-2.5 w-2.5 rounded-full border transition ${
                            idx === activeSlide
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/40"
                          }`}
                          aria-label={`Ugrás a ${idx + 1}. slide-ra`}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        {/* Legnépszerűbb kategóriáink */}
        <section className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-lg shadow-black/20">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold text-foreground">Legnépszerűbb kategóriáink</h2>
            <p className="text-sm text-muted-foreground">
              Válogass a legkedveltebb gamer és üzleti gépek közül.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(popularCats.length
              ? popularCats
              : popularLoading
                ? Array.from({ length: 4 }).map(() => ({
                    title: "",
                    href: "#",
                    image: "https://dummyimage.com/300x300/e5e7eb/0c0f14&text=Bet%C3%B6lt%C3%A9s...",
                  }))
                : []
            ).map((item, idx) => (
              <Link
                key={`${item.href}-${idx}`}
                href={item.href}
                className="group block overflow-hidden rounded-xl border border-border bg-secondary transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg"
              >
                <div className="relative aspect-square w-full">
                  <Image
                    fill
                    src={
                      item.image ||
                      "https://dummyimage.com/300x300/e5e7eb/0c0f14&text=K%C3%A9p"
                    }
                    alt={item.title || "Kategória"}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    unoptimized
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>

                      {/* Kiemelt termékek carousel (Sanity vezérelt) */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-lg shadow-black/20">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-foreground">Kiemelt termékek</h2>
                <p className="text-sm text-muted-foreground">
                  A mi kedvenceink, amiket neked is ajánlunk
                </p>
              </div>
            </div>

            <div className="relative">
              <div
                ref={featuredCarouselRef}
                className="flex gap-4 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory"
              >
                {featuredCarouselItems.map((product, idx) => {
                  const { final: finalPrice, compareAt } = computePriceDisplay(product ?? undefined);

                  return (
                    <div
                      key={product?._id ?? `skel-${idx}`}
                      className="flex min-h-[360px] min-w-[calc(50vw-18px)] flex-col overflow-hidden rounded-xl border border-border bg-secondary snap-start sm:min-w-[260px] lg:min-w-[220px]"
                    >
                      <div className="relative aspect-[3/2] w-full">
                        {product ? (
                          <Image
                            fill
                            src={
                              product.images?.[0]?.url ||
                              "https://dummyimage.com/600x400/e5e7eb/0c0f14&text=Kep"
                            }
                            alt={product.images?.[0]?.alt || product.name}
                            className="object-cover"
                            sizes="(min-width: 1024px) 20vw, 50vw"
                            unoptimized
                          />
                        ) : (
                          <div className="h-full w-full animate-pulse bg-muted" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-2 p-3">
                        <div className="text-xs font-semibold uppercase tracking-wide text-primary">
                          {product?.brand ?? "Betöltés..."}
                        </div>
                        <h3 className="line-clamp-2 text-sm font-bold text-foreground">
                          {product ? (
                            <Link href={productHref(product)} className="hover:text-primary">
                              {product.name}
                            </Link>
                          ) : (
                            <span className="block h-4 w-3/4 animate-pulse rounded bg-muted" />
                          )}
                        </h3>
                        <div className="flex flex-col items-start gap-1 text-lg font-extrabold">
                          {product ? (
                            <>
                              {typeof compareAt === "number" && compareAt > finalPrice && (
                                <span className="text-xs font-semibold text-foreground line-through">
                                  {new Intl.NumberFormat("hu-HU").format(compareAt)} Ft
                                </span>
                              )}
                              <span
                                className={
                                  typeof compareAt === "number" && compareAt > finalPrice
                                    ? "text-green-600 pl-2"
                                    : "text-foreground"
                                }
                              >
                                {new Intl.NumberFormat("hu-HU").format(finalPrice)} Ft
                              </span>
                            </>
                          ) : (
                            <span className="block h-4 w-16 animate-pulse rounded bg-muted" />
                          )}
                        </div>
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {product?.shortDescription ?? "—"}
                        </p>
                        <div className="mt-auto">
                          {product ? (
                            <Link
                              href={productHref(product)}
                              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-3 py-2 text-sm font-semibold text-[#0c0f14] shadow-lg shadow-primary/30 transition duration-150 hover:brightness-95"
                            >
                              Megnézem
                            </Link>
                          ) : (
                            <div className="h-9 w-full animate-pulse rounded-full bg-muted" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {featuredCarouselSlides.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => scrollFeaturedCarousel("prev")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/90 text-xl font-bold shadow hover:border-primary"
                    aria-label="Előző termékcsoport"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollFeaturedCarousel("next")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/90 text-xl font-bold shadow hover:border-primary"
                    aria-label="Következő termékcsoport"
                  >
                    ›
                  </button>
                </>
              )}
              {!featuredCarouselSlides.length && !featuredCarouselQuery.isLoading && (
                <div className="flex items-center justify-center rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                  Nincs még beállítva kiemelt termék a Sanity-ben.
                </div>
              )}
            </div>
          </section>

              <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold">Rólunk mondták</h2>
            </div>
            <div className="relative">
              <div
                ref={testimonialsRef}
                className="flex gap-4 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory"
              >
                {testimonialsQuery.isLoading &&
                  Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={`testimonial-skel-${idx}`}
                      className="flex h-[210px] min-w-[82%] max-w-[90%] animate-pulse flex-col gap-3 rounded-xl border border-border bg-card p-4 snap-start sm:min-w-[60%] md:min-w-[48%] lg:min-w-[32%]"
                    >
                      <div className="h-4 w-1/3 rounded bg-secondary" />
                      <div className="h-4 w-2/3 rounded bg-secondary" />
                      <div className="h-3 w-full rounded bg-secondary" />
                      <div className="h-3 w-5/6 rounded bg-secondary" />
                    </div>
                  ))}

                {testimonialsQuery.error && (
                  <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-200">
                    Nem sikerült betölteni a véleményeket.
                  </div>
                )}

                {!testimonialsQuery.isLoading &&
                  (testimonialsQuery.data ?? []).map((item) => (
                    <div
                      key={item._id || item.name}
                      className="flex h-[210px] min-w-[82%] max-w-[90%] flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-lg shadow-black/30 snap-start sm:min-w-[60%] md:min-w-[48%] lg:min-w-[32%]"
                    >
                      <div className="flex items-center gap-3">
                        {item.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className="h-10 w-10 rounded-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                            {item.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-bold text-foreground">{item.name}</div>
                          {item.title && (
                            <div className="text-xs text-muted-foreground">{item.title}</div>
                          )}
                        </div>
                      </div>
                      {typeof item.rating === "number" && item.rating > 0 && (
                        <div className="text-sm text-primary">
                          {"★".repeat(Math.min(5, Math.max(1, Math.round(item.rating))))}
                          {"☆".repeat(Math.max(0, 5 - Math.min(5, Math.max(1, Math.round(item.rating)))))}
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">“{item.quote}”</p>
                    </div>
                  ))}
              </div>
              {(testimonialsQuery.data?.length ?? 0) > 0 && (
                <>
                  <button
                    type="button"
                    onClick={() => scrollTestimonials("prev")}
                    className="absolute left-0 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 px-3 py-2 text-lg font-bold opacity-50 shadow hover:border-primary hover:opacity-100 md:flex"
                    aria-label="Előző vélemény"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTestimonials("next")}
                    className="absolute right-0 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 px-3 py-2 text-lg font-bold opacity-50 shadow hover:border-primary hover:opacity-100 md:flex"
                    aria-label="Következő vélemény"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </section>


          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold">Kiemelt ajánlatunk</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 rounded-2xl border border-border bg-card p-5 shadow-2xl shadow-black/30 md:grid-cols-[1.05fr_1fr]">
              <div className="flex flex-col gap-3">
                <div className="relative overflow-hidden rounded-xl border border-border min-h-[540px] max-h-[820px] bg-card">
                  <Image
                    fill
                    src={
                      featuredMainImage ||
                      "https://dummyimage.com/900x900/0f1320/ffffff&text=Kiemelt+ajanlat"
                    }
                    alt={featured?.name || "Kiemelt ajánlatunk"}
                    className="h-full w-full object-cover object-bottom"
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    unoptimized
                  />
                </div>
                <div className="mt-3 flex gap-3">
                  {(featured?.images?.length ? featured.images : []).map((img) => (
                    <button
                      key={img.url}
                      onClick={() => setFeaturedMainImage(img.url)}
                      className={`overflow-hidden rounded-lg border ${
                        featuredMainImage === img.url ? "border-primary" : "border-border"
                      }`}
                      >
                      <div className="relative h-16 w-24">
                        <Image
                          fill
                          src={img.url}
                          alt={img.alt || featured?.name || "thumb"}
                          className="object-cover"
                          sizes="96px"
                          unoptimized
                        />
                      </div>
                    </button>
                  ))}
                  {(!featured?.images?.length || featuredLoading) && (
                    <div className="flex h-16 w-24 items-center justify-center rounded-lg border border-border bg-secondary text-[10px] text-muted-foreground">
                      {featuredLoading ? "Betöltés..." : "Nincs több kép"}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {featuredLoading && (
                  <div className="space-y-3">
                    <div className="h-4 w-2/3 rounded bg-secondary" />
                    <div className="h-3 w-full rounded bg-secondary" />
                    <div className="h-3 w-5/6 rounded bg-secondary" />
                  </div>
                )}
                <div className="inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                  {featured?.brand ?? "Kiemelt"} • A hét kiemelt ajánlata
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {featured?.slug ? (
                    <Link className="hover:text-primary" href={productHref(featured)}>
                      {featured.name}
                    </Link>
                  ) : (
                    featured?.name ?? ""
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {featured?.description ??
                    ""}
                </p>
                <div className="text-3xl font-extrabold text-foreground">
              {featured ? (
                <div className="flex flex-col items-start gap-1">
                  {featuredPrice.hasDiscount && featuredPrice.compareAt !== undefined && (
                    <span className="text-lg font-semibold text-foreground line-through">
                      {new Intl.NumberFormat("hu-HU").format(featuredPrice.compareAt)} Ft
                    </span>
                  )}
                  <span
                    className={
                      featuredPrice.hasDiscount
                        ? "text-green-600 pl-2"
                        : "text-foreground"
                    }
                  >
                    {new Intl.NumberFormat("hu-HU").format(
                      featuredPrice.final ?? featured?.priceHuf ?? 0,
                    )}{" "}
                    Ft
                  </span>
                    </div>
                  ) : (
                    "—"
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Raktáron", "24 hó garancia", "24-48h kiszállítás"].map((pill) => (
                    <span
                      key={pill}
                      className="rounded-full border border-border bg-secondary px-3 py-2 text-xs font-semibold"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex-1 min-w-[160px]">
                    <AddToCartButton
                      productSlug={featured?.slug ?? ""}
                      productName={featured?.name ?? "Kiemelt laptop"}
                    />
                  </div>
                </div>
                {(() => {
                  const specItems = [
                    { label: "Processzor", value: featured?.specs?.processor },
                    { label: "Memória", value: featured?.specs?.memory },
                    { label: "Grafikus vezérlő (GPU)", value: featured?.specs?.gpu },
                    { label: "Kijelző", value: featured?.specs?.display },
                    {
                      label: "Képfrissítés",
                      value:
                        featured?.specs?.refreshRate !== undefined &&
                        featured?.specs?.refreshRate !== null
                          ? `${featured.specs.refreshRate} Hz`
                          : undefined,
                    },
                    { label: "Háttértár", value: featured?.specs?.storage },
                    { label: "Operációs rendszer", value: featured?.specs?.os },
                    { label: "LAN Típus", value: featured?.specs?.lan },
                    { label: "Wi-Fi", value: featured?.specs?.wifi },
                    { label: "Bluetooth", value: featured?.specs?.bluetooth },
                    { label: "HDMI", value: featured?.specs?.hdmi },
                    { label: "USB 2.0", value: featured?.specs?.usb2 },
                    { label: "USB 3.0", value: featured?.specs?.usb3 },
                    { label: "USB 3.1", value: featured?.specs?.usb31 },
                    { label: "Type C", value: featured?.specs?.typec },
                    { label: "Optikai meghajtó", value: featured?.specs?.optical },
                    { label: "Billentyűzet", value: featured?.specs?.keyboard },
                    { label: "Audio", value: featured?.specs?.audio },
                    { label: "Webkamera", value: featured?.specs?.webcam },
                    { label: "Akkumulátor", value: featured?.specs?.battery },
                    { label: "Extrák", value: featured?.specs?.extras },
                    { label: "További extrák", value: featured?.specs?.moreExtras },
                    { label: "Méret", value: featured?.specs?.size },
                    { label: "Súly", value: featured?.specs?.weight },
                    { label: "Garancia", value: featured?.specs?.warranty },
                  ].filter((item) => item.value);

                  const maxVisible = showAllSpecs ? specItems.length : isMobile ? 4 : 8;
                  const visible = specItems.slice(0, maxVisible);

                  return (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {visible.map((spec) => (
                          <div
                            key={spec.label}
                            className="rounded-xl border border-border bg-secondary p-3"
                          >
                            <div className="text-xs uppercase tracking-wide text-primary">
                              {spec.label}
                            </div>
                            <div className="text-sm font-semibold text-foreground">
                              {spec.value}
                            </div>
                          </div>
                        ))}
                      </div>
                      {specItems.length > (isMobile ? 4 : 8) && (
                        <button
                          type="button"
                          onClick={() => setShowAllSpecs((prev) => !prev)}
                          className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
                        >
                          {showAllSpecs ? "Kevesebb adat" : "További specifikációk"}
                          <span className="text-xs">
                            {showAllSpecs ? "▲" : "▼"}
                          </span>
                        </button>
                      )}
                    </div>
                  );
                })()}

              </div>
            </div>
          </section>

      
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold">Utolsó blogbejegyzések</h2>
              <Link className="text-sm text-primary hover:underline" href="/blog">
                Összes bejegyzés
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {blogQuery.isLoading &&
                Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={`blog-skel-${idx}`}
                    className="flex animate-pulse flex-col gap-3 rounded-xl border border-border bg-card p-4"
                  >
                    <div className="h-4 w-1/2 rounded bg-secondary" />
                    <div className="h-4 w-3/4 rounded bg-secondary" />
                    <div className="h-3 w-full rounded bg-secondary" />
                  </div>
                ))}

              {blogQuery.error && (
                <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-200">
                  Nem sikerült betölteni a blogcikkeket.
                </div>
              )}

              {!blogQuery.isLoading &&
                (blogQuery.data ?? []).map((post) => (
                  <div
                    key={post.slug || post._id || post.title}
                    className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-lg shadow-black/30"
                  >
                    <span className="w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                      {post.tags && post.tags.length ? post.tags[0] : "Blog"}
                    </span>
                    <h3 className="text-lg font-bold text-foreground">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                    <Link
                      className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-secondary px-3 py-2 text-xs font-semibold text-foreground hover:border-primary/60"
                      href={`/blog/${post.slug}`}
                    >
                      Olvasás
                    </Link>
                  </div>
                ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-extrabold">GYIK</h2>
            <div className="grid gap-3">
              {faqs.map((item) => (
                <details
                  key={item.q}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <summary className="cursor-pointer text-sm font-semibold text-foreground">
                    {item.q}
                  </summary>
                  <p className="pt-2 text-sm text-muted-foreground whitespace-pre-line">
                    {item.a}
                  </p>
                  <div className="mt-2 text-sm text-muted-foreground">
                    
                  </div>
                </details>
              ))}
              <Link href="/gyik">
                <button className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white cursor-pointer hover:bg-primary/80">
                  Összes megjelenítése
                </button>
              </Link>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
