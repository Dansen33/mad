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

async function parseBarionBody(req: Request): Promise<BarionEvent | null> {
  const raw = await req.text().catch(() => "");
  if (!raw) return null;

  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed) as BarionEvent;
  } catch {
    const params = new URLSearchParams(trimmed);
    if ([...params.keys()].length === 0) return null;

    const txId =
      params.get("posTransactionId") ||
      params.get("POSTransactionId") ||
      params.get("PosTransactionId") ||
      undefined;
    const txStatus =
      params.get("transactionStatus") || params.get("TransactionStatus") || params.get("Status") || undefined;

    const event: BarionEvent = {
      PaymentId: params.get("paymentId") || params.get("PaymentId") || undefined,
      PaymentRequestId: params.get("paymentRequestId") || params.get("PaymentRequestId") || undefined,
      Status: params.get("status") || params.get("Status") || undefined,
    };

    if (txId || txStatus) {
      event.Transactions = [{ POSTransactionId: txId, Status: txStatus }];
    }

    return event;
  }
}

async function fetchPaymentState(paymentId: string): Promise<BarionPaymentState | null> {
  if (!paymentId) return null;

  const posKey = process.env.BARION_POSKEY;
  const env = process.env.BARION_ENV === "prod" ? "prod" : "sandbox";
  if (!posKey) {
    console.error("Barion webhook: POSKey missing, PaymentId:", paymentId);
    return null;
  }

  const apiBase = env === "prod" ? "https://api.barion.com" : "https://api.test.barion.com";

  try {
    const res = await fetch(
      `${apiBase}/v2/Payment/GetPaymentState?POSKey=${encodeURIComponent(posKey)}&PaymentId=${encodeURIComponent(paymentId)}`,
      { headers: { Accept: "application/json" } },
    );
    const data = (await res.json().catch(() => null)) as BarionPaymentState | null;
    if (!res.ok || !data) {
      console.error("Barion PaymentState hiba (webhook)", res.status, data);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Barion PaymentState fetch error (webhook)", err);
    return null;
  }
}

async function handleWebhook(req: Request) {
  const url = new URL(req.url);
  const queryPaymentId = url.searchParams.get("paymentId") || url.searchParams.get("PaymentId") || "";
  const queryStatus = url.searchParams.get("status") || url.searchParams.get("Status") || "";
  const queryOrderId =
    url.searchParams.get("posTransactionId") ||
    url.searchParams.get("POSTransactionId") ||
    url.searchParams.get("PosTransactionId") ||
    "";

  const body: BarionEvent = (await parseBarionBody(req)) || {};

  if (!body.PaymentId && queryPaymentId) body.PaymentId = queryPaymentId;
  if (!body.Status && queryStatus) body.Status = queryStatus;
  if ((!body.Transactions || body.Transactions.length === 0) && queryOrderId) {
    body.Transactions = [{ POSTransactionId: queryOrderId }];
  }

  const paymentId = body.PaymentId || "";
  let status = body.Status || "";
  let txStatus = body.Transactions?.[0]?.Status || "";
  let orderId = body.Transactions?.[0]?.POSTransactionId || "";

  console.log("Barion webhook received", {
    paymentId,
    status,
    txStatus,
    orderId,
    query: { paymentId: queryPaymentId, status: queryStatus, orderId: queryOrderId },
  });

  // respond immediately; do the heavy lifting in the background
  void (async () => {
    if ((!orderId || !status) && paymentId) {
      const state = await fetchPaymentState(paymentId);
      if (state) {
        status = status || state.Status || state.PaymentStatus || "";
        txStatus = txStatus || state.Transactions?.[0]?.Status || "";
        if (!orderId) {
          orderId = state.Transactions?.[0]?.POSTransactionId || "";
        }
      }
    }

    const success = isSuccessStatus(status) || isSuccessStatus(txStatus);
    console.log("Barion webhook resolved state", { paymentId, orderId, status, txStatus, success });

    if (orderId) {
      try {
        if (success) {
          await sanityClient
            .patch(orderId)
            .set({
              status: "FIZETVE",
              barionPaymentId: paymentId || "",
              barionStatus: status || txStatus || "Succeeded",
            })
            .commit();
          await reduceStockForOrder(orderId);
        } else if (status === "Canceled" || status === "Expired" || txStatus === "Canceled") {
          await sanityClient
            .patch(orderId)
            .set({
              status: "TOROLVE",
              barionStatus: status || txStatus || "Canceled",
            })
            .commit();
        } else if (status || txStatus) {
          await sanityClient
            .patch(orderId)
            .set({
              barionPaymentId: paymentId || "",
              barionStatus: status || txStatus,
            })
            .commit();
        }
      } catch (err) {
        console.error("Barion webhook patch error", err);
      }
    } else if (paymentId) {
      console.warn("Barion webhook: orderId missing", { paymentId, status, txStatus });
    }
  })();

  return NextResponse.json({ received: true, orderId: orderId || null });
}

export async function POST(req: Request) {
  return handleWebhook(req);
}

export async function GET(req: Request) {
  return handleWebhook(req);
}
