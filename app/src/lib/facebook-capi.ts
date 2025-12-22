import crypto from "crypto";

type UserData = {
  em?: string[];
  ph?: string[];
  ct?: string[];
  country?: string[];
  db?: string[];
  client_user_agent?: string;
  client_ip_address?: string;
};

type PurchasePayload = {
  eventId: string;
  value: number;
  currency?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string; // YYYYMMDD
  userAgent?: string | null;
  ip?: string | null;
  sourceUrl?: string;
};

function sha256(input?: string | null) {
  if (!input) return undefined;
  try {
    return crypto.createHash("sha256").update(input.trim().toLowerCase()).digest("hex");
  } catch {
    return undefined;
  }
}

function buildUserData(payload: PurchasePayload): UserData {
  return {
    em: payload.email ? [sha256(payload.email)!] : undefined,
    ph: payload.phone ? [sha256(payload.phone.replace(/\D/g, ""))!] : undefined,
    ct: payload.city ? [sha256(payload.city)!] : undefined,
    country: payload.country ? [sha256(payload.country)!] : undefined,
    db: payload.dateOfBirth ? [sha256(payload.dateOfBirth)!] : undefined,
    client_user_agent: payload.userAgent || undefined,
    client_ip_address: payload.ip || undefined,
  };
}

export async function sendPurchaseCapi(payload: PurchasePayload) {
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  const token = process.env.FACEBOOK_CONVERSIONS_API_TOKEN;
  if (!pixelId || !token) return;
  if (!payload.eventId) return;

  const body = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: payload.eventId,
        event_source_url: payload.sourceUrl || "https://wellcomp.hu/fizetes-siker",
        action_source: "website",
        user_data: buildUserData(payload),
        custom_data: {
          currency: payload.currency || "HUF",
          value: payload.value,
        },
      },
    ],
    test_event_code: process.env.FACEBOOK_TEST_EVENT_CODE,
  };

  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      console.error("Facebook CAPI error", res.status, data);
    }
  } catch (err) {
    console.error("Facebook CAPI request failed", err);
  }
}
