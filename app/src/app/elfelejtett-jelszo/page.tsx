"use client";

import { useState } from "react";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const requestReset = async () => {
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/auth/reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Hiba");
      setStatus("sent");
      setMessage("Ha létezik a fiók, elküldtük az email címedre a visszaállító linket.");
    } catch (err: unknown) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Hiba történt a kérés során.";
      setMessage(msg);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProductHeader />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 pb-16 pt-10 sm:max-w-md sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg shadow-black/20">
          <h1 className="text-2xl font-extrabold">Elfelejtett jelszó</h1>
          <p className="text-sm text-muted-foreground">
            Írd be az email címed, és elküldjük a jelszó visszaállításához szükséges linket.
          </p>
          <div className="mt-4 space-y-3">
            <input
              type="email"
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={requestReset}
              disabled={!email || status === "loading"}
              className="w-full rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30 disabled:opacity-60"
            >
              {status === "loading" ? "Küldés..." : "Küldés"}
            </button>
            {message && (
              <div
                className={`rounded-lg border px-3 py-2 text-xs ${
                  status === "error"
                    ? "border-red-500/40 bg-red-500/10 text-red-200"
                    : "border-green-500/40 bg-green-500/10"
                }`}
              >
                {status === "error" ? (
                  <>
                    Az email címet nem találjuk a rendszerünkben. Kérjük regisztráljon{" "}
                    <a className="font-semibold underline" href="/regisztracio">
                      itt
                    </a>
                    .
                  </>
                ) : (
                  "Amennyiben rendszerünkben szerepel az e-mail cím elküldjük a linket. Kérjük nézd meg a spam mappát is!"
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
