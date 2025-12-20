export const metadata = {
  title: "GYIK | wellcomp",
  description: "Gyakran ismételt kérdések: szállítás, fizetés, garancia, termékállapot.",
};

const faqs = [
  {
    q: "Milyen termékeket forgalmaztok?",
    a: "PC-ket (gamer gépek, munkaállomások, általános), laptopokat (gamer, üzleti, mindennapi) és telefonokat értékesítünk újonnan és használtan.\n• PC-k: gamer / workstation / általános\n• Laptopok: gamer / üzleti / mindennapi\n• Telefonok: új és használt",
  },
  {
    q: "Új és használt termékek is vannak? Mi a különbség köztük nálatok?",
    a: "Igen, mindkettő elérhető. Az új termékek gyári állapotúak, a használtak előélettel rendelkeznek; állapotuk (külső, akkumulátor, tartozékok) eltérhet.\n• A használt eszközök állapota típusonként változhat\n• Ha van állapotbesorolás, azt a termékoldalon kell nézni",
  },
  {
    q: "Mennyi garanciát adtok?",
    a: "Használt termékekre is 24 hónap garanciát vállalunk; a pontos feltételek és kivételek a Garancia oldalon vannak részletezve.\n• 24 hónap limitált garancia használt termékekre is\n• A kivételek és részletek a Garancia oldalon találhatók",
  },
  {
    q: "Mire nem vonatkozik a garancia?",
    a: "A kizárt eseteket a Garancia oldalon soroljuk fel: tipikusan rendeltetésellenes használatból eredő hibák, sérülések vagy fogyó és kopó alkatrészek.\n• A pontos lista a Garancia oldalon olvasható\n• Terméktípustól függően eltérhet",
  },
  {
    q: "Hogyan intézzem a garanciát, ha gond van?",
    a: "Garanciális ügyintézésnél rendelés (számla) azonosító és hiba leírása szükséges; ezt követően egyeztetjük a bevizsgálás és visszaküldés lépéseit.\n• Kelleni fog: rendelés/számla azonosító + hiba leírás\n• A további lépések egyeztetéssel zajlanak (bevétel, bevizsgálás, megoldás)",
  },
  {
    q: "Van-e elállás / visszaküldés?",
    a: "Általában van elállási lehetőség; a pontos feltételek (határidő, állapot, visszaküldés módja) az ÁSZF / Elállás oldalon találhatók.\n• A pontos feltételek az ÁSZF / Elállás információkban vannak\n• Visszaküldésnél fontos lehet a csomagolás és tartozékok megléte",
  },
  {
    q: "Milyen szállítási módok vannak?",
    a: "Kiszállítás futárral vagy csomagpontra történik.\n• Futárszolgálat\n• Csomagpontos átvétel",
  },
  {
    q: "Csak online működtök? Van személyes átvétel?",
    a: "Igen, 100%-ban online működünk; ha lesz személyes átvétel, azt külön jelezzük a weboldalon vagy a rendelési folyamatban.\n• Jelenleg online vásárlás, kiszállítással\n• Személyes átvétel csak akkor, ha külön fel van tüntetve",
  },
  {
    q: "Adtok számlát? Milyen cégformában működtök?",
    a: "Igen, számlát adunk; jelenleg egyéni vállalkozóként (EV) működünk, alanyi adómentes (0%) státuszban.\n• Számla minden vásárlásról\n• EV, alanyi adómentes (0%) működés",
  },
  {
    q: "Mit jelent a „szervizelünk is”?",
    a: "Vállalunk bevizsgálást és javítást is; a pontos lehetőségek (eszköz, hiba, becsült költség) esetenként egyeztethetők.\n• Bevizsgálás és javítás elérhető\n• Részletek rövid hibaleírás alapján",
  },
  {
    q: "A használt eszközök adatmentesítése hogyan történik?",
    a: "Fontos, hogy a korábbi felhasználói adatok ne maradjanak; gyári visszaállítás/újratelepítés és törlési eljárás történik eszköztípustól függően.\n• Telefon: gyári visszaállítás és fiókleválasztás\n• PC/laptop: rendszer-újratelepítés / törlés",
  },
  {
    q: "Milyen állapotban vannak a használt termékek (külső, akkumulátor, kijelző)?",
    a: "Előfordulhatnak esztétikai nyomok és eltérő akkumulátor-állapot; ha van állapotleírás, az a termékoldalon található.\n• Külső állapot készülékenként eltérhet\n• Akkumulátor állapot eszközfüggő (különösen telefon/laptop esetén)",
  },
  {
    q: "Mi jár a termékhez? (töltő, kábelek, doboz, kiegészítők)",
    a: "A tartozékok eszközönként változhatnak; a pontos csomagtartalom a termékoldalon vagy a rendelés visszaigazolásában szerepel.\n• Tartozékok termékfüggőek\n• Csomagtartalom a termékoldal alapján",
  },
  {
    q: "Operációs rendszer / licenc: mi van a PC-ken és laptopokon?",
    a: "Az operációs rendszer és licenc termékenként eltér; érdemes ellenőrizni a termékleírásban, van-e telepített rendszer és milyen licenc.\n• OS megléte termékfüggő\n• Licenc típusa a termékleírásban ellenőrizhető",
  },
  {
    q: "Hogyan válasszak gépet (gamer / munka / általános)?",
    a: "Írd le, mire használod (játékok, felbontás, programok, költségkeret), és segítünk eldönteni, gamer PC, workstation vagy üzleti laptop a megfelelő választás.\n• Használat + költségkeret mint kiinduló pont\n• Játékoknál: felbontás és cél FPS fontos\n• Munkánál: programok és memória/CPU igény számít",
  },
];

import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";

export default function GyikPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProductHeader />
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 pb-16 pt-8">
        <h1 className="text-3xl font-extrabold">Gyakran ismételt kérdések</h1>
        <div className="space-y-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/10"
            >
              <summary className="cursor-pointer text-sm font-semibold text-foreground">
                {item.q}
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
