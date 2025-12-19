import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

const fallback = [
  { id: "standard", label: "Standard futár (1-2 munkanap)" },
  { id: "pickup", label: "Személyes átvétel", note: "Ingyenes", priceHuf: 0 },
];

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const query = `*[_type=="shippingMethod"]|order(order asc){
      id,label,note,priceHuf
    }`;
    const methodsRaw = await sanityClient.fetch(query);
    const methods = Array.isArray(methodsRaw)
      ? methodsRaw
          .map((m: { id?: unknown; label?: unknown; note?: unknown; priceHuf?: unknown }) => ({
            id: typeof m?.id === "string" ? m.id : "",
            label: typeof m?.label === "string" ? m.label : "",
            note: typeof m?.note === "string" ? m.note : "",
            priceHuf: Number(m?.priceHuf) || 0,
          }))
          .filter((m) => m.id && m.label && Number.isFinite(m.priceHuf))
      : [];
    return NextResponse.json({ methods: methods.length ? methods : fallback });
  } catch (err) {
    console.error("Sanity shipping fetch error", err);
    return NextResponse.json({ methods: fallback });
  }
}
