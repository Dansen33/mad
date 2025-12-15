import Link from "next/link";

export const dynamic = "force-dynamic";

export default function FizetesHiba() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-16 text-center">
        <div className="rounded-full bg-red-100 p-4 text-3xl">⚠️</div>
        <h1 className="text-3xl font-extrabold">A fizetés megszakadt</h1>
        <p className="text-muted-foreground">
          Nem történt terhelés. Próbáld újra, vagy válassz másik fizetési módot.
        </p>
        <div className="flex gap-3">
          <Link
            href="/penztar"
            className="rounded-full bg-gradient-to-r from-primary to-[#5de7bd] px-4 py-2 text-sm font-bold text-[#0c0f14] shadow-lg shadow-primary/30"
          >
            Vissza a pénztárhoz
          </Link>
          <Link
            href="/laptopok/osszes"
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary"
          >
            Vissza a kínálathoz
          </Link>
        </div>
      </div>
    </div>
  );
}
