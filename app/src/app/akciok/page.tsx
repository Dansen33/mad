import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";
import { PriceSlider } from "@/components/price-slider";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type SaleHit = {
  _id?: string;
  _type: "product" | "pc" | "phone";
  slug: string;
  name: string;
  brand?: string;
  priceHuf?: number;
  compareAtHuf?: number;
  finalPriceHuf?: number;
  invalidDiscount?: boolean;
  discounts?: { type?: string; amount?: number }[];
  images?: { url: string; alt?: string | null }[];
  specs?: {
    processor?: string;
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

function FilterForm({
  sort,
  brand,
  type,
  cpu,
  memory,
  gpu,
  storage,
  display,
  priceMax,
  brands,
  cpus,
  memories,
  gpus,
  storages,
  displays,
  ceilPrice,
  filterKey,
  clearHref,
}: {
  sort: string;
  brand?: string;
  type?: string;
  cpu?: string;
  memory?: string;
  gpu?: string;
  storage?: string;
  display?: string;
  priceMax?: number;
  brands: string[];
  cpus: string[];
  memories: string[];
  gpus: string[];
  storages: string[];
  displays: string[];
  ceilPrice: number;
  filterKey: string;
  clearHref: string;
}) {
  return (
    <form className="space-y-4" method="get" key={filterKey}>
      <input type="hidden" name="sort" value={sort} />
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Ár</label>
        <PriceSlider
          name="priceMax"
          min={0}
          max={ceilPrice || 0}
          defaultValue={priceMax ?? (ceilPrice || 0)}
          hiddenMinName="priceMin"
          hiddenMinValue={0}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Terméktípus</label>
        <select
          name="type"
          defaultValue={type || ""}
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
        >
          <option value="">Összes</option>
          <option value="product">Laptopok</option>
          <option value="pc">PC-k</option>
          <option value="phone">Telefonok</option>
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Márka</label>
        <select
          name="brand"
          defaultValue={brand || ""}
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
        >
          <option value="">Összes</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Processzor</label>
        <select
          name="cpu"
          defaultValue={cpu || ""}
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
        >
          <option value="">Összes</option>
          {cpus.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Memória</label>
        <select
          name="memory"
          defaultValue={memory || ""}
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
        >
          <option value="">Összes</option>
          {memories.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Grafikus vezérlő</label>
        <select
          name="gpu"
          defaultValue={gpu || ""}
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
        >
          <option value="">Összes</option>
          {gpus.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Háttértár</label>
        <select
          name="storage"
          defaultValue={storage || ""}
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
        >
          <option value="">Összes</option>
          {storages.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Kijelző</label>
        <select
          name="display"
          defaultValue={display || ""}
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
        >
          <option value="">Összes</option>
          {displays.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full cursor-pointer rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30 transition duration-150 hover:scale-[1.02]"
      >
        Szűrés
      </button>
      <Link
        href={clearHref}
        className="block cursor-pointer text-center text-xs font-semibold text-muted-foreground transition duration-150 hover:scale-[1.02] hover:text-primary"
      >
        Szűrők törlése
      </Link>
    </form>
  );
}

export default async function AkciokPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const qs = (await searchParams) ?? {};
  const rawSort = typeof qs.sort === "string" ? qs.sort : "latest";
  const sort = rawSort === "default" ? "latest" : rawSort;
  const brand = typeof qs.brand === "string" ? qs.brand : "";
  const type = typeof qs.type === "string" ? qs.type : "";
  const cpu = typeof qs.cpu === "string" ? qs.cpu : "";
  const memory = typeof qs.memory === "string" ? qs.memory : "";
  const gpu = typeof qs.gpu === "string" ? qs.gpu : "";
  const storage = typeof qs.storage === "string" ? qs.storage : "";
  const display = typeof qs.display === "string" ? qs.display : "";
  const priceMax = typeof qs.priceMax === "string" ? Number(qs.priceMax) : undefined;

  // Az aktív kedvezményekben megadott érintett termékek lekérése
  const items: SaleHit[] = await sanityClient.fetch(
    `*[_type=="discount" && active==true && (!defined(startsAt) || startsAt <= now()) && (!defined(endsAt) || endsAt >= now())].products[]->{
      _id,
      _type,
      name,
      "slug": slug.current,
      brand,
      priceHuf,
      "images": images[]{ "url": asset->url, alt },
      specs{
        processor,
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
    const base = typeof item.priceHuf === "number" ? item.priceHuf : 0;
    const finalFromQuery =
      typeof item.finalPriceHuf === "number" && !item.invalidDiscount ? item.finalPriceHuf : undefined;
    const compareAtFromQuery = typeof item.compareAtHuf === "number" ? item.compareAtHuf : base;
    const final = Math.max(0, finalFromQuery ?? base);
    const compareAt = Math.max(compareAtFromQuery, base);
    const hasDiscount =
      !item.invalidDiscount &&
      typeof final === "number" &&
      typeof compareAt === "number" &&
      compareAt > final;
    return { ...item, final, compareAt, hasDiscount };
  });

  const filtered = discounted.filter((item) => {
    if (type && item._type !== type) return false;
    if (brand && item.brand && item.brand.toLowerCase() !== brand.toLowerCase()) return false;
    const specs = item.specs || {};
    if (cpu && specs.processor && specs.processor.toLowerCase() !== cpu.toLowerCase()) return false;
    if (memory && specs.memory && specs.memory.toLowerCase() !== memory.toLowerCase()) return false;
    if (gpu && specs.gpu && specs.gpu.toLowerCase() !== gpu.toLowerCase()) return false;
    if (storage && specs.storage && specs.storage.toLowerCase() !== storage.toLowerCase()) return false;
    if (display && specs.display && specs.display.toLowerCase() !== display.toLowerCase()) return false;
    if (typeof priceMax === "number" && Number.isFinite(priceMax) && item.final > priceMax) return false;
    return true;
  });

  const sorted =
    sort === "price-asc"
      ? filtered.slice().sort((a, b) => a.final - b.final)
      : sort === "price-desc"
        ? filtered.slice().sort((a, b) => b.final - a.final)
        : filtered;

  const collect = (arr: SaleHit[], pick: (x: SaleHit) => string | undefined) => {
    return Array.from(
      new Set(
        arr
          .map(pick)
          .filter((v): v is string => typeof v === "string" && v.trim().length > 0),
      ),
    ).sort((a, b) => a.localeCompare(b, "hu", { sensitivity: "base" }));
  };

  const brands = collect(discounted, (x) => x.brand);
  const cpus = collect(discounted, (x) => x.specs?.processor);
  const memories = collect(discounted, (x) => x.specs?.memory);
  const gpus = collect(discounted, (x) => x.specs?.gpu);
  const storages = collect(discounted, (x) => x.specs?.storage);
  const displays = collect(discounted, (x) => x.specs?.display || x.specs?.soc);

  const priceValues = discounted.map((x) => x.final).filter((v): v is number => typeof v === "number");
  const ceilPrice = priceValues.length ? Math.max(...(priceValues as number[])) : 0;
  const filterKey = [sort, brand, type, cpu, memory, gpu, storage, display, priceMax ?? ""].join("|");

  const resolveHref = (item: SaleHit) => {
    if (item._type === "pc") return `/pc-k/${item.slug}`;
    if (item._type === "phone") return `/telefonok/${item.slug}`;
    return `/termek/${item.slug}`;
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
            <div className="text-xs font-semibold text-muted-foreground">{discounted.length} találat</div>
          </div>
        </div>

        <FilterForm
          brand={brand}
          type={type}
          cpu={cpu}
          memory={memory}
          gpu={gpu}
          storage={storage}
          display={display}
          priceMax={priceMax}
          brands={brands}
          cpus={cpus}
          memories={memories}
          gpus={gpus}
          storages={storages}
          displays={displays}
          ceilPrice={ceilPrice}
          clearHref="/akciok"
          filterKey={filterKey}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((item) => {
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
                      className="object-cover transition duration-300 hover:scale-105"
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
                    <span className="text-sm font-semibold text-muted-foreground line-through">
                      {formatPrice(item.compareAt)}
                    </span>
                    <span className="text-2xl font-extrabold text-primary">
                      {formatPrice(item.final)}
                    </span>
                  </div>
                </div>
                <Link
                  href={resolveHref(item)}
                  className="mt-auto inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30"
                >
                  Megnézem
                </Link>
              </div>
            );
          })}
          {discounted.length === 0 && (
            <div className="col-span-full rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
              Jelenleg nincs akciós termék.
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
