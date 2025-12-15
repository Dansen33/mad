import Link from "next/link";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function RolunkPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProductHeader />

      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
        <section className="space-y-4">
          <h1 className="text-4xl font-extrabold">Rólunk – WELLCOMP</h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            A WELLCOMP azért jött létre, hogy a számítástechnika ne stressz, hanem biztos döntés legyen.
            PC-ket, laptopokat és telefonokat forgalmazunk újonnan és használtan – úgy válogatva,
            mintha magunknak vennénk. 100%-ban online működünk, gyorsan, rugalmasan,
            elegáns, de fiatalos hangnemben.
          </p>
        </section>

        <section className="space-y-3 rounded-2xl border border-border bg-secondary/40 p-6">
          <h2 className="text-2xl font-semibold">Amit képviselünk</h2>
          <p className="text-muted-foreground leading-relaxed">
            Hiszünk abban, hogy egy jól bevizsgált, minőségi használt eszköz sokszor jobb választás, mint egy hasonló árú új.
            A célunk egyszerű: időt, energiát és pénzt spórolni neked, miközben segítünk tudatosan választani.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-semibold">Mit találsz nálunk?</h3>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Gamer PC-k minden árkategóriában</li>
            <li>Munkaállomások / workstation gépek komoly feladatokra</li>
            <li>Laptopok: gamer, üzleti, általános felhasználásra</li>
            <li>Telefonok újonnan és használtan</li>
          </ul>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-muted p-6">
          <h3 className="text-2xl font-semibold">Miért a WELLCOMP?</h3>
          <ul className="list-disc space-y-2 pl-5 text-foreground">
            <li>Ár–érték fókusz: a cél, hogy a pénzed a teljesítményre menjen, ne a marketingre.</li>
            <li>Minőség és megbízhatóság: nem csak eladunk, hanem felelősséget vállalunk.</li>
            <li>24 hónap garancia használt termékekre is: ez nálunk alap, nem extra.</li>
            <li>Gyors ügyintézés: igyekszünk a lehető leggyorsabban dolgozni, és ha valami bonyolultabb, akkor is végigvisszük – nálunk a „nem adjuk fel” tényleg elv.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-semibold">Hogyan dolgozunk?</h3>
          <p className="text-muted-foreground leading-relaxed">
            Online vásárlásnál különösen fontos a bizalom. Mi ezért arra törekszünk, hogy a választás átlátható legyen:
            segítünk megtalálni azt a gépet vagy telefont, ami pont a te igényedre jó – ne túl gyenge legyen, de ne is fizess feleslegesen.
          </p>
        </section>

        <section className="space-y-6 border-t border-border pt-6">
          <p className="text-muted-foreground">⸻</p>
          <div className="space-y-3">
            <p className="text-2xl font-semibold">Készen állsz a következő eszközödre?</p>
            <p className="text-muted-foreground leading-relaxed">
              Nézz körül a kínálatban, és válaszd ki a számodra legjobb ár–érték arányú megoldást.
            </p>
            <Link
              href="/"
              className="inline-flex w-fit items-center justify-center rounded-full border border-transparent bg-foreground px-6 py-3 text-lg font-semibold text-background transition hover:bg-primary/80"
            >
              Vásárlás
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}