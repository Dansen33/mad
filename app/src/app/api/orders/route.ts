import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

type OrderItemInput = {
  slug: string;
  name: string;
  brand?: string;
  priceHuf: number;
  quantity: number;
  image?: string | null;
  upgrades?: { label: string; deltaHuf: number }[];
};

type BillingInput = {
  billingName?: string;
  billingTaxNumber?: string;
  billingCountry?: string;
  billingZip?: string;
  billingCity?: string;
  billingAddress?: string;
};

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: "Invalid body" }, { status: 400 });

  const {
    email,
    phone,
    fullName,
    company,
    taxNumber,
    country,
    zip,
    city,
    address,
    note,
    shippingMethod,
    paymentMethod,
    items,
    subtotalHuf,
    shippingHuf,
    totalHuf,
    billingSame,
    billing,
  } = body;

  if (!email || !fullName || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    // Rendelésszám generálás: YYYY + 5 jegyű növekvő sorszám
    const year = new Date().getFullYear();
    const prefix = `${year}`;
    const last = await sanityClient.fetch(
      `*[_type=="order" && defined(orderNumber) && orderNumber match $prefixMatch]|order(orderNumber desc)[0]{orderNumber}`,
      { prefixMatch: `${prefix}*` },
    );
    const lastSeq =
      last && typeof last.orderNumber === "string" && last.orderNumber.startsWith(prefix)
        ? Number(last.orderNumber.slice(prefix.length)) || 0
        : 0;
    const nextSeq = lastSeq + 1;
    const orderNumber = `${prefix}${String(nextSeq).padStart(5, "0")}`;

    const mappedItems: OrderItemInput[] = items.map((it: OrderItemInput, idx: number) => ({
      slug: it.slug,
      name: it.name,
      brand: it.brand,
      priceHuf: it.priceHuf,
      quantity: it.quantity,
      image: it.image,
      upgrades: Array.isArray(it.upgrades)
        ? it.upgrades
            .map((u: any, uidx: number) => ({
              label: typeof u?.label === "string" ? u.label : "",
              deltaHuf: Number(u?.deltaHuf) || 0,
              _type: "object",
              _key:
                typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
                  ? crypto.randomUUID()
                  : `${it.slug || "upgrade"}-${Date.now()}-${idx}-${uidx}`,
            }))
            .filter((u) => u.label)
        : [],
      _type: "object",
      _key:
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${it.slug || "item"}-${Date.now()}-${idx}`,
    }));

    const docBody: {
      _type: "order";
      orderNumber: string;
      email: string;
      phone?: string;
      fullName: string;
      company?: string;
      taxNumber?: string;
      country?: string;
      zip?: string;
      city?: string;
      address?: string;
      note?: string;
      shippingMethod?: string;
      paymentMethod?: string;
      items: OrderItemInput[];
      subtotalHuf?: number;
      shippingHuf?: number;
      totalHuf?: number;
      status: string;
      createdAt: string;
      billingSame: boolean;
      billing?: BillingInput;
    } = {
      _type: "order",
      orderNumber,
      email,
      phone,
      fullName,
      company,
      taxNumber,
      country,
      zip,
      city,
      address,
      note,
      shippingMethod,
      paymentMethod,
      items: mappedItems,
      subtotalHuf,
      shippingHuf,
      totalHuf,
      status: "LEADVA",
      createdAt: new Date().toISOString(),
      billingSame: billingSame === false ? false : true,
    };

    if (billingSame === false && billing) {
      docBody.billing = {
        billingName: billing.billingName,
        billingTaxNumber: billing.billingTaxNumber,
        billingCountry: billing.billingCountry,
        billingZip: billing.billingZip,
        billingCity: billing.billingCity,
        billingAddress: billing.billingAddress,
      };
    }

    const doc = await sanityClient.create(docBody);

    return NextResponse.json({ orderId: doc._id, orderNumber }, { status: 201 });
  } catch (err) {
    console.error("Order create error", err);
    return NextResponse.json({ message: "Order create failed" }, { status: 500 });
  }
}
