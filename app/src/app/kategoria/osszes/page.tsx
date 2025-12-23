import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";
import Image from "next/image";
import { PriceSlider } from "@/components/price-slider";
import { SortSelect } from "@/components/sort-select";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
type ProductHit = {
  _id?: string;
  slug: string;
  name: string;
  priceHuf: number;
  finalPriceHuf?: number;
  compareAtHuf?: number;
  invalidDiscount?: boolean;
  discounts?: { type?: string; amount?: number }[];
  featured?: boolean;
  _createdAt?: string;
  shortDescription?: string;
  images?: { url: string; alt?: string | null }[];
  effectivePrice?: number;
  specs?: {
    processor?: string;
    memory?: string;
    storage?: string;
    gpu?: string;
    display?: string;
  };
};

type ProductWithEffective = ProductHit & { effectivePrice: number };

type FacetRow = {
  brand?: string;
  categories?: string[];
  specs?: {
    processor?: string;
    memory?: string;
    gpu?: string;
    display?: string;
    storage?: string;
  };
};

type FilterFormProps = {
  sort: string;
  q?: string;
  brand?: string;
  condition?: string;
  priceMax?: number;
  categories: string[];
  cpu?: string;
  memory?: string;
  gpu?: string;
  display?: string;
  storage?: string;
  categoryOptions: { label: string; value: string }[];
  brands: string[];
  cpus: string[];
  memories: string[];
  gpus: string[];
  displays: string[];
  storages: string[];
  ceilPrice: number;
  clearHref: string;
};

function FilterForm({
  sort,
  q,
  brand,
  condition,
  priceMax,
  categories,
  cpu,
  memory,
  gpu,
  display,
  storage,
  categoryOptions,
  brands,
  cpus,
  memories,
  gpus,
  displays,
  storages,
  ceilPrice,
  clearHref,
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
          placeholder="Keresés név/leírás"
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
          hiddenMinValue={0}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Állapot</label>
        <select
          name="condition"
          defaultValue={condition || ""}
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
        >
          <option value="">Összes</option>
          <option value="UJ">Új</option>
          <option value="FELUJITOTT">Felújított</option>
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
        <label className="text-xs font-semibold uppercase text-muted-foreground">Kategória</label>
        <div className="grid grid-cols-1 gap-1 text-sm">
          {categoryOptions.map((cat) => {
            const checked = categories.includes(cat.value);
            return (
              <label key={cat.value} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="category" value={cat.value} defaultChecked={checked} />
                <span>{cat.label}</span>
              </label>
            );
          })}
        </div>
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
        <label className="text-xs font-semibold uppercase text-muted-foreground">
          Grafikus vezérlő
        </label>
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
        <label className="text-xs font-semibold uppercase text-muted-foreground">Kijelző mérete</label>
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

function parseSearchParams(search: Record<string, string | string[] | undefined>) {
  const brand = typeof search.brand === "string" && search.brand ? search.brand : undefined;
  const condition =
    typeof search.condition === "string" && search.condition ? search.condition : undefined;
  const q = typeof search.q === "string" && search.q ? search.q : undefined;
  const priceMax =
    typeof search.priceMax === "string" && search.priceMax ? Number(search.priceMax) : undefined;
  const rawSort = typeof search.sort === "string" ? search.sort : "latest";
  const sort = rawSort === "default" ? "latest" : rawSort;
  const cpu = typeof search.cpu === "string" && search.cpu ? search.cpu : undefined;
  const memory = typeof search.memory === "string" && search.memory ? search.memory : undefined;
  const gpu = typeof search.gpu === "string" && search.gpu ? search.gpu : undefined;
  const display = typeof search.display === "string" && search.display ? search.display : undefined;
  const storage = typeof search.storage === "string" && search.storage ? search.storage : undefined;
  const categoryRaw = search.category;
  const categories = Array.isArray(categoryRaw)
    ? categoryRaw.filter(Boolean)
    : categoryRaw
      ? [categoryRaw]
      : [];
  return { brand, condition, q, sort, categories, cpu, memory, gpu, display, storage, priceMax };
}

export default async function AllProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const qs = await searchParams;
  const { brand, condition, q, sort, categories, cpu, memory, gpu, display, storage, priceMax } =
    parseSearchParams(qs);
  const qNoSpace = q ? q.replace(/\s+/g, "") : null;
  const categoryOptions = [
    { label: "Általános", value: "GENERAL" },
    { label: "Üzleti", value: "BUSINESS" },
    { label: "Gamer", value: "GAMING" },
    { label: "Workstation", value: "WORKSTATION" },
    { label: "Érintőképernyős", value: "TOUCH" },
  ];
  const categoryLabelMap = Object.fromEntries(categoryOptions.map((c) => [c.value, c.label]));
  const conditionLabelMap: Record<string, string> = { UJ: "Új", FELUJITOTT: "Felújított" };

  const orderBy =
    sort === "price-asc"
      ? [{ field: "priceHuf", direction: "asc" as const }]
      : sort === "price-desc"
        ? [{ field: "priceHuf", direction: "desc" as const }]
        : [{ field: "_createdAt", direction: "desc" as const }];

  const products = await sanityClient.fetch(
    `*[_type=="product"
      && (!defined($brand) || lower(brand)==lower($brand))
      && (!defined($condition) || lower(condition)==lower($condition))
      && (!defined($cpu) || lower(specs.processor)==lower($cpu))
      && (!defined($memory) || lower(specs.memory)==lower($memory))
      && (!defined($gpu) || lower(specs.gpu)==lower($gpu))
      && (!defined($display) || lower(specs.display)==lower($display))
      && (!defined($storage) || lower(specs.storage)==lower($storage))
      && (
        !defined($q) ||
        lower(name) match lower($q) ||
        lower(shortDescription) match lower($q) ||
        lower(brand) match lower($q) ||
        lower(specs.processor) match lower($q) || lower(specs.processor) match lower($qNoSpace) ||
        lower(specs.memory) match lower($q) || lower(specs.memory) match lower($qNoSpace) ||
        lower(specs.gpu) match lower($q) || lower(specs.gpu) match lower($qNoSpace) ||
        lower(specs.display) match lower($q) || lower(specs.display) match lower($qNoSpace) ||
        lower(specs.storage) match lower($q) || lower(specs.storage) match lower($qNoSpace)
      ) && (
        !defined($cats) || length($cats)==0 ||
        (
          (defined(categories) && count((categories[])[lower(@) in $cats]) == length($cats))
          ||
          (!defined(categories) && defined(category) && length($cats)==1 && lower(category)==$cats[0])
        )
      )
      && (!defined(stock) || stock > 0)
    ]{
      _id,
      name,
      "slug": slug.current,
      priceHuf,
      brand,
      condition,
      shortDescription,
      categories,
      specs{
        processor,
        memory,
        gpu,
        display,
        storage
      },
      "images": images[]{ "url": asset->url, alt },
      featured,
      _createdAt,
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
      cpu: cpu ?? null,
      memory: memory ?? null,
      gpu: gpu ?? null,
      display: display ?? null,
      storage: storage ?? null,
      q: q ? `${q}*` : null,
      qNoSpace: qNoSpace ? `${qNoSpace}*` : "",
      cats: categories.length ? categories.map((c) => c.toLowerCase()) : [],
    },
  );

  const productsWithEffective: ProductWithEffective[] = products.map((item: ProductHit) => {
    const basePrice = typeof item.priceHuf === "number" ? item.priceHuf : 0;
    const discounts = Array.isArray(item.discounts) ? item.discounts : [];
    const bestDiscount =
      discounts
        .map((d) => {
          if (!d || typeof d.amount !== "number") return 0;
          if (d.type === "percent") return Math.round(basePrice * d.amount * 0.01);
          if (d.type === "fixed") return d.amount;
          return 0;
        })
        .filter((v) => v > 0)
        .sort((a, b) => b - a)[0] ?? 0;
    const effectivePrice =
      item.invalidDiscount || basePrice - bestDiscount < 0
        ? basePrice
        : Math.max(0, basePrice - bestDiscount);
    return { ...item, effectivePrice };
  });

  const filteredProducts = productsWithEffective.filter((p) => {
    if (typeof priceMax === "number" && Number.isFinite(priceMax)) {
      if (p.effectivePrice > priceMax) return false;
    }
    return true;
  });
  const sortedProducts =
    sort === "price-asc"
      ? filteredProducts.slice().sort((a, b) => a.effectivePrice - b.effectivePrice)
      : sort === "price-desc"
        ? filteredProducts.slice().sort((a, b) => b.effectivePrice - a.effectivePrice)
        : sort === "popular"
          ? filteredProducts
              .slice()
              .sort(
                (a, b) =>
                  Number(b.featured ?? false) - Number(a.featured ?? false) ||
                  new Date(b._createdAt || 0).getTime() - new Date(a._createdAt || 0).getTime(),
              )
          : filteredProducts
              .slice()
              .sort(
                (a, b) =>
                  new Date(b._createdAt || 0).getTime() - new Date(a._createdAt || 0).getTime(),
              );

  const facetRows: FacetRow[] = await sanityClient.fetch(
    `*[_type=="product" && (!defined(stock) || stock > 0)]{
      brand,
      categories,
      specs{
        processor,
        memory,
        gpu,
        display,
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
    return values.sort((a, b) => (a ?? "").localeCompare(b ?? "", "hu", { sensitivity: "base" }));
  };

  const brands = collect(facetRows, (x) => x.brand);
  const cpus = collect(facetRows, (x) => x.specs?.processor);
  const memories = collect(facetRows, (x) => x.specs?.memory);
  const gpus = collect(facetRows, (x) => x.specs?.gpu);
  const displays = collect(facetRows, (x) => x.specs?.display);
  const storages = collect(facetRows, (x) => x.specs?.storage);
  const priceValues = productsWithEffective
    .map((p) => p.effectivePrice as number)
    .filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  const ceilPrice = priceValues.length ? Math.max(...priceValues) : 0;

  const filterKey = [
    sort,
    q || "",
    brand || "",
    condition || "",
    categories.slice().sort().join(","),
    cpu || "",
    memory || "",
    gpu || "",
    display || "",
    storage || "",
    priceMax ?? "",
  ].join("|");

  const filterProps: FilterFormProps = {
    sort,
    q,
    brand,
    condition,
    priceMax,
    categories,
    cpu,
    memory,
    gpu,
    display,
    storage,
    categoryOptions,
    brands,
    cpus,
    memories,
    gpus,
    displays,
    storages,
    ceilPrice,
    clearHref: "/kategoria/osszes",
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
          <span className="text-foreground">
            {(() => {
              if (categories.length === 1) return categoryLabelMap[categories[0]] || "Laptopok";
              if (categories.length > 1) return "Szűrt laptopok";
              if (brand) return `${brand} laptopok`;
              return "Összes laptop";
            })()}
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-lg shadow-black/30">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              {(() => {
                const primaryCat =
                  categories.length === 1 ? categoryLabelMap[categories[0]] : categories.length > 1 ? "Szűrt" : null;
                const conditionLabel = condition ? conditionLabelMap[condition] || condition : null;
                const hasMultipleCats = categories.length > 1;
                const kicker = primaryCat
                  ? primaryCat
                  : brand
                    ? brand
                    : conditionLabel
                      ? conditionLabel
                      : "Összes";
                let title = "Minden laptop";
                if (brand && primaryCat) {
                  title = `${brand} ${primaryCat.toLowerCase()} laptopok`;
                } else if (primaryCat && !hasMultipleCats) {
                  title = `${primaryCat} laptopok`;
                } else if (brand) {
                  title = `${brand} laptopok`;
                } else if (hasMultipleCats) {
                  title = "Szűrt laptopok";
                } else if (conditionLabel) {
                  title = `${conditionLabel} laptopok`;
                }
                if (conditionLabel && !title.toLowerCase().includes(conditionLabel.toLowerCase())) {
                  title = `${title} – ${conditionLabel}`;
                }
                const subtitle =
                  hasMultipleCats || primaryCat || brand || conditionLabel
                    ? "Szűrt találatok a beállított feltételekkel."
                    : "Márkák, kategóriák, specifikációk szerint.";
                return (
                  <>
                    <div className="text-xs uppercase text-primary">{kicker}</div>
                    <h1 className="text-2xl font-extrabold">{title}</h1>
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                  </>
                );
              })()}
            </div>
            <div className="flex flex-col items-end gap-2 text-xs font-semibold text-muted-foreground sm:flex-row sm:items-center sm:gap-3">
              <SortSelect
                sort={sort}
                params={{ q, brand, categories, cpu, memory, gpu, display, storage, priceMax }}
              />
              <div className="text-muted-foreground">{sortedProducts.length} találat</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Mobile dropdown */}
          <div className="w-full lg:hidden">
            <details className="rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-foreground">
                Szűrők
                <span className="text-lg transition-transform duration-200 open:rotate-180">▼</span>
              </summary>
              <div className="mt-3 border-t border-border pt-3">
                <FilterForm key={filterKey} {...filterProps} />
              </div>
            </details>
          </div>

          {/* Desktop sidebar */}
          <aside className="hidden h-max w-[260px] shrink-0 rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30 lg:block">
            <div className="mb-4 text-lg font-extrabold">Szűrők</div>
            <FilterForm key={filterKey} {...filterProps} />
          </aside>

          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {!sortedProducts.length && (
              <div className="col-span-full rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-lg shadow-black/20">
                <div className="text-lg font-bold text-foreground">Sajnáljuk, nincs találat.</div>
                <p className="mt-1">
                  A megadott szűrőkre most nem találtunk terméket. Tekintsd meg a teljes kínálatot:
                </p>
                <Link
                  href="/kategoria/osszes"
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/60"
                >
                  Összes laptop megtekintése
                </Link>
              </div>
            )}
            {sortedProducts.map((item: ProductHit) => {
              const firstImage = item.images?.[0]?.url;
              const discounts = Array.isArray(item.discounts) ? item.discounts : [];
              const bestDiscount =
                discounts
                  .map((d) => {
                    if (!d || typeof d.amount !== "number") return 0;
                    if (d.type === "percent") return Math.round(item.priceHuf * d.amount * 0.01);
                    if (d.type === "fixed") return d.amount;
                    return 0;
                  })
                  .filter((v) => v > 0)
                  .sort((a, b) => b - a)[0] ?? 0;
              const rawFinalPrice = item.priceHuf - bestDiscount;
              const invalidDiscount = rawFinalPrice < 0 || item.invalidDiscount;
              const finalPrice = invalidDiscount ? item.priceHuf : rawFinalPrice;
              const compareAt =
                !invalidDiscount && bestDiscount > 0
                  ? item.priceHuf
                  : typeof item.compareAtHuf === "number" && item.compareAtHuf > finalPrice
                    ? item.compareAtHuf
                    : undefined;
              const specs = item.specs || {};
              const specList = [
                specs.processor,
                specs.memory,
                specs.storage,
                specs.gpu,
                specs.display,
              ].filter(Boolean) as string[];

              return (
                <div
                  key={item._id || item.slug}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-lg shadow-black/30 transition duration-200 hover:scale-105"
                >
                  <Link
                    href={`/termek/${item.slug}`}
                    className="block overflow-hidden rounded-lg border border-border"
                  >
                    <div className="relative aspect-square w-full">
                      <Image
                        fill
                        src={
                          firstImage ||
                          "https://dummyimage.com/600x400/0f1320/ffffff&text=wellcomp"
                        }
                      alt={item.name}
                      className="object-contain bg-white transition duration-300 hover:scale-105"
                      sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 80vw"
                      unoptimized
                    />
                    </div>
                  </Link>
                  <div className="flex flex-col gap-1">
                    <Link
                      href={`/termek/${item.slug}`}
                      className="font-semibold hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    <div className="flex flex-col items-start gap-1">
                      {compareAt && (
                        <span className="text-sm font-semibold text-muted-foreground line-through">
                          {new Intl.NumberFormat("hu-HU").format(compareAt)} Ft
                        </span>
                      )}
                      <span
                        className={`text-2xl font-extrabold ${compareAt ? "text-primary" : "text-foreground"}`}
                      >
                        {new Intl.NumberFormat("hu-HU").format(finalPrice)} Ft
                      </span>
                    </div>
                  </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.shortDescription}
                </p>
                  {specList.length > 0 && (
                    <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                      {specList.slice(0, 5).map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  )}
                  <Link
                    href={`/termek/${item.slug}`}
                    className="mt-auto inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30"
                  >
                    Megnézem
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
