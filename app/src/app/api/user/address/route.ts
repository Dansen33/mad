import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { sanityClient } from "@/lib/sanity";
import { userAddressesQuery } from "@/lib/queries";

type UserAddress = {
  _key?: string;
  isDefault?: boolean;
};

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const user = await sanityClient.fetch(userAddressesQuery, { email: session.user.email });
  return NextResponse.json({ addresses: user?.addresses || [] });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: "Invalid body" }, { status: 400 });

  const address = {
    _type: "address",
    _key: crypto.randomUUID(),
    label: body.label || "Alapértelmezett cím",
    fullName: body.fullName || session.user.name || "",
    phone: body.phone || "",
    country: body.country || "Magyarország",
    zip: body.zip || "",
    city: body.city || "",
    addressLine: body.addressLine || "",
    isDefault: !!body.isDefault,
  };

  try {
    // ha új default, nullázzuk a többit
    if (address.isDefault) {
      const userDoc = await sanityClient.fetch(userAddressesQuery, { email: session.user.email });
      const current: UserAddress[] = Array.isArray(userDoc?.addresses) ? userDoc.addresses : [];
      const resetPaths = current
        .filter((a) => a?.isDefault)
        .map((a) => ({ set: { [`addresses[_key=="${a._key}"].isDefault`]: false } }));
      if (resetPaths.length > 0) {
        let patch = sanityClient.patch(userDoc._id);
        resetPaths.forEach((r) => {
          patch = patch.set(r.set);
        });
        await patch.commit();
      }
    }

    await sanityClient
      .patch(await sanityClient.fetch(`*[_type=="user" && lower(email)==lower($email)][0]._id`, { email: session.user.email }))
      .setIfMissing({ addresses: [] })
      .append("addresses", [address])
      .commit();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Add address error", err);
    return NextResponse.json({ message: "Hiba a cím mentésénél" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const key = body?.key as string | undefined;
  if (!key) return NextResponse.json({ message: "Hiányzó adatok" }, { status: 400 });

  try {
    const userDoc = await sanityClient.fetch(userAddressesQuery, { email: session.user.email });
    if (!userDoc?._id) return NextResponse.json({ message: "User not found" }, { status: 404 });
    const addresses: UserAddress[] = Array.isArray(userDoc.addresses) ? userDoc.addresses : [];
    const target = addresses.find((a) => a?._key === key);
    if (!target) return NextResponse.json({ message: "Cím nem található" }, { status: 404 });

    let patch = sanityClient.patch(userDoc._id);
    addresses.forEach((a) => {
      patch = patch.set({ [`addresses[_key=="${a._key}"].isDefault`]: a._key === key });
    });
    await patch.commit();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Set default address error", err);
    return NextResponse.json({ message: "Hiba a cím frissítésénél" }, { status: 500 });
  }
}
