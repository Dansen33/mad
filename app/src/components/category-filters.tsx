"use client";

type Props = {
  brands: string[];
  defaultBrand?: string;
  defaultQ?: string;
  defaultSort?: string;
  categories?: { label: string; value: string }[];
  defaultCategories?: string[];
};

export function CategoryFilters({
  brands,
  defaultBrand,
  defaultQ,
  defaultSort = "default",
  categories = [],
  defaultCategories = [],
}: Props) {
  return (
    <form
      className="flex flex-wrap items-center gap-2"
      method="get"
      onChange={(e) => (e.currentTarget as HTMLFormElement).requestSubmit()}
    >
      <input
        name="q"
        defaultValue={defaultQ ?? ""}
        className="w-48 rounded-full border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none"
        placeholder="Keresés"
      />
      <select
        name="brand"
        defaultValue={defaultBrand ?? ""}
        className="rounded-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none"
      >
        <option value="">Összes márka</option>
        {brands.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
      <select
        name="sort"
        defaultValue={defaultSort}
        className="rounded-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none"
      >
        <option value="default">Alapértelmezett (legnépszerűbb)</option>
        <option value="price-asc">Ár szerint növekvő</option>
        <option value="price-desc">Ár szerint csökkenő</option>
        <option value="latest">Legújabbak</option>
        <option value="discount">Legnagyobb kedvezmény</option>
      </select>
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-full border border-border bg-secondary px-3 py-2 text-xs">
          {categories.map((cat) => {
            const isChecked = defaultCategories.includes(cat.value);
            return (
              <label key={cat.value} className="inline-flex items-center gap-1">
                <input
                  type="checkbox"
                  name="category"
                  value={cat.value}
                  defaultChecked={isChecked}
                  className="accent-primary"
                />
                <span>{cat.label}</span>
              </label>
            );
          })}
        </div>
      )}
      <button
        type="submit"
        className="rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30"
      >
        Szűrés
      </button>
    </form>
  );
}
