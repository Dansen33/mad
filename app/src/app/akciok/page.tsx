import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";
import { FilterForm } from "./filter-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SaleHit = {
  _id?: string;
  _type: "product" | "pc" | "phone" | "console";
  slug: string;
  name: string;
  brand?: string;
  platform?: string;
  model?: string;
  priceHuf?: number;
  compareAtHuf?: number;
  finalPriceHuf?: number;
  discountHuf?: number;
  invalidDiscount?: boolean;
  discounts?: { type?: string; amount?: number }[];
  final?: number;
  compareAt?: number;
  hasDiscount?: boolean;
  images?: { url: string; alt?: string | null }[];
  specs?: {
    processor?: string;
    cpu?: string;
    memory?: string;
    gpu?: string;
    storage?: string;
    display?: string;
    soc?: string;
  };
};

function formatPrice(value?: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "Árért érdeklődj";
  return `${new Intl.NumberFormat("hu-HU").format(value)} Ft`;
}

export default async function AkciokPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const qs = (await searchParams) ?? {};
  const rawSort = typeof qs.sort === "string" ? qs.sort : "latest";
  const sort = rawSort === "default" ? "latest" : rawSort;
  const brand = typeof qs.brand === "string" ? qs.brand : "";
  const type = typeof qs.type === "string" ? qs.type : "";
  const soc = typeof qs.soc === "string" ? qs.soc : "";
  const cpu = typeof qs.cpu === "string" ? qs.cpu : "";
  const memory = typeof qs.memory === "string" ? qs.memory : "";
  const gpu = typeof qs.gpu === "string" ? qs.gpu : "";
  const storage = typeof qs.storage === "string" ? qs.storage : "";
  const display = typeof qs.display === "string" ? qs.display : "";
  const priceMax = typeof qs.priceMax === "string" ? Number(qs.priceMax) : undefined;
  const page =
    typeof qs.page === "string" && Number.isFinite(Number(qs.page)) && Number(qs.page) > 0
      ? Number(qs.page)
      : 1;
  const pageSize = 9;

  // Az aktív kedvezményekben megadott érintett termékek lekérése
  const items: SaleHit[] = await sanityClient.fetch(
    `*[_type=="discount" && active==true && (!defined(startsAt) || startsAt <= now()) && (!defined(endsAt) || endsAt >= now())].products[]->{
      _id,
      _type,
      name,
      "slug": slug.current,
      brand,
      platform,
      model,
      priceHuf,
      "images": images[]{ "url": asset->url, alt },
      specs{
        processor,
        cpu,
        memory,
        gpu,
        storage,
        display,
        soc
      },
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
    }|order(_createdAt desc)`,
  );

  const discounted = items.map((item) => {
    const basePrice = typeof item.priceHuf === "number" ? item.priceHuf : undefined;
    const discounts = Array.isArray(item.discounts) ? item.discounts : [];
    const bestDiscount =
      basePrice && discounts.length
        ? discounts
            .map((d) => {
              if (!d || typeof d.amount !== "number") return 0;
              if (d.type === "percent") return Math.round(basePrice * d.amount * 0.01);
              if (d.type === "fixed") return d.amount;
              return 0;
            })
            .filter((v) => v > 0)
            .sort((a, b) => b - a)[0] ?? 0
        : Math.max(0, Number(item.discountHuf) || 0);

    const computedFinal = typeof basePrice === "number" ? basePrice - bestDiscount : undefined;
    const invalidDiscount =
      (typeof computedFinal === "number" && computedFinal < 0) || item.invalidDiscount || false;
    const final =
      !invalidDiscount && typeof computedFinal === "number"
        ? computedFinal
        : typeof item.finalPriceHuf === "number"
          ? item.finalPriceHuf
          : basePrice ?? 0;

    const compareAt =
      !invalidDiscount && typeof final === "number" && bestDiscount > 0 && typeof basePrice === "number"
        ? basePrice
        : typeof item.compareAtHuf === "number" && typeof final === "number" && item.compareAtHuf > final
          ? item.compareAtHuf
          : undefined;
    const hasDiscount = compareAt !== undefined && typeof final === "number" && compareAt > final;

    return { ...item, final, compareAt, hasDiscount };
  });

  const discountedOnly = discounted.filter((item) => item.hasDiscount);

  const filtered = discountedOnly.filter((item) => {
    if (type && item._type !== type) return false;
    if (brand && item.brand && item.brand.toLowerCase() !== brand.toLowerCase()) return false;
    const specs = item.specs || {};
    if (type === "phone") {
      if (soc && specs.soc && specs.soc.toLowerCase() !== soc.toLowerCase()) return false;
      if (memory && specs.memory && specs.memory.toLowerCase() !== memory.toLowerCase()) return false;
      if (storage && specs.storage && specs.storage.toLowerCase() !== storage.toLowerCase()) return false;
      if (display && specs.display && specs.display.toLowerCase() !== display.toLowerCase()) return false;
    } else {
      const processor = specs.processor || specs.cpu;
      if (cpu && processor && processor.toLowerCase() !== cpu.toLowerCase()) return false;
      if (memory && specs.memory && specs.memory.toLowerCase() !== memory.toLowerCase()) return false;
      if (gpu && specs.gpu && specs.gpu.toLowerCase() !== gpu.toLowerCase()) return false;
      if (storage && specs.storage && specs.storage.toLowerCase() !== storage.toLowerCase()) return false;
      if (display && specs.display && specs.display.toLowerCase() !== display.toLowerCase()) return false;
    }
    if (typeof priceMax === "number" && Number.isFinite(priceMax) && item.final > priceMax) return false;
    return true;
  });

  const sorted =
    sort === "price-asc"
      ? filtered.slice().sort((a, b) => a.final - b.final)
      : sort === "price-desc"
        ? filtered.slice().sort((a, b) => b.final - a.final)
        : filtered;

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const pageItems = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const collect = (arr: SaleHit[], pick: (x: SaleHit) => string | undefined) => {
    return Array.from(
      new Set(
        arr
          .map(pick)
          .filter((v): v is string => typeof v === "string" && v.trim().length > 0),
      ),
    ).sort((a, b) => a.localeCompare(b, "hu", { sensitivity: "base" }));
  };

  const buildFacets = (source: SaleHit[]) => {
    const brands = collect(source, (x) => x.brand);
    const socs = collect(source, (x) => x.specs?.soc);
    const cpus = collect(source, (x) => x.specs?.processor || x.specs?.cpu);
    const memories = collect(source, (x) => x.specs?.memory);
    const gpus = collect(source, (x) => x.specs?.gpu);
    const storages = collect(source, (x) => x.specs?.storage);
    const displays = collect(source, (x) => x.specs?.display || x.specs?.soc);
    const priceValues = source.map((x) => x.final).filter((v): v is number => typeof v === "number");
    const ceilPrice = priceValues.length ? Math.max(...(priceValues as number[])) : 0;
    return { brands, socs, cpus, memories, gpus, storages, displays, ceilPrice };
  };

  const facets = {
    all: buildFacets(discountedOnly),
    product: buildFacets(discountedOnly.filter((x) => x._type === "product")),
    pc: buildFacets(discountedOnly.filter((x) => x._type === "pc")),
    phone: buildFacets(discountedOnly.filter((x) => x._type === "phone")),
    console: buildFacets(discountedOnly.filter((x) => x._type === "console")),
  };

  const filterKey = [sort, brand, type, soc, cpu, memory, gpu, storage, display, priceMax ?? ""].join("|");

  const resolveHref = (item: SaleHit) => {
    if (item._type === "pc") return `/pc-k/${item.slug}`;
    if (item._type === "phone") return `/telefonok/${item.slug}`;
    if (item._type === "console") return `/konzolok/${item.slug}`;
    return `/termek/${item.slug}`;
  };

  const buildPageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    const append = (key: string, value?: string | number) => {
      if (value === undefined || value === "" || value === null) return;
      params.set(key, String(value));
    };
    append("sort", sort);
    append("brand", brand);
    append("type", type);
    append("soc", soc);
    append("cpu", cpu);
    append("memory", memory);
    append("gpu", gpu);
    append("storage", storage);
    append("display", display);
    append("priceMax", priceMax);
    append("page", targetPage);
    const qs = params.toString();
    return qs ? `/akciok?${qs}` : "/akciok";
  };

  return (
    <div className="min-h-screen text-foreground">
      <ProductHeader />
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-8 pb-16 pt-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link className="hover:text-primary" href="/">
            Főoldal
          </Link>
          <span>/</span>
          <span className="text-foreground">Akciók</span>
        </div>

        <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-lg shadow-black/30">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase text-primary">Akciók</div>
                <h1 className="text-2xl font-extrabold">Akciós termékek</h1>
                <p className="text-sm text-muted-foreground">
                  Minden kedvezményes laptop, PC és telefon egy helyen.
                </p>
              </div>
              <div className="text-xs font-semibold text-muted-foreground">{total} találat</div>
            </div>
          </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full lg:hidden">
            <details className="relative overflow-visible rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-foreground">
                Szűrők <span className="text-lg transition-transform duration-200 open:rotate-180">▼</span>
              </summary>
              <div className="relative z-10 mt-3 border-t border-border pt-3">
                <FilterForm
                  key={filterKey}
                  sort={sort}
                  brand={brand}
                  type={type}
                  soc={soc}
                  cpu={cpu}
                  memory={memory}
                  gpu={gpu}
                  storage={storage}
                  display={display}
                  priceMax={priceMax}
                  facets={facets}
                  clearHref="/akciok"
                  filterKey={filterKey}
                />
              </div>
            </details>
          </div>

          <aside className="hidden h-max w-[260px] shrink-0 rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30 lg:block">
            <div className="mb-4 text-lg font-extrabold">Szűrők</div>
            <FilterForm
              key={filterKey}
              sort={sort}
              brand={brand}
              type={type}
              soc={soc}
              cpu={cpu}
              memory={memory}
              gpu={gpu}
              storage={storage}
              display={display}
              priceMax={priceMax}
              facets={facets}
              clearHref="/akciok"
              filterKey={filterKey}
            />
          </aside>

          <div className="flex flex-1 flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {pageItems.map((item) => {
              const firstImage = item.images?.[0]?.url;
              return (
                <div
                  key={item._id || item.slug}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30 transition duration-200 hover:scale-105"
                >
                  <Link href={resolveHref(item)} className="block overflow-hidden rounded-lg border border-border">
                    <div className="relative aspect-square w-full">
                      <Image
                        fill
                        src={
                          firstImage ||
                          "https://dummyimage.com/600x400/0f1320/ffffff&text=PrimeLaptop"
                        }
                        alt={item.name}
                        className="object-contain bg-white transition duration-300 hover:scale-105"
                        sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 80vw"
                        unoptimized
                      />
                    </div>
                  </Link>
                  <div className="flex flex-col gap-1">
                    <div className="text-xs uppercase text-primary">{item.brand}</div>
                    <Link href={resolveHref(item)} className="font-semibold hover:text-primary">
                      {item.name}
                    </Link>
                    <div className="flex flex-col items-start gap-1">
                      {typeof item.compareAt === "number" && (
                        <span className="text-sm font-semibold text-muted-foreground line-through">
                          {formatPrice(item.compareAt)}
                        </span>
                      )}
                      <span
                        className={`text-2xl font-extrabold ${
                          typeof item.compareAt === "number" ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {formatPrice(item.final)}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={resolveHref(item)}
                    className="mt-auto inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30 transition duration-150 hover:brightness-95"
                  >
                    Megnézem
                  </Link>
                </div>
              );
              })}
              {pageItems.length === 0 && (
                <div className="col-span-full rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
                  Jelenleg nincs akciós termék.
                </div>
              )}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Link
                  href={buildPageHref(Math.max(1, currentPage - 1))}
                  className={`inline-flex items-center rounded-full border border-border px-3 py-2 text-sm font-semibold transition ${
                    currentPage === 1
                      ? "cursor-not-allowed text-muted-foreground"
                      : "hover:border-primary/60 hover:text-primary"
                  }`}
                  aria-disabled={currentPage === 1}
                >
                  Előző
                </Link>
                <div className="text-sm font-semibold text-muted-foreground">
                  {currentPage} / {totalPages}
                </div>
                <Link
                  href={buildPageHref(Math.min(totalPages, currentPage + 1))}
                  className={`inline-flex items-center rounded-full border border-border px-3 py-2 text-sm font-semibold transition ${
                    currentPage === totalPages
                      ? "cursor-not-allowed text-muted-foreground"
                      : "hover:border-primary/60 hover:text-primary"
                  }`}
                  aria-disabled={currentPage === totalPages}
                >
                  Következő
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
