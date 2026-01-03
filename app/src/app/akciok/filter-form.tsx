"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PriceSlider } from "@/components/price-slider";

type FacetBucket = {
  brands: string[];
  socs: string[];
  cpus: string[];
  memories: string[];
  gpus: string[];
  storages: string[];
  displays: string[];
  ceilPrice: number;
};

type FacetsByType = Record<"all" | "product" | "pc" | "phone" | "console", FacetBucket>;

type FilterFormProps = {
  sort: string;
  brand?: string;
  type?: string;
  soc?: string;
  cpu?: string;
  memory?: string;
  gpu?: string;
  storage?: string;
  display?: string;
  priceMax?: number;
  clearHref: string;
  filterKey: string;
  facets: FacetsByType;
};

export function FilterForm({
  sort,
  brand,
  type,
  soc,
  cpu,
  memory,
  gpu,
  storage,
  display,
  priceMax,
  clearHref,
  filterKey,
  facets,
}: FilterFormProps) {
  const initialType = type || "";
  const [selectedType, setSelectedType] = useState(initialType);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedType(initialType);
  }, [initialType, filterKey]);

  const facetKey: keyof FacetsByType =
    selectedType === "phone"
      ? "phone"
      : selectedType === "pc"
        ? "pc"
        : selectedType === "console"
          ? "console"
          : selectedType === "product"
            ? "product"
            : "all";

  const currentFacet = facets[facetKey] || facets.all;

  const effectivePriceMax = selectedType === initialType ? priceMax : undefined;

  const priceMaxDefault = useMemo(() => {
    const max = currentFacet?.ceilPrice ?? 0;
    if (typeof effectivePriceMax === "number" && Number.isFinite(effectivePriceMax)) {
      return Math.min(effectivePriceMax, max || 0);
    }
    return max || 0;
  }, [currentFacet?.ceilPrice, effectivePriceMax]);

  const sliderKey = `${facetKey}-${currentFacet?.ceilPrice ?? 0}-${
    selectedType === initialType && typeof priceMax !== "undefined" ? priceMax : "reset"
  }`;

  return (
    <form className="space-y-4" method="get" key={filterKey}>
      <input type="hidden" name="sort" value={sort} />
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Ár</label>
        <PriceSlider
          key={sliderKey}
          name="priceMax"
          min={0}
          max={currentFacet?.ceilPrice || 0}
          defaultValue={priceMaxDefault}
          hiddenMinName="priceMin"
          hiddenMinValue={0}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Terméktípus</label>
        <select
          name="type"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="select-icon w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
        >
          <option value="">Összes</option>
          <option value="product">Laptopok</option>
          <option value="pc">PC</option>
          <option value="phone">Telefonok</option>
          <option value="console">Konzolok</option>
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Márka</label>
        <select
          name="brand"
          defaultValue={brand || ""}
          className="select-icon w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
        >
          <option value="">Összes</option>
          {(currentFacet?.brands || []).map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        {selectedType === "phone" ? (
          <>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Processzor (SoC)</label>
              <select
                name="soc"
                defaultValue={soc || ""}
                className="select-icon w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
              >
                <option value="">Összes</option>
                {(currentFacet?.socs || []).map((v) => (
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
                className="select-icon w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
              >
                <option value="">Összes</option>
                {(currentFacet?.memories || []).map((v) => (
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
                className="select-icon w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
              >
                <option value="">Összes</option>
                {(currentFacet?.storages || []).map((v) => (
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
                className="select-icon w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
              >
                <option value="">Összes</option>
                {(currentFacet?.displays || []).map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : selectedType === "pc" || selectedType === "console" ? (
          <>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Processzor</label>
              <select
                name="cpu"
                defaultValue={cpu || ""}
                className="select-icon w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
              >
                <option value="">Összes</option>
                {(currentFacet?.cpus || []).map((v) => (
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
                className="select-icon w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
              >
                <option value="">Összes</option>
                {(currentFacet?.memories || []).map((v) => (
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
                className="select-icon w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
              >
                <option value="">Összes</option>
                {(currentFacet?.gpus || []).map((v) => (
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
                className="select-icon w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
              >
                <option value="">Összes</option>
                {(currentFacet?.storages || []).map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Processzor</label>
              <select
                name="cpu"
                defaultValue={cpu || ""}
                className="select-icon w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
              >
                <option value="">Összes</option>
                {(currentFacet?.cpus || []).map((v) => (
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
                className="select-icon w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
              >
                <option value="">Összes</option>
                {(currentFacet?.memories || []).map((v) => (
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
                className="select-icon w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
              >
                <option value="">Összes</option>
                {(currentFacet?.gpus || []).map((v) => (
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
                className="select-icon w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
              >
                <option value="">Összes</option>
                {(currentFacet?.storages || []).map((v) => (
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
                className="select-icon w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
              >
                <option value="">Összes</option>
                {(currentFacet?.displays || []).map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
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
