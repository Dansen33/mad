import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const codeRaw = body?.code;
    const subtotal = Number(body?.subtotal) || 0;
    const code = typeof codeRaw === "string" ? codeRaw.trim() : "";
    if (!code) return NextResponse.json({ valid: false, message: "Hiányzó kód" }, { status: 400 });

    const query = `*[_type=="coupon" && lower(code)==lower($code) && active==true][0]{
      type, value, expiresAt
    }`;
    const data = await sanityClient.fetch(query, { code });
    if (!data) return NextResponse.json({ valid: false, message: "Érvénytelen kód" }, { status: 404 });

    if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
      return NextResponse.json({ valid: false, message: "Lejárt kód" }, { status: 400 });
    }

    const type = data.type === "percent" ? "percent" : "amount";
    const valueNum = Number(data.value) || 0;
    let discount = 0;
    if (type === "percent") {
      discount = Math.floor((subtotal * valueNum) / 100);
    } else {
      discount = valueNum;
    }
    if (discount > subtotal) discount = subtotal;

    return NextResponse.json({
      valid: true,
      code,
      discountHuf: discount,
      type,
      value: valueNum,
    });
  } catch (err) {
    console.error("Coupon validate error", err);
    return NextResponse.json({ valid: false, message: "Hiba a kupon ellenőrzésénél" }, { status: 500 });
  }
}
