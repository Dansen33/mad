"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

export default function BejelentkezesPage() {
  return (
    <Suspense fallback={null}>
      <BejelentkezesContent />
    </Suspense>
  );
}

function BejelentkezesContent() {
  const searchParams = useSearchParams();
  const errorParam = searchParams?.get("error");
  const [errorMsg, setErrorMsg] = useState<string | null>(
    errorParam === "CredentialsSignin"
      ? "Hibás email vagy jelszó"
      : errorParam
        ? "Bejelentkezési hiba"
        : null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (errorParam === "CredentialsSignin") setErrorMsg("Hibás email vagy jelszó");
  }, [errorParam]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    const form = new FormData(e.currentTarget);
    const email = (form.get("email") as string | null) ?? "";
    const password = (form.get("password") as string | null) ?? "";
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/",
    });
    if (result?.error) {
      setErrorMsg("Hibás email vagy jelszó");
      setLoading(false);
      return;
    }
    if (result?.url) {
      window.location.href = result.url;
      return;
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProductHeader />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 pb-16 pt-10 sm:max-w-md sm:px-6">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold">Bejelentkezés</h1>
          <p className="text-sm text-muted-foreground">
            Jelentkezz be email és jelszóval, vagy használd a Google / Apple fiókodat.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-black/20">
          <form className="space-y-3" onSubmit={handleSubmit}>
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
                required
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
                placeholder="••••••••"
              />
            </div>
            {errorMsg && <div className="text-xs font-semibold text-red-500">{errorMsg}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30"
            >
              {loading ? "Bejelentkezés..." : "Bejelentkezés"}
            </button>
          </form>
          <div className="mt-3 text-right text-xs">
            <Link href="/elfelejtett-jelszo" className="font-semibold text-primary hover:underline">
              Elfelejtett jelszó?
            </Link>
          </div>
          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            vagy
            <span className="h-px flex-1 bg-border" />
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Nincs fiókod?{" "}
            <Link href="/regisztracio" className="font-semibold text-primary hover:underline">
              Regisztráció
            </Link>
          </p>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
