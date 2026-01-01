import Link from "next/link";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function RolunkPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProductHeader />

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <section className="space-y-4 rounded-3xl border border-border bg-gradient-to-br from-primary/20 via-[#5de7bd]/15 to-card p-8 shadow-2xl shadow-black/30">
          <h1 className="text-4xl font-extrabold">Rólunk – WELLCOMP</h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            A WELLCOMP azért jött létre, hogy a számítástechnika ne stressz, hanem biztos döntés legyen.
            PC-ket, laptopokat és telefonokat forgalmazunk újonnan és használtan – úgy válogatva,
            mintha magunknak vennénk. 100%-ban online működünk, gyorsan, rugalmasan,
            elegáns, de fiatalos hangnemben.
          </p>
        </section>

        <section className="space-y-3 rounded-3xl border border-border bg-card p-6 shadow-lg shadow-black/20">
          <h2 className="text-2xl font-semibold">Amit képviselünk</h2>
          <p className="text-muted-foreground leading-relaxed">
            Hiszünk abban, hogy egy jól bevizsgált, minőségi használt eszköz sokszor jobb választás, mint egy hasonló árú új.
            A célunk egyszerű: időt, energiát és pénzt spórolni neked, miközben segítünk tudatosan választani.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-semibold">Mit találsz nálunk?</h3>
          <ul className="grid gap-3 md:grid-cols-2">
            {[
              "Gamer PC-k minden árkategóriában",
              "Munkaállomások / workstation gépek komoly feladatokra",
              "Laptopok: gamer, üzleti, általános felhasználásra",
              "Telefonok újonnan és használtan",
            ].map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground shadow-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-lg shadow-black/20">
          <h3 className="text-2xl font-semibold">Miért a WELLCOMP?</h3>
          <ul className="space-y-2 text-foreground">
            {[
              "Ár–érték fókusz: a cél, hogy a pénzed a teljesítményre menjen, ne a marketingre.",
              "Minőség és megbízhatóság: nem csak eladunk, hanem felelősséget vállalunk.",
              "24 hónap limitált garancia használt termékekre is: ez nálunk alap, nem extra.",
              "Gyors ügyintézés: ha valami bonyolultabb, akkor is végigvisszük – nálunk a „nem adjuk fel” tényleg elv.",
            ].map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-border bg-secondary/50 px-4 py-3 text-sm leading-relaxed"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-semibold">Hogyan dolgozunk?</h3>
          <p className="text-muted-foreground leading-relaxed">
            Online vásárlásnál különösen fontos a bizalom. Mi ezért arra törekszünk, hogy a választás átlátható legyen:
            segítünk megtalálni azt a gépet vagy telefont, ami pont a te igényedre jó – ne túl gyenge legyen, de ne is fizess feleslegesen.
          </p>
        </section>

        <section className="space-y-6 rounded-3xl border border-border bg-gradient-to-br from-primary to-[#5de7bd] p-8 shadow-2xl shadow-primary/40">
          <div className="space-y-3">
            <p className="text-2xl font-semibold text-[#0c0f14]">Készen állsz a következő eszközödre?</p>
            <p className="text-[#0c0f14]/80 leading-relaxed">
              Nézz körül a kínálatban, és válaszd ki a számodra legjobb ár–érték arányú megoldást.
            </p>
            <Link
              href="/"
              className="inline-flex w-fit items-center justify-center rounded-full bg-[#0c0f14] px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-black/30 transition hover:brightness-90"
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
