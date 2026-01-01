import Image from "next/image";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";
import { PriceSlider } from "@/components/price-slider";
import { SortSelect } from "@/components/sort-select";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type PhoneHit = {
  _id?: string;
  slug: string;
  name: string;
  priceHuf?: number;
  finalPriceHuf?: number;
  compareAtHuf?: number;
  invalidDiscount?: boolean;
  discounts?: { type?: string; amount?: number }[];
  featured?: boolean;
  _createdAt?: string;
  brand?: string;
  condition?: string;
  stock?: number;
  shortDescription?: string;
  specs?: {
    soc?: string;
    memory?: string;
    storage?: string;
    display?: string;
    battery?: string;
    camera?: string;
    os?: string;
    connectivity?: string;
  };
  images?: { url: string; alt?: string | null }[];
};

type FacetRow = {
  brand?: string;
  specs?: {
    soc?: string;
    memory?: string;
    storage?: string;
    display?: string;
    battery?: string;
    camera?: string;
    os?: string;
  };
};

type FilterFormProps = {
  sort: string;
  brand?: string;
  condition?: string;
  q?: string;
  soc?: string;
  memory?: string;
  storage?: string;
  display?: string;
  os?: string;
  priceMin?: number;
  priceMax?: number;
  ceilPrice: number;
  brands: string[];
  socs: string[];
  memories: string[];
  storages: string[];
  displays: string[];
  oss: string[];
  clearHref: string;
};

function FilterForm({
  sort,
  brand,
  condition,
  q,
  soc,
  memory,
  storage,
  display,
  os,
  priceMin,
  priceMax,
  ceilPrice,
  brands,
  socs,
  memories,
  storages,
  displays,
  oss,
  clearHref,
}: FilterFormProps) {
  return (
    <form className="space-y-4" method="get">
      <input type="hidden" name="sort" value={sort} />
      <input type="hidden" name="condition" value={condition || ""} />
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Keresés</label>
        <input
          name="q"
          defaultValue={q}
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
          placeholder="Keresés név/spec alapján"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Ár</label>
        <PriceSlider
          name="priceMax"
          min={0}
          max={ceilPrice}
          defaultValue={priceMax ?? ceilPrice}
          hiddenMinName="priceMin"
          hiddenMinValue={priceMin ?? 0}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Márka</label>
        <select
          name="brand"
          defaultValue={brand || ""}
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
        >
          <option value="">Összes</option>
          {brands.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Processzor (SoC)</label>
        <select
          name="soc"
          defaultValue={soc || ""}
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
        >
          <option value="">Összes</option>
          {socs.map((v) => (
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
        <label className="text-xs font-semibold uppercase text-muted-foreground">Tárhely</label>
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
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Operációs rendszer</label>
        <select
          name="os"
          defaultValue={os || ""}
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
        >
          <option value="">Összes</option>
          {oss.map((v) => (
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

export default async function PhoneOsszes({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const rawSort = typeof params.sort === "string" ? params.sort : "latest";
  const sort = rawSort === "default" ? "latest" : rawSort;
  const brand = typeof params.brand === "string" && params.brand.trim().length > 0 ? params.brand : undefined;
  const condition =
    typeof params.condition === "string" && params.condition.trim().length > 0 ? params.condition : undefined;
  const soc = typeof params.soc === "string" && params.soc.trim().length > 0 ? params.soc : undefined;
  const memory = typeof params.memory === "string" && params.memory.trim().length > 0 ? params.memory : undefined;
  const storage = typeof params.storage === "string" && params.storage.trim().length > 0 ? params.storage : undefined;
  const display = typeof params.display === "string" && params.display.trim().length > 0 ? params.display : undefined;
  const os = typeof params.os === "string" && params.os.trim().length > 0 ? params.os : undefined;
  const q = typeof params.q === "string" ? params.q : "";
  const priceMin = params.priceMin ? Number(params.priceMin) : undefined;
  const priceMax = params.priceMax ? Number(params.priceMax) : undefined;
  const page =
    typeof params.page === "string" && Number.isFinite(Number(params.page)) && Number(params.page) > 0
      ? Number(params.page)
      : 1;

  const qNoSpace = q ? q.replace(/\s+/g, "") : "";

  const orderBy = [{ field: "_createdAt", direction: "desc" }];
  const pageSize = 9;

  const phones: PhoneHit[] = await sanityClient.fetch(
    `*[_type=="phone" && (!defined(stock) || stock > 0)
      && (!defined($brand) || $brand=="" || lower(brand)==lower($brand))
      && (!defined($condition) || $condition=="" || condition==$condition)
      && (!defined($soc) || $soc=="" || lower(specs.soc)==lower($soc))
      && (!defined($memory) || $memory=="" || lower(specs.memory)==lower($memory))
      && (!defined($storage) || $storage=="" || lower(specs.storage)==lower($storage))
      && (!defined($display) || $display=="" || lower(specs.display)==lower($display))
      && (!defined($os) || $os=="" || lower(specs.os)==lower($os))
      && (!defined($priceMin) || priceHuf >= $priceMin)
      && (!defined($priceMax) || priceHuf <= $priceMax)
      && (
        $q=="" ||
        lower(name) match lower($q) ||
        lower(shortDescription) match lower($q) ||
        lower(specs.soc) match lower($q) ||
        lower(specs.memory) match lower($q) ||
        lower(specs.storage) match lower($q) ||
        lower(specs.display) match lower($q) ||
        lower(specs.battery) match lower($q) ||
        lower(specs.camera) match lower($q) ||
        lower(specs.os) match lower($q) ||
        lower(specs.connectivity) match lower($q) ||
        lower(name) match lower($qNoSpace) ||
        lower(shortDescription) match lower($qNoSpace)
      )
    ]{
      _id,
      name,
      "slug": slug.current,
      priceHuf,
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
      "invalidDiscount": (priceHuf - coalesce(discountHufs[0], 0)) < 0,
      brand,
      condition,
      stock,
      shortDescription,
      specs{
        soc,
        memory,
        storage,
        display,
        battery,
        camera,
        os,
        connectivity
      },
      featured,
      _createdAt,
      "images": images[]{ "url": asset->url, alt }
    }|order(${orderBy.map((o) => `${o.field} ${o.direction}`).join(",")})`,
    {
      brand: brand ?? null,
      condition: condition ?? null,
      soc: soc ?? null,
      memory: memory ?? null,
      storage: storage ?? null,
      display: display ?? null,
      os: os ?? null,
      q: q ? `${q}*` : "",
      qNoSpace: qNoSpace ? `${qNoSpace}*` : "",
      priceMin: Number.isFinite(priceMin) ? priceMin : null,
      priceMax: Number.isFinite(priceMax) ? priceMax : null,
    },
  );

  const withEffectivePrice = phones.map((phone) => {
    const base = typeof phone.priceHuf === "number" ? phone.priceHuf : 0;
    const discounts = Array.isArray(phone.discounts) ? phone.discounts : [];
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
    const final =
      phone.invalidDiscount || base - bestDiscount < 0
        ? base
        : Math.max(0, base - bestDiscount);
    return { ...phone, effectivePrice: final };
  });

  const filteredPhones = withEffectivePrice.filter((phone) => {
    if (typeof priceMin === "number" && Number.isFinite(priceMin)) {
      if (phone.effectivePrice < priceMin) return false;
    }
    if (typeof priceMax === "number" && Number.isFinite(priceMax)) {
      if (phone.effectivePrice > priceMax) return false;
    }
    return true;
  });

  const sortedPhones =
    sort === "price-asc"
      ? filteredPhones.slice().sort((a, b) => a.effectivePrice - b.effectivePrice)
      : sort === "price-desc"
        ? filteredPhones.slice().sort((a, b) => b.effectivePrice - a.effectivePrice)
        : sort === "popular"
          ? filteredPhones
              .slice()
              .sort(
                (a, b) =>
                  Number(b.featured ?? false) - Number(a.featured ?? false) ||
                  new Date(b._createdAt || 0).getTime() - new Date(a._createdAt || 0).getTime(),
              )
          : filteredPhones
              .slice()
              .sort(
                (a, b) =>
                  new Date(b._createdAt || 0).getTime() - new Date(a._createdAt || 0).getTime(),
              );
  const totalPhones = sortedPhones.length;
  const totalPages = Math.max(1, Math.ceil(totalPhones / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const pageItems = sortedPhones.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const facetRows: FacetRow[] = await sanityClient.fetch(
    `*[_type=="phone" && (!defined(stock) || stock > 0)]{
      brand,
      specs{
        soc,
        memory,
        storage,
        display,
        battery,
        camera,
        os
      }
    }`,
  );

  const collect = (arr: FacetRow[], selector: (x: FacetRow) => string | undefined) => {
    const values = Array.from(
      new Set(
        arr
          .map(selector)
          .filter((v): v is string => typeof v === "string" && v.trim().length > 0),
      ),
    );
    return values.sort((a, b) => a.localeCompare(b, "hu", { sensitivity: "base" }));
  };

  const brands = collect(facetRows, (x) => x.brand);
  const socs = collect(facetRows, (x) => x.specs?.soc);
  const memories = collect(facetRows, (x) => x.specs?.memory);
  const storages = collect(facetRows, (x) => x.specs?.storage);
  const displays = collect(facetRows, (x) => x.specs?.display);
  const oss = collect(facetRows, (x) => x.specs?.os);

  const priceValues = withEffectivePrice
    .map((p) => p.effectivePrice)
    .filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  const ceilPrice = priceValues.length ? Math.max(...priceValues) : 0;

  const filterKey = [
    sort,
    q || "",
    brand || "",
    condition || "",
    soc || "",
    memory || "",
    storage || "",
    display || "",
    os || "",
    priceMin || "",
    priceMax || "",
  ].join("|");

  const filterProps: FilterFormProps = {
    sort,
    q,
    brand,
    condition,
    soc,
    memory,
    storage,
    display,
    os,
    priceMin,
    priceMax,
    ceilPrice,
    brands,
    socs,
    memories,
    storages,
    displays,
    oss,
    clearHref: "/telefonok/osszes",
  };

  const buildPageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    const append = (key: string, value?: string | number | null) => {
      if (value === undefined || value === null || value === "") return;
      params.set(key, String(value));
    };
    append("sort", sort);
    append("brand", brand);
    append("condition", condition);
    append("q", q);
    append("soc", soc);
    append("memory", memory);
    append("storage", storage);
    append("display", display);
    append("os", os);
    append("priceMin", priceMin);
    append("priceMax", priceMax);
    append("page", targetPage);
    const qs = params.toString();
    return qs ? `/telefonok/osszes?${qs}` : "/telefonok/osszes";
  };

  const conditionLabelMap: Record<string, string> = { UJ: "Új", FELUJITOTT: "Felújított" };
  const conditionLabel = condition ? conditionLabelMap[condition] || condition : null;
  const hasFilters = Boolean(brand || condition || q || soc || memory || storage || display || os || priceMin || priceMax);
  const kicker = brand ? brand : conditionLabel ? conditionLabel : "Összes";
  let pageTitle = brand ? `${brand} telefonok` : "Minden telefon";
  if (conditionLabel && brand) pageTitle = `${brand} telefonok – ${conditionLabel}`;
  else if (conditionLabel && !brand) pageTitle = `${conditionLabel} telefonok`;
  const subtitle = hasFilters
    ? "Szűrt találatok a megadott feltételekkel."
    : "Márkák, kategóriák, specifikációk szerint.";

  const formatPrice = (value?: number) =>
    typeof value === "number" ? `${new Intl.NumberFormat("hu-HU").format(value)} Ft` : "Árért érdeklődj";

  return (
    <div className="min-h-screen text-foreground">
      <ProductHeader />
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-8 pb-16 pt-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link className="hover:text-primary" href="/">
            Főoldal
          </Link>
          <span>/</span>
          <span className="text-foreground">
            {brand ? `${brand} telefonok` : conditionLabel ? `${conditionLabel} telefonok` : "Telefonok"}
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-lg shadow-black/30">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase text-primary">{kicker}</div>
              <h1 className="text-2xl font-extrabold">{pageTitle}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <div className="flex flex-col items-end gap-2 text-xs font-semibold text-muted-foreground sm:flex-row sm:items-center sm:gap-3">
              <SortSelect
                sort={sort}
                params={{ brand, q, soc, memory, storage, display, os, priceMin, priceMax }}
                id="sort-select-phone"
              />
              <div className="text-muted-foreground">{totalPhones} találat</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full lg:hidden">
            <details className="relative overflow-visible rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-foreground">
                Szűrők <span className="text-lg transition-transform duration-200 open:rotate-180">▼</span>
              </summary>
              <div className="relative z-10 mt-3 border-t border-border pt-3">
                <FilterForm key={filterKey} {...filterProps} />
              </div>
            </details>
          </div>

          <aside className="hidden h-max w-[260px] shrink-0 rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30 lg:block">
            <div className="mb-4 text-lg font-extrabold">Szűrők</div>
            <FilterForm key={filterKey} {...filterProps} />
          </aside>

          <div className="flex flex-1 flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {!pageItems.length && (
                <div className="col-span-full rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-lg shadow-black/20">
                  <div className="text-lg font-bold text-foreground">Sajnáljuk, nincs találat.</div>
                  <p className="mt-1">
                    A megadott szűrőkre most nem találtunk terméket. Tekintsd meg a teljes kínálatot:
                  </p>
                  <Link
                    href="/telefonok/osszes"
                    className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/60"
                  >
                    Összes telefon megtekintése
                  </Link>
                </div>
              )}
              {pageItems.map((phone) => {
                const firstImage = phone.images?.[0]?.url;
                const specs = phone.specs || {};
                const specList = [specs.soc, specs.memory, specs.storage, specs.display].filter(Boolean).slice(0, 3);
                const discounts = Array.isArray(phone.discounts) ? phone.discounts : [];
                const basePrice = typeof phone.priceHuf === "number" ? phone.priceHuf : undefined;
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
                    : 0;
                const computedFinal = typeof basePrice === "number" ? basePrice - bestDiscount : undefined;
                const invalidDiscount =
                  (typeof computedFinal === "number" && computedFinal < 0) || phone.invalidDiscount || false;
                const finalPrice =
                  !invalidDiscount && typeof computedFinal === "number"
                    ? computedFinal
                    : typeof phone.finalPriceHuf === "number"
                      ? phone.finalPriceHuf
                      : basePrice;
                const compareAt =
                  !invalidDiscount && typeof finalPrice === "number" && bestDiscount > 0
                    ? basePrice
                    : typeof phone.compareAtHuf === "number" && typeof finalPrice === "number" && phone.compareAtHuf > finalPrice
                      ? phone.compareAtHuf
                      : undefined;
                return (
                  <div
                    key={phone.slug || phone._id || phone.name}
                    className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30 transition duration-200 hover:scale-105"
                  >
                    <div className="relative h-48 overflow-hidden rounded-xl border border-border bg-secondary">
                      {firstImage ? (
                        <Image
                          src={firstImage}
                          alt={phone.images?.[0]?.alt || phone.name}
                          fill
                          className="object-contain bg-white"
                          sizes="400px"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                          Nincs kép
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="text-xs uppercase text-primary">{phone.brand}</div>
                      <h3 className="text-lg font-bold leading-tight text-foreground">
                        <Link href={`/telefonok/${phone.slug}`} className="hover:text-primary">
                          {phone.name}
                        </Link>
                      </h3>
                      <div className="flex flex-col gap-1">
                        {compareAt !== undefined && (
                          <span className="text-sm font-semibold text-muted-foreground line-through">
                            {formatPrice(compareAt)}
                          </span>
                        )}
                        <div
                          className={`text-2xl font-extrabold ${
                            compareAt !== undefined ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {formatPrice(finalPrice)}
                        </div>
                      </div>
                      {specList.length > 0 && (
                        <ul className="text-sm text-muted-foreground">
                          {specList.map((s, idx) => (
                            <li key={idx}>• {s}</li>
                          ))}
                        </ul>
                      )}
                      {phone.shortDescription && (
                        <div className="text-sm text-muted-foreground line-clamp-2">{phone.shortDescription}</div>
                      )}
                      <div className="mt-auto flex">
                        <Link
                          href={`/telefonok/${phone.slug}`}
                          className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30 hover:scale-105 transition"
                        >
                          Megnézem
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
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
