"use client";

import { useMemo, useState } from "react";
import { AddToCartButton } from "./add-to-cart-button";

type UpgradeOption = { label: string; deltaHuf: number };

type Props = {
  productSlug: string;
  productName: string;
  basePrice: number;
  memoryOptions?: UpgradeOption[];
  ssdOptions?: UpgradeOption[];
  wifiOptions?: UpgradeOption[];
  disabled?: boolean;
};

export function UpgradePicker({
  productSlug,
  productName,
  basePrice,
  memoryOptions = [],
  ssdOptions = [],
  wifiOptions = [],
  disabled = false,
}: Props) {
  const [memoryIdx, setMemoryIdx] = useState<number>(-1);
  const [ssdIdx, setSsdIdx] = useState<number>(-1);
  const [wifiIdx, setWifiIdx] = useState<number>(-1);

  const selectedUpgrades = useMemo(() => {
    const ups: UpgradeOption[] = [];
    if (memoryIdx >= 0 && memoryOptions[memoryIdx]) ups.push(memoryOptions[memoryIdx]);
    if (ssdIdx >= 0 && ssdOptions[ssdIdx]) ups.push(ssdOptions[ssdIdx]);
    if (wifiIdx >= 0 && wifiOptions[wifiIdx]) ups.push(wifiOptions[wifiIdx]);
    return ups;
  }, [memoryIdx, memoryOptions, ssdIdx, ssdOptions, wifiIdx, wifiOptions]);

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
