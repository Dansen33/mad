import { NextResponse } from "next/server";
import { sendCapiEvent } from "@/lib/facebook-capi";

const ALLOWED_EVENTS = new Set(["ViewContent", "AddToCart", "InitiateCheckout"]);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ message: "Invalid body" }, { status: 400 });

    const eventName = typeof body.eventName === "string" ? body.eventName : "";
    if (!ALLOWED_EVENTS.has(eventName)) {
      return NextResponse.json({ message: "Unsupported event" }, { status: 400 });
    }

    const eventId = typeof body.eventId === "string" ? body.eventId : "";
    if (!eventId) return NextResponse.json({ message: "eventId required" }, { status: 400 });

    const sourceUrl = typeof body.sourceUrl === "string" ? body.sourceUrl : undefined;
    const value = typeof body.value === "number" ? body.value : undefined;
    const currency = typeof body.currency === "string" ? body.currency : undefined;
    const email = typeof body.email === "string" ? body.email : undefined;
    const phone = typeof body.phone === "string" ? body.phone : undefined;
    const city = typeof body.city === "string" ? body.city : undefined;
    const region = typeof body.region === "string" ? body.region : undefined;
    const country = typeof body.country === "string" ? body.country : undefined;
    const dateOfBirth = typeof body.dateOfBirth === "string" ? body.dateOfBirth : undefined;

    const userAgent = req.headers.get("user-agent");
    const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null;

    await sendCapiEvent({
      eventName,
      eventId,
      sourceUrl,
      value,
      currency,
      email,
      phone,
      city,
      region,
      country,
      dateOfBirth,
      userAgent,
      ip: clientIp,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Facebook CAPI event error", err);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
