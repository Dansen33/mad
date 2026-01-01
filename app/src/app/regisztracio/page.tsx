"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

export default function RegisztracioPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = (form.get("name") as string)?.trim();
    const email = (form.get("email") as string)?.trim();
    const password = (form.get("password") as string) || "";
    if (!email || password.length < 8) {
      setStatus("error");
      setMessage("Adj meg emailt és min. 8 karakteres jelszót.");
      return;
    }
    try {
      setStatus("loading");
      setMessage(null);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setStatus("error");
        setMessage(err?.message || "Regisztrációs hiba.");
        return;
      }
      // automatikus bejelentkezés
      await signIn("credentials", { email, password, redirect: false });
      router.push("/profil");
    } catch {
      setStatus("error");
      setMessage("Regisztrációs hiba.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProductHeader />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 pb-16 pt-10 sm:max-w-md sm:px-6">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold">Regisztráció</h1>
          <p className="text-sm text-muted-foreground">
            Hozz létre fiókot email és jelszóval.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-black/20">
          <form className="space-y-3" onSubmit={onSubmit}>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Név</label>
              <input
                name="name"
                type="text"
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
                placeholder="Teljes név (nem kötelező)"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Jelszó</label>
              <input
                name="password"
                type="password"
                minLength={8}
                required
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
                placeholder="Legalább 8 karakter"
              />
            </div>
            {status === "error" && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {message || "Regisztrációs hiba."}
              </div>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30 disabled:opacity-70"
            >
              {status === "loading" ? "Feldolgozás..." : "Regisztráció"}
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Van már fiókod?{" "}
            <Link href="/bejelentkezes" className="font-semibold text-primary hover:underline">
              Bejelentkezés
            </Link>
          </p>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
