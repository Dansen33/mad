import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sanityClient } from "@/lib/sanity";

export const dynamic = "force-dynamic";

const stripeSecret = process.env.STRIPE_SECRET_KEY || "";
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

const stripe = stripeSecret && new Stripe(stripeSecret);

export async function POST(req: Request) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ message: "Stripe webhook nincs konfigurálva" }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature || "", webhookSecret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook verify error:", msg);
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      try {
        // Lekérjük az ordert, ha már fizetve, nem csökkentünk még egyszer
        const order = await sanityClient.fetch(
          `*[_type=="order" && _id==$id][0]{status, items[]{slug, quantity}}`,
          { id: orderId },
        );
        if (!order) {
          console.error("Order not found for webhook", orderId);
          return NextResponse.json({ received: true });
        }
        if (order.status === "FIZETVE") {
          return NextResponse.json({ received: true });
        }

        await sanityClient.patch(orderId).set({ status: "FIZETVE" }).commit();

        type ReducedItem = { slug?: string; quantity?: number };
        const items: ReducedItem[] = Array.isArray(order.items) ? order.items : [];
        const slugs = Array.from(new Set(items.map((it) => it.slug).filter(Boolean)));

        await Promise.all(
          slugs.map(async (slug) => {
            try {
              const prod = await sanityClient.fetch(
                `*[_type=="product" && slug.current==$slug][0]{_id, stock}`,
                { slug },
              );
              if (!prod?._id) return;
              const orderedQty = items
                .filter((it) => it.slug === slug)
                .reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
              const currentStock = Number(prod.stock ?? 0);
              const newStock = Math.max(currentStock - orderedQty, 0);
              await sanityClient.patch(prod._id).set({ stock: newStock }).commit();
            } catch (err) {
              console.error("Stock update failed for", slug, err);
            }
          }),
        );
      } catch (err) {
        console.error("Sanity order update error:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
