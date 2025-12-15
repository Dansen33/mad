import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sanityClient } from "@/lib/sanity";
import { userByEmailQuery } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const token = typeof body?.token === "string" ? body.token.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !token || password.length < 8) {
    return NextResponse.json({ message: "Hiányzó adat vagy túl rövid jelszó" }, { status: 400 });
  }

  try {
    const user = await sanityClient.fetch(userByEmailQuery, { email });
    if (!user?._id || !user.resetTokenHash || !user.resetTokenExp) {
      return NextResponse.json({ message: "Érvénytelen vagy lejárt token" }, { status: 400 });
    }
    if (new Date(user.resetTokenExp) < new Date()) {
      return NextResponse.json({ message: "Lejárt token" }, { status: 400 });
    }

    const hash = crypto.createHash("sha256").update(token).digest("hex");
    if (hash !== user.resetTokenHash) {
      return NextResponse.json({ message: "Érvénytelen token" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await sanityClient
      .patch(user._id)
      .set({ passwordHash, resetTokenHash: null, resetTokenExp: null })
      .commit({ autoGenerateArrayKeys: true });

    return NextResponse.json({ message: "Jelszó frissítve" });
  } catch (err) {
    console.error("reset confirm error", err);
    return NextResponse.json({ message: "Hiba történt" }, { status: 500 });
  }
}
