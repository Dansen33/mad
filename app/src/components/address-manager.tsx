"use client";

import { useEffect, useState, FormEvent } from "react";

type Address = {
  _key: string;
  label?: string;
  fullName?: string;
  phone?: string;
  country?: string;
  zip?: string;
  city?: string;
  addressLine?: string;
  type?: "shipping" | "billing";
  isDefault?: boolean;
};

export function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/address", { cache: "no-store" });
      if (!res.ok) throw new Error("Hiba a címek lekérésekor");
      const data = await res.json();
      setAddresses(data.addresses || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Hiba a címek lekérésekor";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      label: form.get("label") as string,
      fullName: form.get("fullName") as string,
      phone: form.get("phone") as string,
      country: form.get("country") as string,
      zip: form.get("zip") as string,
      city: form.get("city") as string,
      addressLine: form.get("addressLine") as string,
      type: form.get("type") as string,
      isDefault: form.get("isDefault") === "on",
    };
    if (!payload.zip || !payload.city || !payload.addressLine) {
      setError("Kötelező megadni: irányítószám, település, cím.");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const res = await fetch("/api/user/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Hiba a cím mentésénél");
      }
      (e.target as HTMLFormElement).reset();
      await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Hiba a cím mentésénél";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const setDefault = async (key: string) => {
    try {
      await fetch("/api/user/address", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Hiba a mentésnél";
      setError(msg);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-extrabold">Új cím</h3>
        <p className="text-xs text-muted-foreground">Szállítási vagy számlázási cím hozzáadása.</p>
      </div>
      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </div>
      )}
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          name="label"
          placeholder="Megnevezés (pl. Otthon)"
          className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:outline-none sm:col-span-2"
        />
        <input
          name="fullName"
          placeholder="Kapcsolattartó"
          className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:outline-none sm:col-span-2"
        />
        <input
          name="phone"
          placeholder="Telefon"
          className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:outline-none sm:col-span-2"
        />
        <input
          name="country"
          defaultValue="Magyarország"
          placeholder="Ország"
          className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
        />
        <input
          name="zip"
          placeholder="Irányítószám"
          className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:outline-none"
          required
        />
        <input
          name="city"
          placeholder="Település"
          className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:outline-none sm:col-span-2"
          required
        />
        <input
          name="addressLine"
          placeholder="Utca, házszám, emelet"
          className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm focus:outline-none sm:col-span-2"
          required
        />
        <label className="flex items-center gap-2 text-sm sm:justify-start">
          <input type="checkbox" name="isDefault" />
          Alapértelmezett
        </label>
        <button
          type="submit"
          disabled={saving}
          className="sm:col-span-2 rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30 disabled:opacity-70"
        >
          {saving ? "Mentés..." : "Cím mentése"}
        </button>
      </form>

      <div className="space-y-2">
        <h3 className="text-base font-extrabold">Mentett címek</h3>
        {loading && <div className="text-sm text-muted-foreground">Betöltés…</div>}
        {!loading && addresses.length === 0 && (
          <div className="text-sm text-muted-foreground">Nincs mentett cím.</div>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div key={addr._key} className="rounded-xl border border-border bg-secondary/60 p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">{addr.label || "Cím"}</span>
                {addr.isDefault && (
                  <span className="rounded-full bg-primary/15 px-2 py-1 text-[11px] font-bold text-primary">
                    Alapértelmezett
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {addr.fullName || ""} {addr.phone ? `• ${addr.phone}` : ""}
              </div>
              <div className="text-xs text-muted-foreground">
                {addr.zip} {addr.city}
              </div>
              <div className="text-xs text-muted-foreground">{addr.addressLine}</div>
              <button
                onClick={() => setDefault(addr._key)}
                className="mt-2 inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold hover:border-primary/60"
              >
                Beállítás alapértelmezettre
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
