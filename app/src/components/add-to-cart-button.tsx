"use client";

import { useEffect, useState } from "react";

type Props = {
  productSlug: string;
  productName?: string;
  disabled?: boolean;
  upgrades?: { label: string; deltaHuf: number }[];
};

export function AddToCartButton({ productSlug, productName, disabled = false, upgrades = [] }: Props) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleAdd = async () => {
    try {
      setLoading(true);
      setAdded(false);
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: productSlug, quantity: 1, upgrades }),
      });
      if (!res.ok) {
        console.error("Add to cart failed", res.status, res.statusText);
        return;
      }
      const data = await res.json();
      setAdded(true);
      window.dispatchEvent(
        new CustomEvent("cart-updated", {
          detail: {
            totalHuf: data?.totalHuf,
            items: data?.items,
          },
        }),
      );
      if (typeof window !== "undefined" && typeof data?.totalHuf === "number") {
        window.localStorage.setItem("cart-total-huf", String(data.totalHuf));
      }
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 2500);
    return () => clearTimeout(t);
  }, [showToast]);

  return (
    <div className="relative inline-block">
      <button
        onClick={handleAdd}
        disabled={loading || disabled}
        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30 disabled:opacity-70"
      >
        {disabled ? "Nincs készleten" : loading ? "Hozzáadás..." : added ? "Hozzáadva ✓" : "Kosárba"}
      </button>
      {showToast && (
        <div className="absolute left-1/2 top-[110%] w-64 -translate-x-1/2 rounded-xl border border-border bg-secondary p-3 text-xs shadow-lg shadow-black/40">
          <div className="font-semibold text-foreground">
            Hozzáadva a kosárhoz
          </div>
          <div className="text-muted-foreground">
            {productName ? productName : "A termék"} bekerült a kosárba.
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <a
              href="/kosar"
              className="inline-flex flex-1 items-center justify-center rounded-full bg-primary px-3 py-1 font-semibold text-primary-foreground"
            >
              Kosár megnyitása
            </a>
            <a
              href="/penztar"
              className="inline-flex flex-1 items-center justify-center rounded-full border border-border px-3 py-1 font-semibold text-foreground"
            >
              Fizetés
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
