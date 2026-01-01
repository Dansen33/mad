import Link from "next/link";
import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const highlights = [
  {
    title: "24 hónap limitált garancia – használt termékre is",
    desc: "A használt nálunk nem kockázat, hanem tudatos döntés. 2 év limitált garanciát vállalunk, a kivételek pedig mindig átláthatóan a Garancia oldalunkon vannak feltüntetve.",
    bullets: [
      "Garanciális esetek, kivételek egyértelműen dokumentáltak.",
      "Nincs apróbetű – csak tiszta ígéret.",
    ],
  },
  {
    title: "Minőség, amire rá merünk tenni a nevünket",
    desc: "PC-ket, laptopokat és telefonokat válogatva, vizsgálva ajánlunk, hogy ne csak elinduljon, hanem nap mint nap megbízható legyen.",
    bullets: [
      "Jó állapotú - ár–érték arányú készlet.",
      "Olyan eszközök, amelyek hosszú távon is kiszolgálnak.",
    ],
  },
  {
    title: "Segítünk jól választani",
    desc: "A tudatos vásárlást támogatjuk.",
    bullets: [
      "Spórolsz pénzt, mert nem fizetsz túl.",
      "Spórolsz időt, mert a megfelelő eszközt kapod.",
      "Spórolsz energiát – kevesebb felesleges kör.",
    ],
  },
  {
    title: "Gamer gépek, munkaállomások, laptopok – minden szinten",
    desc: "Széles a kínálat, hogy minden igényre tudjunk ajánlani.",
    bullets: [
      "Gamer PC-k minden árkategóriában.",
      "Munkaállomások / workstation komoly feladatokra.",
      "Laptopok: gamer, üzleti, általános.",
      "Telefonok: új és használt.",
    ],
  },
  {
    title: "Szerviz is van – nem engedjük el a kezed",
    desc: "Nem csak adunk, hanem támogatjuk is az eszközeidet: ha kérdés, probléma adódik, nem továbbküldünk, megoldjuk.",
  },
  {
    title: "Hivatalosan, számlával – átlátható működés",
    desc: "Egyéni vállalkozóként működünk, számlát adunk, jelenleg 0%-os alanyi adómentes működésben dolgozunk.",
  },
  {
    title: "Gyors és korrekt ügyintézés",
    desc: "Géped vagy telefonod napi használati eszköz – ezért igyekszünk minél gyorsabban reagálni.",
  },
  {
    title: "Kényelmes kiszállítás: futár és csomagpont",
    desc: "100% online működésünk mellett azt nyújtjuk, amit a legtöbben szeretnek: futár vagy csomagpont.",
    bullets: ["Futárszolgálat gyorsan.", "Csomagpontos átvételi lehetőség."],
  },
];

export default function MiertMiPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProductHeader />

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-10">
        <section className="space-y-4 rounded-3xl border border-border bg-gradient-to-br from-primary/20 via-[#5de7bd]/15 to-card p-8 shadow-2xl shadow-black/30">
          <p className="text-sm uppercase tracking-[0.3em] text-primary/80">Miért a WELLCOMP?</p>
          <h1 className="text-4xl font-extrabold leading-tight text-foreground">
            Biztonságos pénz, biztonságos döntés
          </h1>
          <p className="text-lg text-muted-foreground">
            Az online vásárlásnál az első kérdés mindig ugyanaz: megbízható-e a partner?
            Mi úgy építjük fel a működésünket, hogy ez ne szerencse legyen, hanem rendszer:
            minőség, garancia, átláthatóság, gyors ügyintézés, mindez azért, hogy te nyugodtan dönthess.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-lg shadow-black/25 transition hover:-translate-y-1 hover:border-primary/60"
            >
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">{item.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
              {item.bullets && (
                <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </section>

        <section className="space-y-5 rounded-3xl border border-border bg-gradient-to-br from-primary to-[#5de7bd] p-8 text-center shadow-2xl shadow-primary/40">
          <p className="text-3xl font-semibold text-[#0c0f14]">Válaszd a minőséget</p>
          <p className="text-base text-[#0c0f14]/80">
            Ha olyan helyről szeretnél vásárolni, ahol a minőség, megbízhatóság és garancia nem csak ígéret, hanem alap, akkor a WELLCOMP a jó választás.
          </p>
          <Link
            href="/"
            className="mx-auto inline-flex items-center justify-center rounded-full bg-[#0c0f14] px-8 py-3 text-base font-semibold text-white shadow-lg shadow-black/30 transition hover:brightness-90"
          >
            Vásárlás
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
