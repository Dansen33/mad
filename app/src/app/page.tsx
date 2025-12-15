"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

const brands = [
  "Lenovo",
  "Apple",
  "HP",
  "Dell",
  "Asus",
  "Acer",
  "MSI",
  "Microsoft",
];

const categoryParam: Record<string, string> = {
  all: "",
  general: "GENERAL",
  business: "BUSINESS",
  gaming: "GAMING",
  workstation: "WORKSTATION",
  touch: "TOUCH",
};
const categorySlug: Record<keyof typeof categoryParam, string> = {
  all: "osszes",
  general: "altalanos",
  business: "uzleti",
  gaming: "gamer",
  workstation: "workstation",
  touch: "erintokepernyos",
};
const faqs = [
  {
    q: "Milyen garanciát kapok a laptopokra?",
    a: "Alapértelmezés szerint 12 hónap, kérésre 24 hónapig bővíthető. Szervizünk saját technikusokkal dolgozik.",
  },
  {
    q: "Milyen állapotúak a gépek?",
    a: "Minden modell A vagy A- kategóriás, alapos tisztítás és diagnosztika után. Az esetleges esztétikai jeleket részletesen feltüntetjük.",
  },
  {
    q: "Lehet részletfizetés vagy céges számla?",
    a: "Igen, vállalkozói számlát állítunk ki, és elérhető Stripe fizetés, valamint lízing partnereink.",
  },
  {
    q: "Mennyi a szállítási idő?",
    a: "Raktáron lévő modellek 24-48 órán belül átadásra kerülnek, személyes átvétel budapesti átadóponton kérhető.",
  },
];

export default function Home() {
  const [activeCategory, setActiveCategory] =
    useState<keyof typeof categoryParam>("all");
  const [activeSlide, setActiveSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState<Slide[]>([]);
  const [heroLoading, setHeroLoading] = useState(true);
  const [featured, setFeatured] = useState<FeaturedProduct | null>(null);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [featuredMainImage, setFeaturedMainImage] = useState<string | null>(null);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [popularCats, setPopularCats] = useState<{ title: string; href: string; image: string }[]>([]);
  const [popularLoading, setPopularLoading] = useState(true);

  const productsQuery = useQuery<Product[]>({
    queryKey: ["products", activeCategory],
    queryFn: async () => {
      const param = categoryParam[activeCategory];
      const res = await fetch(
        `/api/cms/products?${param ? `category=${param}&` : ""}limit=6`,
      );
      if (!res.ok) throw new Error("Hiba a termékek lekérésénél");
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

  const featuredPrice = (() => {
    if (!featured) {
      return { final: undefined as number | undefined, compareAt: undefined as number | undefined, hasDiscount: false };
    }
    const base = typeof featured.priceHuf === "number" ? featured.priceHuf : 0;
    const discounts = Array.isArray(featured.discounts) ? featured.discounts : [];
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
      typeof featured.finalPriceHuf === "number" && !featured.invalidDiscount
        ? featured.finalPriceHuf
        : base - bestDiscount;
    const invalid = featured.invalidDiscount || computedFinal < 0;
    const final = invalid ? base : Math.max(0, computedFinal);
    const compareAt =
      !invalid && bestDiscount > 0
        ? base
        : typeof featured.compareAtHuf === "number" && featured.compareAtHuf > final
          ? featured.compareAtHuf
          : undefined;
    const hasDiscount = typeof compareAt === "number" && compareAt > final;
    return { final, compareAt, hasDiscount };
  })();

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
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "24-48 órás szállítás",
                  "2 év garancia felújított termékekre is",
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
                ? Array.from({ length: 4 }).map((_, i) => ({
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
                    <Link className="hover:text-primary" href={`/termek/${featured.slug}`}>
                      {featured.name}
                    </Link>
                  ) : (
                    featured?.name ?? "Kiemelt laptop"
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {featured?.description ??
                    "Kiemelt, előre bevizsgált laptop kedvező áron. Prémium állapot, gyors szállítás."}
                </p>
                <div className="text-3xl font-extrabold text-foreground">
                  {featured ? (
                    <div className="flex items-baseline gap-2">
                      {featuredPrice.hasDiscount && featuredPrice.compareAt !== undefined && (
                        <span className="text-lg font-semibold text-muted-foreground line-through">
                          {new Intl.NumberFormat("hu-HU").format(featuredPrice.compareAt)} Ft
                        </span>
                      )}
                      <span className={featuredPrice.hasDiscount ? "text-primary" : "text-foreground"}>
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
                  {["Raktáron", "12 hó garancia", "24-48h kiszállítás"].map((pill) => (
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

                  const visible = showAllSpecs ? specItems : specItems.slice(0, 8);

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
                      {specItems.length > 8 && (
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
              <h2 className="text-2xl font-extrabold">Forgalmazott márkák</h2>
              <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                Legkeresettebbek
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-4">
              {brands.map((brand) => (
                <Link
                  key={brand}
                  href={`/marka/${brand.toLowerCase()}`}
                  className="flex items-center justify-center rounded-xl border border-border bg-secondary px-3 py-4 text-sm font-semibold text-muted-foreground transition hover:border-primary/60 hover:text-foreground"
                >
                  {brand}
                </Link>
              ))}
            </div>
            <div className="flex justify-center">
              <Link
                href={`/kategoria/${categorySlug[activeCategory]}`}
                className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15"
              >
                Összes megjelenítése →
              </Link>
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
