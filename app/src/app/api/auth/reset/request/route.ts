import { NextResponse } from "next/server";
import crypto from "crypto";
import { sanityClient } from "@/lib/sanity";
import { userByEmailQuery } from "@/lib/queries";

async function sendResetEmail(to: string, resetUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESET_FROM_EMAIL || "no-reply@example.com";
  if (!apiKey) {
    console.warn("Resend API key nincs beállítva, email nem ment ki. (RESET FROM:", from, ")");
    return;
  }
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to,
        subject: "Jelszó visszaállítás",
        html: `<p>A jelszó visszaállításához kattints a linkre:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>Ha nem te kérted, hagyd figyelmen kívül.</p>`,
      }),
    });
  } catch (err) {
    console.error("Email küldés hiba (Resend):", err);
  }
}

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email) return NextResponse.json({ message: "Adj meg egy email címet" }, { status: 400 });

  try {
    const user = await sanityClient.fetch(userByEmailQuery, { email });
    if (!user?._id) {
      // ne áruljuk el, hogy nincs user
      return NextResponse.json({ message: "Ha létezik a fiók, küldtünk visszaállító linket." });
    }
    const token = crypto.randomUUID();
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    const exp = new Date(Date.now() + 1000 * 60 * 60).toISOString(); // 1 óra
    await sanityClient
      .patch(user._id)
      .set({ resetTokenHash: hash, resetTokenExp: exp })
      .commit({ autoGenerateArrayKeys: true });

    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/jelszo-visszaallit?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;

    // Email küldése (Resend). Ha nincs kulcs, csak logol.
    await sendResetEmail(email, resetUrl);

    const payload: Record<string, unknown> = { message: "Reset kérés rögzítve" };
    if (process.env.NODE_ENV !== "production") payload.resetUrl = resetUrl; // fejlesztéshez
    return NextResponse.json(payload);
  } catch (err) {
    console.error("reset request error", err);
    return NextResponse.json({ message: "Hiba történt" }, { status: 500 });
  }
}
