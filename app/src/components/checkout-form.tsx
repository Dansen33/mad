"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type CartItem = {
  slug: string;
  name: string;
  brand: string;
  priceHuf: number;
  quantity: number;
  image?: string | null;
  upgrades?: { label: string; deltaHuf: number }[];
};

type Props = {
  items: CartItem[];
  subtotal: number;
  shipping?: number;
  total?: number;
};

export function CheckoutForm({ items, subtotal }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [billingSame, setBillingSame] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [shippingMethods, setShippingMethods] = useState<
    { id: string; label: string; note?: string; priceHuf: number }[]
  >([]);
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [couponCode, setCouponCode] = useState("");
  const [discountHuf, setDiscountHuf] = useState(0);
  const [couponStatus, setCouponStatus] = useState<"idle" | "checking" | "applied" | "error">("idle");
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [prefill, setPrefill] = useState({
    email: "",
    phone: "",
    fullName: "",
    country: "Magyarország",
    zip: "",
    city: "",
    address: "",
  });
  const [prefillKey, setPrefillKey] = useState(0);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const email = data?.user?.email || "";
        const name = data?.user?.name || "";
        setPrefill((p) => ({ ...p, email, fullName: p.fullName || name }));
        setPrefillKey((k) => k + 1);
      } catch {
        /* ignore */
      }
    };
    const loadAddress = async () => {
      try {
        const res = await fetch("/api/user/address", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        type SavedAddress = {
          isDefault?: boolean;
          phone?: string;
          fullName?: string;
          country?: string;
          zip?: string;
          city?: string;
          addressLine?: string;
        };
        const list: SavedAddress[] = Array.isArray(data?.addresses) ? data.addresses : [];
        const chosen = list.find((a) => a?.isDefault) || list[0];
        if (chosen) {
          setPrefill((p) => ({
            ...p,
            phone: chosen.phone || p.phone || "",
            fullName: p.fullName || chosen.fullName || "",
            country: chosen.country || "Magyarország",
            zip: chosen.zip || "",
            city: chosen.city || "",
            address: chosen.addressLine || "",
          }));
          setPrefillKey((k) => k + 1);
        }
      } catch {
        /* ignore */
      }
    };
    loadSession();
    loadAddress();
  }, []);

  // Szállítási módok Sanity-ből
  useEffect(() => {
    const loadShipping = async () => {
      try {
        const res = await fetch("/api/cms/shipping", { cache: "no-store" });
        if (!res.ok) throw new Error("fail");
        const data = await res.json();
        const methods = Array.isArray(data?.methods) ? data.methods : [];
        if (methods.length) {
          setShippingMethods(methods);
          if (!selectedShipping && methods[0]?.id) setSelectedShipping(methods[0].id);
          return;
        }
      } catch {
        /* ignore */
      }
      const fallback = [
        { id: "standard", label: "Standard futár (1-2 munkanap)", priceHuf: 2490 },
        { id: "pickup", label: "Személyes átvétel", note: "Ingyenes", priceHuf: 0 },
      ];
      setShippingMethods(fallback);
      if (!selectedShipping) setSelectedShipping(fallback[0].id);
    };
    loadShipping();
  }, [selectedShipping]);

  const selectedShippingPrice = (() => {
    if (!selectedShipping) return 0;
    const found = shippingMethods.find((m) => m.id === selectedShipping);
    if (found) return found.priceHuf;
    return 0;
  })();
  const computedTotal = Math.max(0, subtotal + (items.length ? selectedShippingPrice : 0) - discountHuf);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setTermsError(true);
      setStatus("error");
      setMessage("Nem fogadta el a vásárlási feltételeket.");
      return;
    }

    const form = new FormData(e.currentTarget);
    const payload = {
      email: form.get("email"),
      phone: form.get("phone"),
      fullName: form.get("fullName"),
      company: form.get("company"),
      taxNumber: form.get("taxNumber"),
      country: form.get("country"),
      zip: form.get("zip"),
      city: form.get("city"),
      address: form.get("address"),
      note: form.get("note"),
      shippingMethod: form.get("shipping") || "standard",
      paymentMethod: form.get("payment") || "card",
      items,
      subtotalHuf: subtotal,
      shippingHuf: items.length ? selectedShippingPrice : 0,
      totalHuf: computedTotal,
      discountHuf,
      billingSame,
      billing: billingSame
        ? null
        : {
            billingName: form.get("billingName"),
            billingTaxNumber: form.get("billingTaxNumber"),
            billingCountry: form.get("billingCountry"),
            billingZip: form.get("billingZip"),
            billingCity: form.get("billingCity"),
            billingAddress: form.get("billingAddress"),
          },
    };
    try {
      setStatus("loading");
      setMessage(null);
      // 1) Rendelés mentése Sanity-be
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setStatus("error");
        setMessage("A rendelés mentése nem sikerült.");
        return;
      }
      const order = await res.json().catch(() => null);

      // 2) Barion (alap) vagy Stripe (fallback, ha Barion kikapcsolva)
      const useBarion = process.env.NEXT_PUBLIC_USE_BARION !== "false";

      if (useBarion) {
        const barionResp = await fetch("/api/payments/barion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order?.orderId,
            orderNumber: order?.orderNumber,
            email: (form.get("email") as string) || undefined,
            items: items.map((it) => {
              const upgradeSum = (it.upgrades ?? []).reduce((s, u) => s + u.deltaHuf, 0);
              return {
                name: it.name,
                priceHuf: it.priceHuf + upgradeSum,
                quantity: it.quantity,
              };
            }),
            shippingHuf: items.length ? selectedShippingPrice : 0,
            discountHuf,
            totalHuf: computedTotal,
            successUrl:
              typeof window !== "undefined"
                ? `${window.location.origin}/fizetes-siker`
                : undefined,
            cancelUrl:
              typeof window !== "undefined"
                ? `${window.location.origin}/fizetes-hiba`
                : undefined,
          }),
        });
        if (!barionResp.ok) {
          setStatus("error");
          setMessage("Barion fizetés indítása nem sikerült.");
          return;
        }
        const barionData = await barionResp.json().catch(() => null);
        if (barionData?.redirectUrl) {
          window.location.href = barionData.redirectUrl;
          return;
        }
        setStatus("error");
        setMessage("Barion válasz nem tartalmaz redirect URL-t.");
        return;
      } else {
        const stripeResp = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((it) => {
              const upgradeSum = (it.upgrades ?? []).reduce((s, u) => s + u.deltaHuf, 0);
              return {
                name: it.name,
                priceHuf: it.priceHuf + upgradeSum,
                quantity: it.quantity,
              };
            }),
            shippingHuf: items.length ? selectedShippingPrice : 0,
            discountHuf,
            totalHuf: computedTotal,
            email: (form.get("email") as string) || undefined,
            orderId: order?.orderId, // opcionális, ha később webhooknál használjuk
          }),
        });
        if (!stripeResp.ok) {
          setStatus("error");
          setMessage("Stripe fizetés indítása nem sikerült.");
          return;
        }
        const stripeData = await stripeResp.json();
        if (stripeData?.url) {
          window.location.href = stripeData.url;
          return;
        }
      }

      setStatus("success");
      setMessage("Rendelésed beérkezett! Hamarosan felvesszük veled a kapcsolatot.");
      window.dispatchEvent(new CustomEvent("cart-updated", { detail: { totalHuf: 0, items: [] } }));
      if (typeof window !== "undefined") {
       window.localStorage.setItem("cart-total-huf", "0");
      }
    } catch {
      setStatus("error");
      setMessage("A rendelés mentése nem sikerült.");
    }
  };

  return (
    <form className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]" onSubmit={handleSubmit}>
      <div
        key={prefillKey}
        className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-lg shadow-black/30"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold">Elérhetőségek</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              name="email"
              className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
              placeholder="E-mail"
              type="email"
              required
              defaultValue={prefill.email}
            />
            <input
              name="phone"
              className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
              placeholder="Telefon"
              type="tel"
              defaultValue={prefill.phone}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-extrabold">Szállítási adatok</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              name="fullName"
              className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
              placeholder="Teljes név"
              required
              defaultValue={prefill.fullName}
            />
            <input
              name="company"
              className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
              placeholder="Cégnév (opcionális)"
            />
            <input
              name="country"
              className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
              placeholder="Ország"
              defaultValue={prefill.country || "Magyarország"}
            />
            <input
              name="zip"
              className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
              placeholder="Irányítószám"
              defaultValue={prefill.zip}
            />
            <input
              name="city"
              className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
              placeholder="Település"
              defaultValue={prefill.city}
            />
            <input
              name="address"
              className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
              placeholder="Utca, házszám, emelet"
              defaultValue={prefill.address}
            />
            <input
              name="taxNumber"
              className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
              placeholder="Adószám (cég esetében kötelező)"
            />
          </div>
          <textarea
            name="note"
            className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
            rows={3}
            placeholder="Megjegyzés a futárnak (opcionális)"
          />
        </div>

        <div className="space-y-3 rounded-2xl border border-border bg-secondary/40 p-4">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={billingSame}
              onChange={(e) => setBillingSame(e.target.checked)}
            />
            Számlázási adatok megegyeznek a szállítási adatokkal
          </label>
          {!billingSame && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                name="billingName"
                className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
                placeholder="Számlázási név"
                required
              />
              <input
                name="billingTaxNumber"
                className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
                placeholder="Adószám (cég esetén kötelező)"
              />
              <input
                name="billingCountry"
                className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
                placeholder="Ország"
                defaultValue="Magyarország"
                required
              />
              <input
                name="billingZip"
                className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
                placeholder="Irányítószám"
                required
              />
              <input
                name="billingCity"
                className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
                placeholder="Település"
                required
              />
              <input
                name="billingAddress"
                className="md:col-span-2 rounded-xl border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
                placeholder="Utca, házszám, emelet"
                required
              />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-extrabold">Szállítási mód</h2>
          <div className="space-y-2">
            {(shippingMethods.length
              ? shippingMethods
              : [{ id: "standard", label: "Standard futár (1-2 munkanap)", priceHuf: 0 }]
            ).map((opt) => (
              <label
                key={opt.id}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-secondary px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="shipping"
                    value={opt.id}
                    checked={selectedShipping === opt.id}
                    onChange={() => setSelectedShipping(opt.id)}
                  />
                  <span className="font-semibold text-foreground">{opt.label}</span>
                </div>
                <span className="text-muted-foreground">
                  {Number.isFinite(opt.priceHuf)
                    ? opt.priceHuf === 0
                      ? "Ingyenes"
                      : `${new Intl.NumberFormat("hu-HU").format(opt.priceHuf)} Ft`
                    : opt.note || ""}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-extrabold">Fizetés</h2>
          <div className="space-y-2">
            {[
              { id: "card", label: "Bankkártya (online)", note: "Stripe" },
              { id: "wire", label: "Átutalás", note: "Pro forma díjbekérő alapján" },
              { id: "cod", label: "Utánvét", note: "Készpénz/kártya futárnál" },
            ].map((opt, idx) => (
              <label
                key={opt.id}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-secondary px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <input type="radio" name="payment" value={opt.id} defaultChecked={idx === 0} />
                  <span className="font-semibold text-foreground">{opt.label}</span>
                </div>
                <span className="text-muted-foreground">{opt.note}</span>
              </label>
            ))}
          </div>
        </div>

        {status === "success" && (
          <div className="rounded-xl border border-green-500/50 bg-green-500/10 px-4 py-3 text-sm text-green-100">
            {message || "Rendelésed sikeresen beérkezett."}
          </div>
        )}
        {status === "error" && (
          <div className="rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {message || "Hiba történt a rendelés mentésekor."}
          </div>
        )}
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-xl shadow-black/30 lg:sticky lg:top-24">
        <h2 className="text-lg font-extrabold">Rendelés összegzése</h2>
        <div className="space-y-3">
          {items.map((item) => {
            const upgradeSum = (item.upgrades ?? []).reduce((s, u) => s + u.deltaHuf, 0);
            const lineTotal = (item.priceHuf + upgradeSum) * item.quantity;
            return (
              <div
                key={item.slug}
                className="flex items-center gap-3 rounded-xl border border-border bg-secondary p-3"
              >
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
                  <Image
                    src={
                      item.image ||
                      "https://dummyimage.com/300x200/0f1320/ffffff&text=PrimeLaptop"
                    }
                    alt={item.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-contain"
                    unoptimized
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1 text-sm">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-xs uppercase text-muted-foreground">{item.brand}</div>
                  {item.upgrades && item.upgrades.length > 0 && (
                    <div className="text-[11px] text-muted-foreground">
                      <div>Alapár: {new Intl.NumberFormat("hu-HU").format(item.priceHuf)} Ft</div>
                      {item.upgrades.map((u) => (
                        <div key={u.label}>
                          {u.label} ({new Intl.NumberFormat("hu-HU").format(u.deltaHuf)} Ft)
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">Mennyiség: {item.quantity}</div>
                </div>
                <div className="text-sm font-bold">
                  {new Intl.NumberFormat("hu-HU").format(lineTotal)} Ft
                </div>
              </div>
            );
          })}
        </div>
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Részösszeg</span>
          <span className="font-semibold text-foreground">
            {new Intl.NumberFormat("hu-HU").format(subtotal)} Ft
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Szállítás</span>
          <span className="font-semibold text-foreground">
            {items.length
              ? selectedShippingPrice === 0
                ? "Ingyenes"
                : `${new Intl.NumberFormat("hu-HU").format(selectedShippingPrice)} Ft`
              : "—"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Kedvezmény</span>
          <span className="font-semibold text-foreground">
            {discountHuf > 0 ? `- ${new Intl.NumberFormat("hu-HU").format(discountHuf)} Ft` : "—"}
          </span>
        </div>
        <div className="space-y-2 rounded-xl border border-border bg-secondary px-3 py-2">
          <label className="text-xs font-semibold text-muted-foreground">Kuponkód</label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none"
              placeholder="Pl. AKCIO5000"
            />
            <button
              type="button"
              onClick={async () => {
                if (!couponCode.trim()) {
                  setCouponStatus("error");
                  setCouponMessage("Adj meg egy kódot.");
                  return;
                }
                setCouponStatus("checking");
                setCouponMessage(null);
                try {
                  const res = await fetch("/api/cms/coupon", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code: couponCode.trim(), subtotal }),
                  });
                  const data = await res.json();
                  if (!res.ok || !data?.valid) {
                    setCouponStatus("error");
                    setCouponMessage(data?.message || "Érvénytelen kód.");
                    setDiscountHuf(0);
                    return;
                  }
                  setDiscountHuf(data.discountHuf || 0);
                  setCouponStatus("applied");
                  setCouponMessage("Kupon elfogadva.");
                } catch {
                  setCouponStatus("error");
                  setCouponMessage("Hiba a kupon ellenőrzésénél.");
                }
              }}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/40 disabled:opacity-60"
              disabled={couponStatus === "checking"}
            >
              {couponStatus === "checking" ? "Ellenőrzés..." : "Alkalmaz"}
            </button>
          </div>
          {couponMessage && (
            <div
              className={`text-xs ${
                couponStatus === "applied" ? "text-green-600" : "text-red-500"
              }`}
            >
              {couponMessage}
            </div>
          )}
        </div>
      </div>
        <div className="h-px w-full bg-border" />
        <div className="flex items-center justify-between text-base font-bold">
          <span>Végösszeg</span>
          <span>{new Intl.NumberFormat("hu-HU").format(computedTotal)} Ft</span>
        </div>
        <div className="space-y-2 rounded-xl border border-border bg-secondary px-3 py-3">
          <label className="flex items-start gap-2 text-xs font-semibold text-foreground">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={acceptedTerms}
              onChange={(ev) => {
                setAcceptedTerms(ev.target.checked);
                if (ev.target.checked) {
                  setTermsError(false);
                  if (status === "error" && message === "Nem fogadta el a vásárlási feltételeket.") {
                    setMessage(null);
                    setStatus("idle");
                  }
                }
              }}
            />
            <span>
              Elfogadom az{" "}
              <Link className="text-primary underline" href="/aszf" target="_blank" rel="noreferrer">
                Általános szerződési feltételeket
              </Link>{" "}
              és az{" "}
              <Link className="text-primary underline" href="/adatvedelem" target="_blank" rel="noreferrer">
                Adatkezelési tájékoztatót
              </Link>
              . Tudomásul veszem, hogy a megrendelés elküldése fizetési kötelezettséggel jár.
            </span>
          </label>
          {termsError && (
            <div className="text-xs font-semibold text-red-600">Nem fogadta el a vásárlási feltételeket.</div>
          )}
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className={`mt-4 w-full rounded-full px-4 py-3 text-sm font-bold shadow-lg ${
            termsError && !acceptedTerms
              ? "bg-red-600 text-white shadow-red-400/50"
              : "bg-gradient-to-r from-primary to-[#5de7bd] text-[#0c0f14] shadow-primary/30"
          } disabled:opacity-70`}
        >
          {status === "loading" ? "Rendelés küldése..." : "Rendelés leadása"}
        </button>
        {!termsError && (
          <p className="text-xs text-muted-foreground">
            A rendelés leadásával elfogadod az ÁSZF-et és az Adatvédelmi tájékoztatót.
          </p>
        )}
      </div>
    </form>
  );
}
