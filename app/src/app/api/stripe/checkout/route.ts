import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const stripeSecret = process.env.STRIPE_SECRET_KEY || "";
const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

if (!stripeSecret) {
  console.warn("Stripe: STRIPE_SECRET_KEY hiányzik az .env-ből.");
}
if (!publishable) {
  console.warn("Stripe: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY hiányzik az .env-ből.");
}

const stripe = stripeSecret && new Stripe(stripeSecret);

type LineItem = {
  name: string;
  priceHuf: number;
  quantity: number;
};

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ message: "Stripe nincs konfigurálva" }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const items = (body?.items as LineItem[]) || [];
  const orderId = body?.orderId as string | undefined;
  const customerEmail = body?.email as string | undefined;
  const totalHuf = Number(body?.totalHuf);

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ message: "Nincsenek tételek" }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${siteUrl}/fizetes-siker?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/fizetes-hiba`,
      customer_email: customerEmail,
      metadata: {
        ...(orderId ? { orderId } : {}),
      },
      line_items:
        Number.isFinite(totalHuf) && totalHuf > 0
          ? [
              {
                price_data: {
                  currency: "huf",
                  product_data: { name: "Rendelés" },
                  unit_amount: Math.max(0, Math.round(totalHuf * 100)),
                },
                quantity: 1,
              },
            ]
          : items.map((it) => ({
              price_data: {
                currency: "huf",
                product_data: { name: it.name },
                unit_amount: Math.max(0, Math.round(it.priceHuf * 100)),
              },
              quantity: Math.max(1, it.quantity || 1),
            })),
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session hiba:", err);
    return NextResponse.json({ message: "Stripe hiba" }, { status: 500 });
  }
}
