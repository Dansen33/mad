import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const zipMap: Map<string, string> = new Map();

function loadZipMap() {
  if (zipMap.size > 0) return zipMap;
  try {
    const candidates = [
      path.join(process.cwd(), "src", "app", "api", "iranyitoszam", "iranyitoszamok.csv"),
      path.join(process.cwd(), "app", "src", "app", "api", "iranyitoszam", "iranyitoszamok.csv"),
      path.join(process.cwd(), "iranyitoszamok.csv"),
    ];
    const filePath = candidates.find((p) => fs.existsSync(p));
    if (!filePath) throw new Error("CSV not found");
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
      const parts = line.split(",");
      if (parts.length < 2) continue;
      const zip = parts[0]?.replace(/"/g, "").trim();
      const city = parts[1]?.replace(/"/g, "").trim();
      if (!zip || !city || Number.isNaN(Number(zip))) continue;
      if (!zipMap.has(zip)) zipMap.set(zip, city);
    }
  } catch (err) {
    console.error("ZIP map load error", err);
  }
  return zipMap;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").replace(/[^0-9]/g, "").trim();
  if (!q) {
    return NextResponse.json({ city: null }, { status: 200 });
  }
  const map = loadZipMap();
  return NextResponse.json({ city: map.get(q) ?? null }, { status: 200 });
}
