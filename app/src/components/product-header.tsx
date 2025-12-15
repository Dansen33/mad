"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LiveSearch } from "./live-search";

export function ProductHeader() {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartTotal, setCartTotal] = useState<number | null>(null);

  // Light mód fixálása
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.remove("dark");
    body.classList.remove("dark");
    root.classList.add("light");
    body.classList.add("light");
    if (typeof window !== "undefined") window.localStorage.setItem("theme", "light");
  }, []);

  // Scrollra elrejtés/megmutatás
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY && y > 50) setHidden(true);
      else if (y < lastY) setHidden(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Kosár total frissítés
  useEffect(() => {
    let ignore = false;
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
      setCartTotal(total);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("cart-total-huf", String(total));
        document.cookie = `cart-total-huf=${total}; path=/; max-age=604800; SameSite=Lax`;
      }
    };
    const loadCart = async () => {
      try {
        const res = await fetch("/api/cart", { cache: "no-cache", credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        const total =
          typeof data.totalHuf === "number" && Number.isFinite(data.totalHuf)
            ? data.totalHuf
            : null;
        if (!ignore && total !== null) persistTotal(total);
      } catch {
        /* ignore */
      }
    };
    const stored = readStoredTotal();
    if (stored !== null) {
      setTimeout(() => setCartTotal(stored), 0);
    }
    loadCart();
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ totalHuf?: number; items?: unknown[] }>;
      const total = custom?.detail?.totalHuf;
      if (typeof total === "number" && Number.isFinite(total)) {
        persistTotal(total);
        return;
      }
      loadCart();
    };
    window.addEventListener("cart-updated", handler as EventListener);
    return () => {
      ignore = true;
      window.removeEventListener("cart-updated", handler as EventListener);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 mb-4 border-b border-border bg-background/90 backdrop-blur transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 py-4 sm:px-6">
        {/* Top row: logo + search + actions egy sorban */}
        <div className="flex w-full flex-col items-center gap-3 md:flex-row md:flex-nowrap md:items-center md:justify-between md:gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 font-extrabold tracking-tight md:hidden"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
              PL
            </div>
          </Link>

<Link
  href="/"
  className="hidden items-center md:flex pr-36"
>
  <span className="h-12 md:h-16 lg:h-20 w-auto max-w-[400px] object-contain">
    <img
      src="/logo.png"
      alt="WELLCOMP"
      className="h-28 w-80 -ml-19 object-contain"
    />
  </span>
</Link>

          <div className="hidden w-full md:block md:min-w-[320px] md:max-w-[720px] md:flex-1">
            <LiveSearch mode="desktop" />
          </div>

          <div className="flex w-full shrink-0 items-center justify-center gap-2 md:hidden">
            <Link
              href="/kosar"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold"
            >
              🛒 Kosár{" "}
              <span className="text-muted">
                {cartTotal === null ? "…" : `${new Intl.NumberFormat("hu-HU").format(cartTotal)} Ft`}
              </span>
            </Link>
            <Link
              href="/profil"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold"
            >
              👤 Profil
            </Link>
            <LiveSearch mode="mobile" />
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-lg md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menü"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav
          className={`relative w-full flex-col gap-4 text-sm font-semibold text-muted-foreground md:flex md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-6 ${
            menuOpen ? "flex" : "hidden md:flex"
          }`}
        >
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-5">
            <Link className="text-foreground" href="/">
              Főoldal
            </Link>
            <Link className="text-foreground" href="/akciok">
              Akciók
            </Link>
            <div className="group relative inline-block">
              <Link className="text-foreground" href="/laptopok/osszes">
                Laptopok ▾
              </Link>
              <div className="invisible absolute left-0 top-full mt-2 w-[min(1100px,calc(100vw-24px))] grid grid-cols-1 gap-4 rounded-xl border border-border bg-card p-4 text-sm shadow-xl shadow-black/30 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 md:w-[min(1100px,calc(100vw-64px))] md:grid-cols-3">
                <div className="space-y-2">
                  <div className="text-xs uppercase text-muted-foreground">Felhasználási módok</div>
                  {[
                    { label: "Általános felhasználás", href: "/kategoria/osszes?category=GENERAL" },
                    { label: "Üzleti laptopok", href: "/kategoria/osszes?category=BUSINESS" },
                    { label: "Gamer laptopok", href: "/kategoria/osszes?category=GAMING" },
                    { label: "Workstation laptopok", href: "/kategoria/osszes?category=WORKSTATION" },
                    { label: "Érintőképernyős", href: "/kategoria/osszes?category=TOUCH" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block rounded-full border border-border bg-secondary px-3 py-2 text-foreground hover:border-primary/60"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="text-xs uppercase text-muted-foreground">Népszerű márkák</div>
                  {["Lenovo", "Apple", "HP", "Dell", "Asus", "Acer"].map((item) => (
                    <Link
                      key={item}
                      href={`/marka/${item.toLowerCase()}`}
                      className="block rounded-full border border-border bg-secondary px-3 py-2 text-foreground hover:border-primary/60"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="text-xs uppercase text-muted-foreground">Intelligens keresések</div>
                  {[
                    {
                      label: "Gamer laptop",
                      href: "/kategoria/osszes?category=GAMING&q=gamer%20laptop",
                    },
                    {
                      label: "ThinkPad T14",
                      href: "/kategoria/osszes?category=BUSINESS&q=thinkpad%20t14",
                    },
                    { label: "MacBook Air M1", href: "/marka/apple?q=macbook%20air%20m1" },
                    { label: "RTX 3060", href: "/kategoria/osszes?category=GAMING&q=rtx%203060" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block rounded-full border border-border bg-secondary px-3 py-2 text-foreground hover:border-primary/60"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="group relative inline-block">
              <Link className="text-foreground" href="/pc-k/osszes">
                PC-k ▾
              </Link>
              <div className="invisible absolute left-0 top-full mt-2 w-[min(800px,calc(100vw-24px))] grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-4 text-sm shadow-xl shadow-black/30 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 md:w-[min(800px,calc(100vw-64px))] md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-xs uppercase text-muted-foreground">Kategóriák</div>
                  {[
                    { label: "Belépő kategóriás Gamer PC-k 300.000 Ft-ig", href: "/pc-k/kategoria/gamer-pc-olcso-300-alatt" },
                    { label: "Középkategóriás Gamer PC-k 300.000-600.000 Ft-ig", href: "/pc-k/kategoria/gamer-pc-300-600" },
                    { label: "Felsőkategóriás Gamer PC-k 600.000 Ft-tól", href: "/pc-k/kategoria/gamer-pc-600-felett" },
                    { label: "Professzionális Munkaállomások", href: "/pc-k/kategoria/professzionalis-munkaallomas" },
                    { label: "Felújított Gamer PC-k", href: "/pc-k/kategoria/felujitott-gamer-pc" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block rounded-full border border-border bg-secondary px-3 py-2 text-foreground hover:border-primary/60"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="text-xs uppercase text-muted-foreground">Népszerű keresések</div>
                  {[
                    { label: "i7 munka PC", href: "/pc-k?q=i7" },
                    { label: "CAD/3D render", href: "/pc-k/workstation?q=render" },
                    { label: "Mini i5", href: "/pc-k/mini?q=i5" },
                    { label: "All-in-One érintős", href: "/pc-k/all-in-one?q=touch" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block rounded-full border border-border bg-secondary px-3 py-2 text-foreground hover:border-primary/60"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="group relative inline-block">
              <Link className="text-foreground" href="/telefonok/osszes">
                Telefonok ▾
              </Link>
              <div className="invisible absolute left-0 top-full mt-2 w-[min(800px,calc(100vw-24px))] grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-4 text-sm shadow-xl shadow-black/30 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 md:w-[min(800px,calc(100vw-64px))] md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-xs uppercase text-muted-foreground">Gyártók</div>
                  {["Apple", "Samsung", "Xiaomi", "Pixel"].map((item) => (
                    <Link
                      key={item}
                      href={`/telefonok/osszes?brand=${encodeURIComponent(item)}`}
                      className="block rounded-full border border-border bg-secondary px-3 py-2 text-foreground hover:border-primary/60"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="text-xs uppercase text-muted-foreground">Keresések</div>
                  {[
                    { label: "5G telefon", href: "/telefonok?q=5g" },
                    { label: "Nagy akku", href: "/telefonok?q=5000mah" },
                    { label: "Kompakt", href: "/telefonok?q=mini" },
                    { label: "Üzleti dual SIM", href: "/telefonok?q=dual%20sim" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block rounded-full border border-border bg-secondary px-3 py-2 text-foreground hover:border-primary/60"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/miert-mi" className="hover:text-foreground">
              Miért mi?
            </Link>
            <Link href="/rolunk" className="hover:text-foreground">
              Rólunk
            </Link>
            <Link href="/blog" className="hover:text-foreground">
              Blog
            </Link>
            <Link href="/kapcsolat" className="hover:text-foreground">
              Kapcsolat
            </Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/kosar"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold"
            >
              🛒 Kosár{" "}
              <span className="text-muted">
                {cartTotal === null
                  ? "…"
                  : `${new Intl.NumberFormat("hu-HU").format(cartTotal)} Ft`}
              </span>
            </Link>
            <Link
              href="/profil"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold"
            >
              👤 Profil
            </Link>
            <Link
              href="tel:+36301234567"
              className="whitespace-nowrap rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30"
            >
              +36 70 317 6680
            </Link>
          </div>

          <Link
            href="tel:+36301234567"
            className="flex items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30 md:hidden"
          >
            +36 70 317 6680
          </Link>
        </nav>
      </div>
    </header>
  );
}
