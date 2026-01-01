"use client";

import { create } from "zustand";

type CartState = {
  totalHuf: number | null;
  initialized: boolean;
  listenerAttached: boolean;
  init: () => void;
  setTotal: (total: number) => void;
};

const readStoredTotal = () => {
  if (typeof window === "undefined") return null;
  const fromStorage = window.localStorage.getItem("cart-total-huf");
  if (fromStorage !== null) {
    const parsed = Number(fromStorage);
    if (Number.isFinite(parsed)) return parsed;
  }
  const cookie = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("cart-total-huf="));
  if (cookie) {
    const value = cookie.split("=")[1];
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

const persistTotal = (total: number) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("cart-total-huf", String(total));
  document.cookie = `cart-total-huf=${total}; path=/; max-age=604800; SameSite=Lax`;
};

export const useCartStore = create<CartState>((set, get) => ({
  totalHuf: null,
  initialized: false,
  listenerAttached: false,
  setTotal: (total: number) => {
    set({ totalHuf: total });
    persistTotal(total);
  },
  init: () => {
    if (get().initialized) return;
    const stored = readStoredTotal();
    if (stored !== null) set({ totalHuf: stored });
    set({ initialized: true });

    const loadCart = async () => {
      try {
        const res = await fetch("/api/cart", { cache: "no-cache", credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        const total =
          typeof data.totalHuf === "number" && Number.isFinite(data.totalHuf)
            ? data.totalHuf
            : null;
        if (total !== null) get().setTotal(total);
      } catch {
        /* noop */
      }
    };

    loadCart();

    if (typeof window !== "undefined" && !get().listenerAttached) {
      const handler = (event: Event) => {
        const custom = event as CustomEvent<{ totalHuf?: number }>;
        const total = custom?.detail?.totalHuf;
        if (typeof total === "number" && Number.isFinite(total)) {
          get().setTotal(total);
        } else {
          loadCart();
        }
      };
      window.addEventListener("cart-updated", handler as EventListener);
      set({ listenerAttached: true });
    }
  },
}));
