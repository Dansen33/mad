"use client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const [current, setCurrent] = useState(sort || options[0]?.value || "latest");
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrent(sort || options[0]?.value || "latest");
  }, [sort, options]);

  useEffect(() => {
    const handleClickAway = (e: PointerEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", handleClickAway);
    return () => document.removeEventListener("pointerdown", handleClickAway);
  }, []);

  const submitWithValue = (value: string) => {
    setCurrent(value);
    setOpen(false);
    const form = formRef.current;
    if (!form) return;
    const input = form.querySelector<HTMLInputElement>('input[name="sort"]');
    if (input) input.value = value;
    if (typeof form.requestSubmit === "function") form.requestSubmit();
    else form.submit();
  };

  return (
    <form ref={formRef} className="flex items-center gap-2 text-sm text-muted-foreground" method="get">
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
      <input type="hidden" name="sort" value={current} />
      <label htmlFor={id} className="text-xs font-semibold uppercase">
        Rendezés
      </label>
      <div ref={containerRef} className="relative">
        <button
          id={id}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex w-[min(68vw,260px)] items-center justify-between gap-3 rounded-xl border border-border bg-secondary px-4 py-3 text-sm font-semibold text-foreground shadow-md shadow-black/10 sm:w-auto sm:min-w-[200px]"
        >
          <span className="truncate">
            {options.find((opt) => opt.value === current)?.label || "Rendezés"}
          </span>
          <Image
            src="/dropdown.svg"
            alt=""
            width={20}
            height={20}
            className={`h-5 w-5 shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <div
            role="listbox"
            className="absolute right-0 z-30 mt-2 w-[min(72vw,280px)] min-w-[220px] rounded-2xl border border-border bg-card/95 p-1 shadow-xl shadow-black/25 backdrop-blur-sm sm:w-[240px]"
          >
            {options.map((opt) => {
              const active = opt.value === current;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => submitWithValue(opt.value)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm text-foreground transition hover:bg-secondary ${
                    active ? "bg-secondary font-semibold" : ""
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {active && <span className="text-primary">•</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </form>
  );
}
