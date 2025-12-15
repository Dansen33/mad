"use client";

import { useState } from "react";

type Props = {
  name: string;
  min?: number;
  max: number;
  defaultValue: number;
  hiddenMinName?: string;
  hiddenMinValue?: number;
};

export function PriceSlider({
  name,
  min = 0,
  max,
  defaultValue,
  hiddenMinName,
  hiddenMinValue = 0,
}: Props) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="space-y-2 rounded-lg border border-border bg-secondary p-3">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{new Intl.NumberFormat("hu-HU").format(min)} Ft</span>
        <span>{new Intl.NumberFormat("hu-HU").format(max)} Ft</span>
      </div>
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        step={1}
        className="w-full"
      />
      {hiddenMinName && <input type="hidden" name={hiddenMinName} value={hiddenMinValue} />}
      <div className="text-right text-xs text-muted-foreground">
        Max: {new Intl.NumberFormat("hu-HU").format(value)} Ft
      </div>
    </div>
  );
}
