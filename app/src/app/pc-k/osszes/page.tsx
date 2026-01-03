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

type PcHit = {
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
  stock?: number;
  category?: string;
  shortDescription?: string;
  info?: string;
  note?: string;
  specs?: {
    processor?: string;
    cooler?: string;
    motherboard?: string;
    memory?: string;
    gpu?: string;
    ssd?: string;
    case?: string;
    psu?: string;
    wifi?: string;
    bluetooth?: string;
    os?: string;
  };
  images?: { url: string; alt?: string | null }[];
  autoCategory?: string | null;
};

type FacetRow = {
  brand?: string;
  condition?: string;
  category?: string;
  specs?: {
    processor?: string;
    memory?: string;
    gpu?: string;
    ssd?: string;
  };
};

type FilterFormProps = {
  sort: string;
  brand?: string;
  condition?: string;
  q?: string;
  category?: string;
  cpu?: string;
  memory?: string;
  gpu?: string;
  ssd?: string;
  priceMin?: number;
  priceMax?: number;
  ceilPrice: number;
  brands: string[];
  conditionOptions: { value: string; label: string }[];
  categories: string[];
  cpus: string[];
  memories: string[];
  gpus: string[];
  ssds: string[];
};

const categoryLabelMap: Record<string, string> = {
  "gamer-pc-olcso-300-alatt": "Belépő kategóriás Gamer PC 300.000 Ft-ig",
  "gamer-pc-300-600": "Középkategóriás Gamer PC 300.000-600.000 Ft-ig",
  "gamer-pc-600-felett": "Felsőkategóriás Gamer PC 600.000 Ft-tól",
  "professzionalis-munkaallomas": "Professzionális Munkaállomások",
  "felujitott-gamer-pc": "Felújított Gamer PC",
};

const deriveCategoryFromPrice = (price?: number | null) => {
  if (typeof price !== "number" || !Number.isFinite(price)) return null;
  if (price < 300000) return "gamer-pc-olcso-300-alatt";
  if (price < 600000) return "gamer-pc-300-600";
  return "gamer-pc-600-felett";
};

function FilterForm({
  sort,
  brand,
  condition,
  q,
  category,
  cpu,
  memory,
  gpu,
  ssd,
  priceMin,
  priceMax,
  ceilPrice,
  brands,
  conditionOptions,
  categories,
  cpus,
  memories,
  gpus,
  ssds,
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
          options={conditionOptions.map((opt) => ({ value: opt.value, label: opt.label }))}
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
          label="Kategória"
          options={[
            { value: "", label: "Összes" },
            ...categories.map((v) => ({ value: v, label: categoryLabelMap[v] || v })),
          ]}
          defaultValue={category || ""}
        />
      </div>
      <div className="space-y-1">
        <FilterSelect
          name="cpu"
          label="Processzor"
          options={[{ value: "", label: "Összes" }, ...cpus.map((v) => ({ value: v, label: v }))]}
          defaultValue={cpu || ""}
        />
      </div>
      <div className="space-y-1">
        <FilterSelect
          name="memory"
          label="Memória"
          options={[{ value: "", label: "Összes" }, ...memories.map((v) => ({ value: v, label: v }))]}
          defaultValue={memory || ""}
        />
      </div>
      <div className="space-y-1">
        <FilterSelect
          name="gpu"
          label="Grafikus vezérlő"
          options={[{ value: "", label: "Összes" }, ...gpus.map((v) => ({ value: v, label: v }))]}
          defaultValue={gpu || ""}
        />
      </div>
      <div className="space-y-1">
        <FilterSelect
          name="ssd"
          label="Háttértár"
          options={[{ value: "", label: "Összes" }, ...ssds.map((v) => ({ value: v, label: v }))]}
          defaultValue={ssd || ""}
        />
      </div>
      <button
        type="submit"
        className="w-full cursor-pointer rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30 transition duration-150 hover:scale-[1.02]"
      >
        Szűrés
      </button>
      <Link
        href="/pc-k/osszes"
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
  const category = typeof search.category === "string" && search.category ? search.category : undefined;
  const cpu = typeof search.cpu === "string" && search.cpu ? search.cpu : undefined;
  const memory = typeof search.memory === "string" && search.memory ? search.memory : undefined;
  const gpu = typeof search.gpu === "string" && search.gpu ? search.gpu : undefined;
  const ssd = typeof search.ssd === "string" && search.ssd ? search.ssd : undefined;
  const priceMin = typeof search.priceMin === "string" && search.priceMin ? Number(search.priceMin) : undefined;
  const priceMax = typeof search.priceMax === "string" && search.priceMax ? Number(search.priceMax) : undefined;
  const page =
    typeof search.page === "string" && Number.isFinite(Number(search.page)) && Number(search.page) > 0
      ? Number(search.page)
      : 1;
  return { brand, condition, q, sort, category, cpu, memory, gpu, ssd, priceMin, priceMax, page };
}

export default async function PcOsszes({ searchParams }: { searchParams: SearchParams }) {
  const qs = await searchParams;
  const { brand, condition, q, sort, category, cpu, memory, gpu, ssd, priceMin, priceMax, page } =
    parseSearchParams(qs);
  const qNoSpace = q ? q.replace(/\s+/g, "") : "";

  const orderBy = [{ field: "_createdAt", direction: "desc" as const }];
  const pageSize = 9;

  const pcs: PcHit[] = await sanityClient.fetch(
    `*[_type=="pc"
      && (!defined($brand) || lower(brand)==lower($brand))
      && (!defined($condition) || lower(condition)==lower($condition))
      && (!defined($cat) || lower(category)==lower($cat) || select(
        defined(priceHuf) && priceHuf < 300000 => "gamer-pc-olcso-300-alatt",
        defined(priceHuf) && priceHuf < 600000 => "gamer-pc-300-600",
        defined(priceHuf) && priceHuf >= 600000 => "gamer-pc-600-felett",
        ""
      ) == lower($cat))
      && (!defined($cpu) || lower(specs.processor)==lower($cpu))
      && (!defined($memory) || lower(specs.memory)==lower($memory))
      && (!defined($gpu) || lower(specs.gpu)==lower($gpu))
      && (!defined($ssd) || lower(specs.ssd)==lower($ssd))
      && (
        $q=="" ||
        lower(name) match lower($q) ||
        lower(shortDescription) match lower($q) ||
        lower(info) match lower($q) ||
        lower(note) match lower($q) ||
        lower(specs.processor) match lower($q) || lower(specs.processor) match lower($qNoSpace) ||
        lower(specs.memory) match lower($q) || lower(specs.memory) match lower($qNoSpace) ||
        lower(specs.gpu) match lower($q) || lower(specs.gpu) match lower($qNoSpace) ||
        lower(specs.ssd) match lower($q) || lower(specs.ssd) match lower($qNoSpace)
      )
      && (!defined(stock) || stock > 0)
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
      featured,
      _createdAt,
      brand,
      stock,
      category,
      shortDescription,
      info,
      note,
      specs{
        processor,
        cooler,
        motherboard,
        memory,
        gpu,
        ssd,
        case,
        psu,
        wifi,
        bluetooth,
        os
      },
      "images": images[]{ "url": asset->url, alt }
    }|order(${orderBy.map((o) => `${o.field} ${o.direction}`).join(",")})`,
    {
      brand: brand ?? null,
      condition: condition ?? null,
      cat: category ?? null,
      cpu: cpu ?? null,
      memory: memory ?? null,
      gpu: gpu ?? null,
      ssd: ssd ?? null,
      q: q ? `${q}*` : "",
      qNoSpace: qNoSpace ? `${qNoSpace}*` : "",
      pmin: null,
      pmax: null,
    },
  );

  const pcsWithEffective = pcs.map((pc) => {
    const base = typeof pc.priceHuf === "number" ? pc.priceHuf : 0;
    const discounts = Array.isArray(pc.discounts) ? pc.discounts : [];
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
      pc.invalidDiscount || base - bestDiscount < 0
        ? base
        : Math.max(0, base - bestDiscount);
    const autoCategory = deriveCategoryFromPrice(final || base);
    return { ...pc, effectivePrice: final, autoCategory };
  });

  const pcsWithCategory = pcsWithEffective.map((pc) => ({
    ...pc,
    category: pc.category || pc.autoCategory || pc.category,
  }));

  const filteredPcs = pcsWithCategory.filter((pc) => {
    if (category) {
      const effectiveCat = pc.category || pc.autoCategory;
      if (effectiveCat !== category) return false;
    }
    if (typeof priceMin === "number" && Number.isFinite(priceMin)) {
      if (pc.effectivePrice < priceMin) return false;
    }
    if (typeof priceMax === "number" && Number.isFinite(priceMax)) {
      if (pc.effectivePrice > priceMax) return false;
    }
    return true;
  });

  const sortedPcs =
    sort === "price-asc"
      ? filteredPcs.slice().sort((a, b) => a.effectivePrice - b.effectivePrice)
      : sort === "price-desc"
        ? filteredPcs.slice().sort((a, b) => b.effectivePrice - a.effectivePrice)
        : sort === "popular"
          ? filteredPcs
              .slice()
              .sort(
                (a, b) =>
                  Number(b.featured ?? false) - Number(a.featured ?? false) ||
                  new Date(b._createdAt || 0).getTime() - new Date(a._createdAt || 0).getTime(),
              )
          : filteredPcs
              .slice()
              .sort(
                (a, b) =>
                  new Date(b._createdAt || 0).getTime() - new Date(a._createdAt || 0).getTime(),
              );

  const facetRows: FacetRow[] = await sanityClient.fetch(
    `*[_type=="pc" && (!defined(stock) || stock > 0)]{
      brand,
      condition,
      category,
      priceHuf,
      specs{
        processor,
        memory,
        gpu,
        ssd
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
  const conditionOptions = ["", ...collect(facetRows, (x) => x.condition)]
    .filter((v, idx, arr) => arr.indexOf(v) === idx)
    .map((v) => ({
      value: v,
      label: v === "" ? "Összes" : v === "UJ" ? "Új" : v === "FELUJITOTT" ? "Felújított" : v,
    }));
  const categories = Array.from(
    new Set(
      pcsWithCategory
        .map((x) => x.category || x.autoCategory)
        .filter((v): v is string => typeof v === "string" && v.trim().length > 0),
    ),
  ).sort((a, b) => a.localeCompare(b, "hu", { sensitivity: "base" }));
  const cpus = collect(facetRows, (x) => x.specs?.processor);
  const memories = collect(facetRows, (x) => x.specs?.memory);
  const gpus = collect(facetRows, (x) => x.specs?.gpu);
  const ssds = collect(facetRows, (x) => x.specs?.ssd);
  const priceValues = pcsWithEffective
    .map((x) => x.effectivePrice)
    .filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  const ceilPrice = priceValues.length ? Math.max(...priceValues) : 1000000;

  const filterKey = [
    sort,
    brand || "",
    condition || "",
    category || "",
    q || "",
    cpu || "",
    memory || "",
    gpu || "",
    ssd || "",
    priceMin ?? "",
    priceMax ?? "",
  ].join("|");
  const filterProps: FilterFormProps = {
    sort,
    brand,
    condition,
    q,
    category,
    cpu,
    memory,
    gpu,
    ssd,
    priceMin,
    priceMax,
    ceilPrice,
    brands,
    conditionOptions,
    categories,
    cpus,
    memories,
    gpus,
    ssds,
  };

  const categoryTitleMap = categoryLabelMap;
  const conditionLabelMap: Record<string, string> = { UJ: "Új", FELUJITOTT: "Felújított" };
  const conditionLabel = condition ? conditionLabelMap[condition] || condition : null;
  const baseTitle = category ? categoryTitleMap[category] || "PC" : "Összes PC";
  let pageTitle = baseTitle;
  if (brand && category) pageTitle = `${brand} ${baseTitle.toLowerCase()}`;
  else if (brand) pageTitle = `${brand} PC`;
  if (conditionLabel) pageTitle = `${pageTitle} – ${conditionLabel}`;
  const pageSubtitle =
    category || brand || conditionLabel
      ? "Szűrt találatok a beállított feltételekkel."
      : "Gamer és munkaállomás konfigurációk szűrőkkel.";

  const formatPrice = (value?: number) =>
    typeof value === "number" ? `${new Intl.NumberFormat("hu-HU").format(value)} Ft` : "Árért érdeklődj";
  const totalPcs = sortedPcs.length;
  const totalPages = Math.max(1, Math.ceil(totalPcs / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const pageItems = sortedPcs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const buildPageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    const append = (key: string, value?: string | number) => {
      if (value === undefined || value === "") return;
      params.set(key, String(value));
    };
    append("sort", sort);
    append("brand", brand);
    append("condition", condition);
    append("category", category);
    append("q", q);
    append("cpu", cpu);
    append("memory", memory);
    append("gpu", gpu);
    append("ssd", ssd);
    append("priceMin", priceMin);
    append("priceMax", priceMax);
    append("page", targetPage);
    const qs = params.toString();
    return qs ? `/pc-k/osszes?${qs}` : "/pc-k/osszes";
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
          <span className="text-foreground">PC</span>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase text-primary">PC-k</div>
              <h1 className="text-2xl font-extrabold">{pageTitle}</h1>
              <p className="text-sm text-muted-foreground">{pageSubtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
              <SortSelect
                sort={sort}
                params={{ brand, category, q, cpu, memory, gpu, ssd, priceMin, priceMax }}
              />
              <div className="text-muted-foreground">{totalPcs} találat</div>
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
                    href="/pc-k/osszes"
                    className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/60"
                  >
                    Összes PC megtekintése
                  </Link>
                </div>
              )}
              {pageItems.map((pc, idx) => {
                const firstImage = pc.images?.[0]?.url;
                const specs = pc.specs || {};
                const specList = [specs.processor, specs.gpu, specs.memory, specs.ssd].filter(Boolean).slice(0, 3);
                const discounts = Array.isArray(pc.discounts) ? pc.discounts : [];
                const basePrice = typeof pc.priceHuf === "number" ? pc.priceHuf : undefined;
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
                  (typeof computedFinal === "number" && computedFinal < 0) || pc.invalidDiscount || false;
                const finalPrice =
                  !invalidDiscount && typeof computedFinal === "number"
                    ? computedFinal
                    : typeof pc.finalPriceHuf === "number"
                      ? pc.finalPriceHuf
                      : basePrice;
                const compareAt =
                  !invalidDiscount && typeof finalPrice === "number" && bestDiscount > 0
                    ? basePrice
                    : typeof pc.compareAtHuf === "number" && typeof finalPrice === "number" && pc.compareAtHuf > finalPrice
                      ? pc.compareAtHuf
                      : undefined;
                return (
                  <div
                    key={`${pc.slug || pc._id || pc.name || "pc"}-${idx}`}
                    className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30 transition duration-200 hover:scale-105"
                  >
                    <div className="relative h-48 overflow-hidden rounded-xl border border-border bg-secondary">
                      {firstImage ? (
                        <Image
                          src={firstImage}
                          alt={pc.images?.[0]?.alt || pc.name}
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
                      <div className="text-xs uppercase text-primary">{pc.brand}</div>
                      <h3 className="text-lg font-bold leading-tight text-foreground">
                        <Link href={`/pc-k/${pc.slug}`} className="hover:text-primary">
                          {pc.name}
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
                          href={`/pc-k/${pc.slug}`}
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
