"use client";

import { useMemo } from "react";

type SortOption = { value: string; label: string };

type Props = {
  sort: string;
  params: Record<string, string | number | (string | number)[] | undefined>;
  id?: string;
  options?: SortOption[];
};

const DEFAULT_OPTIONS: SortOption[] = [
  { value: "latest", label: "Legfrissebb" },
  { value: "popular", label: "Legnépszerűbb" },
  { value: "price-asc", label: "Ár növekvő" },
  { value: "price-desc", label: "Ár csökkenő" },
];

export function SortSelect({ sort, params, id = "sort-select", options = DEFAULT_OPTIONS }: Props) {
  const entries = useMemo(() => Object.entries(params), [params]);

  return (
    <form className="flex items-center gap-2 text-sm text-muted-foreground" method="get">
      {entries.map(([key, value]) => {
        if (Array.isArray(value)) {
          return value
            .filter((v) => v !== undefined && v !== "")
            .map((v, idx) => (
              <input key={`${key}-${idx}`} type="hidden" name={key} value={String(v)} />
            ));
        }
        if (value === undefined || value === "") return null;
        return <input key={key} type="hidden" name={key} value={String(value)} />;
      })}
      <label htmlFor={id} className="text-xs font-semibold uppercase">
        Rendezés
      </label>
      <select
        id={id}
        name="sort"
        defaultValue={sort}
        className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground"
        onChange={(e) => {
          const form = e.currentTarget.form;
          if (!form) return;
          if (typeof form.requestSubmit === "function") form.requestSubmit();
          else form.submit();
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </form>
  );
}

