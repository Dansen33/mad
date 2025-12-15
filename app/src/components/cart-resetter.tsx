"use client";

import { useEffect } from "react";

export function CartResetter() {
useEffect(() => {
  try {
      // szerver oldali törlés (httpOnly cookie miatt)
      fetch("/api/cart/clear", { method: "POST" }).catch(() => {});
      // nullázzuk a lokális total-t
      if (typeof window !== "undefined") {
        window.localStorage.setItem("cart-total-huf", "0");
        window.dispatchEvent(new CustomEvent("cart-updated", { detail: { totalHuf: 0, items: [] } }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  return null;
}
