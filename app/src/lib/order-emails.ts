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

type OrderItemInput = {
  slug?: string;
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

export async function sendOrderEmails(params: {
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
