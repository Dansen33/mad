"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ConsentState = { marketing: boolean; timestamp: number };

const COOKIE_NAME = "cookie-consent";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 nap
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const fbPixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

function readConsent(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw.split("=")[1]));
    if (typeof parsed?.marketing === "boolean") {
      return { marketing: parsed.marketing, timestamp: parsed.timestamp ?? Date.now() };
    }
  } catch {
    /* ignore */
  }
  return null;
}

function writeConsent(marketing: boolean) {
  if (typeof document === "undefined") return;
  const value: ConsentState = { marketing, timestamp: Date.now() };
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(value))}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function loadGtm(id: string) {
  if (typeof window === "undefined") return;
  if ((window as any)._gtmLoaded) return;
  (window as any)._gtmLoaded = true;
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
  document.head.appendChild(script);
}

function loadFbPixel(id: string) {
  if (typeof window === "undefined") return;
  if ((window as any)._fbqLoaded) return;
  (window as any)._fbqLoaded = true;
  const n = (window as any).fbq;
  if (!n) {
    const fbq: any = function () {
      fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
    };
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.push = fbq;
    fbq.allowDuplicatePageViews = true;
    (window as any).fbq = fbq;
  }
  (window as any).fbq("init", id);
  (window as any).fbq("track", "PageView");
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
}

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const enableTracking = (allowMarketing: boolean) => {
    if (!allowMarketing) return;
    if (gtmId) loadGtm(gtmId);
    if (fbPixelId) loadFbPixel(fbPixelId);
  };

  useEffect(() => {
    const existing = readConsent();
    if (existing) {
      setMarketing(existing.marketing);
      setShow(false);
      enableTracking(existing.marketing);
    } else {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center p-4">
      <div className="pointer-events-auto w-[min(620px,95vw)] max-w-3xl translate-y-0 rounded-2xl border border-border bg-card p-4 shadow-2xl shadow-black/25">
        <div className="space-y-2">
          <div className="text-sm font-bold text-foreground">Sütibeállítások</div>
          <p className="text-xs text-muted-foreground">
            Csak a működéshez szükséges sütiket használjuk alapból. Marketing / mérési sütiket (GTM,
            Pixel) csak hozzájárulás után töltünk be. A döntést bármikor módosíthatod.
          </p>
          {showSettings && (
            <div className="space-y-2 rounded-xl border border-border bg-secondary/50 p-3">
              <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                <span>Szükséges sütik</span>
                <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
                  mindig aktív
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-foreground">
                <span>Marketing / mérés (GTM, Pixel)</span>
                <label className="inline-flex cursor-pointer items-center gap-2 text-xs">
                  <span>{marketing ? "Be" : "Ki"}</span>
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="h-4 w-4 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              className="rounded-full border border-border bg-secondary px-3 py-2 font-semibold text-foreground hover:border-primary/60"
              onClick={() => {
                writeConsent(false);
                setShow(false);
              }}
            >
              Csak szükséges
            </button>
            {!showSettings && (
              <button
                type="button"
                className="rounded-full border border-border bg-secondary px-3 py-2 font-semibold text-foreground hover:border-primary/60"
                onClick={() => setShowSettings(true)}
              >
                Beállítások
              </button>
            )}
            {showSettings && (
              <button
                type="button"
                className="rounded-full border border-border bg-secondary px-3 py-2 font-semibold text-foreground hover:border-primary/60"
                onClick={() => {
                  writeConsent(marketing);
                  enableTracking(marketing);
                  setShow(false);
                }}
              >
                Mentés
              </button>
            )}
            <button
              type="button"
              className="rounded-full bg-primary px-3 py-2 font-semibold text-primary-foreground shadow-sm shadow-primary/40"
              onClick={() => {
                writeConsent(true);
                setMarketing(true);
                enableTracking(true);
                setShow(false);
              }}
            >
              Elfogadom
            </button>
            <div className="ml-auto text-[11px] text-muted-foreground">
              Részletek:{" "}
              <Link className="underline hover:text-foreground" href="/adatvedelem">
                Adatvédelmi tájékoztató
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
