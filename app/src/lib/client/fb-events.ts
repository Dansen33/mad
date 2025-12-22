"use client";

const COOKIE_NAME = "cookie-consent";

function hasMarketingConsent() {
  if (typeof document === "undefined") return false;
  const raw = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!raw) return false;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw.split("=")[1]));
    return parsed?.marketing === true;
  } catch {
    return false;
  }
}

type EventInput = {
  eventName: "ViewContent" | "AddToCart" | "InitiateCheckout";
  eventId?: string;
  sourceUrl?: string;
  value?: number;
  currency?: string;
  email?: string;
  phone?: string;
  city?: string;
  region?: string;
  country?: string;
  dateOfBirth?: string;
};

export async function sendFacebookEvent(input: EventInput) {
  if (!hasMarketingConsent()) return null;
  const eventId =
    input.eventId ||
    (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const sourceUrl = input.sourceUrl || (typeof window !== "undefined" ? window.location.href : undefined);
  try {
    await fetch("/api/facebook/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, eventId, sourceUrl }),
    });
  } catch {
    /* ignore */
  }
  return eventId;
}
