"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

type Status = "idle" | "loading" | "success" | "error";

export default function KapcsolatPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    setStatus("loading");
    setErrorMsg(null);
    const form = new FormData(formEl);
    const payload = {
      name: (form.get("name") as string | null) ?? "",
      email: (form.get("email") as string | null) ?? "",
      phone: (form.get("phone") as string | null) ?? "",
      topic: (form.get("topic") as string | null) ?? "",
      message: (form.get("message") as string | null) ?? "",
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg((data?.message as string) || "Nem sikerült elküldeni az üzenetet.");
        setStatus("error");
        return;
      }
      setStatus("success");
      formEl.reset();
    } catch (err) {
      console.error("Contact form error", err);
      setErrorMsg("Nem sikerült elküldeni az üzenetet.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen text-foreground">
      <ProductHeader />
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 pb-16 pt-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link className="hover:text-primary" href="/">
            Főoldal
          </Link>
          <span>/</span>
          <span className="text-foreground">Kapcsolat</span>
        </div>

        <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-lg shadow-black/30">
          <div className="text-xs uppercase text-primary">Elérhetőségek</div>
          <h1 className="text-3xl font-extrabold leading-tight">Kapcsolat</h1>
          <p className="text-sm text-muted-foreground">
            Kérdésed van? Hívj, írj, vagy kérj ajánlatot. Ügyfélszolgálat: H-P 8:00-17:00.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-secondary p-4">
              <h3 className="text-sm font-semibold text-foreground">Telefon</h3>
              <a className="text-sm text-primary" href="tel:+36703176680">
                +36 70 317 6680
              </a>
            </div>
            <div className="rounded-xl border border-border bg-secondary p-4">
              <h3 className="text-sm font-semibold text-foreground">Email</h3>
              <Link className="text-sm text-primary" href="#contact-form">
                Kapcsolatfelvétel űrlappal
              </Link>
            </div>
            <div className="rounded-xl border border-border bg-secondary p-4">
              <h3 className="text-sm font-semibold text-foreground">Cím</h3>
              <p className="text-sm text-muted-foreground">
                9028 Győr, Dobó utca 18. (Irodánk)
              </p>
            </div>
            <div className="rounded-xl border border-border bg-secondary p-4">
              <h3 className="text-sm font-semibold text-foreground">Nyitvatartás</h3>
              <p className="text-sm text-muted-foreground">Hétfő - Péntek: 8:00 - 17:00</p>
            </div>
          </div>
          <a
            href="#contact-form"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30"
          >
            Ajánlatkérés küldése
          </a>
        </div>

        <div
          id="contact-form"
          className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-lg shadow-black/30"
        >
          <div className="text-xs uppercase text-primary">Írj nekünk</div>
          <h2 className="text-2xl font-extrabold leading-tight">Kapcsolatfelvételi űrlap</h2>
          <p className="text-sm text-muted-foreground">
            Add meg az elérhetőségeid és az üzeneted, munkatársunk hamarosan válaszol.
          </p>
          <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1 text-sm text-foreground">
              Név *
              <input
                required
                name="name"
                className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
                placeholder="Teljes név"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-foreground">
              E-mail *
              <input
                required
                type="email"
                name="email"
                className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
                placeholder="email@pelda.hu"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-foreground">
              Telefonszám
              <input
                type="tel"
                name="phone"
                className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
                placeholder="+36 12 ..."
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-foreground">
              Téma
              <input
                name="topic"
                className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
                placeholder="Ajánlatkérés, szerviz, kérdés..."
              />
            </label>
            <label className="md:col-span-2 flex flex-col gap-1 text-sm text-foreground">
              Üzenet *
              <textarea
                required
                name="message"
                rows={5}
                className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
                placeholder="Írd le, miben segíthetünk (termék, kategória, mennyiség, határidő)."
              />
            </label>
            {status === "success" && (
              <div className="md:col-span-2 rounded-lg bg-green-100 px-3 py-2 text-sm text-green-700">
                Köszönjük, üzeneted megkaptuk. Hamarosan jelentkezünk.
              </div>
            )}
            {status === "error" && errorMsg && (
              <div className="md:col-span-2 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
                {errorMsg}
              </div>
            )}
            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">* Kötelező mezők</p>
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30 disabled:opacity-70"
              >
                {status === "loading" ? "Küldés..." : "Üzenet küldése"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
