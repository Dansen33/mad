import { sanityClient } from "./sanity";

type OrderItem = { slug?: string; quantity?: number };

export async function reduceStockForOrder(orderId: string) {
  if (!orderId) return;
  try {
    const order = await sanityClient.fetch(
      `*[_type=="order" && _id==$id][0]{items[]{slug,quantity},stockReduced,status}`,
      { id: orderId },
    );
    if (!order) return;
    if (order.stockReduced === true) {
      console.warn("Stock already reduced, skipping", { orderId });
      return;
    }
    if (order.status && order.status !== "FIZETVE") {
      console.warn("Stock reduce skipped, order not paid", { orderId, status: order.status });
      return;
    }

    const items: OrderItem[] = Array.isArray(order.items) ? order.items : [];
    const qtyBySlug = items.reduce<Record<string, number>>((acc, it) => {
      const slug = typeof it?.slug === "string" ? it.slug : "";
      const qty = Number(it?.quantity) || 0;
      if (!slug || qty <= 0) return acc;
      acc[slug] = (acc[slug] || 0) + qty;
      return acc;
    }, {});

    const slugs = Object.keys(qtyBySlug);
    await Promise.all(
      slugs.map(async (slug) => {
        try {
          const prod = await sanityClient.fetch(
            `*[_type in ["product","pc","phone","console"] && slug.current==$slug][0]{_id,stock}`,
            { slug },
          );
          if (!prod?._id) return;
          const current = Number(prod.stock) || 0;
          const newStock = Math.max(0, current - qtyBySlug[slug]);
          await sanityClient.patch(prod._id).set({ stock: newStock }).commit();
        } catch (err) {
          console.error("Stock reduce failed for", slug, err);
        }
      }),
    );

    await sanityClient.patch(orderId).set({ stockReduced: true }).commit();
  } catch (err) {
    console.error("reduceStockForOrder error", err);
  }
}
