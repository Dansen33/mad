"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Link from "next/link";
import { LiveSearch } from "./live-search";

export function ProductHeader() {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartTotal, setCartTotal] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState<{ enabled?: boolean; text?: string; link?: string } | null>(null);
  const [pcHoverCat, setPcHoverCat] = useState<string | null>(null);
  const [laptopHoverCat, setLaptopHoverCat] = useState<string | null>(null);
  const [phoneHoverBrand, setPhoneHoverBrand] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<"pc" | "laptop" | "phone" | null>(null);
  const pcCategories = [
    { label: "Belépő kategóriás Gamer PC 300.000 Ft-ig", slug: "gamer-pc-olcso-300-alatt" },
    { label: "Középkategóriás Gamer PC 300.000-600.000 Ft-ig", slug: "gamer-pc-300-600" },
    { label: "Felsőkategóriás Gamer PC 600.000 Ft-tól", slug: "gamer-pc-600-felett" },
    { label: "Professzionális Munkaállomás", slug: "professzionalis-munkaallomas" },
    { label: "Felújított Gamer PC", slug: "felujitott-gamer-pc" },
  ];
  const laptopCategories = [
    { label: "Általános felhasználás", slug: "GENERAL" },
    { label: "Üzleti laptopok", slug: "BUSINESS" },
    { label: "Gamer laptopok", slug: "GAMING" },
    { label: "Workstation laptopok", slug: "WORKSTATION" },
    { label: "Érintőképernyős", slug: "TOUCH" },
  ];
  const phoneBrands = ["Apple", "Samsung", "Xiaomi", "Pixel"];

  const handleNavNavigate = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
    setLaptopHoverCat(null);
    setPhoneHoverBrand(null);
    setPcHoverCat(null);
  };

  useEffect(() => {
    if (!menuOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenDropdown(null);
      setLaptopHoverCat(null);
      setPhoneHoverBrand(null);
      setPcHoverCat(null);
    }
  }, [menuOpen]);

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

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const res = await fetch("/api/cms/announcement", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!ignore) setAnnouncement(data?.announcement ?? null);
      } catch {
        /* ignore */
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 mb-4 border-b border-border bg-background/90 backdrop-blur transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {announcement?.enabled !== false && announcement?.text ? (
        <div className="flex items-center justify-center bg-gradient-to-r from-primary to-[#5de7bd] px-3 py-2 text-center text-xs font-semibold text-[#0c0f14] sm:text-sm">
          {announcement.link ? (
            <Link href={announcement.link} className="hover:underline">
              {announcement.text}
            </Link>
          ) : (
            <span>{announcement.text}</span>
          )}
        </div>
      ) : null}
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 py-4 sm:px-6">
        {/* Top row: logo + search + actions egy sorban */}
          <div className="flex w-full flex-col items-center gap-3 md:flex-row md:flex-nowrap md:items-center md:justify-between md:gap-4">
            <Link
              href="/"
              className="flex items-center gap-3 font-extrabold tracking-tight md:hidden"
            >
              <img
              src="/logo.png"
              alt="WELLCOMP"
              className="h-12 w-auto sm:h-14"
            />
          </Link>

<Link
  href="/"
  className="hidden items-center md:flex pr-36 pb-3"
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
              <img src="/carticon.svg" alt="" className="h-4 w-4" />
              Kosár{" "}
              <span className="text-muted">
                {cartTotal === null ? "…" : `${new Intl.NumberFormat("hu-HU").format(cartTotal)} Ft`}
              </span>
            </Link>
            <Link
              href="/profil"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold"
            >
              <img src="/usericon.svg" alt="" className="h-4 w-4" />
              Profil
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
          className={`relative w-full flex-col gap-4 text-sm font-semibold text-muted-foreground md:flex md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-4 ${
            menuOpen ? "flex rounded-2xl border border-border bg-card/95 p-4 shadow-lg shadow-black/25 backdrop-blur-sm" : "hidden md:flex"
          } md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-0`}
        >
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-4">
            <Link
              className={`text-foreground ${openDropdown ? "hidden md:inline-block" : ""}`}
              href="/"
              onClick={handleNavNavigate}
            >
              Főoldal
            </Link>
            <Link
              className={`text-foreground ${openDropdown ? "hidden md:inline-block" : ""}`}
              href="/akciok"
              onClick={handleNavNavigate}
            >
              Akciók
            </Link>
            <div
              className={`group relative block w-full md:inline-block md:w-auto ${
                openDropdown && openDropdown !== "laptop" ? "hidden md:inline-block" : ""
              }`}
            >
              <Link
                className="text-foreground"
                href="/laptopok/osszes"
                onClick={(e) => {
                  const isDesktop = typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
                  if (isDesktop) return;
                  e.preventDefault();
                  setOpenDropdown((curr) => (curr === "laptop" ? null : "laptop"));
                }}
              >
                <span className="inline-flex items-center gap-1">
                  Laptop
                  <img
                    src="/dropdown.svg"
                    alt=""
                    className={`inline-block h-6 w-6 transition-transform duration-200 ${
                      openDropdown === "laptop" ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </Link>
              <div
                className={`${
                  openDropdown === "laptop"
                    ? "grid visible opacity-100 translate-y-0"
                    : "hidden md:grid md:invisible md:opacity-0 md:translate-y-1"
                } md:absolute right-0 left-auto md:left-0 md:right-auto md:top-full md:mt-2 mt-3 w-full md:w-[min(820px,calc(100vw-64px))] max-w-[calc(100vw-20px)] grid-cols-1 gap-3 rounded-2xl border border-border bg-card/95 p-4 text-sm shadow-lg shadow-black/25 backdrop-blur-sm transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 md:max-w-none md:grid-cols-[1fr_0.85fr]`}
                onMouseLeave={() => setLaptopHoverCat(null)}
                style={{ zIndex: 5 }}
              >
                <div className="space-y-2">
                  <div className="text-xs uppercase text-muted-foreground">Felhasználási módok</div>
                  {laptopCategories.map((item) => {
                    const activeSlug = laptopHoverCat;
                    const isActive = activeSlug === item.slug;
                    const href = `/kategoria/osszes?category=${item.slug}`;
                    return (
                      <Link
                        key={item.label}
                        href={href}
                        onMouseEnter={() => setLaptopHoverCat(item.slug)}
                        onFocus={() => setLaptopHoverCat(item.slug)}
                        onClick={(event) => {
                          const isDesktop =
                            typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
                          if (isDesktop) return;
                          event.preventDefault();
                          setLaptopHoverCat(item.slug);
                          setOpenDropdown("laptop");
                        }}
                        className={`block rounded-full border px-3 py-2 text-foreground transition hover:border-primary/60 ${
                          isActive ? "border-primary/70 bg-secondary" : "border-border bg-secondary"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
                {laptopHoverCat && (
                  <div className="space-y-2">
                    <div className="text-xs uppercase text-muted-foreground">Állapot</div>
                    {(() => {
                      const activeSlug = laptopHoverCat;
                      const baseHref = `/kategoria/osszes?category=${activeSlug}`;
                      const withCondition = (condition: "UJ" | "FELUJITOTT") =>
                        `${baseHref}${baseHref.includes("?") ? "&" : "?"}condition=${condition}`;
                      return (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <Link
                            href={withCondition("UJ")}
                            onClick={() => {
                              const isDesktop =
                                typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
                              if (!isDesktop) handleNavNavigate();
                            }}
                            className="flex items-center justify-center rounded-full border border-border bg-secondary px-3 py-2 text-foreground hover:border-primary/60"
                          >
                            Új
                          </Link>
                          <Link
                            href={withCondition("FELUJITOTT")}
                            onClick={() => {
                              const isDesktop =
                                typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
                              if (!isDesktop) handleNavNavigate();
                            }}
                            className="flex items-center justify-center rounded-full border border-border bg-secondary px-3 py-2 text-foreground hover:border-primary/60"
                          >
                            Felújított
                          </Link>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
            <div
              className={`group relative block w-full md:inline-block md:w-auto ${
                openDropdown && openDropdown !== "pc" ? "hidden md:inline-block" : ""
              }`}
            >
              <Link
                className="text-foreground"
                href="/pc-k/osszes"
                onClick={(e) => {
                  const isDesktop = typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
                  if (isDesktop) return;
                  e.preventDefault();
                  setOpenDropdown((curr) => (curr === "pc" ? null : "pc"));
                }}
              >
                <span className="inline-flex items-center gap-1">
                  PC
                  <img
                    src="/dropdown.svg"
                    alt=""
                    className={`inline-block h-6 w-6 transition-transform duration-200 ${
                      openDropdown === "pc" ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </Link>
              <div
                className={`${
                  openDropdown === "pc"
                    ? "grid visible opacity-100 translate-y-0"
                    : "hidden md:grid md:invisible md:opacity-0 md:translate-y-1"
                } md:absolute right-0 left-auto md:left-0 md:right-auto md:top-full md:mt-2 mt-3 w-full md:w-[min(820px,calc(100vw-64px))] max-w-[calc(100vw-20px)] grid-cols-1 gap-3 rounded-2xl border border-border bg-card/95 p-4 text-sm shadow-lg shadow-black/25 backdrop-blur-sm transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 md:max-w-none md:grid-cols-[1fr_0.85fr]`}
                onMouseLeave={() => setPcHoverCat(null)}
                style={{ zIndex: 5 }}
              >
                <div className="space-y-2">
                  <div className="text-xs uppercase text-muted-foreground">Kategóriák</div>
                  {pcCategories.map((item) => {
                    const activeSlug = pcHoverCat;
                    const isActive = activeSlug === item.slug;
                    const href = `/pc-k/osszes?category=${item.slug}`;
                    return (
                      <Link
                        key={item.label}
                        href={href}
                        onMouseEnter={() => setPcHoverCat(item.slug)}
                        onFocus={() => setPcHoverCat(item.slug)}
                        onClick={(event) => {
                          const isDesktop =
                            typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
                          if (isDesktop) return;
                          event.preventDefault();
                          setPcHoverCat(item.slug);
                          setOpenDropdown("pc");
                        }}
                        className={`block rounded-full border px-3 py-2 text-foreground transition hover:border-primary/60 ${
                          isActive ? "border-primary/70 bg-secondary" : "border-border bg-secondary"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
                {pcHoverCat && (
                  <div className="space-y-2">
                    <div className="text-xs uppercase text-muted-foreground">Állapot</div>
                    {(() => {
                      const activeSlug = pcHoverCat;
                      const baseHref = `/pc-k/osszes?category=${activeSlug}`;
                      const withCondition = (condition: "UJ" | "FELUJITOTT") =>
                        `${baseHref}${baseHref.includes("?") ? "&" : "?"}condition=${condition}`;
                      return (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <Link
                            href={withCondition("UJ")}
                            onClick={() => {
                              const isDesktop =
                                typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
                              if (!isDesktop) handleNavNavigate();
                            }}
                            className="flex items-center justify-center rounded-full border border-border bg-secondary px-3 py-2 text-foreground hover:border-primary/60"
                          >
                            Új
                          </Link>
                          <Link
                            href={withCondition("FELUJITOTT")}
                            onClick={() => {
                              const isDesktop =
                                typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
                              if (!isDesktop) handleNavNavigate();
                            }}
                            className="flex items-center justify-center rounded-full border border-border bg-secondary px-3 py-2 text-foreground hover:border-primary/60"
                          >
                            Felújított
                          </Link>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
            <div
              className={`group relative block w-full md:inline-block md:w-auto ${
                openDropdown && openDropdown !== "phone" ? "hidden md:inline-block" : ""
              }`}
            >
              <Link
                className="text-foreground"
                href="/telefonok/osszes"
                onClick={(e) => {
                  const isDesktop = typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
                  if (isDesktop) return;
                  e.preventDefault();
                  setOpenDropdown((curr) => (curr === "phone" ? null : "phone"));
                }}
              >
                <span className="inline-flex items-center gap-1">
                  Telefon
                  <img
                    src="/dropdown.svg"
                    alt=""
                    className={`inline-block h-6 w-6 transition-transform duration-200 ${
                      openDropdown === "phone" ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </Link>
              <div
                className={`${
                  openDropdown === "phone"
                    ? "grid visible opacity-100 translate-y-0"
                    : "hidden md:grid md:invisible md:opacity-0 md:translate-y-1"
                } md:absolute right-0 left-auto md:left-0 md:right-auto md:top-full md:mt-2 mt-3 w-full md:w-[min(680px,calc(100vw-64px))] max-w-[calc(100vw-20px)] grid-cols-1 gap-3 rounded-2xl border border-border bg-card/95 p-4 text-sm shadow-lg shadow-black/25 backdrop-blur-sm transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 md:max-w-none md:grid-cols-[1fr_0.85fr]`}
                onMouseLeave={() => setPhoneHoverBrand(null)}
                style={{ zIndex: 5 }}
              >
                <div className="space-y-2">
                  <div className="text-xs uppercase text-muted-foreground">Gyártók</div>
                  {phoneBrands.map((item) => {
                    const activeBrand = phoneHoverBrand;
                    const isActive = activeBrand === item;
                    const href = `/telefonok/osszes?brand=${encodeURIComponent(item)}`;
                    return (
                      <Link
                        key={item}
                        href={href}
                        onMouseEnter={() => setPhoneHoverBrand(item)}
                        onFocus={() => setPhoneHoverBrand(item)}
                        onClick={(event) => {
                          const isDesktop =
                            typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
                          if (isDesktop) return;
                          event.preventDefault();
                          setPhoneHoverBrand(item);
                          setOpenDropdown("phone");
                        }}
                        className={`block rounded-full border px-3 py-2 text-foreground transition hover:border-primary/60 ${
                          isActive ? "border-primary/70 bg-secondary" : "border-border bg-secondary"
                        }`}
                      >
                        {item}
                      </Link>
                    );
                  })}
                </div>
                {phoneHoverBrand && (
                  <div className="space-y-2">
                    <div className="text-xs uppercase text-muted-foreground">Állapot</div>
                    {(() => {
                      const activeBrand = phoneHoverBrand;
                      const baseHref = `/telefonok/osszes?brand=${encodeURIComponent(activeBrand)}`;
                      const withCondition = (condition: "UJ" | "FELUJITOTT") =>
                        `${baseHref}${baseHref.includes("?") ? "&" : "?"}condition=${condition}`;
                      return (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <Link
                            href={withCondition("UJ")}
                            onClick={() => {
                              const isDesktop =
                                typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
                              if (!isDesktop) handleNavNavigate();
                            }}
                            className="flex items-center justify-center rounded-full border border-border bg-secondary px-3 py-2 text-foreground hover:border-primary/60"
                          >
                            Új
                          </Link>
                          <Link
                            href={withCondition("FELUJITOTT")}
                            onClick={() => {
                              const isDesktop =
                                typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
                              if (!isDesktop) handleNavNavigate();
                            }}
                            className="flex items-center justify-center rounded-full border border-border bg-secondary px-3 py-2 text-foreground hover:border-primary/60"
                          >
                            Felújított
                          </Link>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
            <Link
              href="/miert-mi"
              onClick={handleNavNavigate}
              className={`hover:text-foreground ${openDropdown ? "hidden md:inline-block" : ""}`}
            >
              Miért mi?
            </Link>
            <Link
              href="/rolunk"
              onClick={handleNavNavigate}
              className={`hover:text-foreground ${openDropdown ? "hidden md:inline-block" : ""}`}
            >
              Rólunk
            </Link>
            <Link
              href="/blog"
              onClick={handleNavNavigate}
              className={`hover:text-foreground ${openDropdown ? "hidden md:inline-block" : ""}`}
            >
              Blog
            </Link>
            <Link
              href="/kapcsolat"
              onClick={handleNavNavigate}
              className={`hover:text-foreground ${openDropdown ? "hidden md:inline-block" : ""}`}
            >
              Kapcsolat
            </Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/kosar"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 -ml-3 text-sm font-semibold"
            >
              <img src="/carticon.svg" alt="" className="h-4 w-4" />
              Kosár{" "}
              <span className="text-muted">
                {cartTotal === null ? "…" : `${new Intl.NumberFormat("hu-HU").format(cartTotal)} Ft`}
              </span>
            </Link>
            <Link
              href="/profil"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold"
            >
              <img src="/usericon.svg" alt="" className="h-4 w-4" />
              Profil
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
            className={`flex items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30 md:hidden ${
              openDropdown ? "hidden" : ""
            }`}
          >
            +36 70 317 6680
          </Link>
        </nav>
      </div>
    </header>
  );
}
