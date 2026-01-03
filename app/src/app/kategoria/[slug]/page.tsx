import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";
import Image from "next/image";
import { SortSelect } from "@/components/sort-select";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const categoryMap: Record<string, string> = {
  altalanos: "GENERAL",
  uzleti: "BUSINESS",
  gamer: "GAMING",
  workstation: "WORKSTATION",
  erintokepernyos: "TOUCH",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
type ProductHit = {
  _id?: string;
  slug: string;
  name: string;
  priceHuf: number;
  featured?: boolean;
  _createdAt?: string;
  shortDescription?: string;
  specs?: {
    processor?: string;
    memory?: string;
    storage?: string;
    gpu?: string;
    display?: string;
  };
  images?: { url: string; alt?: string | null }[];
};

type FacetRow = {
  brand?: string;
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
  brand?: string;
  q?: string;
  cpu?: string;
  memory?: string;
  gpu?: string;
  display?: string;
  storage?: string;
  brands: string[];
  cpus: string[];
  memories: string[];
  gpus: string[];
  displays: string[];
  storages: string[];
  clearHref: string;
};

function FilterForm({
  sort,
  brand,
  q,
  cpu,
  memory,
  gpu,
  display,
  storage,
  brands,
  cpus,
  memories,
  gpus,
  displays,
  storages,
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
          className="select-icon w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
          placeholder="Keresés név/leírás"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Márka</label>
        <select
          name="brand"
          defaultValue={brand || ""}
          className="select-icon w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
        >
          <option value="">Összes</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Processzor</label>
        <select
          name="cpu"
          defaultValue={cpu || ""}
          className="select-icon w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
        >
          <option value="">Összes</option>
          {cpus.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Memória</label>
        <select
          name="memory"
          defaultValue={memory || ""}
          className="select-icon w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
        >
          <option value="">Összes</option>
          {memories.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase text-muted-foreground">
          Grafikus vezérlő
        </label>
        <select
          name="gpu"
          defaultValue={gpu || ""}
          className="select-icon w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
        >
          <option value="">Összes</option>
          {gpus.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Kijelző mérete</label>
        <select
          name="display"
          defaultValue={display || ""}
          className="select-icon w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
        >
          <option value="">Összes</option>
          {displays.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Háttértár</label>
        <select
          name="storage"
          defaultValue={storage || ""}
          className="select-icon w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
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
  const q = typeof search.q === "string" && search.q ? search.q : undefined;
  const rawSort = typeof search.sort === "string" ? search.sort : "latest";
  const sort = rawSort === "default" ? "latest" : rawSort;
  const cpu = typeof search.cpu === "string" && search.cpu ? search.cpu : undefined;
  const memory = typeof search.memory === "string" && search.memory ? search.memory : undefined;
  const gpu = typeof search.gpu === "string" && search.gpu ? search.gpu : undefined;
  const display = typeof search.display === "string" && search.display ? search.display : undefined;
  const storage = typeof search.storage === "string" && search.storage ? search.storage : undefined;
  return { brand, q, sort, cpu, memory, gpu, display, storage };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const categoryValue = categoryMap[slug];
  if (!categoryValue) notFound();

  const qs = await searchParams;
  const { brand, q, sort, cpu, memory, gpu, display, storage } = parseSearchParams(qs);
  const qNoSpace = q ? q.replace(/\s+/g, "") : null;

  const orderBy =
    sort === "price-asc"
      ? [{ field: "priceHuf", direction: "asc" as const }]
      : sort === "price-desc"
        ? [{ field: "priceHuf", direction: "desc" as const }]
        : [{ field: "_createdAt", direction: "desc" as const }];

  const products: ProductHit[] = await sanityClient.fetch<ProductHit[]>(
    `*[_type=="product" && ($category in categories || (!defined(categories) && category==$category)) 
      && (!defined($brand) || lower(brand)==lower($brand))
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
      )
      && (!defined(stock) || stock > 0)
    ]{
      _id,
      name,
      "slug": slug.current,
      priceHuf,
      brand,
      shortDescription,
      specs{
        processor,
        memory,
        gpu,
        display,
        storage,
      },
      featured,
      _createdAt,
      "images": images[]{ "url": asset->url, alt }
    }|order(${orderBy
      .map((o) => `${o.field} ${o.direction}`)
      .join(",")})`,
    {
      category: categoryValue,
      brand: brand ?? null,
      cpu: cpu ?? null,
      memory: memory ?? null,
      gpu: gpu ?? null,
      display: display ?? null,
      storage: storage ?? null,
      q: q ? `${q}*` : null,
      qNoSpace: qNoSpace ? `${qNoSpace}*` : "",
    },
  );

  const sortedProducts =
    sort === "price-asc"
      ? products.slice().sort((a, b) => (a.priceHuf || 0) - (b.priceHuf || 0))
      : sort === "price-desc"
        ? products.slice().sort((a, b) => (b.priceHuf || 0) - (a.priceHuf || 0))
        : sort === "popular"
          ? products
              .slice()
              .sort(
                (a, b) =>
                  Number(b.featured ?? false) - Number(a.featured ?? false) ||
                  new Date(b._createdAt || 0).getTime() - new Date(a._createdAt || 0).getTime(),
              )
          : products
              .slice()
              .sort(
                (a, b) =>
                  new Date(b._createdAt || 0).getTime() - new Date(a._createdAt || 0).getTime(),
              );

  const facetRows: FacetRow[] = await sanityClient.fetch(
    `*[_type=="product" && ($category in categories || (!defined(categories) && category==$category)) && (!defined(stock) || stock > 0)]{
      brand,
      specs{
        processor,
        memory,
        gpu,
        display,
        storage
      }
    }`,
    { category: categoryValue },
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

  const filterKey = [sort, brand || "", q || "", cpu || "", memory || "", gpu || "", display || "", storage || ""].join("|");

  const filterProps: FilterFormProps = {
    sort,
    brand,
    q,
    cpu,
    memory,
    gpu,
    display,
    storage,
    brands,
    cpus,
    memories,
    gpus,
    displays,
    storages,
    clearHref: `/kategoria/${slug}`,
  };

  const categoryLabel =
    {
      GENERAL: "Általános laptopok",
      BUSINESS: "Üzleti laptopok",
      GAMING: "Gamer laptopok",
      WORKSTATION: "Workstation laptopok",
      TOUCH: "Érintőképernyős laptopok",
    }[categoryValue] || categoryValue;

  return (
    <div className="min-h-screen text-foreground">
      <ProductHeader />
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-8 pb-16 pt-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link className="hover:text-primary" href="/">
            Főoldal
          </Link>
          <span>/</span>
          <span className="text-foreground">{categoryLabel}</span>
        </div>

        <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-lg shadow-black/30">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase text-primary">Kategória</div>
              <h1 className="text-2xl font-extrabold">{categoryLabel}</h1>
              <p className="text-sm text-muted-foreground">
                Szűrés márka, specifikációk és keresés alapján.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 text-xs font-semibold text-muted-foreground sm:flex-row sm:items-center sm:gap-3">
              <SortSelect
                sort={sort}
                params={{ brand, q, cpu, memory, gpu, display, storage }}
                id="sort-select-category"
              />
              <div className="text-muted-foreground">{sortedProducts.length} találat</div>
            </div>
          </div>
        </div>

        <div className="grid items-start gap-6 md:grid-cols-[260px_1fr]">
          {/* Mobile dropdown */}
          <div className="w-full md:hidden">
            <details className="group rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                Szűrők
                <Image
                  src="/dropdown.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <div className="mt-3 border-t border-border pt-3">
                <FilterForm key={filterKey} {...filterProps} />
              </div>
            </details>
          </div>

          {/* Desktop sidebar */}
          <aside className="hidden h-max rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30 md:block">
            <div className="mb-4 text-lg font-extrabold">Szűrők</div>
            <FilterForm key={filterKey} {...filterProps} />
          </aside>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sortedProducts.map((item: ProductHit) => {
              const firstImage = item.images?.[0]?.url;
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
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/termek/${item.slug}`}
                      className="font-semibold hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
                      {new Intl.NumberFormat("hu-HU").format(item.priceHuf)} Ft
                    </span>
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
