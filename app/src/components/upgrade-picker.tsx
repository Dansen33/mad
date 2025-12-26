"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AddToCartButton } from "./add-to-cart-button";

type UpgradeOption = { label: string; deltaHuf: number };
type CaseOption = { label: string; deltaHuf: number; image?: string | null };

type Props = {
  productSlug: string;
  productName: string;
  basePrice: number;
  memoryOptions?: UpgradeOption[];
  ssdOptions?: UpgradeOption[];
  wifiOptions?: UpgradeOption[];
  caseOptions?: CaseOption[];
  onCaseChange?: (imageUrl?: string | null) => void;
  disabled?: boolean;
};

export function UpgradePicker({
  productSlug,
  productName,
  basePrice,
  memoryOptions = [],
  ssdOptions = [],
  wifiOptions = [],
  caseOptions = [],
  onCaseChange,
  disabled = false,
}: Props) {
  const [memoryIdx, setMemoryIdx] = useState<number>(-1);
  const [ssdIdx, setSsdIdx] = useState<number>(-1);
  const [wifiIdx, setWifiIdx] = useState<number>(-1);
  const [caseIdx, setCaseIdx] = useState<number>(-1);
  const [caseOpen, setCaseOpen] = useState(false);

  const selectedCase = caseIdx >= 0 && caseOptions[caseIdx] ? caseOptions[caseIdx] : null;

  const selectedUpgrades = useMemo(() => {
    const ups: UpgradeOption[] = [];
    if (memoryIdx >= 0 && memoryOptions[memoryIdx]) ups.push(memoryOptions[memoryIdx]);
    if (ssdIdx >= 0 && ssdOptions[ssdIdx]) ups.push(ssdOptions[ssdIdx]);
    if (wifiIdx >= 0 && wifiOptions[wifiIdx]) ups.push(wifiOptions[wifiIdx]);
    if (caseIdx >= 0 && caseOptions[caseIdx]) ups.push(caseOptions[caseIdx]);
    return ups;
  }, [memoryIdx, memoryOptions, ssdIdx, ssdOptions, wifiIdx, wifiOptions, caseIdx, caseOptions]);

  const totalPrice = selectedUpgrades.reduce((sum, u) => sum + u.deltaHuf, basePrice);

  return (
    <div className="space-y-3 rounded-xl border border-border bg-secondary/60 p-3">
      <div className="text-xs uppercase tracking-wide text-primary">Bővítések</div>
      {memoryOptions.length > 0 && (
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Memória</label>
          <select
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
            value={memoryIdx}
            onChange={(e) => setMemoryIdx(Number(e.target.value))}
          >
            <option value={-1}>Nincs bővítés</option>
            {memoryOptions.map((opt, idx) => (
              <option key={opt.label} value={idx}>
                {opt.label} (+{new Intl.NumberFormat("hu-HU").format(opt.deltaHuf)} Ft)
              </option>
            ))}
          </select>
        </div>
      )}

      {ssdOptions.length > 0 && (
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase text-muted-foreground">SSD</label>
          <select
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
            value={ssdIdx}
            onChange={(e) => setSsdIdx(Number(e.target.value))}
          >
            <option value={-1}>Nincs bővítés</option>
            {ssdOptions.map((opt, idx) => (
              <option key={opt.label} value={idx}>
                {opt.label} (+{new Intl.NumberFormat("hu-HU").format(opt.deltaHuf)} Ft)
              </option>
            ))}
          </select>
        </div>
      )}

      {wifiOptions.length > 0 && (
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Wifi - Bluetooth</label>
          <select
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
            value={wifiIdx}
            onChange={(e) => setWifiIdx(Number(e.target.value))}
          >
            <option value={-1}>Nincs bővítés</option>
            {wifiOptions.map((opt, idx) => (
              <option key={opt.label} value={idx}>
                {opt.label} (+{new Intl.NumberFormat("hu-HU").format(opt.deltaHuf)} Ft)
              </option>
            ))}
          </select>
        </div>
      )}

      {caseOptions.length > 0 && (
        <div className="space-y-1 relative">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Számítógépház</label>
          <button
            type="button"
            onClick={() => setCaseOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm font-normal text-foreground hover:border-primary/60"
          >
            <span className="text-sm">
              {selectedCase ? selectedCase.label : "Nincs bővítés"}
            </span>
            <Image
              src="/dropdown.svg"
              alt=""
              width={16}
              height={16}
              className={`h-4 w-4 transition-transform duration-200 ${caseOpen ? "rotate-180" : ""}`}
            />
          </button>
          {caseOpen && (
            <div className="absolute z-10 mt-1 w-full rounded-xl border border-border bg-card shadow-lg shadow-black/20">
              <button
                type="button"
                onClick={() => {
                  setCaseIdx(-1);
                  onCaseChange?.(null);
                  setCaseOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition ${
                  caseIdx === -1 ? "bg-secondary" : "hover:bg-secondary/70"
                }`}
              >
                <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border border-border bg-white" />
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">Nincs bővítés</span>
                  <span className="text-xs text-muted-foreground">Felár nélkül</span>
                </div>
              </button>
              {caseOptions.map((opt, idx) => (
                <button
                  type="button"
                  key={opt.label}
                  onClick={() => {
                    setCaseIdx(idx);
                    onCaseChange?.(opt.image || null);
                    setCaseOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition ${
                    caseIdx === idx ? "bg-secondary" : "hover:bg-secondary/70"
                  }`}
                >
                  <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border border-border bg-white">
                    {opt.image ? (
                      <Image
                        src={opt.image}
                        alt={opt.label}
                        fill
                        className="object-contain"
                        sizes="40px"
                        unoptimized
                      />
                    ) : (
                      <div className="h-full w-full bg-secondary" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{opt.label}</span>
                    <span className="text-xs text-muted-foreground">
                      +{new Intl.NumberFormat("hu-HU").format(opt.deltaHuf)} Ft
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">Végösszeg</span>
        <span className="text-xl font-extrabold text-foreground">
          {new Intl.NumberFormat("hu-HU").format(totalPrice)} Ft
        </span>
      </div>

      <AddToCartButton
        productSlug={productSlug}
        productName={productName}
        disabled={disabled}
        upgrades={selectedUpgrades}
      />
    </div>
  );
}
