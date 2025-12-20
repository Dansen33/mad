import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function parseList(value: string | undefined | null) {
  return (value || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const topic = typeof body?.topic === "string" ? body.topic.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json({ message: "Név, email és üzenet kötelező" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL || process.env.RESET_FROM_EMAIL || "no-reply@example.com";
  const toList = parseList(process.env.CONTACT_TO_EMAIL || process.env.CONTACT_FROM_EMAIL);

  if (!apiKey) {
    console.warn("Resend API key hiányzik, contact email nem ment ki");
    return NextResponse.json({ message: "Email küldés nincs konfigurálva" }, { status: 500 });
  }

  if (!toList.length) {
    console.warn("CONTACT_TO_EMAIL nincs beállítva, contact email nem ment ki");
    return NextResponse.json({ message: "Címzett nincs konfigurálva" }, { status: 500 });
  }

  const subject = topic ? `Kapcsolatfelvétel - ${topic}` : "Kapcsolatfelvétel";

  const html = `
    <p>Új üzenet érkezett a kapcsolat űrlapról.</p>
    <p><strong>Név:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ""}
    ${topic ? `<p><strong>Téma:</strong> ${topic}</p>` : ""}
    <p><strong>Üzenet:</strong></p>
    <p>${message.replace(/\n/g, "<br/>")}</p>
  `;

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: toList,
        subject,
        html,
        reply_to: [email],
      }),
    });
    if (!resendRes.ok) {
      const text = await resendRes.text().catch(() => "");
      console.error("Contact email Resend hiba", resendRes.status, text);
    }
  } catch (err) {
    console.error("Contact email küldés hiba", err);
  }

  return NextResponse.json({ ok: true });
}
