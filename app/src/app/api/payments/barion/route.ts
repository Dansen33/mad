import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

export const dynamic = "force-dynamic";

type Item = {
  name: string;
  priceHuf: number;
  quantity: number;
};

function money(v: number) {
  return Math.max(0, Math.round(v * 100) / 100); // Barion HUF érték, 2 tizedes
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: "Invalid body" }, { status: 400 });

  const posKey = process.env.BARION_POSKEY;
  const payee = process.env.BARION_PAYEE || "";
  const env = process.env.BARION_ENV === "prod" ? "prod" : "sandbox";

  if (!posKey) {
    return NextResponse.json({ message: "Barion POSKey hiányzik" }, { status: 500 });
  }
  if (!payee) {
    return NextResponse.json({ message: "Barion payee hiányzik" }, { status: 500 });
  }

  const orderId = typeof body.orderId === "string" ? body.orderId : "";
  const orderNumber = typeof body.orderNumber === "string" ? body.orderNumber : "";
  const email = typeof body.email === "string" ? body.email : "";
  const successUrl = typeof body.successUrl === "string" ? body.successUrl : "";
  const itemsInput = Array.isArray(body.items) ? (body.items as Item[]) : [];
  const shippingHuf = Number(body.shippingHuf) || 0;
  const discountHuf = Number(body.discountHuf) || 0;
  const totalHuf = Number(body.totalHuf) || 0;

  const apiBase = env === "prod" ? "https://api.barion.com" : "https://api.test.barion.com";

  const items = itemsInput
    .map((it) => ({
      Name: it.name?.slice(0, 100) || "Termék",
      Description: it.name?.slice(0, 250) || "Termék",
      Quantity: Math.max(1, Number(it.quantity) || 1),
      Unit: "db",
      UnitPrice: money(Number(it.priceHuf) || 0),
      ItemTotal: money((Number(it.priceHuf) || 0) * Math.max(1, Number(it.quantity) || 1)),
    }))
    .filter((it) => it.UnitPrice > 0 && it.Quantity > 0);

  let itemsTotal = items.reduce((sum, it) => sum + it.ItemTotal, 0);
  if (shippingHuf > 0) {
    const shipTotal = money(shippingHuf);
    items.push({
      Name: "Szállítás",
      Description: "",
      Quantity: 1,
      Unit: "szállítás",
      UnitPrice: shipTotal,
      ItemTotal: shipTotal,
    });
    itemsTotal += shipTotal;
  }

  const discountApplied = Math.min(Math.max(0, money(discountHuf)), itemsTotal);
  if (discountApplied > 0) {
    const disc = money(-discountApplied);
    items.push({
      Name: "Kedvezmény",
      Description: "Kupon / akció",
      Quantity: 1,
      Unit: "kedvezmény",
      UnitPrice: disc,
      ItemTotal: disc,
    });
  }

  const totalWithDiscount = money(Math.max(0, itemsTotal - discountApplied));
  const requestedTotal = totalHuf > 0 ? money(totalHuf) : totalWithDiscount;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (env === "sandbox" ? "http://localhost:3000" : "");
  const callbackUrl =
    (typeof process.env.BARION_CALLBACK_URL === "string" && process.env.BARION_CALLBACK_URL) ||
    (siteUrl ? `${siteUrl}/api/barion/webhook` : "");
  if (!callbackUrl) {
    console.error("Barion start hiba: CallbackUrl nincs beállítva");
    return NextResponse.json({ message: "Barion callback URL hiányzik" }, { status: 500 });
  }

  const payload = {
    POSKey: posKey,
    PaymentType: "Immediate",
    GuestCheckoutAllowed: true,
    GuestCheckout: true,
    FundingSources: ["BankCard"],
    PaymentRequestId: orderNumber || orderId || `order-${Date.now()}`,
    PayerHint: email,
    Locale: "hu-HU",
    Currency: "HUF",
    RedirectUrl: successUrl || `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/fizetes-siker`,
    CallbackUrl: callbackUrl,
    Transactions: [
      {
        POSTransactionId: orderId || orderNumber || `pos-${Date.now()}`,
        Payee: payee,
        Total: requestedTotal,
        Items: items,
      },
    ],
  };

  try {
    // Barion sandbox/prod: v2 endpoint /Payment/Start
    const res = await fetch(`${apiBase}/v2/Payment/Start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    const redirect = data?.PaymentRedirectUrl || data?.GatewayUrl || data?.RedirectUrl;
    if (!res.ok || !redirect) {
      console.error("Barion start hiba", res.status, data);
      return NextResponse.json({ message: "Barion start failed", detail: data }, { status: 500 });
    }
    // mentjük a PaymentId-t az orderre, hogy akkor is látszódjon, ha a felhasználó nem jön vissza
    if (orderId && data?.PaymentId) {
      try {
        await sanityClient
          .patch(orderId)
          .set({
            barionPaymentId: data.PaymentId,
            barionStatus: data.Status || "Prepared",
          })
          .commit();
      } catch (err) {
        console.error("Order patch (Barion start) hiba", err);
      }
    }
    return NextResponse.json({
      redirectUrl: redirect,
      paymentId: data.PaymentId,
    });
  } catch (err) {
    console.error("Barion start fetch hiba", err);
    return NextResponse.json({ message: "Barion elérés hiba" }, { status: 500 });
  }
}
