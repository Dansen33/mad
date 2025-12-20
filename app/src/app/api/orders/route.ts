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

function parseList(value: string | undefined | null) {
  return (value || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function formatHuf(amount?: number) {
  if (!Number.isFinite(amount)) return "-";
  return `${Math.round(amount!).toLocaleString("hu-HU")} Ft`;
}

async function sendOrderEmails(params: {
  orderNumber: string;
  orderId: string;
  customerEmail: string;
  items: OrderItemInput[];
  totals: { subtotalHuf?: number; shippingHuf?: number; totalHuf?: number };
  shipping: {
    fullName: string;
    phone?: string;
    country?: string;
    zip?: string;
    city?: string;
    address?: string;
    company?: string;
    taxNumber?: string;
    note?: string;
    shippingMethod?: string;
    paymentMethod?: string;
  };
  billing?: BillingInput;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("Resend API key hiányzik, rendelés e-mail nem ment ki");
    return;
  }

  const fromCustomer = process.env.ORDER_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL || "no-reply@example.com";
  const fromInternal = fromCustomer;
  const internalTargets = parseList(process.env.ORDER_TO_EMAIL || process.env.CONTACT_TO_EMAIL);

  const itemsHtml = params.items
    .map((it) => {
      const upgrades = Array.isArray(it.upgrades) ? it.upgrades : [];
      const upgradesHtml = upgrades.length
        ? `<ul>${upgrades.map((u) => `<li>${u.label} (${formatHuf(u.deltaHuf)})</li>`).join("")}</ul>`
        : "";
      return `<li><strong>${it.name}</strong>${
        it.brand ? ` (${it.brand})` : ""
      } — ${formatHuf(it.priceHuf)} x ${it.quantity}${upgradesHtml}</li>`;
    })
    .join("");

  const shippingHtml = `
    <p><strong>Név:</strong> ${params.shipping.fullName}</p>
    ${params.shipping.phone ? `<p><strong>Telefon:</strong> ${params.shipping.phone}</p>` : ""}
    ${params.shipping.company ? `<p><strong>Cég:</strong> ${params.shipping.company}</p>` : ""}
    ${params.shipping.taxNumber ? `<p><strong>Adószám:</strong> ${params.shipping.taxNumber}</p>` : ""}
    <p><strong>Cím:</strong> ${params.shipping.zip || ""} ${params.shipping.city || ""}, ${params.shipping.address || ""} ${
      params.shipping.country || ""
    }</p>
    ${params.shipping.shippingMethod ? `<p><strong>Szállítás:</strong> ${params.shipping.shippingMethod}</p>` : ""}
    ${params.shipping.paymentMethod ? `<p><strong>Fizetés:</strong> ${params.shipping.paymentMethod}</p>` : ""}
    ${params.shipping.note ? `<p><strong>Megjegyzés:</strong> ${params.shipping.note}</p>` : ""}
  `;

  const billingHtml =
    params.billing && Object.values(params.billing).some(Boolean)
      ? `
    <p><strong>Számlázás:</strong></p>
    ${params.billing.billingName ? `<p>${params.billing.billingName}</p>` : ""}
    ${params.billing.billingTaxNumber ? `<p>Adószám: ${params.billing.billingTaxNumber}</p>` : ""}
    <p>${params.billing.billingZip || ""} ${params.billing.billingCity || ""}, ${
          params.billing.billingAddress || ""
        } ${params.billing.billingCountry || ""}</p>
  `
      : "";

  const totalsHtml = `
    <p><strong>Részösszeg:</strong> ${formatHuf(params.totals.subtotalHuf)}</p>
    <p><strong>Szállítás:</strong> ${formatHuf(params.totals.shippingHuf)}</p>
    <p><strong>Végösszeg:</strong> ${formatHuf(params.totals.totalHuf)}</p>
  `;

  const htmlBody = (isInternal: boolean) => `
    <p>Köszönjük a rendelést! (Rendelésszám: <strong>${params.orderNumber}</strong>)</p>
    <p><strong>Tételek:</strong></p>
    <ul>${itemsHtml}</ul>
    ${totalsHtml}
    <p><strong>Szállítási adatok:</strong></p>
    ${shippingHtml}
    ${billingHtml}
    ${isInternal ? `<p><strong>Order ID:</strong> ${params.orderId}</p>` : ""}
  `;

  const promises: Promise<unknown>[] = [];

  // Customer confirmation
  if (params.customerEmail) {
    promises.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: fromCustomer,
          to: [params.customerEmail],
          subject: `Rendelés visszaigazolás - ${params.orderNumber}`,
          html: htmlBody(false),
        }),
      }),
    );
  }

  // Internal notification
  if (internalTargets.length) {
    promises.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: fromInternal,
          to: internalTargets,
          subject: `Új rendelés - ${params.orderNumber}`,
          html: htmlBody(true),
        }),
      }),
    );
  }

  if (promises.length) {
    await Promise.allSettled(promises);
  }
}

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
            .map((u: { label?: unknown; deltaHuf?: unknown }, uidx: number) => ({
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

    // Email értesítések (nem blokkoljuk a választ)
    sendOrderEmails({
      orderNumber,
      orderId: doc._id,
      customerEmail: email,
      items: mappedItems,
      totals: { subtotalHuf, shippingHuf, totalHuf },
      shipping: {
        fullName,
        phone,
        country,
        zip,
        city,
        address,
        company,
        taxNumber,
        note,
        shippingMethod,
        paymentMethod,
      },
      billing: billingSame === false ? docBody.billing : undefined,
    }).catch((err) => {
      console.error("Order email küldés hiba", err);
    });

    return NextResponse.json({ orderId: doc._id, orderNumber }, { status: 201 });
  } catch (err) {
    console.error("Order create error", err);
    return NextResponse.json({ message: "Order create failed" }, { status: 500 });
  }
}
