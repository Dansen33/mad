"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Option = { value: string; label: string };

type Props = {
  name: string;
  label: string;
  options: Option[];
  defaultValue?: string;
};

export function FilterSelect({ name, label, options, defaultValue = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onClick);
    return () => document.removeEventListener("pointerdown", onClick);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label || options[0]?.label || "";

  return (
    <div ref={containerRef} className="relative w-full">
      <input type="hidden" name={name} value={value} />
      <label className="text-xs font-semibold uppercase text-muted-foreground">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-1 flex w-full items-center justify-between rounded-lg border border-border bg-secondary px-3 py-2 text-sm font-semibold text-foreground"
      >
        <span className="truncate">{selectedLabel}</span>
        <Image
          src="/dropdown.svg"
          alt=""
          width={16}
          height={16}
          className={`h-4 w-4 shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-xl shadow-black/20">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setValue(opt.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-secondary ${
                opt.value === value ? "bg-secondary font-semibold text-primary" : "text-foreground"
              }`}
            >
              <span className="truncate">{opt.label}</span>
              {opt.value === value && <span className="text-primary">•</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
