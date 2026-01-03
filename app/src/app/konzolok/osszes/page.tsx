import Image from "next/image";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";
import { PriceSlider } from "@/components/price-slider";
import { SortSelect } from "@/components/sort-select";
import { FilterSelect } from "@/components/filter-select";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type ConsoleHit = {
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
  platform?: string;
  model?: string;
  stock?: number;
  shortDescription?: string;
  info?: string;
  specs?: {
    cpu?: string;
    gpu?: string;
    memory?: string;
    storage?: string;
    resolution?: string;
  };
  images?: { url: string; alt?: string | null }[];
};

type FacetRow = {
  brand?: string;
  condition?: string;
  platform?: string;
  model?: string;
  specs?: {
    memory?: string;
    storage?: string;
  };
};

type FilterFormProps = {
  sort: string;
  brand?: string;
  condition?: string;
  platform?: string;
  model?: string;
  q?: string;
  priceMin?: number;
  priceMax?: number;
  ceilPrice: number;
  brands: string[];
  platforms: string[];
  models: string[];
  conditions: { value: string; label: string }[];
};

const platformLabels: Record<string, string> = {
  playstation: "Playstation",
  xbox: "Xbox",
  nintendo: "Nintendo",
  kezikonzolok: "Kézikonzolok",
};

function FilterForm({
  sort,
  brand,
  condition,
  platform,
  model,
  q,
  priceMin,
  priceMax,
  ceilPrice,
  brands,
  platforms,
  models,
  conditions,
}: FilterFormProps) {
  return (
    <form className="space-y-4" method="get">
      <input type="hidden" name="sort" value={sort} />
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Keresés</label>
        <input
          name="q"
          defaultValue={q}
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
          placeholder="Keresés név/spec alapján"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Ár (HUF)</label>
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
        <FilterSelect
          name="condition"
          label="Állapot"
          options={conditions.map((opt) => ({ value: opt.value, label: opt.label }))}
          defaultValue={condition || ""}
        />
      </div>
      <div className="space-y-1">
        <FilterSelect
          name="brand"
          label="Márka"
          options={[{ value: "", label: "Összes" }, ...brands.map((v) => ({ value: v, label: v }))]}
          defaultValue={brand || ""}
        />
      </div>
      <div className="space-y-1">
        <FilterSelect
          name="category"
          label="Platform"
          options={[
            { value: "", label: "Összes" },
            ...platforms.map((p) => ({ value: p, label: platformLabels[p] || p })),
          ]}
          defaultValue={platform || ""}
        />
      </div>
      <div className="space-y-1">
        <FilterSelect
          name="model"
          label="Modell"
          options={[{ value: "", label: "Összes" }, ...models.map((m) => ({ value: m, label: m }))]}
          defaultValue={model || ""}
        />
      </div>
      <button
        type="submit"
        className="w-full cursor-pointer rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30 transition duration-150 hover:scale-[1.02]"
      >
        Szűrés
      </button>
      <Link
        href="/konzolok/osszes"
        className="block cursor-pointer text-center text-xs font-semibold text-muted-foreground transition duration-150 hover:scale-[1.02] hover:text-primary"
      >
        Szűrők törlése
      </Link>
    </form>
  );
}

function parseSearchParams(search: Record<string, string | string[] | undefined>) {
  const brand = typeof search.brand === "string" && search.brand ? search.brand : undefined;
  const q = typeof search.q === "string" && search.q ? search.q : undefined;
  const condition = typeof search.condition === "string" && search.condition ? search.condition : undefined;
  const rawSort = typeof search.sort === "string" ? search.sort : "latest";
  const sort = rawSort === "default" ? "latest" : rawSort;
  const platform = typeof search.category === "string" && search.category ? search.category : undefined;
  const model = typeof search.model === "string" && search.model ? search.model : undefined;
  const priceMin = typeof search.priceMin === "string" && search.priceMin ? Number(search.priceMin) : undefined;
  const priceMax = typeof search.priceMax === "string" && search.priceMax ? Number(search.priceMax) : undefined;
  const page =
    typeof search.page === "string" && Number.isFinite(Number(search.page)) && Number(search.page) > 0
      ? Number(search.page)
      : 1;
  return { brand, condition, q, sort, platform, model, priceMin, priceMax, page };
}

export default async function ConsoleOsszes({ searchParams }: { searchParams: SearchParams }) {
  const qs = await searchParams;
  const { brand, condition, q, sort, platform, model, priceMin, priceMax, page } = parseSearchParams(qs);
  const pageSize = 9;
  const orderBy =
    sort === "price-asc"
      ? [{ field: "finalPriceHuf", direction: "asc" }]
      : sort === "price-desc"
        ? [{ field: "finalPriceHuf", direction: "desc" }]
        : sort === "popular"
          ? [
              { field: "featured", direction: "desc" },
              { field: "_createdAt", direction: "desc" },
            ]
          : [{ field: "_createdAt", direction: "desc" }];
  const qNoSpace = q ? q.replace(/\s+/g, "") : "";

  const consoles: ConsoleHit[] = await sanityClient.fetch(
    `*[_type=="console"
      && (!defined($brand) || lower(brand)==lower($brand))
      && (!defined($condition) || lower(condition)==lower($condition))
      && (!defined($platform) || lower(platform)==lower($platform))
      && (!defined($model) || lower(model)==lower($model))
      && (
        $q=="" ||
        lower(name) match lower($q) ||
        lower(shortDescription) match lower($q) ||
        lower(info) match lower($q) ||
        lower(specs.cpu) match lower($q) || lower(specs.cpu) match lower($qNoSpace) ||
        lower(specs.gpu) match lower($q) || lower(specs.gpu) match lower($qNoSpace) ||
        lower(specs.memory) match lower($q) || lower(specs.memory) match lower($qNoSpace) ||
        lower(specs.storage) match lower($q) || lower(specs.storage) match lower($qNoSpace)
      )
      && (!defined(stock) || stock > 0)
    ]{
      _id,
      name,
      "slug": slug.current,
      priceHuf,
      brand,
      condition,
      platform,
      model,
      featured,
      _createdAt,
      shortDescription,
      info,
      specs{
        cpu,
        gpu,
        memory,
        storage,
        resolution
      },
      "images": images[]{ "url": asset->url, alt },
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
    }|order(${orderBy.map((o) => `${o.field} ${o.direction}`).join(",")})`,
    {
      brand: brand ?? null,
      condition: condition ?? null,
      platform: platform ?? null,
      model: model ?? null,
      q: q ? `${q}*` : "",
      qNoSpace: qNoSpace ? `${qNoSpace}*` : "",
    },
  );

  const consolesWithEffective = consoles.map((item) => {
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
    const final =
      item.invalidDiscount || base - bestDiscount < 0
        ? base
        : Math.max(0, base - bestDiscount);
    return { ...item, effectivePrice: final };
  });

  const filteredConsoles = consolesWithEffective.filter((item) => {
    if (typeof priceMin === "number" && Number.isFinite(priceMin)) {
      if (item.effectivePrice < priceMin) return false;
    }
    if (typeof priceMax === "number" && Number.isFinite(priceMax)) {
      if (item.effectivePrice > priceMax) return false;
    }
    return true;
  });

  const sortedConsoles =
    sort === "price-asc"
      ? filteredConsoles.slice().sort((a, b) => a.effectivePrice - b.effectivePrice)
      : sort === "price-desc"
        ? filteredConsoles.slice().sort((a, b) => b.effectivePrice - a.effectivePrice)
        : sort === "popular"
          ? filteredConsoles
              .slice()
              .sort(
                (a, b) =>
                  Number(b.featured ?? false) - Number(a.featured ?? false) ||
                  new Date(b._createdAt || 0).getTime() - new Date(a._createdAt || 0).getTime(),
              )
          : filteredConsoles
              .slice()
              .sort(
                (a, b) =>
                  new Date(b._createdAt || 0).getTime() - new Date(a._createdAt || 0).getTime(),
              );

  const facetRows: FacetRow[] = await sanityClient.fetch(
    `*[_type=="console" && (!defined(stock) || stock > 0)]{
      brand,
      condition,
      platform,
      model,
      specs{
        memory,
        storage
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
  const platforms = collect(facetRows, (x) => x.platform);
  const models = collect(facetRows, (x) => x.model);
  const conditions = ["", ...collect(facetRows, (x) => x.condition)]
    .filter((v, idx, arr) => arr.indexOf(v) === idx)
    .map((v) => ({
      value: v,
      label: v === "" ? "Összes" : v === "UJ" ? "Új" : v === "FELUJITOTT" ? "Felújított" : v,
    }));
  const priceValues = consolesWithEffective
    .map((x) => x.effectivePrice)
    .filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  const ceilPrice = priceValues.length ? Math.max(...priceValues) : 1000000;

  const filterKey = [
    sort,
    brand || "",
    condition || "",
    platform || "",
    model || "",
    q || "",
    priceMin ?? "",
    priceMax ?? "",
  ].join("|");
  const filterProps: FilterFormProps = {
    sort,
    brand,
    condition,
    platform,
    model,
    q,
    priceMin,
    priceMax,
    ceilPrice,
    brands,
    platforms,
    models,
    conditions,
  };

  const conditionLabelMap: Record<string, string> = { UJ: "Új", FELUJITOTT: "Felújított" };
  const conditionLabel = condition ? conditionLabelMap[condition] || condition : null;
  const baseTitle = platform ? platformLabels[platform] || "Konzolok" : "Összes konzol";
  let pageTitle = baseTitle;
  if (brand && platform) pageTitle = `${brand} ${baseTitle.toLowerCase()}`;
  else if (brand) pageTitle = `${brand} konzol`;
  if (conditionLabel) pageTitle = `${pageTitle} – ${conditionLabel}`;
  const pageSubtitle =
    platform || brand || conditionLabel
      ? "Szűrt találatok a beállított feltételekkel."
      : "Konzolok Playstationtől Xboxig, Nintendoig.";

  const formatPrice = (value?: number) =>
    typeof value === "number" ? `${new Intl.NumberFormat("hu-HU").format(value)} Ft` : "Árért érdeklődj";
  const total = sortedConsoles.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const pageItems = sortedConsoles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const buildPageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    const append = (key: string, value?: string | number) => {
      if (value === undefined || value === "") return;
      params.set(key, String(value));
    };
    append("sort", sort);
    append("brand", brand);
    append("condition", condition);
    append("category", platform);
    append("model", model);
    append("q", q);
    append("priceMin", priceMin);
    append("priceMax", priceMax);
    append("page", targetPage);
    const qs = params.toString();
    return qs ? `/konzolok/osszes?${qs}` : "/konzolok/osszes";
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
          <span className="text-foreground">Konzolok</span>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase text-primary">Konzolok</div>
              <h1 className="text-2xl font-extrabold">{pageTitle}</h1>
              <p className="text-sm text-muted-foreground">{pageSubtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
              <SortSelect sort={sort} params={{ brand, category: platform, model, q, priceMin, priceMax }} />
              <div className="text-muted-foreground">{total} találat</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full lg:hidden">
            <details className="group relative overflow-visible rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                Szűrők
                <Image
                  src="/dropdown.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="h-7 w-7 shrink-0 transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <div className="mt-3 border-t border-border pt-3 relative z-10">
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
                    href="/konzolok/osszes"
                    className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/60"
                  >
                    Összes konzol megtekintése
                  </Link>
                </div>
              )}
              {pageItems.map((item, idx) => {
                const firstImage = item.images?.[0]?.url;
                const specs = item.specs || {};
                const specList = [platformLabels[item.platform || ""] || item.platform, specs.cpu, specs.gpu, specs.storage]
                  .filter(Boolean)
                  .slice(0, 3);
                const discounts = Array.isArray(item.discounts) ? item.discounts : [];
                const basePrice = typeof item.priceHuf === "number" ? item.priceHuf : undefined;
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
                  (typeof computedFinal === "number" && computedFinal < 0) || item.invalidDiscount || false;
                const finalPrice =
                  !invalidDiscount && typeof computedFinal === "number"
                    ? computedFinal
                    : typeof item.finalPriceHuf === "number"
                      ? item.finalPriceHuf
                      : basePrice;
                const compareAt =
                  !invalidDiscount && typeof finalPrice === "number" && bestDiscount > 0
                    ? basePrice
                    : typeof item.compareAtHuf === "number" && typeof finalPrice === "number" && item.compareAtHuf > finalPrice
                      ? item.compareAtHuf
                      : undefined;
                return (
                  <div
                    key={`${item.slug || item._id || item.name || "console"}-${idx}`}
                    className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30 transition duration-200 hover:scale-105"
                  >
                    <div className="relative h-48 overflow-hidden rounded-xl border border-border bg-secondary">
                      {firstImage ? (
                        <Image
                          src={firstImage}
                          alt={item.images?.[0]?.alt || item.name}
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
                      <div className="text-xs uppercase text-primary">
                        {[item.brand, platformLabels[item.platform || ""] || item.platform].filter(Boolean).join(" • ")}
                      </div>
                      <h3 className="text-lg font-bold leading-tight text-foreground">
                        <Link href={`/konzolok/${item.slug}`} className="hover:text-primary">
                          {item.name}
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
                      <div className="mt-auto flex">
                        <Link
                          href={`/konzolok/${item.slug}`}
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
