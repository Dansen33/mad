export const metadata = {
  title: "Tanúsítványok | wellcomp",
  description: "Minőségbiztosítás és tanúsítványok: bevizsgált eszközök, adatvédelmi és biztonsági elvek.",
};

import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";

export default function TanusitvanyokPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProductHeader />
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 pb-16 pt-8">
        <h1 className="text-3xl font-extrabold">Tanúsítványok</h1>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Minden eszköz többkörös diagnosztikán esik át (tároló, memória, akkumulátor állapot,
            hőmérséklet, ventilátor). A biztonsági és adatvédelmi elveket a feldolgozás során
            betartjuk (adatok törlése, szükség esetén felülírás).
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Állapotjelentés az átadáskor (hardver teszt summary)</li>
            <li>Adattörlési eljárás (alapértelmezett: teljes törlés, igény szerint felülírás)</li>
            <li>Garanciajegy és számla a vásárlásról</li>
          </ul>
          <p>
            Igény esetén vállalati szabályzatokhoz igazított dokumentáció is elérhető (pl. adattörlési
            jegyzőkönyv).
          </p>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
