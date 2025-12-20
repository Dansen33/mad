import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get("paymentId") || "";
  if (!paymentId) return NextResponse.json({ message: "paymentId required" }, { status: 400 });

  try {
    const order = await sanityClient.fetch(
      `*[_type=="order" && barionPaymentId==$pid][0]{status,orderNumber}`,
      { pid: paymentId },
    );
    if (!order) return NextResponse.json({ status: null });
    return NextResponse.json({ status: order.status || null, orderNumber: order.orderNumber || null });
  } catch (err) {
    console.error("Barion status fetch error", err);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
