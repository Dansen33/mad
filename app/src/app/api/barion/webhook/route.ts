import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";
import { reduceStockForOrder } from "@/lib/order-stock";

export const dynamic = "force-dynamic";

type BarionTransaction = {
  POSTransactionId?: string;
  Status?: string;
};
type BarionEvent = {
  PaymentId?: string;
  PaymentRequestId?: string;
  Status?: string;
  Transactions?: BarionTransaction[];
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as BarionEvent | null;
  if (!body) return NextResponse.json({ message: "Invalid body" }, { status: 400 });

  const status = body.Status || "";
    const orderId = body.Transactions?.[0]?.POSTransactionId || "";

    if (!orderId) {
      return NextResponse.json({ received: true });
    }

  try {
    if (status === "Succeeded" || status === "Completed") {
      await sanityClient
        .patch(orderId)
        .set({
          status: "FIZETVE",
          barionPaymentId: body.PaymentId || "",
          barionStatus: status,
        })
        .commit();
      await reduceStockForOrder(orderId);
    } else if (status === "Canceled") {
      await sanityClient
        .patch(orderId)
        .set({
          status: "TOROLVE",
          barionStatus: status,
        })
        .commit();
    }
  } catch (err) {
    console.error("Barion webhook patch error", err);
  }

  return NextResponse.json({ received: true });
}
