"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CartResetter } from "@/components/cart-resetter";

export const dynamic = "force-dynamic";

export default function FizetesSiker() {
  return (
    <Suspense fallback={null}>
      <FizetesSikerContent />
    </Suspense>
  );
}

function FizetesSikerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentId = searchParams?.get("paymentId") || "";
  const [status, setStatus] = useState<"checking" | "ok" | "pending" | "failed">(
    paymentId ? "checking" : "ok",
  );

  useEffect(() => {
    let cancelled = false;
    let timeoutId: NodeJS.Timeout | null = null;
    let attempts = 0;
    const checkStatus = async () => {
      if (!paymentId) return;
      try {
        const res = await fetch(`/api/barion/state?paymentId=${encodeURIComponent(paymentId)}`, { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        if (res.ok && data?.status === "FIZETVE") {
          setStatus("ok");
          return;
        }
        attempts += 1;
        if (attempts < 6) {
          timeoutId = setTimeout(checkStatus, 1500);
          return;
        }
        setStatus("failed");
        router.replace("/fizetes-hiba");
      } catch {
        if (cancelled) return;
        setStatus("failed");
        router.replace("/fizetes-hiba");
      }
    };
    if (paymentId) checkStatus();
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [paymentId, router]);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-16 text-center">
          <div className="rounded-full bg-blue-100 p-4 text-3xl">⏳</div>
          <h1 className="text-3xl font-extrabold">Fizetés ellenőrzése...</h1>
          <p className="text-muted-foreground">Kérjük, várj, amíg visszaigazoljuk a tranzakciót.</p>
        </div>
      </div>
    );
  }

  const isFinalOk = status === "ok";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {isFinalOk && <CartResetter />}
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-16 text-center">
        <div className="rounded-full bg-green-100 p-4 text-3xl">✅</div>
        <h1 className="text-3xl font-extrabold">
          {isFinalOk ? "Sikeres fizetés" : "Fizetés folyamatban"}
        </h1>
        <p className="text-muted-foreground">
          {isFinalOk
            ? "Köszönjük a rendelésed! A visszaigazoló e-mailt és számlát hamarosan küldjük."
            : "A tranzakció visszaigazolása folyamatban van. Ha pár percen belül nem érkezik visszaigazolás, vedd fel velünk a kapcsolatot."}
        </p>
        <div className="flex gap-3">
          <Link
            href="/laptopok/osszes"
            className="rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30"
          >
            Vissza a kínálathoz
          </Link>
          <Link
            href="/"
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary"
          >
            Főoldal
          </Link>
        </div>
        {!isFinalOk && (
          <p className="text-xs text-muted-foreground">
            Ha a fizetés mégsem sikerült, térj vissza a pénztárhoz és próbáld újra.
          </p>
        )}
      </div>
    </div>
  );
}
