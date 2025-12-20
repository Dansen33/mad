import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";
import { reduceStockForOrder } from "@/lib/order-stock";

export const dynamic = "force-dynamic";

type BarionTransaction = {
  POSTransactionId?: string;
  Status?: string;
};
type BarionPaymentState = {
  PaymentId?: string;
  Status?: string;
  PaymentStatus?: string;
  Transactions?: BarionTransaction[];
};

function isSuccessStatus(status?: string | null) {
  if (!status) return false;
  const s = status.toLowerCase();
  return s === "succeeded" || s === "completed";
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get("paymentId") || "";
  if (!paymentId) return NextResponse.json({ message: "paymentId required" }, { status: 400 });

  const posKey = process.env.BARION_POSKEY;
  const env = process.env.BARION_ENV === "prod" ? "prod" : "sandbox";
  if (!posKey) return NextResponse.json({ message: "Barion POSKey missing" }, { status: 500 });

  const apiBase = env === "prod" ? "https://api.barion.com" : "https://api.test.barion.com";

  try {
    const res = await fetch(
      `${apiBase}/v2/Payment/GetPaymentState?POSKey=${encodeURIComponent(posKey)}&PaymentId=${encodeURIComponent(paymentId)}`,
      { headers: { Accept: "application/json" } },
    );
    const data = (await res.json().catch(() => null)) as BarionPaymentState | null;
    if (!res.ok || !data) {
      console.error("Barion PaymentState hiba", res.status, data);
      return NextResponse.json({ message: "Barion payment state failed", detail: data }, { status: 500 });
    }

    const payStatus = data.Status || data.PaymentStatus || "";
    const txStatus = data.Transactions?.[0]?.Status || "";
    const orderId = data.Transactions?.[0]?.POSTransactionId || "";
    const success = isSuccessStatus(payStatus) || isSuccessStatus(txStatus);

    if (success && orderId) {
      try {
        await sanityClient
          .patch(orderId)
          .set({ status: "FIZETVE", barionPaymentId: data.PaymentId || paymentId, updatedAt: new Date().toISOString() })
          .commit();
        await reduceStockForOrder(orderId);
      } catch (err) {
        console.error("Barion PaymentState patch error", err);
      }
    }

    return NextResponse.json({
      status: success ? "FIZETVE" : payStatus || txStatus || null,
      orderId: orderId || null,
    });
  } catch (err) {
    console.error("Barion PaymentState fetch error", err);
    return NextResponse.json({ message: "Barion fetch error" }, { status: 500 });
  }
}
