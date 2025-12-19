"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

export default function PasswordResetPage() {
  return (
    <Suspense fallback={null}>
      <PasswordResetContent />
    </Suspense>
  );
}

function PasswordResetContent() {
  const searchParams = useSearchParams();
  const presetEmail = searchParams?.get("email") || "";
  const presetToken = searchParams?.get("token") || "";

  const [email, setEmail] = useState(presetEmail);
  const [token] = useState(presetToken);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "reset" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const hasTokenInUrl = Boolean(presetToken);
  const hasPresetEmail = Boolean(presetEmail);

  const confirmReset = async () => {
    setStatus("loading");
    setMessage(null);
    try {
      if (!token) throw new Error("Érvénytelen vagy lejárt link.");
      if (password.length < 8) throw new Error("A jelszó legyen legalább 8 karakter.");
      if (password !== password2) throw new Error("A két jelszó nem egyezik.");
      const res = await fetch("/api/auth/reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Hiba");
      setStatus("reset");
      setMessage("Jelszó frissítve. Jelentkezz be az új jelszóval.");
    } catch (err: unknown) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Hiba a frissítésnél.";
      setMessage(msg);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProductHeader />
      <div className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 pb-16 pt-10 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg shadow-black/20">
          <h1 className="text-2xl font-extrabold">Jelszó visszaállítása</h1>
          <p className="text-sm text-muted-foreground">
            A kapott linkről érkeztél. Add meg az email címedet és az új jelszót kétszer.
          </p>
          <div className="mt-4 space-y-3">
            <input
              type="email"
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={hasPresetEmail}
            />
            {!hasTokenInUrl && (
              <div className="text-xs text-red-400">
                Hiányzik a visszaállító token. Kérj új linket az elfelejtett jelszó oldalon.
              </div>
            )}
            <input
              type="password"
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
              placeholder="Új jelszó (min. 8 karakter)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
              placeholder="Új jelszó mégegyszer"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
            <button
              onClick={confirmReset}
              disabled={!email || !token || password.length < 8 || password !== password2 || status === "loading"}
              className="w-full rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30 disabled:opacity-60"
            >
              {status === "loading" ? "Frissítés..." : "Jelszó beállítása"}
            </button>
          </div>
          {message && (
            <div
              className={`mt-4 rounded-lg border px-3 py-2 text-sm ${
                status === "error" ? "border-red-500/40 bg-red-500/10 text-red-200" : "border-green-500/40 bg-green-500/10 text-green-100"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
