import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sanityClient } from "@/lib/sanity";
import { userByEmailQuery } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const name = typeof body?.name === "string" ? body.name : "";

  if (!email || !password || password.length < 8) {
    return NextResponse.json({ message: "Email és min. 8 karakteres jelszó kell" }, { status: 400 });
  }

  const existing = await sanityClient.fetch(userByEmailQuery, { email });
  if (existing?._id) {
    return NextResponse.json({ message: "Ezzel az emaillel már van fiók" }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 10);
  try {
    const doc = await sanityClient.create({
      _type: "user",
      email,
      name,
      passwordHash: hash,
      provider: "credentials",
    });
    return NextResponse.json({ userId: doc._id }, { status: 201 });
  } catch (err) {
    console.error("Register error", err);
    return NextResponse.json({ message: "Hiba a regisztrációnál" }, { status: 500 });
  }
}
