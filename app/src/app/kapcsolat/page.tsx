import Link from "next/link";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function KapcsolatPage() {
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
            Kérdésed van? Hívj, írj, vagy kérj ajánlatot. Ügyfélszolgálat: H-P 9:00-18:00.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-secondary p-4">
              <h3 className="text-sm font-semibold text-foreground">Telefon</h3>
              <a className="text-sm text-primary" href="tel:+36301234567">
                +36 70 317 6680
              </a>
            </div>
            <div className="rounded-xl border border-border bg-secondary p-4">
              <h3 className="text-sm font-semibold text-foreground">Email</h3>
              <a className="text-sm text-primary" href="mailto:info@wellcomp.hu">
                info@wellcomp.hu
              </a>
            </div>
            <div className="rounded-xl border border-border bg-secondary p-4">
              <h3 className="text-sm font-semibold text-foreground">Cím</h3>
              <p className="text-sm text-muted-foreground">
                9028 Győr, Dobó utca 18. (Irodánk)
              </p>
            </div>
            <div className="rounded-xl border border-border bg-secondary p-4">
              <h3 className="text-sm font-semibold text-foreground">Nyitvatartás</h3>
              <p className="text-sm text-muted-foreground">Hétfő - Péntek: 9:00 - 18:00</p>
            </div>
          </div>
          <a
            href="mailto:info@wellcomp.hu"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30"
          >
            Ajánlatkérés küldése
          </a>
        </div>

        <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-lg shadow-black/30">
          <div className="text-xs uppercase text-primary">Írj nekünk</div>
          <h2 className="text-2xl font-extrabold leading-tight">Kapcsolatfelvételi űrlap</h2>
          <p className="text-sm text-muted-foreground">
            Add meg az elérhetőségeid és az üzeneted, munkatársunk hamarosan válaszol.
          </p>
          <form
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
            method="post"
            action="mailto:info@wellcomp.hu"
            encType="text/plain"
          >
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
                placeholder="+36 70 ..."
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
            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                * Kötelező mezők
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30"
              >
                Üzenet küldése
              </button>
            </div>
          </form>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
